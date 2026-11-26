// Step 2: POST /api/auth/verify { email, code } → sets the session cookie.
import { now, newId, json, fail } from "../../_lib/util.js";
import { normEmail, codeHash, createSession, sameOrigin, MAX_CODE_TRIES } from "../../_lib/auth.js";
import { sendEmail, SIGN_OFF } from "../../_lib/email.js";

export async function onRequestPost({ request, env, waitUntil }) {
  if (!sameOrigin(request)) return fail("Forbidden", 403);
  if (!env.DB) return fail("Accounts are temporarily unavailable.", 503);
  let body;
  try { body = await request.json(); } catch { return fail("Please try again."); }
  const email = normEmail(body.email);
  const code = (body.code ?? "").toString().replace(/\D/g, "");
  if (code.length !== 6) return fail("The code has six digits.");

  const t = now();
  const row = await env.DB.prepare(
    "SELECT id, code_hash, tries FROM login_codes WHERE email = ? AND used_at IS NULL AND expires_at > ? ORDER BY created_at DESC LIMIT 1"
  ).bind(email, t).first();
  if (!row) return fail("That code has expired. Please ask for a new one.", 400);
  if (row.tries >= MAX_CODE_TRIES) return fail("Too many tries. Please ask for a new code.", 429);

  if ((await codeHash(env, email, code)) !== row.code_hash) {
    await env.DB.prepare("UPDATE login_codes SET tries = tries + 1 WHERE id = ?").bind(row.id).run();
    const left = MAX_CODE_TRIES - row.tries - 1;
    return fail(left > 0 ? `That code isn't right. ${left} ${left === 1 ? "try" : "tries"} left.` : "Too many tries. Please ask for a new code.", 400);
  }
  await env.DB.prepare("UPDATE login_codes SET used_at = ? WHERE id = ?").bind(t, row.id).run();

  let member = await env.DB.prepare("SELECT * FROM members WHERE email = ?").bind(email).first();
  if (!member) {
    // An artist signing in for the first time.
    const artist = await env.DB.prepare("SELECT name, country FROM artists WHERE lower(email) = ?").bind(email).first();
    if (!artist) return fail("Please ask for a new code.", 400);
    member = { id: newId("m"), status: "waitlist", verified_at: null };
    await env.DB.prepare(
      `INSERT INTO members (id, email, name, country, status, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'waitlist', 'sign-in', ?, ?)`
    ).bind(member.id, email, artist.name, artist.country, t, t).run();
  }

  const firstTime = !member.verified_at;
  await env.DB.prepare(
    "UPDATE members SET verified_at = COALESCE(verified_at, ?), last_seen_at = ?, updated_at = ? WHERE id = ?"
  ).bind(t, t, t, member.id).run();

  // Tell the curator a new custodian is waiting for approval.
  if (firstTime && member.status === "waitlist" && env.NOTIFY_EMAIL) {
    const m = await env.DB.prepare("SELECT name, country, interest FROM members WHERE id = ?").bind(member.id).first();
    waitUntil(sendEmail(env, {
      to: env.NOTIFY_EMAIL,
      reply_to: email,
      subject: `New custodian waiting: ${m.name || email}`,
      text: `${m.name || "Someone"} (${email}) confirmed their email and is waiting on the list.
Country: ${m.country || "not given"}
Starting from: ${m.interest || "not given"}

Approve or pause them at https://silkroute.art/admin/members

${SIGN_OFF}`,
    }).catch((e) => console.error("Notify failed", e)));
  }

  const cookie = await createSession(env, member.id);
  return json({ ok: true, next: "/account" }, 200, { "set-cookie": cookie });
}

export function onRequest() {
  return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
}

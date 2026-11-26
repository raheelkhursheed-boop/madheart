// Step 1 of joining or signing in: POST /api/auth/start (JSON)
//   { mode: "join", email, name?, country?, interest?, updates?: bool, website?: honeypot }
//   { mode: "signin", email }
// Sends a six-digit code by email. Joining creates a waitlist account if none exists.
// Signing in never reveals whether an account exists: an unknown address gets an email inviting it to join.
import { now, newId, json, fail, text, EMAIL } from "../../_lib/util.js";
import { normEmail, newCode, codeHash, sameOrigin, CODE_MINUTES, MAX_CODES_PER_HOUR } from "../../_lib/auth.js";
import { sendEmail, canSendEmail, SIGN_OFF } from "../../_lib/email.js";

const INTERESTS = ["first-work", "a-few", "collector"];

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return fail("Forbidden", 403);
  if (!env.DB) return fail("Accounts are temporarily unavailable.", 503);
  if (!canSendEmail(env, request)) return fail("Sign-in by email isn't switched on yet. Please try again soon.", 503);

  let body;
  try { body = await request.json(); } catch { return fail("Please try again."); }
  const mode = body.mode === "signin" ? "signin" : "join";
  const email = normEmail(body.email);
  if (!EMAIL.test(email)) return fail("Please enter a valid email address.");
  // Honeypot: real people leave it empty. Answer as if all went well.
  if (text(body.website)) return json({ ok: true, email });

  const t = now();
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM login_codes WHERE email = ? AND created_at > ?"
  ).bind(email, new Date(Date.now() - 3600e3).toISOString()).first();
  if (recent.n >= MAX_CODES_PER_HOUR) return fail("Too many codes for this address. Please wait an hour and try again.", 429);

  let member = await env.DB.prepare("SELECT id, status FROM members WHERE email = ?").bind(email).first();
  const artist = await env.DB.prepare("SELECT id FROM artists WHERE lower(email) = ?").bind(email).first();

  if (!member && mode === "join") {
    const interest = INTERESTS.includes(body.interest) ? body.interest : null;
    member = { id: newId("m"), status: "waitlist" };
    await env.DB.prepare(
      `INSERT INTO members (id, email, name, country, interest, status, updates_ok, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'waitlist', ?, 'join', ?, ?)`
    ).bind(member.id, email, text(body.name, 120), text(body.country, 80), interest, body.updates ? 1 : 0, t, t).run();
  }

  // An artist who has submitted work may sign in before having an account; create it on verify.
  if (!member && !artist) {
    await sendEmail(env, {
      to: email,
      subject: "Signing in to SilkRoute",
      text: `Hello,

Someone asked to sign in to SilkRoute with this address, but there is no account for it yet.

To join, visit https://silkroute.art/join
If this wasn't you, you can ignore this email.

${SIGN_OFF}`,
    });
    return json({ ok: true, email });
  }

  const code = newCode();
  await env.DB.prepare("INSERT INTO login_codes (email, code_hash, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(email, await codeHash(env, email, code), t, new Date(Date.now() + CODE_MINUTES * 60e3).toISOString()).run();

  const sent = await sendEmail(env, {
    to: email,
    subject: `Your SilkRoute code: ${code}`,
    text: `Hello,

Your code for SilkRoute is ${code}

It works for ${CODE_MINUTES} minutes. If you didn't ask for it, you can ignore this email.

${SIGN_OFF}`,
  });
  if (!sent) return fail("We couldn't send the email just now. Please try again in a minute.", 502);
  return json({ ok: true, email });
}

export function onRequest() {
  return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
}

// Approve, pause or annotate an account: POST /admin/api/members/:id { status?, admin_note? }
// Approving sends the custodian a short email saying the gallery is open to them.
import { now, json, fail, text, logEvent } from "../../../_lib/util.js";
import { sendEmail, SIGN_OFF } from "../../../_lib/email.js";

const STATUSES = ["waitlist", "approved", "paused"];

export async function onRequestPost({ params, request, env, data, waitUntil }) {
  const id = String(params.id || "");
  const m = await env.DB.prepare("SELECT * FROM members WHERE id = ?").bind(id).first();
  if (!m) return fail("No such account.", 404);
  let b;
  try { b = await request.json(); } catch { return fail("Bad request"); }

  const t = now();
  const status = STATUSES.includes(b.status) ? b.status : m.status;
  const note = "admin_note" in b ? text(b.admin_note, 2000) : m.admin_note;
  const approvedNow = status === "approved" && m.status !== "approved";
  await env.DB.prepare(
    "UPDATE members SET status = ?, admin_note = ?, approved_at = CASE WHEN ? THEN ? ELSE approved_at END, updated_at = ? WHERE id = ?"
  ).bind(status, note, approvedNow ? 1 : 0, t, t, id).run();
  if (status !== m.status) {
    await logEvent(env.DB, null, `member:${status}`, { member: id, email: m.email }, data.user?.email);
    // Paused accounts are signed out everywhere.
    if (status === "paused") await env.DB.prepare("DELETE FROM sessions WHERE member_id = ?").bind(id).run();
  }

  if (approvedNow && b.notify !== false) {
    waitUntil(sendEmail(env, {
      to: m.email,
      subject: "Your place on the Journey is ready",
      text: `${m.name ? `Dear ${m.name},` : "Hello,"}

Your SilkRoute account is now open. Sign in with this email address to see the gallery:
https://silkroute.art/signin

${SIGN_OFF}`,
    }).catch((e) => console.error("Approval email failed", e)));
  }
  return json({ ok: true, status });
}

// Accounts for the curator: GET /admin/api/members?status=waitlist
import { json } from "../../_lib/util.js";

const STATUSES = ["waitlist", "approved", "paused"];

export async function onRequestGet({ request, env }) {
  const status = new URL(request.url).searchParams.get("status");
  const where = STATUSES.includes(status) ? "WHERE m.status = ?" : "";
  const stmt = env.DB.prepare(
    `SELECT m.id, m.email, m.name, m.country, m.interest, m.status, m.updates_ok, m.source, m.admin_note,
            m.created_at, m.verified_at, m.approved_at, m.last_seen_at,
            (SELECT 1 FROM artists a WHERE lower(a.email) = m.email) AS is_artist
     FROM members m ${where} ORDER BY m.created_at DESC LIMIT 2000`
  );
  const members = (await (where ? stmt.bind(status) : stmt).all()).results;
  const counts = Object.fromEntries(
    (await env.DB.prepare("SELECT status, COUNT(*) AS n FROM members GROUP BY status").all()).results.map((r) => [r.status, r.n])
  );
  return json({ members, counts });
}

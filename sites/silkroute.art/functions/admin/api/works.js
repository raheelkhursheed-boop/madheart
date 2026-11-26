// The curator's list: GET /admin/api/works?status=submitted
import { json, STATUSES } from "../../_lib/util.js";

export async function onRequestGet({ request, env }) {
  const status = new URL(request.url).searchParams.get("status");
  const where = STATUSES.includes(status) ? "WHERE w.status = ?" : "";
  const stmt = env.DB.prepare(
    `SELECT w.id, w.title, w.year, w.medium, w.status, w.asking_price_usd, w.price_usd, w.created_at, w.updated_at,
            a.name AS artist_name, a.city AS artist_city, a.country AS artist_country,
            (SELECT p.id FROM photos p WHERE p.work_id = w.id ORDER BY p.position LIMIT 1) AS cover_id,
            (SELECT COUNT(*) FROM photos p WHERE p.work_id = w.id) AS photo_count
     FROM works w JOIN artists a ON a.id = w.artist_id ${where}
     ORDER BY w.updated_at DESC LIMIT 500`
  );
  const works = (await (where ? stmt.bind(status) : stmt).all()).results;
  const counts = Object.fromEntries(
    (await env.DB.prepare("SELECT status, COUNT(*) AS n FROM works GROUP BY status").all()).results.map((r) => [r.status, r.n])
  );
  return json({ works, counts });
}

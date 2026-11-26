// The private gallery: GET /api/gallery. Approved custodians only.
import { json, fail } from "../_lib/util.js";
import { currentMember } from "../_lib/auth.js";

export async function onRequestGet({ request, env }) {
  const m = await currentMember(request, env);
  if (!m) return fail("Not signed in", 401);
  if (m.status !== "approved") return fail("The gallery opens to you once your place is confirmed.", 403);
  const works = (await env.DB.prepare(
    `SELECT w.id, w.title, w.year, w.medium, w.height_cm, w.width_cm, w.depth_cm, w.framed, w.description,
            w.price_usd, w.ship_india_usd, w.ship_intl_usd, w.status,
            a.name AS artist_name, a.city AS artist_city, a.country AS artist_country,
            (SELECT p.id FROM photos p WHERE p.work_id = w.id ORDER BY p.position LIMIT 1) AS cover_id
     FROM works w JOIN artists a ON a.id = w.artist_id
     WHERE w.status IN ('published','held','sold','shipped','delivered')
     ORDER BY w.sort, w.published_at DESC LIMIT 300`
  ).all()).results;
  return json({
    works: works.map(({ cover_id, status, ...w }) => ({
      ...w,
      available: status === "published",
      cover: cover_id ? `/media/${cover_id}` : null,
    })),
  }, 200, { "cache-control": "private, no-store" });
}

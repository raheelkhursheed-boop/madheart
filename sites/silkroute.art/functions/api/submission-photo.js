// An artist's own photo, for their status page: GET /api/submission-photo?t=<token>&id=<photo id>
import { text } from "../_lib/util.js";
import { photoResponse } from "../_lib/photos.js";

export async function onRequestGet({ request, env }) {
  const q = new URL(request.url).searchParams;
  const token = text(q.get("t"), 64), id = text(q.get("id"), 64);
  if (!env.DB || !token || !id) return new Response("Not found", { status: 404 });
  const row = await env.DB.prepare(
    `SELECT p.content_type FROM photos p JOIN works w ON w.id = p.work_id JOIN artists a ON a.id = w.artist_id
     WHERE p.id = ? AND a.token = ?`
  ).bind(id, token).first();
  if (!row) return new Response("Not found", { status: 404 });
  return (await photoResponse(env, id, row.content_type, "private, max-age=3600")) || new Response("Not found", { status: 404 });
}

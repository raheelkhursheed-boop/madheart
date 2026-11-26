// Any photo, for the curator.
import { photoResponse } from "../../../_lib/photos.js";

export async function onRequestGet({ params, env }) {
  const id = String(params.id || "");
  const row = env.DB && (await env.DB.prepare("SELECT content_type FROM photos WHERE id = ?").bind(id).first());
  if (!row) return new Response("Not found", { status: 404 });
  return (await photoResponse(env, id, row.content_type, "private, max-age=3600")) || new Response("Not found", { status: 404 });
}

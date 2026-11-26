// Public artwork photos, only for works that are on (or have been on) the gallery.
import { photoResponse } from "../_lib/photos.js";

const PUBLIC = ["published", "held", "sold", "shipped", "delivered"];

export async function onRequestGet({ params, env }) {
  const id = String(params.id || "");
  if (!env.DB || !/^ph_[a-f0-9]{16}$/.test(id)) return new Response("Not found", { status: 404 });
  const row = await env.DB.prepare(
    "SELECT p.content_type, w.status FROM photos p JOIN works w ON w.id = p.work_id WHERE p.id = ?"
  ).bind(id).first();
  if (!row || !PUBLIC.includes(row.status)) return new Response("Not found", { status: 404 });
  return (await photoResponse(env, id, row.content_type, "public, max-age=86400")) || new Response("Not found", { status: 404 });
}

// An artist's private status page data: GET /api/submission?t=<token>
import { json, fail, text, STATUS_FOR_ARTIST } from "../_lib/util.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return fail("Temporarily unavailable.", 503);
  const token = text(new URL(request.url).searchParams.get("t"), 64);
  if (!token) return fail("Missing link.", 400);
  const artist = await env.DB.prepare(
    "SELECT id, name, city, country, website, instagram, bio, created_at FROM artists WHERE token = ?"
  ).bind(token).first();
  if (!artist) return fail("That link is not valid.", 404);

  const works = (await env.DB.prepare(
    `SELECT id, title, year, medium, height_cm, width_cm, depth_cm, framed, description, asking_price_usd, price_usd,
            status, note_to_artist, created_at, updated_at FROM works WHERE artist_id = ? ORDER BY created_at DESC`
  ).bind(artist.id).all()).results;
  const photos = (await env.DB.prepare(
    `SELECT p.id, p.work_id FROM photos p JOIN works w ON w.id = p.work_id WHERE w.artist_id = ? ORDER BY p.position`
  ).bind(artist.id).all()).results;

  const { id, ...publicArtist } = artist;
  return json({
    artist: publicArtist,
    works: works.map((w) => ({
      ...w,
      status_label: STATUS_FOR_ARTIST[w.status] || w.status,
      editable: ["submitted", "changes_requested"].includes(w.status),
      // The curator's note is shown only when it asks for something.
      note_to_artist: ["changes_requested", "declined"].includes(w.status) ? w.note_to_artist : null,
      photos: photos.filter((p) => p.work_id === w.id).map((p) => ({ id: p.id, url: `/api/submission-photo?t=${token}&id=${p.id}` })),
    })),
  });
}

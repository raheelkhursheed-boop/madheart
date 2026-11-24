// One work, for the curator. GET returns it; POST { action, ...fields } changes it.
import { json, fail, now, text, int, num, logEvent } from "../../../_lib/util.js";

// Which actions are allowed from which status, and where they lead.
const MOVES = {
  approve: { from: ["submitted", "changes_requested"], to: "approved" },
  request_changes: { from: ["submitted", "approved"], to: "changes_requested" },
  decline: { from: ["submitted", "changes_requested", "approved"], to: "declined" },
  publish: { from: ["approved"], to: "published" },
  unpublish: { from: ["published"], to: "approved" },
  reopen: { from: ["declined"], to: "submitted" },
};

async function load(db, id) {
  const work = await db.prepare("SELECT * FROM works WHERE id = ?").bind(id).first();
  if (!work) return null;
  const artist = await db.prepare(
    "SELECT id, name, email, city, country, website, instagram, bio, created_at FROM artists WHERE id = ?"
  ).bind(work.artist_id).first();
  const photos = (await db.prepare("SELECT id, content_type, bytes, position FROM photos WHERE work_id = ? ORDER BY position").bind(id).all()).results;
  const events = (await db.prepare("SELECT action, detail, actor, at FROM events WHERE work_id = ? ORDER BY id DESC LIMIT 50").bind(id).all()).results;
  const others = (await db.prepare("SELECT id, title, status FROM works WHERE artist_id = ? AND id != ? ORDER BY created_at DESC").bind(work.artist_id, id).all()).results;
  return { work, artist, photos, events, others };
}

export async function onRequestGet({ params, env }) {
  const data = await load(env.DB, String(params.id));
  return data ? json(data) : fail("Not found", 404);
}

export async function onRequestPost({ params, request, env, data: ctx }) {
  const id = String(params.id);
  const db = env.DB;
  const work = await db.prepare("SELECT * FROM works WHERE id = ?").bind(id).first();
  if (!work) return fail("Not found", 404);
  let body;
  try { body = await request.json(); } catch { return fail("Bad request"); }
  const action = String(body.action || "save");
  const at = now();

  // Fields the curator can edit at any time. Missing keys keep their current value.
  const has = (k) => Object.prototype.hasOwnProperty.call(body, k);
  const f = {
    title: has("title") ? text(body.title, 160) || work.title : work.title,
    year: has("year") ? int(body.year, 1900, 2100) : work.year,
    medium: has("medium") ? text(body.medium, 160) : work.medium,
    height_cm: has("height_cm") ? num(body.height_cm, 0, 2000) : work.height_cm,
    width_cm: has("width_cm") ? num(body.width_cm, 0, 2000) : work.width_cm,
    depth_cm: has("depth_cm") ? num(body.depth_cm, 0, 2000) : work.depth_cm,
    framed: has("framed") ? (body.framed ? 1 : 0) : work.framed,
    description: has("description") ? text(body.description, 3000) : work.description,
    price_usd: has("price_usd") ? int(body.price_usd, 1, 10_000_000) : work.price_usd,
    ship_india_usd: has("ship_india_usd") ? int(body.ship_india_usd, 0, 100_000) : work.ship_india_usd,
    ship_intl_usd: has("ship_intl_usd") ? int(body.ship_intl_usd, 0, 100_000) : work.ship_intl_usd,
    note_to_artist: has("note_to_artist") ? text(body.note_to_artist, 2000) : work.note_to_artist,
    admin_note: has("admin_note") ? text(body.admin_note, 3000) : work.admin_note,
    sort: has("sort") ? int(body.sort, -100000, 100000) ?? 0 : work.sort,
  };

  let status = work.status;
  if (action !== "save") {
    const move = MOVES[action];
    if (!move) return fail("Unknown action");
    if (!move.from.includes(work.status)) return fail(`Can't ${action.replace("_", " ")} a work that is ${work.status.replace("_", " ")}.`, 409);
    if (action === "approve" || action === "publish") {
      if (!f.price_usd) return fail("Set the gallery price first.");
      if (f.ship_india_usd == null || f.ship_intl_usd == null) return fail("Set both shipping prices first (0 is fine).");
    }
    if (action === "request_changes" && !f.note_to_artist) return fail("Write a note to the artist saying what to change.");
    status = move.to;
  }

  await db.prepare(
    `UPDATE works SET title=?, year=?, medium=?, height_cm=?, width_cm=?, depth_cm=?, framed=?, description=?, price_usd=?,
       ship_india_usd=?, ship_intl_usd=?, note_to_artist=?, admin_note=?, sort=?, status=?, updated_at=?,
       reviewed_at = CASE WHEN ? IN ('approved','changes_requested','declined') THEN ? ELSE reviewed_at END,
       published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, ?) ELSE published_at END
     WHERE id=?`
  ).bind(f.title, f.year, f.medium, f.height_cm, f.width_cm, f.depth_cm, f.framed, f.description, f.price_usd,
         f.ship_india_usd, f.ship_intl_usd, f.note_to_artist, f.admin_note, f.sort, status, at,
         status, at, status, at, id).run();
  await logEvent(db, id, action, action === "save" ? null : { from: work.status, to: status }, ctx.user?.email);

  return json(await load(db, id));
}

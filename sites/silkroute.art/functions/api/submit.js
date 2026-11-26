// Artist submissions: a profile plus one or more works with photos (multipart form).
// New artists get a private status link (token). Returning artists use their link to add
// works or to revise a work the curator sent back.
import { now, newId, newToken, json, fail, text, int, num, EMAIL, logEvent } from "../_lib/util.js";
import { putPhoto, PHOTO_TYPES, MAX_PHOTO_BYTES, MAX_PHOTOS_PER_WORK } from "../_lib/photos.js";

const MAX_WORKS = 5;
const EDITABLE = ["submitted", "changes_requested"];

function readWork(data, i) {
  const g = (f) => data.get(`works[${i}][${f}]`);
  return {
    title: text(g("title"), 160),
    year: int(g("year"), 1900, 2100),
    medium: text(g("medium"), 160),
    height_cm: num(g("height_cm"), 0, 2000),
    width_cm: num(g("width_cm"), 0, 2000),
    depth_cm: num(g("depth_cm"), 0, 2000),
    framed: g("framed") === "yes" ? 1 : 0,
    description: text(g("description"), 3000),
    asking_price_usd: int(g("price"), 1, 10_000_000),
    human_made: g("human_made") === "yes" ? 1 : 0,
    files: data.getAll(`works[${i}][photos]`).filter((f) => f && typeof f === "object" && f.size > 0),
    keep: (g("keep_photos") || "").toString().split(",").map((s) => s.trim()).filter(Boolean),
  };
}

function checkWork(w, n, existingCount = 0) {
  const where = `Work ${n}`;
  if (!w.title) return `${where}: please add a title.`;
  if (!w.asking_price_usd) return `${where}: please add your price in US dollars.`;
  if (!w.human_made) return `${where}: please confirm the work is made by you, without generative AI.`;
  const total = existingCount + w.files.length;
  if (total < 1) return `${where}: please add at least one photo.`;
  if (total > MAX_PHOTOS_PER_WORK) return `${where}: up to ${MAX_PHOTOS_PER_WORK} photos, please.`;
  for (const f of w.files) {
    if (!PHOTO_TYPES.includes(f.type)) return `${where}: photos must be JPEG, PNG or WebP.`;
    if (f.size > MAX_PHOTO_BYTES) return `${where}: each photo must be under 12 MB.`;
  }
  return null;
}

async function storePhotos(env, workId, files, startAt) {
  const rows = [];
  for (let i = 0; i < files.length; i++) {
    const id = newId("ph");
    const bytes = await putPhoto(env, id, files[i]);
    rows.push({ id, work_id: workId, content_type: files[i].type, bytes, position: startAt + i });
  }
  return rows;
}

const photoInsert = (db, p, at) =>
  db.prepare("INSERT INTO photos (id, work_id, content_type, bytes, position, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(p.id, p.work_id, p.content_type, p.bytes, p.position, at);

export async function onRequestPost({ request, env }) {
  if (!env.DB || !(env.PHOTOS || env.PHOTOS_R2)) return fail("Submissions are temporarily unavailable. Please try again shortly.", 503);
  let data;
  try { data = await request.formData(); } catch { return fail("We couldn't read that submission. Please try again."); }

  // Honeypot: people leave it empty; bots fill it. Pretend success.
  if (text(data.get("company-website"))) return json({ ok: true });

  const db = env.DB;
  const at = now();
  const token = text(data.get("token"), 64);
  const workId = text(data.get("work_id"), 64);

  // 1. Who is submitting
  let artist = null;
  let merged = false;
  if (token) {
    artist = await db.prepare("SELECT * FROM artists WHERE token = ?").bind(token).first();
    if (!artist) return fail("That private link is not valid. Please use the link from your first submission.", 403);
  }

  const profile = {
    name: text(data.get("name"), 120),
    email: (text(data.get("email"), 254) || "").toLowerCase() || null,
    city: text(data.get("city"), 120),
    country: text(data.get("country"), 120),
    website: text(data.get("website"), 300),
    instagram: text(data.get("instagram"), 120),
    bio: text(data.get("bio"), 3000),
  };

  if (!artist) {
    if (!profile.name) return fail("Please add your name.");
    if (!profile.email || !EMAIL.test(profile.email)) return fail("Please add a valid email address.");
    if (!profile.bio) return fail("Please tell us a little about your practice.");
    if (data.get("consent") !== "yes") return fail("Please agree to the submission terms.");
  }

  // 2. Revising one work the curator sent back
  if (workId) {
    if (!artist) return fail("Please use your private link to revise a work.", 403);
    const work = await db.prepare("SELECT * FROM works WHERE id = ? AND artist_id = ?").bind(workId, artist.id).first();
    if (!work) return fail("We couldn't find that work.", 404);
    if (!EDITABLE.includes(work.status)) return fail("This work has already been reviewed and can't be changed here.", 409);
    const w = readWork(data, 0);
    const current = (await db.prepare("SELECT id FROM photos WHERE work_id = ?").bind(workId).all()).results.map((r) => r.id);
    const keep = w.keep.filter((id) => current.includes(id));
    const err = checkWork(w, 1, keep.length);
    if (err) return fail(err);
    const added = await storePhotos(env, workId, w.files, keep.length);
    const drop = current.filter((id) => !keep.includes(id));
    const stmts = [
      db.prepare(`UPDATE works SET title=?, year=?, medium=?, height_cm=?, width_cm=?, depth_cm=?, framed=?, description=?,
                  asking_price_usd=?, human_made=?, status='submitted', updated_at=? WHERE id=?`)
        .bind(w.title, w.year, w.medium, w.height_cm, w.width_cm, w.depth_cm, w.framed, w.description,
              w.asking_price_usd, w.human_made, at, workId),
      ...keep.map((id, i) => db.prepare("UPDATE photos SET position = ? WHERE id = ?").bind(i, id)),
      ...added.map((p) => photoInsert(db, p, at)),
      ...drop.map((id) => db.prepare("DELETE FROM photos WHERE id = ?").bind(id)),
    ];
    await db.batch(stmts);
    // Removed photos stay in storage for the record; the database no longer points to them.
    await logEvent(db, workId, "resubmitted", { photos_added: added.length, photos_removed: drop.length }, artist.email);
    return json({ ok: true, revised: true, status_url: `/submission?t=${artist.token}` });
  }

  // 3. New works
  const count = Math.min(int(data.get("work_count"), 1, MAX_WORKS) || 1, MAX_WORKS);
  const works = [];
  for (let i = 0; i < count; i++) {
    const w = readWork(data, i);
    if (!w.title && !w.files.length && !w.asking_price_usd) continue; // an empty, unused block
    const err = checkWork(w, i + 1);
    if (err) return fail(err);
    works.push(w);
  }
  if (!works.length) return fail("Please add at least one work.");

  const stmts = [];
  if (!artist) {
    const existing = await db.prepare("SELECT * FROM artists WHERE email = ?").bind(profile.email).first();
    if (existing) {
      // Same email as an earlier submission: attach the works, but don't change the profile
      // or reveal that artist's private link to whoever is submitting.
      artist = existing;
      merged = true;
    } else {
      artist = { id: newId("ar"), token: newToken(), ...profile };
      stmts.push(
        db.prepare(`INSERT INTO artists (id, email, name, city, country, website, instagram, bio, token, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(artist.id, profile.email, profile.name, profile.city, profile.country, profile.website,
                profile.instagram, profile.bio, artist.token, at, at)
      );
    }
  } else if (profile.name || profile.bio) {
    // The artist's own link: allow profile updates for fields they sent.
    stmts.push(
      db.prepare(`UPDATE artists SET name=COALESCE(?, name), city=COALESCE(?, city), country=COALESCE(?, country),
                  website=COALESCE(?, website), instagram=COALESCE(?, instagram), bio=COALESCE(?, bio), updated_at=? WHERE id=?`)
        .bind(profile.name, profile.city, profile.country, profile.website, profile.instagram, profile.bio, at, artist.id)
    );
  }

  const ids = [];
  for (const w of works) {
    const id = newId("wk");
    ids.push(id);
    const photos = await storePhotos(env, id, w.files, 0);
    stmts.push(
      db.prepare(`INSERT INTO works (id, artist_id, title, year, medium, height_cm, width_cm, depth_cm, framed, description,
                  asking_price_usd, human_made, status, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, ?)`)
        .bind(id, artist.id, w.title, w.year, w.medium, w.height_cm, w.width_cm, w.depth_cm, w.framed, w.description,
              w.asking_price_usd, w.human_made, at, at),
      ...photos.map((p) => photoInsert(db, p, at))
    );
  }
  await db.batch(stmts);
  for (const id of ids) await logEvent(db, id, "submitted", null, profile.email || artist.email);

  if (merged) return json({ ok: true, merged: true, works: ids.length });
  return json({ ok: true, works: ids.length, status_url: `/submission?t=${artist.token}` });
}

export function onRequest() {
  return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
}

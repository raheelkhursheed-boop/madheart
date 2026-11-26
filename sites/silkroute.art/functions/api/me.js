// The signed-in account. GET /api/me → { member, artist } (401 when signed out)
// POST /api/me { name?, country?, interest?, updates? } updates the profile.
import { now, json, fail, text } from "../_lib/util.js";
import { currentMember, sameOrigin, STATUS_FOR_MEMBER } from "../_lib/auth.js";

const INTERESTS = ["first-work", "a-few", "collector"];

async function view(env, m) {
  const artist = await env.DB.prepare("SELECT name, token FROM artists WHERE lower(email) = ?").bind(m.email).first();
  let works = [];
  if (artist) {
    works = (await env.DB.prepare(
      "SELECT w.status, COUNT(*) AS n FROM works w JOIN artists a ON a.id = w.artist_id WHERE a.token = ? GROUP BY w.status"
    ).bind(artist.token).all()).results;
  }
  return {
    member: {
      email: m.email, name: m.name, country: m.country, interest: m.interest, updates: Boolean(m.updates_ok),
      status: m.status, status_label: STATUS_FOR_MEMBER[m.status] || m.status, since: m.created_at, approved_at: m.approved_at,
    },
    artist: artist ? { name: artist.name, link: `/submission?t=${artist.token}`, submit: `/submit?t=${artist.token}`, works } : null,
  };
}

export async function onRequestGet({ request, env }) {
  const m = await currentMember(request, env);
  if (!m) return fail("Not signed in", 401);
  return json(await view(env, m));
}

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return fail("Forbidden", 403);
  const m = await currentMember(request, env);
  if (!m) return fail("Not signed in", 401);
  let b;
  try { b = await request.json(); } catch { return fail("Please try again."); }
  await env.DB.prepare(
    "UPDATE members SET name = ?, country = ?, interest = ?, updates_ok = ?, updated_at = ? WHERE id = ?"
  ).bind(text(b.name, 120), text(b.country, 80), INTERESTS.includes(b.interest) ? b.interest : null, b.updates ? 1 : 0, now(), m.id).run();
  const fresh = await env.DB.prepare("SELECT * FROM members WHERE id = ?").bind(m.id).first();
  return json(await view(env, fresh));
}

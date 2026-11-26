// POST /admin/api/members/import: copies custodian sign-ups from the old waitlist (KV SIGNUPS,
// keys "collectors:…") into accounts on the waitlist. Safe to run more than once; existing emails are skipped.
// The KV entries are left in place.
import { now, newId, json, fail, EMAIL } from "../../../_lib/util.js";

const INTERESTS = ["first-work", "a-few", "collector"];

export async function onRequestPost({ env }) {
  if (!env.SIGNUPS) return fail("The waitlist store isn't connected.", 503);
  let cursor, added = 0, skipped = 0, seen = 0;
  do {
    const page = await env.SIGNUPS.list({ prefix: "collectors:", cursor });
    for (const k of page.keys) {
      seen++;
      const e = await env.SIGNUPS.get(k.name, "json").catch(() => null);
      const email = (e?.email || "").toLowerCase().trim();
      if (!EMAIL.test(email)) { skipped++; continue; }
      const t = now();
      const r = await env.DB.prepare(
        `INSERT OR IGNORE INTO members (id, email, country, interest, status, updates_ok, source, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'waitlist', ?, 'waitlist-import', ?, ?)`
      ).bind(newId("m"), email, e.country || null, INTERESTS.includes(e.interest) ? e.interest : null,
             e.consent === "yes" ? 1 : 0, e.submitted_at || t, t).run();
      if (r.meta.changes) added++; else skipped++;
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return json({ ok: true, seen, added, skipped });
}

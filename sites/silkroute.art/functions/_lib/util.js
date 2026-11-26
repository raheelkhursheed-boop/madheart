// Shared helpers for silkroute.art Functions. No route handlers live here.

export const now = () => new Date().toISOString();
export const newId = (prefix) => `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
export const newToken = () =>
  [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, "0")).join("");

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

export const fail = (message, status = 400) => json({ error: message }, status);

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Trimmed text or null, cut to max characters.
export const text = (v, max = 300) => {
  const s = (v ?? "").toString().trim();
  return s ? s.slice(0, max) : null;
};

// Whole number within [min, max], or null.
export const int = (v, min = 0, max = 10_000_000) => {
  const s = (v ?? "").toString().replace(/[,\s$]/g, "");
  if (s === "") return null;
  const n = Math.round(Number(s));
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

export const num = (v, min = 0, max = 10_000) => {
  const s = (v ?? "").toString().trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= min && n <= max ? Math.round(n * 10) / 10 : null;
};

export const STATUSES = [
  "submitted", "changes_requested", "approved", "published", "declined", "held", "sold", "shipped", "delivered",
];

// Words shown to artists for each status.
export const STATUS_FOR_ARTIST = {
  submitted: "With the curator",
  changes_requested: "Changes requested",
  approved: "Accepted",
  published: "On the gallery",
  declined: "Not selected this time",
  held: "On the gallery",
  sold: "Sold",
  shipped: "Sold · shipped",
  delivered: "Sold · delivered",
};

export async function logEvent(db, workId, action, detail, actor) {
  await db
    .prepare("INSERT INTO events (work_id, action, detail, actor, at) VALUES (?, ?, ?, ?, ?)")
    .bind(workId, action, detail ? JSON.stringify(detail) : null, actor || null, now())
    .run();
}

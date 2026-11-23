// Sign-ups for silkroute.art (Cloudflare Pages Function).
// Stores each submission in the KV namespace bound as SIGNUPS, then sends the visitor to /thanks.html.
// Binding configured in Cloudflare: SIGNUPS -> silkroute-signups.
const FORMS = {
  artists: ["name", "email", "city", "portfolio", "practice", "consent"],
  collectors: ["email", "country", "interest", "consent"],
};

export async function onRequestPost({ request, env }) {
  const back = (path) => Response.redirect(new URL(path, request.url).toString(), 303);
  let data;
  try { data = await request.formData(); } catch { return back("/"); }

  // Honeypot: real people leave this empty.
  if ((data.get("company-website") || "").toString().trim()) return back("/thanks.html");

  const form = (data.get("form-name") || "").toString();
  const fields = FORMS[form];
  const email = (data.get("email") || "").toString().trim().slice(0, 254);
  if (!fields || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return back("/#" + (form === "artists" ? "artists" : "collectors"));

  const entry = { form, submitted_at: new Date().toISOString() };
  for (const f of fields) entry[f] = (data.get(f) || "").toString().slice(0, f === "practice" ? 1500 : 300);
  entry.email = email;

  if (!env.SIGNUPS) return new Response("Sign-ups are temporarily unavailable. Please try again shortly.", { status: 503 });
  const key = `${form}:${entry.submitted_at}:${crypto.randomUUID().slice(0, 8)}`;
  await env.SIGNUPS.put(key, JSON.stringify(entry));
  return back(form === "artists" ? "/thanks.html?for=artists" : "/thanks.html");
}

export function onRequest() {
  return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
}

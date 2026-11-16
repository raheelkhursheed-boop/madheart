// Waitlist sign-ups for secondresponder.ai (Cloudflare Pages Function).
// Stores each submission in the KV namespace bound as WAITLIST, then sends the visitor to /thanks.html.
const FORMS = {
  volunteers: ["email", "country", "help-type", "consent"],
  organizations: ["email", "country", "org-type", "offer-type", "consent"],
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
  if (!fields || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return back("/#" + (form === "organizations" ? "organizations" : "volunteer"));

  const entry = { form, submitted_at: new Date().toISOString() };
  for (const f of fields) entry[f] = (data.get(f) || "").toString().slice(0, 200);
  entry.email = email;

  if (!env.WAITLIST) return new Response("Sign-ups are temporarily unavailable. Please try again shortly.", { status: 503 });
  const key = `${form}:${entry.submitted_at}:${crypto.randomUUID().slice(0, 8)}`;
  await env.WAITLIST.put(key, JSON.stringify(entry));
  return back("/thanks.html");
}

export function onRequest() {
  return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
}

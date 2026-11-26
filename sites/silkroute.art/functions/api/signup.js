// Sign-ups for silkroute.art (Cloudflare Pages Function).
// Stores each submission in the KV namespace bound as SIGNUPS, then sends the visitor to /thanks.html.
// Binding configured in Cloudflare: SIGNUPS -> silkroute-signups.
//
// Emails (sent through Resend after the visitor has been redirected, so a mail problem never loses a sign-up):
//   - a notification to NOTIFY_EMAIL with the form details
//   - a short thank-you to the person who signed up
// Set in Cloudflare Pages → silkroute-art → Settings → Variables and Secrets:
//   RESEND_API_KEY (secret), NOTIFY_EMAIL (secret, the inbox that gets notifications).
// If either is missing, sign-ups are still saved and no email is sent.
const FORMS = {
  artists: ["name", "email", "city", "portfolio", "practice", "consent"],
  collectors: ["email", "country", "interest", "consent"],
};

const FROM = "SilkRoute <hello@silkroute.art>";

const THANKS = {
  artists: {
    subject: "Thank you for joining the Silk Route",
    text: (e) => `${e.name ? `Dear ${e.name},` : "Hello,"}

Thank you for sharing your work with SilkRoute. We read every submission ourselves, and we will write to you if your practice is a fit for an upcoming selection.

From Srinagar to the World,
SilkRoute
https://silkroute.art`,
  },
  collectors: {
    subject: "You're on the SilkRoute waitlist",
    text: () => `Hello,

Thank you for joining the SilkRoute waitlist. We will write to you when the collection opens.

From Srinagar to the World,
SilkRoute
https://silkroute.art`,
  },
};

async function sendEmail(env, message) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, ...message }),
  });
  if (!res.ok) console.error("Resend error", res.status, await res.text());
}

async function sendEmails(env, entry) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) return;
  const label = entry.form === "artists" ? "artist" : "collector";
  const details = Object.entries(entry).map(([k, v]) => `${k}: ${v}`).join("\n");
  const thanks = THANKS[entry.form];
  await Promise.allSettled([
    sendEmail(env, {
      to: env.NOTIFY_EMAIL,
      reply_to: entry.email,
      subject: `New ${label} sign-up: ${entry.name || entry.email}`,
      text: `A new ${label} signed up on silkroute.art.\n\n${details}`,
    }),
    sendEmail(env, { to: entry.email, subject: thanks.subject, text: thanks.text(entry) }),
  ]);
}

export async function onRequestPost({ request, env, waitUntil }) {
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
  for (const f of fields) entry[f] = (data.get(f) || "").toString().replace(/[\r\n]+/g, f === "practice" ? "\n" : " ").slice(0, f === "practice" ? 1500 : 300);
  entry.email = email;

  if (!env.SIGNUPS) return new Response("Sign-ups are temporarily unavailable. Please try again shortly.", { status: 503 });
  const key = `${form}:${entry.submitted_at}:${crypto.randomUUID().slice(0, 8)}`;
  await env.SIGNUPS.put(key, JSON.stringify(entry));
  waitUntil(sendEmails(env, entry).catch((e) => console.error("Email failed", e)));
  return back(form === "artists" ? "/thanks.html?for=artists" : "/thanks.html");
}

export function onRequest() {
  return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
}

// Sends plain-text email through Resend. Needs the Pages secret RESEND_API_KEY.
// Local development: without a key on localhost, the message is printed to the console instead.
export const FROM = "SilkRoute <hello@silkroute.art>";

export const canSendEmail = (env, request) =>
  Boolean(env.RESEND_API_KEY) || (request && isLocal(request));

export const isLocal = (request) => ["localhost", "127.0.0.1"].includes(new URL(request.url).hostname);

export async function sendEmail(env, message) {
  if (!env.RESEND_API_KEY) {
    console.log(`[email not sent: no RESEND_API_KEY]\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}`);
    return true;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, ...message }),
  });
  if (!res.ok) console.error("Resend error", res.status, await res.text());
  return res.ok;
}

export const SIGN_OFF = `From Srinagar to the World,
SilkRoute
https://silkroute.art`;

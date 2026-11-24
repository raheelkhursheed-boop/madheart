// Everything under /admin (pages and API) requires a valid Cloudflare Access login.
import { verifyAccess } from "../_lib/access.js";

const LOCKED = `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Admin locked · silkroute.art</title>
<body style="font:17px/1.6 system-ui,sans-serif;background:#F7F4EE;color:#1D1B18;max-width:560px;margin:15vh auto;padding:0 20px">
<h1 style="font:400 34px Georgia,serif">The admin page is locked</h1>
<p>It opens only through a Cloudflare Access login. If you run silkroute.art, sign in through the Access login page; if this keeps appearing, Access isn't set up for this address yet.</p></body>`;

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Local development only: wrangler pages dev on localhost with ADMIN_DEV_EMAIL set.
  const local = ["localhost", "127.0.0.1"].includes(url.hostname) && env.ADMIN_DEV_EMAIL;
  const user = local ? { email: env.ADMIN_DEV_EMAIL } : await verifyAccess(request, env);

  if (!user) {
    if (url.pathname.startsWith("/admin/api/")) {
      return new Response(JSON.stringify({ error: "Not signed in" }), { status: 401, headers: { "content-type": "application/json" } });
    }
    return new Response(LOCKED, { status: 401, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }

  // Writes must come from the admin page itself.
  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    if (!origin || origin !== url.origin) return new Response("Forbidden", { status: 403 });
  }

  context.data.user = user;
  const res = await context.next();
  const out = new Response(res.body, res);
  out.headers.set("cache-control", "no-store");
  out.headers.set("x-robots-tag", "noindex, nofollow");
  return out;
}

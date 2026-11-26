// Keeps server source and configuration from being served as static files.
// Runs only on the paths listed in /_routes.json, so ordinary pages stay static.
export async function onRequest({ request, next }) {
  const path = new URL(request.url).pathname;
  if (path.startsWith("/functions/") || path === "/wrangler.toml" || path === "/_routes.json") {
    return new Response("Not found", { status: 404 });
  }
  return next();
}

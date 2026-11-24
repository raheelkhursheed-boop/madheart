// Verifies the Cloudflare Access token that Access adds to every request it lets through.
// Fails closed: without ACCESS_TEAM_DOMAIN, nobody gets in.

let certsCache = { at: 0, keys: [] };

const b64urlToBytes = (s) => {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "="));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};
const b64urlJson = (s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

async function getKeys(team) {
  if (Date.now() - certsCache.at < 10 * 60 * 1000 && certsCache.keys.length) return certsCache.keys;
  const res = await fetch(`${team}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error("Could not fetch Access certificates");
  const { keys } = await res.json();
  certsCache = { at: Date.now(), keys: keys || [] };
  return certsCache.keys;
}

// Returns { email } for a valid token, or null.
export async function verifyAccess(request, env) {
  const team = (env.ACCESS_TEAM_DOMAIN || "").replace(/\/+$/, "");
  if (!team) return null;
  const token =
    request.headers.get("cf-access-jwt-assertion") ||
    (request.headers.get("cookie") || "").match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const header = b64urlJson(parts[0]);
    const payload = b64urlJson(parts[1]);
    if (header.alg !== "RS256") return null;
    const jwk = (await getKeys(team)).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5", key, b64urlToBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );
    if (!ok) return null;
    const t = Math.floor(Date.now() / 1000);
    if (payload.iss !== team) return null;
    if (payload.exp && payload.exp < t) return null;
    if (payload.nbf && payload.nbf > t + 60) return null;
    const auds = (env.ACCESS_AUD || "").split(",").map((s) => s.trim()).filter(Boolean);
    const tokenAud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (auds.length && !tokenAud.some((a) => auds.includes(a))) return null;
    return { email: payload.email || payload.common_name || "access-user" };
  } catch {
    return null;
  }
}

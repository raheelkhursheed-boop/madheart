// POST /api/auth/signout
import { json, fail } from "../../_lib/util.js";
import { endSession, clearCookie, sameOrigin } from "../../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return fail("Forbidden", 403);
  if (env.DB) await endSession(request, env);
  return json({ ok: true }, 200, { "set-cookie": clearCookie() });
}

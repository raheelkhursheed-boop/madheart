// Accounts for silkroute.art: passwordless sign-in with a six-digit code sent by email,
// and a session cookie whose hash is stored in D1 (table sessions).
import { now } from "./util.js";

export const COOKIE = "sr_session";
export const SESSION_DAYS = 30;
export const CODE_MINUTES = 10;
export const MAX_CODE_TRIES = 5;
export const MAX_CODES_PER_HOUR = 5;

export const normEmail = (e) => (e ?? "").toString().trim().toLowerCase().slice(0, 254);

export async function sha256(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Six digits, uniform, from the CSPRNG.
export function newCode() {
  const max = 4_294_000_000; // largest multiple of 1e6 below 2^32, to avoid bias
  let n;
  do n = crypto.getRandomValues(new Uint32Array(1))[0]; while (n >= max);
  return String(n % 1_000_000).padStart(6, "0");
}

export const codeHash = (env, email, code) => sha256(`code:${email}:${code}:${env.AUTH_SECRET || ""}`);

const randomToken = () =>
  [...crypto.getRandomValues(new Uint8Array(32))].map((b) => b.toString(16).padStart(2, "0")).join("");

export function readCookie(request, name = COOKIE) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

export async function createSession(env, memberId) {
  const token = randomToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  await env.DB.prepare("INSERT INTO sessions (id, member_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(await sha256(token), memberId, now(), expires).run();
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}

export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

// The signed-in member, or null.
export async function currentMember(request, env) {
  const token = readCookie(request);
  if (!token || !/^[a-f0-9]{64}$/.test(token) || !env.DB) return null;
  const row = await env.DB.prepare(
    `SELECT m.*, s.id AS session_id FROM sessions s JOIN members m ON m.id = s.member_id
     WHERE s.id = ? AND s.expires_at > ?`
  ).bind(await sha256(token), now()).first();
  return row || null;
}

export async function endSession(request, env) {
  const token = readCookie(request);
  if (token && /^[a-f0-9]{64}$/.test(token)) {
    await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(await sha256(token)).run();
  }
}

// Writes must come from silkroute.art's own pages.
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  return Boolean(origin) && origin === new URL(request.url).origin;
}

export const STATUS_FOR_MEMBER = {
  waitlist: "On the waitlist",
  approved: "Welcome in",
  paused: "Paused",
};

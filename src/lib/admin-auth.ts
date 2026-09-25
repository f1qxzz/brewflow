import { NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "crypto";
import { signed, verifySigned } from "@/lib/sign";

const g = globalThis as unknown as {
  _revoked?: Set<string>;
  _attempts?: Map<string, { count: number; time: number }>;
  _whSeen?: Set<string>;
};
if (!g._revoked) {
  g._revoked = new Set();
  g._attempts = new Map();
  g._whSeen = new Set();
}
// ponytail: rate-limit tetap in-memory (per-instance) — global limit butuh Redis, skip selama belum perlu
const revoked = g._revoked!;
const attempts = g._attempts!;
export const webhookSeen = g._whSeen!;
const SESSION_TTL = 8 * 60 * 60 * 1000;

// ponytail: token = signed(exp) — stateless, gak ilang pas pindah instance serverless
export function createSession(): string {
  return signed(Date.now() + SESSION_TTL);
}

export function getSession(token: string): boolean {
  if (revoked.has(token)) return false;
  const exp = Number(token.split(".")[0]);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return verifySigned(token, String(exp));
}

export function revokeSession(token: string): boolean {
  // ponytail: denylist in-memory — logout lintas-instance baru efektif kalau pakai store global
  revoked.add(token);
  return true;
}

export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  // ponytail: entry terakhir — proxy biasanya append IP asli di belakang; entry pertama bisa dipalsukan klien (bypass rate limit)
  const last = xff.split(",").pop()?.trim();
  return last || req.headers.get("x-real-ip") || "local";
}

export function parseId(s: string): number | null {
  const n = Number(s);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export function requireAdmin(req: Request): Response | null {
  const token = req.headers.get("x-admin-token");
  if (!token || !getSession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function checkRateLimit(req: Request, max = 5, windowMs = 60_000): Response | null {
  return rateLimitKey(clientKey(req), max, windowMs);
}

export function rateLimitKey(key: string, max = 5, windowMs = 60_000): Response | null {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.time > windowMs) {
    attempts.set(key, { count: 1, time: now });
    return null;
  }
  if (entry.count >= max) {
    return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 });
  }
  entry.count++;
  return null;
}

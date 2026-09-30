import { NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
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
// ponytail: rate-limit endpoint publik (orders/feedback) tetap in-memory per-instance — abuse-only.
// verify-pin pakai rateLimitGuard (tabel Guard, lintas-instance) karena itu jalur brute-force.
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

// denylist lintas-instance: row `rev:<token>` di tabel Guard, berlaku sampai expiry token
async function isRevoked(token: string): Promise<boolean> {
  if (revoked.has(token)) return true;
  try {
    const row = await prisma.guard.findUnique({ where: { key: `rev:${token}` } });
    if (!row) return false;
    if (row.resetAt && row.resetAt.getTime() < Date.now()) {
      await prisma.guard.delete({ where: { key: `rev:${token}` } }).catch(() => {});
      return false;
    }
    return true;
  } catch {
    // ponytail: DB mati → fail-open, auth tetap HMAC+exp gated; denylist cuma hardening tambahan
    return false;
  }
}

export async function revokeSession(token: string): Promise<void> {
  revoked.add(token);
  const exp = Number(token.split(".")[0]);
  if (!Number.isFinite(exp)) return;
  try {
    await prisma.guard.upsert({
      where: { key: `rev:${token}` },
      create: { key: `rev:${token}`, resetAt: new Date(exp) },
      update: { resetAt: new Date(exp) },
    });
  } catch {
    // ponytail: denylist lokal tetap jalan walau tulis DB gagal
  }
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

export async function requireAdmin(req: Request): Promise<Response | null> {
  const token = req.headers.get("x-admin-token");
  if (!token || !getSession(token) || (await isRevoked(token))) {
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

// rate limit lintas-instance buat verify-pin: tabel Guard (`rl:pin:<ip>`)
export async function rateLimitGuard(req: Request, max = 5, windowMs = 60_000): Promise<Response | null> {
  const key = `rl:pin:${clientKey(req)}`;
  try {
    const row = await prisma.guard.findUnique({ where: { key } });
    const now = Date.now();
    if (!row || (row.resetAt && row.resetAt.getTime() < now)) {
      await prisma.guard.upsert({
        where: { key },
        create: { key, count: 1, resetAt: new Date(now + windowMs) },
        update: { count: 1, resetAt: new Date(now + windowMs) },
      });
      return null;
    }
    if (row.count >= max) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 });
    }
    await prisma.guard.update({ where: { key }, data: { count: row.count + 1 } });
    return null;
  } catch {
    // ponytail: DB mati → fallback in-memory per-instance
    return rateLimitKey(clientKey(req), max, windowMs);
  }
  // ponytail: read-then-write gak atomic — race bisa nembus beberapa attempt ekstra;
  // cukup buat nahan brute-force (limit 5/menit/IP), upgrade ke atomic increment kalau pernah kena
}

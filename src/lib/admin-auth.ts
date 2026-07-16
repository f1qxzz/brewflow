import { NextResponse } from "next/server";

const g = globalThis as unknown as { _sessions?: Map<string, number>; _attempts?: Map<string, { count: number; time: number }> };
if (!g._sessions) { g._sessions = new Map(); g._attempts = new Map(); }
const sessions = g._sessions!;
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 jam
const attempts = g._attempts!;

export function createSession(): string {
  const token = crypto.randomUUID();
  sessions.set(token, Date.now() + SESSION_TTL);
  return token;
}

export function getSession(token: string): boolean {
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function requireAdmin(req: Request): Response | null {
  const token = req.headers.get("x-admin-token");
  if (!token || !getSession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function checkRateLimit(req: Request): Response | null {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.time > 60_000) {
    attempts.set(ip, { count: 1, time: now });
    return null;
  }
  if (entry.count >= 5) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba 1 menit lagi." }, { status: 429 });
  }
  entry.count++;
  return null;
}

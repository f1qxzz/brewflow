import { createHmac, timingSafeEqual } from "crypto";

// ponytail: key = ADMIN_PIN, putar PIN = semua token mati (session + orderToken)
function key(): string {
  return process.env.ADMIN_PIN || "brewflow";
}

function mac(v: string): string {
  return createHmac("sha256", key()).update(v).digest("hex");
}

export function signed(v: string | number): string {
  const s = String(v);
  return `${s}.${mac(s).slice(0, 40)}`;
}

export function verifySigned(token: string | null | undefined, v: string | number): boolean {
  if (!token) return false;
  const s = String(v);
  const dot = token.indexOf(".");
  if (dot < 1 || token.slice(0, dot) !== s) return false;
  const got = Buffer.from(token.slice(dot + 1));
  const want = Buffer.from(mac(s).slice(0, 40));
  return got.length === want.length && timingSafeEqual(got, want);
}

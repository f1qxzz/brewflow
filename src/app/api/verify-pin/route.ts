import { NextResponse } from "next/server";
import { createSession, checkRateLimit } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const rate = checkRateLimit(req);
  if (rate) return rate;

  const { pin } = await req.json();
  const valid = process.env.ADMIN_PIN || "f1qxzz";
  if (pin === valid) {
    const token = createSession();
    return NextResponse.json({ ok: true, token });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}

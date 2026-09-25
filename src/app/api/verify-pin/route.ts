import { NextResponse } from "next/server";
import { createSession, checkRateLimit, safeEqual } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const rate = checkRateLimit(req, 5, 60_000);
  if (rate) return rate;

  const valid = process.env.ADMIN_PIN;
  if (!valid) {
    return NextResponse.json({ error: "Server belum dikonfigurasi" }, { status: 503 });
  }

  let pin = "";
  try {
    const body = await req.json();
    pin = typeof body?.pin === "string" ? body.pin : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (pin && pin.length <= 64 && safeEqual(pin, valid)) {
    const token = createSession();
    return NextResponse.json({ ok: true, token });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}

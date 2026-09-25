import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin, rateLimitKey, clientKey } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const rl = rateLimitKey("fb:" + clientKey(req), 10, 60_000);
  if (rl) return rl;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const r = Math.max(1, Math.min(5, Math.floor(Number(body?.rating) || 5)));
  const fb = await prisma.feedback.create({
    data: {
      customerName: String(body?.customerName || "").trim().slice(0, 100),
      rating: r,
      message: String(body?.message || "").slice(0, 1000),
    },
  });
  return NextResponse.json(fb);
}

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(feedback);
}

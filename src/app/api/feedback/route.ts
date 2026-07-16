import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { customerName, rating, message } = await req.json();
  const r = Math.max(1, Math.min(5, Math.floor(Number(rating) || 5)));
  const fb = await prisma.feedback.create({
    data: { customerName: String(customerName || "").slice(0, 100), rating: r, message: String(message || "").slice(0, 1000) },
  });
  return NextResponse.json(fb);
}

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(feedback);
}

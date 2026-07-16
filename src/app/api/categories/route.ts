import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const body = await req.json();
  const cat = await prisma.category.create({
    data: { name: body.name, slug: body.slug, order: body.order ?? 0 },
  });
  return NextResponse.json(cat, { status: 201 });
}

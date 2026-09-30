import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = String(body?.name ?? "").trim().slice(0, 100);
  const slug = String(body?.slug ?? "").trim().slice(0, 100);
  if (!name || !slug) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

  try {
    const cat = await prisma.category.create({
      data: { name, slug, order: Math.trunc(Number(body?.order)) || 0 },
    });
    return NextResponse.json(cat, { status: 201 });
  } catch (e) {
    if (String((e as { code?: string })?.code ?? "").startsWith("P2"))
      return NextResponse.json({ error: "Slug sudah dipakai" }, { status: 400 });
    throw e;
  }
}

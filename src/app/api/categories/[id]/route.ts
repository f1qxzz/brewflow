import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin, parseId } from "@/lib/admin-auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;
  const numId = parseId(id);
  if (!numId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  const body = await req.json();
  const cat = await prisma.category.update({
    where: { id: numId },
    data: { name: body.name, slug: body.slug, order: body.order },
  });
  return NextResponse.json(cat);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;
  const numId = parseId(id);
  if (!numId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  await prisma.menuItem.deleteMany({ where: { categoryId: numId } });
  await prisma.category.delete({ where: { id: numId } });
  return NextResponse.json({ ok: true });
}

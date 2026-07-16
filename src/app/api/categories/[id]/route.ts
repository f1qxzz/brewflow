import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;
  const body = await req.json();
  const cat = await prisma.category.update({
    where: { id: Number(id) },
    data: { name: body.name, slug: body.slug, order: body.order },
  });
  return NextResponse.json(cat);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;
  await prisma.menuItem.deleteMany({ where: { categoryId: Number(id) } });
  await prisma.category.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}

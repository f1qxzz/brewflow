import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin, parseId } from "@/lib/admin-auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;
  const numId = parseId(id);
  if (!numId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  const body = await req.json();
  const item = await prisma.menuItem.update({
    where: { id: numId },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image,
      categoryId: body.categoryId,
      available: body.available,
      order: body.order,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;
  const numericId = parseId(id);
  if (!numericId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  await prisma.orderItem.deleteMany({ where: { menuItemId: numericId } });
  await prisma.menuItem.delete({ where: { id: numericId } });
  return NextResponse.json({ ok: true });
}

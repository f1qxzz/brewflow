import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin, parseId } from "@/lib/admin-auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;
  const numId = parseId(id);
  if (!numId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = String(body?.name ?? "").trim().slice(0, 100);
  const price = Math.trunc(Number(body?.price));
  const categoryId = Math.trunc(Number(body?.categoryId));
  if (!name || !Number.isFinite(price) || price < 0 || !Number.isFinite(categoryId) || categoryId < 1)
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

  try {
    const item = await prisma.menuItem.update({
      where: { id: numId },
      data: {
        name,
        description: String(body?.description ?? "").slice(0, 500),
        price,
        image: String(body?.image ?? "").slice(0, 500),
        categoryId,
        available: body?.available !== false,
        order: Math.trunc(Number(body?.order)) || 0,
      },
    });
    return NextResponse.json(item);
  } catch (e) {
    if (String((e as { code?: string })?.code ?? "").startsWith("P2"))
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    throw e;
  }
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

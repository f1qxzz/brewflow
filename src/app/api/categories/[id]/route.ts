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
  const slug = String(body?.slug ?? "").trim().slice(0, 100);
  if (!name || !slug) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

  try {
    const cat = await prisma.category.update({
      where: { id: numId },
      data: {
        name,
        slug,
        order: body?.order === undefined ? undefined : Math.trunc(Number(body.order)) || 0,
      },
    });
    return NextResponse.json(cat);
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
  const numId = parseId(id);
  if (!numId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  await prisma.menuItem.deleteMany({ where: { categoryId: numId } });
  await prisma.category.delete({ where: { id: numId } });
  return NextResponse.json({ ok: true });
}

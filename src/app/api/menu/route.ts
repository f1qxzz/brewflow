import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  if (all) {
    const auth = await requireAdmin(req);
    if (auth) return auth;
  }

  const menu = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        where: all ? {} : { available: true },
        orderBy: { order: "asc" },
      },
    },
  });
  return NextResponse.json(menu);
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = String(body?.name ?? "").trim().slice(0, 100);
  const price = Math.trunc(Number(body?.price));
  const categoryId = Math.trunc(Number(body?.categoryId));
  if (!name || !Number.isFinite(price) || price < 0 || !Number.isFinite(categoryId) || categoryId < 1)
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });

  try {
    const item = await prisma.menuItem.create({
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
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    if (String((e as { code?: string })?.code ?? "").startsWith("P2"))
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    throw e;
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  if (all) {
    const auth = requireAdmin(req);
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
  const auth = requireAdmin(req);
  if (auth) return auth;

  const body = await req.json();
  const item = await prisma.menuItem.create({
    data: {
      name: body.name,
      description: body.description || "",
      price: body.price,
      image: body.image || "",
      categoryId: body.categoryId,
      available: body.available ?? true,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}

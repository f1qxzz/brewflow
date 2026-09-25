import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseId } from "@/lib/admin-auth";

export async function GET(_req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const numId = parseId(orderId);
  if (!numId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  const order = await prisma.order.findUnique({
    where: { id: numId },
    select: {
      id: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      paidAt: true,
      total: true,
    },
  });
  if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  return NextResponse.json(order);
}

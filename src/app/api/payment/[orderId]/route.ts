import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    select: {
      id: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      paymentTrxId: true,
      paidAt: true,
      total: true,
      tableNumber: true,
    },
  });
  if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  return NextResponse.json(order);
}

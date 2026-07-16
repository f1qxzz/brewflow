import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { orderId } = await params;
  const numId = Number(orderId);

  const existing = await prisma.order.findUnique({ where: { id: numId } });
  if (!existing) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  if (existing.paymentStatus === "paid") {
    return NextResponse.json({ error: "Order sudah dibayar", order: existing }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: numId },
    data: {
      paymentStatus: "paid",
      paidAt: new Date(),
      status: existing.status === "cancelled" ? existing.status : "processed",
    },
  });

  return NextResponse.json({ ok: true, order: updated });
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseId, requireAdmin } from "@/lib/admin-auth";
import { verifySigned } from "@/lib/sign";

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const numId = parseId(orderId);
  if (!numId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  // ponytail: sama kayak /api/orders/[id] — admin ATAU orderToken valid, cek sebelum query
  const isAdmin = (await requireAdmin(req)) === null;
  if (!isAdmin) {
    const url = new URL(req.url);
    const tok = req.headers.get("x-order-token") || url.searchParams.get("t");
    if (!verifySigned(tok, String(numId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

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

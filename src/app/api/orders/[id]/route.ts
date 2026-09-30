import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin, parseId } from "@/lib/admin-auth";
import { verifySigned } from "@/lib/sign";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseId(id);
  if (!numId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  const isAdmin = !(await requireAdmin(req));

  if (!isAdmin) {
    // ponytail: wajib orderToken sebelum query — ID sekuensial gak bisa di-enum; 401 sebelum 404 (no existence oracle)
    const url = new URL(req.url);
    const tok = req.headers.get("x-order-token") || url.searchParams.get("t");
    if (!verifySigned(tok, String(numId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (isAdmin) {
    const order = await prisma.order.findUnique({
      where: { id: numId },
      include: { items: { include: { menuItem: true } } },
    });
    if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    return NextResponse.json(order);
  }

  // ponytail: unauth poll for customer status tracker — strip PII, no items
  const order = await prisma.order.findUnique({
    where: { id: numId },
    select: { id: true, status: true, paymentStatus: true, paymentMethod: true, total: true },
  });
  if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  return NextResponse.json(order);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;
  const numId = parseId(id);
  if (!numId) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  await prisma.orderItem.deleteMany({ where: { orderId: numId } });
  await prisma.order.delete({ where: { id: numId } });
  return NextResponse.json({ ok: true });
}

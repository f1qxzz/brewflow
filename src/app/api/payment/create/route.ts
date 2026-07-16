import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createPaymentSession, getMethodMeta, type PaymentMethod } from "@/lib/payment";
import { isMidtransConfigured, createSnapTransaction } from "@/lib/midtrans";

export async function POST(req: Request) {
  const { orderId, method } = await req.json();
  if (!orderId || !method) {
    return NextResponse.json({ error: "orderId dan method wajib diisi" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: Number(orderId) } });
  if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  if (order.paymentStatus === "paid") {
    return NextResponse.json({ error: "Order sudah dibayar" }, { status: 400 });
  }

  if (method === "cash") {
    const updated = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { paymentMethod: "cash", paymentStatus: "unpaid", paymentTrxId: "" },
    });
    return NextResponse.json({ method: "cash", status: updated.paymentStatus });
  }

  // Midtrans real payment
  if (isMidtransConfigured()) {
    try {
      const meta = getMethodMeta(method as PaymentMethod);
      const fee = meta.fee + Math.round(order.total * (meta.feePercent / 100));
      const totalWithFee = order.total + fee;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.headers.get("origin") || "http://localhost:3456"}`;
      const snap = await createSnapTransaction({
        orderId: Number(orderId),
        amount: totalWithFee,
        method,
        customerName: order.customerName,
        finishUrl: `${baseUrl}/payment/${orderId}?status=finish`,
      });

      await prisma.order.update({
        where: { id: Number(orderId) },
        data: {
          paymentMethod: method,
          paymentStatus: "unpaid",
          paymentTrxId: snap.token,
        },
      });

      return NextResponse.json({
        method: getMethodMeta(method as PaymentMethod),
        snap,
        order: {
          id: order.id,
          status: order.status,
          paymentMethod: method,
          paymentStatus: "unpaid",
          total: order.total,
        },
        isMidtrans: true,
      });
    } catch (e: any) {
      console.error("Midtrans error:", e);
      return NextResponse.json({ error: "Gagal memproses pembayaran: " + (e.message || "unknown") }, { status: 500 });
    }
  }

  // Mock payment (fallback)
  const session = await createPaymentSession({
    orderId: Number(orderId),
    amount: order.total,
    method: method as PaymentMethod,
  });

  const updated = await prisma.order.update({
    where: { id: Number(orderId) },
    data: {
      paymentMethod: method,
      paymentStatus: "unpaid",
      paymentTrxId: session.trxId,
    },
  });

  return NextResponse.json({
    session,
    method: getMethodMeta(method as PaymentMethod),
    order: updated,
    isMidtrans: false,
  });
}

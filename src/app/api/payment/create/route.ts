import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createPaymentSession, getMethodMeta, PAYMENT_METHODS, type PaymentMethod } from "@/lib/payment";
import { isMidtransConfigured, createSnapTransaction } from "@/lib/midtrans";
import { rateLimitKey, clientKey } from "@/lib/admin-auth";
import { verifySigned } from "@/lib/sign";

const VALID_METHODS = new Set(PAYMENT_METHODS.map((m) => m.id));

export async function POST(req: Request) {
  const rl = rateLimitKey("pc:" + clientKey(req), 30, 60_000);
  if (rl) return rl;

  let orderId: number;
  let method: string;
  let orderToken = "";
  try {
    const body = await req.json();
    orderId = Number(body?.orderId);
    method = String(body?.method || "");
    orderToken = String(body?.orderToken || "");
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!orderId || !VALID_METHODS.has(method as PaymentMethod)) {
    return NextResponse.json({ error: "orderId dan method wajib diisi" }, { status: 400 });
  }
  // tanpa token order yang valid, siapa pun bisa regenerasi session payment order orang lain
  if (!verifySigned(orderToken, orderId)) {
    return NextResponse.json({ error: "Token pembayaran tidak valid" }, { status: 403 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  if (order.paymentStatus === "paid") {
    return NextResponse.json({ error: "Order sudah dibayar" }, { status: 400 });
  }
  if (order.paymentMethod !== method) {
    return NextResponse.json({ error: "Metode pembayaran tidak sesuai pesanan" }, { status: 403 });
  }

  if (method === "cash") {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { paymentMethod: "cash", paymentStatus: "unpaid", paymentTrxId: "" },
    });
    return NextResponse.json({ method: "cash", status: updated.paymentStatus });
  }

  if (isMidtransConfigured()) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        return NextResponse.json({ error: "Server belum dikonfigurasi" }, { status: 503 });
      }
      const meta = getMethodMeta(method as PaymentMethod);
      const fee = meta.fee + Math.round(order.total * (meta.feePercent / 100));
      const totalWithFee = order.total + fee;
      const snap = await createSnapTransaction({
        orderId,
        amount: totalWithFee,
        method,
        customerName: order.customerName,
        finishUrl: `${baseUrl}/payment/${orderId}?status=finish`,
      });

      await prisma.order.update({
        where: { id: orderId },
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
    } catch {
      return NextResponse.json({ error: "Gagal memproses pembayaran" }, { status: 500 });
    }
  }

  const session = await createPaymentSession({
    orderId,
    amount: order.total,
    method: method as PaymentMethod,
  });

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentMethod: method,
      paymentStatus: "unpaid",
      paymentTrxId: session.trxId,
    },
  });

  return NextResponse.json({
    session,
    method: getMethodMeta(method as PaymentMethod),
    order: {
      id: updated.id,
      status: updated.status,
      paymentMethod: updated.paymentMethod,
      paymentStatus: updated.paymentStatus,
      total: updated.total,
    },
    isMidtrans: false,
  });
}

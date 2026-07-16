import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { parsePaymentStatus } from "@/lib/midtrans";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook received:", JSON.stringify(body));

    const { order_id, transaction_status, fraud_status, status_code, gross_amount, transaction_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: "order_id required" }, { status: 400 });
    }

    const sk = process.env.MIDTRANS_SERVER_KEY;
    if (sk) {
      const signature = req.headers.get("x-midtrans-signature") || "";
      const expected = createHash("sha512").update(order_id + status_code + gross_amount + sk).digest("hex");
      if (signature !== expected) {
        console.warn("Webhook signature mismatch: got", signature, "expected", expected);
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
    }

    // Parse actual order ID from BRW-{orderId}-{timestamp}
    let actualOrderId: number | null = null;
    if (order_id.startsWith("BRW-")) {
      actualOrderId = parseInt(order_id.split("-")[1], 10);
    } else {
      actualOrderId = parseInt(order_id, 10);
    }

    if (!actualOrderId || isNaN(actualOrderId)) {
      return NextResponse.json({ error: "Invalid order_id" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: actualOrderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const paymentStatus = parsePaymentStatus(transaction_status, fraud_status);

    await prisma.order.update({
      where: { id: actualOrderId },
      data: {
        paymentStatus,
        paymentTrxId: transaction_id || order.paymentTrxId,
        paidAt: paymentStatus === "paid" ? new Date() : order.paidAt,
        status: paymentStatus === "paid" && order.status === "pending" ? "processed" : order.status,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { parsePaymentStatus } from "@/lib/midtrans";
import { webhookSeen, rateLimitKey } from "@/lib/admin-auth";

function sigEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ba.length !== bb.length || ba.length === 0) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const rl = rateLimitKey("wh:" + (req.headers.get("x-forwarded-for") || "local"), 30, 60_000);
    if (rl) return rl;

    const sk = process.env.MIDTRANS_SERVER_KEY;
    if (!sk) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
      transaction_id,
      notification_id,
    } = body;

    if (!order_id || !transaction_status) {
      return NextResponse.json({ error: "order_id required" }, { status: 400 });
    }

    const signature = req.headers.get("x-midtrans-signature") || "";
    const expected = createHash("sha512")
      .update(String(order_id) + String(status_code ?? "") + String(gross_amount ?? "") + sk)
      .digest("hex");
    if (!sigEqual(signature, expected)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const notifKey = notification_id
      ? String(notification_id)
      : `${order_id}:${transaction_status}:${transaction_id ?? ""}`;
    if (webhookSeen.has(notifKey)) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    if (webhookSeen.size > 5000) webhookSeen.clear();
    webhookSeen.add(notifKey);

    let actualOrderId: number | null = null;
    if (String(order_id).startsWith("BRW-")) {
      actualOrderId = parseInt(String(order_id).split("-")[1], 10);
    } else {
      actualOrderId = parseInt(String(order_id), 10);
    }
    if (!actualOrderId || isNaN(actualOrderId)) {
      return NextResponse.json({ error: "Invalid order_id" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: actualOrderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const paidAmount = Number(gross_amount);
    if (!Number.isFinite(paidAmount) || paidAmount < order.total) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    const paymentStatus = parsePaymentStatus(transaction_status, fraud_status);
    if (order.paymentStatus === "paid" && paymentStatus !== "paid") {
      return NextResponse.json({ ok: true, alreadyPaid: true });
    }

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
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

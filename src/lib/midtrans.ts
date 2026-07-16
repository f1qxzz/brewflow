import { Snap } from "midtrans-client";

let _snap: Snap | null = null;

function getSnap(): Snap | null {
  const sk = process.env.MIDTRANS_SERVER_KEY;
  const ck = process.env.MIDTRANS_CLIENT_KEY;
  if (!sk || !ck) return null;
  if (!_snap) {
    _snap = new Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: sk,
      clientKey: ck,
    });
  }
  return _snap;
}

export function isMidtransConfigured(): boolean {
  return Boolean(process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_CLIENT_KEY);
}

const MIDTRANS_METHOD_MAP: Record<string, string[]> = {
  qris:      ["qris"],
  va_bca:    ["bca_va"],
  va_mandiri:["mandiri_va"],
  va_bni:    ["bni_va"],
  gopay:     ["gopay"],
};

export type MidtransSnapResult = {
  token: string;
  redirect_url: string;
};

export async function createSnapTransaction(opts: {
  orderId: number;
  amount: number;
  method: string;
  customerName?: string;
  finishUrl?: string;
}): Promise<MidtransSnapResult> {
  const snap = getSnap();
  if (!snap) throw new Error("Midtrans not configured");

  const paymentChannels = MIDTRANS_METHOD_MAP[opts.method] || ["qris", "bca_va", "gopay"];

  const param = {
    transaction_details: {
      order_id: `BRW-${opts.orderId}-${Date.now()}`,
      gross_amount: opts.amount,
    },
    credit_card: { secure: true },
    customer_details: {
      first_name: opts.customerName || "Customer",
    },
    enabled_payments: paymentChannels,
    callbacks: {
      finish: opts.finishUrl,
    },
  };

  const transaction = await snap.createTransaction(param);
  return {
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  };
}

export function parsePaymentStatus(transactionStatus: string, fraudStatus: string): "paid" | "pending" | "expired" | "failed" {
  if (transactionStatus === "capture" || transactionStatus === "settlement") {
    return fraudStatus === "accept" ? "paid" : "pending";
  }
  if (transactionStatus === "pending") return "pending";
  if (transactionStatus === "expire") return "expired";
  if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "failure") return "failed";
  return "pending";
}

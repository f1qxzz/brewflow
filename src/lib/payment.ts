import { randomBytes } from "crypto";

export type PaymentMethod = "cash" | "qris" | "va_bca" | "va_mandiri" | "va_bni" | "gopay";

export type PaymentMethodMeta = {
  id: PaymentMethod;
  label: string;
  shortLabel: string;
  category: "cash" | "online";
  fee: number;
  feePercent: number;
};

export const PAYMENT_METHODS: PaymentMethodMeta[] = [
  { id: "cash",      label: "Bayar di Kasir",          shortLabel: "Tunai",    category: "cash",   fee: 0,      feePercent: 0 },
  { id: "qris",      label: "QRIS",                    shortLabel: "QRIS",     category: "online", fee: 0,      feePercent: 0.7 },
  { id: "va_bca",    label: "Virtual Account BCA",      shortLabel: "BCA VA",  category: "online", fee: 4000,  feePercent: 0 },
  { id: "va_mandiri",label: "Virtual Account Mandiri",  shortLabel: "Mandiri VA", category: "online", fee: 4000, feePercent: 0 },
  { id: "va_bni",    label: "Virtual Account BNI",      shortLabel: "BNI VA",  category: "online", fee: 4000,   feePercent: 0 },
  { id: "gopay",     label: "GoPay",                   shortLabel: "GoPay",    category: "online", fee: 0,      feePercent: 2 },
];

export function getMethodMeta(method: PaymentMethod): PaymentMethodMeta {
  return PAYMENT_METHODS.find((m) => m.id === method) || PAYMENT_METHODS[0];
}

export type PaymentSession = {
  trxId: string;
  orderId: number;
  method: PaymentMethod;
  amount: number;
  fee: number;
  total: number;
  status: "pending" | "paid" | "expired" | "failed";
  qrString?: string;
  vaNumber?: string;
  bankName?: string;
  deeplink?: string;
  expiresAt: string;
  createdAt: string;
};

const VA_PREFIX: Record<string, string> = {
  va_bca: "7008",
  va_mandiri: "8808",
  va_bni: "8808",
};

const VA_BANK: Record<string, string> = {
  va_bca: "BCA",
  va_mandiri: "Mandiri",
  va_bni: "BNI",
};

function generateVA(method: PaymentMethod, orderId: number): { number: string; bank: string } {
  const prefix = VA_PREFIX[method] || "8808";
  const unique = String(orderId).padStart(4, "0");
  const random = randomBytes(5).readUInt32BE(0) % 1_000_000_000;
  const number = prefix + unique + String(random).padStart(9, "0").slice(-9);
  return { number, bank: VA_BANK[method] || "Bank" };
}

function generateQRIS(orderId: number, total: number): string {
  return `00020126370014ID.CO.QRIS.WWW01189320012108152803${String(orderId).padStart(8, "0")}5204${String(total).length}14${total}5802ID5915BREW&CO STORES6006JAKARTA6105123400703#BRW`;
}

export async function createPaymentSession(opts: {
  orderId: number;
  amount: number;
  method: PaymentMethod;
}): Promise<PaymentSession> {
  const meta = getMethodMeta(opts.method);
  const fee = meta.fee + Math.round(opts.amount * (meta.feePercent / 100));
  const total = opts.amount + fee;
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 60 * 1000);
  const trxId = `BRW-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  const session: PaymentSession = {
    trxId,
    orderId: opts.orderId,
    method: opts.method,
    amount: opts.amount,
    fee,
    total,
    status: "pending",
    expiresAt: expires.toISOString(),
    createdAt: now.toISOString(),
  };

  if (opts.method === "qris" || opts.method === "gopay") {
    session.qrString = opts.method === "qris" ? generateQRIS(opts.orderId, total) : undefined;
    session.qrString = session.qrString || generateQRIS(opts.orderId, total);
    if (opts.method === "gopay") session.deeplink = `https://gojek://gopay/merchanttransfer?tref=${trxId}&amount=${total}`;
  } else if (opts.method.startsWith("va_")) {
    const va = generateVA(opts.method, opts.orderId);
    session.vaNumber = va.number;
    session.bankName = va.bank;
  }

  return session;
}

export function getMIDTRANS_ServerKey(): string {
  return process.env.MIDTRANS_SERVER_KEY || "";
}

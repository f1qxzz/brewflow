import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin, rateLimitKey, clientKey, parseId } from "@/lib/admin-auth";
import { signed, verifySigned } from "@/lib/sign";

const VALID_METHODS = ["cash", "qris", "va_bca", "va_mandiri", "va_bni", "gopay"] as const;

export async function POST(req: Request) {
  const rl = rateLimitKey("ord:" + clientKey(req), 20, 60_000);
  if (rl) return rl;

  let body: { customerName?: unknown; tableNumber?: unknown; phone?: unknown; items?: unknown; paymentMethod?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { customerName, tableNumber, phone, items, paymentMethod } = body;
  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: "Pilih minimal 1 item" }, { status: 400 });
  }
  if (items.length > 50) {
    return NextResponse.json({ error: "Terlalu banyak item" }, { status: 400 });
  }

  const rawMethod = String(paymentMethod ?? "");
  const method = (VALID_METHODS as readonly string[]).includes(rawMethod) ? rawMethod : "cash";
  const name = String(customerName || "").trim().slice(0, 100);
  const table = String(tableNumber || "").trim().slice(0, 10);
  let phoneStr = String(phone || "").replace(/[^\d+]/g, "").slice(0, 20);
  if (phoneStr && !/^\+?\d{8,15}$/.test(phoneStr)) phoneStr = "";

  // harga selalu dari DB, qty di-clamp, item gak available dibuang
  // ponytail: 1 query findMany (bukan N findUnique per item, bisa 50 query per order)
  const wanted = (items as { id?: unknown; quantity?: unknown }[]).map((item) => ({
    id: Number(item?.id),
    qty: Math.min(99, Math.max(1, Math.floor(Number(item?.quantity) || 1))),
  })).filter((i) => i.id > 0);

  const menuItems = wanted.length
    ? await prisma.menuItem.findMany({
        where: { id: { in: wanted.map((i) => i.id) }, available: true },
      })
    : [];
  const byId = new Map(menuItems.map((m) => [m.id, m]));

  let total = 0;
  const orderItems = [];
  for (const { id, qty } of wanted) {
    const menuItem = byId.get(id);
    if (!menuItem) continue;
    total += menuItem.price * qty;
    orderItems.push({ menuItemId: id, quantity: qty, price: menuItem.price });
  }

  if (!orderItems.length) {
    return NextResponse.json({ error: "Item tidak tersedia" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      customerName: name,
      tableNumber: table,
      phone: phoneStr,
      total,
      paymentMethod: method,
      paymentStatus: "unpaid",
      items: { create: orderItems },
    },
    include: { items: { include: { menuItem: true } } },
  });

  // orderToken = bukti order ini milik pembuatnya — wajib ditempel di POST /api/payment/create
  return NextResponse.json({ ...order, orderToken: signed(order.id) });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const table = url.searchParams.get("table");

  if (table) {
    const rl = rateLimitKey("tbl:" + clientKey(req), 60, 60_000);
    if (rl) return rl;

    // ponytail: riwayat meja cuma buat pemegang QR — s = signed(table), sama pola dengan orderToken ?t= (pentest L3)
    if (!verifySigned(url.searchParams.get("s"), table)) {
      return NextResponse.json({ error: "Link QR tidak valid" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      where: {
        tableNumber: table,
        status: { in: ["pending", "processed"] },
      },
      select: {
        id: true,
        status: true,
        total: true,
        tableNumber: true,
        createdAt: true,
        items: { select: { quantity: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  }

  const auth = await requireAdmin(req);
  if (auth) return auth;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { menuItem: true } } },
  });
  return NextResponse.json(orders);
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const { id, status } = await req.json();
  const numId = parseId(String(id ?? ""));
  const valid = ["pending", "processed", "done", "cancelled"];
  if (!numId || !valid.includes(status)) {
    return NextResponse.json({ error: "Status invalid" }, { status: 400 });
  }
  const existing = await prisma.order.findUnique({ where: { id: numId } });
  if (!existing) return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  const order = await prisma.order.update({
    where: { id: numId },
    data: { status },
  });
  return NextResponse.json(order);
}

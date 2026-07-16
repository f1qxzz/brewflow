import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { customerName, tableNumber, phone, items, paymentMethod } = await req.json();
  if (!items?.length) return NextResponse.json({ error: "Pilih minimal 1 item" }, { status: 400 });

  const validMethods = ["cash", "qris", "va_bca", "va_mandiri", "va_bni", "gopay"];
  const method = validMethods.includes(paymentMethod) ? paymentMethod : "cash";

  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const menuItem = await prisma.menuItem.findUnique({ where: { id: item.id } });
    if (!menuItem || !menuItem.available) continue;
    const price = menuItem.price;
    total += price * qty;
    orderItems.push({ menuItemId: item.id, quantity: qty, price });
  }

  if (!orderItems.length) return NextResponse.json({ error: "Item tidak tersedia" }, { status: 400 });

  const order = await prisma.order.create({
    data: {
      customerName: String(customerName || "").slice(0, 100),
      tableNumber: String(tableNumber || "").slice(0, 10),
      phone,
      total,
      paymentMethod: method,
      paymentStatus: method === "cash" ? "unpaid" : "unpaid",
      items: { create: orderItems },
    },
    include: { items: { include: { menuItem: true } } },
  });

  return NextResponse.json(order);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const table = url.searchParams.get("table");

  if (table) {
    const orders = await prisma.order.findMany({
      where: {
        tableNumber: table,
        status: { in: ["pending", "processed"] },
      },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  }

  const auth = requireAdmin(req);
  if (auth) return auth;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { menuItem: true } } },
  });
  return NextResponse.json(orders);
}

export async function PATCH(req: Request) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { id, status } = await req.json();
  const valid = ["pending", "processed", "done", "cancelled"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Status invalid" }, { status: 400 });
  }
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(order);
}

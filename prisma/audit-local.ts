import { prisma } from "../src/lib/prisma";

async function main() {
  const menuCount = await prisma.menuItem.count();
  const agg = await prisma.menuItem.aggregate({ _sum: { price: true }, _min: { price: true }, _max: { price: true } });
  const catCount = await prisma.category.count();
  const orderCount = await prisma.order.count();
  const orders = await prisma.order.findMany({ select: { total: true, items: { select: { price: true, quantity: true } } } });
  const orderSum = orders.reduce((s, o) => s + o.total, 0);
  const itemSum = orders.reduce((s, o) => s + o.items.reduce((t, i) => t + i.price * i.quantity, 0), 0);
  const fbCount = await prisma.feedback.count();
  const espresso = (await prisma.menuItem.findFirst({ orderBy: [{ categoryId: "asc" }, { order: "asc" }] }))?.price;
  console.log(JSON.stringify({ menuCount, priceSum: agg._sum.price, catCount, orderCount, orderSum, itemSum, fbCount, espresso }));
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

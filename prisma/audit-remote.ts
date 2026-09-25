import { createClient } from "@libsql/client";

async function main() {
  const c = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN });
  const one = async (s: string) => (await c.execute(s)).rows[0];
  const menuCount = (await one("SELECT COUNT(*) n FROM MenuItem")).n;
  const priceSum = (await one("SELECT SUM(price) s, MIN(price) mn, MAX(price) mx FROM MenuItem")).s;
  const catCount = (await one("SELECT COUNT(*) n FROM Category")).n;
  const orderCount = (await one('SELECT COUNT(*) n FROM "Order"')).n;
  const orderSum = (await one("SELECT SUM(total) s FROM \"Order\"")).s;
  const itemSum = (await one("SELECT SUM(price * quantity) s FROM OrderItem")).s;
  const fbCount = (await one("SELECT COUNT(*) n FROM Feedback")).n;
  const espresso = (await one("SELECT price FROM MenuItem ORDER BY categoryId, [order] LIMIT 1")).price;
  console.log(JSON.stringify({ menuCount, priceSum, catCount, orderCount, orderSum, itemSum, fbCount, espresso }));
}

main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); });

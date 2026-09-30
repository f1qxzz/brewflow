// Jalankan: TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx prisma/turso-pull.ts
// Tarik isi Turso ke prisma/dev.db lokal (dev.db lama di-backup jadi dev.db.bak)
import { createClient } from "@libsql/client";
import { copyFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;
if (!url || !token) {
  console.error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN belum di-set");
  process.exit(1);
}

const dbPath = fileURLToPath(new URL("./dev.db", import.meta.url));

async function main() {
  const remote = createClient({ url: url!, authToken: token! });

  if (existsSync(dbPath)) copyFileSync(dbPath, dbPath + ".bak");
  const local = createClient({ url: "file:" + dbPath });
  await local.execute("PRAGMA foreign_keys=OFF");

  // buang table lama di tempat (file-nya bisa di-lock `next dev`, jadi jangan dihapus)
  const old = await local.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  );
  for (const r of [...old.rows].reverse()) await local.execute(`DROP TABLE IF EXISTS "${r.name}"`);

  const schema = await remote.execute(
    "SELECT sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY rowid"
  );
  for (const r of schema.rows) await local.execute(String(r.sql));

  const tables = (await remote.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid"
  )).rows;

  const summary: Record<string, number> = {};
  for (const t of tables) {
    const name = String(t.name);
    const all = await remote.execute(`SELECT * FROM "${name}"`);
    summary[name] = all.rows.length;
    if (!all.rows.length) continue;
    const cols = Object.keys(all.rows[0]);
    const colSql = cols.map((c) => `"${c}"`).join(", ");
    const stmts = all.rows.map((row) => ({
      sql: `INSERT INTO "${name}" (${colSql}) VALUES (${cols.map(() => "?").join(", ")})`,
      args: cols.map((c) => row[c as keyof typeof row]),
    }));
    for (let i = 0; i < stmts.length; i += 500) {
      await local.batch(stmts.slice(i, i + 500), "write");
    }
  }
  console.log(JSON.stringify({ url, copied: summary }, null, 2));
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});

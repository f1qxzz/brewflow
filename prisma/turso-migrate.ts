// Jalankan: TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx prisma/turso-migrate.ts
// Terapkan schema SQLite ke database Turso (sekali jalan, idempotent-ish: CREATE TABLE IF NOT EXISTS)
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error("TURSO_DATABASE_URL belum di-set");
  process.exit(1);
}

const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
const sql = readFileSync(new URL("./turso-init.sql", import.meta.url), "utf8");

client
  .executeMultiple(sql)
  .then(() => console.log("schema OK:", url))
  .catch((e) => {
    console.error("schema GAGAL:", e.message);
    process.exit(1);
  });

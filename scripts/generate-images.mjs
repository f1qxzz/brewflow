import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "images");

mkdirSync(outDir, { recursive: true });

const prisma = new PrismaClient();

const palettes = {
  Kopi:         { bg: "#3C1F0E", fg: "#D4A574", icon: "\u2615" },
  "Non Kopi":   { bg: "#1A3A2A", fg: "#7BC4A0", icon: "\U0001F375" },
  Makanan:      { bg: "#2A1A0A", fg: "#E8B87A", icon: "\U0001F37D" },
  Snacks:       { bg: "#2A0A1A", fg: "#F0A0B0", icon: "\U0001F950" },
  "Minuman Segar": { bg: "#0A1A3A", fg: "#80C8F0", icon: "\U0001F964" },
};

const items = await prisma.menuItem.findMany({ include: { category: true } });
const catOrder = {};
items.forEach((item) => {
  if (!catOrder[item.category.name]) catOrder[item.category.name] = [];
  catOrder[item.category.name].push(item);
});

let count = 0;
for (const [catName, catItems] of Object.entries(catOrder)) {
  const p = palettes[catName] || palettes.Kopi;
  for (const item of catItems) {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" rx="40" fill="${p.bg}"/>
  <text x="200" y="170" text-anchor="middle" font-size="80" fill="${p.fg}">${p.icon}</text>
  <text x="200" y="280" text-anchor="middle" font-size="24" fill="${p.fg}" font-family="system-ui,sans-serif" font-weight="bold">${esc(item.name)}</text>
  <text x="200" y="320" text-anchor="middle" font-size="18" fill="${p.fg}80" font-family="system-ui,sans-serif">Rp${item.price.toLocaleString()}</text>
</svg>`;
    writeFileSync(join(outDir, `${slug}.svg`), svg);
    count++;
  }
}

console.log(`Generated ${count} SVGs`);
await prisma.$disconnect();

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

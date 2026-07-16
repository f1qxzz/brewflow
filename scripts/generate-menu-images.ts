/**
 * generate-menu-images.ts
 * Generates 67 SVG food illustration images for the menu.
 * Run: npx tsx scripts/generate-menu-images.ts
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/images");

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

/* ─── Color palettes per category ─── */
const CAT_COLORS: Record<string, { bg: string; fg: string; accent: string }> = {
  kopi:           { bg: "#6F4E37", fg: "#F5E6D3", accent: "#C4A77D" },
  "non-kopi":     { bg: "#2D6A4F", fg: "#D8F3DC", accent: "#74C69D" },
  makanan:         { bg: "#9C4F0A", fg: "#FFF3E0", accent: "#FFB74D" },
  snacks:          { bg: "#7B2D8B", fg: "#F3E5F5", accent: "#CE93D8" },
  "minuman-segar": { bg: "#1A6B8A", fg: "#E0F7FA", accent: "#4DD0E1" },
};

/* ─── SVG food illustration template ─── */
function makeSVG(
  name: string,
  emoji: string,
  cat: string,
  filename: string
): string {
  const c = CAT_COLORS[cat] || CAT_COLORS.kopi;
  const lines = name.toUpperCase().split(" ");
  const displayName = lines.length > 3
    ? lines.slice(0, 2).join(" ") + " " + lines.slice(-1)
    : name;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.bg}"/>
      <stop offset="100%" stop-color="${c.accent}66"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#00000033"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="400" height="400" rx="24" fill="url(#bg)"/>

  <!-- Subtle pattern overlay -->
  <g opacity="0.05" fill="${c.fg}">
    ${Array.from({ length: 6 }, (_, i) => `
    <circle cx="${60 + i * 120}" cy="${40 + i * 60}" r="${30 + i * 10}"/>
    `).join("")}
  </g>

  <!-- Emoji (large, centered) -->
  <text
    x="200" y="165"
    font-size="110"
    text-anchor="middle"
    dominant-baseline="middle"
    filter="url(#shadow)"
  >${emoji}</text>

  <!-- Food/drink name -->
  <text
    x="200" y="280"
    font-size="${name.length > 18 ? "22" : name.length > 12 ? "26" : "30"}"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="700"
    fill="${c.fg}"
    letter-spacing="0.5"
  >${displayName}</text>

  <!-- Category tag -->
  <rect x="140" y="330" width="120" height="28" rx="14" fill="${c.fg}22"/>
  <text
    x="200" y="349"
    font-size="11"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="system-ui, sans-serif"
    font-weight="600"
    fill="${c.fg}"
    opacity="0.8"
    letter-spacing="1"
  >${cat.toUpperCase()}</text>

  <!-- Decorative circle -->
  <circle cx="350" cy="60" r="40" fill="${c.fg}" opacity="0.07"/>
  <circle cx="50" cy="360" r="30" fill="${c.fg}" opacity="0.05"/>
</svg>`;
}

/* ─── All 67 menu items: [filename, displayName, emoji, categorySlug] ─── */
const items: [string, string, string, string][] = [
  /* KOPI */
  ["espresso.jpg","Espresso","☕","kopi"],
  ["americano.jpg","Americano","☕","kopi"],
  ["cappuccino.jpg","Cappuccino","☕","kopi"],
  ["latte.jpg","Caffe Latte","🥛","kopi"],
  ["caramel-latte.jpg","Caramel Latte","🍯","kopi"],
  ["vanilla-latte.jpg","Vanilla Latte","🍦","kopi"],
  ["hazelnut-latte.jpg","Hazelnut Latte","🌰","kopi"],
  ["mocha.jpg","Mocha","🍫","kopi"],
  ["affogato.jpg","Affogato","🍨","kopi"],
  ["flat-white.jpg","Flat White","☕","kopi"],
  ["macchiato.jpg","Macchiato","☕","kopi"],
  ["long-black.jpg","Long Black","🖤","kopi"],
  ["v60.jpg","V60 Single Origin","⏱","kopi"],
  ["cold-brew.jpg","Cold Brew","🧊","kopi"],
  ["espresso-tonic.jpg","Espresso Tonic","🍸","kopi"],
  ["coffee-soda.jpg","Coffee Soda","🥤","kopi"],
  ["irish-coffee.jpg","Irish Coffee","🍀","kopi"],
  ["vietnamese.jpg","Vietnamese Drip","☕","kopi"],

  /* NON KOPI */
  ["matcha-latte.jpg","Matcha Latte","🍵","non-kopi"],
  ["chocolate.jpg","Chocolate","🍫","non-kopi"],
  ["hojicha-latte.jpg","Hojicha Latte","🍵","non-kopi"],
  ["taro-latte.jpg","Taro Latte","🟣","non-kopi"],
  ["red-velvet.jpg","Red Velvet Latte","❤️","non-kopi"],
  ["cookies-cream.jpg","Cookies & Cream","🍪","non-kopi"],
  ["thai-tea.jpg","Thai Milk Tea","🧋","non-kopi"],
  ["brown-sugar.jpg","Brown Sugar Milk","🧃","non-kopi"],
  ["yakult.jpg","Yakult Probiotik","🦠","non-kopi"],
  ["lemon-tea.jpg","Lemon Tea","🍋","non-kopi"],
  ["lychee-tea.jpg","Lychee Tea","🐉","non-kopi"],
  ["peach-tea.jpg","Peach Tea","🍑","non-kopi"],
  ["jasmine-tea.jpg","Jasmine Tea","🌸","non-kopi"],

  /* MAKANAN */
  ["nasi-goreng.jpg","Nasi Goreng Spesial","🍛","makanan"],
  ["teriyaki-bowl.jpg","Rice Bowl Teriyaki","🍱","makanan"],
  ["katsu-curry.jpg","Chicken Katsu Curry","🍛","makanan"],
  ["spaghetti.jpg","Spaghetti Aglio Olio","🍝","makanan"],
  ["carbonara.jpg","Carbonara","🍝","makanan"],
  ["nuggets.jpg","Chicken Nuggets","🍗","makanan"],
  ["chicken-wings.jpg","Chicken Wings","🍗","makanan"],
  ["french-fries.jpg","French Fries","🍟","makanan"],
  ["onion-rings.jpg","Onion Rings","🧅","makanan"],
  ["sandwich.jpg","Sandwich Ayam","🥪","makanan"],
  ["roti-canai.jpg","Roti Canai Mentega","🫓","makanan"],
  ["indomie.jpg","Indomie Goreng","🍜","makanan"],
  ["caesar-salad.jpg","Chicken Caesar Salad","🥗","makanan"],
  ["gado-gado.jpg","Gado-Gado","🥗","makanan"],

  /* SNACKS */
  ["croissant.jpg","Croissant Butter","🥐","snacks"],
  ["croissant-choco.jpg","Croissant Coklat","🥐","snacks"],
  ["banana-bread.jpg","Banana Bread","🍌","snacks"],
  ["cheesecake.jpg","Blueberry Cheesecake","🍰","snacks"],
  ["brownie.jpg","Brownie","🟫","snacks"],
  ["muffin.jpg","Chocolate Muffin","🧁","snacks"],
  ["pisang-goreng.jpg","Pisang Goreng Keju","🍌","snacks"],
  ["tahu-crispy.jpg","Tahu Crispy","🧈","snacks"],
  ["dimsum.jpg","Dimsum 6 Pcs","🥟","snacks"],
  ["lumpia.jpg","Lumpia Goreng","🥟","snacks"],

  /* MINUMAN SEGAR */
  ["milkshake.jpg","Strawberry Milkshake","🥛","minuman-segar"],
  ["choco-milkshake.jpg","Chocolate Milkshake","🍫","minuman-segar"],
  ["mango-smoothie.jpg","Mango Smoothie","🥭","minuman-segar"],
  ["strawberry-smoothie.jpg","Strawberry Smoothie","🍓","minuman-segar"],
  ["orange-juice.jpg","Fresh Orange Juice","🍊","minuman-segar"],
  ["watermelon.jpg","Watermelon Smoothie","🍉","minuman-segar"],
  ["avocado.jpg","Avocado Smoothie","🥑","minuman-segar"],
  ["coconut-water.jpg","Coconut Water","🥥","minuman-segar"],
  ["yoghurt-smoothie.jpg","Yoghurt Smoothie","🥛","minuman-segar"],
  ["es-teh.jpg","Es Teh Manis","🧋","minuman-segar"],
  ["teh-tarik.jpg","Teh Tarik","☕","minuman-segar"],
  ["bajigur.jpg","Bajigur","🫕","minuman-segar"],
];

console.log(`Generating ${items.length} SVG images...`);

for (const [filename, name, emoji, cat] of items) {
  const svg = makeSVG(name, emoji, cat, filename);
  writeFileSync(join(OUT, filename), svg, "utf8");
  console.log(`  ✅ ${filename}`);
}

console.log(`\n✨ Done! ${items.length} images generated in ${OUT}`);
console.log("\nNext: run 'npx prisma db seed' to update database references.");
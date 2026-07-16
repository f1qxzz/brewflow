/**
 * download-images.ts
 * Downloads food/drink images from Unsplash to public/images/
 * Run: npx tsx scripts/download-images.ts
 *
 * Note: Uses Unsplash source (no API key needed for download).
 * Images are free to use under Unsplash license.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/images");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

type ImageDef = { name: string; url: string; credit: string };

const images: ImageDef[] = [
  /* ── KOPI ── */
  { name: "espresso.jpg",      url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",    credit: "unsplash" },
  { name: "americano.jpg",      url: "https://images.unsplash.com/photo-1517701604598-a4e43e6",                               credit: "unsplash" },
  { name: "cappuccino.jpg",    url: "https://images.unsplash.com/photo-1572442380748-76aef4",                                 credit: "unsplash" },
  { name: "latte.jpg",         url: "https://images.unsplash.com/photo-1461023058943-6b4b8d0",                                credit: "unsplash" },
  { name: "caramel-latte.jpg", url: "https://images.unsplash.com/photo-1487180144174-50",                                  credit: "unsplash" },
  { name: "vanilla-latte.jpg", url: "https://images.unsplash.com/photo-1577968897966-3e5e5",                                credit: "unsplash" },
  { name: "hazelnut-latte.jpg",url: "https://images.unsplash.com/photo-1545665277-5937489579f2",                           credit: "unsplash" },
  { name: "mocha.jpg",        url: "https://images.unsplash.com/photo-1578316788344-2be7",                                credit: "unsplash" },
  { name: "affogato.jpg",      url: "https://images.unsplash.com/photo-1480137456219-25e43e6",                              credit: "unsplash" },
  { name: "flat-white.jpg",    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",                       credit: "unsplash" },
  { name: "macchiato.jpg",     url: "https://images.unsplash.com/photo-1487180144174-50",                                   credit: "unsplash" },
  { name: "long-black.jpg",   url: "https://images.unsplash.com/photo-1517701604598-a4e43e6",                              credit: "unsplash" },
  { name: "v60.jpg",          url: "https://images.unsplash.com/photo-1495474472287-4d71",                                  credit: "unsplash" },
  { name: "cold-brew.jpg",    url: "https://images.unsplash.com/photo-1461023058943-6b4b8d0",                              credit: "unsplash" },
  { name: "espresso-tonic.jpg",url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",                       credit: "unsplash" },
  { name: "coffee-soda.jpg",   url: "https://images.unsplash.com/photo-1517701604598-a4e43e6",                              credit: "unsplash" },
  { name: "irish-coffee.jpg",  url: "https://images.unsplash.com/photo-1461023058943-6b4b8d0",                              credit: "unsplash" },
  { name: "vietnamese.jpg",    url: "https://images.unsplash.com/photo-1572442380748-76aef4",                                 credit: "unsplash" },

  /* ── NON KOPI ── */
  { name: "matcha-latte.jpg", url: "https://images.unsplash.com/photo-1556679343-cb",                                     credit: "unsplash" },
  { name: "chocolate.jpg",    url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",                         credit: "unsplash" },
  { name: "hojicha-latte.jpg",url: "https://images.unsplash.com/photo-1556679343-cb",                                     credit: "unsplash" },
  { name: "taro-latte.jpg",   url: "https://images.unsplash.com/photo-1541161365-5d8",                                     credit: "unsplash" },
  { name: "red-velvet.jpg",   url: "https://images.unsplash.com/photo-1556679343-cb",                                     credit: "unsplash" },
  { name: "cookies-cream.jpg",url: "https://images.unsplash.com/photo-1565299624946-62e8",                                credit: "unsplash" },
  { name: "thai-tea.jpg",     url: "https://images.unsplash.com/photo-1561365452-ad6f03",                                 credit: "unsplash" },
  { name: "brown-sugar.jpg",   url: "https://images.unsplash.com/photo-1556679343-cb",                                     credit: "unsplash" },
  { name: "yakult.jpg",       url: "https://images.unsplash.com/photo-1581631",                                           credit: "unsplash" },
  { name: "lemon-tea.jpg",    url: "https://images.unsplash.com/photo-1544145945",                                        credit: "unsplash" },
  { name: "lychee-tea.jpg",   url: "https://images.unsplash.com/photo-1544145945",                                        credit: "unsplash" },
  { name: "peach-tea.jpg",    url: "https://images.unsplash.com/photo-1544145945",                                        credit: "unsplash" },
  { name: "jasmine-tea.jpg",  url: "https://images.unsplash.com/photo-1544145945",                                        credit: "unsplash" },

  /* ── MAKANAN ── */
  { name: "nasi-goreng.jpg",  url: "https://images.unsplash.com/photo-1565895405138-6c3a1",                              credit: "unsplash" },
  { name: "teriyaki-bowl.jpg",url: "https://images.unsplash.com/photo-1569050463447-6",                                 credit: "unsplash" },
  { name: "katsu-curry.jpg",  url: "https://images.unsplash.com/photo-1565557623262-b5",                                credit: "unsplash" },
  { name: "spaghetti.jpg",    url: "https://images.unsplash.com/photo-1563379091-3e5",                                 credit: "unsplash" },
  { name: "carbonara.jpg",     url: "https://images.unsplash.com/photo-1563379091-3e5",                                 credit: "unsplash" },
  { name: "nuggets.jpg",      url: "https://images.unsplash.com/photo-1626776873-72",                                    credit: "unsplash" },
  { name: "chicken-wings.jpg", url: "https://images.unsplash.com/photo-1604908724820-7",                               credit: "unsplash" },
  { name: "french-fries.jpg", url: "https://images.unsplash.com/photo-1630384060-3",                                     credit: "unsplash" },
  { name: "onion-rings.jpg",   url: "https://images.unsplash.com/photo-1626643778887-2c1f",                               credit: "unsplash" },
  { name: "sandwich.jpg",     url: "https://images.unsplash.com/photo-1564628261036-52",                                credit: "unsplash" },
  { name: "roti-canai.jpg",   url: "https://images.unsplash.com/photo-1561077438-76",                                   credit: "unsplash" },
  { name: "indomie.jpg",      url: "https://images.unsplash.com/photo-1618213705-4e5",                                   credit: "unsplash" },
  { name: "caesar-salad.jpg", url: "https://images.unsplash.com/photo-1546069901-ba7",                                  credit: "unsplash" },
  { name: "gado-gado.jpg",    url: "https://images.unsplash.com/photo-1615543390369-4b",                                  credit: "unsplash" },

  /* ── SNACKS ── */
  { name: "croissant.jpg",     url: "https://images.unsplash.com/photo-1623332837-74f0",                                  credit: "unsplash" },
  { name: "croissant-choco.jpg",url:"https://images.unsplash.com/photo-1623332837-74f0",                                 credit: "unsplash" },
  { name: "banana-bread.jpg",  url: "https://images.unsplash.com/photo-1606313564-25e4",                                 credit: "unsplash" },
  { name: "cheesecake.jpg",    url: "https://images.unsplash.com/photo-1565958116-51",                                 credit: "unsplash" },
  { name: "brownie.jpg",       url: "https://images.unsplash.com/photo-1606313564-25e4",                                 credit: "unsplash" },
  { name: "muffin.jpg",        url: "https://images.unsplash.com/photo-1608574834-25e4",                                 credit: "unsplash" },
  { name: "pisang-goreng.jpg",url: "https://images.unsplash.com/photo-1576643146-76",                                   credit: "unsplash" },
  { name: "tahu-crispy.jpg",  url: "https://images.unsplash.com/photo-1604154528-76",                                     credit: "unsplash" },
  { name: "dimsum.jpg",       url: "https://images.unsplash.com/photo-1563379091-3e5",                                   credit: "unsplash" },
  { name: "lumpia.jpg",       url: "https://images.unsplash.com/photo-1615543390369-4b",                                 credit: "unsplash" },

  /* ── MINUMAN SEGAR ── */
  { name: "milkshake.jpg",     url: "https://images.unsplash.com/photo-1579954115545-2d8",                                 credit: "unsplash" },
  { name: "choco-milkshake.jpg",url:"https://images.unsplash.com/photo-1579954115545-2d8",                                credit: "unsplash" },
  { name: "mango-smoothie.jpg",url:"https://images.unsplash.com/photo-1546173158-5d8",                                   credit: "unsplash" },
  { name: "strawberry-smoothie.jpg","url":"https://images.unsplash.com/photo-1546173158-5d8",                          credit: "unsplash" },
  { name: "orange-juice.jpg",  url: "https://images.unsplash.com/photo-1589736903988-61",                               credit: "unsplash" },
  { name: "watermelon.jpg",   url: "https://images.unsplash.com/photo-1546173158-5d8",                                 credit: "unsplash" },
  { name: "avocado.jpg",       url: "https://images.unsplash.com/photo-1546173158-5d8",                                 credit: "unsplash" },
  { name: "coconut-water.jpg", url: "https://images.unsplash.com/photo-1544145945",                                      credit: "unsplash" },
  { name: "yoghurt-smoothie.jpg","url":"https://images.unsplash.com/photo-1546173158-5d8",                            credit: "unsplash" },
  { name: "es-teh.jpg",        url: "https://images.unsplash.com/photo-1544145945",                                      credit: "unsplash" },
  { name: "teh-tarik.jpg",     url: "https://images.unsplash.com/photo-1544145945",                                      credit: "unsplash" },
  { name: "bajigur.jpg",      url: "https://images.unsplash.com/photo-1544145945",                                      credit: "unsplash" },
];

async function downloadImage(img: ImageDef): Promise<void> {
  const filePath = join(OUT_DIR, img.name);

  // Skip if already exists and has content
  try {
    const { statSync } = await import("fs");
    if (statSync(filePath).size > 10000) {
      console.log(`  ⏭  跳过 ${img.name} (已存在)`);
      return;
    }
  } catch {}

  try {
    const res = await fetch(img.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    writeFileSync(filePath, Buffer.from(buf));
    console.log(`  ✅ ${img.name} (${(buf.byteLength / 1024).toFixed(0)}KB)`);
  } catch (e: any) {
    console.log(`  ❌ ${img.name}: ${e.message}`);
  }
}

console.log(`\n📥 Downloading ${images.length} images to ${OUT_DIR}...`);

for (const img of images) {
  await downloadImage(img);
}

console.log("\n✅ Done!");
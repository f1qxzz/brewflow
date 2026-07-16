import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

const PRJ = "D:/brewflow";
const IMG = join(PRJ, "public/images");

// Seed uses `image: `${IMG}/xxx.svg`` — extract names used in seed
const seed = readFileSync(join(PRJ, "prisma/seed.ts"), "utf8");
const refs = [...seed.matchAll(/image: `\$\{IMG\}\/([^`]+)`/g)].map(m => m[1]);
const generated = readdirSync(IMG).filter(f => f.endsWith(".svg"));

let copied = 0;
for (const ref of refs) {
  if (!existsSync(join(IMG, ref))) {
    // Find a matching generated file
    const base = ref.replace(/\.svg$/, "");
    const match = generated.find(g => g.startsWith(base) || base.startsWith(g.replace(/\.svg$/, "")));
    if (match && match !== ref) {
      writeFileSync(join(IMG, ref), readFileSync(join(IMG, match)));
      copied++;
      console.log(`  ${match} → ${ref}`);
    }
  }
}
console.log(`Linked ${copied} images`);

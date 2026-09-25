import { prisma } from "../src/lib/prisma";

const IMG = "/images";

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  /* ─── KATEGORI ─── */
  const coffee    = await prisma.category.create({ data: { name: "Kopi",            slug: "kopi",           order: 1 } });
  const nonCoffee = await prisma.category.create({ data: { name: "Non Kopi",         slug: "non-kopi",        order: 2 } });
  const food      = await prisma.category.create({ data: { name: "Makanan",          slug: "makanan",         order: 3 } });
  const snacks    = await prisma.category.create({ data: { name: "Snacks",            slug: "snacks",           order: 4 } });
  const drinks    = await prisma.category.create({ data: { name: "Minuman Segar",     slug: "minuman-segar",     order: 5 } });

  /* ─── KOPI (18) ─── */
  await Promise.all([
    prisma.menuItem.create({ data: { name: "Espresso",           description: "Single shot espresso murni dari biji Arabica pilihan dengan crema tipis", price: 10000, image: `${IMG}/espresso.jpg`,        categoryId: coffee.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Americano",          description: "Espresso shot dengan air panas — bold, clean, tanpa rasa asam", price: 11000, image: `${IMG}/americano.jpg`,      categoryId: coffee.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Cappuccino",          description: "Espresso + steamed milk + foam tebal — klasik Italia yang creamy", price: 15000, image: `${IMG}/cappuccino.jpg`,     categoryId: coffee.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Caffe Latte",          description: "Espresso dengan susu steamed yang lembut dan creamy", price: 15000, image: `${IMG}/latte.jpg`,           categoryId: coffee.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Caramel Latte",        description: "Latte dengan sirup caramel homemade — manis gurih khas", price: 17000, image: `${IMG}/caramel-latte.jpg`,  categoryId: coffee.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Vanilla Latte",        description: "Latte creamy dengan vanilla extract premium", price: 17000, image: `${IMG}/vanilla-latte.jpg`, categoryId: coffee.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Hazelnut Latte",      description: "Latte dengan pasta hazelnut Italy — nutty dan aromatic", price: 17000, image: `${IMG}/hazelnut-latte.jpg`,categoryId: coffee.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "Mocha",                description: "Espresso + coklat Belgia + steamed milk — legit banget", price: 17000, image: `${IMG}/mocha.jpg`,          categoryId: coffee.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Affogato",             description: "Single espresso shot di atas vanilla ice cream Italia", price: 18000, image: `${IMG}/affogato.jpg`,       categoryId: coffee.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Flat White",            description: "Double shot dengan microfoam — strong tapi smooth", price: 17000, image: `${IMG}/flat-white.jpg`,    categoryId: coffee.id, order: 10 }}),
    prisma.menuItem.create({ data: { name: "Macchiato",            description: "Espresso dengan sedikit steamed milk — bold dan intense", price: 13000, image: `${IMG}/macchiato.jpg`,     categoryId: coffee.id, order: 11 }}),
    prisma.menuItem.create({ data: { name: "Long Black",            description: "Double espresso dengan air — bold dan clean", price: 12000, image: `${IMG}/long-black.jpg`,   categoryId: coffee.id, order: 12 }}),
    prisma.menuItem.create({ data: { name: "V60 Single Origin",     description: "Manual brew pour over — pilihan biji single origin terbaru", price: 19000, image: `${IMG}/v60.jpg`,           categoryId: coffee.id, order: 13 }}),
    prisma.menuItem.create({ data: { name: "Cold Brew",            description: "Kopi seduh dingin 12-16 jam — smooth, low acid, refreshing", price: 15000, image: `${IMG}/cold-brew.jpg`,     categoryId: coffee.id, order: 14 }}),
    prisma.menuItem.create({ data: { name: "Espresso Tonic",        description: "Espresso + tonic water + lime — unique dan energizing", price: 18000, image: `${IMG}/espresso-tonic.jpg`,categoryId: coffee.id, order: 15 }}),
    prisma.menuItem.create({ data: { name: "Coffee Soda",          description: "Espresso dengan soda + sirup pilihan — sparkling coffee", price: 15000, image: `${IMG}/coffee-soda.jpg`,   categoryId: coffee.id, order: 16 }}),
    prisma.menuItem.create({ data: { name: "Irish Coffee",          description: "Espresso + whiskey Irish + fresh cream — untuk yang dewasa", price: 21000, image: `${IMG}/irish-coffee.jpg`,  categoryId: coffee.id, order: 17 }}),
    prisma.menuItem.create({ data: { name: "Vietnamese Drip",       description: "Kopi drip Vietnam dengan susu condensasi — bold & sweet", price: 14000, image: `${IMG}/vietnamese.jpg`,   categoryId: coffee.id, order: 18 }}),
  ]);

  /* ─── NON KOPI (13) ─── */
  await Promise.all([
    prisma.menuItem.create({ data: { name: "Matcha Latte",        description: "Matcha premium Jepang + susu oat — umami yang creamy", price: 17000, image: `${IMG}/matcha-latte.jpg`,  categoryId: nonCoffee.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Chocolate",            description: "Coklat Belgia yang creamy — bisa disajikan panas atau dingin", price: 15000, image: `${IMG}/chocolate.jpg`,     categoryId: nonCoffee.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Hojicha Latte",        description: "Kopi gandung panggang Jepang + susu — earthy, rendah kafein", price: 15000, image: `${IMG}/hojicha-latte.jpg`,  categoryId: nonCoffee.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Taro Latte",           description: "Taro segar yang creamy dengan susu — unik dan tasty", price: 17000, image: `${IMG}/taro-latte.jpg`,   categoryId: nonCoffee.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Red Velvet Latte",       description: "Red velvet creamy latte dengan whipped cream topping", price: 18000, image: `${IMG}/red-velvet.jpg`,    categoryId: nonCoffee.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Cookies & Cream",        description: "Minuman creamy dengan remukan oreo — cookies lovers wajib!", price: 17000, image: `${IMG}/cookies-cream.jpg`, categoryId: nonCoffee.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Thai Milk Tea",         description: "Teh Thailand dengan susu evaporated — manis dan creamy khas", price: 14000, image: `${IMG}/thai-tea.jpg`,      categoryId: nonCoffee.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "Brown Sugar Milk",       description: "Susu segar dengan gula aren — trending drink yang tasty", price: 15000, image: `${IMG}/brown-sugar.jpg`,   categoryId: nonCoffee.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Yakult Probiotik",       description: "Yakult segar dengan susu + soda — probiotik yang refreshing", price: 12000, image: `${IMG}/yakult.jpg`,       categoryId: nonCoffee.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Lemon Tea",             description: "Teh lemon segar dengan madu asli — perfect untuk sore", price: 10000, image: `${IMG}/lemon-tea.jpg`,     categoryId: nonCoffee.id, order: 10 }}),
    prisma.menuItem.create({ data: { name: "Lychee Tea",            description: "Teh dengan pieces lychee segar — fruity dan light", price: 12000, image: `${IMG}/lychee-tea.jpg`,   categoryId: nonCoffee.id, order: 11 }}),
    prisma.menuItem.create({ data: { name: "Peach Tea",             description: "Teh hijau dengan peach puree — soft fruit flavor", price: 12000, image: `${IMG}/peach-tea.jpg`,     categoryId: nonCoffee.id, order: 12 }}),
    prisma.menuItem.create({ data: { name: "Jasmine Tea",           description: "Teh melati aromatic yang menenangkan — zero caffeine option", price: 10000, image: `${IMG}/jasmine-tea.jpg`,  categoryId: nonCoffee.id, order: 13 }}),
  ]);

  /* ─── MAKANAN (14) ─── */
  await Promise.all([
    prisma.menuItem.create({ data: { name: "Nasi Goreng Spesial",  description: "Nasi goreng kampung dengan telur, kerupuk, dan acar — resep rahasia", price: 21000, image: `${IMG}/nasi-goreng.jpg`,    categoryId: food.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Rice Bowl Teriyaki",     description: "Chicken teriyaki dengan nasi, sayuran, dan telur mata sapi", price: 23000, image: `${IMG}/teriyaki-bowl.jpg`, categoryId: food.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Chicken Katsu Curry",    description: "Ayam katsu crispy dengan kari Jepang dan nasi hangat", price: 25000, image: `${IMG}/katsu-curry.jpg`,    categoryId: food.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Spaghetti Aglio Olio",  description: "Pasta dengan garlic, olive oil, chili flakes, dan keju parmesan", price: 21000, image: `${IMG}/spaghetti.jpg`,     categoryId: food.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Carbonara",             description: "Spaghetti dengan telur, keju, bacon, dan black pepper", price: 22000, image: `${IMG}/carbonara.jpg`,     categoryId: food.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Chicken Nuggets",         description: "Nuggets ayam crispy dengan saus pilihan (BBQ / sambal / cheese)", price: 18000, image: `${IMG}/nuggets.jpg`,       categoryId: food.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Chicken Wings",          description: "Sayap ayam goreng crispy 6 pcs dengan saus pilihan", price: 21000, image: `${IMG}/chicken-wings.jpg`, categoryId: food.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "French Fries",           description: "Kentang goreng crispy dengan bumbu pilihan dan saus sambal", price: 12000, image: `${IMG}/french-fries.jpg`,  categoryId: food.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Onion Rings",           description: "Bawang bombay goreng crispy — crunchy di luar, sweet di dalam", price: 14000, image: `${IMG}/onion-rings.jpg`,   categoryId: food.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Sandwich Ayam",         description: "Roti lapis dengan ayam grilled, keju, lettuce, dan saus mayo", price: 17000, image: `${IMG}/sandwich.jpg`,      categoryId: food.id, order: 10 }}),
    prisma.menuItem.create({ data: { name: "Roti Canai Mentega",    description: "Roti canai crispy di luar, lembut di dalam", price: 10000, image: `${IMG}/roti-canai.jpg`,    categoryId: food.id, order: 11 }}),
    prisma.menuItem.create({ data: { name: "Indomie Goreng",        description: "Indomie goreng spesial dengan telur dan topping lengkap", price: 12000, image: `${IMG}/indomie.jpg`,       categoryId: food.id, order: 12 }}),
    prisma.menuItem.create({ data: { name: "Chicken Caesar Salad",  description: "Salad romaine dengan grilled chicken, parmesan, dan caesar dressing", price: 23000, image: `${IMG}/caesar-salad.jpg`,categoryId: food.id, order: 13 }}),
    prisma.menuItem.create({ data: { name: "Gado-Gado",             description: "Sayuran rebus dengan bumbu kacang, tahu, tempe, dan lontong", price: 19000, image: `${IMG}/gado-gado.jpg`,    categoryId: food.id, order: 14 }}),
  ]);

  /* ─── SNACKS (10) ─── */
  await Promise.all([
    prisma.menuItem.create({ data: { name: "Croissant Butter",       description: "French butter croissant — flaky, buttery, fresh from oven", price: 14000, image: `${IMG}/croissant.jpg`,      categoryId: snacks.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Croissant Coklat",       description: "Croissant dengan dark chocolate filling — flaky dan rich", price: 15000, image: `${IMG}/croissant-choco.jpg`, categoryId: snacks.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Banana Bread",           description: "Banana cake homemade yang moist dengan cinnamon topping", price: 14000, image: `${IMG}/banana-bread.jpg`,  categoryId: snacks.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Blueberry Cheesecake",    description: "Cheesecake NY style dengan topping blueberry compote", price: 19000, image: `${IMG}/cheesecake.jpg`,   categoryId: snacks.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Brownie",               description: "Fudgy dark chocolate brownie — dense, rich, perfect", price: 15000, image: `${IMG}/brownie.jpg`,       categoryId: snacks.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Chocolate Muffin",         description: "Chocolate chip muffin yang fluffy dengan choco chips topping", price: 12000, image: `${IMG}/muffin.jpg`,        categoryId: snacks.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Pisang Goreng Keju",     description: "Pisang goreng crispy dengan topping keju parut dan susu kental", price: 10000, image: `${IMG}/pisang-goreng.jpg`,categoryId: snacks.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "Tahu Crispy",            description: "Tahu goreng crispy dengan saus pilihan", price: 8000, image: `${IMG}/tahu-crispy.jpg`,   categoryId: snacks.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Dimsum 6 Pcs",          description: "Dimsum ayam + udang dengan saus sambal dan cuka", price: 18000, image: `${IMG}/dimsum.jpg`,        categoryId: snacks.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Lumpia Goreng",         description: "Lumpia goreng crispy dengan isi ayam dan sayuran", price: 15000, image: `${IMG}/lumpia.jpg`,        categoryId: snacks.id, order: 10 }}),
  ]);

  /* ─── MINUMAN SEGAR (12) ─── */
  await Promise.all([
    prisma.menuItem.create({ data: { name: "Strawberry Milkshake",   description: "Susu kocok segar dengan strawberry puree — creamy dan fruity", price: 18000, image: `${IMG}/milkshake.jpg`,     categoryId: drinks.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Chocolate Milkshake",    description: "Milkshake coklat dengan whipped cream dan choco chips", price: 18000, image: `${IMG}/choco-milkshake.jpg`, categoryId: drinks.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Mango Smoothie",        description: "Smoothie mangga segar dengan yoghurt dan madu", price: 17000, image: `${IMG}/mango-smoothie.jpg`, categoryId: drinks.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Strawberry Smoothie",     description: "Smoothie stroberi segar dengan milk dan madu", price: 17000, image: `${IMG}/strawberry-smoothie.jpg`,categoryId: drinks.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Fresh Orange Juice",    description: "Jeruk peras segar tanpa gula tambahan — 100% natural", price: 14000, image: `${IMG}/orange-juice.jpg`, categoryId: drinks.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Watermelon Smoothie",   description: "Smoothie semangka segar dengan mint — super hydrating", price: 15000, image: `${IMG}/watermelon.jpg`,   categoryId: drinks.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Avocado Smoothie",       description: "Jus alpukat segar dengan susu dan sedikit vanilla — creamy & healthy", price: 15000, image: `${IMG}/avocado.jpg`,       categoryId: drinks.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "Coconut Water",          description: "Air kelapa segar dari kelapa — natural electrolyte drink", price: 11000, image: `${IMG}/coconut-water.jpg`, categoryId: drinks.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Yoghurt Smoothie",       description: "Smoothie yoghurt probiotik dengan buah seasonal", price: 15000, image: `${IMG}/yoghurt-smoothie.jpg`,categoryId: drinks.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Es Teh Manis",           description: "Teh es segar dengan gula aren — classic Indonesian drink", price: 7000, image: `${IMG}/es-teh.jpg`,        categoryId: drinks.id, order: 10 }}),
    prisma.menuItem.create({ data: { name: "Teh Tarik",             description: "Teh tarik hangat/dingin — creamy dan frothy khas mamak", price: 10000, image: `${IMG}/teh-tarik.jpg`,    categoryId: drinks.id, order: 11 }}),
    prisma.menuItem.create({ data: { name: "Bajigur",               description: "Minuman hangat dari kelapa, gula aren, dan jahe — cozy banget", price: 10000, image: `${IMG}/bajigur.jpg`,      categoryId: drinks.id, order: 12 }}),
  ]);

  /* ─── DATA TRANSAKSI (20 order, 14 hari terakhir) ─── */
  const all = await prisma.menuItem.findMany({ orderBy: [{ categoryId: "asc" }, { order: "asc" }] });
  const names = ["Budi", "Ani", "Charlie", "Dewi", "Edo", "Fitri", "Galih", "Hana", "Irfan", "Joko",
                 "Kartika", "Lina", "Maya", "Nanda", "Omar", "Putri", "Rizky", "Sari", "Tono", "Udin"];
  const methods = ["cash", "qris", "cash", "va_bca", "cash", "qris"];
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const lines = Array.from({ length: (i % 3) + 1 }, (_, k) => {
      const m = all[(i * 11 + k * 7) % all.length];
      return { menuItemId: m.id, quantity: ((i + k) % 2) + 1, price: m.price };
    });
    const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const createdAt = new Date(now - i * 17 * 3600 * 1000);
    const status = i === 0 ? "pending" : i === 1 ? "processed" : "done";
    const paid = status !== "pending";
    const order = await prisma.order.create({ data: {
      customerName: names[i], tableNumber: String((i % 10) + 1), status,
      paymentMethod: methods[i % methods.length], paymentStatus: paid ? "paid" : "unpaid",
      total, createdAt,
      paidAt: paid ? new Date(createdAt.getTime() + 5 * 60 * 1000) : null,
    }});
    await prisma.orderItem.createMany({ data: lines.map(l => ({ orderId: order.id, ...l })) });
  }

  /* ─── SAMPLE FEEDBACK ─── */
  await prisma.feedback.createMany({ data: [
    { customerName: "Budi",   rating: 5, message: "Kopinya enak banget! Caffè Latte-nya creamy, croissantnya fresh." },
    { customerName: "Ani",    rating: 4, message: "Matcha Latte-nya pass sweetnessnya. WiFi kenceng, cocok buat kerja." },
    { customerName: "Dewi",    rating: 5, message: "Harganya ramah di kantong, kopinya tetap mantap." },
    { customerName: "Edo",    rating: 3, message: "Nasi gorengnya oke, pelayanan juga cepat." },
    { customerName: "Fitri",  rating: 4, message: "Chicken wings-nya crispy! Lemon tea-nya juga segar." },
    { customerName: "Hana",   rating: 5, message: "Best Matcha Latte in the area!" },
    { customerName: "Irfan",  rating: 4, message: "Brownie-nya rich, pas dimakan sama espresso." },
    { customerName: "Galih",  rating: 2, message: "Pesanan telat 20 menit. Semoga improve." },
  ]});

  const cats = await prisma.category.findMany({ orderBy: { order: "asc" } });
  const counts = await Promise.all(cats.map(async (c) => {
    const count = await prisma.menuItem.count({ where: { categoryId: c.id } });
    return { name: c.name, count };
  }));

  const total = counts.reduce((s, c) => s + c.count, 0);
  console.log(`✅ Seed complete — ${total} items across ${counts.length} categories`);
  counts.forEach((c) => console.log(`   ${c.name}: ${c.count} items`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    prisma.menuItem.create({ data: { name: "Espresso",           description: "Single shot espresso murni dari biji Arabica pilihan dengan crema tipis", price: 18000, image: `${IMG}/espresso.svg`,        categoryId: coffee.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Americano",          description: "Espresso shot dengan air panas — bold, clean, tanpa rasa asam", price: 20000, image: `${IMG}/americano.svg`,      categoryId: coffee.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Cappuccino",          description: "Espresso + steamed milk + foam tebal — klasik Italia yang creamy", price: 28000, image: `${IMG}/cappuccino.svg`,     categoryId: coffee.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Caffe Latte",          description: "Espresso dengan susu steamed yang lembut dan creamy", price: 28000, image: `${IMG}/latte.svg`,           categoryId: coffee.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Caramel Latte",        description: "Latte dengan sirup caramel homemade — manis gurih khas", price: 30000, image: `${IMG}/caramel-latte.svg`,  categoryId: coffee.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Vanilla Latte",        description: "Latte creamy dengan vanilla extract premium", price: 30000, image: `${IMG}/vanilla-latte.svg`, categoryId: coffee.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Hazelnut Latte",      description: "Latte dengan pasta hazelnut Italy — nutty dan aromatic", price: 30000, image: `${IMG}/hazelnut-latte.svg`,categoryId: coffee.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "Mocha",                description: "Espresso + coklat Belgia + steamed milk — legit banget", price: 30000, image: `${IMG}/mocha.svg`,          categoryId: coffee.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Affogato",             description: "Single espresso shot di atas vanilla ice cream Italia", price: 32000, image: `${IMG}/affogato.svg`,       categoryId: coffee.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Flat White",            description: "Double shot dengan microfoam — strong tapi smooth", price: 30000, image: `${IMG}/flat-white.svg`,    categoryId: coffee.id, order: 10 }}),
    prisma.menuItem.create({ data: { name: "Macchiato",            description: "Espresso dengan sedikit steamed milk — bold dan intense", price: 24000, image: `${IMG}/macchiato.svg`,     categoryId: coffee.id, order: 11 }}),
    prisma.menuItem.create({ data: { name: "Long Black",            description: "Double espresso dengan air — bold dan clean", price: 22000, image: `${IMG}/long-black.svg`,   categoryId: coffee.id, order: 12 }}),
    prisma.menuItem.create({ data: { name: "V60 Single Origin",     description: "Manual brew pour over — pilihan biji single origin terbaru", price: 35000, image: `${IMG}/v60.svg`,           categoryId: coffee.id, order: 13 }}),
    prisma.menuItem.create({ data: { name: "Cold Brew",            description: "Kopi seduh dingin 12-16 jam — smooth, low acid, refreshing", price: 28000, image: `${IMG}/cold-brew.svg`,     categoryId: coffee.id, order: 14 }}),
    prisma.menuItem.create({ data: { name: "Espresso Tonic",        description: "Espresso + tonic water + lime — unique dan energizing", price: 32000, image: `${IMG}/espresso-tonic.svg`,categoryId: coffee.id, order: 15 }}),
    prisma.menuItem.create({ data: { name: "Coffee Soda",          description: "Espresso dengan soda + sirup pilihan — sparkling coffee", price: 28000, image: `${IMG}/coffee-soda.svg`,   categoryId: coffee.id, order: 16 }}),
    prisma.menuItem.create({ data: { name: "Irish Coffee",          description: "Espresso + whiskey Irish + fresh cream — untuk yang dewasa", price: 38000, image: `${IMG}/irish-coffee.svg`,  categoryId: coffee.id, order: 17 }}),
    prisma.menuItem.create({ data: { name: "Vietnamese Drip",       description: "Kopi drip Vietnam dengan susu condensasi — bold & sweet", price: 25000, image: `${IMG}/vietnamese.svg`,   categoryId: coffee.id, order: 18 }}),
  ]);

  /* ─── NON KOPI (13) ─── */
  await Promise.all([
    prisma.menuItem.create({ data: { name: "Matcha Latte",        description: "Matcha premium Jepang + susu oat — umami yang creamy", price: 30000, image: `${IMG}/matcha-latte.svg`,  categoryId: nonCoffee.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Chocolate",            description: "Coklat Belgia yang creamy — bisa disajikan panas atau dingin", price: 28000, image: `${IMG}/chocolate.svg`,     categoryId: nonCoffee.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Hojicha Latte",        description: "Kopi gandung panggang Jepang + susu — earthy, rendah kafein", price: 28000, image: `${IMG}/hojicha-latte.svg`,  categoryId: nonCoffee.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Taro Latte",           description: "Taro segar yang creamy dengan susu — unik dan tasty", price: 30000, image: `${IMG}/taro-latte.svg`,   categoryId: nonCoffee.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Red Velvet Latte",       description: "Red velvet creamy latte dengan whipped cream topping", price: 32000, image: `${IMG}/red-velvet.svg`,    categoryId: nonCoffee.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Cookies & Cream",        description: "Minuman creamy dengan remukan oreo — cookies lovers wajib!", price: 30000, image: `${IMG}/cookies-cream.svg`, categoryId: nonCoffee.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Thai Milk Tea",         description: "Teh Thailand dengan susu evaporated — manis dan creamy khas", price: 25000, image: `${IMG}/thai-tea.svg`,      categoryId: nonCoffee.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "Brown Sugar Milk",       description: "Susu segar dengan gula aren — trending drink yang tasty", price: 28000, image: `${IMG}/brown-sugar.svg`,   categoryId: nonCoffee.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Yakult Probiotik",       description: "Yakult segar dengan susu + soda — probiotik yang refreshing", price: 22000, image: `${IMG}/yakult.svg`,       categoryId: nonCoffee.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Lemon Tea",             description: "Teh lemon segar dengan madu asli — perfect untuk sore", price: 18000, image: `${IMG}/lemon-tea.svg`,     categoryId: nonCoffee.id, order: 10 }}),
    prisma.menuItem.create({ data: { name: "Lychee Tea",            description: "Teh dengan pieces lychee segar — fruity dan light", price: 22000, image: `${IMG}/lychee-tea.svg`,   categoryId: nonCoffee.id, order: 11 }}),
    prisma.menuItem.create({ data: { name: "Peach Tea",             description: "Teh hijau dengan peach puree — soft fruit flavor", price: 22000, image: `${IMG}/peach-tea.svg`,     categoryId: nonCoffee.id, order: 12 }}),
    prisma.menuItem.create({ data: { name: "Jasmine Tea",           description: "Teh melati aromatic yang menenangkan — zero caffeine option", price: 18000, image: `${IMG}/jasmine-tea.svg`,  categoryId: nonCoffee.id, order: 13 }}),
  ]);

  /* ─── MAKANAN (14) ─── */
  await Promise.all([
    prisma.menuItem.create({ data: { name: "Nasi Goreng Spesial",  description: "Nasi goreng kampung dengan telur, kerupuk, dan acar — resep rahasia", price: 38000, image: `${IMG}/nasi-goreng.svg`,    categoryId: food.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Rice Bowl Teriyaki",     description: "Chicken teriyaki dengan nasi, sayuran, dan telur mata sapi", price: 42000, image: `${IMG}/teriyaki-bowl.svg`, categoryId: food.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Chicken Katsu Curry",    description: "Ayam katsu crispy dengan kari Jepang dan nasi hangat", price: 45000, image: `${IMG}/katsu-curry.svg`,    categoryId: food.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Spaghetti Aglio Olio",  description: "Pasta dengan garlic, olive oil, chili flakes, dan keju parmesan", price: 38000, image: `${IMG}/spaghetti.svg`,     categoryId: food.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Carbonara",             description: "Spaghetti dengan telur, keju, bacon, dan black pepper", price: 40000, image: `${IMG}/carbonara.svg`,     categoryId: food.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Chicken Nuggets",         description: "Nuggets ayam crispy dengan saus pilihan (BBQ / sambal / cheese)", price: 32000, image: `${IMG}/nuggets.svg`,       categoryId: food.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Chicken Wings",          description: "Sayap ayam goreng crispy 6 pcs dengan saus pilihan", price: 38000, image: `${IMG}/chicken-wings.svg`, categoryId: food.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "French Fries",           description: "Kentang goreng crispy dengan bumbu pilihan dan saus sambal", price: 22000, image: `${IMG}/french-fries.svg`,  categoryId: food.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Onion Rings",           description: "Bawang bombay goreng crispy — crunchy di luar, sweet di dalam", price: 25000, image: `${IMG}/onion-rings.svg`,   categoryId: food.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Sandwich Ayam",         description: "Roti lapis dengan ayam grilled, keju, lettuce, dan saus mayo", price: 30000, image: `${IMG}/sandwich.svg`,      categoryId: food.id, order: 10 }}),
    prisma.menuItem.create({ data: { name: "Roti Canai Mentega",    description: "Roti canai crispy di luar, lembut di dalam", price: 18000, image: `${IMG}/roti-canai.svg`,    categoryId: food.id, order: 11 }}),
    prisma.menuItem.create({ data: { name: "Indomie Goreng",        description: "Indomie goreng spesial dengan telur dan topping lengkap", price: 22000, image: `${IMG}/indomie.svg`,       categoryId: food.id, order: 12 }}),
    prisma.menuItem.create({ data: { name: "Chicken Caesar Salad",  description: "Salad romaine dengan grilled chicken, parmesan, dan caesar dressing", price: 42000, image: `${IMG}/caesar-salad.svg`,categoryId: food.id, order: 13 }}),
    prisma.menuItem.create({ data: { name: "Gado-Gado",             description: "Sayuran rebus dengan bumbu kacang, tahu, tempe, dan lontong", price: 35000, image: `${IMG}/gado-gado.svg`,    categoryId: food.id, order: 14 }}),
  ]);

  /* ─── SNACKS (10) ─── */
  await Promise.all([
    prisma.menuItem.create({ data: { name: "Croissant Butter",       description: "French butter croissant — flaky, buttery, fresh from oven", price: 25000, image: `${IMG}/croissant.svg`,      categoryId: snacks.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Croissant Coklat",       description: "Croissant dengan dark chocolate filling — flaky dan rich", price: 28000, image: `${IMG}/croissant-choco.svg`, categoryId: snacks.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Banana Bread",           description: "Banana cake homemade yang moist dengan cinnamon topping", price: 25000, image: `${IMG}/banana-bread.svg`,  categoryId: snacks.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Blueberry Cheesecake",    description: "Cheesecake NY style dengan topping blueberry compote", price: 35000, image: `${IMG}/cheesecake.svg`,   categoryId: snacks.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Brownie",               description: "Fudgy dark chocolate brownie — dense, rich, perfect", price: 28000, image: `${IMG}/brownie.svg`,       categoryId: snacks.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Chocolate Muffin",         description: "Chocolate chip muffin yang fluffy dengan choco chips topping", price: 22000, image: `${IMG}/muffin.svg`,        categoryId: snacks.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Pisang Goreng Keju",     description: "Pisang goreng crispy dengan topping keju parut dan susu kental", price: 18000, image: `${IMG}/pisang-goreng.svg`,categoryId: snacks.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "Tahu Crispy",            description: "Tahu goreng crispy dengan saus pilihan", price: 15000, image: `${IMG}/tahu-crispy.svg`,   categoryId: snacks.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Dimsum 6 Pcs",          description: "Dimsum ayam + udang dengan saus sambal dan cuka", price: 32000, image: `${IMG}/dimsum.svg`,        categoryId: snacks.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Lumpia Goreng",         description: "Lumpia goreng crispy dengan isi ayam dan sayuran", price: 28000, image: `${IMG}/lumpia.svg`,        categoryId: snacks.id, order: 10 }}),
  ]);

  /* ─── MINUMAN SEGAR (12) ─── */
  await Promise.all([
    prisma.menuItem.create({ data: { name: "Strawberry Milkshake",   description: "Susu kocok segar dengan strawberry puree — creamy dan fruity", price: 32000, image: `${IMG}/milkshake.svg`,     categoryId: drinks.id, order: 1  }}),
    prisma.menuItem.create({ data: { name: "Chocolate Milkshake",    description: "Milkshake coklat dengan whipped cream dan choco chips", price: 32000, image: `${IMG}/choco-milkshake.svg`, categoryId: drinks.id, order: 2  }}),
    prisma.menuItem.create({ data: { name: "Mango Smoothie",        description: "Smoothie mangga segar dengan yoghurt dan madu", price: 30000, image: `${IMG}/mango-smoothie.svg`, categoryId: drinks.id, order: 3  }}),
    prisma.menuItem.create({ data: { name: "Strawberry Smoothie",     description: "Smoothie stroberi segar dengan milk dan madu", price: 30000, image: `${IMG}/strawberry-smoothie.svg`,categoryId: drinks.id, order: 4  }}),
    prisma.menuItem.create({ data: { name: "Fresh Orange Juice",    description: "Jeruk peras segar tanpa gula tambahan — 100% natural", price: 25000, image: `${IMG}/orange-juice.svg`, categoryId: drinks.id, order: 5  }}),
    prisma.menuItem.create({ data: { name: "Watermelon Smoothie",   description: "Smoothie semangka segar dengan mint — super hydrating", price: 28000, image: `${IMG}/watermelon.svg`,   categoryId: drinks.id, order: 6  }}),
    prisma.menuItem.create({ data: { name: "Avocado Smoothie",       description: "Jus alpukat segar dengan susu dan sedikit vanilla — creamy & healthy", price: 28000, image: `${IMG}/avocado.svg`,       categoryId: drinks.id, order: 7  }}),
    prisma.menuItem.create({ data: { name: "Coconut Water",          description: "Air kelapa segar dari kelapa — natural electrolyte drink", price: 20000, image: `${IMG}/coconut-water.svg`, categoryId: drinks.id, order: 8  }}),
    prisma.menuItem.create({ data: { name: "Yoghurt Smoothie",       description: "Smoothie yoghurt probiotik dengan buah seasonal", price: 28000, image: `${IMG}/yoghurt-smoothie.svg`,categoryId: drinks.id, order: 9  }}),
    prisma.menuItem.create({ data: { name: "Es Teh Manis",           description: "Teh es segar dengan gula aren — classic Indonesian drink", price: 12000, image: `${IMG}/es-teh.svg`,        categoryId: drinks.id, order: 10 }}),
    prisma.menuItem.create({ data: { name: "Teh Tarik",             description: "Teh tarik hangat/dingin — creamy dan frothy khas mamak", price: 18000, image: `${IMG}/teh-tarik.svg`,    categoryId: drinks.id, order: 11 }}),
    prisma.menuItem.create({ data: { name: "Bajigur",               description: "Minuman hangat dari kelapa, gula aren, dan jahe — cozy banget", price: 18000, image: `${IMG}/bajigur.svg`,      categoryId: drinks.id, order: 12 }}),
  ]);

  /* ─── SAMPLE ORDERS ─── */
  const [espresso, americano, latte, mocha, cappuccino, coldBrew, v60, matcha, chocolate, lemon, nasiGoreng, frenchFries, spaghetti, croissant] = await prisma.menuItem.findMany({
    orderBy: { id: "asc" },
    take: 20,
  });

  const o1 = await prisma.order.create({ data: { customerName: "Budi",   tableNumber: "3", status: "done",       paymentMethod: "cash",  paymentStatus: "paid", paidAt: new Date(), total: 58000 } });
  const o2 = await prisma.order.create({ data: { customerName: "Ani",    tableNumber: "1", status: "done",       paymentMethod: "cash",  paymentStatus: "paid", paidAt: new Date(), total: 58000 } });
  const o3 = await prisma.order.create({ data: { customerName: "Charlie", tableNumber: "5", status: "processed",  paymentMethod: "qris",  paymentStatus: "paid", paidAt: new Date(), total: 68000 } });
  const o4 = await prisma.order.create({ data: { customerName: "Dewi",   tableNumber: "2", status: "done",       paymentMethod: "cash",  paymentStatus: "paid", paidAt: new Date(), total: 50000 } });
  const o5 = await prisma.order.create({ data: { customerName: "Edo",    tableNumber: "7", status: "pending",     paymentMethod: "va_bca", paymentStatus: "unpaid", total: 92000 } });

  await prisma.orderItem.createMany({ data: [
    { orderId: o1.id, menuItemId: cappuccino.id, quantity: 1, price: 28000 },
    { orderId: o1.id, menuItemId: frenchFries.id, quantity: 1, price: 22000 },
    { orderId: o1.id, menuItemId: espresso.id, quantity: 1, price: 8000 },
  ]});
  await prisma.orderItem.createMany({ data: [
    { orderId: o2.id, menuItemId: latte.id, quantity: 1, price: 28000 },
    { orderId: o2.id, menuItemId: matcha.id, quantity: 1, price: 30000 },
  ]});
  await prisma.orderItem.createMany({ data: [
    { orderId: o3.id, menuItemId: mocha.id, quantity: 1, price: 30000 },
    { orderId: o3.id, menuItemId: spaghetti.id, quantity: 1, price: 38000 },
  ]});
  await prisma.orderItem.createMany({ data: [
    { orderId: o4.id, menuItemId: americano.id, quantity: 2, price: 20000 },
    { orderId: o4.id, menuItemId: croissant.id, quantity: 1, price: 10000 },
  ]});
  await prisma.orderItem.createMany({ data: [
    { orderId: o5.id, menuItemId: nasiGoreng.id, quantity: 1, price: 38000 },
    { orderId: o5.id, menuItemId: lemon.id, quantity: 2, price: 18000 },
    { orderId: o5.id, menuItemId: cappuccino.id, quantity: 1, price: 18000 },
  ]});

  /* ─── SAMPLE FEEDBACK ─── */
  await prisma.feedback.createMany({ data: [
    { customerName: "Budi",   rating: 5, message: "Kopinya enak banget! Caffè Latte-nya creamy, croissantnya fresh." },
    { customerName: "Ani",    rating: 4, message: "Matcha Latte-nya pass sweetnessnya. WiFi kenceng, cocok buat kerja." },
    { customerName: "Dewi",   rating: 5, message: "Suasananya cozy. Harga standar kopi di mall." },
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
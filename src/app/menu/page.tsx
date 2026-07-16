"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Coffee, Plus } from "lucide-react";
import type { MenuItem, CartItem } from "@/types";
import type { PaymentMethod } from "@/lib/payment";
import MenuHeader from "@/components/MenuHeader";
import CategoryTabs from "@/components/CategoryTabs";
import MenuItemCard from "@/components/MenuItemCard";
import CartSummary from "@/components/CartSummary";
import CartDrawer from "@/components/CartDrawer";
import OrderConfirm from "@/components/OrderConfirm";

const Skeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-28 rounded-2xl bg-white/[0.04]" />
    ))}
  </div>
);

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCat, setActiveCat] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [featured, setFeatured] = useState<any>(null);
  const [tableOrders, setTableOrders] = useState<any[]>([]);
  const [tableOrdersLoaded, setTableOrdersLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("table");
    if (t) {
      setTable(t);
      fetch("/api/orders?table=" + encodeURIComponent(t))
        .then((r) => r.json())
        .then((data) => setTableOrders(data))
        .finally(() => setTableOrdersLoaded(true));
    } else {
      setTableOrdersLoaded(true);
    }

    fetch("/api/menu")
      .then((r) => { if (!r.ok) throw new Error("Gagal muat menu"); return r.json(); })
      .then((data) => {
        setMenu(data);
        const all = data.flatMap((c: any) => c.items || []);
        if (all.length > 0) setFeatured(all[Math.floor(Math.random() * all.length)]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  function addItem(item: MenuItem) {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      return exist
        ? prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  }

  function updateQty(id: number, delta: number) {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)).filter((i) => i.qty > 0)
    );
  }

  async function submitOrder(method: PaymentMethod = "cash") {
    try {
      const items = cart.map((i) => ({ id: i.id, quantity: i.qty }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name || "Anonim", tableNumber: table, items, paymentMethod: method }),
      });
      if (!res.ok) throw new Error("Gagal kirim pesanan");
      const order = await res.json();
      setCart([]);
      setName("");
      setTable("");
      if (method === "cash") {
        setLastOrder({ ...order, items: cart });
        setSubmitted(true);
      } else {
        window.location.href = `/payment/${order.id}`;
      }
    } catch {
      alert("Gagal kirim pesanan. Coba lagi.");
    }
  }

  async function submitFeedback() {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name || "Anonim", rating, message: feedback }),
      });
      if (!res.ok) throw new Error("Gagal kirim feedback");
      setFeedback("");
      setRating(5);
    } catch {
      alert("Gagal kirim feedback");
    }
  }

  const perPage = 6;
  const categories = menu;
  const cat = categories[activeCat] || null;
  const totalPages = cat ? Math.ceil(cat.items.length / perPage) : 0;
  const paginatedItems = cat?.items.slice(page * perPage, (page + 1) * perPage) ?? [];

  function selectCat(i: number) { setActiveCat(i); setPage(0); }

  return (
    <div className="min-h-dvh bg-[#0C0A09] antialiased">
      <div className="relative z-10">
        <MenuHeader itemCount={totalItems} />

        <main className="pb-32">
          {submitted ? (
            <div className="max-w-lg mx-auto px-4 pt-6 md:pt-10">
              <OrderConfirm
                order={lastOrder}
                rating={rating}
                onRatingChange={setRating}
                feedback={feedback}
                onFeedbackChange={setFeedback}
                onSubmitFeedback={submitFeedback}
                onOrderAgain={() => { setSubmitted(false); setLastOrder(null); }}
              />
            </div>
          ) : (
            <>
              <section className="px-5 pt-24 pb-12 md:pb-16">
                <div className="max-w-lg md:max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-coffee-500/10 border border-coffee-500/20 flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-coffee-300" />
                      </div>
                      <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Brew & Co.</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                      Selamat Datang
                    </h1>
                    <p className="text-sm md:text-base text-white/40 max-w-md leading-relaxed">
                      Scan QR meja, pesan langsung dari HP — minuman & makanan siap sebelum lo turun.
                    </p>
                  </motion.div>
                </div>
              </section>

              <div className="max-w-lg md:max-w-7xl mx-auto px-5 md:px-8">
                {loading ? (
                  <div className="pt-4">
                    <Skeleton />
                  </div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/[0.04] flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white/30" />
                    </div>
                    <p className="text-white/60 font-medium text-sm">{error}</p>
                    <button
                      onClick={() => { setLoading(true); setError(""); fetch("/api/menu").then((r) => r.json()).then(setMenu).catch((e) => setError(e.message)).finally(() => setLoading(false)); }}
                      className="mt-4 px-5 py-2.5 bg-white/[0.06] text-white/70 rounded-xl text-sm font-medium hover:bg-white/[0.1] transition-all"
                    >
                      Coba Lagi
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {table && tableOrdersLoaded && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6"
                      >
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tableOrders.length > 0 ? "bg-white/[0.06]" : "bg-white/[0.04]"}`}>
                              <span className="text-sm">{tableOrders.length > 0 ? "☕" : "─"}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white/80">Meja {table}</span>
                                {tableOrders.length > 0 && (
                                  <span className="text-[10px] font-medium text-white/40 bg-white/[0.06] px-2 py-0.5 rounded-full">
                                    {tableOrders.length} pesanan
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/30 mt-0.5">
                                {tableOrders.length > 0 ? "Ada pesanan aktif — pesanan baru akan ditambahkan" : "Siap pesan"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {featured && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05, duration: 0.3 }}
                        className="mb-6"
                      >
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                            <Coffee className="w-6 h-6 text-white/20" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Rekomendasi</span>
                            </div>
                            <h3 className="text-sm font-semibold text-white truncate">{featured.name}</h3>
                            <p className="text-xs text-white/30 mt-0.5 line-clamp-1">{featured.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-white/80">Rp{featured.price.toLocaleString("id")}</p>
                            <button
                              onClick={() => addItem(featured)}
                              className="mt-1.5 px-3 py-1.5 text-xs font-medium bg-white/[0.06] text-white/70 rounded-lg hover:bg-white/[0.1] transition-all"
                            >
                              + Tambah
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="pt-2">
                      <CategoryTabs categories={categories} active={activeCat} onSelect={selectCat} />
                    </div>

                    <div className="mt-6 mb-3 flex items-center justify-between">
                      <p className="text-xs text-white/30">
                        {cat?.items.length || 0} item
                        {totalPages > 1 && ` · halaman ${page + 1}/${totalPages}`}
                      </p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeCat}-${page}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                      >
                        {paginatedItems.map((item: MenuItem, i: number) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.3 }}
                          >
                            <MenuItemCard item={item} onAdd={addItem} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1.5 mt-6">
                        <button
                          onClick={() => setPage(Math.max(0, page - 1))}
                          disabled={page === 0}
                          className="w-8 h-8 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all disabled:opacity-20 disabled:pointer-events-none"
                        >
                          ←
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                              i === page
                                ? "bg-white/[0.08] text-white"
                                : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                          disabled={page >= totalPages - 1}
                          className="w-8 h-8 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all disabled:opacity-20 disabled:pointer-events-none"
                        >
                          →
                        </button>
                      </div>
                    )}

                    <CartSummary itemCount={totalItems} total={total} onOpen={() => setShowCart(true)} />
                    <CartDrawer
                      items={cart}
                      open={showCart}
                      onClose={() => setShowCart(false)}
                      onUpdateQty={updateQty}
                      name={name}
                      onNameChange={setName}
                      table={table}
                      onTableChange={setTable}
                      total={total}
                      onSubmit={submitOrder}
                      onPaymentMethodChange={setPaymentMethod}
                      paymentMethod={paymentMethod}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

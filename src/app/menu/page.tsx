"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ShoppingBag, Coffee, CheckCircle2, AlertCircle } from "lucide-react";
import type { MenuItem, CartItem, Category, ConfirmedOrder } from "@/types";
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
      <div key={i} className="h-28 rounded-none bg-cream-100 border border-cream-200" />
    ))}
  </div>
);

// GET /api/orders?table=N → kartu riwayat pesanan aktif per meja
type TableOrder = { id: number; status: string; total: number; createdAt: string };

export default function MenuPage() {
  const [menu, setMenu] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCat, setActiveCat] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState<ConfirmedOrder | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [featured, setFeatured] = useState<MenuItem | null>(null);
  const [tableOrders, setTableOrders] = useState<TableOrder[]>([]);
  const [tableOrdersLoaded, setTableOrdersLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [tableLocked, setTableLocked] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    // ponytail: init ?table= dijalankan di async IIFE (bukan sync di body effect) biar
    // gak cascade render; efeknya sama — jalan pas mount, sebelum user sempat ngetik
    (async () => {
      const t = new URLSearchParams(window.location.search).get("table");
      if (!t) {
        setTableOrdersLoaded(true);
      } else {
        setTable(t);
        setTableLocked(true);
        try {
          const r = await fetch("/api/orders?table=" + encodeURIComponent(t));
          setTableOrders(await r.json());
        } finally {
          setTableOrdersLoaded(true);
        }
      }
    })();

    fetch("/api/menu")
      .then((r) => { if (!r.ok) throw new Error("Gagal muat menu"); return r.json(); })
      .then((data: Category[]) => {
        setMenu(data);
        const all = data.flatMap((c) => c.items || []);
        if (all.length > 0) setFeatured(all[Math.floor(Math.random() * all.length)]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    // ponytail: restore order online yang belum dibayar biar nggak hilang waktu tab/payment ditutup
    (async () => {
      try {
        const raw = localStorage.getItem("brewflow:pendingOrder");
        if (!raw) return;
        const stored = JSON.parse(raw);
        if (!stored?.id) return localStorage.removeItem("brewflow:pendingOrder");
        const r = await fetch(`/api/payment/${stored.id}?t=${encodeURIComponent(stored.orderToken || "")}`);
        const data = r.ok ? await r.json() : null;
        if (data && data.paymentStatus !== "paid" && data.status !== "cancelled") {
          setLastOrder({ ...stored, paymentStatus: data.paymentStatus, status: data.status });
          setSubmitted(true);
        } else {
          localStorage.removeItem("brewflow:pendingOrder");
        }
      } catch {
        localStorage.removeItem("brewflow:pendingOrder");
      }
    })();
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
    // ponytail: lock sinkron — klik 2x sebelum re-render tetap cuma bikin 1 order
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    try {
      const items = cart.map((i) => ({ id: i.id, quantity: i.qty }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name || "Anonim", tableNumber: table, items, paymentMethod: method }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Gagal kirim pesanan");
      }
      const order = await res.json();
      setCart([]);
      setName("");
      if (!tableLocked) setTable("");
      if (method === "cash") {
        setLastOrder({ ...order, items: cart });
        setSubmitted(true);
      } else {
        localStorage.setItem("brewflow:pendingOrder", JSON.stringify({ ...order, items: cart }));
        window.location.href = `/payment/${order.id}?t=${encodeURIComponent(order.orderToken || "")}`;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal kirim pesanan. Coba lagi.";
      showToast("error", msg);
    } finally {
      submitLock.current = false;
      setSubmitting(false);
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
      showToast("success", "Thanks! Feedback terkirim ☕");
    } catch {
      showToast("error", "Gagal kirim feedback");
    }
  }

  const perPage = 6;
  const categories = menu;
  const cat = categories[activeCat] || null;
  const totalPages = cat ? Math.ceil(cat.items.length / perPage) : 0;
  const paginatedItems = cat?.items.slice(page * perPage, (page + 1) * perPage) ?? [];
  const cartQtyMap = Object.fromEntries(cart.map((i) => [i.id, i.qty]));

  function selectCat(i: number) { setActiveCat(i); setPage(0); }

  return (
    <div className="min-h-dvh bg-cream-50 antialiased">
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
                onOrderAgain={() => { setSubmitted(false); setLastOrder(null); localStorage.removeItem("brewflow:pendingOrder"); }}
              />
            </div>
          ) : (
            <>
              <section className="px-5 pt-24 pb-12 md:pb-16">
                <div className="max-w-lg md:max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3"
                  >
                    <span className="text-xs text-coffee-500 uppercase tracking-widest">Brew &amp; Co.</span>
                    <h1 className="text-3xl md:text-4xl font-semibold text-coffee-950 leading-tight tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                      Pilih menumu
                    </h1>
                    <p className="text-sm text-coffee-800/65 max-w-md leading-relaxed">
                      Pesan langsung dari meja — diantar tanpa antre.
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
                    <div className="w-12 h-12 mx-auto mb-4 rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-coffee-800/70" />
                    </div>
                    <p className="text-coffee-950 font-medium text-sm">{error}</p>
                    <button
                      onClick={() => { setLoading(true); setError(""); fetch("/api/menu").then((r) => r.json()).then(setMenu).catch((e) => setError(e.message)).finally(() => setLoading(false)); }}
                      className="mt-4 px-5 py-2.5 bg-white border border-cream-200 text-coffee-800 rounded-none text-sm font-medium hover:bg-cream-100 transition-all"
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
                        <div className="mb-6 border-b border-cream-200 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-coffee-950">Meja {table}</span>
                                {tableOrders.length > 0 && (
                                  <span className="text-[10px] text-coffee-800/70">
                                    {tableOrders.length} pesanan aktif
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-coffee-800/70 mt-0.5">
                                {tableOrders.length > 0 ? "Pesanan baru akan ditambahkan" : "Siap pesan"}
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
                        <div className="mb-6 flex items-center gap-4 py-3 border-b border-cream-200">
                          <div className="w-12 h-12 rounded-none bg-cream-100 border border-cream-200 overflow-hidden shrink-0 relative">
                            {featured.image ? (
                              <Image src={featured.image} alt={featured.name} fill className="object-cover" sizes="48px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Coffee className="w-5 h-5 text-coffee-800/70" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-coffee-500 uppercase tracking-wider">Rekomendasi</span>
                            <h3 className="text-sm font-medium text-coffee-950 truncate">{featured.name}</h3>
                            <p className="text-xs text-coffee-800/70 mt-0.5 line-clamp-1">{featured.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm text-coffee-800 font-mono">Rp{featured.price.toLocaleString("id")}</p>
                            <button
                              onClick={() => addItem(featured)}
                              className="mt-1.5 px-3 py-1.5 text-xs text-coffee-800 border border-cream-200 bg-white rounded-none hover:bg-cream-100 transition-colors"
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
                      <p className="text-xs text-coffee-800/70">
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
                            <MenuItemCard item={item} qty={cartQtyMap[item.id] || 0} onAdd={addItem} onDec={(it) => updateQty(it.id, -1)} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1.5 mt-6">
                        <button
                          onClick={() => setPage(Math.max(0, page - 1))}
                          disabled={page === 0}
                          className="h-11 min-w-11 rounded-none text-xs text-coffee-800/70 hover:text-coffee-950 hover:bg-cream-100 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        >
                          ←
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`h-11 min-w-11 rounded-none text-xs font-medium transition-colors ${
                              i === page
                                ? "bg-coffee-500 text-white"
                                : "text-coffee-800/70 hover:text-coffee-950 hover:bg-cream-100"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                          disabled={page >= totalPages - 1}
                          className="h-11 min-w-11 rounded-none text-xs text-coffee-800/70 hover:text-coffee-950 hover:bg-cream-100 transition-colors disabled:opacity-40 disabled:pointer-events-none"
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
                      tableLocked={tableLocked}
                      total={total}
                      onSubmit={submitOrder}
                      submitting={submitting}
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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-none border shadow-lg max-w-[90vw] ${
              toast.type === "success"
                ? "bg-white border-emerald-200 text-emerald-800"
                : "bg-white border-red-200 text-red-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

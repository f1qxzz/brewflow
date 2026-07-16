"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Coffee, ClipboardList, UtensilsCrossed, MessageSquareText, QrCode, LogOut, TrendingUp, Clock, Star, DollarSign, ChevronRight, ShoppingBag, Zap } from "lucide-react";

export default function Admin() {
  const [token, setToken] = useState("");
  const [stats, setStats] = useState({ orders: 0, pending: 0, revenue: 0, feedback: 0, avgRating: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  function fetchData(t: string) {
    const headers = { "x-admin-token": t };
    Promise.all([
      fetch("/api/orders", { headers }).then((r) => r.json()),
      fetch("/api/feedback", { headers }).then((r) => r.json()),
    ]).then(([orders, feedback]) => {
      if (!orders.error) {
        const fb = Array.isArray(feedback) ? feedback : [];
        const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
        setStats({
          orders: orders.length,
          pending: pendingOrders,
          revenue: orders.reduce((s: number, o: any) => s + o.total, 0),
          feedback: fb.length,
          avgRating: fb.length > 0 ? fb.reduce((s: number, f: any) => s + f.rating, 0) / fb.length : 0,
        });
        setRecentOrders(orders.slice(-5).reverse());
      }
    });
  }

  useEffect(() => {
    const t = sessionStorage.getItem("admin_token") || "";
    setToken(t);
    if (!t) return;

    fetchData(t);
    const interval = setInterval(() => fetchData(t), 8000);
    return () => clearInterval(interval);
  }, []);

  function logout() {
    sessionStorage.removeItem("admin_token");
    window.location.reload();
  }

  const navLinks = [
    { href: "/admin/orders", icon: ClipboardList, label: "Pesanan", desc: "Lihat & kelola pesanan masuk", color: "bg-coffee-500", gradient: "from-coffee-400 to-coffee-600", badge: stats.pending > 0 ? `${stats.pending}` : "" },
    { href: "/admin/menu", icon: UtensilsCrossed, label: "Menu", desc: "Atur daftar menu, kategori, harga", color: "bg-amber-500", gradient: "from-amber-400 to-amber-600" },
    { href: "/admin/feedback", icon: MessageSquareText, label: "Feedback", desc: "Rating & komentar pelanggan", color: "bg-emerald-500", gradient: "from-emerald-400 to-emerald-600" },
    { href: "/admin/qr", icon: QrCode, label: "QR Code", desc: "Generate QR untuk meja", color: "bg-stone-500", gradient: "from-stone-400 to-stone-600" },
  ];

  const statCards = [
    { icon: ShoppingBag, value: stats.orders.toString(), label: "Total Pesanan", color: "from-coffee-400 to-coffee-600", suffix: "" },
    { icon: Clock, value: stats.pending.toString(), label: "Pending", color: "from-amber-400 to-amber-600", suffix: "", highlight: stats.pending > 0 },
    { icon: DollarSign, value: `Rp${(stats.revenue / 1000).toFixed(0)}k`, label: "Revenue", color: "from-emerald-400 to-emerald-600", suffix: "" },
    { icon: Star, value: stats.avgRating.toFixed(1), label: "Rating", color: "from-amber-400 to-amber-600", suffix: "" },
  ];

  const statusStyle: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    processed: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    done: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-300 border-red-500/20",
  };

  return (
    <div className="min-h-dvh bg-[#0C0A09]">

      <div className="relative z-10">
        <header className="sticky top-0 z-30 bg-[#0C0A09] border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-coffee-500 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  Brew <span className="text-coffee-400">&</span> Co.
                </h1>
              </div>
              <span className="text-[11px] text-white/30 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] ml-1">Admin</span>
            </div>
            <button onClick={logout} className="text-xs text-white/40 flex items-center gap-1.5 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06]">
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Dashboard</h2>
              <p className="text-sm text-white/40 mt-0.5">Overview bisnis Brew & Co.</p>
            </div>
            <Link
              href="/admin/orders"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-coffee-500 text-white text-sm font-medium hover:bg-coffee-400 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Lihat Pesanan Baru
              {stats.pending > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20">{stats.pending}</span>
              )}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-2xl bg-white/[0.03] border ${s.highlight ? "border-amber-500/30" : "border-white/[0.06]"} p-4 md:p-5 overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-coffee-500 flex items-center justify-center`}>
                    <s.icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  {s.highlight && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Main grid: Recent Orders + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pesanan Terbaru</h3>
                <Link href="/admin/orders" className="text-xs text-coffee-400 hover:text-coffee-300 transition-colors">Lihat semua →</Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-white/20" />
                  <p className="text-sm text-white/30">Belum ada pesanan</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((o, i) => (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-coffee-500/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-coffee-300">#{o.id}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{o.customerName || "Anonim"}</p>
                          <p className="text-[11px] text-white/30">
                            Meja {o.tableNumber || "-"} &middot; {o.items?.length || 0} item
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-semibold text-white/80">Rp{(o.total || 0).toLocaleString("id")}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusStyle[o.status] || "bg-white/[0.04] text-white/30 border-white/[0.06]"}`}>
                          {o.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Menu Cepat</h3>
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] active:scale-[0.98] transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${l.gradient} flex items-center justify-center shadow-sm shrink-0`}>
                      <l.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-white group-hover:text-coffee-200 transition-colors">{l.label}</p>
                        {l.badge && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">{l.badge}</span>}
                      </div>
                      <p className="text-[11px] text-white/40 mt-0.5">{l.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

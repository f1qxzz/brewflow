"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coffee, ClipboardList, UtensilsCrossed, MessageSquareText, QrCode, LogOut, ChevronRight, ShoppingBag, CalendarDays } from "lucide-react";
import FadeUp from "@/components/FadeUp";

// tanggal + jam pesanan, zona lokal yang sama dengan filter omset harian
function fmtDateTime(v: string | Date) {
  const d = new Date(v);
  return `${d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })} ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
}

type DashboardOrder = {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  customerName?: string;
  tableNumber?: string;
  items?: { id?: number; quantity?: number }[];
};

type DashboardFeedback = { rating: number };

export default function Admin() {
  const [stats, setStats] = useState({ orders: 0, pending: 0, revenue: 0, todayOrders: 0, todayRevenue: 0, feedback: 0, avgRating: 0 });
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
  const [period, setPeriod] = useState<"today" | "all">("today");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  function fetchData(t: string) {
    const headers = { "x-admin-token": t };
    Promise.all([
      fetch("/api/orders", { headers }).then((r) => r.json() as Promise<DashboardOrder[] | { error: string }>),
      fetch("/api/feedback", { headers }).then((r) => r.json() as Promise<DashboardFeedback[] | { error: string }>),
    ]).then(([orders, feedback]) => {
      if (Array.isArray(orders)) {
        const fb: DashboardFeedback[] = Array.isArray(feedback) ? feedback : [];
        const pendingOrders = orders.filter((o) => o.status === "pending").length;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const todayOrders = orders.filter((o) => new Date(o.createdAt) >= startOfDay);
        setStats({
          orders: orders.length,
          pending: pendingOrders,
          revenue: orders.reduce((s, o) => s + o.total, 0),
          todayOrders: todayOrders.length,
          todayRevenue: todayOrders.reduce((s, o) => s + o.total, 0),
          feedback: fb.length,
          avgRating: fb.length > 0 ? fb.reduce((s, f) => s + f.rating, 0) / fb.length : 0,
        });
        // terbaru dulu, biar sinkron sama tanggal yang ditampilkan
        const sorted = [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        setRecentOrders(sorted.slice(0, 5));
      }
    });
  }

  useEffect(() => {
    const t = sessionStorage.getItem("admin_token") || "";
    if (!t) return;
    fetchData(t);
    const interval = setInterval(() => fetchData(t), 8000);
    return () => clearInterval(interval);
  }, []);

  function logout() {
    const t = sessionStorage.getItem("admin_token");
    if (t) {
      fetch("/api/logout", { method: "POST", headers: { "x-admin-token": t } }).catch(() => {});
    }
    sessionStorage.removeItem("admin_token");
    window.location.reload();
  }

  const navLinks = [
    { href: "/admin/orders", icon: ClipboardList, label: "Pesanan", desc: "Lihat & kelola pesanan masuk", badge: stats.pending > 0 ? `${stats.pending}` : "" },
    { href: "/admin/menu", icon: UtensilsCrossed, label: "Menu", desc: "Daftar menu, kategori, harga" },
    { href: "/admin/feedback", icon: MessageSquareText, label: "Feedback", desc: "Rating & komentar pelanggan" },
    { href: "/admin/qr", icon: QrCode, label: "QR Code", desc: "Generate QR untuk meja" },
  ];

  const fmtRp = (n: number) => "Rp" + n.toLocaleString("id");
  const displayRevenue = period === "today" ? stats.todayRevenue : stats.revenue;
  const displayOrders = period === "today" ? stats.todayOrders : stats.orders;
  const dateShort = now.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  const dateLong = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const clock = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" });

  const statCards = [
    { value: displayOrders.toString(), label: period === "today" ? `Pesanan ${dateShort}` : "Total pesanan" },
    { value: stats.pending.toString(), label: "Pending", highlight: stats.pending > 0 },
    { value: fmtRp(displayRevenue), label: period === "today" ? `Omset ${dateShort}` : "Omset total" },
    { value: stats.feedback > 0 ? stats.avgRating.toFixed(1) : "—", label: "Rating rata-rata" },
  ];

  const statusStyle: Record<string, string> = {
    pending: "text-amber-700",
    processed: "text-coffee-600",
    done: "text-emerald-700",
    cancelled: "text-red-600",
  };

  return (
    <div className="min-h-dvh bg-cream-50">
      <header className="sticky top-0 z-30 bg-white border-b border-cream-200">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-4 h-4 text-coffee-500" />
            <span className="text-sm font-semibold text-coffee-950" style={{ fontFamily: "var(--font-display)" }}>
              Brew & Co.
            </span>
            <span className="text-xs text-coffee-800/70 border-l border-cream-200 pl-2.5 ml-1">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-coffee-800/70 border-r border-cream-200 pr-3">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{dateShort}</span>
              <span className="text-coffee-950 tabular-nums">{clock}</span>
            </div>
            <button onClick={logout} className="text-xs text-coffee-800/70 flex items-center gap-1.5 hover:text-coffee-950 transition-colors px-3 py-1.5 rounded-none hover:bg-cream-100">
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        <FadeUp className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-coffee-950" style={{ fontFamily: "var(--font-display)" }}>Dashboard</h2>
            <p className="text-sm text-coffee-800/70 mt-0.5">
              Overview bisnis Brew & Co. · <span className="text-coffee-950">{dateLong}</span> · {clock}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-none bg-cream-100 border border-cream-200 p-0.5">
              {(["today", "all"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-none transition-all ${
                    period === p ? "bg-white text-coffee-950 shadow-sm" : "text-coffee-800/70 hover:text-coffee-950"
                  }`}
                >
                  {p === "today" ? "Hari ini" : "Semua"}
                </button>
              ))}
            </div>
            <Link
              href="/admin/orders"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-none bg-coffee-500 text-white text-sm font-medium hover:bg-coffee-600 transition-colors"
            >
              Pesanan baru
              {stats.pending > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/25">{stats.pending}</span>
              )}
            </Link>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {statCards.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.05}>
              <div
                className={`h-full rounded-none bg-white border p-4 ${s.highlight ? "border-amber-300" : "border-cream-200"}`}
              >
                <span className="text-[11px] text-coffee-800/70 block mb-1.5">{s.label}</span>
                <p className={`text-xl md:text-2xl font-semibold font-mono ${s.highlight ? "text-amber-700" : "text-coffee-950"}`}>{s.value}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FadeUp delay={0.1} className="lg:col-span-2 h-full">
            <div className="h-full rounded-none bg-white border border-cream-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-coffee-950">Pesanan terbaru</h3>
              <Link href="/admin/orders" className="text-xs text-coffee-800/70 hover:text-coffee-500 transition-colors">Lihat semua →</Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-coffee-800/25" />
                <p className="text-sm text-coffee-800/70">Belum ada pesanan</p>
              </div>
            ) : (
              <div className="divide-y divide-cream-200">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-3 first:pt-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-coffee-800/70 shrink-0">#{o.id}</span>
                      <div className="min-w-0">
                        <p className="text-sm text-coffee-950 truncate">{o.customerName || "Anonim"}</p>
                        <p className="text-xs text-coffee-800/70">
                          Meja {o.tableNumber || "-"} · {o.items?.length || 0} item ·{" "}
                          <span className="font-mono tabular-nums">{fmtDateTime(o.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm text-coffee-950 font-mono">{fmtRp(o.total || 0)}</span>
                      <span className={`text-xs font-medium ${statusStyle[o.status] || "text-coffee-800/70"}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h3 className="text-sm font-medium text-coffee-950 mb-3">Menu cepat</h3>
            <div className="divide-y divide-cream-200 rounded-none bg-white border border-cream-200">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-cream-100 transition-colors group first:rounded-t-none last:rounded-b-none"
                >
                  <l.icon className="w-4 h-4 text-coffee-800/70 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-coffee-950 group-hover:text-coffee-500 transition-colors">{l.label}</p>
                      {l.badge && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">{l.badge}</span>}
                    </div>
                    <p className="text-xs text-coffee-800/70 mt-0.5">{l.desc}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-coffee-800/25 group-hover:text-coffee-500 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </FadeUp>
        </div>
      </main>
    </div>
  );
}

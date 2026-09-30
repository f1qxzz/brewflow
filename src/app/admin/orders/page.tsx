"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Check, X, Coffee, TrendingUp, Trash2 } from "lucide-react";
import { useAdminToken } from "../layout";
import FadeUp from "@/components/FadeUp";

const statusMeta: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "Menunggu", color: "bg-amber-50 text-amber-800 border-amber-200", icon: <Clock className="w-3 h-3" /> },
  processed: { label: "Diproses", color: "bg-coffee-100 text-coffee-600 border-coffee-200", icon: <Coffee className="w-3 h-3" /> },
  done:      { label: "Selesai",  color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { label: "Batal",    color: "bg-red-50 text-red-700 border-red-200",   icon: <XCircle className="w-3 h-3" /> },
};

const paymentMeta: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  paid:    { label: "Lunas",        color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <Check className="w-3 h-3" /> },
  unpaid:  { label: "Belum Bayar", color: "bg-amber-50 text-amber-800 border-amber-200",    icon: <Clock className="w-3 h-3" /> },
  expired: { label: "Expired",     color: "bg-red-50 text-red-700 border-red-200",         icon: <X className="w-3 h-3" /> },
  failed:  { label: "Gagal",       color: "bg-red-50 text-red-700 border-red-200",         icon: <X className="w-3 h-3" /> },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  qris: "QRIS", va_bca: "BCA VA", va_mandiri: "Mandiri VA", va_bni: "BNI VA", gopay: "GoPay", cash: "Tunai",
};

// tanggal + jam pesanan, zona lokal yang sama dengan filter omset harian
function fmtDateTime(v: string | Date) {
  const d = new Date(v);
  return `${d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })} ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
}

type AdminOrder = {
  id: number;
  status: string;
  createdAt: string;
  total?: number;
  customerName?: string;
  tableNumber?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  items?: { id?: number; quantity?: number; menuItem?: { name?: string } }[];
};

const beep = (() => {
  let ac: AudioContext | null = null;
  return () => {
    try {
      // ponytail: prefix webkit buat Safari lama
      ac ||= new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g);
      g.connect(ac.destination);
      o.type = "sine";
      g.gain.setValueAtTime(0.001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.frequency.setValueAtTime(880, t);
      o.frequency.setValueAtTime(1318, t + 0.2);
      o.start(t);
      o.stop(t + 0.5);
    } catch {}
  };
})();

export default function OrdersPage() {
  const token = useAdminToken();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let alive = true;
    let first = true;
    const known = new Set<number>();

    const load = () =>
      fetch("/api/orders", { headers: { "x-admin-token": token } })
        .then((r) => r.json() as Promise<AdminOrder[] | { error?: string }>)
        .then((data) => {
          if (!alive || !Array.isArray(data)) return;
          const ids = new Set<number>(data.map((o) => o.id));
          if (!first && [...ids].some((id) => !known.has(id))) {
            beep(); // pesanan baru masuk = bunyi + flash header
            setFlash(true);
            setTimeout(() => alive && setFlash(false), 1600);
          }
          first = false;
          ids.forEach((id) => known.add(id));
          setOrders(data);
        })
        .catch(() => {});

    load();
    const interval = setInterval(load, 6000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [token]);

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/orders`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  async function deleteOrder(id: number) {
    if (!confirm("Hapus pesanan ini?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  async function verifyPayment(id: number) {
    const res = await fetch(`/api/payment/${id}/verify`, {
      method: "POST",
      headers: { "x-admin-token": token },
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus: "paid", status: "processed" } : o)));
    }
  }

  const groups = ["pending", "processed", "done", "cancelled"];
  // terbaru dulu di tiap kelompok status
  const sortedOrders = [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const grouped = groups.map((s) => ({ status: s, orders: sortedOrders.filter((o) => o.status === s) }));
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="min-h-dvh bg-cream-50">
      <div className="relative z-10">
        <header className={`sticky top-0 z-30 border-b transition-colors duration-300 ${flash ? "bg-coffee-500 border-coffee-600" : "bg-white border-cream-200"}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center gap-3">
            <Link href="/admin" className="w-8 h-8 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors">
              <ArrowLeft className="w-4 h-4 text-coffee-800/70" />
            </Link>
            <h1 className="font-bold text-coffee-950">Pesanan</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <FadeUp className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-3 p-3 rounded-none bg-white border border-cream-200 flex-1">
              <div className="w-9 h-9 rounded-none bg-coffee-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-coffee-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-coffee-800/70">Total Pesanan</p>
                <p className="text-lg font-bold text-coffee-950">{orders.length} pesanan</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-coffee-800/70">Revenue</p>
                <p className="text-sm font-bold text-coffee-500 font-mono">Rp{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </FadeUp>

          {orders.length === 0 ? (
            <FadeUp className="text-center py-20">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-coffee-800/30" />
              </div>
              <p className="text-coffee-800/70 font-medium">Belum ada pesanan</p>
            </FadeUp>
          ) : (
            <div className="space-y-6">
              {grouped.map((g, gi) =>
                g.orders.length > 0 ? (
                  <FadeUp key={g.status} delay={Math.min(gi, 3) * 0.06}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusMeta[g.status]?.color || ""}`}>
                        {statusMeta[g.status]?.icon} {statusMeta[g.status]?.label || g.status}
                      </span>
                      <span className="text-xs text-coffee-800/70">({g.orders.length})</span>
                    </div>
                    {/* items-start: card gak ikut stretch setinggi teman satu baris → gak ada kosong di bawah */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
                      {g.orders.map((order) => {
                        const meta = statusMeta[order.status] || statusMeta.pending;
                        const payMeta = order.paymentStatus ? paymentMeta[order.paymentStatus] : undefined;
                        const methodLabel = order.paymentMethod ? PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod : "";
                        return (
                          <div key={order.id} className="bg-white rounded-none border border-cream-200 overflow-hidden hover:border-cream-300 transition-all group">
                            <div className="px-4 py-3 flex items-center justify-between border-b border-cream-200">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-coffee-950">#{order.id}</span>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${meta.color}`}>
                                  {meta.icon} {meta.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-coffee-800/70 font-mono tabular-nums">
                                  {fmtDateTime(order.createdAt)}
                                </span>
                                <button onClick={() => deleteOrder(order.id)}
                                  className="w-6 h-6 rounded-full bg-cream-100 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-all">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="px-4 py-2 bg-cream-50 text-xs text-coffee-800/65 flex items-center gap-2 border-b border-cream-200 flex-wrap">
                              <span className="font-medium text-coffee-950">{order.customerName || "Anonim"}</span>
                              <span className="text-coffee-800/30">•</span>
                              <span>Meja {order.tableNumber || "-"}</span>
                              <span className="text-coffee-800/30">•</span>
                              <span className="text-coffee-800/70">{methodLabel}</span>
                              <span className="text-coffee-800/30">•</span>
                              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${payMeta?.color || paymentMeta.unpaid.color}`}>
                                {payMeta?.icon}{payMeta?.label || "Unknown"}
                              </span>
                            </div>

                            <div className="px-4 py-3 space-y-1.5">
                              {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span className="text-coffee-800/75 truncate">{item.menuItem?.name || "—"}</span>
                                  <span className="text-coffee-800/70 text-xs shrink-0 ml-2">{item.quantity}x</span>
                                </div>
                              ))}
                            </div>

                            <div className="px-4 py-3 border-t border-cream-200 flex items-center justify-between">
                              <span className="font-bold text-coffee-950 font-mono text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                                Rp{order.total?.toLocaleString()}
                              </span>
                              <div className="flex gap-1.5">
                                {order.paymentStatus !== "paid" && (
                                  <button
                                    onClick={() => verifyPayment(order.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[11px] rounded-none font-medium hover:bg-emerald-700 active:scale-95 transition-all"
                                  >
                                    <Check className="w-3 h-3" />
                                    {order.paymentMethod === "cash" ? "Bayar di Kasir" : "Verifikasi Bayar"}
                                  </button>
                                )}
                                {order.status === "pending" && (
                                  <>
                                    <button onClick={() => updateStatus(order.id, "processed")}
                                      className="px-3 py-1.5 bg-coffee-500 text-white text-[11px] rounded-none font-medium hover:bg-coffee-600 active:scale-95 transition-all">
                                      Terima
                                    </button>
                                    <button onClick={() => updateStatus(order.id, "cancelled")}
                                      className="px-3 py-1.5 border border-cream-200 text-coffee-800/70 text-[11px] rounded-none hover:bg-cream-100 active:scale-95 transition-all">
                                      Tolak
                                    </button>
                                  </>
                                )}
                                {order.status === "processed" && (
                                  <button onClick={() => updateStatus(order.id, "done")}
                                    className="px-3 py-1.5 bg-emerald-600 text-white text-[11px] rounded-none font-medium hover:bg-emerald-700 active:scale-95 transition-all">
                                    Selesai
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </FadeUp>
                ) : null
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

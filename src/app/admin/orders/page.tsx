"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Coffee, TrendingUp, Trash2 } from "lucide-react";
import { useAdminToken } from "../layout";

const statusMeta: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "Menunggu", color: "bg-amber-500/10 text-amber-300 border-amber-500/20", icon: <Clock className="w-3 h-3" /> },
  processed: { label: "Diproses", color: "bg-blue-500/10 text-blue-300 border-blue-500/20", icon: <Coffee className="w-3 h-3" /> },
  done:      { label: "Selesai",  color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { label: "Batal",    color: "bg-red-500/10 text-red-300 border-red-500/20",   icon: <XCircle className="w-3 h-3" /> },
};

const paymentMeta: Record<string, { label: string; color: string; icon: string }> = {
  paid:    { label: "Lunas",        color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: "✓" },
  unpaid:  { label: "Belum Bayar", color: "bg-amber-500/15 text-amber-300 border-amber-500/30",    icon: "⏳" },
  expired: { label: "Expired",     color: "bg-red-500/15 text-red-300 border-red-500/30",         icon: "✗" },
  failed:  { label: "Gagal",       color: "bg-red-500/15 text-red-300 border-red-500/30",         icon: "✗" },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  qris: "QRIS", va_bca: "BCA VA", va_mandiri: "Mandiri VA", va_bni: "BNI VA", gopay: "GoPay", cash: "Tunai",
};

export default function OrdersPage() {
  const token = useAdminToken();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders", { headers: { "x-admin-token": token } })
      .then((r) => r.json())
      .then((data) => { if (!data.error) setOrders(data); });
    const interval = setInterval(() => {
      fetch("/api/orders", { headers: { "x-admin-token": token } })
        .then((r) => r.json())
        .then((data) => { if (!data.error) setOrders(data); });
    }, 6000);
    return () => clearInterval(interval);
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
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus: "paid", status: "processed" } : o)));
    }
  }

  const groups = ["pending", "processed", "done", "cancelled"];
  const grouped = groups.map((s) => ({ status: s, orders: orders.filter((o) => o.status === s) }));
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="min-h-dvh bg-[#0C0A09]">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
      <div className="fixed top-1/3 right-0 w-[20rem] h-[20rem] rounded-full bg-coffee-500/5 blur-[100px] pointer-events-none" />
      <div className="relative z-10">
        <header className="sticky top-0 z-30 bg-[#0C0A09]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center gap-3">
            <Link href="/admin" className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
              <ArrowLeft className="w-4 h-4 text-white/60" />
            </Link>
            <h1 className="font-bold text-white">Pesanan</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex-1">
              <div className="w-9 h-9 rounded-lg bg-coffee-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-coffee-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/40">Total Pesanan</p>
                <p className="text-lg font-bold text-white">{orders.length} pesanan</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40">Revenue</p>
                <p className="text-sm font-bold text-coffee-300 font-mono">Rp{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/[0.04] flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/50 font-medium">Belum ada pesanan</p>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map((g) =>
                g.orders.length > 0 ? (
                  <div key={g.status}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusMeta[g.status]?.color || ""}`}>
                        {statusMeta[g.status]?.icon} {statusMeta[g.status]?.label || g.status}
                      </span>
                      <span className="text-xs text-white/40">({g.orders.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {g.orders.map((order: any) => {
                        const meta = statusMeta[order.status] || statusMeta.pending;
                        return (
                          <div key={order.id} className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group">
                            <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">#{order.id}</span>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${meta.color}`}>
                                  {meta.icon} {meta.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-white/40">
                                  {new Date(order.createdAt).toLocaleString("id", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                <button onClick={() => deleteOrder(order.id)}
                                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-white/[0.06] text-red-400/50 flex items-center justify-center hover:bg-red-500/20 hover:text-red-300 transition-all">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Payment method + status badge */}
                            <div className="px-4 py-2 bg-white/[0.02] text-xs text-white/50 flex items-center gap-2 border-b border-white/[0.04] flex-wrap">
                              <span className="font-medium text-white/70">{order.customerName || "Anonim"}</span>
                              <span className="text-white/20">•</span>
                              <span>Meja {order.tableNumber || "-"}</span>
                              <span className="text-white/20">•</span>
                              <span className="text-white/40">{PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}</span>
                              <span className="text-white/20">•</span>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${paymentMeta[order.paymentStatus]?.color || paymentMeta.unpaid.color}`}>
                                {paymentMeta[order.paymentStatus]?.icon} {paymentMeta[order.paymentStatus]?.label || "Unknown"}
                              </span>
                            </div>

                            <div className="px-4 py-3 space-y-1.5">
                              {order.items?.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span className="text-white/70 truncate">{item.menuItem?.name || "—"}</span>
                                  <span className="text-white/40 text-xs shrink-0 ml-2">{item.quantity}x</span>
                                </div>
                              ))}
                            </div>

                            <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between">
                              <span className="font-bold text-white font-mono text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                                Rp{order.total?.toLocaleString()}
                              </span>
                              <div className="flex gap-1.5">
                                {/* Verify payment button */}
                                {order.paymentStatus !== "paid" && (
                                  <button
                                    onClick={() => verifyPayment(order.id)}
                                    className="px-3 py-1.5 bg-emerald-500 text-white text-[11px] rounded-lg font-medium hover:bg-emerald-400 active:scale-95 transition-all"
                                  >
                                    ✓ {order.paymentMethod === "cash" ? "Bayar di Kasir" : "Verifikasi Bayar"}
                                  </button>
                                )}
                                {order.status === "pending" && (
                                  <>
                                    <button onClick={() => updateStatus(order.id, "processed")}
                                      className="px-3 py-1.5 bg-coffee-500 text-white text-[11px] rounded-lg font-medium hover:bg-coffee-400 active:scale-95 transition-all">
                                      Terima
                                    </button>
                                    <button onClick={() => updateStatus(order.id, "cancelled")}
                                      className="px-3 py-1.5 border border-white/[0.08] text-white/50 text-[11px] rounded-lg hover:bg-white/[0.06] active:scale-95 transition-all">
                                      Tolak
                                    </button>
                                  </>
                                )}
                                {order.status === "processed" && (
                                  <button onClick={() => updateStatus(order.id, "done")}
                                    className="px-3 py-1.5 bg-emerald-500 text-white text-[11px] rounded-lg font-medium hover:bg-emerald-400 active:scale-95 transition-all">
                                    Selesai
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

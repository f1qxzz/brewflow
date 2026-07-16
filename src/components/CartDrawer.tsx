"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, User, Table2, CheckCircle2 } from "lucide-react";
import type { CartItem } from "@/types";
import type { PaymentMethod } from "@/lib/payment";

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "cash",      label: "Bayar di Kasir" },
  { id: "qris",      label: "QRIS" },
  { id: "va_bca",    label: "BCA VA" },
  { id: "va_mandiri",label: "Mandiri VA" },
  { id: "va_bni",    label: "BNI VA" },
  { id: "gopay",     label: "GoPay" },
];

export default function CartDrawer({
  items, open, onClose, onUpdateQty, name, onNameChange, table, onTableChange, total, onSubmit, onPaymentMethodChange, paymentMethod,
}: {
  items: CartItem[]; open: boolean; onClose: () => void; onUpdateQty: (id: number, delta: number) => void;
  name: string; onNameChange: (v: string) => void; table: string; onTableChange: (v: string) => void;
  total: number; onSubmit: (method: PaymentMethod) => void;
  onPaymentMethodChange: (m: PaymentMethod) => void; paymentMethod: PaymentMethod;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const canSubmit = items.length > 0 && name.trim();
  const isBank = paymentMethod.startsWith("va_");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32, mass: 1 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="max-w-lg mx-auto bg-[#0C0A09] rounded-t-2xl max-h-[90dvh] flex flex-col overflow-hidden border-t border-white/[0.06]">
              <div className="flex justify-center pt-2 pb-0 absolute top-0 left-0 right-0 z-10">
                <div className="w-10 h-1 rounded-full bg-white/[0.12]" />
              </div>

              <div className="flex items-center justify-between px-5 pt-6 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Pesanan</h2>
                    <p className="text-xs text-white/40">{items.length} item</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-all"
                  aria-label="Tutup"
                >
                  <X className="w-3.5 h-3.5 text-white/50" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.04] flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white/[0.15]" />
                    </div>
                    <p className="text-white/40 text-sm">Keranjang kosong</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">{item.name}</p>
                          <p className="text-xs text-white/30 mt-0.5">
                            Rp{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-all"
                            aria-label={`Kurangi ${item.name}`}
                          >
                            <Minus className="w-3 h-3 text-white/50" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-white">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-coffee-500 text-white flex items-center justify-center hover:bg-coffee-400 transition-all"
                            aria-label={`Tambah ${item.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-white/[0.06] px-5 pt-4 pb-5 space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Nama Pemesan"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-coffee-500/40 focus:border-coffee-500/40 transition-all"
                  />
                </div>
                <div className="relative">
                  <Table2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input
                    value={table}
                    onChange={(e) => onTableChange(e.target.value)}
                    placeholder="No Meja"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-coffee-500/40 focus:border-coffee-500/40 transition-all"
                  />
                </div>

                {items.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[11px] text-white/30 font-medium uppercase tracking-wider mb-2">
                      Metode Pembayaran
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PAYMENT_METHODS.map((m) => {
                        const sel = paymentMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => onPaymentMethodChange(m.id)}
                            className={`px-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                              sel
                                ? "bg-white/[0.08] border-white/[0.15] text-white"
                                : "border-white/[0.06] text-white/40 hover:bg-white/[0.04] hover:text-white/60"
                            }`}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs text-white/30">Total</p>
                    <p className="text-lg font-bold text-white">
                      Rp{total.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onSubmit(paymentMethod)}
                    disabled={!canSubmit}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      isBank || paymentMethod === "qris" || paymentMethod === "gopay"
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-coffee-500 text-white hover:bg-coffee-400"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isBank || paymentMethod === "qris" || paymentMethod === "gopay" ? "Bayar Sekarang" : "Pesan"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

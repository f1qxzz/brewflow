"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, User, Table2, CheckCircle2, Lock, Coffee } from "lucide-react";
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
  items, open, onClose, onUpdateQty, name, onNameChange, table, onTableChange, tableLocked, total, onSubmit, onPaymentMethodChange, paymentMethod,
}: {
  items: CartItem[]; open: boolean; onClose: () => void; onUpdateQty: (id: number, delta: number) => void;
  name: string; onNameChange: (v: string) => void; table: string; onTableChange: (v: string) => void;
  tableLocked?: boolean;
  total: number; onSubmit: (method: PaymentMethod) => void;
  onPaymentMethodChange: (m: PaymentMethod) => void; paymentMethod: PaymentMethod;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const canSubmit = items.length > 0 && name.trim().length > 0;
  const showNameErr = touched && !name.trim();
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
            className="fixed inset-0 z-40 bg-black/40"
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
            <div className="max-w-lg mx-auto bg-white rounded-t-none max-h-[90dvh] flex flex-col overflow-hidden border-t border-cream-200 shadow-xl">
              <div className="flex justify-center pt-2 pb-0 absolute top-0 left-0 right-0 z-10">
                <div className="w-10 h-1 rounded-full bg-cream-300" />
              </div>

              <div className="flex items-center justify-between px-5 pt-6 pb-3 border-b border-cream-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-coffee-800/70" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-coffee-950">Pesanan</h2>
                    <p className="text-xs text-coffee-800/55">{items.length} item</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-none bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-all"
                  aria-label="Tutup"
                >
                  <X className="w-3.5 h-3.5 text-coffee-800/70" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-coffee-800/35" />
                    </div>
                    <p className="text-coffee-800/55 text-sm">Keranjang kosong</p>
                    <button
                      onClick={onClose}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-coffee-500 text-white rounded-none text-sm font-medium hover:bg-coffee-600 transition-all"
                    >
                      <Coffee className="w-4 h-4" />
                      Lihat Menu
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-cream-100">
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
                          <p className="font-medium text-coffee-950 text-sm truncate">{item.name}</p>
                          <p className="text-xs text-coffee-800/50 mt-0.5">
                            Rp{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-8 h-8 rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-all"
                            aria-label={`Kurangi ${item.name}`}
                          >
                            <Minus className="w-3 h-3 text-coffee-800" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-coffee-950">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-8 h-8 rounded-none bg-coffee-500 text-white flex items-center justify-center hover:bg-coffee-600 transition-all"
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

              <div className="border-t border-cream-200 px-5 pt-4 pb-5 space-y-3 bg-cream-50">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-coffee-800/45" />
                  <input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="Nama Pemesan *"
                    className={`w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-none border bg-white text-sm text-coffee-950 placeholder:text-coffee-800/40 focus:outline-none focus:ring-1 focus:ring-coffee-500/50 focus:border-coffee-500 transition-all ${
                      showNameErr ? "border-red-300" : "border-cream-200"
                    }`}
                  />
                  {showNameErr && (
                    <p className="text-[11px] text-red-600 mt-1 ml-1">Nama wajib diisi</p>
                  )}
                </div>
                <div className="relative">
                  {tableLocked ? (
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-coffee-800/45" />
                  ) : (
                    <Table2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-coffee-800/45" />
                  )}
                  <input
                    value={table}
                    onChange={(e) => onTableChange(e.target.value)}
                    readOnly={tableLocked}
                    placeholder="No Meja"
                    title={tableLocked ? "Meja terkunci dari QR" : undefined}
                    className={`w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-none border bg-white text-sm text-coffee-950 placeholder:text-coffee-800/40 focus:outline-none focus:ring-1 focus:ring-coffee-500/50 focus:border-coffee-500 transition-all ${
                      tableLocked ? "opacity-70 cursor-not-allowed border-cream-200 bg-cream-100" : "border-cream-200"
                    }`}
                  />
                  {tableLocked && (
                    <p className="text-[10px] text-coffee-800/45 mt-1 ml-1">Meja terkunci dari QR — tidak bisa diubah</p>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[11px] text-coffee-800/55 font-medium uppercase tracking-wider mb-2">
                      Metode Pembayaran
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PAYMENT_METHODS.map((m) => {
                        const sel = paymentMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => onPaymentMethodChange(m.id)}
                            className={`px-2 py-2.5 rounded-none border text-xs font-medium transition-all ${
                              sel
                                ? "bg-coffee-500 border-coffee-500 text-white"
                                : "border-cream-200 bg-white text-coffee-800/70 hover:bg-cream-100 hover:text-coffee-950"
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
                    <p className="text-xs text-coffee-800/55">Total</p>
                    <p className="text-lg font-bold text-coffee-950">
                      Rp{total.toLocaleString("id")}
                    </p>
                  </div>
                  <button
                    onClick={() => { setTouched(true); if (canSubmit) onSubmit(paymentMethod); }}
                    disabled={!canSubmit}
                    className={`flex items-center gap-2 px-5 py-3 min-h-[44px] text-sm font-semibold rounded-none transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      isBank || paymentMethod === "qris" || paymentMethod === "gopay"
                        ? "bg-coffee-950 text-white hover:bg-coffee-800"
                        : "bg-coffee-500 text-white hover:bg-coffee-600"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isBank || paymentMethod === "qris" || paymentMethod === "gopay" ? "Bayar Sekarang" : "Pesan"}
                  </button>
                </div>
                {!canSubmit && items.length > 0 && (
                  <p className="text-[11px] text-coffee-800/55 text-center">Isi nama dulu buat lanjut</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

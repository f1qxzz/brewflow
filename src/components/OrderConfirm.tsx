"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { CheckCircle2, Clock, Coffee, CookingPot, RotateCcw, Send, Star } from "lucide-react";

const statusSteps = [
  { key: "pending",   label: "Menunggu",         icon: Clock,        color: "text-amber-600" },
  { key: "processed", label: "Diproses",          icon: CookingPot,   color: "text-blue-600" },
  { key: "done",      label: "Selesai",           icon: CheckCircle2, color: "text-emerald-600" },
];

const statusOrder = ["pending", "processed", "done"];

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  qris: "QRIS", va_bca: "BCA VA", va_mandiri: "Mandiri VA", va_bni: "BNI VA", gopay: "GoPay", cash: "Tunai",
};

export default function OrderConfirm({
  order, rating, onRatingChange, feedback, onFeedbackChange, onSubmitFeedback, onOrderAgain,
}: {
  order: any; rating: number; onRatingChange: (n: number) => void;
  feedback: string; onFeedbackChange: (v: string) => void;
  onSubmitFeedback: () => void; onOrderAgain: () => void;
}) {
  const orderId = order?.id || 0;
  const [liveStatus, setLiveStatus] = useState(order?.status || "pending");
  const [livePaymentStatus, setLivePaymentStatus] = useState(order?.paymentStatus || "unpaid");
  const orderStatusIdx = statusOrder.indexOf(liveStatus);
  const isCash = order?.paymentMethod === "cash";
  const isPaid = livePaymentStatus === "paid";

  useEffect(() => {
    if (!orderId || order?.status === "done" || order?.status === "cancelled") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status && data.status !== liveStatus) setLiveStatus(data.status);
        if (data.paymentStatus && data.paymentStatus !== livePaymentStatus) setLivePaymentStatus(data.paymentStatus);
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId, liveStatus, livePaymentStatus, order?.status, order?.paymentStatus]);

  return (
    <div className="pt-4 md:pt-8">
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="flex justify-center mb-6"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center">
          <motion.svg
            className="w-7 h-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </motion.svg>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-coffee-950" style={{ fontFamily: "var(--font-display)" }}>
          {isPaid
            ? `Pesanan #${orderId} Lunas!`
            : !isCash && livePaymentStatus === "unpaid"
            ? `Pesanan #${orderId} — Pending`
            : `Pesanan #${orderId} Diterima!`}
        </h2>
        <p className="text-coffee-800/65 mt-1 text-sm">
          {isPaid
            ? "Pembayaran lunas! Tim kami proses secepatnya"
            : !isCash && livePaymentStatus === "unpaid"
            ? "Selesaikan pembayaran dulu ya!"
            : "Tim kami bakal proses secepatnya"}
        </p>
      </motion.div>

      {/* Payment Status Badge */}
      {!isCash && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className={`flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-none text-sm font-medium border ${
            isPaid
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          {isPaid ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Lunas via {PAYMENT_METHOD_LABELS[order?.paymentMethod] || order?.paymentMethod}
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              Menunggu Pembayaran · {PAYMENT_METHOD_LABELS[order?.paymentMethod] || order?.paymentMethod}
            </>
          )}
        </motion.div>
      )}

      {/* Live Status Tracker */}
      {isPaid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-none bg-white border border-cream-200 p-5 mb-4"
        >
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => {
              const done = i <= orderStatusIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-center gap-0 flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      done ? "bg-emerald-100" : "bg-cream-100"
                    }`}>
                      <Icon className={`w-5 h-5 transition-all duration-500 ${
                        done ? "text-emerald-600" : "text-coffee-800/35"
                      }`} />
                    </div>
                    <p className={`text-[10px] font-medium mt-1.5 transition-all duration-500 ${
                      done ? "text-emerald-700" : "text-coffee-800/40"
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-px mx-2 mb-5 transition-all duration-700 ${
                      i < orderStatusIdx ? "bg-emerald-400" : "bg-cream-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Unpaid online - show payment reminder */}
      {!isCash && !isPaid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-none bg-white border border-cream-200 p-5 mb-4"
        >
          <p className="text-sm text-coffee-800/70 text-center">
            Selesaikan pembayaran via {PAYMENT_METHOD_LABELS[order?.paymentMethod] || "metode yang dipilih"} untuk pesanan diproses.
          </p>
          <Link
            href={`/payment/${orderId}?t=${encodeURIComponent(order?.orderToken || "")}`}
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-coffee-500 text-white rounded-none font-medium text-sm hover:bg-coffee-600 transition-colors"
          >
            Lihat Detail Pembayaran →
          </Link>
        </motion.div>
      )}

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-none bg-white border border-cream-200 overflow-hidden"
      >
        <div className="px-5 pt-4 pb-3 border-b border-dashed border-cream-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-coffee-500 uppercase tracking-wider">Brew & Co.</span>
            <span className="text-[10px] text-coffee-800/55 font-mono">#{orderId}</span>
          </div>
        </div>

        <div className="px-5 py-3 space-y-2.5">
          {order?.items?.map((i: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.08 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Coffee className="w-3.5 h-3.5 text-coffee-500 shrink-0" />
                <span className="font-medium text-coffee-950 truncate">{i.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-coffee-800/55 text-xs">{i.qty}x</span>
                <span className="font-mono text-sm font-semibold text-coffee-950">
                  Rp{(i.price * i.qty).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-dashed border-cream-200 flex items-center justify-between">
          <span className="font-semibold text-coffee-950">Total</span>
          <span className="font-mono font-bold text-coffee-950 text-lg">
            Rp{order?.items?.reduce((s: number, i: any) => s + i.price * i.qty, 0).toLocaleString()}
          </span>
        </div>
      </motion.div>

      {/* Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-white rounded-none border border-cream-200 p-5"
      >
        <h3 className="font-semibold text-coffee-950 mb-1">Kasih Rating & Feedback</h3>
        <p className="text-xs text-coffee-800/55 mb-4">Bantu kami terus improve pelayanan</p>

        <div className="flex justify-center gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              key={n}
              onClick={() => onRatingChange(n)}
              whileTap={{ scale: 0.8 }}
              className={`p-1 transition-all duration-150 ${n <= rating ? "scale-100" : "scale-90 opacity-40"}`}
              aria-label={`${n} bintang`}
            >
              <Star className={`w-7 h-7 ${n <= rating ? "fill-coffee-300 text-coffee-500" : "text-cream-300"}`} />
            </motion.button>
          ))}
        </div>

        <textarea
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder="Tulis pesan kamu di sini..."
          rows={2}
          className="w-full px-4 py-3 rounded-none border border-cream-200 bg-white text-sm text-coffee-950 placeholder:text-coffee-800/40 focus:outline-none focus:ring-2 focus:ring-coffee-500/40 focus:border-coffee-500 transition-all resize-none mb-3"
        />

        <div className="flex gap-3">
          <button
            onClick={onOrderAgain}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-cream-200 bg-white text-coffee-800 rounded-none font-medium hover:bg-cream-100 active:scale-95 transition-all duration-200 flex-1"
          >
            <RotateCcw className="w-4 h-4" />
            Pesan Lagi
          </button>
          <button
            onClick={onSubmitFeedback}
            className="flex items-center justify-center gap-2 py-2.5 px-5 bg-coffee-500 text-white rounded-none font-medium hover:bg-coffee-600 active:scale-95 transition-all duration-200 flex-1"
          >
            <Send className="w-4 h-4" />
            Kirim
          </button>
        </div>
      </motion.div>
    </div>
  );
}

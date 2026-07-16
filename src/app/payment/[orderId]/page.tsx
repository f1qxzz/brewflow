"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Clock, Copy, ExternalLink, ArrowLeft, QrCode, Building2, Wallet, Lock } from "lucide-react";
import QRCode from "qrcode";

const PAYMENT_LABELS: Record<string, string> = {
  qris: "QRIS",
  va_bca: "BCA Virtual Account",
  va_mandiri: "Mandiri Virtual Account",
  va_bni: "BNI Virtual Account",
  gopay: "GoPay",
  cash: "Bayar di Kasir",
};

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = Number(params.orderId);
  const isFinish = searchParams.get("status") === "finish";

  const [order, setOrder] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [snapUrl, setSnapUrl] = useState<string>("");
  const [snapToken, setSnapToken] = useState<string>("");
  const [isMidtrans, setIsMidtrans] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const orderRes = await fetch(`/api/payment/${orderId}`);
        if (!orderRes.ok) throw new Error("Order tidak ditemukan");
        const orderData = await orderRes.json();
        setOrder(orderData);
        if (orderData.paymentStatus === "paid") {
          setPaid(true);
          setLoading(false);
          return;
        }
        const sessionRes = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, method: orderData.paymentMethod }),
        });
        if (!sessionRes.ok) {
          const err = await sessionRes.json();
          throw new Error(err.error || "Gagal membuat pembayaran");
        }
        const sessionData = await sessionRes.json();
        setIsMidtrans(sessionData.isMidtrans);
        if (sessionData.isMidtrans && sessionData.snap) {
          setSnapUrl(sessionData.snap.redirect_url);
          setSnapToken(sessionData.snap.token);
        } else if (sessionData.session) {
          setSession(sessionData.session);
          if (sessionData.session.qrString) {
            const url = await QRCode.toDataURL(sessionData.session.qrString, {
              margin: 2, width: 400, color: { dark: "#D4A574", light: "#1C1917" },
            });
            setQrDataUrl(url);
          }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  useEffect(() => {
    if (snapUrl && !isFinish && !paid) {
      setRedirecting(true);
      const timer = setTimeout(() => { window.location.href = snapUrl; }, 1500);
      return () => clearTimeout(timer);
    }
  }, [snapUrl, isFinish, paid]);

  useEffect(() => {
    if (paid || !orderId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/${orderId}`);
        if (!res.ok) return;
        const data = await res.json();
        setOrder(data);
        if (data.paymentStatus === "paid") {
          setPaid(true);
          clearInterval(interval);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId, paid]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, []);

  function handlePayNow() {
    if (snapUrl) window.location.href = snapUrl;
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#0C0A09] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
            <div className="absolute inset-0 rounded-full border-2 border-coffee-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-white/40 text-sm">Menyiapkan pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-[#0C0A09] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Clock className="w-6 h-6 text-white/30" />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Oops!</h2>
          <p className="text-sm text-white/50 mb-6">{error}</p>
          <button
            onClick={() => router.push("/menu")}
            className="px-5 py-2.5 bg-white/[0.08] text-white/70 rounded-lg text-sm font-medium hover:bg-white/[0.12] transition-all"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  const method = order?.paymentMethod;
  const isQris = method === "qris";
  const isGopay = method === "gopay";
  const isVA = method?.startsWith("va_");
  const isCash = method === "cash";

  return (
    <div className="min-h-dvh bg-[#0C0A09]">
      <div className="max-w-lg mx-auto px-4 pt-5 pb-12">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/menu")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </motion.button>

        <AnimatePresence mode="wait">
          {paid ? (
            <motion.div
              key="paid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center pt-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-1"
              >
                Pembayaran Berhasil!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/50 text-sm mb-8"
              >
                Pesanan #{orderId} akan segera diproses
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden mb-6 text-left"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Status</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Lunas
                    </span>
                  </div>
                  <div className="border-t border-white/[0.04]" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Metode</span>
                    <span className="text-white/80">{PAYMENT_LABELS[method] || method}</span>
                  </div>
                  <div className="border-t border-white/[0.04]" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Total</span>
                    <span className="text-white font-bold">Rp{(order?.total || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-white/[0.04] bg-white/[0.02] flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-300/60">Pembayaran terverifikasi</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <button
                  onClick={() => router.push("/menu")}
                  className="w-full py-3 bg-coffee-500 text-white rounded-lg font-semibold hover:bg-coffee-400 transition-all"
                >
                  Pesan Lagi
                </button>
                <p className="text-xs text-white/30 text-center">
                  Ada masukan?{" "}
                  <button onClick={() => router.push("/menu?f=1")} className="text-coffee-400 hover:text-coffee-300 underline">
                    Kasih feedback
                  </button>
                </p>
              </motion.div>
            </motion.div>
          ) : isMidtrans && !isFinish ? (
            <motion.div
              key="midtrans-redirect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center"
              >
                <Lock className="w-6 h-6 text-white/50" />
              </motion.div>

              <h2 className="text-lg font-bold text-white mb-1">Pembayaran Online</h2>
              <p className="text-sm text-white/50 mb-6">
                Pesanan #{orderId} · Rp{(order?.total || 0).toLocaleString()}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden mb-6"
              >
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-white/40" />
                  </div>
                  <p className="text-white/60 text-sm">Mengarahkan ke halaman pembayaran Midtrans...</p>
                  <div className="flex justify-center gap-2">
                    {[0, 0.15, 0.3].map((d) => (
                      <motion.div
                        key={d}
                        animate={{ y: [-2, 4, -2] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                        className="w-2 h-2 rounded-full bg-white/[0.15]"
                      />
                    ))}
                  </div>
                  {snapUrl && (
                    <button
                      onClick={handlePayNow}
                      className="block w-full py-2.5 bg-coffee-500 text-white rounded-lg font-medium hover:bg-coffee-400 transition-all"
                    >
                      Lanjut ke Midtrans
                    </button>
                  )}
                </div>
                <div className="px-6 py-3 border-t border-white/[0.04] flex items-center justify-between bg-white/[0.02]">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="text-base font-bold text-white">Rp{(order?.total || 0).toLocaleString()}</span>
                </div>
              </motion.div>
            </motion.div>
          ) : isMidtrans && isFinish ? (
            <motion.div
              key="midtrans-finish"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center"
              >
                <Clock className="w-6 h-6 text-white/40" />
              </motion.div>

              <h2 className="text-lg font-bold text-white mb-1">Menunggu Konfirmasi</h2>
              <p className="text-sm text-white/50 mb-6">
                Halaman ini akan update otomatis saat pembayaran terverifikasi
              </p>

              <motion.div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden mb-6 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Status</span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-amber-400"
                      />
                      Menunggu
                    </span>
                  </div>
                  <div className="border-t border-white/[0.04]" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Total</span>
                    <span className="text-white font-bold">Rp{(order?.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              <div className="flex gap-3">
                <button
                  onClick={handlePayNow}
                  className="flex-1 py-2.5 border border-white/[0.08] bg-white/[0.04] text-white/50 rounded-lg text-sm hover:bg-white/[0.08] transition-all"
                >
                  Bayar Ulang
                </button>
                <button
                  onClick={() => router.push("/menu")}
                  className="flex-1 py-2.5 bg-coffee-500 text-white rounded-lg text-sm font-medium hover:bg-coffee-400 transition-all"
                >
                  Ke Menu
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center"
                >
                  {isVA ? (
                    <Building2 className="w-5 h-5 text-white/40" />
                  ) : isQris || isGopay ? (
                    <QrCode className="w-5 h-5 text-white/40" />
                  ) : (
                    <Wallet className="w-5 h-5 text-white/40" />
                  )}
                </motion.div>
                <h2 className="text-lg font-bold text-white">
                  {PAYMENT_LABELS[method] || "Pembayaran"}
                </h2>
                <p className="text-sm text-white/40 mt-0.5">
                  Pesanan #{orderId} · Rp{(order?.total || 0).toLocaleString()}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden mb-4"
              >
                {(isQris || isGopay) && (
                  <div className="p-5 text-center space-y-4">
                    <p className="text-sm text-white/50">
                      {isQris ? "Scan QRIS dengan aplikasi e-wallet" : "Scan QRIS dengan GoPay"}
                    </p>
                    {qrDataUrl ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block p-3 bg-white rounded-xl"
                      >
                        <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 mx-auto" />
                      </motion.div>
                    ) : (
                      <div className="w-52 h-52 mx-auto rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
                        <QrCode className="w-10 h-10 text-white/20" />
                      </div>
                    )}
                  </div>
                )}
                {isVA && (
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white/50" />
                      </div>
                      <span className="text-sm font-medium text-white/70">{session?.bankName || "Bank"}</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1.5">Nomor Virtual Account</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/[0.04] rounded-lg px-3 py-2.5 border border-white/[0.08]">
                          <span className="text-base font-mono font-bold text-white tracking-wider">
                            {session?.vaNumber || "---"}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(session?.vaNumber || "")}
                          className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-all shrink-0"
                        >
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-white/50" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-amber-400/10 bg-amber-500/5">
                      <p className="text-xs text-amber-300/60">Transfer ke nomor VA di atas. Pembayaran diverifikasi otomatis.</p>
                    </div>
                  </div>
                )}
                {isCash && (
                  <div className="p-6 text-center space-y-2">
                    <Wallet className="w-8 h-8 text-white/30 mx-auto" />
                    <p className="text-sm text-white/60 font-medium">Bayar di Kasir</p>
                    <p className="text-xs text-white/30">Silakan ke kasir untuk melakukan pembayaran langsung.</p>
                  </div>
                )}
                <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between bg-white/[0.02]">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="text-base font-bold text-white">Rp{(order?.total || 0).toLocaleString()}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 text-sm text-white/30"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Menunggu pembayaran...</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

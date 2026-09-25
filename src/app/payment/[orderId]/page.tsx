"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

  // token dari URL (?t=) — fallback: pendingOrder di localStorage (reload/bookmark lintas tab)
  function tokenFor(id: number): string {
    const fromUrl = searchParams.get("t");
    if (fromUrl) return fromUrl;
    try {
      const saved = JSON.parse(localStorage.getItem("brewflow:pendingOrder") || "{}");
      if (saved.orderToken && saved.id === id) return String(saved.orderToken);
    } catch {}
    return "";
  }

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
  const navigating = useRef(false);

  useEffect(() => {
    if (paid || loading || error) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (navigating.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [paid, loading, error]);

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
          body: JSON.stringify({ orderId, method: orderData.paymentMethod, orderToken: tokenFor(orderId) }),
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
              margin: 2, width: 400, color: { dark: "#0A0A0A", light: "#FFFFFF" },
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
      const timer = setTimeout(() => { navigating.current = true; window.location.href = snapUrl; }, 1500);
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
    if (snapUrl) {
      navigating.current = true;
      window.location.href = snapUrl;
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-cream-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-cream-200" />
            <div className="absolute inset-0 rounded-full border-2 border-coffee-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-coffee-800/60 text-sm">Menyiapkan pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-cream-50 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-14 h-14 mx-auto mb-4 rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center">
            <Clock className="w-6 h-6 text-coffee-800/50" />
          </div>
          <h2 className="text-lg font-bold text-coffee-950 mb-1">Oops!</h2>
          <p className="text-sm text-coffee-800/65 mb-6">{error}</p>
          <button
            onClick={() => router.push("/menu")}
            className="px-5 py-2.5 bg-cream-100 border border-cream-200 text-coffee-950 rounded-none text-sm font-medium hover:bg-cream-200 transition-all"
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
    <div className="min-h-dvh bg-cream-50">
      <div className="max-w-lg mx-auto px-4 pt-5 pb-12">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => {
            if (!paid && !window.confirm("Pembayaran belum selesai. Tinggalkan halaman pembayaran?")) return;
            router.push("/menu");
          }}
          className="flex items-center gap-2 text-sm text-coffee-800/60 hover:text-coffee-500 transition-colors mb-5"
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
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-coffee-950 mb-1"
              >
                Pembayaran Berhasil!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-coffee-800/65 text-sm mb-8"
              >
                Pesanan #{orderId} akan segera diproses
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-none border border-cream-200 bg-white overflow-hidden mb-6 text-left"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-coffee-800/60">Status</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Lunas
                    </span>
                  </div>
                  <div className="border-t border-cream-200" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-coffee-800/60">Metode</span>
                    <span className="text-coffee-950">{PAYMENT_LABELS[method] || method}</span>
                  </div>
                  <div className="border-t border-cream-200" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-coffee-800/60">Total</span>
                    <span className="text-coffee-950 font-bold">Rp{(order?.total || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-cream-200 bg-cream-50 flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs text-emerald-700/70">Pembayaran terverifikasi</span>
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
                  className="w-full py-3 bg-coffee-500 text-white rounded-none font-semibold hover:bg-coffee-600 transition-all"
                >
                  Pesan Lagi
                </button>
                <p className="text-xs text-coffee-800/50 text-center">
                  Ada masukan?{" "}
                  <button onClick={() => router.push("/menu?f=1")} className="text-coffee-500 hover:text-coffee-600 underline">
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
                className="w-14 h-14 mx-auto mb-4 rounded-none bg-white border border-cream-200 flex items-center justify-center"
              >
                <Lock className="w-6 h-6 text-coffee-800/60" />
              </motion.div>

              <h2 className="text-lg font-bold text-coffee-950 mb-1">Pembayaran Online</h2>
              <p className="text-sm text-coffee-800/65 mb-6">
                Pesanan #{orderId} · Rp{(order?.total || 0).toLocaleString()}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-none border border-cream-200 bg-white overflow-hidden mb-6"
              >
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-coffee-800/55" />
                  </div>
                  <p className="text-coffee-800/70 text-sm">Mengarahkan ke halaman pembayaran Midtrans...</p>
                  <div className="flex justify-center gap-2">
                    {[0, 0.15, 0.3].map((d) => (
                      <motion.div
                        key={d}
                        animate={{ y: [-2, 4, -2] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                        className="w-2 h-2 rounded-full bg-coffee-300"
                      />
                    ))}
                  </div>
                  {snapUrl && (
                    <button
                      onClick={handlePayNow}
                      className="block w-full py-2.5 bg-coffee-500 text-white rounded-none font-medium hover:bg-coffee-600 transition-all"
                    >
                      Lanjut ke Midtrans
                    </button>
                  )}
                </div>
                <div className="px-6 py-3 border-t border-cream-200 flex items-center justify-between bg-cream-50">
                  <span className="text-sm text-coffee-800/65">Total</span>
                  <span className="text-base font-bold text-coffee-950">Rp{(order?.total || 0).toLocaleString()}</span>
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
                className="w-14 h-14 mx-auto mb-4 rounded-none bg-amber-50 border border-amber-200 flex items-center justify-center"
              >
                <Clock className="w-6 h-6 text-amber-700" />
              </motion.div>

              <h2 className="text-lg font-bold text-coffee-950 mb-1">Menunggu Konfirmasi</h2>
              <p className="text-sm text-coffee-800/65 mb-6">
                Halaman ini akan update otomatis saat pembayaran terverifikasi
              </p>

              <motion.div className="rounded-none border border-cream-200 bg-white overflow-hidden mb-6 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-coffee-800/60">Status</span>
                    <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-amber-500"
                      />
                      Menunggu
                    </span>
                  </div>
                  <div className="border-t border-cream-200" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-coffee-800/60">Total</span>
                    <span className="text-coffee-950 font-bold">Rp{(order?.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              <div className="flex gap-3">
                <button
                  onClick={handlePayNow}
                  className="flex-1 py-2.5 border border-cream-200 bg-white text-coffee-800/70 rounded-none text-sm hover:bg-cream-100 transition-all"
                >
                  Bayar Ulang
                </button>
                <button
                  onClick={() => router.push("/menu")}
                  className="flex-1 py-2.5 bg-coffee-500 text-white rounded-none text-sm font-medium hover:bg-coffee-600 transition-all"
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
                  className="w-12 h-12 mx-auto mb-3 rounded-none bg-white border border-cream-200 flex items-center justify-center"
                >
                  {isVA ? (
                    <Building2 className="w-5 h-5 text-coffee-800/55" />
                  ) : isQris || isGopay ? (
                    <QrCode className="w-5 h-5 text-coffee-800/55" />
                  ) : (
                    <Wallet className="w-5 h-5 text-coffee-800/55" />
                  )}
                </motion.div>
                <h2 className="text-lg font-bold text-coffee-950">
                  {PAYMENT_LABELS[method] || "Pembayaran"}
                </h2>
                <p className="text-sm text-coffee-800/60 mt-0.5">
                  Pesanan #{orderId} · Rp{(order?.total || 0).toLocaleString()}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-none border border-cream-200 bg-white overflow-hidden mb-4"
              >
                {(isQris || isGopay) && (
                  <div className="p-5 text-center space-y-4">
                    <p className="text-sm text-coffee-800/65">
                      {isQris ? "Scan QRIS dengan aplikasi e-wallet" : "Scan QRIS dengan GoPay"}
                    </p>
                    {qrDataUrl ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block p-3 bg-white border border-cream-200 rounded-none"
                      >
                        <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 mx-auto" />
                      </motion.div>
                    ) : (
                      <div className="w-52 h-52 mx-auto rounded-none bg-cream-50 flex items-center justify-center border border-cream-200">
                        <QrCode className="w-10 h-10 text-coffee-800/25" />
                      </div>
                    )}
                  </div>
                )}
                {isVA && (
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-coffee-800/60" />
                      </div>
                      <span className="text-sm font-medium text-coffee-950">{session?.bankName || "Bank"}</span>
                    </div>
                    <div>
                      <p className="text-xs text-coffee-800/60 mb-1.5">Nomor Virtual Account</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-cream-50 rounded-none px-3 py-2.5 border border-cream-200">
                          <span className="text-base font-mono font-bold text-coffee-950 tracking-wider">
                            {session?.vaNumber || "---"}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(session?.vaNumber || "")}
                          className="w-10 h-10 rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-all shrink-0"
                        >
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-coffee-800/60" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-none border border-amber-200 bg-amber-50">
                      <p className="text-xs text-amber-800/80">Transfer ke nomor VA di atas. Pembayaran diverifikasi otomatis.</p>
                    </div>
                  </div>
                )}
                {isCash && (
                  <div className="p-6 text-center space-y-2">
                    <Wallet className="w-8 h-8 text-coffee-800/40 mx-auto" />
                    <p className="text-sm text-coffee-950 font-medium">Bayar di Kasir</p>
                    <p className="text-xs text-coffee-800/55">Silakan ke kasir untuk melakukan pembayaran langsung.</p>
                  </div>
                )}
                <div className="px-5 py-3 border-t border-cream-200 flex items-center justify-between bg-cream-50">
                  <span className="text-sm text-coffee-800/65">Total</span>
                  <span className="text-base font-bold text-coffee-950">Rp{(order?.total || 0).toLocaleString()}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 text-sm text-coffee-800/50"
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

"use client";

import { useState, useEffect, createContext, useContext, useSyncExternalStore } from "react";
import { Lock, Coffee, AlertCircle } from "lucide-react";
import FadeUp from "@/components/FadeUp";

type AdminCtx = { token: string };
const AdminContext = createContext<AdminCtx | null>(null);
export const useAdminToken = () => useContext(AdminContext)?.token || "";

/* ponytail: sessionStorage = external store. Baca via useSyncExternalStore
   (getServerSnapshot "" biar hydrate cocok), bukan setState di dalam effect.
   Token format "<exp>.<sig>" → cek exp di klien: sesi mati = layar PIN,
   bukan admin yang kelihatan hidup tapi semua GET 401 diam-diam. */
const subscribeSession = () => () => {};
const readSessionToken = () => {
  const t = sessionStorage.getItem("admin_token") ?? "";
  const exp = Number(t.split(".")[0]);
  return Number.isFinite(exp) && exp > Date.now() ? t : "";
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const storedToken = useSyncExternalStore(subscribeSession, readSessionToken, () => "");
  const activeToken = token || storedToken;
  const authed = activeToken !== "";

  /* ponytail: cek exp cuma nangkep sesi lewat waktu. Token bisa ditolak
     server tanpa exp lewat (logout tab lain, PIN diputar) → 401 satu kali
     = sesi mati: bersihkan + reload ke layar PIN, jangan poll 401 terus. */
  useEffect(() => {
    const orig = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const res = await orig(input, init);
      if (res.status === 401 && new Headers(init?.headers).get("x-admin-token")) {
        sessionStorage.removeItem("admin_token");
        window.location.reload();
      }
      return res;
    };
    return () => { window.fetch = orig; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("admin_token", data.token);
        setToken(data.token);
      } else if (res.status === 429) {
        setError("Terlalu banyak percobaan. Tunggu 1 menit.");
      } else if (res.status === 503) {
        setError("Server belum dikonfigurasi ADMIN_PIN.");
      } else {
        setError("PIN salah. Coba lagi.");
        setPin("");
      }
    } catch {
      setError("Gagal verifikasi. Cek koneksi.");
    }
  }

  if (!authed) {
    return (
      <div className="min-h-dvh bg-cream-50 flex items-center justify-center p-4">
        <FadeUp className="w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <Coffee className="w-6 h-6 text-coffee-500" />
          </div>
          <h1 className="text-xl font-semibold text-coffee-950 text-center mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Brew & Co.
          </h1>
          <p className="text-coffee-800/70 text-sm text-center mb-8">Admin panel</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-800/70" />
              <input
                type="password"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(""); }}
                placeholder="Masukkan PIN"
                maxLength={6}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 rounded-none bg-white border border-cream-200 text-coffee-950 placeholder:text-coffee-800/60 text-sm focus:outline-none focus:ring-1 focus:ring-coffee-500/50 focus:border-coffee-500/50 transition-all"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 rounded-none px-4 py-2.5 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={!pin}
              className="w-full py-3 bg-coffee-500 hover:bg-coffee-600 disabled:opacity-40 text-white rounded-none font-medium transition-all active:scale-[0.98]"
            >
              Masuk
            </button>
          </form>
          <p className="text-center text-coffee-800/70 text-xs mt-6">Khusus staff Brew & Co.</p>
        </FadeUp>
      </div>
    );
  }

  return <AdminContext.Provider value={{ token: activeToken }}>{children}</AdminContext.Provider>;
}

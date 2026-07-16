"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { Lock, Coffee, AlertCircle } from "lucide-react";

type AdminCtx = { token: string };
const AdminContext = createContext<AdminCtx | null>(null);
export const useAdminToken = () => useContext(AdminContext)?.token || "";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = sessionStorage.getItem("admin_token");
    if (t) {
      setToken(t);
      setAuthed(true);
    }
    setLoading(false);
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
        setAuthed(true);
      } else if (res.status === 429) {
        setError("Terlalu banyak percobaan. Tunggu 1 menit.");
      } else {
        setError("PIN salah. Coba lagi.");
        setPin("");
      }
    } catch {
      setError("Gagal verifikasi. Cek koneksi.");
    }
  }

  if (loading) return null;

  if (!authed) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coffee-400 to-coffee-300 flex items-center justify-center shadow-lg">
                <Coffee className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
              Brew & Co.
            </h1>
            <p className="text-coffee-300 text-sm text-center mb-8">Admin Panel</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
                <input
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(""); }}
                  placeholder="Masukkan PIN"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-coffee-400 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"
                  autoFocus
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-300 text-sm bg-red-500/10 rounded-xl px-4 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={!pin}
                className="w-full py-3 bg-coffee-500 hover:bg-coffee-400 disabled:opacity-50 text-white rounded-xl font-semibold transition-all active:scale-[0.98]"
              >
                Masuk
              </button>
            </form>
          </div>
          <p className="text-center text-coffee-500 text-xs mt-6">Khusus staff Brew & Co.</p>
        </div>
      </div>
    );
  }

  return <AdminContext.Provider value={{ token }}>{children}</AdminContext.Provider>;
}

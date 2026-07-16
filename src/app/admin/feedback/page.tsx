"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquareText, Star, TrendingUp, Trash2 } from "lucide-react";
import { useAdminToken } from "../layout";

export default function FeedbackPage() {
  const token = useAdminToken();
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/feedback", { headers: { "x-admin-token": token } })
      .then((r) => r.json())
      .then((data) => { if (!data.error) setFeedback(data); });
  }, [token]);

  async function deleteFeedback(id: number) {
    if (!confirm("Hapus feedback ini?")) return;
    await fetch(`/api/feedback/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  }

  const avgRating = feedback.length > 0
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-dvh bg-[#0C0A09]">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
      <div className="fixed top-1/3 right-0 w-[20rem] h-[20rem] rounded-full bg-coffee-500/5 blur-[100px] pointer-events-none" />
      <div className="relative z-10">
        <header className="sticky top-0 z-30 bg-[#0C0A09]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center gap-3">
            <Link href="/admin" className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
              <ArrowLeft className="w-4 h-4 text-white/60" />
            </Link>
            <h1 className="font-bold text-white">Feedback</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex-1">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/40">Total Feedback</p>
                <p className="text-lg font-bold text-white">{feedback.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40">Rata-rata</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-coffee-300 text-coffee-300" />
                  <span className="text-sm font-bold text-white">{avgRating}</span>
                </div>
              </div>
            </div>
          </div>

          {feedback.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/[0.04] flex items-center justify-center">
                <MessageSquareText className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/50 font-medium">Belum ada feedback</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {feedback.map((f: any) => (
                <div key={f.id} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-white text-sm">{f.customerName || "Anonim"}</span>
                    <button onClick={() => deleteFeedback(f.id)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-white/[0.06] text-red-400/50 flex items-center justify-center hover:bg-red-500/20 hover:text-red-300 transition-all shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= f.rating ? "fill-coffee-300 text-coffee-300" : "text-white/[0.08]"}`} />
                    ))}
                  </div>
                  {f.message && <p className="text-sm text-white/50 mt-1.5">{f.message}</p>}
                  <p className="text-[10px] text-white/30 mt-3">{new Date(f.createdAt).toLocaleString("id")}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

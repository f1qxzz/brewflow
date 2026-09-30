"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquareText, Star, TrendingUp, Trash2 } from "lucide-react";
import { useAdminToken } from "../layout";
import FadeUp from "@/components/FadeUp";

type FeedbackRow = {
  id: number;
  rating: number;
  createdAt: string;
  customerName?: string;
  message?: string;
};

export default function FeedbackPage() {
  const token = useAdminToken();
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);

  useEffect(() => {
    fetch("/api/feedback", { headers: { "x-admin-token": token } })
      .then((r) => r.json() as Promise<FeedbackRow[] | { error?: string }>)
      .then((data) => { if (Array.isArray(data)) setFeedback(data); });
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
    <div className="min-h-dvh bg-cream-50">
      <div className="relative z-10">
        <header className="sticky top-0 z-30 bg-white border-b border-cream-200">
          <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center gap-3">
            <Link href="/admin" className="w-8 h-8 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors">
              <ArrowLeft className="w-4 h-4 text-coffee-800/70" />
            </Link>
            <h1 className="font-bold text-coffee-950">Feedback</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 md:px-8 py-5">
          <FadeUp className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-3 p-3 rounded-none bg-white border border-cream-200 flex-1">
              <div className="w-9 h-9 rounded-none bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-coffee-800/70">Total Feedback</p>
                <p className="text-lg font-bold text-coffee-950">{feedback.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-coffee-800/70">Rata-rata</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-coffee-500 text-coffee-500" />
                  <span className="text-sm font-bold text-coffee-950">{avgRating}</span>
                </div>
              </div>
            </div>
          </FadeUp>

          {feedback.length === 0 ? (
            <FadeUp className="text-center py-20">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center">
                <MessageSquareText className="w-6 h-6 text-coffee-800/30" />
              </div>
              <p className="text-coffee-800/70 font-medium">Belum ada feedback</p>
            </FadeUp>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {feedback.map((f, i) => (
                <FadeUp key={f.id} delay={Math.min(i, 6) * 0.04}>
                <div className="h-full bg-white rounded-none p-4 border border-cream-200 hover:border-cream-300 transition-all group">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-coffee-950 text-sm">{f.customerName || "Anonim"}</span>
                    <button onClick={() => deleteFeedback(f.id)}
                      className="w-7 h-7 rounded-full bg-cream-100 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-all shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= f.rating ? "fill-coffee-500 text-coffee-500" : "text-cream-300"}`} />
                    ))}
                  </div>
                  {f.message && <p className="text-sm text-coffee-800/65 mt-1.5">{f.message}</p>}
                  <p className="text-[10px] text-coffee-800/70 mt-3">{new Date(f.createdAt).toLocaleString("id")}</p>
                </div>
                </FadeUp>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

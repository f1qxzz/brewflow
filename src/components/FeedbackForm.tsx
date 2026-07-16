import { useState } from "react";
import { Star, MessageSquareText, Send, RotateCcw } from "lucide-react";

export default function FeedbackForm({
  rating, onRatingChange, message, onMessageChange, onSubmit, onOrderAgain,
}: {
  rating: number; onRatingChange: (n: number) => void; message: string; onMessageChange: (v: string) => void;
  onSubmit: () => void; onOrderAgain: () => void;
}) {
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    await onSubmit();
    setSending(false);
  };

  return (
    <div className="pt-6 mt-8 border-t border-cream-200">
      <h3 className="font-semibold text-coffee-900 mb-4 text-center">
        Kasih rating dong
      </h3>

      <div className="flex justify-center gap-1.5 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onRatingChange(n)}
            className={`p-1 transition-all duration-150 ${
              n <= rating ? "scale-100" : "scale-90 opacity-30"
            }`}
            aria-label={`${n} bintang`}
          >
            <Star
              className={`w-8 h-8 ${
                n <= rating ? "fill-coffee-300 text-coffee-300" : "text-cream-300"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="relative mb-3">
        <MessageSquareText className="absolute left-3.5 top-3 w-4 h-4 text-coffee-300" />
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Pesan (opsional)"
          rows={2}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-sm text-coffee-900 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:border-coffee-500 transition-all resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={sending}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-coffee-500 text-white rounded-xl font-medium hover:bg-coffee-600 active:scale-95 disabled:opacity-60 transition-all duration-200"
        >
          {sending ? "Mengirim..." : (
            <>
              <Send className="w-4 h-4" />
              Kirim Feedback
            </>
          )}
        </button>
        <button
          onClick={onOrderAgain}
          className="flex items-center gap-2 px-5 py-3 border border-cream-200 text-coffee-600 rounded-xl font-medium hover:bg-cream-100 active:scale-95 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Pesan Lagi
        </button>
      </div>
    </div>
  );
}

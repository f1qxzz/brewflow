"use client";

import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ChevronUp } from "lucide-react";

export default function CartSummary({
  itemCount, total, onOpen,
}: {
  itemCount: number; total: number; onOpen: () => void;
}) {
  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-6 bg-gradient-to-t from-[#0C0A09]/80 via-[#0C0A09]/60 to-transparent backdrop-blur pointer-events-none"
        >
          <button
            id="cart-trigger"
            onClick={onOpen}
            className="pointer-events-auto w-full flex items-center justify-between py-4 px-5 bg-coffee-500 text-white rounded-2xl font-semibold hover:bg-coffee-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-coffee-500/30 border border-coffee-400/20"
          >
            <span className="flex items-center gap-2.5">
              <span className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <ShoppingBag className="w-4.5 h-4.5" />
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-white text-coffee-500 text-[9px] font-bold flex items-center justify-center shadow-sm"
                >
                  {itemCount}
                </motion.span>
              </span>
              <span>Lihat Pesanan</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-sm" style={{ fontFamily: "var(--font-mono)" }}>Rp{total.toLocaleString()}</span>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <ChevronUp className="w-3.5 h-3.5" />
              </div>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

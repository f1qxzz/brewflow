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
          className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-6 pointer-events-none"
        >
          <button
            id="cart-trigger"
            onClick={onOpen}
            className="pointer-events-auto w-full flex items-center justify-between py-3.5 px-5 bg-coffee-500 text-white rounded-none font-medium hover:bg-coffee-600 active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            <span className="flex items-center gap-2.5">
              <span className="relative">
                <ShoppingBag className="w-4 h-4" />
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 text-[9px] font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              </span>
              <span>Lihat Pesanan</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-sm">Rp{total.toLocaleString()}</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

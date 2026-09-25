"use client";

import { motion } from "motion/react";
import { ShoppingBag, Home } from "lucide-react";
import Link from "next/link";

export default function MenuHeader({ itemCount }: { itemCount: number }) {
  return (
    <header className="sticky top-0 z-30 bg-cream-50/90 backdrop-blur border-b border-cream-200">
      <div className="max-w-lg md:max-w-4xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Home className="w-4 h-4 text-coffee-800/60" />
          <span className="text-sm font-semibold text-coffee-950">Brew & Co.</span>
        </Link>

        <button
          onClick={() => {
            const ev = new MouseEvent("click", { bubbles: true });
            document.getElementById("cart-trigger")?.dispatchEvent(ev);
          }}
          className="relative w-10 h-10 min-h-[40px] min-w-[40px] rounded-none bg-white border border-cream-200 flex items-center justify-center hover:bg-cream-100 transition-colors"
          aria-label={`Keranjang, ${itemCount} item`}
        >
          <ShoppingBag className="w-4 h-4 text-coffee-800/70" />
          {itemCount > 0 && (
            <motion.span
              key={itemCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-coffee-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {itemCount}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
}

"use client";

import { motion } from "motion/react";
import { ShoppingBag, Home } from "lucide-react";
import Link from "next/link";

export default function MenuHeader({ itemCount }: { itemCount: number }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0C0A09] border-b border-white/[0.06]">
      <div className="max-w-lg md:max-w-4xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-all">
            <Home className="w-3.5 h-3.5 text-white/50" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">
              Brew & Co.
            </h1>
            <p className="text-[10px] text-white/30 leading-tight">Digital Menu</p>
          </div>
        </Link>

        <button
          onClick={() => {
            const ev = new MouseEvent("click", { bubbles: true });
            document.getElementById("cart-trigger")?.dispatchEvent(ev);
          }}
          className="relative w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-all"
          aria-label={`Keranjang, ${itemCount} item`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-white/50" />
          {itemCount > 0 && (
            <motion.span
              key={itemCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-coffee-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {itemCount}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
}

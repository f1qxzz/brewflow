"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "@/types";

export default function MenuItemCard({ item, qty, onAdd, onDec }: { item: MenuItem; qty: number; onAdd: (item: MenuItem) => void; onDec: (item: MenuItem) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative bg-white rounded-none border border-cream-200 overflow-hidden hover:border-cream-300 transition-colors duration-200">
        <div className="relative aspect-square bg-cream-50 border-b border-cream-200">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-20">☕</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-coffee-950 text-sm leading-tight">{item.name}</h3>
            <span className="shrink-0 text-sm text-coffee-800 font-mono">
              Rp{item.price.toLocaleString("id")}
            </span>
          </div>
          {item.description && (
            <p className="text-xs text-coffee-800/55 leading-relaxed line-clamp-2">{item.description}</p>
          )}
          {qty === 0 ? (
            <button
              onClick={() => onAdd(item)}
              className="w-full mt-1 py-2.5 min-h-[40px] rounded-none bg-cream-100 text-coffee-900 text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-cream-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah
            </button>
          ) : (
            <div className="flex items-center justify-between mt-1 py-0.5">
              <button
                onClick={() => onDec(item)}
                className="w-9 h-9 min-h-[36px] rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors"
                aria-label={`Kurangi ${item.name}`}
              >
                <Minus className="w-3.5 h-3.5 text-coffee-800" />
              </button>
              <span className="text-sm font-semibold text-coffee-950 min-w-[2ch] text-center">{qty}</span>
              <button
                onClick={() => onAdd(item)}
                className="w-9 h-9 min-h-[36px] rounded-none bg-coffee-500 text-white flex items-center justify-center hover:bg-coffee-600 transition-colors"
                aria-label={`Tambah ${item.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

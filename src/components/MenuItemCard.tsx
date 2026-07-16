"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/types";

const catLabel: Record<number, string> = {
  24: "Kopi",
  25: "Non Kopi",
  26: "Makanan",
  27: "Snack",
};

export default function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all duration-300">
        <div className="relative aspect-[4/3] bg-white/[0.02]">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain p-5"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-10">☕</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/10 to-transparent" />
          <div className="absolute bottom-2.5 left-2.5">
            <span className="px-2 py-0.5 rounded-md bg-black/50 text-[10px] font-medium text-white/60">
              {catLabel[item.categoryId] || item.categoryId}
            </span>
          </div>
        </div>

        <div className="p-3.5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-sm leading-tight">{item.name}</h3>
            <span className="shrink-0 text-sm font-semibold text-white/50">
              Rp{item.price.toLocaleString()}
            </span>
          </div>
          {item.description && (
            <p className="text-xs text-white/30 leading-relaxed line-clamp-2">{item.description}</p>
          )}
          <button
            onClick={() => onAdd(item)}
            className="w-full mt-1.5 py-2 rounded-lg bg-white/[0.08] text-white/80 text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-white/[0.12] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah
          </button>
        </div>
      </div>
    </motion.div>
  );
}

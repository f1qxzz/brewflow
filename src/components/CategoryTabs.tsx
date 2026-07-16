"use client";

import { motion } from "motion/react";
import { useRef, useEffect } from "react";
import type { Category } from "@/types";

export default function CategoryTabs({
  categories, active, onSelect,
}: {
  categories: Category[]; active: number; onSelect: (i: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  return (
    <div className="flex items-end gap-4 border-b border-white/[0.06] md:justify-center">
      <span className="text-xs font-bold text-white/40 uppercase tracking-wider pb-2.5 shrink-0">Menu</span>
      <div ref={scrollRef} className="flex gap-1 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-0 md:justify-center">
        {categories.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onSelect(i)}
            className={`shrink-0 snap-start px-3.5 py-2.5 text-sm font-medium transition-all duration-200 relative ${
              i === active
                ? "text-white"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            {c.name}
            {i === active && (
              <motion.span
                layoutId="activeCatLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

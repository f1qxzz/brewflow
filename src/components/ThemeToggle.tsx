"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getDark = () => document.documentElement.classList.contains("dark");

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, getDark, () => false);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("brewflow:theme", next ? "dark" : "light");
    } catch {
      /* storage bisa diblokir — tema tetap jalan selama session ini */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-pressed={dark}
      className={
        "w-10 h-10 min-h-[40px] min-w-[40px] shrink-0 bg-white border border-cream-200 " +
        "flex items-center justify-center hover:bg-cream-100 transition-colors " +
        className
      }
    >
      {dark ? (
        <Sun className="w-4 h-4 text-coffee-800/70" />
      ) : (
        <Moon className="w-4 h-4 text-coffee-800/70" />
      )}
    </button>
  );
}

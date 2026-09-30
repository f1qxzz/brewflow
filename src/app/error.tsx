"use client";

import { useEffect } from "react";
import Link from "next/link";

/* ponytail: satu error boundary global — dulu runtime error bikin layar putih tanpa jalan keluar */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="anim-fade-up flex w-full max-w-md flex-col items-center gap-5 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-coffee-100 font-mono text-lg text-coffee-600">
          !
        </span>
        <div className="space-y-2">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-coffee-800/70">
            Ada yang error
          </p>
          <h1 className="text-3xl font-semibold text-coffee-950" style={{ fontFamily: "var(--font-display)" }}>
            Halaman ini gagal dimuat
          </h1>
          <p className="text-sm text-coffee-800/70">
            Biasanya gangguan sementara. Coba muat ulang, atau balik ke menu.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="min-h-11 rounded-full bg-coffee-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-coffee-500"
          >
            Coba lagi
          </button>
          <Link
            href="/"
            className="min-h-11 rounded-full border border-cream-200 px-6 py-3 text-sm font-medium text-coffee-950 transition hover:bg-cream-100"
          >
            Ke menu
          </Link>
        </div>
      </div>
    </main>
  );
}

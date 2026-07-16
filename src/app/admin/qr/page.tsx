"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, QrCode, Copy, ExternalLink, Download, LayoutGrid, X } from "lucide-react";

export default function QRPage() {
  const [origin, setOrigin] = useState("");
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const tables = Array.from({ length: 10 }, (_, i) => i + 1);

  function menuUrl(table: number) {
    return `${origin}/menu?table=${table}`;
  }

  function qrUrl(table: number) {
    const data = encodeURIComponent(menuUrl(table));
    return `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${data}`;
  }

  function downloadQR(table: number) {
    const a = document.createElement("a");
    a.href = qrUrl(table);
    a.download = `brewflow-meja-${table}.png`;
    a.click();
  }

  function copyLink(table: number) {
    navigator.clipboard.writeText(menuUrl(table));
  }

  return (
    <div className="min-h-dvh bg-[#0C0A09]">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
      <div className="relative z-10">
        <header className="sticky top-0 z-30 bg-[#0C0A09]/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
            <Link href="/admin" className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
              <ArrowLeft className="w-4 h-4 text-white/60" />
            </Link>
            <h1 className="font-bold text-white">QR Code Meja</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-5">
          <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 md:p-6">
            {/* Pilih Meja */}
            {!showAll && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-stone-500/20 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-stone-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Pilih Meja</p>
                    <p className="text-xs text-white/40">Mau bikin QR untuk meja berapa?</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-5">
                  {tables.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTable(t === selectedTable ? null : t)}
                      className={`h-12 rounded-xl text-sm font-bold transition-all ${
                        t === selectedTable
                          ? "bg-coffee-500 text-white shadow-md shadow-coffee-500/20"
                          : "bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white/70"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowAll(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.1] text-sm text-white/40 hover:text-white/60 hover:border-white/[0.2] transition-all flex items-center justify-center gap-2"
                >
                  <LayoutGrid className="w-4 h-4" /> Lihat Semua QR (Print All)
                </button>
              </>
            )}

            {/* Single QR */}
            {selectedTable && !showAll && (
              <div className="pt-5 border-t border-white/[0.06]">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-white rounded-xl p-3 shadow-sm shrink-0">
                    <img src={qrUrl(selectedTable)} alt="QR Code" className="w-44 h-44 md:w-52 md:h-52" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg font-bold text-white">Meja {selectedTable}</p>
                    <p className="text-xs text-white/40 mt-1">Scan QR → buka menu → pesan — meja {selectedTable} otomatis terisi</p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                      <button onClick={() => downloadQR(selectedTable)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coffee-500 text-white text-sm font-medium hover:bg-coffee-400 active:scale-95 transition-all">
                        <Download className="w-3.5 h-3.5" /> Download QR
                      </button>
                      <button onClick={() => copyLink(selectedTable)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 text-sm hover:bg-white/[0.1] active:scale-95 transition-all">
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </button>
                      <a href={menuUrl(selectedTable)} target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 text-sm hover:bg-white/[0.1] active:scale-95 transition-all">
                        <ExternalLink className="w-3.5 h-3.5" /> Buka Menu
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedTable && !showAll && (
              <div className="text-center py-8 border-t border-white/[0.06]">
                <QrCode className="w-10 h-10 mx-auto mb-2 text-white/20" />
                <p className="text-sm text-white/30">Pilih nomor meja dulu</p>
              </div>
            )}

            {/* All QR Grid */}
            {showAll && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-semibold text-white">Semua QR Meja</p>
                    <p className="text-xs text-white/40 mt-1">Download semua QR, print, tempel di meja masing-masing</p>
                  </div>
                  <button onClick={() => setShowAll(false)}
                    className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {tables.map((t) => (
                    <div key={t} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-3 text-center">
                      <div className="bg-white rounded-lg p-2 mb-2">
                        <img src={qrUrl(t)} alt={`Meja ${t}`} className="w-full aspect-square" />
                      </div>
                      <p className="text-sm font-bold text-white">Meja {t}</p>
                      <div className="flex gap-1 mt-2 justify-center">
                        <button onClick={() => downloadQR(t)}
                          className="w-7 h-7 rounded-lg bg-coffee-500/20 flex items-center justify-center hover:bg-coffee-500/30 transition-colors">
                          <Download className="w-3 h-3 text-coffee-300" />
                        </button>
                        <button onClick={() => copyLink(t)}
                          className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                          <Copy className="w-3 h-3 text-white/50" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5">
            <p className="text-sm font-bold text-white mb-3">Cara Pasang QR di Meja</p>
            <ol className="space-y-2 text-sm text-white/50">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-coffee-500/20 text-coffee-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span><strong className="text-white/70">Deploy</strong> dulu aplikasi ke Vercel atau hosting lain biar bisa diakses publik</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-coffee-500/20 text-coffee-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span><strong className="text-white/70">Buka halaman ini</strong> setelah deploy — origin URL otomatis terdeteksi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-coffee-500/20 text-coffee-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span><strong className="text-white/70">Download QR</strong> setiap meja (atau Lihat Semua → download satu-satu)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-coffee-500/20 text-coffee-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span><strong className="text-white/70">Print & tempel</strong> QR di meja masing-masing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-coffee-500/20 text-coffee-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
                <span>Pelanggan <strong className="text-white/70">scan QR</strong> → langsung ke menu → meja terisi otomatis → pesan!</span>
              </li>
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, QrCode, Copy, ExternalLink, Download, LayoutGrid, X } from "lucide-react";
import QRCode from "qrcode";
import FadeUp from "@/components/FadeUp";

export default function QRPage() {
  const [origin, setOrigin] = useState("");
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [cards, setCards] = useState<Record<number, string>>({});
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!origin) return;
    let alive = true;
    (async () => {
      await document.fonts.ready;
      const out: Record<number, string> = {};
      for (const t of tables) out[t] = await makeCard(t);
      if (alive) setCards(out);
    })();
    return () => { alive = false; };
  }, [origin]);

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
    a.href = cards[table] ?? qrUrl(table);
    a.download = `brewflow-meja-${table}.png`;
    a.click();
  }

  async function makeCard(t: number): Promise<string> {
    const qrData = await QRCode.toDataURL(menuUrl(t), { margin: 1, width: 540, color: { dark: "#0A0A0A", light: "#FFFFFF" } });
    const img = new Image();
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = qrData; });
    const c = document.createElement("canvas");
    c.width = 720;
    c.height = 1000;
    const x = c.getContext("2d")!;
    x.fillStyle = "#FFFFFF";
    x.fillRect(0, 0, 720, 1000);
    x.strokeStyle = "#0A0A0A";
    x.lineWidth = 5;
    x.strokeRect(14, 14, 692, 972);
    x.textAlign = "center";
    x.fillStyle = "#D33A0A";
    x.font = "700 34px Archivo, sans-serif";
    x.fillText("BREWFLOW", 360, 88);
    x.fillStyle = "#0A0A0A";
    x.font = "800 104px Archivo, sans-serif";
    x.fillText(`MEJA ${t}`, 360, 205);
    x.drawImage(img, 90, 250, 540, 540);
    x.fillStyle = "#0A0A0A";
    x.font = "600 32px Archivo, sans-serif";
    x.fillText("Scan untuk lihat menu & pesan", 360, 862);
    x.fillStyle = "#666666";
    x.font = "400 24px Archivo, sans-serif";
    x.fillText("Meja kamu terisi otomatis", 360, 906);
    return c.toDataURL("image/png");
  }

  function copyLink(table: number) {
    navigator.clipboard.writeText(menuUrl(table));
  }

  return (
    <div className="min-h-dvh bg-cream-50">
      <div className="relative z-10">
        <header className="sticky top-0 z-30 bg-white border-b border-cream-200">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
            <Link href="/admin" className="w-8 h-8 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors">
              <ArrowLeft className="w-4 h-4 text-coffee-800/70" />
            </Link>
            <h1 className="font-bold text-coffee-950">QR Code Meja</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-5">
          <FadeUp className="bg-white rounded-none border border-cream-200 p-5 md:p-6">
            {!showAll && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-coffee-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-coffee-950">Pilih Meja</p>
                    <p className="text-xs text-coffee-800/60">Mau bikin QR untuk meja berapa?</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-5">
                  {tables.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTable(t === selectedTable ? null : t)}
                      className={`h-12 rounded-none text-sm font-bold transition-all ${
                        t === selectedTable
                          ? "bg-coffee-500 text-white shadow-md shadow-coffee-500/20"
                          : "bg-cream-50 border border-cream-200 text-coffee-800/70 hover:bg-cream-100 hover:text-coffee-950"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowAll(true)}
                  className="w-full py-2.5 rounded-none border border-dashed border-cream-300 text-sm text-coffee-800/60 hover:text-coffee-500 hover:border-coffee-300 transition-all flex items-center justify-center gap-2"
                >
                  <LayoutGrid className="w-4 h-4" /> Lihat Semua QR (Print All)
                </button>
              </>
            )}

            {selectedTable && !showAll && (
              <FadeUp className="pt-5 border-t border-cream-200">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-white rounded-none p-3 border border-cream-200 shadow-sm shrink-0">
                    <img src={cards[selectedTable] ?? qrUrl(selectedTable)} alt="QR Code" className="w-40 md:w-52 h-auto" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg font-bold text-coffee-950">Meja {selectedTable}</p>
                    <p className="text-xs text-coffee-800/60 mt-1">Scan QR → buka menu → pesan — meja {selectedTable} otomatis terisi</p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                      <button onClick={() => downloadQR(selectedTable)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-coffee-500 text-white text-sm font-medium hover:bg-coffee-600 active:scale-95 transition-all">
                        <Download className="w-3.5 h-3.5" /> Download QR
                      </button>
                      <button onClick={() => copyLink(selectedTable)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-cream-100 border border-cream-200 text-coffee-950 text-sm hover:bg-cream-200 active:scale-95 transition-all">
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </button>
                      <a href={menuUrl(selectedTable)} target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-cream-100 border border-cream-200 text-coffee-950 text-sm hover:bg-cream-200 active:scale-95 transition-all">
                        <ExternalLink className="w-3.5 h-3.5" /> Buka Menu
                      </a>
                    </div>
                  </div>
                </div>
              </FadeUp>
            )}

            {!selectedTable && !showAll && (
              <div className="text-center py-8 border-t border-cream-200">
                <QrCode className="w-10 h-10 mx-auto mb-2 text-coffee-800/25" />
                <p className="text-sm text-coffee-800/50">Pilih nomor meja dulu</p>
              </div>
            )}

            {showAll && (
              <FadeUp>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-semibold text-coffee-950">Semua QR Meja</p>
                    <p className="text-xs text-coffee-800/60 mt-1">Download semua QR, print, tempel di meja masing-masing</p>
                  </div>
                  <button onClick={() => setShowAll(false)}
                    className="w-8 h-8 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors">
                    <X className="w-4 h-4 text-coffee-800/70" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {tables.map((t) => (
                    <div key={t} className="bg-cream-50 rounded-none border border-cream-200 p-3 text-center">
                      <div className="bg-white rounded-none p-2 mb-2 border border-cream-200">
                        <img src={cards[t] ?? qrUrl(t)} alt={`Meja ${t}`} className="w-full h-auto" />
                      </div>
                      <p className="text-sm font-bold text-coffee-950">Meja {t}</p>
                      <div className="flex gap-1 mt-2 justify-center">
                        <button onClick={() => downloadQR(t)}
                          className="w-7 h-7 rounded-none bg-coffee-100 flex items-center justify-center hover:bg-coffee-200 transition-colors">
                          <Download className="w-3 h-3 text-coffee-500" />
                        </button>
                        <button onClick={() => copyLink(t)}
                          className="w-7 h-7 rounded-none bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors">
                          <Copy className="w-3 h-3 text-coffee-800/60" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeUp>
            )}
          </FadeUp>

          <FadeUp delay={0.08} className="mt-4 bg-white rounded-none border border-cream-200 grid grid-cols-3 divide-x divide-cream-200 text-center">
            <div className="px-3 py-4">
              <p className="text-lg font-bold text-coffee-950">{tables.length}</p>
              <p className="text-[11px] text-coffee-800/60 mt-0.5">QR Meja</p>
            </div>
            <div className="px-3 py-4">
              <p className="text-lg font-bold text-coffee-950">720×1000</p>
              <p className="text-[11px] text-coffee-800/60 mt-0.5">PNG siap print</p>
            </div>
            <button
              onClick={() => {
                if (!origin) return;
                navigator.clipboard.writeText(origin);
                setCopiedUrl(true);
                setTimeout(() => setCopiedUrl(false), 2000);
              }}
              className="px-3 py-4 hover:bg-cream-50 transition-colors"
              title="Copy URL publik"
            >
              <p className="text-sm font-bold text-coffee-950 truncate max-w-[26ch] mx-auto">
                {copiedUrl ? "Tersalin!" : origin ? origin.replace(/^https?:\/\//, "") : "…"}
              </p>
              <p className="text-[11px] text-coffee-800/60 mt-0.5">{copiedUrl ? "URL publik" : "Klik untuk copy URL"}</p>
            </button>
          </FadeUp>
        </main>
      </div>
    </div>
  );
}

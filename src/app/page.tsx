"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, Clock, MapPin, ArrowRight, Smartphone, CupSoda, Sprout, Flame, Timer } from "lucide-react";
import FadeUp from "@/components/FadeUp";

const MARQUEE = ["SCAN", "PESAN", "BAYAR", "NIKMATI"];

export default function LandingPage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [menuCount, setMenuCount] = useState(67);
  const [catCount, setCatCount] = useState(5);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((cats) => {
        const all = cats.flatMap((c: any) => c.items || []);
        setMenuCount(all.length || 67);
        setCatCount(cats.length || 5);
        for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
        setFeatured(all.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-dvh bg-coffee-950 text-cream-50">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-coffee-950/95 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-black uppercase tracking-tight text-cream-50" style={{ fontFamily: "var(--font-display)" }}>
            Brew<span className="text-coffee-500">&amp;</span>Co.
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/menu" className="font-mono text-xs text-cream-300 hover:text-coffee-400 transition-colors">Menu</Link>
              <Link href="#tentang" className="font-mono text-xs text-cream-300 hover:text-coffee-400 transition-colors">Tentang</Link>
              <Link href="#kontak" className="font-mono text-xs text-cream-300 hover:text-coffee-400 transition-colors">Kontak</Link>
            </nav>
            <Link
              href="/menu"
              className="inline-flex items-center px-5 py-2 bg-coffee-500 text-white font-semibold text-sm hover:bg-coffee-600 active:scale-95 transition-all"
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 md:pt-16 pb-12 md:pb-16">
            <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
              <div className="md:col-span-7">
                <FadeUp>
                  <p className="font-mono text-xs text-cream-300 mb-5">
                    Ngopi santai di Bandung
                  </p>
                  <h1
                    className="text-[clamp(2.4rem,6vw,4.75rem)] font-black leading-[1.02] tracking-tight text-cream-50"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Antre itu
                    <br />
                    <span className="text-coffee-500">buat yang lain.</span>
                  </h1>
                </FadeUp>
                <FadeUp delay={0.08}>
                  <p className="text-base sm:text-lg text-cream-300 max-w-md leading-relaxed mt-5 mb-7">
                    Dari espresso sampai matcha, semua lengkap. Bayar gampang, datangnya cepet, rasanya konsisten.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-coffee-500 text-white font-semibold text-sm hover:bg-coffee-600 active:scale-95 transition-all"
                    >
                      Pesan Sekarang
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a href="#cara" className="text-sm font-semibold text-cream-50 underline decoration-coffee-500 decoration-2 underline-offset-4 hover:text-coffee-400 transition-colors">
                      Cara kerjanya
                    </a>
                  </div>
                </FadeUp>
              </div>

              <FadeUp delay={0.12} className="md:col-span-5">
                <div className="relative">
                  <div className="absolute inset-0 translate-x-3 translate-y-3 border border-coffee-500" aria-hidden />
                  <div className="relative aspect-[4/5] overflow-hidden border border-white/15 bg-coffee-900">
                    <Image src="/images/coffee-detail.jpg" alt="Secangkir kopi Brew & Co." fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" priority />
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Strip statistik (di bawah hero) */}
        <div className="bg-coffee-900 border-y border-white/10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 grid grid-cols-3 divide-x divide-white/10 text-center">
            <div className="px-2">
              <p className="text-2xl md:text-3xl font-black text-cream-50 leading-none" style={{ fontFamily: "var(--font-display)" }}>{menuCount}+</p>
              <p className="font-mono text-[11px] text-cream-300 mt-1.5">menu</p>
            </div>
            <div className="px-2">
              <p className="text-2xl md:text-3xl font-black text-cream-50 leading-none" style={{ fontFamily: "var(--font-display)" }}>{catCount}</p>
              <p className="font-mono text-[11px] text-cream-300 mt-1.5">kategori</p>
            </div>
            <div className="px-2">
              <p className="text-2xl md:text-3xl font-black text-cream-50 leading-none" style={{ fontFamily: "var(--font-display)" }}>08-22</p>
              <p className="font-mono text-[11px] text-cream-300 mt-1.5">setiap hari</p>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="bg-coffee-500 overflow-hidden py-3.5">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {Array.from({ length: 4 }).flatMap((_, r) =>
                  MARQUEE.map((word) => (
                    <span key={`${k}-${r}-${word}`} className="flex items-center whitespace-nowrap">
                      <span className="text-white font-black uppercase text-sm tracking-widest px-6" style={{ fontFamily: "var(--font-display)" }}>
                        {word}
                      </span>
                      <span className="text-coffee-950 text-lg leading-none">✳</span>
                    </span>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cara kerja */}
        <section id="cara">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <FadeUp className="mb-10">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-cream-50" style={{ fontFamily: "var(--font-display)" }}>
                Tiga langkah, selesai.
              </h2>
            </FadeUp>

            <div>
              {[
                { num: "01", icon: Smartphone, title: "Scan QR di meja", desc: "Menu terbuka langsung di browser, tanpa install apa pun." },
                { num: "02", icon: Coffee, title: "Pilih dan pesan", desc: "Masukkan nama, pilih metode bayar, kirim. Pesanan masuk ke kasir." },
                { num: "03", icon: CupSoda, title: "Terima di meja", desc: "Barista proses, diantar ke meja lo. Tinggal nikmatin." },
              ].map((step, i) => (
                <FadeUp key={step.num} delay={i * 0.08}>
                  <div className="grid grid-cols-[auto_1fr] md:grid-cols-[7rem_auto_1fr] gap-x-5 md:gap-x-8 gap-y-2 items-baseline border-t border-white/10 py-7">
                    <span className="text-4xl md:text-6xl font-black text-coffee-500 leading-none" style={{ fontFamily: "var(--font-display)" }}>
                      {step.num}
                    </span>
                    <div className="flex items-center gap-3 md:pt-2">
                      <step.icon className="w-5 h-5 text-cream-300 shrink-0" />
                      <h3 className="text-base font-bold text-cream-50">{step.title}</h3>
                    </div>
                    <p className="col-span-2 md:col-span-1 text-sm text-cream-300 leading-relaxed max-w-md md:pt-2">{step.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Menu unggulan */}
        <section className="border-t border-white/10 bg-coffee-900">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <FadeUp className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-cream-50" style={{ fontFamily: "var(--font-display)" }}>
                Pilihan hari ini
              </h2>
              <Link href="/menu" className="flex items-center gap-1.5 text-sm font-semibold text-cream-50 underline decoration-coffee-500 decoration-2 underline-offset-4 hover:text-coffee-400 transition-colors">
                Lihat semua <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeUp>

            {featured.length >= 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featured.slice(0, 4).map((item: any, i: number) => (
                  <FadeUp key={item.id} delay={i * 0.06}>
                    <Link href="/menu" className="group block bg-coffee-800 border border-white/10 hover:border-coffee-500 transition-colors">
                      <div className="relative aspect-square overflow-hidden bg-coffee-900 border-b border-white/10 group-hover:border-coffee-500 transition-colors">
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                      </div>
                      <div className="p-3.5">
                        <p className="text-sm font-bold text-cream-50 truncate">{item.name}</p>
                        <p className="text-xs text-cream-300 mt-1 truncate">{item.description}</p>
                        <p className="mt-2.5 font-mono text-sm font-semibold text-coffee-400">
                          Rp{item.price.toLocaleString("id")}
                        </p>
                      </div>
                    </Link>
                  </FadeUp>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Tentang */}
        <section id="tentang">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <div className="grid md:grid-cols-12 gap-10 md:gap-14">
              <div className="md:col-span-5">
                <FadeUp>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-cream-50 leading-[1.05] mb-5" style={{ fontFamily: "var(--font-display)" }}>
                    Kopi enak,<br />tanpa drama.
                  </h2>
                  <p className="text-base text-cream-300 leading-relaxed max-w-md">
                    Dari espresso klasik sampai V60 spesial, semua bisa dipesan langsung dari meja. Biji disangrai in-house, disajikan dalam hitungan menit.
                  </p>
                </FadeUp>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <div className="border-t border-white/10">
                  {[
                    { icon: Sprout, title: "Single origin", desc: "Biji kopi lokal pilihan, disangrai mingguan" },
                    { icon: Flame, title: "Sangrai in-house", desc: "Kontrol rasa dari biji sampai cangkir" },
                    { icon: Timer, title: "5 menit ke meja", desc: "Diantar tanpa lo bangun dari kursi" },
                  ].map((v, i) => (
                    <FadeUp key={v.title} delay={i * 0.08}>
                      <div className="flex gap-4 py-5 border-b border-white/10">
                        <v.icon className="w-5 h-5 text-coffee-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-cream-50 mb-1">{v.title}</p>
                          <p className="text-sm text-cream-300 leading-relaxed">{v.desc}</p>
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimoni */}
        <section className="border-t border-white/10 bg-coffee-900">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <FadeUp>
              <p className="text-7xl md:text-8xl font-black text-coffee-500 leading-none -mb-6 select-none" aria-hidden style={{ fontFamily: "var(--font-display)" }}>
                &ldquo;
              </p>
              <blockquote className="text-2xl md:text-4xl font-black tracking-tight text-cream-50 leading-tight max-w-4xl" style={{ fontFamily: "var(--font-display)" }}>
                Pesen tinggal scan, duduk, dateng sendiri. Kopinya konsisten enak.
              </blockquote>
              <p className="mt-5 font-mono text-xs text-cream-300">Rizky, pelanggan</p>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-4 mt-14 max-w-4xl">
              {[
                { name: "Sari", quote: "Anak gw demen banget kopinya. Cepet, ga pake antri." },
                { name: "Dimas", quote: "Pertama kali pesen V60, baristanya jelasin detail. Bikin balik lagi." },
              ].map((t, i) => (
                <FadeUp key={t.name} delay={i * 0.08}>
                  <div className="h-full border border-white/10 bg-coffee-800 p-6">
                    <p className="text-sm text-cream-300 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                    <p className="font-mono text-[11px] text-cream-50">{t.name}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Galeri */}
        <section>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <FadeUp className="mb-10">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-cream-50" style={{ fontFamily: "var(--font-display)" }}>
                Sekilas Brew &amp; Co.
              </h2>
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { src: "/images/gallery-interior.jpg", alt: "Interior kedai", span: "col-span-2 row-span-2" },
                { src: "/images/gallery-barista.jpg", alt: "Barista meracik kopi" },
                { src: "/images/gallery-table.jpg", alt: "Meja kafe" },
                { src: "/images/gallery-latteart.jpg", alt: "Latte art" },
                { src: "/images/hero-bg.jpg", alt: "Suasana kopi" },
              ].map((img) => (
                <div key={img.src} className={`${img.span || ""} relative aspect-square overflow-hidden bg-coffee-900 border border-white/10`}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 bg-coffee-900">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24 text-center">
            <FadeUp>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-cream-50 leading-none mb-5" style={{ fontFamily: "var(--font-display)" }}>
                Siap pesan <span className="text-coffee-500">kopi?</span>
              </h2>
              <p className="text-sm text-cream-300 mb-9 max-w-sm mx-auto leading-relaxed">
                Buka menu, pilih favoritmu, tinggal duduk santai.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-4 bg-coffee-500 text-white font-semibold text-sm hover:bg-coffee-600 active:scale-95 transition-all"
              >
                Pesan Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeUp>
          </div>
        </section>

        {/* Kontak */}
        <section id="kontak">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-10 md:gap-14">
              <FadeUp>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-cream-50 mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Kunjungi kami
                </h2>
                <div className="relative aspect-[4/3] bg-coffee-900 border border-white/10 mb-6">
                  <iframe
                    src="https://maps.google.com/maps?q=Jl.%20Dipatiukur%2C%20Bandung&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Brew & Co."
                  />
                </div>
                <p className="text-sm text-cream-300 leading-relaxed">
                  Jl. Dipatiukur No. 123, Lebakgede, Coblong, Bandung 40132
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-cream-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-mono">Setiap hari 08.00-22.00 WIB</span>
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-cream-50 mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Hubungi kami
                </h2>
                <ul>
                  {[
                    { label: "Telepon", val: "+62 812-3456-7890" },
                    { label: "Email", val: "hello@brewco.id" },
                    { label: "Instagram", val: "@brewco.bandung" },
                  ].map((c) => (
                    <li key={c.label} className="border-t border-white/10 py-4 flex items-baseline justify-between gap-4">
                      <p className="font-mono text-xs text-cream-300">{c.label}</p>
                      <p className="text-sm font-bold text-cream-50 text-right">{c.val}</p>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 mt-6 text-xs text-cream-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-mono">Bandung, Jawa Barat</span>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-coffee-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-base font-black uppercase tracking-tight text-cream-50 mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Brew<span className="text-coffee-500">&amp;</span>Co.
            </p>
            <p className="text-xs text-cream-300 max-w-xs leading-relaxed">
              Digital menu & pesan dari meja. Jl. Dipatiukur No. 123, Bandung.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-5 font-mono text-xs text-cream-300">
            <Link href="/menu" className="hover:text-coffee-400 transition-colors">Menu</Link>
            <Link href="#tentang" className="hover:text-coffee-400 transition-colors">Tentang</Link>
            <Link href="#kontak" className="hover:text-coffee-400 transition-colors">Kontak</Link>
            <Link href="/admin" className="hover:text-coffee-400 transition-colors">Admin</Link>
          </nav>
          <p className="font-mono text-[11px] text-cream-300">&copy; 2026 Brew &amp; Co.</p>
        </div>
      </footer>
    </div>
  );
}

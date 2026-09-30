"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, Clock, MapPin, ArrowRight, Smartphone, CupSoda, Sprout, Flame, Timer } from "lucide-react";
import FadeUp from "@/components/FadeUp";
import ThemeToggle from "@/components/ThemeToggle";
import type { Category, MenuItem } from "@/types";

const GALLERY: { src: string; alt: string; span?: string }[] = [
  { src: "/images/gallery-interior.jpg", alt: "Interior kedai", span: "col-span-2 row-span-2" },
  { src: "/images/gallery-barista.jpg", alt: "Barista meracik kopi" },
  { src: "/images/gallery-table.jpg", alt: "Meja kafe" },
  { src: "/images/gallery-latteart.jpg", alt: "Latte art" },
  { src: "/images/hero-bg.jpg", alt: "Suasana kopi" },
];

const INFO_STRIP = ["Jl. Dipatiukur No. 123, Bandung", "Scan QR di meja", "Tanpa antre, bayar dari HP"];

const FOOTER: { head: string; items: { t: string; href?: string }[] }[] = [
  { head: "Kunjungi", items: [{ t: "Jl. Dipatiukur No. 123" }, { t: "Lebakgede, Coblong" }, { t: "Bandung 40132" }] },
  { head: "Jam buka", items: [{ t: "Setiap hari" }, { t: "08.00 – 22.00 WIB" }] },
  {
    head: "Kontak",
    items: [
      { t: "+62 812-3456-7890", href: "tel:+6281234567890" },
      { t: "hello@brewco.id", href: "mailto:hello@brewco.id" },
      { t: "@brewco.bandung" },
    ],
  },
  {
    head: "Jelajahi",
    items: [
      { t: "Menu", href: "/menu" },
      { t: "Tentang", href: "#tentang" },
      { t: "Kontak", href: "#kontak" },
      { t: "Pesan sekarang", href: "/menu" },
    ],
  },
];

export default function LandingPage() {
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [menuCount, setMenuCount] = useState(67);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((cats: Category[]) => {
        setMenuCount(cats.flatMap((c) => c.items || []).length || 67);
        // ponytail: kurasi stabil — 1 item pertama tiap kategori, bukan shuffle acak tiap load
        setFeatured(cats.slice(0, 4).flatMap((c) => (c.items || []).slice(0, 1)));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-dvh overflow-x-clip bg-cream-50 text-coffee-950">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-cream-50/90 backdrop-blur border-b border-cream-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-black uppercase tracking-tight text-coffee-950" style={{ fontFamily: "var(--font-display)" }}>
            Brew<span className="text-coffee-400">&amp;</span>Co.
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/menu" className="font-mono text-xs text-coffee-700 hover:text-coffee-950 transition-colors">Menu</Link>
              <Link href="#tentang" className="font-mono text-xs text-coffee-700 hover:text-coffee-950 transition-colors">Tentang</Link>
              <Link href="#kontak" className="font-mono text-xs text-coffee-700 hover:text-coffee-950 transition-colors">Kontak</Link>
            </nav>
            <ThemeToggle />
            <Link
              href="/menu"
              className="inline-flex items-center px-5 py-2 bg-coffee-500 text-white font-semibold text-sm hover:bg-coffee-600 active:scale-95 transition-colors"
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
            <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
              <div className="md:col-span-7">
                <div className="anim-fade-up">
                  <p className="font-mono text-xs text-coffee-700 mb-5">
                    Kedai kopi &middot; Dipatiukur, Bandung
                  </p>
                  <h1
                    className="text-[clamp(2.6rem,6vw,4.5rem)] font-black leading-[1.02] tracking-tight text-coffee-950"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Antre itu
                    <br />
                    <span className="text-coffee-500">buat yang lain.</span>
                  </h1>
                </div>
                <div className="anim-fade-up" style={{ animationDelay: "80ms" }}>
                  <p className="text-base sm:text-lg text-coffee-700 max-w-lg leading-relaxed mt-5 mb-7">
                    Espresso, kopi susu, sampai matcha dan pisang goreng semua bisa dipesan
                    sambil duduk. Buka menu dari HP, bayar sekali jalan, tinggal tunggu datang.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-coffee-500 text-white font-semibold text-sm hover:bg-coffee-600 active:scale-95 transition-colors"
                    >
                      Pesan Sekarang
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a href="#cara" className="text-sm font-semibold text-coffee-950 underline decoration-coffee-500 decoration-2 underline-offset-4 hover:text-coffee-700 transition-colors">
                      Cara kerjanya
                    </a>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 anim-fade-up" style={{ animationDelay: "120ms" }}>
                <div className="relative">
                  <div className="absolute inset-0 -translate-x-3 translate-y-3 border border-coffee-950" aria-hidden />
                  <div className="relative aspect-[4/5] overflow-hidden border border-cream-300 bg-cream-100">
                    <Image src="/images/coffee-detail.jpg" alt="Secangkir kopi Brew & Co." fill className="object-cover" sizes="(max-width: 768px) 100vw, 30vw" priority />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strip statistik (di bawah hero) */}
        <div className="bg-white border-y border-cream-200">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 grid grid-cols-3 divide-x divide-cream-200 text-center">
            <div className="px-2">
              <p className="text-2xl md:text-3xl font-black text-coffee-950 leading-none" style={{ fontFamily: "var(--font-display)" }}>{menuCount}+</p>
              <p className="font-mono text-[11px] text-coffee-700 mt-1.5">menu</p>
            </div>
            <div className="px-2">
              <p className="text-2xl md:text-3xl font-black text-coffee-950 leading-none" style={{ fontFamily: "var(--font-display)" }}>5</p>
              <p className="font-mono text-[11px] text-coffee-700 mt-1.5">mnt ke meja</p>
            </div>
            <div className="px-2">
              <p className="text-2xl md:text-3xl font-black text-coffee-950 leading-none" style={{ fontFamily: "var(--font-display)" }}>08&ndash;22</p>
              <p className="font-mono text-[11px] text-coffee-700 mt-1.5">setiap hari</p>
            </div>
          </div>
        </div>

        {/* Strip info — fakta, bukan hiasan */}
        <div className="bg-cream-100 border-b border-cream-200">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-center font-mono text-xs text-coffee-800">
            {INFO_STRIP.map((t, i) => (
              <span key={t} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden className="text-coffee-700">&middot;</span>}
                <span>{t}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Cara kerja */}
        <section id="cara">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <FadeUp className="mb-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coffee-700 mb-3">01 / Cara pesan</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-coffee-950" style={{ fontFamily: "var(--font-display)" }}>
                Tiga langkah, selesai.
              </h2>
            </FadeUp>

            <div>
              {[
                { num: "01", icon: Smartphone, title: "Scan QR di meja", desc: "Menu terbuka langsung di browser, tanpa install apa pun." },
                { num: "02", icon: Coffee, title: "Pilih dan pesan", desc: "Masukkan nama, pilih metode bayar, kirim. Pesanan masuk ke kasir." },
                { num: "03", icon: CupSoda, title: "Terima di meja", desc: "Barista meracik, diantar ke meja. Tinggal dinikmati." },
              ].map((step, i) => (
                <FadeUp key={step.num} delay={i * 0.08}>
                  <div className="grid grid-cols-[auto_1fr] md:grid-cols-[7rem_auto_1fr] gap-x-5 md:gap-x-8 gap-y-2 items-baseline border-t border-cream-200 py-7">
                    <span className="text-4xl md:text-6xl font-black text-coffee-950 leading-none" style={{ fontFamily: "var(--font-display)" }}>
                      {step.num}
                    </span>
                    <div className="flex items-center gap-3 md:pt-2">
                      <step.icon className="w-5 h-5 text-coffee-700 shrink-0" />
                      <h3 className="text-base font-bold text-coffee-950">{step.title}</h3>
                    </div>
                    <p className="col-span-2 md:col-span-1 text-sm text-coffee-700 leading-relaxed max-w-md md:pt-2">{step.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Menu unggulan */}
        {featured.length > 0 && (
          <section className="border-t border-cream-200 bg-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
              <FadeUp className="flex flex-wrap items-end justify-between gap-4 mb-10">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coffee-700 mb-3">02 / Menu unggulan</p>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-coffee-950" style={{ fontFamily: "var(--font-display)" }}>
                    Pilihan hari ini
                  </h2>
                </div>
                <Link href="/menu" className="flex items-center gap-1.5 text-sm font-semibold text-coffee-950 underline decoration-coffee-500 decoration-2 underline-offset-4 hover:text-coffee-700 transition-colors">
                  Lihat semua <ArrowRight className="w-4 h-4" />
                </Link>
              </FadeUp>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featured.slice(0, 4).map((item, i) => (
                  <FadeUp key={item.id} delay={i * 0.06}>
                    <Link href="/menu" className="group block bg-white border border-cream-200 hover:border-cream-300 transition-colors">
                      <div className="relative aspect-square overflow-hidden bg-cream-100 border-b border-cream-200">
                        <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                      </div>
                      <div className="p-3.5">
                        <p className="text-sm font-bold text-coffee-950 truncate">{item.name}</p>
                        <p className="text-xs text-coffee-700 mt-1 truncate">{item.description}</p>
                        <p className="mt-2.5 font-mono text-sm font-semibold text-coffee-500">
                          Rp{item.price.toLocaleString("id")}
                        </p>
                      </div>
                    </Link>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tentang */}
        <section id="tentang">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <div className="grid md:grid-cols-12 gap-10 md:gap-14">
              <div className="md:col-span-5">
                <FadeUp>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coffee-700 mb-3">03 / Tentang kedai</p>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-coffee-950 leading-[1.05] mb-5" style={{ fontFamily: "var(--font-display)" }}>
                    Kopi enak,<br />tanpa drama.
                  </h2>
                  <p className="text-base text-coffee-700 leading-relaxed max-w-md">
                    Dari espresso klasik sampai V60 spesial, semua bisa dipesan langsung dari meja. Biji disangrai in-house, disajikan dalam hitungan menit.
                  </p>
                </FadeUp>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <div className="border-t border-cream-200">
                  {[
                    { icon: Sprout, title: "Single origin", desc: "Biji kopi lokal pilihan, disangrai mingguan" },
                    { icon: Flame, title: "Sangrai in-house", desc: "Kontrol rasa dari biji sampai cangkir" },
                    { icon: Timer, title: "5 menit ke meja", desc: "Langsung ke meja, tanpa perlu bangun dari kursi" },
                  ].map((v, i) => (
                    <FadeUp key={v.title} delay={i * 0.08}>
                      <div className="flex gap-4 py-5 border-b border-cream-200">
                        <v.icon className="w-5 h-5 text-coffee-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-coffee-950 mb-1">{v.title}</p>
                          <p className="text-sm text-coffee-700 leading-relaxed">{v.desc}</p>
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimoni — satu kutipan, gak dipecah jadi kartu-kartu */}
        <section className="border-t border-cream-200 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <FadeUp>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coffee-700 mb-8">04 / Kata mereka</p>
              <blockquote className="max-w-4xl border-l-2 border-coffee-500 pl-5 md:pl-8">
                <p
                  className="text-[clamp(1.6rem,3.4vw,2.75rem)] font-black tracking-tight text-coffee-950 leading-[1.15]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  &ldquo;Pesen tinggal scan, duduk, dateng sendiri. Kopinya konsisten enak.&rdquo;
                </p>
                <footer className="mt-8 flex items-center gap-3">
                  <span
                    className="w-10 h-10 shrink-0 bg-coffee-950 text-cream-50 text-sm font-black flex items-center justify-center"
                    style={{ fontFamily: "var(--font-display)" }}
                    aria-hidden
                  >
                    R
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-coffee-950">Rizky</span>
                    <span className="block font-mono text-[11px] text-coffee-700 mt-0.5">Pelanggan tetap</span>
                  </span>
                </footer>
              </blockquote>
            </FadeUp>
          </div>
        </section>

        {/* Galeri */}
        <section>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <FadeUp className="mb-10 flex flex-col items-end text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coffee-700 mb-3">05 / Galeri</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-coffee-950" style={{ fontFamily: "var(--font-display)" }}>
                Sekilas Brew &amp; Co.
              </h2>
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GALLERY.map((img) => (
                <div key={img.src} className={`tile ${img.span || ""} relative aspect-square overflow-hidden bg-cream-100 border border-cream-200`}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover tile-gray" sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kontak */}
        <section id="kontak" className="border-t border-cream-200 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <FadeUp className="mb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coffee-700">06 / Kontak</p>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-10 md:gap-14">
              <FadeUp>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-coffee-950 mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Kunjungi kami
                </h2>
                <div className="relative aspect-[4/3] bg-cream-100 border border-cream-200 mb-6">
                  <iframe
                    src="https://maps.google.com/maps?q=Jl.%20Dipatiukur%2C%20Bandung&z=15&output=embed"
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
                <p className="text-sm text-coffee-700 leading-relaxed">
                  Jl. Dipatiukur No. 123, Lebakgede, Coblong, Bandung 40132
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-coffee-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-mono">Setiap hari 08.00-22.00 WIB</span>
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-coffee-950 mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Hubungi kami
                </h2>
                <ul>
                  {[
                    { label: "Telepon", val: "+62 812-3456-7890" },
                    { label: "Email", val: "hello@brewco.id" },
                    { label: "Instagram", val: "@brewco.bandung" },
                  ].map((c) => (
                    <li key={c.label} className="border-t border-cream-200 py-4 flex items-baseline justify-between gap-4">
                      <p className="font-mono text-xs text-coffee-700">{c.label}</p>
                      <p className="text-sm font-bold text-coffee-950 text-right">{c.val}</p>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 mt-6 text-xs text-coffee-700">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-mono">Bandung, Jawa Barat</span>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* CTA — satu-satunya block gelap, nutup halaman (ink gak ikut dark mode) */}
        <section className="bg-ink">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24 text-center">
            <FadeUp>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-paper leading-none mb-5" style={{ fontFamily: "var(--font-display)" }}>
                Siap pesan <span className="text-coffee-400">kopi?</span>
              </h2>
              <p className="text-sm text-paper/75 mb-9 max-w-sm mx-auto leading-relaxed">
                Buka menu, pilih favoritmu, tinggal duduk santai.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-4 bg-coffee-500 text-white font-semibold text-sm hover:bg-coffee-600 active:scale-95 transition-colors"
              >
                Pesan Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeUp>
          </div>
        </section>
      </main>

      {/* Footer — direktori + wordmark raksasa */}
      <footer className="bg-ink border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-12 grid grid-cols-2 lg:grid-cols-4 gap-9">
          {FOOTER.map((col) => (
            <div key={col.head}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coffee-400 mb-4">{col.head}</p>
              <ul className="space-y-1.5">
                {col.items.map((it) => (
                  <li key={it.t} className="text-sm leading-snug text-paper/75">
                    {it.href ? (
                      <a href={it.href} className="hover:text-coffee-400 transition-colors">{it.t}</a>
                    ) : (
                      it.t
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 border-t border-white/10 pt-7 pb-6 overflow-hidden">
          <p
            className="text-[clamp(3rem,15vw,11.5rem)] font-black uppercase leading-[0.82] tracking-[-0.04em] text-paper whitespace-nowrap"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Brew<span className="text-coffee-400">&amp;</span>Co.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 border-t border-white/10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-[11px] text-paper/70">
          <span>&copy; 2026 Brew &amp; Co.</span>
          <span>Digital menu &amp; pesan dari meja — Bandung, Jawa Barat</span>
        </div>
      </footer>
    </div>
  );
}

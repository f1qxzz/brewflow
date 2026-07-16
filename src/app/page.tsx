"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Coffee, Smartphone, CupSoda, Clock, MapPin, ArrowRight, ChevronRight, Plus, Sparkles, ScanLine, Star, ChevronDown, Heart, Leaf } from "lucide-react";

const MotionLink = motion.create(Link);
const MotionImg = motion.create(Image);

function useSSR() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

function FadeUp({ children, delay = 0, y = 24, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useSSR();
  if (!mounted || reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StaggerChildren({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useSSR();
  if (!mounted || reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useSSR();
  if (!mounted || reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

function HoverCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--rx", `${x * 6}deg`);
        el.style.setProperty("--ry", `${y * 6}deg`);
      }}
      onMouseLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      }}
      className={`transition-transform duration-200 ${className || ""}`}
      style={{ transform: "perspective(800px) rotateX(var(--ry, 0deg)) rotateY(var(--rx, 0deg))" }}
    >
      {children}
    </div>
  );
}

function NavHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0C0A09]/80 backdrop-blur-xl border-b border-white/[0.06]" : "bg-[#0C0A09]/40 backdrop-blur-md border-b border-transparent"}`}
    >
      {children}
    </motion.header>
  );
}

const NAV_LINKS = ["Menu", "Tentang", "Kontak"];

export default function LandingPage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((cats) => {
        const all = cats.flatMap((c: any) => c.items || []);
        for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
        setFeatured(all.slice(0, 4));
      });
  }, []);

  return (
    <div className="min-h-dvh bg-[#0C0A09]">
      {/* ===== NAV ===== */}
      <NavHeader>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coffee-400 to-coffee-600 flex items-center justify-center shadow-lg shadow-coffee-500/20 group-hover:shadow-coffee-500/30 transition-shadow group-hover:scale-105 transition-all duration-300">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:inline" style={{ fontFamily: "var(--font-playfair)" }}>
              Brew<span className="text-coffee-400"> & </span>Co.
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <nav className="hidden sm:flex items-center gap-0.5 mr-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item}
                  href={item === "Menu" ? "/menu" : item === "Kontak" ? "#kontak" : "#tentang"}
                  className="relative px-3.5 py-1.5 text-sm text-white/50 hover:text-white transition-colors after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-px after:bg-coffee-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  {item}
                </Link>
              ))}
            </nav>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-coffee-500 to-coffee-600 text-white rounded-full text-sm font-semibold hover:from-coffee-400 hover:to-coffee-500 active:scale-95 transition-all shadow-lg shadow-coffee-500/25 hover:shadow-coffee-500/40"
            >
              Mulai Pesan
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </NavHeader>

      <main>
        {/* ===== HERO ===== */}
        <section className="relative flex items-start md:items-center overflow-hidden pt-16 md:min-h-[100dvh]">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 8, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover opacity-40" sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09] via-[#0C0A09]/85 to-[#0C0A09]" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
          </motion.div>
          <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] rounded-full bg-coffee-500/10 blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-[25rem] h-[25rem] rounded-full bg-coffee-400/8 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-coffee-300/10 blur-[60px]" />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pb-16 pt-20 md:py-0">
            <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-center">
              <div className="md:col-span-7">
                <StaggerChildren>
                  <StaggerItem>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coffee-500/10 border border-coffee-500/20 text-coffee-300 text-xs font-medium mb-6">
                      <Sparkles className="w-3.5 h-3.5" />
                      Digital Menu — Brew & Co.
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-white leading-[1.0] tracking-tight mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                      Kopi<span className="text-coffee-300">,</span> Cerita<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 via-coffee-200 to-coffee-400">Satu Tegukan</span>
                    </h1>
                  </StaggerItem>
                  <StaggerItem>
                    <p className="text-base sm:text-lg text-white/50 max-w-lg mb-8 leading-relaxed">
                      Scan QR dari meja, langsung pesan kopi favorit. Cepat, mudah, tanpa ribet.
                    </p>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/menu"
                        className="group inline-flex items-center gap-2 px-7 py-3.5 bg-coffee-500 text-white rounded-full font-semibold hover:bg-coffee-400 active:scale-95 transition-all shadow-xl shadow-coffee-500/30"
                      >
                        Lihat Menu
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                      <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white/80 rounded-full font-medium hover:bg-white/[0.06] hover:text-white active:scale-95 transition-all"
                      >
                        <ScanLine className="w-4 h-4" />
                        Pesan Sekarang
                      </Link>
                    </div>
                  </StaggerItem>
                </StaggerChildren>
              </div>

              <div className="md:col-span-5 relative">
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0, delay: 0.2, ease: [0.32, 0, 0.15, 1] }}
                  className="relative md:mt-0"
                >
                  <div className="relative rounded-[2rem] overflow-hidden ring-1 ring-white/[0.06]">
                    <div className="h-72 md:h-auto md:aspect-[4/5]">
                      <Image src="/images/coffee-detail.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" priority />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/5 to-transparent pointer-events-none" />
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/[0.08] p-4">
                      <p className="text-[11px] font-semibold text-coffee-300 tracking-wider uppercase mb-1">Menu Unggulan</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">Cold Brew</p>
                          <p className="text-xs text-white/40 mt-0.5">Single Origin, Slow Drip</p>
                        </div>
                        <span className="text-sm text-white font-mono">Rp28k</span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9, ease: [0.32, 0, 0.15, 1] }}
                    className="absolute -right-2 md:-right-3 top-6 md:top-8 z-10"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-coffee-500 shadow-xl shadow-coffee-500/40">
                      <Star className="w-4 h-4 fill-white text-white" />
                      <span className="text-sm font-bold text-white">4.9</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.1, ease: [0.32, 0, 0.15, 1] }}
                    className="absolute -bottom-3 -left-2 md:-left-3 z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/[0.08] flex items-center justify-center"
                  >
                    <div className="text-center">
                      <p className="text-lg font-bold text-white leading-none">19+</p>
                      <p className="text-[8px] font-medium text-white/60">Menu</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
          >
            <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </section>

        {/* ===== BRAND STORY ===== */}
        <section id="tentang" className="max-w-7xl mx-auto px-4 sm:px-8 py-28 md:py-40">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="md:col-span-6">
              <FadeUp>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-500/10 border border-coffee-500/20 text-coffee-300 text-xs font-medium mb-5">
                  <Leaf className="w-3 h-3" />
                  Tentang Kami
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
                  Kopi Berkualitas,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 to-coffee-400">Tanpa Drama</span>
                </h2>
                <p className="text-white/50 leading-relaxed text-sm md:text-base max-w-lg mb-8">
                  Brew & Co. hadir buat kamu yang pengen nikmatin kopi enak tanpa ribet. Dari espresso klasik sampai V60 spesial, semua bisa kamu pesan langsung dari meja.
                </p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <div className="grid grid-cols-3 gap-4 max-w-lg">
                  {[
                    { icon: "☕", title: "Single Origin", desc: "Biji kopi lokal" },
                    { icon: "🏠", title: "Roasted In-house", desc: "Sangrai sendiri" },
                    { icon: "⚡", title: "5 Menit Saji", desc: "Dari pesan ke meja" },
                  ].map((v) => (
                    <div key={v.title} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-xl block mb-2">{v.icon}</span>
                      <p className="text-xs font-semibold text-white mb-0.5">{v.title}</p>
                      <p className="text-[10px] text-white/40">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.32, 0, 0.15, 1] }}
              className="hidden md:block md:col-span-5 md:col-start-8"
            >
              <div className="relative rounded-[2rem] overflow-hidden ring-1 ring-white/[0.06] group">
                <div className="aspect-[4/5]" />
                <Image src="/images/latte.jpg" alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 45vw" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>

          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="border-y border-white/[0.06] bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-28 md:py-40">
            <FadeUp className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-500/10 border border-coffee-500/20 text-coffee-300 text-xs font-medium mb-5">
                <Smartphone className="w-3 h-3" />
                Cara Kerja
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                Pesan dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 to-coffee-400">3 Langkah</span>
              </h2>
            </FadeUp>

            <div>
              <div className="max-w-3xl mx-auto">
                <StaggerChildren className="space-y-5 md:space-y-6">
                  {[
                    { num: "01", icon: Smartphone, title: "Scan QR", desc: "Buka menu dari meja", time: "5 detik" },
                    { num: "02", icon: Coffee, title: "Pilih & Pesan", desc: "Pilih menu favorit, kirim", time: "2 menit" },
                    { num: "03", icon: CupSoda, title: "Bayar & Nikmati", desc: "Bayar, kopi diantar ke meja", time: "5 menit saji" },
                  ].map((step) => (
                    <StaggerItem key={step.num}>
                      <HoverCard className="group flex items-center gap-5 md:gap-7 p-5 md:p-7 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
                        <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full bg-coffee-500/10 border border-coffee-500/20 flex items-center justify-center text-coffee-300 group-hover:bg-coffee-500/20 group-hover:border-coffee-500/30 transition-all">
                          <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-mono font-bold text-coffee-400">{step.num}</span>
                            <h3 className="text-base md:text-lg font-bold text-white">{step.title}</h3>
                          </div>
                          <p className="text-xs md:text-sm text-white/40">{step.desc}</p>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] text-[10px] text-white/30 font-mono mt-2">
                            ⏱ {step.time}
                          </div>
                        </div>
                      </HoverCard>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              </div>

  
            </div>
          </div>
        </section>

        {/* ===== FEATURED MENU ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-28 md:py-40">
          <FadeUp className="flex items-end justify-between mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-500/10 border border-coffee-500/20 text-coffee-300 text-xs font-medium mb-5">
                <Coffee className="w-3 h-3" />
                Menu Pilihan
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                Favorit <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 to-coffee-400">Hari Ini</span>
              </h2>
            </div>
            <Link href="/menu" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-coffee-400 hover:text-coffee-300 transition-colors">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeUp>

          {featured.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.32, 0, 0.15, 1] }}
                className="col-span-2 md:col-span-1 md:row-span-2"
              >
                <HoverCard className="group relative min-h-[20rem] md:h-full rounded-2xl overflow-hidden ring-1 ring-white/[0.06] hover:ring-coffee-500/30 transition-all duration-300">
                  <div className="absolute inset-0">
                    <Image src={featured[0].image} alt={featured[0].name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 30vw" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/20 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-5">
                    <div className="mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-coffee-500 text-white text-[10px] font-semibold">Best Seller</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{featured[0].name}</h3>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2">{featured[0].description || "Menu andalan Brew & Co."}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-mono text-white">Rp{featured[0].price.toLocaleString()}</span>
                      <span className="w-9 h-9 rounded-full bg-white/[0.1] backdrop-blur flex items-center justify-center text-white/60 group-hover:bg-coffee-500 group-hover:text-white transition-all duration-200">
                        <Plus className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </HoverCard>
              </motion.div>

              {featured.slice(1, 3).map((item: any, i: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.32, 0, 0.15, 1] }}
                  className="col-span-1"
                >
                  <HoverCard className="group relative min-h-[14rem] md:h-full rounded-2xl overflow-hidden ring-1 ring-white/[0.06] hover:ring-coffee-500/30 transition-all duration-300">
                    <div className="absolute inset-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 20vw" />
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-4 md:p-5 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/10 to-transparent">
                      <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-mono text-white/60">Rp{item.price.toLocaleString()}</span>
                        <span className="w-7 h-7 rounded-full bg-white/[0.1] backdrop-blur flex items-center justify-center text-white/40 group-hover:bg-coffee-500 group-hover:text-white transition-all duration-200">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </HoverCard>
                </motion.div>
              ))}

              {featured.length > 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, ease: [0.32, 0, 0.15, 1] }}
                  className="col-span-2"
                >
                  <HoverCard className="group relative rounded-2xl overflow-hidden ring-1 ring-white/[0.06] hover:ring-coffee-500/30 transition-all duration-300">
                    <div className="aspect-[5/3] md:aspect-[5/2]">
                      <Image src={featured[3].image} alt={featured[3].name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 60vw" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A09] via-[#0C0A09]/30 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-between p-5 md:p-6">
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-white">{featured[3].name}</h3>
                        <p className="text-xs text-white/50 mt-1 max-w-md truncate">{featured[3].description || ""}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-white">Rp{featured[3].price.toLocaleString()}</span>
                        <span className="w-9 h-9 rounded-full bg-white/[0.1] backdrop-blur flex items-center justify-center text-white/60 group-hover:bg-coffee-500 group-hover:text-white transition-all duration-200">
                          <Plus className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </HoverCard>
                </motion.div>
              )}
            </div>
          )}

          <FadeUp className="text-center mt-10 md:hidden">
            <Link href="/menu" className="inline-flex items-center gap-1 text-sm font-medium text-coffee-400">
              Lihat Semua Menu <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </section>

        {/* ===== TESTIMONIAL ===== */}
        <section className="border-y border-white/[0.06] bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-28 md:py-40">
            <FadeUp className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-500/10 border border-coffee-500/20 text-coffee-300 text-xs font-medium mb-5">
                <Heart className="w-3 h-3" />
                Kata Mereka
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                Yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 to-coffee-400">Pelanggan</span> Katakan
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {[
                { name: "Rizky", initial: "R", quote: "Enak banget sumpah. Pesen tinggal scan QR, duduk, dateng sendiri. Kopi nya nge-hits!", rating: 5, label: "Regular Customer", time: "2 minggu lalu" },
                { name: "Sari", initial: "S", quote: "Anak gw demen banget kopi susunya. Recommended! Pesennya cepet, ga pake antri.", rating: 5, label: "New Customer", time: "1 minggu lalu" },
                { name: "Dimas", initial: "D", quote: "Pertama kali ke sini pesen V60, baristanya explain detail. Bikin pengen balik lagi.", rating: 5, label: "Coffee Enthusiast", time: "3 hari lalu" },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.32, 0, 0.15, 1] }}
                  className="p-6 md:p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-coffee-400 text-coffee-400" />
                    ))}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-5">{'\u201C'}{t.quote}{'\u201D'}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                    <div className="w-9 h-9 rounded-full bg-coffee-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {t.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                        <span>{t.label}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{t.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== GALLERY ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-28 md:py-40">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-500/10 border border-coffee-500/20 text-coffee-300 text-xs font-medium mb-5">
              <Coffee className="w-3 h-3" />
              Suasana
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
              Sekilas <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 to-coffee-400">Brew {'&'} Co.</span>
            </h2>
          </FadeUp>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          >
            {[
              { src: "/images/espresso.jpg", span: "col-span-2 row-span-2", aspect: "aspect-square" },
              { src: "/images/latte.jpg", span: "col-span-1 row-span-1", aspect: "aspect-square" },
              { src: "/images/v60.jpg", span: "col-span-1 row-span-1", aspect: "aspect-square" },
              { src: "/images/croissant.jpg", span: "col-span-1 row-span-1", aspect: "aspect-square" },
              { src: "/images/cappuccino.jpg", span: "col-span-1 row-span-1", aspect: "aspect-square" },
            ].map((img, i) => (
              <motion.div
                key={img.src}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0, 0.15, 1] } } }}
                className={`${img.span} relative rounded-2xl overflow-hidden ring-1 ring-white/[0.06] ${img.aspect} group`}
              >
                <Image src={img.src} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
                <div className="absolute inset-0 ring-1 ring-white/[0.04] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ===== CTA ===== */}
        <section className="relative overflow-hidden">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 8, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-coffee-950/90 via-coffee-950/70 to-[#0C0A09]/90" />
          </motion.div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-coffee-500/5 blur-[120px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-28 md:py-40 text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Siap Pesan Kopi?
              </h2>
              <p className="text-white/40 text-sm md:text-base mb-8 leading-relaxed max-w-md mx-auto">
                Scan QR di meja atau langsung buka menu. Ngga perlu antre, tinggal duduk santai.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-coffee-500 text-white rounded-full font-semibold hover:bg-coffee-400 active:scale-95 transition-all shadow-xl shadow-coffee-500/30"
              >
                <Coffee className="w-5 h-5" />
                Mulai Pesan Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeUp>
          </div>
        </section>

        {/* ===== KUNJUNGI & HUBUNGI ===== */}
        <section id="kontak" className="border-y border-white/[0.06] bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-28 md:py-40">
            <FadeUp className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-500/10 border border-coffee-500/20 text-coffee-300 text-xs font-medium mb-5">
                <MapPin className="w-3 h-3" />
                Kontak
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 to-coffee-400">Kunjungi</span> &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 to-coffee-400">Hubungi</span> Kami
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.32, 0, 0.15, 1] }}
                className="relative rounded-2xl overflow-hidden ring-1 ring-white/[0.06] aspect-[4/3] md:aspect-auto md:min-h-[24rem]"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8!2d107.619!3d-6.917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9b0a0a0a0a1%3A0x0!2zNsKwNTUnMDIuOSJTIDEwN8KwMTcnMDguOSJF!5e0!3m2!1sen!2sid!4v1"
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                  style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) saturate(0.5)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 ring-1 ring-white/[0.04] pointer-events-none" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.32, 0, 0.15, 1] }}
                className="flex flex-col justify-center space-y-6 md:space-y-8"
              >
                <div>
                  <p className="text-xs text-coffee-400 font-medium mb-1">Kunjungi Kami</p>
                  <h3 className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Brew & Co. Coffee</h3>
                  <p className="text-sm text-white/40 mt-1 leading-relaxed max-w-sm">
                    Jl. Dipatiukur No. 123, Lebakgede, Kec. Coblong, Kota Bandung, Jawa Barat 40132
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-white/30">
                    <Clock className="w-3 h-3" />
                    <span>Buka Setiap Hari · 08.00 — 22.00 WIB</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-6 md:pt-8">
                  <p className="text-xs text-coffee-400 font-medium mb-3">Hubungi Kami</p>
                  <div className="space-y-3">
                    {[
                      { icon: "📞", label: "Telepon", val: "+62 812-3456-7890" },
                      { icon: "✉️", label: "Email", val: "hello@brewco.id" },
                      { icon: "📱", label: "Instagram", val: "@brewco.bandung" },
                    ].map((c) => (
                      <div key={c.label} className="flex items-center gap-3">
                        <span className="text-lg">{c.icon}</span>
                        <div>
                          <p className="text-[10px] text-white/30 font-medium">{c.label}</p>
                          <p className="text-sm text-white/80">{c.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] bg-[#0C0A09] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-coffee-500/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            <div>
              <Link href="/" className="flex items-center gap-2.5 group mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-coffee-400 to-coffee-600 flex items-center justify-center shadow-lg shadow-coffee-500/20">
                  <Coffee className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg" style={{ fontFamily: "var(--font-playfair)" }}>Brew & Co.</span>
              </Link>
              <p className="text-xs text-white/30 leading-relaxed max-w-xs">Setiap tegukan punya cerita. Nikmati kopi spesial tanpa ribet, langsung dari meja.</p>
              <div className="flex items-center gap-3 mt-5">
                {[
                  { icon: "📱", href: "#" },
                  { icon: "📷", href: "#" },
                  { icon: "🐦", href: "#" },
                ].map((s) => (
                  <a key={s.icon} href={s.href} className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-coffee-500/20 border border-white/[0.06] flex items-center justify-center text-sm hover:border-coffee-500/30 transition-all">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="md:mx-auto">
              <p className="text-xs font-semibold text-white/40 mb-4 tracking-wider uppercase">Tautan</p>
              <div className="space-y-3">
                {[
                  { label: "Menu", href: "/menu" },
                  { label: "Tentang", href: "#tentang" },
                  { label: "Kontak", href: "#kontak" },
                  { label: "Admin", href: "/admin" },
                ].map((l) => (
                  <Link key={l.label} href={l.href} className="block text-sm text-white/30 hover:text-coffee-400 transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-white/40 mb-4 tracking-wider uppercase">Jam Operasional</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sen — Sab: 08.00 — 22.00</span>
                </div>
                <div className="flex items-center gap-2 text-white/20 ml-[1.35rem]">
                  <span>Minggu: 09.00 — 20.00</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/[0.04]">
                <p className="text-xs text-white/20">Jl. Dipatiukur No. 123, Bandung</p>
                <p className="text-xs text-white/20 mt-1">hello@brewco.id · +62 812-3456-7890</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/15">{'\u00A9'} 2026 Brew & Co. All rights reserved.</p>
            <p className="text-[11px] text-white/15">Dibuat dengan {'\u2665'} untuk pecinta kopi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

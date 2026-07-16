# ☕ Brew & Co. — Digital QR Menu

> **Coffee shop ordering, the way it should be.** Scan, tap, sip. No app. No friction.

Modern QR-based menu system yang ganti menu kertas sama dashboard langsung dari HP customer. Built for cafes yang pengen tampil profesional tanpa biaya cetak ulang setiap ada menu baru.

---

## ✨ Highlights

- ⚡ **Scan → Pesan dalam < 2 menit** — gak perlu install app, browser-only
- 🎨 **Warm Brew design system** — earthy creams, coffee brown, Playfair Display headlines
- 📊 **Owner dashboard** — real-time orders, revenue, ratings, feedback
- 💳 **Midtrans payment ready** — sandbox & production keys
- 📱 **Mobile-first** — optimized untuk HP customer, plus admin responsive
- 🌗 **Dark mode built-in**
- 🔖 **Generate QR per meja** — download PNG/PDF, langsung tempel
- 🏷️ **Bonus**: cart dengan optimistic UI, sound notif admin pas order masuk

---

## 📸 Preview

```
┌─────────────────────┐
│   ☕ Brew & Co.      │  ← Playfair Display, hero
│   Scan QR untuk pesan│
├─────────────────────┤
│ [☕ Minuman] [🍰 Snack]...│
├─────────────────────┤
│ ┌───────┐ ┌───────┐ │
│ │ Item  │ │ Item  │ │
│ │ Rp20k │ │ Rp25k │ │
│ │   +   │ │   +   │ │
│ └───────┘ └───────┘ │
├─────────────────────┤
│ ▓ 3 item • Rp45k    │
│   Lihat Pesanan      │
└─────────────────────┘
```

---

## 🛠 Tech Stack

| Layer          | Technology                       |
|----------------|----------------------------------|
| Framework      | Next.js 16 (App Router, RSC)     |
| UI             | React 19 + Tailwind CSS 4        |
| Fonts          | Playfair Display + Inter         |
| Icons          | Lucide React (stroke 1.5)        |
| Animation      | Motion (Framer Motion successor) |
| ORM            | Prisma 6                         |
| DB (dev)       | SQLite                           |
| DB (prod)      | PostgreSQL via Turso / libsql    |
| Payment        | Midtrans Snap                    |
| QR             | qrcode.react                     |
| Deploy         | Vercel                           |

**Why this stack?**
- **Next.js App Router** = menu data fetched as Server Component, zero client JS on list view
- **Tailwind 4** = CSS-first config, tree-shake, zero runtime cost
- **Prisma 6** = type-safe schema, painless migration SQLite → Postgres
- **Motion** = hardware-accelerated micro-interactions

---

## 🚀 Getting Started

```bash
git clone https://github.com/Brewflow/brewflow.git
cd brewflow
npm install
cp .env.example .env       # isi Midtrans keys + admin PIN
npx prisma migrate dev
npx tsx prisma/seed.ts     # seed: 3+ categories, 12+ items
npm run dev                # http://localhost:3000
```

Admin: `http://localhost:3000/admin`

---

## 🏗 Project Structure

```
brewflow/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx          # Customer menu landing
│   │   ├── menu/[slug]/      # Item detail page (optional)
│   │   ├── admin/           # Dashboard owner (password-gated)
│   │   │   ├── page.tsx         # Stats dashboard
│   │   │   ├── orders/          # Order queue
│   │   │   ├── menu/            # Menu CRUD
│   │   │   ├── feedback/        # Customer reviews
│   │   │   └── qr/              # QR generator
│   │   └── api/             # REST endpoints
│   ├── components/        # Shared UI (card, drawer, button…)
│   ├── lib/
│   │   ├── prisma.ts         # DB client singleton
│   │   ├── midtrans.ts       # Payment gateway wrapper
│   │   └── qr.ts             # QR generator util
│   └── types/             # TS types & Zod schemas
├── prisma/
│   ├── schema.prisma          # DB schema
│   └── seed.ts                # Initial categories + items
├── public/
│   └── images/           # Item photos (placeholders)
├── scripts/              # One-off ops scripts
└── docs/                 # API reference
```

---

## 🎨 Design System — "Warm Brew"

Warm Minimalist — bersih, lapang, earthy. Bukan steril, tapi hangat kayak café favorit.

**Colors**
- `--coffee-900` `#1C0F08` — main text
- `--coffee-500` `#8B5E3C` — primary brand
- `--coffee-300` `#C68642` — accent
- `--cream-50` `#FDF8F3` — main background
- `--sage-500` `#7A9C7A` — success
- `--rose-500` `#D95C5C` — error

**Typography**
- Hero / headings → **Playfair Display** 600-700
- Body / UI → **Inter** 400-600
- Prices / stats → **JetBrains Mono** 500

**Spacing**
4 → 8 → 12 → 16 → 20 → 24 → 32 → 40 → 48 → 64 (based on 4px grid)

Full design spec: [`docs/DESIGN.md`](./docs/DESIGN.md)

---

## 📚 Documentation

| Doc | What |
|---|---|
| [`PRD.md`](./PRD.md) | Product Requirements Document — full spec, anti-patterns, monetization |
| [`WORKFLOW.md`](./WORKFLOW.md) | Arsitektur & alur sistem (customer + admin) |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Vercel deploy guide + env setup |
| [`docs/`](./docs) | API reference & component docs |

---

## 🗺 Roadmap

- [x] ✅ Sprint 1 — Foundation: scaffold, schema, customer menu, admin CRUD
- [ ] 🚧 Sprint 2 — Visual polish: color tokens, fonts, motion, a11y
- [ ] 📋 Sprint 3 — Admin: PDF QR export, search/filter, status flow
- [ ] 🌐 Sprint 4 — Production: Postgres migration, rate limiting, error monitoring
- [ ] 📱 Sprint 5 — Multi-tenant: multiple cafes, branding per location
- [ ] 🤖 Sprint 6 — AI menu photos from descriptions

---

## 💼 Monetization

Cocok dijual ke cafe owner:

| Paket | Harga | Apa yang dapet |
|---|---|---|
| **Setup** (one-time) | Rp 500k–1jt | QR menu + admin dashboard |
| **Monthly** | Rp 100–200k | Hosting + update menu konten |
| **Bundle** | Rp 2jt | QR menu + feedback + antrian digital |

Setup gampang: fork → deploy → kasih akses admin ke owner → tempel QR di meja.

---

## 🤝 Contributing

PRs welcome! Areas to help:

- 🎨 Design tokens / a11y a11it
- 🌐 i18n (English + Bahasa)
- 📊 More chart types in admin
- 🧪 E2E tests with Playwright

---

## 📄 License

MIT © 2026 Brewflow

---

<p align="center">
  <sub>Built with ☕ + ⚛️ by the Brewflow team</sub>
</p>

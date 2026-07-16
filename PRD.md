# PRD — Brewflow Digital Menu

> **Subtitle:** QR-based coffee shop ordering system
> **Status:** v1.0 — Build Ready
> **Target:** MVP launch

---

## 1. Ringkasan

Sistem digital menu berbasis web untuk coffeeshop. Customer scan QR code di meja → lihat menu dengan foto & deskripsi → add to cart → checkout via web. Owner terima pesanan & kelola menu lewat dashboard admin. No app install — langsung buka di browser.

---

## 2. Tujuan Bisnis

| Goal | Metrik |
|------|--------|
| Ganti menu fisik dengan QR digital | 0 biaya cetak ulang menu |
| Streamline proses order | Waktu scan → submit < 2 menit |
| Kumpulin feedback customer | Rate feedback > 20% dari total order |
| Kurangi beban staff | Customer input pesanan sendiri |

---

## 3. Target Pengguna

| Persona | Kebutuhan | Pain Point |
|---------|-----------|------------|
| **Customer** — pengunjung cafe usia 18-40 | Mau liat menu & pesan cepat | Harus nunggu staff dateng |
| **Owner** — pemilik cafe 25-45 | Mau kelola menu & liat order real-time | Ribet ganti menu cetak tiap kali |
| **Staff** — barista/kasir | Mau liat pesanan masuk jelas | Sering salah baca tulisan tangan |

---

## 4. Design System — "Warm Brew"

### 4.1 Design Direction

Gaya **Warm Minimalist** — bersih, lapang, earthy, dengan aksen kopi. Bukan minimalis steril yang dingin — tapi hangat dan approachable kayak cafe favorit.

### 4.2 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--coffee-900` | `#1C0F08` | Teks utama, tombol dark |
| `--coffee-700` | `#5C3A28` | Teks sekunder, label |
| `--coffee-500` | `#8B5E3C` | Primary brand |
| `--coffee-300` | `#C68642` | Accent / highlight |
| `--cream-50` | `#FDF8F3` | Background utama |
| `--cream-100` | `#F5EDE3` | Surface card, bg section |
| `--cream-200` | `#E8DDD0` | Border ringan |
| `--cream-300` | `#D4C4B3` | Border / divider |
| white | `#FFFFFF` | Card background |
| `--stone-400` | `#78716C` | Teks placeholder |
| `--sage-500` | `#7A9C7A` | Success / tersedia |
| `--rose-500` | `#D95C5C` | Error / sold out |

**Light mode:** cream-50 bg, coffee-900 text, putih untuk card.
**Dark mode:** coffee-900 bg (~#0C0A09), cream-50 text (~#F5F0EB), card pakai coffee-800 (~#2C1810).

### 4.3 Typography

| Role | Font | Weight | Size (mobile) | Size (desktop) |
|------|------|--------|---------------|----------------|
| Brand name (hero) | Playfair Display | 700 | 32px | 40px |
| Section title | Playfair Display | 600 | 22px | 28px |
| Item name | Inter | 600 | 16px | 18px |
| Body / description | Inter | 400 | 14px | 15px |
| Price | JetBrains Mono | 500 | 15px | 16px |
| Label / caption | Inter | 500 | 12px | 13px |
| Admin charts | JetBrains Mono | 400 | 13px | 14px |

**Line-height:** body 1.6, heading 1.2.
**Letter-spacing:** heading -0.01em, body normal.

### 4.4 Spacing Scale

```
4 → 8 → 12 → 16 → 20 → 24 → 32 → 40 → 48 → 64
```

Based on 4px grid. All padding, margin, gap ikut scale ini.

### 4.5 Shadows & Radius

| Element | Radius | Shadow |
|---------|--------|--------|
| Menu card | 12px (rounded-xl) | `0 1px 3px rgba(28,15,8,0.08)` |
| Modal / drawer | 16px top (rounded-2xl) | `0 -4px 20px rgba(0,0,0,0.12)` |
| Button | 10px | none, elevation on press |
| Admin card | 10px | `0 1px 4px rgba(0,0,0,0.06)` |
| Input | 10px | inset subtle |

### 4.6 Animation Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Enter animations |
| `--ease-in` | cubic-bezier(0.4, 0, 1, 1) | Exit animations |
| `--duration-fast` | 150ms | Micro-interactions (hover, tap) |
| `--duration-normal` | 250ms | Transitions (drawer, modal) |
| `--duration-slow` | 400ms | Page enter |
| `--spring` | spring(1, 100, 10, 0) | Fun micro-interactions |

**Principles:**
- Semua interaksi kasih feedback visual di bawah 100ms
- Animasi cuma transform + opacity (no layout-animating props)
- Modal/drawer pake slide-up + fade
- Cart badge pake scale bounce
- Hover card: subtle translateY(-2px)

### 4.7 Icon Style

- **Library:** Lucide (stroke-width 1.5, consistent)
- **Size:** 20px untuk inline, 24px untuk nav, 16px untuk badge
- **No emoji as structural icons**
- Coffee icons: custom SVG (cup, bean, takeaway) atau Lucide equivalents

---

## 5. Feature Specification

### 5.1 Public Pages

#### 5.1.1 Menu Landing (`/`)

**Layout:**
```
┌─────────────────────┐
│   ☕ Brew & Co.      │  ← Playfair Display, centered
│   Scan QR untuk pesan│
├─────────────────────┤
│ [☕ Minuman] [🍰 Snack]...│  ← pill tabs, horizontal scroll
├─────────────────────┤
│ ┌───────┐ ┌───────┐│
│ │ Item  │ │ Item  ││  ← 2-column grid on large
│ │ Rp20k │ │ Rp25k ││    1-column on mobile
│ │  +    │ │  +    ││
│ └───────┘ └───────┘│
│ ...more items       │
├─────────────────────┤
│ ▓ 3 item • Rp45k   │  ← sticky bottom bar
│    — Lihat Pesanan   │
└─────────────────────┘
```

**Components:**

*MenuHeader* — Brand name + tagline + status banner (buka/tutup)
*CategoryTabs* — Horizontal pill tabs, active state = filled coffee
*MenuItemCard* — Nama, deskripsi, harga, button "+". Image placeholder.
*CartSummary* — Sticky bottom bar, muncul kalau cart > 0
*CartDrawer* — Bottom sheet dari bawah, isi nama + no meja
*FeedbackForm* — Rating bintang 1-5 + textarea, muncul setelah submit

**States:**
- **Loading:** Skeleton shimmer untuk card (3 placeholder cards)
- **Empty:** "Menu belum tersedia" — illustration + CTA
- **Error:** "Gagal memuat menu" — retry button

**Responsive:**
- Mobile (<768px): 1 column, bottom nav bar
- Tablet (768-1024px): 2 column grid, sidebar cart
- Desktop (>1024px): max-w-2xl centered, cart sidebar

#### 5.1.2 Order Success (after checkout)

- Confirmation screen dengan animation (checkmark)
- Order number besar
- Feedback prompt di bawah
- "Pesan Lagi" button

### 5.2 Admin Pages

Auth: Basic password gate (env variable), untuk MVP

#### 5.2.1 Dashboard (`/admin`)

**Cards row:** Total orders hari ini, Revenue, Pending orders, Avg rating
**Chart:** Order trend 7 hari (bar chart, recharts)
**Recent orders:** Table 5 entri terakhir

#### 5.2.2 Orders (`/admin/orders`)

| Feature | Detail |
|---------|--------|
| Table | No meja, nama, items, total, status, waktu |
| Status | pending → confirmed → preparing → done |
| Filter | By status, today/all |
| Action | Click to mark status |

**States:**
- **Empty:** "Belum ada pesanan"
- **Loading:** Skeleton table rows
- **New order:** Sound notif + toast (browser Notification API)

#### 5.2.3 Menu Management (`/admin/menu`)

| Feature | Detail |
|---------|--------|
| List | Filter by category, search |
| CRUD | Add/edit/delete item |
| Form | Name, description, price, category, image URL, available toggle, order |
| Reorder | Drag to reorder (or number input for MVP) |

#### 5.2.4 Feedback (`/admin/feedback`)

- Table: nama, rating (stars), message, date
- Sort by date / rating
- Delete feedback

#### 5.2.5 QR Generator (`/admin/qr`)

- Generate QR code untuk URL menu (pakai qrcode js lib)
- Download PNG / PDF (A6 size, pas buat tempel meja)
- Copy link button

### 5.3 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | All categories + items |
| GET | `/api/categories` | All categories |
| GET | `/api/orders` | All orders (admin) |
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders/[id]` | Update status |
| GET | `/api/feedback` | All feedback (admin) |
| POST | `/api/feedback` | Submit feedback |
| DELETE | `/api/feedback/[id]` | Delete feedback |
| POST | `/api/menu` | Add menu item (admin) |
| PATCH | `/api/menu/[id]` | Edit menu item |

Error response format:
```json
{ "error": "string", "details": "optional" }
```

---

## 6. Data Model

```prisma
Category → MenuItem (1:N)
Order → OrderItem (1:N)
MenuItem → OrderItem (1:N)
Feedback (standalone)
```

Full schema at `prisma/schema.prisma`.

---

## 7. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 | App Router |
| UI Library | React 19 | Server components + client islands |
| Styling | Tailwind CSS 4 | CSS-first config |
| Fonts | Playfair Display + Inter | Google Fonts via next/font |
| Icons | Lucide React | stroke-1.5, consistent |
| ORM | Prisma 6 | prisma-client-js |
| DB | SQLite (dev) → PostgreSQL (prod) | Turso/libsql for prod |
| Deploy | Vercel | Free tier |
| QR | qrcode.react | Render QR codes |

### Why This Stack

- **Next.js App Router:** RSC untuk menu data, client components cuma untuk interaktivitas
- **Tailwind CSS 4:** Zero config, CSS-first, tree-shake
- **Prisma 6:** Type-safe DB, SQLite for dev speed
- **SQLite → Turso:** Zero-setup dev, edge-ready prod

---

## 8. User Flow

```
Scan QR → Landing page (menu)
  ├─ Browse by category
  ├─ Tap "+" → add to cart (with micro-animation)
  ├─ Tap "Lihat Pesanan" → bottom sheet cart
  │   ├─ Adjust quantity
  │   └─ Input name (optional) + meja
  └─ Tap "Pesan Sekarang" → 
      ├─ Loading spinner on button
      ├─ Success screen with animation
      └─ Feedback prompt
```

**Admin flow:**
```
Login → Dashboard
  ├─ Orders (real-time list)
  ├─ Menu management
  ├─ Feedback
  └─ QR generator
```

---

## 9. States & Edge Cases

| Component | Loading | Empty | Error | Success |
|-----------|---------|-------|-------|---------|
| Menu list | 3 skeleton cards | "Menu belum tersedia" + illustrasi | "Gagal load menu" + retry | Cards with items |
| Cart drawer | — | Kosong (hidden) | Network error toast | Items list + total |
| Order submit | Button spinner | — | "Gagal kirim" + retry | Success screen |
| Menu admin | Skeleton table | "Belum ada item" | Error toast | Table with data |
| Orders admin | Skeleton rows | "Belum ada pesanan" | Error toast | Table + status |
| Feedback | Skeleton | "Belum ada feedback" | Error toast | Table + stats |

---

## 10. Non-Functional Requirements

### Performance
- Lighthouse score target: 90+ Performance, 95+ Accessibility
- First load JS < 100KB (exclude admin from public bundle)
- Images: Next/Image with lazy loading, WebP format
- Menu data: Server Component fetch (zero client JS for list)

### Security
- Admin route: simple password env gate (NEXT_PUBLIC_ADMIN_PASSWORD)
- Input sanitization: XSS prevention di nama/feedback
- Rate limiting: max 10 orders/minute from same IP (for prod)
- No secrets in client bundle

### Accessibility
- Skip-to-content link
- All interactive elements keyboard accessible
- Color contrast meets WCAG AA (4.5:1)
- Touch targets minimum 44x44px
- Form labels associated with inputs
- Focus visible on all interactive elements
- Screen reader: aria-labels for icon buttons

### Reliability
- Optimistic UI for add-to-cart (instant feedback)
- Graceful degradation when API fails
- Auto-retry on network error (up to 3x)
- No data loss on accidental page refresh (cart in sessionStorage)

---

## 11. Deployment

### Vercel (Recommended)
```bash
vercel --prod --env DATABASE_URL="file:./dev.db"
```

### Env Variables
| Variable | Dev Value | Prod Value |
|----------|-----------|------------|
| `DATABASE_URL` | `file:./dev.db` | PostgreSQL URL |
| `ADMIN_PASSWORD` | `admin123` | Strong random |

### Build Checklist
- [ ] `npm run build` passes
- [ ] Prisma generate done
- [ ] Seed data: 3+ categories, 12+ items
- [ ] QR code test: scan → menu loads
- [ ] Admin login works
- [ ] Order create → admin sees it
- [ ] Feedback submit → admin sees it

---

## 12. Dev Plan (Sprint Breakdown)

### Sprint 1 — Foundation (Done)
- [x] Next.js project scaffold
- [x] Prisma schema + seed
- [x] API routes (menu, orders, feedback, categories)
- [x] Customer menu page with components
- [x] Admin pages (dashboard, orders, menu, feedback, qr)

### Sprint 2 — Visual Polish (4-6 hours)
- [ ] Implement color system (CSS variables)
- [ ] Add Google Fonts (Playfair Display + Inter)
- [ ] Add micro-animations (cart bounce, page transitions)
- [ ] Skeleton loading states
- [ ] Responsive tablet/desktop layout
- [ ] Empty/error states

### Sprint 3 — Admin Enhancements (3-4 hours)
- [ ] Admin auth (password gate)
- [ ] PDF QR download
- [ ] Search + filter orders
- [ ] Order status management

### Sprint 4 — Production Readiness (4-6 hours)
- [ ] PostgreSQL migration
- [ ] Rate limiting
- [ ] Error monitoring
- [ ] Performance optimization
- [ ] Accessibility audit

---

## 13. Monetisasi

| Paket | Harga | Fitur |
|-------|-------|-------|
| Setup (one-time) | Rp 500k - 1jt | QR menu + dashboard |
| Monthly | Rp 100-200k | Hosting + update menu |
| Bundle | Rp 2jt | QR menu + feedback + antrian |

---

## 14. Anti-Patterns (Avoid)

| Jangan | Alasan |
|--------|--------|
| Emoji sebagai icon struktural | Font-dependent, inconsistent antar platform |
| Raw hex colors di komponen | Harus pake CSS custom properties / Tailwind semantic |
| Placeholder-only labels | Aksesibilitas jelek, UX confusing |
| Animasi width/height | Cause layout shift (CLS) |
| Hover-only interactions | Mobile nggak ada hover |
| Loading spinner > 1 detik | Harus kasih skeleton |
| Pie chart > 5 categories | Bar chart lebih jelas |
| Mixing icon styles (filled + outline) | Visual incoherent |
| Fixed px container widths | Break responsive |

---

## 15. Success Metrics

- Order success rate > 90%
- Feedback rate > 20%
- Scan → submit order < 2 menit
- Zero crash in production
- Lighthouse a11y score ≥ 95
- Admin page load < 1.5 detik

# Landing Page Redesign — Dark Bento Pro

## Context
Landing page Brew & Co. sebelumnya menggunakan layout grid simetris standar dengan beberapa
masalah visual: foto di hero ditampilkan dengan opacity rendah, phone mockup CSS terlihat
"template", featured menu 4 kartu sama rata membosankan, testimonial single quote kurang
rich.

Tujuan redesign: landing page kafe kopi yang modern, profesional, dan premium — tetap
menggunakan tema dark yang sudah ada, tanpa nambah foto baru.

---

## Approach Chosen
**Dark Bento Pro** — Layout asimetris dengan bento grid, foto dipajang full opacity,
card dengan berbagai span/ukuran berbeda, spacing lega, dan micro-interactions.

---

## Design per Section

### Navbar
- Glassmorphism sticky (retain dari existing)
- Tidak ada perubahan signifikan

### Hero
| Area | Detail |
|------|--------|
| Left (7/12) | Heading "Brew & Co." gradient teks, subtext, 2 CTA button (Pesan & Lihat Menu) |
| Right (5/12) | 1 foto coffee-detail.jpg **full opacity** dalam frame border tipis `white/[0.08]`. No text overlay. Badge "4.9★" atau "19+ Menu" overlap di border kanan. |

### Tentang
| Area | Detail |
|------|--------|
| Left (1/2) | Badge "Tentang Kami", heading "Kopi Berkualitas, Tanpa Drama" (gradient), deskripsi ringkas (2 kalimat), value proposition: ☕ Single Origin, 🏠 Roasted in-house, 🚀 5 Menit Saji — 3 ikon horizontal dengan label |
| Right (1/2) | Foto `latte.jpg` (latte art close-up) full opacity, border tipis `white/[0.06]`, aspect-[4/5] dengan rounded-[2rem] |

### Cara Kerja
- 3 step horizontal dengan garis konektor antar step
- Masing-masing: icon bulat (w-16 h-16), judul 3 kata, deskripsi 1 baris, estimasi waktu kecil
- Step number (01/02/03) font mono di pojok, opacity rendah sebagai dekorasi
- Card border tipis `white/[0.04]`

### Featured Menu
Bento grid md:grid-cols-3 md:grid-rows-2:
| Item | Span | Keterangan |
|------|------|------------|
| Espresso | row-span-2 (tall) | Foto gede, category tag "Classic", deskripsi 1 line, harga, +Add |
| Latte | 1x1 | Square, category tag, harga |
| Mocha | 1x1 | Square, category tag, harga |
| Cold Brew | col-span-2, aspect-[3/1] | Wide horizontal, category tag, deskripsi, harga |

### Testimonial
Multi-card horizontal (3 card):
- Nama beda: Rizky (★★★★★), Sari (★★★★★), Dimas (★★★★★)
- Masing-masing: avatar inisial (lingkaran), quote pendek 1-2 kalimat, label "Regular Customer" / "New Customer", timestamp relatif
- Layout: `grid md:grid-cols-3 gap-5`

### Location + CTA
- **Location**: 3 info card (Jam Buka, Lokasi, Pembayaran) dengan icon kontras — sama seperti existing, hanya spacing dan styling card dirapikan
- **CTA**: Full-width dengan background foto `coffee-detail.jpg` + dark overlay (80%), heading gede, subtext, button "☕ Mulai Pesan" dengan glow shadow, noise texture overlay

### Footer
- Retain dari existing (logo, tagline, nav links, copyright)

---

## Data Flow & Dependencies
- Featured menu tetap fetch dari `/api/menu`, random 4 item — fix shuffle pakai Fisher-Yates
- Testimonial data hardcoded di page.tsx (project dummy)
- Tidak ada perubahan API atau database

---

## Edge Cases
- Mobile: semua bento grid collapse ke single column, featured jadi vertical stack
- Featured menu dengan <4 item: grid fallback ke jumlah item yang ada
- Gambar gagal load: fallback gradient background di tiap image container

---

## Image Treatment (Cross-Cutting)

### Clip-path Reveal Animation
Semua foto di landing page (hero right, tentang right, featured items) pake
`clipPath` reveal saat scroll — muncul dari bawah ke atas, durasi 0.6-0.8s.
Ini menggantikan fade-up biasa untuk kontainer gambar.

### Frame & Shadow
Semua foto konsisten: border `ring-1 ring-white/[0.06]` + shadow subtle.

### Gradient Vignette
Overlay gradient `from-[#0C0A09] via-[#0C0A09]/20 to-transparent` —
lebih transparan dari existing `opacity-60` biar foto lebih keliatan.

### Next.js Image Optimization
- Hero right: `sizes="(max-width: 768px) 100vw, 40vw"`, priority
- Tentang right: `sizes="(max-width: 768px) 100vw, 45vw"`, priority
- Featured items: `sizes="(max-width: 768px) 50vw, 25vw"`, lazy

---

## Testing Strategy
- Visual check di 3 viewport: mobile (375px), tablet (768px), desktop (1280px+)
- Pastikan semua gambar full opacity, tidak ada yang kepotong aneh
- Testimonial card wrap ke 2 atau 1 kolom sesuai viewport

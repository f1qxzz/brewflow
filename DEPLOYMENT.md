# Deployment Guide — Digital Cafe Menu

## 1. Deploy ke Vercel (Gratis)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy dari folder project
cd cafe-menu
vercel
```

Atau lewat GitHub:
1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import repo → Deploy

### Environment Variables
Set di Vercel Dashboard:
```
DATABASE_URL=file:./dev.db
```

> **Note**: SQLite hanya untuk development. Buat production, upgrade ke PostgreSQL.

---

## 2. Setup Domain (Opsional)
- Beli domain (ex: menu.cafe-lo.com)
- Di Vercel: Project → Settings → Domains
- Arahkan DNS ke Vercel

---

## 3. Generate QR Code
1. Buka `/admin/qr` setelah deploy
2. Masukin URL menu (ex: `https://cafe-lo.vercel.app`)
3. Download QR code
4. Print & tempel di meja

---

## 4. Upgrade ke PostgreSQL (Production)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```bash
npx prisma migrate deploy
```

Ganti `DATABASE_URL` di Vercel dengan PostgreSQL URL (pake Supabase gratis).

---

## 5. Yang Perlu Disiapin Buat Jual ke Cafe

### Presentasi ke Owner
- Demo langsung: buka HP → scan QR → pesan
- Tunjukin dashboard admin
- Kasih perbandingan: menu cetak vs digital

### Pricing Suggestion
| Paket | Harga | Fitur |
|-------|-------|-------|
| Starter | 500k (sekali) | Menu digital + order |
| Pro | 1jt/tahun | Semua fitur + prioritas |
| Enterprise | 2jt/tahun | Multi-cabang + WA notif |

### Technical Handoff
- Domain + Vercel account pake punya lo (monthly fee)
- Atau kasih akses ke owner biar mereka bayar sendiri
- Simpan backup database定期

---

## 6. Maintenance
- Update menu via `/admin/menu` (atau langsung edit DB)
- Backup database: copy `prisma/dev.db`
- Monitor Vercel dashboard buat cek error

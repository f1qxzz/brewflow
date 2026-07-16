# Workflow — Brewflow Digital Cafe Menu

## 1. User Flow Overview

```
                    CUSTOMER SIDE                          OWNER SIDE
               ┌─────────────────┐                  ┌─────────────────┐
               │  Scan QR di meja│                  │  Buka /admin    │
               └────────┬────────┘                  └────────┬────────┘
                        │                                    │
                        ▼                                    ▼
               ┌─────────────────┐                  ┌─────────────────┐
               │  Landing Page   │                  │  Dashboard      │
               │  (/)            │                  │  (/admin)       │
               └────────┬────────┘                  └────────┬────────┘
                        │                           ┌───────┴────────┐
                        ▼                           │                │
               ┌─────────────────┐                  ▼                ▼
               │  Pilih Kategori │          ┌──────────┐    ┌──────────┐
               └────────┬────────┘          │  Orders  │    │  Menu    │
                        │                   │ /admin/  │    │ /admin/  │
                        ▼                   │ orders   │    │ menu     │
               ┌─────────────────┐          └──────────┘    └──────────┘
               │  Tap + ke item  │                           │        │
               └────────┬────────┘                           ▼        ▼
                        │                            ┌──────────┐ ┌──────────┐
                        ▼                            │Feedback  │ │  QR     │
               ┌─────────────────┐                   │ /admin/  │ │ /admin/ │
               │  Cart Bottom Bar│                   │ feedback │ │ qr      │
               └────────┬────────┘                   └──────────┘ └──────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  Cart Drawer    │
               │  (atur qty,     │
               │   isi nama/meja)│
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  Submit Order   │
               │  POST /api/     │
               │  orders         │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  Sukses +       │
               │  Feedback Form  │
               └─────────────────┘
```

---

## 2. Sequence Diagram — Order Flow

```
Customer Browser              Next.js API              Prisma/DB
      │                          │                        │
      │  GET /api/menu           │                        │
      │─────────────────────────▶│                        │
      │                          │  SELECT * Category     │
      │                          │  + JOIN MenuItem       │
      │                          │───────────────────────▶│
      │                          │◀───────────────────────│
      │◀─────────────────────────│                        │
      │     { categories[] }     │                        │
      │                          │                        │
      │  [User adds items]       │                        │
      │                          │                        │
      │  POST /api/orders        │                        │
      │  { name, table, items }  │                        │
      │─────────────────────────▶│                        │
      │                          │  VALIDATE:             │
      │                          │  - items tidak kosong  │
      │                          │  - setiap item exists  │
      │                          │  - item available      │
      │                          │                        │
      │                          │  CALCULATE: total      │
      │                          │                        │
      │                          │  INSERT Order          │
      │                          │───────────────────────▶│
      │                          │  INSERT OrderItems[]   │
      │                          │───────────────────────▶│
      │                          │◀───────────────────────│
      │◀─────────────────────────│                        │
      │     { order object }     │                        │
      │                          │                        │
      │  [Owner refresh]         │                        │
      │  GET /api/orders         │                        │
      │─────────────────────────▶│                        │
      │                          │  SELECT * Order        │
      │                          │  + JOIN OrderItems     │
      │                          │  + JOIN MenuItem       │
      │                          │───────────────────────▶│
      │                          │◀───────────────────────│
      │◀─────────────────────────│                        │
```

---

## 3. State Machine — Menu Page (Client)

```
                         ┌─────────────┐
                         │  LOADING    │
                         │  (fetch     │
                         │   menu)     │
                         └──────┬──────┘
                                │ fetch selesai
                                ▼
                         ┌─────────────┐
                  ┌──────│  BROWSING   │──────┐
                  │      │  (pilih     │      │
                  │      │   kategori, │      │
                  │      │   tap +)    │      │
                  │      └─────────────┘      │
                  │           │               │
                  │    tap "+" │               │ cart kosong
                  │           ▼               │ setelah submit
                  │      ┌─────────────┐      │
                  │      │  CART_OPEN  │      │
                  │      │  (atur qty, │      │
                  │      │   isi data) │      │
                  │      └──────┬──────┘      │
                  │             │             │
                  │      tap "Pesan"          │
                  │             │             │
                  │             ▼             │
                  │      ┌─────────────┐      │
                  │      │ SUBMITTING  │      │
                  │      │ (POST order)│      │
                  │      └──────┬──────┘      │
                  │             │             │
                  │          sukses           │
                  │             │             │
                  │             ▼             │
                  │      ┌─────────────┐      │
                  └──────│  SUCCESS    │──────┘
                         │  (feedback  │
                         │   form)     │
                         └─────────────┘
```

### State Transitions

| From | Event | To | Condition |
|------|-------|----|-----------|
| LOADING | fetch complete | BROWSING | data terisi |
| LOADING | fetch error | BROWSING | menu = [] |
| BROWSING | tap "+" | BROWSING | cart ter-update |
| BROWSING | tap cart button | CART | totalItems > 0 |
| CART | tap "-" qty = 0 | CART | item removed |
| CART | tap "Pesan" | SUBMITTING | — |
| SUBMITTING | POST sukses | SUCCESS | res.ok |
| SUBMITTING | POST gagal | CART | !res.ok |
| SUCCESS | tap "Pesan lagi" | BROWSING | — |
| SUCCESS | submit feedback | SUCCESS | feedback terkirim |

---

## 4. Component Tree

```
<RootLayout>
  └── <MenuPage>                    # Client Component (useState)
        ├── <MenuHeader />          # Stateless: logo + tagline
        ├── <CategoryTabs />        # Props: categories, active, onSelect
        ├── <MenuItemCard />        # Props: item, onAdd (× N items)
        ├── <CartSummary />         # Props: itemCount, total, onOpen (conditional)
        ├── <CartDrawer />          # Props: items, qty handlers, form fields (modal)
        └── <FeedbackForm />        # Props: rating, message, onSubmit (conditional)
```

### Component Responsibility

| Component | State | Props (down) | Events (up) |
|-----------|-------|-------------|-------------|
| MenuHeader | none | — | — |
| CategoryTabs | none | categories[], active, onSelect | onSelect(i) |
| MenuItemCard | none | item, onAdd | onAdd(item) |
| CartSummary | none | itemCount, total, onOpen | onOpen() |
| CartDrawer | none | items, name, table, total, onUpdateQty, onSubmit | onUpdateQty(id, delta), onSubmit() |
| FeedbackForm | none | rating, message, onSubmit, onOrderAgain | onSubmit(), onOrderAgain() |

Semua state terpusat di MenuPage (lifting state up).

---

## 5. API Contract

### GET /api/menu
```
Response 200:
[
  {
    id: number,
    name: string,
    slug: string,
    items: [
      {
        id: number, name: string, description: string,
        price: number, available: boolean, order: number
      }
    ]
  }
]
```

### POST /api/orders
```
Request:
{ customerName: string, tableNumber: string, items: [{ id: number, quantity: number }] }

Response 201:
{
  id: number, customerName: string, tableNumber: string,
  total: number, status: "pending", createdAt: string,
  items: [{ id: number, menuItem: {...}, quantity: number, price: number }]
}

Error 400:
{ error: "Pilih minimal 1 item" }
```

### GET /api/orders
```
Response 200:
[ Order ]  (sorted by createdAt desc, includes items.menuItem)
```

### POST /api/feedback
```
Request:
{ customerName: string, rating: number, message: string }

Response 201:
{ id: number, customerName: string, rating: number, message: string, createdAt: string }
```

### GET /api/feedback
```
Response 200:
[ Feedback ]  (sorted by createdAt desc)
```

---

## 6. Database Relationship & ERD

```
┌────────────┐       ┌──────────────┐
│  Category  │       │   MenuItem   │
├────────────┤       ├──────────────┤
│ id (PK)    │──1:N──│ id (PK)      │
│ name       │       │ name         │
│ slug       │       │ description  │
│ order      │       │ price        │
│ createdAt  │       │ categoryId(FK)│
└────────────┘       │ available    │
                     │ order        │
                     │ createdAt    │
                     └──────┬───────┘
                            │ 1:N
                            │
                     ┌──────┴───────┐
                     │  OrderItem   │
                     ├──────────────┤
                     │ id (PK)      │
                     │ orderId(FK)  │
                     │ menuItemId(FK)│
                     │ quantity     │
                     │ price        │
                     └──────┬───────┘
                            │ N:1
                     ┌──────┴───────┐
                     │    Order     │
                     ├──────────────┤
                     │ id (PK)      │
                     │ customerName │
                     │ tableNumber  │
                     │ phone        │
                     │ status       │
                     │ total        │
                     │ createdAt    │
                     └──────────────┘

┌──────────────────┐
│    Feedback      │  (standalone, no relasi)
├──────────────────┤
│ id (PK)          │
│ customerName     │
│ rating           │
│ message          │
│ createdAt        │
└──────────────────┘
```

---

## 7. Error Handling Flow

```
                    ┌─────────────────┐
                    │   API Error     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
      ┌──────────────┐ ┌──────────┐ ┌──────────────┐
      │ 400 Bad Req  │ │ 404 Not  │ │ 500 Internal │
      │ validasi     │ │ Found    │ │ Server Error │
      │ gagal        │ │          │ │              │
      └──────────────┘ └──────────┘ └──────────────┘
              │              │              │
              ▼              ▼              ▼
      ┌──────────────┐ ┌──────────┐ ┌──────────────┐
      │ Tampilkan    │ │ jarang   │ │ Log ke       │
      │ pesan error  │ │ terjadi  │ │ console      │
      │ ke user      │ │          │ │ + toast      │
      └──────────────┘ └──────────┘ └──────────────┘
```

### Client-side error handling di MenuPage:
- **Fetch menu gagal** → menu state tetap `[]` → tampil "Menu tidak tersedia"
- **Submit order gagal** → `!res.ok` → cart tetap terbuka, user bisa coba lagi
- **Submit feedback gagal** → silent (fire & forget)

---

## 8. Data Flow Per Halaman

| Halaman | Data Fetch | Method | Cache Strategy |
|---------|-----------|--------|----------------|
| / (menu) | GET /api/menu | useEffect | No cache (fresh setiap render) |
| /admin | GET /api/orders + GET /api/feedback | useEffect | No cache |
| /admin/orders | GET /api/orders | useEffect | No cache |
| /admin/menu | GET /api/menu | useEffect | No cache |
| /admin/feedback | GET /api/feedback | useEffect | No cache |

> **Ponytail note:** No cache karena data real-time. Untuk production dengan traffic tinggi, tambah React Query / SWR buat auto-refetch + caching.

---

## 9. Deployment Workflow

```
LOCAL                         PRODUCTION (Vercel)
─────                         ───────────────────
                                  ┌──────────┐
npm run dev ──▶ test lokal        │ Vercel   │
                  │               │ Edge     │
                  ▼               │ Network  │
git add .                         └────┬─────┘
git commit                              │
git push origin main ─────────────────▶│
                                       ▼
                               ┌──────────────┐
                               │ Build &      │
                               │ Deploy       │
                               │ (auto)       │
                               └──────┬───────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │ Live:        │
                               │ brewflow.    │
                               │ vercel.app   │
                               └──────────────┘
```

---

## 10. File Dependency Graph

```
src/lib/prisma.ts
    ├── src/app/api/menu/route.ts
    ├── src/app/api/categories/route.ts
    ├── src/app/api/orders/route.ts
    └── src/app/api/feedback/route.ts

src/types/index.ts
    ├── src/components/MenuItemCard.tsx
    ├── src/components/CartDrawer.tsx
    ├── src/components/CategoryTabs.tsx
    └── src/app/page.tsx

src/components/*
    └── src/app/page.tsx (all components used here)
```

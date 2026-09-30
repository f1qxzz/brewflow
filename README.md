# Brew & Co. — Digital QR Menu

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://brewflow-three.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live site:** [brewflow-three.vercel.app](https://brewflow-three.vercel.app)

## Overview

Brew & Co. is a QR-based ordering system for small cafés. Each table gets its own QR code;
customers scan it, browse the menu, build a cart, and place an order from the browser — no app
install, no account. Orders arrive in an owner dashboard where the staff can track the queue,
manage the menu, moderate feedback, and print new table codes.

The customer side is a single mobile-first page with categories, cart, cash or Midtrans Snap
payment, and a per-table history of active orders. The admin side at `/admin` is protected by a
PIN and covers orders, menu and category CRUD, feedback, and per-table QR generation.

The app runs on Next.js 16 (App Router) with React 19, Tailwind CSS 4, and Prisma 6. It uses
SQLite locally and Turso (libSQL) in production, deploys to Vercel, and takes payment through
Midtrans Snap.

## Features

- Per-table QR codes with signed links (`?table=1&s=<hmac>`) — history only loads with the QR link.
- Menu browsing with categories, cart, and locked table context from the QR.
- Orders paid in cash or through Midtrans Snap, with server-side price validation.
- Admin dashboard behind PIN login with an 8-hour HMAC token and server-side revocation.
- Dashboard tools: order queue with sound alert, menu and category CRUD, feedback moderation, QR codes.
- Per-IP rate limits stored in the database, shared across serverless instances.
- Security headers on every response: HSTS, CSP (no `unsafe-eval` in production), `frame-ancestors 'none'`, no-referrer.
- Signed order tokens (`?t=`) for payment pages, timing-safe webhook signature verification for Midtrans callbacks.
- Dark mode and a mobile-first layout on the customer side.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Animation | Motion |
| Icons | lucide-react |
| ORM | Prisma 6 — SQLite locally, Turso/libSQL in production (adapter picked at runtime) |
| QR generation | qrcode |
| Payment | Midtrans Snap (midtrans-client) |
| Database (production) | Turso |
| Deploy | Vercel |
| Tests | node:test via tsx |

## Getting Started

### Prerequisites

Node.js 20 or newer and npm.

### Clone and install

```bash
git clone https://github.com/f1qxzz/brewflow.git
cd brewflow
npm install
```

### Environment

Create a `.env` file in the project root:

```bash
DATABASE_URL="file:./dev.db"        # local SQLite database
ADMIN_PIN="choose-a-pin"            # PIN you type at /admin
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optional — only needed for Midtrans payments (cash works without them):
# MIDTRANS_SERVER_KEY=""
# MIDTRANS_CLIENT_KEY=""
# MIDTRANS_IS_PRODUCTION="false"
```

Production (Vercel) uses `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` instead of `DATABASE_URL`,
plus `ADMIN_PIN`, `NEXT_PUBLIC_BASE_URL`, and the `MIDTRANS_*` variables. See
[DEPLOYMENT.md](./DEPLOYMENT.md).

### Initialize the database

```bash
npx prisma migrate dev    # create tables in SQLite
npx prisma db seed        # seed sample categories and items
```

### Run

```bash
npm run dev               # http://localhost:3000
```

Open `http://localhost:3000/admin` and enter the PIN for the dashboard.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run test` | Test suite (`tests/*.test.ts`, includes payment security tests) |
| `npx tsc --noEmit` | Type check |

## Deployment

Deploys run manually against Vercel (a push to `master` alone does not deploy):

```bash
vercel --prod --yes
```

The production schema lives in [`prisma/turso-init.sql`](./prisma/turso-init.sql) (6 tables,
idempotent DDL) and is applied from the Vercel runtime with
[`prisma/turso-migrate.ts`](./prisma/turso-migrate.ts). Full environment setup is documented in
[DEPLOYMENT.md](./DEPLOYMENT.md).

## Project Structure

```text
brewflow/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── menu/page.tsx            # Customer menu: cart, orders, feedback
│   │   ├── payment/[orderId]/       # Payment status page (signed ?t= token)
│   │   ├── admin/                   # Dashboard: orders, menu, feedback, QR (PIN-gated)
│   │   └── api/                     # REST routes: orders, menu, categories,
│   │                                #   feedback, payment (create/verify/webhook),
│   │                                #   verify-pin, logout, admin/qr-token
│   ├── components/                  # Shared UI components
│   ├── lib/                         # Prisma client, admin auth, rate limit,
│   │                                #   signed tokens, Midtrans wrapper
│   └── types/                       # Shared TypeScript types
├── prisma/
│   ├── schema.prisma                # Schema (SQLite provider)
│   ├── seed.ts                      # Sample data
│   ├── turso-init.sql               # Production DDL (6 tables)
│   └── turso-migrate.ts             # Production migration runner
├── tests/
│   └── payment-security.test.ts     # Payment security tests
├── PRD.md                           # Product requirements
├── WORKFLOW.md                      # System architecture and flows
└── DEPLOYMENT.md                    # Vercel and environment setup
```

## Security Notes

- Admin login exchanges the PIN for an HMAC-signed token sent as `x-admin-token`; logout revokes it server-side.
- Table history and payment pages require signed query parameters (timing-safe HMAC from `src/lib/sign.ts`).
- Rate limits are keyed per IP in the database, so they hold across serverless instances.
- The Midtrans webhook verifies the callback signature before touching any order.
- Input on write endpoints is validated and coerced; invalid payloads get `400`, not `500`.

## Documentation

| Document | Contents |
|---|---|
| [PRD.md](./PRD.md) | Product requirements, scope, and anti-patterns |
| [WORKFLOW.md](./WORKFLOW.md) | Architecture and customer/admin flows |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel deploy and environment variables |
| [docs/decisions/](./docs/decisions) | Architecture decision records |

## Contributing

Issues and pull requests are welcome at
[github.com/f1qxzz/brewflow](https://github.com/f1qxzz/brewflow). Useful contributions: end-to-end
tests (Playwright), accessibility fixes on the customer menu, and English/Bahasa localization.

## Contact

Maintainer: [@f1qxzz](https://github.com/f1qxzz). For bugs and feature requests, open an issue on
the [issue tracker](https://github.com/f1qxzz/brewflow/issues).

## License

[MIT](./LICENSE) © 2026 Brewflow.

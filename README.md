## Smart Jewellery Product & QR Scanner System

Shiv Jewellers product management and QR verification platform. It includes a protected admin panel for managing catalogue data and a public, mobile-first product verification experience.

## Features

- Admin login with hashed credentials and protected routes
- Product creation with automatic unique `JWL-*` Product IDs
- Automatic QR code and barcode generation for each product
- Product pricing, stock, hallmark, stone, media, and catalogue metadata
- Admin product search and status filtering
- Public product pages showing only the requested product
- Mobile QR scanner with manual Product ID fallback
- Prisma ORM with SQLite locally and Vercel Postgres in production

## Local setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Open `http://localhost:3000`. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`; the first login with those exact values creates the initial Super Admin. Existing users must use their stored password.

## Production deployment

1. Create a Vercel Postgres database and add `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` to the Vercel project environment.
2. Add `NEXTAUTH_URL`, a long random `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
3. Set `NEXT_PUBLIC_APP_URL` to the deployed site URL so generated QR codes point to production.
4. Deploy with `npm run build`. The Vercel build script switches Prisma to PostgreSQL, pushes the schema, seeds categories, and builds Next.js.

Never commit `.env` or production database credentials.

## Routes

- `/` public catalogue
- `/scanner` camera scanner
- `/scan/[publicId]` public product verification
- `/admin-login` admin login
- `/admin/products` protected catalogue management
- `/admin/products/new` protected product creation

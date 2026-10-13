# Quick-store

A customer-facing ecommerce storefront built with Next.js, React, and TypeScript. The storefront UI, routes, and commerce integrations are included here; the existing commerce/admin API remains a separate service.

## Quick start

Requirements: Node.js 22 or later and npm.

```bash
npm ci
cp .env.example .env.local
# Set NEXT_PUBLIC_ADMIN_PANEL_URL to the existing backend/API base URL.
npm run dev
```

Open <http://localhost:3000>. Product, account, payment, and order data are provided by the configured backend; without it, the application can start but live commerce actions will not be available.

## Configuration

- `NEXT_PUBLIC_ADMIN_PANEL_URL`: backend base URL before `/api` (the storefront adds `/api`).
- `NEXT_PUBLIC_SITE_URL`: public canonical site URL used when generating robots and sitemap assets.
- `NEXT_PUBLIC_IMAGE_HOSTS`: optional comma-separated remote image host allowlist.
- `NEXT_PUBLIC_SSR=true`: use the Next.js server-rendered build (recommended). Set this to `false` only for an intentional static export.
- Google Analytics and Microsoft Clarity IDs are optional and intentionally blank in `.env.example`.

The example file contains placeholders only. Do not commit `.env.local` or real credentials. Firebase, payment, and authentication settings are supplied by the existing backend; no source-repository secrets or backend configuration were copied.

## Checks and production build

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

`npm run build` runs lint/type checks, updates PWA/SEO assets when backend/site settings are configured, then builds the Next.js application.

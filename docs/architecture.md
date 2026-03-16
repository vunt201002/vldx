# Architecture Overview

## Monorepo Structure

This project is a **monorepo** — two independent apps in one repo, coordinated by a root `package.json`.

```
vlxd/
├── frontend/          # Next.js (JavaScript) — public-facing storefront
├── backend/           # Express (TypeScript) — REST API server
├── docs/              # This documentation
├── package.json       # Root: runs both apps via concurrently
├── .gitignore
└── .gitattributes     # LF line endings enforced across OS
```

---

## Data Flow

```
Browser
  │
  ▼
Next.js (port 3000)
  │  ├── Pages render HTML server-side (SSR) → good for SEO
  │  ├── /api/* rewrites → proxy to Express
  │
  ▼
Express (port 5000)
  │  ├── CORS allows only FRONTEND_URL
  │  ├── Routes → Controllers → Models
  │
  ▼
MongoDB (port 27017)
     └── Database: vlxd
```

The frontend never talks directly to MongoDB. All data goes through Express.

---

## Frontend (`frontend/`)

- **Language:** JavaScript (`.js`, `.jsx`)
- **Framework:** Next.js 14 with Pages Router
- **Bundler (dev):** Turbopack (`next dev --turbo`) — Rust-based, replaces Webpack
- **Bundler (prod):** Webpack (Next.js default for `next build`)
- **Purpose:** SEO-optimized, multi-page public storefront

### Folder structure

```
frontend/
├── pages/             # File-based routing (each file = one URL)
│   ├── _app.js        # Global app wrapper (layout, global CSS)
│   └── index.js       # Homepage → /
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # API call helpers, external service wrappers
├── utils/             # Pure utility functions (no React)
├── styles/
│   └── globals.css    # Global CSS (imported in _app.js)
├── public/            # Static assets (images, fonts, favicon)
├── next.config.js     # Next.js + Turbopack config
├── jsconfig.json      # Path alias definitions for editor
└── .env.local         # Local env vars (gitignored)
```

### Path aliases

Configured in both `jsconfig.json` and `next.config.js` (`experimental.turbo.resolveAlias`):

| Alias | Resolves to |
|-------|------------|
| `@/components/*` | `frontend/components/*` |
| `@/styles/*` | `frontend/styles/*` |
| `@/lib/*` | `frontend/lib/*` |
| `@/hooks/*` | `frontend/hooks/*` |
| `@/utils/*` | `frontend/utils/*` |

Usage:
```js
import Button from '@/components/Button';
import { fetchProducts } from '@/lib/api';
```

### Adding a new page

Create a file under `pages/`. The filename becomes the URL:

```
pages/products.js        →  /products
pages/products/[id].js   →  /products/:id  (dynamic route)
pages/about.js           →  /about
```

### API proxy

`next.config.js` rewrites `/api/*` to the backend:

```
/api/products  →  http://localhost:5000/api/products
```

This means frontend code can fetch `/api/products` without hardcoding the backend URL.

---

## Backend (`backend/`)

- **Language:** TypeScript (`.ts`)
- **Framework:** Express
- **Database ORM:** Mongoose (MongoDB)
- **Dev runner:** `ts-node-dev` (hot reload without compiling)
- **Prod build:** `tsc` → outputs to `dist/`

### Folder structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts         # Loads .env, exports typed config object
│   │   └── database.ts    # Mongoose connect/disconnect
│   ├── middleware/
│   │   └── errorHandler.ts  # Global Express error handler
│   ├── models/            # Mongoose schemas (add here)
│   ├── controllers/       # Route handler logic (add here)
│   ├── routes/
│   │   └── index.ts       # Registers all routes on /api
│   └── index.ts           # Entry: creates app, connects DB, starts server
├── dist/                  # Compiled output (gitignored)
├── tsconfig.json
├── .eslintrc.json
└── .env                   # Local env vars (gitignored)
```

### Adding a new route

1. Create `src/controllers/productController.ts`
2. Create `src/routes/productRoutes.ts`
3. Register in `src/routes/index.ts`:

```ts
import productRoutes from './productRoutes';
router.use('/products', productRoutes);
```

### Environment config

All env access goes through `src/config/env.ts` — never use `process.env` directly in route files:

```ts
import { config } from '@/config/env';
// config.mongodbUri, config.port, config.jwtSecret, ...
```

### Error handling

Throw errors in controllers using the `AppError` interface. The global `errorHandler` middleware in `src/middleware/errorHandler.ts` catches them and formats the JSON response.

```ts
const err: AppError = new Error('Not found');
err.statusCode = 404;
throw err;
```

---

## Environment Variables

| File | Used by | Gitignored |
|------|---------|-----------|
| `backend/.env` | Express server | Yes |
| `backend/.env.example` | Reference/onboarding | No |
| `frontend/.env.local` | Next.js (client + server) | Yes |
| `frontend/.env.example` | Reference/onboarding | No |

Variables prefixed `NEXT_PUBLIC_` are exposed to the browser. All others are server-only.

---

## Key Design Decisions

| Decision | Reason |
|----------|--------|
| JS for frontend | Simpler for UI/page work, no need for TS overhead on the view layer |
| TS for backend | Type safety on API contracts, Mongoose models, and config |
| Pages Router (not App Router) | More stable, simpler for a product demo site |
| Turbopack for dev | 3–5× faster cold start vs Webpack in dev mode |
| Separate Express backend | Decoupled API — can be replaced or scaled independently |
| MongoDB | Flexible schema fits product catalog with varying attributes |

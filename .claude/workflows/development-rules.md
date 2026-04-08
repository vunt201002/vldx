# Development Rules

## Language Conventions

- **Frontend** (`frontend/`): JavaScript only (no TypeScript). Uses Next.js 14 with Pages Router.
- **Backend** (`backend/`): TypeScript. Uses Express.js + Mongoose.
- **Admin** (`admin/`): JavaScript (JSX). Uses Vite + React 18 + React Router v6.

## Git & Commits

- Follow conventional commits: `feat`, `fix`, `perf`, `docs`, `refactor`, `chore`
- Scope by area when relevant: `feat(admin):`, `perf(frontend):`, `fix(backend):`

## Styling

- Frontend uses **Tailwind CSS v3** + PostCSS + Autoprefixer
- For web clones, use **hybrid styling**: `style={{...}}` for pixel-exact values (colors, font sizes, exact dimensions from source HTML) combined with Tailwind classes for layout and responsive behavior
- Responsive breakpoints: use Tailwind's `lg:` prefix for desktop/mobile splits

## Dev Server

- Turbopack is currently **disabled** (`next dev` without `--turbo`) due to PostCSS/Tailwind compatibility issues
- Ports: Frontend `:3000`, Backend `:5000`, Admin `:5173`
- After major refactors (moving/deleting/renaming components), run `rm -rf .next` before `npm run dev` to clear stale cache that causes 500 errors

## Path Aliases

All three apps use path aliases for imports:

| App | Alias | Target |
|-----|-------|--------|
| Frontend | `@/components` | `./components` |
| Frontend | `@/styles` | `./styles` |
| Frontend | `@/lib` | `./lib` |
| Frontend | `@/hooks` | `./hooks` |
| Frontend | `@/utils` | `./utils` |
| Frontend | `@/config` | `./config` |
| Admin | `@/` | `./src/` |

## API Proxy

- Frontend: `/api/*` rewrites to `http://localhost:5000/api/*` via `next.config.js` — **only when `DATA_MODE=api`**
- In `DATA_MODE=static`, `next.config.js` returns `[]` from `rewrites()` and the catch-all `frontend/pages/api/[...path].js` serves GETs from JSON and proxies writes to backend if reachable
- Admin: Vite proxy config forwards API requests to `:5000`

## Static Data Mode (DATA_MODE)

- `DATA_MODE=api|static` (default `api`) is a **runtime** env var exposed via `next.config.js` `env:` block — switching modes only requires a container restart, no rebuild
- In `static` mode, the frontend runs without the backend: page/theme/blog/products data is read from `frontend/config/*.json`
- **All page data loading (`getServerSideProps` / `getStaticProps`) MUST go through `@/lib/fetchPageData`** (`fetchPageData`, `fetchThemeData`, `fetchStaticData`). Never call `fetch(apiBase…)` directly from data-loading functions — it bypasses static mode and breaks the API-less deployment path.
- Client-side `fetch('/api/...')` calls keep working in static mode via the catch-all `pages/api/[...path].js`. When adding a new client-side API call that must work offline, add a route case in its `serveFromStatic()` and a corresponding writer in `backend/src/utils/generatePageJson.ts`.
- Docker: the `shared-config` volume is mounted at `/app/config` (frontend) and `/data/config` (backend) so that `theme.json`, `blog.json`, `blog/`, `products/` are shared alongside `pages/`. Set `DATA_MODE` on the frontend service in compose.

## Authentication

- Two auth systems coexist: **Admin** (`requireAuth` → `req.adminUser`) and **Customer** (`authenticate` → `req.user`)
- Never use `req.user` for admin logic or `req.adminUser` for customer logic
- Customer routes under `/api/auth/*`, admin routes under `/api/admin/auth/*`
- Google OAuth: frontend sends ID token to backend for verification — no redirect flow
- JWT tokens stored in `localStorage` on frontend (access + refresh)

## Analytics & Audit

- Frontend tracking calls are fire-and-forget (`fetch().catch(() => {})`) — never block or throw
- All admin CUD controllers must call `auditService.log()` after mutations
- `AnalyticsEvent` has 90-day TTL; `AuditLog` has no TTL (kept indefinitely)
- Analytics tracking endpoint (`POST /api/analytics/events`) is public but rate-limited

## Environment Variables

- Backend: access via centralized `config/env.ts` — never use `process.env` directly in routes
- Frontend: prefix with `NEXT_PUBLIC_` for client-side access
- Admin: prefix with `VITE_` for client-side access

## Data Fetching Strategy

Different frontend pages use different strategies — match the pattern when adding new pages:

| Pattern | When to use | Example pages |
|---------|-------------|---------------|
| `getServerSideProps` | CMS pages needing live preview, paginated lists | `[slug].js`, `landing.js` |
| `getStaticProps` + ISR | Mostly static content with periodic refresh | `products/index.js`, `products/[slug].js` (`revalidate: 60`, `fallback: 'blocking'`) |
| Client-side fetch | Auth-gated pages, real-time content | `blog/[id].js`, `account.js`, `login.js` |

**Rule:** inside `getServerSideProps` / `getStaticProps` / `getStaticPaths`, always use helpers from `@/lib/fetchPageData` (`fetchPageData`, `fetchThemeData`, `fetchStaticData`) instead of calling `fetch(apiBase…)` directly, so both `DATA_MODE=api` and `DATA_MODE=static` work transparently.

## Page JSON Files

- `frontend/config/pages/*.json` files are **auto-generated by the backend** on every theme editor save and on startup sync
- Backend sync also generates sibling files for static data mode: `frontend/config/theme.json`, `blog.json`, `blog-tags.json`, `blog/{id}.json`, `products.json`, `products/{slug}.json`
- All are produced by `regenerateAllPageJsons()` in `backend/src/utils/syncPageJsons.ts` (runs on startup + daily 3:30 AM cron), via `writePageJson` / `writeThemeJson` / `writeBlogJson` / `writeProductsJson`
- **Never manually edit** these JSON files — changes will be overwritten
- To update page content: use the theme editor admin UI or write a seed script in `backend/src/scripts/`
- Source of truth is MongoDB; JSON files are derived artifacts

## Docker & Deployment

- **Env files**: `.env.local.example` (local dev), `.env.prod.example` (production), `.env.docker` (Docker overrides)
- **Compose**: `docker-compose.yml` (local), `docker-compose.prod.yml` (production with Nginx + SSL)
- **Deploy workflow**: `deploy.sh` builds and pushes to Docker Hub → `vps-deploy.sh` pulls and restarts on VPS
- **SSL**: `vps-init-ssl.sh` for initial Let's Encrypt setup, Nginx handles SSL termination
- **ESLint in builds**: `next.config.js` has `eslint: { ignoreDuringBuilds: true }` — don't let lint errors block Docker builds
- **Windows Git Bash**: `deploy.sh` must include `export MSYS_NO_PATHCONV=1` at the top to prevent Git Bash from converting `/api` paths in `--build-arg` values to `C:\api` Windows paths
- **Admin sub-path routing** — three-layer pattern for serving admin at `/admin/`:
  1. Nginx strips `/admin/` prefix when proxying to admin container (`location /admin/ { proxy_pass http://admin:80/; }`)
  2. Vite `base: process.env.VITE_BASE_PATH` bakes the path into static assets at build time
  3. React Router `basename={import.meta.env.BASE_URL}` aligns client-side routing
- **Build args are compile-time**: Vite `VITE_*` args are baked into static assets during Docker build. Changing them requires a full rebuild — they cannot be overridden at runtime

## Blog System Conventions

- Blog pages use **WSJ editorial design system** — CSS custom properties (`--wsj-serif`, `--wsj-sans`, `--wsj-teal`) + utility classes (`.wsj-category`, `.wsj-title`, `.wsj-excerpt`, `.wsj-timestamp`) in `globals.css`
- Blog content supports YouTube embeds — `transformBlogContent.js` auto-converts YouTube URLs to responsive iframes
- Blog real-time updates use SSE (Server-Sent Events) via `blogEvents` EventEmitter — no WebSocket needed
- Blog likes use `sessionId` from `localStorage` for anonymous tracking
- Comments support optional auth — anonymous users provide a name field
- Blog detail uses **two-column layout** on desktop: article + sticky "Most Popular" sidebar (sorted by viewCount client-side)
- Related + popular posts: single `GET /blog?limit=20` call, split client-side — avoids backend changes
- Read time estimated client-side: strip HTML tags, count words, divide by 200 wpm

## Adding a New Block Type (checklist)

1. `backend/src/config/blockFieldDefs.ts` — add field schema
2. `backend/src/config/blockJsonMapping.ts` — add DB↔JSON mapping
3. `admin/src/lib/buildPreviewConfig.js` — mirror the same mapping (for live preview)
4. `frontend/components/sections/NewSection.js` — create the React component
5. `frontend/components/sections/registry.js` — register the type string → component
6. `frontend/lib/transformPageConfig.js` — add entry to `ARRAY_BLOCK_MAP` if the block has child arrays (e.g., `products`, `stats`, `steps`). **Without this step, SSR pages will render the section with empty `blocks: []`.**

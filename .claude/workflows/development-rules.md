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

## Path Aliases

All three apps use path aliases for imports:

| App | Alias | Target |
|-----|-------|--------|
| Frontend | `@/components` | `./components` |
| Frontend | `@/styles` | `./styles` |
| Frontend | `@/lib` | `./lib` |
| Frontend | `@/hooks` | `./hooks` |
| Frontend | `@/utils` | `./utils` |
| Admin | `@/` | `./src/` |

## API Proxy

- Frontend: `/api/*` rewrites to `http://localhost:5000/api/*` via `next.config.js`
- Admin: Vite proxy config forwards API requests to `:5000`

## Environment Variables

- Backend: access via centralized `config/env.ts` — never use `process.env` directly in routes
- Frontend: prefix with `NEXT_PUBLIC_` for client-side access
- Admin: prefix with `VITE_` for client-side access

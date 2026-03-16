# VLXD

A product demo web application for building materials (Vật Liệu Xây Dựng). Multi-page, SEO-optimized storefront with a REST API backend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (JavaScript) + Turbopack |
| Backend | Node.js + Express (TypeScript) |
| Database | MongoDB via Mongoose |
| Bundler (dev) | Turbopack (`next dev --turbo`) |

## Project Structure

```
vlxd/
├── frontend/          # Next.js app — public-facing, SEO-optimized
├── backend/           # Express REST API
├── package.json       # Root scripts (runs both via concurrently)
└── docs/              # Architecture & convention docs
```

See [`docs/architecture.md`](docs/architecture.md) for the full breakdown.

## Prerequisites

- Node.js >= 18
- MongoDB running locally on port `27017`
  - Start: `net start MongoDB` (Windows)

## Setup

```bash
# Install all dependencies (root + frontend + backend)
npm run install:all
```

Copy environment files and fill in values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

## Running Locally

```bash
# Run both frontend and backend concurrently
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |

Or run individually:

```bash
npm run dev:frontend   # Next.js on :3000
npm run dev:backend    # Express on :5000
```

## Environment Variables

### `backend/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vlxd
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both services |
| `npm run dev:frontend` | Frontend only |
| `npm run dev:backend` | Backend only |
| `npm run build` | Build both for production |
| `npm run lint` | Lint both (from their respective dirs) |

## Git Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:      new feature
fix:       bug fix
perf:      performance improvement
refactor:  code restructure, no behavior change
chore:     tooling, deps, config
docs:      documentation only
test:      adding/updating tests
style:     formatting, no logic change
```

Example: `feat(products): add product listing page with pagination`

## Docs

- [Architecture](docs/architecture.md) — full structure, decisions, data flow
- [Backend](docs/backend.md) — API design, folder structure, adding routes
- [Frontend](docs/frontend.md) — pages, components, path aliases, Turbopack
- [Conventions](docs/conventions.md) — commit, code style, naming rules

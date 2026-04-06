# Static Data Mode Implementation Plan

## Overview

Add a configurable `DATA_MODE` env variable to the frontend that controls whether pages fetch data from the API or read from static JSON files. This enables the frontend to run independently of the backend when using pre-generated JSON configs.

## Requirements

### Functional
- New env variable `DATA_MODE=api|static` (default: `api`)
- In `api` mode: current behavior — fetch from backend API
- In `static` mode: read from `frontend/config/pages/{slug}.json` and `frontend/config/theme.json`
- Live preview must work in both modes
- Switching modes requires only a container restart, not a rebuild

### Non-functional
- Runtime variable (not build-time) — no rebuild needed to switch
- Graceful degradation if `theme.json` is missing in static mode
- Static mode data freshness depends on backend JSON sync (startup + daily 3:30 AM)

## Current Architecture

**API mode (current default):**
- `landing.js` and `[slug].js` use `getServerSideProps` to fetch:
  - `GET /api/theme/active` — global theme (header/footer)
  - `GET /api/theme/pages/{slug}` — page blocks from MongoDB
- `transformPageData()` converts backend format into frontend format

**Static JSON files (already exist):**
- Backend syncs MongoDB → `frontend/config/pages/{slug}.json` via `syncPageJsons.ts`
- JSON files are already in frontend config format — no `transformPageData()` needed
- Docker mounts shared volume at `/app/config/pages`
- **Gap:** No static JSON for global theme (header/footer) — must be created

**Live preview:**
- Works via `postMessage` from admin iframe — completely bypasses `getServerSideProps`
- No impact from data mode switch

## Implementation Steps

### Step 1: Backend — Add `writeThemeJson()`

Add a function to `backend/src/utils/generatePageJson.ts` that exports global theme to `config/theme.json`:

```ts
export async function writeThemeJson(): Promise<void> {
  const theme = await Theme.findOne({ isActive: true })
    .populate('header.blocks.block')
    .populate('footer.blocks.block')
    .lean();

  if (!theme) return;

  const json = {
    header: { blocks: transformThemeBlocks(theme.header.blocks) },
    footer: { blocks: transformThemeBlocks(theme.footer.blocks) },
  };

  const filePath = path.join(config.frontendConfigDir, '..', 'theme.json');
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
}
```

Call from `regenerateAllPageJsons()` in `syncPageJsons.ts`.

### Step 2: Frontend — Create `lib/fetchPageData.js`

Central data-fetching utility with api/static branching:

```js
import fs from 'fs';
import path from 'path';
import { transformPageData } from './transformPageConfig';

const DATA_MODE = process.env.DATA_MODE || 'api';
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';

export async function fetchPageData(slug) {
  if (DATA_MODE === 'static') {
    return fetchFromStatic(slug);
  }
  return fetchFromApi(slug);
}

async function fetchFromApi(slug) {
  const [themeRes, pageRes] = await Promise.all([
    fetch(`${apiBase}/theme/active`),
    fetch(`${apiBase}/theme/pages/${slug}`)
  ]);

  if (!pageRes.ok) return { notFound: true };

  const themeData = await themeRes.json();
  const pageData = await pageRes.json();

  return {
    globalTheme: themeData.data,
    pageConfig: transformPageData(pageData.data)
  };
}

function fetchFromStatic(slug) {
  const pagePath = path.join(process.cwd(), 'config', 'pages', `${slug}.json`);
  if (!fs.existsSync(pagePath)) return { notFound: true };
  const pageConfig = JSON.parse(fs.readFileSync(pagePath, 'utf-8'));

  const themePath = path.join(process.cwd(), 'config', 'theme.json');
  const globalTheme = fs.existsSync(themePath)
    ? JSON.parse(fs.readFileSync(themePath, 'utf-8'))
    : null;

  return { globalTheme, pageConfig };
}
```

### Step 3: Frontend — Update `next.config.js`

Expose `DATA_MODE` to server runtime:

```js
env: {
  DATA_MODE: process.env.DATA_MODE || 'api',
},
```

### Step 4: Frontend — Refactor pages

Update `landing.js` and `[slug].js` to use `fetchPageData()`:

```js
import { fetchPageData } from '@/lib/fetchPageData';

export async function getServerSideProps({ params }) {
  try {
    const result = await fetchPageData(params?.slug || 'landing');
    if (result.notFound) return { notFound: true };
    return { props: { globalTheme: result.globalTheme, pageConfig: result.pageConfig } };
  } catch (error) {
    console.error('Error loading page:', error);
    return { notFound: true };
  }
}
```

### Step 5: Update env files and Docker configs

- Add `DATA_MODE=api` to `.env.example` and `.env.local`
- Add `DATA_MODE` env var to frontend service in `docker-compose.yml` and `docker-compose.prod.yml`
- Widen shared volume mount from `/app/config/pages` to `/app/config` (to include `theme.json`)

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `frontend/lib/fetchPageData.js` | CREATE | Central data-fetching utility |
| `frontend/pages/landing.js` | MODIFY | Use `fetchPageData('landing')` |
| `frontend/pages/[slug].js` | MODIFY | Use `fetchPageData(params.slug)` |
| `frontend/next.config.js` | MODIFY | Expose `DATA_MODE` env var |
| `frontend/.env.example` | MODIFY | Add `DATA_MODE=api` |
| `backend/src/utils/generatePageJson.ts` | MODIFY | Add `writeThemeJson()` |
| `backend/src/utils/syncPageJsons.ts` | MODIFY | Call `writeThemeJson()` in sync |
| `docker-compose.yml` | MODIFY | Add `DATA_MODE`, widen volume |
| `docker-compose.prod.yml` | MODIFY | Same as above |

## Testing Checklist

- [ ] `DATA_MODE=api` — pages load from API (identical to current behavior)
- [ ] `DATA_MODE=static` — pages load from JSON files, no API calls
- [ ] Static mode with missing JSON file returns 404
- [ ] Static mode with missing `theme.json` renders gracefully
- [ ] Live preview works in both modes
- [ ] Docker with `DATA_MODE=static` serves pages without backend running
- [ ] Switching `DATA_MODE` at runtime (container restart) works without rebuild

## Notes

- Products pages (`products/index.js`, `products/[slug].js`) are out of scope — they fetch product data which has no static JSON equivalent yet
- In static mode, data freshness depends on backend sync schedule (startup + daily 3:30 AM)
- Theme editor saves already write JSON files, so changes appear in static mode after the next page load

---
*Generated: 2026-04-06*

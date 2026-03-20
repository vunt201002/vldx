# Admin Skill

## Overview

The admin panel is a Vite + React 18 SPA written in **JavaScript (JSX)**, using React Router v6 for navigation. It connects to the same Express backend as the frontend.

## Architecture

```
admin/
  src/
    App.jsx             # Root: React Router routes
    main.jsx            # Vite entry point
    pages/
      Dashboard.jsx     # Overview stats
      Products.jsx      # Products table with edit links
      ProductDetail.jsx # Single product edit form
    layout/
      AdminLayout.jsx   # Sidebar + content wrapper
    hooks/
      useFetch.js       # Generic data fetching hook
    lib/
      api.js            # Axios/fetch client pointing to :5000
```

## Key Patterns

### useFetch hook
Generic hook for GET requests with loading/error state:

```js
const { data, loading, error } = useFetch('/api/materials');
```

### Fallback to placeholder data
When the API is unavailable during development, pages fall back to hardcoded placeholder arrays so the UI stays usable:

```jsx
const displayData = data?.length ? data : PLACEHOLDER_PRODUCTS;
```

### Price formatting (Vietnamese Dong)
Format prices in VND using `Intl.NumberFormat`:

```js
new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
```

## Conventions

1. **JavaScript (JSX)** — no TypeScript in admin
2. **Path alias** — `@/` maps to `./src/`
3. **API base** — Vite proxy forwards `/api/*` to `http://localhost:5000`
4. **Env vars** — prefix with `VITE_` for client-side access
5. **No external UI library** — custom CSS-in-JS styles with inline `style={{}}`

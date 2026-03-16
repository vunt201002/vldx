# Frontend

Next.js 14 (JavaScript) with Turbopack. Source in `frontend/`.

## Routing

Uses the **Pages Router** (not App Router). Every file in `pages/` maps to a URL:

```
pages/index.js           →  /
pages/products.js        →  /products
pages/products/[id].js   →  /products/123   (dynamic)
pages/about.js           →  /about
```

## Adding a new page

Create a `.js` file in `pages/`:

```js
// pages/products.js
export default function ProductsPage() {
  return <main>...</main>;
}

// For SEO — runs server-side at request time
export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  const data = await res.json();
  return { props: { products: data.data } };
}
```

Use `getServerSideProps` for dynamic data (fetched per request, good for SEO).
Use `getStaticProps` for data that rarely changes (fetched at build time, fastest).

## Path aliases

Defined in `jsconfig.json` and mirrored in `next.config.js`:

```js
import Button from '@/components/Button';
import { fetchProducts } from '@/lib/api';
import useCart from '@/hooks/useCart';
import { formatPrice } from '@/utils/format';
```

| Folder | Purpose |
|--------|---------|
| `components/` | Shared UI — Button, Card, Navbar, Footer, etc. |
| `lib/` | API calls, external integrations |
| `hooks/` | Custom React hooks (`useCart`, `useAuth`, etc.) |
| `utils/` | Pure functions — format, validate, transform |
| `styles/` | Global CSS only. Component styles go in the component file |

## Calling the backend API

Use the env variable so the URL is configurable per environment:

```js
// lib/api.js
const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProducts() {
  const res = await fetch(`${API}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}
```

Or use the proxy (shorter):
```js
// next.config.js rewrites /api/* → backend
const res = await fetch('/api/products');
```

## Turbopack

Dev server runs with `next dev --turbo`. Key behaviors:

- **Cold start:** First compile is slower (Turbopack builds the module graph). Subsequent restarts reuse cache in `.next/cache/`.
- **HMR:** Changes to a file reflect in the browser in < 100ms without full reload.
- **SVG:** Configured to load `.svg` files as React components via `@svgr/webpack`.
- **Cache:** `.next/` is gitignored but persists locally — do not delete it unnecessarily.

## SEO

For SEO, render data server-side using `getServerSideProps` or `getStaticProps`. This ensures search engines receive fully rendered HTML.

Use Next.js `<Head>` for meta tags:

```js
import Head from 'next/head';

export default function ProductPage({ product }) {
  return (
    <>
      <Head>
        <title>{product.name} - VLXD</title>
        <meta name="description" content={product.description} />
      </Head>
      ...
    </>
  );
}
```

## Images

Use Next.js `<Image>` component — automatically serves WebP/AVIF and handles lazy loading:

```js
import Image from 'next/image';
<Image src="/product.jpg" width={400} height={300} alt="Product" />
```

## Scripts

```bash
npm run dev        # Turbopack dev server on :3000
npm run build      # Production build (Webpack)
npm run start      # Serve production build
npm run lint       # ESLint with next/core-web-vitals rules
```

## ESLint

Config in `.eslintrc.json` extends `next/core-web-vitals`. Key rules:
- `no-unused-vars` — error (ignore `_` prefixed args)
- `no-console` — warn (allow `console.warn` and `console.error`)
- `react/prop-types` — off (not needed with JS + good naming)

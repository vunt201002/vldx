# Frontend Skill

## Overview

The public-facing storefront is a Next.js 14 app using the **Pages Router** (not App Router) with JavaScript.

## Architecture

```
frontend/
  pages/          # File-based routing (index.js, clone.js, _app.js)
  components/     # Reusable React components, organized by feature
  hooks/          # Custom React hooks
  lib/            # API helpers and utilities
  utils/          # Pure utility functions
  styles/         # Global CSS (globals.css with Tailwind directives)
  public/         # Static assets
  next.config.js  # Turbopack aliases, image config, API rewrites
```

## Styling Stack

- **Tailwind CSS v3** via `@tailwind base/components/utilities` in `globals.css`
- **PostCSS** + **Autoprefixer** configured in `postcss.config.js`
- `tailwind.config.js` scans `pages/` and `components/` for class usage

## Web Clone Pattern

When cloning external pages (via the `perfect-web-clone-skill`), follow this structure:

### Page file
- Create `pages/<name>.js` that imports numbered section components
- Each section maps 1:1 to a chunk from the extraction pipeline

```jsx
// pages/clone.js
import Section1 from '../components/clone/Section1';
import Section2 from '../components/clone/Section2';
// ...
export default function ClonePage() {
  return (
    <main>
      <Section1 />
      <Section2 />
    </main>
  );
}
```

### Section components
- Place in `components/<clone-name>/Section<N>.js`
- Each section is self-contained: all data, styles, and icons are inline
- Include a JSDoc block at the top describing what the section replicates, its captured dimensions, background color, and layout

### Hybrid styling approach
- **Inline `style={{}}`** for pixel-exact values from the source site: colors (`rgb(247, 226, 206)`), font sizes (`11px`), letter spacing, exact heights/widths
- **Tailwind classes** for layout: `flex`, `items-center`, `w-full`, `gap-x-5`, responsive breakpoints (`lg:flex`, `lg:hidden`)

### Inline SVG icons
- Define SVG icons as small React function components within the section file
- Do NOT add icon library dependencies (lucide-react, heroicons, etc.)
- Use `aria-hidden="true"` on decorative icons

### Responsive design
- Desktop: `lg:flex` (1024px+)
- Mobile: `lg:hidden` with separate layout
- Mobile navigation: hamburger menu with `useState` toggle and slide-down drawer

### Interactive effects
- Parallax: lightweight scroll-based implementation using `useRef` + `useEffect` + passive scroll/resize listeners
- Avoid heavy parallax libraries; calculate offset from viewport position directly

## Key Conventions

1. **No TypeScript** — all frontend code is plain JavaScript
2. **Pages Router** — file-based routing under `pages/`
3. **Use path aliases** — `@/components`, `@/lib`, etc. (configured in `next.config.js`)
4. **API calls** go through the `/api/*` proxy rewrite to the Express backend
5. **Image optimization** — use Next.js `<Image>` for project images; for cloned pages, use standard `<img>` with source URLs

# Frontend Skill

## Overview

The public-facing storefront is a Next.js 14 app using the **Pages Router** (not App Router) with JavaScript.

## Architecture

```
frontend/
  pages/              # File-based routing (index.js, landing.js, _app.js)
  components/
    sections/         # JSON-driven section components (Shopify-like pattern)
      SectionRenderer.js
      registry.js
      icons.js
      Navbar.js, Hero.js, Collections.js, About.js, Featured.js, Gallery.js, Contact.js
    clone/            # Web clone section components
  config/
    pages/            # Page JSON configs (landing.json)
  hooks/              # Custom React hooks (useReveal.js)
  lib/                # API helpers and utilities
  utils/              # Pure utility functions
  styles/             # Global CSS (globals.css with Tailwind directives)
  public/             # Static assets
  next.config.js      # Turbopack aliases, image config, API rewrites
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

## JSON-Driven Section/Block System (Landing Page)

The landing page uses a Shopify-like config-driven architecture:

```
config/pages/landing.json → SectionRenderer → registry → Section Components
```

### Config structure (`config/pages/<page>.json`)
- **`page`**: metadata (title, description, bodyClass)
- **`order`**: flat array of section keys — controls render order
- **`sections`**: map of section configs, each with `type`, `settings` (scalars), `blocks` (repeatable children)

### Key files
- `components/sections/SectionRenderer.js` — iterates `order`, resolves components from registry
- `components/sections/registry.js` — maps type strings to React components
- `components/sections/icons.js` — SVG icon registry (JSON references icons by string name)
- `components/sections/*.js` — section components accepting `{ id, settings, blocks }` props

### Adding a new section
1. Create the component in `components/sections/NewSection.js` accepting `{ id, settings, blocks }`
2. Register it in `registry.js`
3. Add its config to `landing.json` under `sections` and add its key to `order`

### Adding new page content
Edit `config/pages/landing.json` — change text in `settings`, add/remove items in `blocks`, reorder entries in `order`.

## Custom Hooks

- **`useReveal`** (`hooks/useReveal.js`): IntersectionObserver-based scroll reveal. Returns a ref; attach to section root. Adds `.revealed` class when element enters viewport. Used with `.reveal`, `.reveal-left`, `.reveal-right`, `.stagger-children` CSS classes defined in `globals.css`.

## Key Conventions

1. **No TypeScript** — all frontend code is plain JavaScript
2. **Pages Router** — file-based routing under `pages/`
3. **Use path aliases** — `@/components`, `@/lib`, etc. (configured in `next.config.js`)
4. **API calls** go through the `/api/*` proxy rewrite to the Express backend
5. **Image optimization** — use Next.js `<Image>` for project images; for cloned pages, use standard `<img>` with source URLs

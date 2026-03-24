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
      ThemeEditor.jsx   # Shopify-like theme editor (main page)
    components/
      theme-editor/
        ThemeEditorSidebar.jsx    # Block list, add/delete/reorder, copy from page
        BlockEditorPanel.jsx      # Form for editing a single block's fields
        PageSettingsPanel.jsx     # Page-level settings (title, fonts)
        ThemePreview.jsx          # Iframe embedding the frontend [slug] page
        CopyBlockModal.jsx        # Modal: select source page → copy a block
        fields/
          FieldRenderer.jsx       # Renders the correct input for each field type
          ImageField.jsx          # Image upload via POST /api/upload/image
    layout/
      AdminLayout.jsx   # Sidebar + content wrapper
    hooks/
      useFetch.js       # Generic data fetching hook
    lib/
      api.js            # Axios/fetch client pointing to :5000
      buildPreviewConfig.js  # Client-side DB→JSON transform (mirrors backend generatePageJson)
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

## Theme Editor Patterns

### Live Preview
- `ThemePreview.jsx` renders the frontend page in an iframe (`/landing`, `/{slug}`)
- On every edit, `buildPreviewConfig.js` transforms editor state → JSON config
- Config sent to iframe via `postMessage({ type: 'PREVIEW_CONFIG', config })`
- No save required for preview

### buildPreviewConfig.js
- Client-side mirror of backend `generatePageJson` — same `blockJsonMappings` and `blockToSection` logic
- **Important**: when changing block mappings (adding new fields/arrayBlocks), update **both** `backend/src/config/blockJsonMapping.ts` AND `admin/src/lib/buildPreviewConfig.js`

### Field Types in FieldRenderer.jsx
`text`, `textarea`, `number`, `boolean`, `select`, `url`, `array`, `image`
- `image` type uses `ImageField.jsx` which calls `POST /api/upload/image?uploadFolder=<folder>`
- `array` type renders a list of sub-items with add/remove controls, each sub-item rendered with `FieldRenderer`

### Copy Block from Page (CopyBlockModal)
- Opens a modal to pick a source page, then lists that page's blocks
- Calls `POST /api/theme/pages/:slug/blocks/clone` with `{ sourceBlockId }`
- The backend deep-clones the source block's data and adds it to the current page

### Discard Changes
- Editor keeps an "unsaved changes" flag
- Discard button reverts to last saved state from the server

## Conventions

1. **JavaScript (JSX)** — no TypeScript in admin
2. **Path alias** — `@/` maps to `./src/`
3. **API base** — Vite proxy forwards `/api/*` to `http://localhost:5000`
4. **Env vars** — prefix with `VITE_` for client-side access
5. **No external UI library** — custom CSS-in-JS styles with inline `style={{}}`

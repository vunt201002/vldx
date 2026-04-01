# Admin Skill

## Overview

The admin panel is a Vite + React 18 SPA written in **JavaScript (JSX)**, using React Router v6 for navigation. It connects to the same Express backend as the frontend.

## Architecture

```
admin/
  src/
    App.jsx             # Root: React Router routes + ProtectedRoute guard
    main.jsx            # Vite entry point
    pages/
      Login.jsx         # Admin login (JWT auth)
      Dashboard.jsx     # Real analytics: page views, product views, trends, top pages
      Products.jsx      # Products table with edit links
      ProductDetail.jsx # Single product edit form
      Blogs.jsx         # Blog posts list
      BlogDetail.jsx    # Rich text blog editor (React Quill, cover image, tags, comments)
      MenuManager.jsx   # Menu CRUD with nested items and reordering
      BlockLibrary.jsx  # Visual block type library
      BlockPreview.jsx  # Block preview sandbox
      AuditLog.jsx      # Admin activity log with entity/action filters
      ThemeEditor.jsx   # Shopify-like theme editor (main page)
    components/
      theme-editor/
        ThemeEditorSidebar.jsx    # Block list, add/delete/reorder, copy from page
        BlockEditorPanel.jsx      # Form for editing a single block's fields
        BlockList.jsx             # Sortable block list component
        BlockListItem.jsx         # Individual block item with controls
        PageSettingsPanel.jsx     # Page-level settings (title, fonts)
        ThemePreview.jsx          # Iframe embedding the frontend [slug] page
        CopyBlockModal.jsx        # Modal: select source page → copy a block
        fields/
          FieldRenderer.jsx       # Renders the correct input for each field type
          ImageField.jsx          # Image upload via POST /api/upload/image
          MenuSelectField.jsx     # Dropdown fetching from /api/menus
      BlockRenderer.jsx   # Generic block rendering component
      Toast.jsx           # Temporary notification component (auto-dismiss 3s)
    context/
      AuthContext.jsx     # Admin JWT auth state + ProtectedRoute
    layout/
      AdminLayout.jsx   # Sidebar + content wrapper
    hooks/
      useFetch.js       # Generic data fetching hook
    lib/
      api.js            # Centralized fetch wrapper with auth header injection + 401 redirect
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
`text`, `textarea`, `number`, `boolean`, `select`, `url`, `array`, `image`, `menu-select`
- `image` type uses `ImageField.jsx` which calls `POST /api/upload/image?uploadFolder=<folder>`
- `array` type renders a list of sub-items with add/remove controls, each sub-item rendered with `FieldRenderer`
- `menu-select` type fetches data from `/api/menus` and renders a dropdown

### Adding a custom field type
1. Create `fields/MyField.jsx` — a component receiving `{ field, value, onChange }`
2. Register in `fields/FieldRenderer.jsx`: add `'my-type': MyField` to `fieldComponents`
3. Add the type to `blockFieldDefs.ts` type union (use `as any` if TypeScript complains)
4. Use `key: 'myField', type: 'my-type'` in the block's field definitions

### Viewport state is owned by ThemeEditor, not ThemePreview
`ThemePreview` receives `viewport` and `onViewportChange` as props. The state lives in `ThemeEditor.jsx`. When the viewport switches to non-desktop, `onViewportChange` also collapses the admin sidebar via `LayoutContext.setCollapsed`:

```jsx
// ThemeEditor.jsx
const [viewport, setViewport] = useState('desktop');
const layout = useLayout();

const handleViewportChange = useCallback((vp) => {
  setViewport(vp);
  if (layout) layout.setCollapsed(vp === 'desktop');
}, [layout]);

<ThemePreview viewport={viewport} onViewportChange={handleViewportChange} ... />
```

Do NOT add local `viewport` state inside `ThemePreview`.

### Copy Block from Page (CopyBlockModal)
- Opens a modal to pick a source page, then lists that page's blocks
- Calls `POST /api/theme/pages/:slug/blocks/clone` with `{ sourceBlockId }`
- The backend deep-clones the source block's data and adds it to the current page

### Discard Changes
- Editor keeps an "unsaved changes" flag
- Discard button reverts to last saved state from the server

## Admin Layout Patterns

### Collapsible sidebar
`AdminLayout.jsx` manages a `collapsed` boolean with `useState`. The sidebar width is driven by a CSS variable:

```jsx
<div
  className="admin-layout"
  style={{ '--sidebar-width': collapsed ? '60px' : '240px' }}
>
  <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
    ...
    <button onClick={() => setCollapsed(c => !c)}>
      {collapsed ? '›' : '‹'}
    </button>
```

CSS in `layout.css` reads `var(--sidebar-width)` for both the aside width and the main content margin. The collapsed state is exposed to child pages via `LayoutContext` (`admin/src/context/LayoutContext.jsx`):

```jsx
<LayoutContext.Provider value={{ collapsed, setCollapsed }}>
  <Outlet />
</LayoutContext.Provider>
```

Child pages read it with `useLayout()` from `@/context/LayoutContext`.

## Dashboard (Real Analytics)

`Dashboard.jsx` fetches real analytics data from the backend aggregation API:
- Stats grid: total page views, product views, unique visitors, blog views
- Top pages, top products, top colors tables
- Trend chart (views per day)
- Uses `Promise.all()` for parallel fetching of all analytics endpoints
- Defensive parsing: `response.data || response` handles both wrapper formats

## Audit Log Page

`AuditLog.jsx` displays admin activity with:
- Filter dropdowns: entity type (product, blog, material, etc.) and action (create, update, delete)
- Pagination (20 items per page, controlled via query params)
- Color-coded action badges (green=create, blue=update, red=delete)
- Dates formatted in `vi-VN` locale

## Blog Editor

`BlogDetail.jsx` is the richest form page:
- **React Quill** rich text editor for content
- Cover image: URL text input OR file upload to Cloudinary
- Tags: add via Enter key, displayed as pills with remove button
- YouTube embed support in content
- Comments section (read-only with admin delete)
- Sticky bottom action bar (publish/draft toggle, save, delete)

## ThemeEditor State Pattern

`ThemeEditor.jsx` uses `useReducer` for complex state management:
- Tracks `dirty` (page-specific changes) and `dirtyGlobal` (header/footer changes) separately
- Global changes show a warning: "Changes to header/footer affect all pages"
- Save behavior differs: page save vs global save with confirmation
- Discard reverts to last-saved state from API

## Admin Auth Flow

1. `Login.jsx` sends credentials to `POST /api/admin/auth/login`
2. Receives `{ token, user }` — stored in `AuthContext` + `localStorage`
3. `AuthContext.jsx` validates token on mount via `GET /api/admin/auth/me`
4. `ProtectedRoute` in `App.jsx` wraps all routes except `/login`
5. `api.js` wrapper auto-injects `Authorization: Bearer <token>` and redirects to `/login` on 401

## API Client (`lib/api.js`)

Centralized fetch wrapper:
```js
// Auto-injects auth header, handles 401 redirect
const { get, post, put, del } = api;

// Usage in pages:
const data = await get('/api/products');
await post('/api/blog', { title, content });

// File uploads bypass wrapper (need FormData):
await fetch('/api/upload/image', { method: 'POST', body: formData, headers: { Authorization: `Bearer ${token}` } });
```

## UI Component Library

The admin uses a custom component library at `src/components/ui/`:

### Components
| Component | File | Purpose |
|-----------|------|---------|
| `Button` | `Button.jsx` | Variants: `primary`, `secondary`, `danger`, `ghost`. Sizes: `sm`, `md`. Accepts `icon` prop (Lucide React component) |
| `Card` | `Card.jsx` | Simple wrapper with `.card` class, accepts className override |
| `Badge` | `Badge.jsx` | Inline status labels with variant-based coloring |
| `Table`, `Th`, `Td` | `Table.jsx` | Composition-based: export sub-components for full flexibility |
| `Modal` | `Modal.jsx` | Overlay + content with click-outside-to-close (stopPropagation pattern) |
| `PageHeader` | `PageHeader.jsx` | Title + subtitle left, `{children}` slot right for action buttons |
| `StatCard` | `StatCard.jsx` | Dashboard stat with icon, label, value |
| `FormGroup` | `FormGroup.jsx` | Label + input wrapper with error display |
| `EmptyState` | `EmptyState.jsx` | Placeholder for empty lists |
| `ErrorAlert` | `ErrorAlert.jsx` | Error message display |

All exported from `components/ui/index.js`:
```js
import { Button, Card, Table, Th, Td, PageHeader, Modal } from '@/components/ui';
```

### Component Pattern
- **Minimal wrappers**: apply className + forward `{...rest}` to native element
- **Zero inline styles**: all styling in `components.css`, components only apply class names
- **Composition over config**: `Table` exports sub-components (`Th`, `Td`) rather than column config props

### CSS Architecture (Three-Tier)
```
src/styles/
  design-tokens.css  — CSS custom properties only (colors, spacing, shadows, radii)
  components.css     — Component styles using var(--token) references
  layout.css         — Structural layout (sidebar, main-content, topbar)
  globals.css        — Imports all above + resets
```

**Design tokens** define both raw scales (`--gray-50`..`--gray-900`, `--accent-500`) and semantic aliases (`--color-primary`, `--color-surface`, `--color-danger`). Sidebar width is also a token (`--sidebar-width: 240px`).

### Sticky Action Bar Pattern
Product and blog edit pages use a sticky bottom action bar for save/delete:
```css
position: sticky;
bottom: 0;
z-index: 10; /* below topbar (50) and sidebar (100) */
```

## Conventions

1. **JavaScript (JSX)** — no TypeScript in admin
2. **Path alias** — `@/` maps to `./src/`
3. **API base** — Vite proxy forwards `/api/*` to `http://localhost:5000`
4. **Env vars** — prefix with `VITE_` for client-side access
5. **CSS classes + design tokens** — use component classes from `components.css` with CSS variables from `design-tokens.css`. No inline `style={{}}` for new code.
6. **Use UI components** — always use `@/components/ui` for buttons, cards, tables, modals, headers. Don't create one-off styled elements.
7. **Toast notifications** — use `Toast` component for temporary feedback (auto-dismiss after 3s)
8. **Confirmation dialogs** — `window.confirm()` before destructive actions (delete, discard unsaved changes)
9. **Safe nullish access** — use `?.` and `?? defaultValue` consistently for API data

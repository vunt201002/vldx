# Multi-Image Gallery for Content + Image Block

## Overview

Upgrade the Content + Image block's image side (currently a single square image) to support a gallery of 1-6 images with adaptive grid layouts that look great at every count. The text/content side stays unchanged. Mobile-first design — most customers browse on mobile.

## Requirements

### Functional
- Replace single `squareImageUrl` with an `images` array (up to 6 items, each with `url` and `alt`)
- Auto-detect image count and render the best layout for that count
- Keep existing text side (overline, title, titleAccent, description, buttons) unchanged
- Keep `squarePosition` (left/right) setting for desktop layout direction
- Remove `rectImageUrl`/`rectImageAlt` and `squareImageUrl`/`squareImageAlt` — replaced by the `images` array
- Remove `rectImageOrder` — no longer needed
- Admin can add/remove/reorder images in the gallery
- Backward compatible: if old `squareImageUrl` or `rectImageUrl` exist, auto-migrate them into the `images` array at render time

### Non-functional
- Mobile-first: gallery must look polished on 375px screens
- No layout shift — images use fixed aspect ratios via CSS
- Smooth feel — subtle hover effects on desktop only
- Lightweight — no external gallery/lightbox library

## Architecture

### Components Affected
| File | Change |
|------|--------|
| `frontend/components/sections/ContentImage.js` | Rewrite image side to render adaptive gallery grid |
| `backend/src/config/blockFieldDefs.ts` | Replace 4 image fields with `images` array field |
| `admin/src/components/theme-editor/BlockEditorPanel.jsx` | Already supports `array` type — no change needed |
| `admin/src/components/theme-editor/fields/ImageField.jsx` | Already exists — reused inside array items |

### Data Flow
1. Admin adds images via Theme Editor → stored as `settings.images[]` in block data
2. Frontend `ContentImage.js` reads `settings.images` array
3. Component picks layout based on `images.length` (1-6)
4. CSS grid renders the chosen layout

## Mobile-First Gallery Layouts (1-6 images)

All layouts use CSS Grid. On mobile (< 640px), the gallery takes full width above the text content.

### 1 image
```
┌──────────┐
│          │
│    1     │   Single image, 4:3 aspect ratio, full width
│          │
└──────────┘
```

### 2 images
```
┌──────────┐
│          │
│    1     │   Top: hero image 16:9
│          │
├────┬─────┤
│ 2  │  2  │   Bottom: same image but... no.
└────┴─────┘
```

Actually, for 2 images — side by side on mobile:
```
┌─────┬─────┐
│     │     │
│  1  │  2  │   2 columns, 1:1 aspect ratio each
│     │     │
└─────┴─────┘
```

### 3 images
```
┌──────────┐
│          │
│    1     │   Top: hero 16:9
│          │
├────┬─────┤
│ 2  │  3  │   Bottom row: 2 equal squares
└────┴─────┘
```

### 4 images
```
┌─────┬─────┐
│     │     │
│  1  │  2  │   2x2 grid, 1:1 aspect ratio
│     │     │
├─────┼─────┤
│     │     │
│  3  │  4  │
│     │     │
└─────┴─────┘
```

### 5 images
```
┌──────────┐
│          │
│    1     │   Top: hero 16:9
│          │
├────┬─────┤
│ 2  │  3  │   Middle row: 2 squares
├────┼─────┤
│ 4  │  5  │   Bottom row: 2 squares
└────┴─────┘
```

### 6 images
```
┌──────────┐
│          │
│    1     │   Top: hero 16:9
│          │
├───┬───┬──┤
│ 2 │ 3 │4 │   Middle row: 3 equal
├───┼───┼──┤
│ 5 │   │6 │   Bottom: 2 columns (5 wider, 6 narrower) — or 2 equal
└───┴───┴──┘
```

Alternative 6-image layout (cleaner):
```
┌───────┬──────┐
│       │  2   │
│   1   ├──────┤   Top: 1 large (2 rows) + 2 small stacked
│       │  3   │
├───┬───┼──────┤
│ 4 │ 5 │  6   │   Bottom row: 3 equal
└───┴───┴──────┘
```

Alternative 6-image layout (3x2 grid):
```
┌───┬───┬───┐
│ 1 │ 2 │ 3 │   Top row: 3 equal
├───┼───┼───┤
│ 4 │ 5 │ 6 │   Bottom row: 3 equal
└───┴───┴───┘
```

### Desktop (>= 640px)
On desktop, the gallery column sits beside the text column (like current square image). The gallery takes ~45-50% width. Internal grid layouts remain the same but scale proportionally within the column.

## Implementation Steps

### Step 1: Update blockFieldDefs.ts (Backend)

Replace the 4 individual image fields + `rectImageOrder` with an `images` array:

```typescript
// Remove these fields:
// - squarePosition (KEEP this one — still controls left/right)
// - rectImageOrder
// - squareImageUrl, squareImageAlt
// - rectImageUrl, rectImageAlt

// Add:
{
  key: 'images',
  label: 'Gallery Images',
  type: 'array',
  fields: [
    { key: 'url', label: 'Image', type: 'image', uploadFolder: 'pages', required: true },
    { key: 'alt', label: 'Alt Text', type: 'text' },
  ],
}
```

Keep `squarePosition` (rename label to "Image Gallery Side") and all text/style/button fields unchanged.

### Step 2: Rewrite ContentImage.js (Frontend)

1. **Backward compat**: At the top of the component, normalize data:
   ```js
   const images = settings.images?.length > 0
     ? settings.images
     : [
         settings.squareImageUrl && { url: settings.squareImageUrl, alt: settings.squareImageAlt },
         settings.rectImageUrl && { url: settings.rectImageUrl, alt: settings.rectImageAlt },
       ].filter(Boolean);
   ```

2. **Gallery component**: Create an `ImageGallery` sub-component that takes `images` array and renders the correct CSS grid layout based on `images.length`.

3. **Layout logic**: Use a single CSS Grid container with different `grid-template` rules based on image count. Use a `data-count` attribute or a class name like `ci-gallery--3` to select layout via CSS.

4. **Mobile-first CSS**:
   - Default (mobile): gallery is full-width, stacked above text
   - `@media (min-width: 640px)`: gallery sits beside text at ~45% width
   - `@media (min-width: 1024px)`: gallery at ~48% width, increased gap

5. **Image rendering**: Each image uses `object-fit: cover` within its grid cell. Aspect ratios controlled by the grid template rows/columns.

6. **Hover effect** (desktop only): Subtle scale(1.02) on hover with overflow:hidden on cells.

### Step 3: Update existing page configs (optional migration)

Existing pages using `squareImageUrl`/`rectImageUrl` will work via the backward-compat normalization in Step 2. No database migration needed — the old fields still render correctly.

When an admin edits and saves a content-image block, the new `images` array format will be saved, replacing the old fields.

## Admin UX

The admin editor already supports `type: 'array'` fields with nested sub-fields. The `images` array will render as:

1. A list of image cards, each showing:
   - Image preview (via existing `ImageField` component)
   - Alt text input
   - Remove button
2. "Add Image" button at the bottom (max 6)
3. Drag-to-reorder (if array fields support it) or up/down arrows

No additional admin components needed — the existing `BlockEditorPanel` + `FieldRenderer` handle array fields automatically.

## Database Changes

None. The block `data` field is a JSON object stored in MongoDB. Adding `images[]` to `settings` is schema-free. Old `squareImageUrl`/`rectImageUrl` fields remain in existing documents and are handled by backward-compat code.

## CSS Details

```css
/* Mobile-first gallery grid */
.ci-gallery {
  display: grid;
  gap: 3px;
  width: 100%;
}

/* 1 image: single cell */
.ci-gallery[data-count="1"] {
  grid-template: auto / 1fr;
}
.ci-gallery[data-count="1"] .ci-gallery-img {
  aspect-ratio: 4/3;
}

/* 2 images: side by side squares */
.ci-gallery[data-count="2"] {
  grid-template: auto / 1fr 1fr;
}
.ci-gallery[data-count="2"] .ci-gallery-img {
  aspect-ratio: 1/1;
}

/* 3 images: hero top + 2 bottom */
.ci-gallery[data-count="3"] {
  grid-template-columns: 1fr 1fr;
}
.ci-gallery[data-count="3"] .ci-gallery-item:first-child {
  grid-column: 1 / -1;
  aspect-ratio: 16/9;
}

/* 4 images: 2x2 grid */
.ci-gallery[data-count="4"] {
  grid-template-columns: 1fr 1fr;
}
.ci-gallery[data-count="4"] .ci-gallery-img {
  aspect-ratio: 1/1;
}

/* 5 images: hero + 2x2 */
.ci-gallery[data-count="5"] {
  grid-template-columns: 1fr 1fr;
}
.ci-gallery[data-count="5"] .ci-gallery-item:first-child {
  grid-column: 1 / -1;
  aspect-ratio: 16/9;
}

/* 6 images: 1 large + 2 stacked right + 3 bottom */
.ci-gallery[data-count="6"] {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
}
.ci-gallery[data-count="6"] .ci-gallery-item:first-child {
  grid-row: 1 / 3;
  aspect-ratio: 3/4;
}

/* 6 images alternative: 3x2 grid */
.ci-gallery[data-count="6"].ci-gallery--grid {
  grid-template-columns: 1fr 1fr 1fr;
}
.ci-gallery[data-count="6"].ci-gallery--grid .ci-gallery-img {
  aspect-ratio: 1/1;
}
```

All images: `object-fit: cover; width: 100%; height: 100%; display: block;`

## Testing Strategy

### Manual Testing
- [ ] Add 1 image → verify single image renders correctly on mobile + desktop
- [ ] Add 2 images → verify side-by-side layout
- [ ] Add 3 images → verify hero + 2 bottom layout
- [ ] Add 4 images → verify 2x2 grid
- [ ] Add 5 images → verify hero + 2x2 layout
- [ ] Add 6 images → verify complex grid
- [ ] Test with `squarePosition: 'left'` and `'right'`
- [ ] Test backward compat: load existing page with old `squareImageUrl` → should render as 1-image gallery
- [ ] Test on real phone (375px width)
- [ ] Test admin: add/remove images, verify save/load round-trip
- [ ] Verify existing pages with old data still render without errors

### Edge Cases
- 0 images + no text → should render null (same as current)
- Images with very different aspect ratios → `object-fit: cover` handles this
- Very slow network → images load progressively (no special handling needed, browser default)

## Rollout Plan

1. Deploy on feature branch `feature/multi-image-gallery`
2. Test on staging with real content
3. Merge to main after review
4. Existing pages auto-compatible — no migration needed

## What Stays Unchanged

- Text side: overline, title, titleAccent, description, buttons
- `squarePosition` setting (left/right layout direction)
- All style settings: bgColor, maxWidth, sectionPadding, titleSize, descSize, colors
- Block registry entry (`'content-image': ContentImage`)
- SectionRenderer rendering logic
- Backend API — no new endpoints needed

## What Gets Removed

- `rectImageOrder` setting (top/bottom) — no longer meaningful with gallery
- `squareImageUrl`, `squareImageAlt` field defs (kept in data for backward compat)
- `rectImageUrl`, `rectImageAlt` field defs (kept in data for backward compat)
- The separate `ci-square-col` and `ci-rect-col` layout — replaced by gallery + text columns

---
*Generated: 2026-04-04*

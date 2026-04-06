# ContentImage Multi-Image Gallery Implementation Plan

## Overview

Improve the ContentImage block's square image side to support 1-6 images in a flex grid layout, instead of a single image. The rectangle image + content side remains unchanged.

## Requirements

### Functional
- Replace single `squareImageUrl` with a `squareImages` array (1-6 images)
- Admin can upload multiple images via the theme editor
- Layout rules based on image count:
  - **1 image:** full width (current behavior, square aspect)
  - **2 images:** 1 row, 2 equal columns
  - **3 images:** 1 row, 3 equal columns
  - **4 images:** row 1 = 3 columns, row 2 = 1 full-width image
  - **5 images:** row 1 = 3 columns, row 2 = 2 equal columns
  - **6 images:** row 1 = 3 columns, row 2 = 3 columns
- All images same height within each row
- Gap between images
- Backward compatible: existing `squareImageUrl` still works

### Non-functional
- No layout shift on load (aspect ratios defined in CSS)
- Responsive: grid works on mobile (full-width column)
- Lazy loading for non-first images

## Architecture

### Data Flow
```
Admin Editor → Block.data.squareImages[] → blockJsonMapping → JSON settings.squareImages[]
                                                            → Frontend ContentImage component
```

### Files Affected

| File | Change | Description |
|------|--------|-------------|
| `backend/src/config/blockFieldDefs.ts` | Add field | `squareImages` array with `url` + `alt` sub-fields |
| `backend/src/config/blockJsonMapping.ts` | Add mapping | `settingsArrayFields: ['squareImages']` |
| `admin/src/lib/buildPreviewConfig.js` | Mirror mapping | `settingsArrayFields: ['squareImages']` |
| `frontend/components/sections/ContentImage.js` | Major update | Grid rendering + backward compat |
| `frontend/lib/transformPageConfig.js` | No change | Already passes all data through |

## Implementation Steps

### Step 1: Backend Field Definitions
**File:** `backend/src/config/blockFieldDefs.ts`

Add `squareImages` array field to the `content-image` block, after existing `squareImageAlt`:
```ts
{
  key: 'squareImages',
  label: 'Square Images (Gallery)',
  type: 'array',
  fields: [
    { key: 'url', label: 'Image', type: 'image', uploadFolder: 'pages' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
  ],
},
```
Keep `squareImageUrl` and `squareImageAlt` for backward compatibility.

### Step 2: Backend JSON Mapping
**File:** `backend/src/config/blockJsonMapping.ts`

Add `settingsArrayFields: ['squareImages']` to the `content-image` entry. This passes the array through to JSON settings without converting to nested blocks (same pattern as `about.paragraphs`).

### Step 3: Admin Preview Config
**File:** `admin/src/lib/buildPreviewConfig.js`

Mirror step 2: add `settingsArrayFields: ['squareImages']` to the `content-image` entry so live preview works.

### Step 4: Frontend Component
**File:** `frontend/components/sections/ContentImage.js`

#### 4a. Backward-compatible image resolution
```js
const squareImages = settings.squareImages?.length > 0
  ? settings.squareImages
  : settings.squareImageUrl
    ? [{ url: settings.squareImageUrl, alt: settings.squareImageAlt || '' }]
    : [];
```

#### 4b. Replace single image with CSS Grid
Use a 6-column base grid for all layouts:

```jsx
<div className={`ci-grid ci-grid--${squareImages.length}`}>
  {squareImages.map((img, i) => (
    <div key={i} className="ci-grid-cell">
      <img src={img.url} alt={img.alt || ''} loading={i > 0 ? 'lazy' : undefined} />
    </div>
  ))}
</div>
```

#### 4c. CSS Grid layouts (in `<style jsx>`)

| Count | Grid Columns | Row 1 span | Row 2 span | Row 2 aspect |
|-------|-------------|-----------|-----------|-------------|
| 1 | `1fr` | full | — | — |
| 2 | `1fr 1fr` | 1 each | — | — |
| 3 | `1fr 1fr 1fr` | 1 each | — | — |
| 4 | `1fr 1fr 1fr` | 1 each | `1/-1` (full) | 3/1 |
| 5 | `repeat(6, 1fr)` | span 2 each | span 3 each | 3/2 |
| 6 | `1fr 1fr 1fr` | 1 each | 1 each | 1/1 |

### Step 5: No Migration Needed
Existing blocks with `squareImageUrl` continue to work via the backward-compat logic. When admin adds images to `squareImages`, the component prefers that over the legacy field.

## Key Files
- `frontend/components/sections/ContentImage.js` — main component
- `backend/src/config/blockFieldDefs.ts` — editor form fields
- `backend/src/config/blockJsonMapping.ts` — data mapping
- `admin/src/lib/buildPreviewConfig.js` — live preview mapping

---
*Generated: 2026-04-06*

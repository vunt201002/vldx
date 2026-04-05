# Product Collection Block Updates — Implementation Plan

## Overview
Update the `collections` block to: simplify the title (remove accent, add optional link), support multiple images/GIFs per product with hover-slide behavior, and add per-product clickable links.

## Requirements

### Functional
1. **Title simplification** — Remove `titleAccent` field. Keep `title` only. Add optional `titleLink` URL. If set, title shows underline on hover and navigates on click.
2. **Multi-image products** — Each product supports multiple images (including GIFs) stored as an array. On hover, images auto-slide to the next one (opacity crossfade, ~1.2s interval).
3. **Product links** — Each product item has an optional `href` field. Clicking the card navigates to that URL (falls back to `/materials?category=${slug}` if empty).

### Non-Functional
- Backward compatible with existing `image` (string) data in DB
- Lazy-load off-screen images for performance
- GIFs work natively via `<img>` — no special handling needed

## Architecture

### Components Affected

| Layer | File | Change |
|-------|------|--------|
| Backend field defs | `backend/src/config/blockFieldDefs.ts` | Remove `titleAccent`, add `titleLink`, change `image` → `images` array, add `href` |
| Backend JSON mapping | `backend/src/config/blockJsonMapping.ts` | Update `settingsFields`: remove `titleAccent`, add `titleLink` |
| Backend seed data | `backend/src/scripts/seedBlocks.ts` | Update sample data to match new schema |
| Frontend renderer | `frontend/components/sections/Collections.js` | Title link, image slider, product href |
| Frontend transform | `frontend/lib/transformPageConfig.js` | No change (products pass through as-is) |
| Admin editor | `admin/src/components/theme-editor/fields/ArrayField.jsx` | Verify nested arrays render correctly |

### Data Flow
```
Admin edits block → blockFieldDefs defines form fields
  → saved to MongoDB (data.products[].images = [{url:'...'},...])
  → blockJsonMapping generates page JSON
  → Collections.js renders with slider + links
```

## Implementation Steps

### Step 1: Backend Schema — `blockFieldDefs.ts`

Update the `collections` type fields:

```typescript
{
  type: 'collections',
  label: 'Product Collections',
  icon: '🛍️',
  fields: [
    { key: 'overline', label: 'Overline', type: 'text' },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'titleLink', label: 'Title Link', type: 'url', placeholder: 'https://...' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'cardLinkLabel', label: 'Card Link Label', type: 'text' },
    {
      key: 'products',
      label: 'Products',
      type: 'array',
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'slug', label: 'Slug', type: 'text', required: true },
        { key: 'href', label: 'Link URL', type: 'url', placeholder: '/materials?category=...' },
        {
          key: 'images',
          label: 'Images / GIFs',
          type: 'array',
          fields: [
            { key: 'url', label: 'Image URL', type: 'image', uploadFolder: 'products' },
          ],
        },
        { key: 'desc', label: 'Description', type: 'textarea' },
        { key: 'specs', label: 'Specs', type: 'text' },
        { key: 'color', label: 'Gradient Color', type: 'text' },
      ],
    },
  ],
}
```

**Key changes:**
- Removed `titleAccent`
- Added `titleLink` (url type)
- Changed `image` (single string) → `images` (nested array of `{url}` objects)
- Added `href` to each product item

### Step 2: Backend JSON Mapping — `blockJsonMapping.ts`

```typescript
collections: {
  settingsFields: ['overline', 'title', 'titleLink', 'description', 'cardLinkLabel'],
  arrayBlocks: [
    { dataKey: 'products', blockType: 'product-card' },
  ],
},
```

Remove `titleAccent`, add `titleLink` to `settingsFields`.

### Step 3: Seed Data — `seedBlocks.ts`

Update product entries: replace `image: 'url'` with `images: [{ url: '...' }, { url: '...' }]`, add `href` fields, remove `titleAccent` from section data.

### Step 4: Frontend — `Collections.js`

#### 4a. Title with optional link
```jsx
{settings.titleLink ? (
  <a href={settings.titleLink} className="hover:underline">
    <h2>{settings.title}</h2>
  </a>
) : (
  <h2>{settings.title}</h2>
)}
```

#### 4b. Product card image slider
Create a `ProductCardImages` sub-component:
- State: `activeIndex` (which image is shown)
- On `mouseenter`: start interval cycling through images (~1.2s)
- On `mouseleave`: clear interval, reset to index 0
- Render images stacked absolutely, toggle `opacity-100`/`opacity-0` with CSS transition
- Backward compat: if `p.images` missing but `p.image` exists, normalize to `[{ url: p.image }]`
- Dot indicators at bottom to show active image

#### 4c. Product card link
```jsx
const linkHref = p.href || `/materials?category=${p.slug}`;
```
Use `linkHref` as the `<a>` href.

### Step 5: Verify Admin Nested Arrays

Test that `ArrayField` correctly renders a nested array (images inside products). The existing `ArrayField` → `FieldRenderer` → `ArrayField` recursion should work, but needs manual verification.

### Step 6: Re-seed & Test

Run seed script or manually update existing blocks via admin. Regenerate page JSONs.

## API Changes
None. The block CRUD API uses `data` as a free-form `Mixed` schema — no route changes needed.

## Database Changes
- `data.titleAccent` → removed (no migration needed, just ignored)
- `data.titleLink` → new optional string field
- `data.products[].image` → `data.products[].images` (array of `{url}`)
- `data.products[].href` → new optional string field
- No index changes needed

## Testing Strategy
- **Manual**: Edit a collections block in admin, verify nested image array fields render
- **Manual**: Add multiple images to a product, hover on frontend to verify slider
- **Manual**: Set title link, verify underline on hover and navigation on click
- **Manual**: Set product href, verify click navigates correctly
- **Backward compat**: Load a page with old `image` string data, verify it still renders

## Potential Challenges
- **Nested arrays in admin**: First time using array-inside-array — may need UI polish
- **Backward compatibility**: Frontend must handle both `image` (string) and `images` (array)
- **Image loading**: Multiple images per card increases page weight — use lazy loading

## Implementation Order & Dependencies
1. `blockFieldDefs.ts` + `blockJsonMapping.ts` (no dependencies)
2. `seedBlocks.ts` (depends on step 1 for field names)
3. `Collections.js` (can be done in parallel with step 2)
4. Admin verification (depends on step 1)
5. Re-seed + end-to-end test (depends on all above)

---
*Generated: 2026-04-06*

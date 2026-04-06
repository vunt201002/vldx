# Color Palette Block Improvements - Implementation Plan

## Overview

Improve the ColorPicker component with three enhancements: resize swatches (smaller, more spacing, bigger text), add pagination (max 6 per page), and mobile-responsive preview modal (popup visualization on color select).

## Requirements

### Functional
- Reduce swatch height/width, increase gap between swatches, slightly bigger color name text
- Show maximum 6 colors per page with prev/next pagination controls
- Desktop: keep current layout (preview left, swatches right)
- Mobile: hide left preview panel; when a color is selected, show visualization in a popup modal
- Modal dismissable via close button or backdrop tap

### Non-functional
- Smooth transitions on pagination and modal
- No layout shift when paginating
- Body scroll locked when modal is open

## Architecture

All changes are frontend-only in `ColorPicker.js`. No backend/DB/API changes needed.

**State additions:**
- `page` (number) — current pagination page
- `showModal` (boolean) — mobile preview modal visibility
- `isMobile` (boolean) — viewport detection via resize listener

## Implementation Steps

### Step 1: Resize swatches and spacing
**File**: `frontend/components/sections/ColorPicker.js`
- Increase grid gap from `1rem` to `1.25rem`
- Constrain swatch size with max dimensions
- Bump color name fontSize from `0.6875rem` (11px) to `0.8125rem` (13px)

### Step 2: Add pagination
**File**: `frontend/components/sections/ColorPicker.js`
- Add `page` state, compute `ITEMS_PER_PAGE = 6`, slice colors array
- Compute global index (`page * 6 + i`) for selection tracking
- Render prev/next buttons below grid when `totalPages > 1`
- Style buttons with project accent color (#C4A882)

### Step 3: Add mobile detection
- Track `isMobile` via `window.innerWidth <= 768` with resize listener
- Add `showModal` state

### Step 4: Hide left preview on mobile
- Add `.cp-preview` class to preview div
- CSS: `@media (max-width: 768px) { .cp-preview { display: none !important; } }`
- On mobile swatch click: open modal automatically

### Step 5: Build mobile preview modal
- Fixed overlay with backdrop blur
- Close button (X), backdrop dismiss
- Show preview image or solid hex color
- Color name label below image
- Lock body scroll when open

### Step 6: Update `<style jsx>` responsive rules
- Hide `.cp-preview` on mobile
- Stack layout vertically
- Keep 3-column grid for swatches on mobile

## API Changes
None.

## Database Changes
None.

## Testing Strategy
- Test on pages: `/ban`, `/gach-op-lat`, `/tam-op-cau-thang`, `/ghe-da-cong-vien`
- Verify pagination with varying swatch counts (6, 9, 18)
- Test mobile modal open/close, body scroll lock
- Test viewport resize transitions
- Verify `trackColorSelect` analytics still fires

## Key Files
- `frontend/components/sections/ColorPicker.js` — sole file to modify
- `frontend/config/pages/gach-op-lat.json` — 18 swatches, good test fixture
- `backend/src/config/blockFieldDefs.ts` — reference for field schema

---
*Generated: 2026-04-06*

# Service Page (Thi Cong Truc Tiep) Improvement Plan

## Overview

Redesign the service page to better communicate the "Direct Installation" service offering. The current page is too simple and doesn't tell the service story to customers. The new page uses a mix of existing blocks and new blocks to create a more engaging, visually interesting experience.

## Page Structure: Preview → Block Mapping

| # | Preview Section | Block Type | Status | Action |
|---|----------------|-----------|--------|--------|
| 1 | Hero | `hero` | **EXISTS** | Keep current, no changes |
| 2 | "Why Need Direct Install" | `content-image` | **EXISTS** | Update settings — use the improved squareImages gallery + text. Add decorative SVG blob via new `decorativeSvg` setting |
| 3 | Why Choose Us V2 | `why-choose-us` | **EXISTS** | Keep current, no changes |
| 4 | Project Gallery | `collections` | **EXISTS** | Update settings — the Collections component already has hover image slider. Just update product cards with project data |
| 5 | Trust Stats | `stats-bar` | **NEW** | Create new block type — fern bg, 4 stats with icons, decorative SVGs |
| 6 | CTA | `cta-banner` | **NEW** | Create new block type — two-column CTA with image, wave divider, button |

## Detailed Block Analysis

### Block 1: Hero (EXISTS — `hero`)
- **Component:** `frontend/components/sections/Hero.js`
- **Action:** No changes needed
- **Current on page:** Yes (block ID `69be5516315aac49a5e9be3e`)

### Block 2: "Why Need" (EXISTS — `content-image`)
- **Component:** `frontend/components/sections/ContentImage.js`
- **Action:** Update block data via admin — use squareImages gallery (new feature we just built) with a construction site image. Set the overline, title, description text in Vietnamese. No code changes needed — this is a data/content change only.
- **Current on page:** Yes (block ID `69c6b5c24c5b95f3b1ab93f0` — currently has English text, needs Vietnamese content update)
- **Content to set:**
  - overline: "tai sao can thi cong truc tiep?"
  - title: "Moi cong trinh deu co yeu cau rieng"
  - description: Vietnamese text explaining the service
  - squareImages: construction site photos
  - Move this block to position 2 (currently position 4)

### Block 3: Why Choose Us V2 (EXISTS — `why-choose-us`)
- **Component:** `frontend/components/sections/WhyChooseUs.js`
- **Action:** No code changes. Keep current block (ID `69c6b1ad951275f6c3356a6e`)
- **Current on page:** Yes

### Block 4: Project Gallery (EXISTS — `collections`)
- **Component:** `frontend/components/sections/Collections.js`
- **Action:** Create a new Collections block for this page with project cards. Each card uses the existing multi-image hover slider (from ProductCardImages). Just need to add the block via admin with project data.
- **Current on page:** No — needs new block added via admin
- **Data needed:**
  - 3 project cards with name, description, specs, multiple images each
  - Card link label: "Xem chi tiet"

### Block 5: Trust Stats Bar (NEW — `stats-bar`)
- **Component:** Need to create `frontend/components/sections/StatsBar.js`
- **Action:** Create new block type end-to-end
- **Design:** Fern green background, 4 stats with SVG icons, decorative SVG elements
- **Files to create/modify:**
  - `frontend/components/sections/StatsBar.js` — new component
  - `frontend/components/sections/registry.js` — register new type
  - `backend/src/config/blockFieldDefs.ts` — add field definitions
  - `backend/src/config/blockJsonMapping.ts` — add mapping
  - `admin/src/lib/buildPreviewConfig.js` — add mapping
  - `frontend/lib/transformPageConfig.js` — add to ARRAY_BLOCK_MAP
- **Settings:** bgColor, overline
- **Nested blocks:** `stat-item` array with: icon (select), number (text), label (text)

### Block 6: CTA Banner (NEW — `cta-banner`)
- **Component:** Need to create `frontend/components/sections/CtaBanner.js`
- **Action:** Create new block type end-to-end
- **Design:** Two-column — left has title + subtitle + CTA button, right has image with rounded corners. Cream background with SVG wave divider at top.
- **Files to create/modify:**
  - `frontend/components/sections/CtaBanner.js` — new component
  - `frontend/components/sections/registry.js` — register new type
  - `backend/src/config/blockFieldDefs.ts` — add field definitions
  - `backend/src/config/blockJsonMapping.ts` — add mapping
  - `admin/src/lib/buildPreviewConfig.js` — add mapping
- **Settings:** title, subtitle, ctaLabel, ctaHref, imageUrl, bgColor

### Block to REMOVE: Service Process
- **Current block:** `service-process` (ID `69c6b5c24c5b95f3b1ab93ed`)
- **Action:** Remove from page order — we're replacing it with the "Why Need" content-image block repositioned to slot 2. The service process steps are now covered by Why Choose Us V2 and the overall page narrative.

## Implementation Steps

### Step 1: Create StatsBar block type
1. Add `StatsBar.js` component
2. Add to `registry.js`
3. Add field defs in `blockFieldDefs.ts`
4. Add mapping in `blockJsonMapping.ts` + `buildPreviewConfig.js`
5. Add to `transformPageConfig.js` ARRAY_BLOCK_MAP

### Step 2: Create CtaBanner block type
1. Add `CtaBanner.js` component
2. Add to `registry.js`
3. Add field defs in `blockFieldDefs.ts`
4. Add mapping in `blockJsonMapping.ts` + `buildPreviewConfig.js`

### Step 3: Seed the service page
1. Create seed script to:
   - Reorder existing blocks
   - Update content-image block text to Vietnamese service content
   - Add new Collections block with project data
   - Add new StatsBar block with stats
   - Add new CtaBanner block with CTA content
   - Remove service-process block from page

### Step 4: Test
- Verify all sections render correctly
- Check responsive layout on mobile
- Verify admin editor can edit all new fields

## New Page Order (after implementation)

1. `hero` — existing, unchanged
2. `content-image` — existing, repositioned + content updated
3. `why-choose-us` — existing, unchanged
4. `collections` — new block added, project gallery with slider cards
5. `stats-bar` — **new block type**, trust stats
6. `cta-banner` — **new block type**, final CTA

## Key Files

### New files
- `frontend/components/sections/StatsBar.js`
- `frontend/components/sections/CtaBanner.js`
- `backend/src/scripts/seedServicePage.ts` (or update existing)

### Modified files
- `frontend/components/sections/registry.js`
- `frontend/lib/transformPageConfig.js`
- `backend/src/config/blockFieldDefs.ts`
- `backend/src/config/blockJsonMapping.ts`
- `admin/src/lib/buildPreviewConfig.js`

---
*Generated: 2026-04-06*

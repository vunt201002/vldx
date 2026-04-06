# Fern Green Rebrand Implementation Plan

## Overview

Rebrand the entire site from the current warm sandstone/orange palette (`#C4A882` primary) to a fern green palette (`#9B997B` primary). This involves updating the Tailwind config, global CSS, all component inline styles, and JSON config files.

## New Color Palette

### Current vs New Mapping

| Role | Current Name | Current Hex | New Hex | Notes |
|------|-------------|-------------|---------|-------|
| Lightest | warm-50 | #FAF8F5 | #F7F7F4 | Very light warm green-gray |
| Light BG | cream / warm-100 | #F5F0EB | #F0EFE9 | Light sage cream |
| Light neutral | sand / warm-200 | #E8E0D6 | #E2E1D6 | Light sage |
| Mid-light | warm-300 | #D4C8B8 | #CCC9B8 | Sage mid |
| **Primary accent** | **sandstone / warm-400** | **#C4A882** | **#9B997B** | **Fern (new primary)** |
| Secondary | concrete / warm-500 | #8B7D6B | #7A7866 | Dark fern |
| Medium dark | warm-600 | #6B5D4E | #5E5C4D | Olive dark |
| Dark | warm-700 | #4A3F34 | #43413A | Deep olive |
| Very dark | warm-800 | #2E2720 | #2B2A25 | Near-black olive |
| Darkest | charcoal / warm-900 | #1A1714 | #1A1A17 | Charcoal (near-black) |

### RGBA Equivalents

| Current RGBA | New RGBA | Usage |
|---|---|---|
| `rgba(196,168,130,0.15)` | `rgba(155,153,123,0.15)` | Hover backgrounds, subtle tints |
| `rgba(196,168,130,0.3)` | `rgba(155,153,123,0.3)` | Active shadow, color picker |
| `rgba(196,168,130,0.4)` | `rgba(155,153,123,0.4)` | FAB dock border |

### Accent Colors (service icons) — Updated to complement fern

| Current | New | Purpose |
|---------|-----|---------|
| #FFD580 (warm yellow) | #D4CC8C (sage yellow) | Icon circle 1 |
| #A8E6CF (mint green) | #A8C9A0 (muted green) | Icon circle 2 |
| #87CEEB (sky blue) | #8CB8C4 (muted teal) | Icon circle 3 |
| #F8B4C8 (rose pink) | #C4A8B0 (dusty mauve) | Icon circle 4 |

### Colors NOT changing

- Blog WSJ colors: #0274B6 (teal links), #E2E2E2 (dividers), #111111, #555555 — editorial style, brand-neutral
- Brand hover colors in ContactFAB: #16a34a (phone green), #0068FF (zalo blue) — these are external brand colors
- Blog neutrals: #333, #999, #ccc, #ddd, #bbb, #666, #f0f0f0 — generic UI neutrals
- Like button red: #dc2626 — semantic color
- Nav background from JSON config: `#f7e2ce` → will update to `#e8e9df` (light fern tint)

## Requirements

### Functional
- Replace all instances of the sandstone palette with the fern palette across the entire frontend
- Maintain the same visual hierarchy (light backgrounds, accent borders, dark text)
- Keep brand-specific colors (Zalo blue, phone green) unchanged
- Update service icon accent colors to complement fern

### Non-functional
- No visual regressions — every element that was styled should remain styled
- Maintain contrast ratios for accessibility
- Single atomic change — all colors change together, no half-and-half

## Architecture

### Files Requiring Changes

**1. Tailwind Config (source of truth)**
- `frontend/tailwind.config.js` — update all named colors and warm scale

**2. Global CSS**
- `frontend/styles/globals.css` — ~12 hardcoded hex/RGBA values

**3. Components (inline styles)**
- `frontend/components/ContactFAB.js` — FAB dock colors
- `frontend/components/sections/ColorPicker.js` — overline, borders, pagination
- `frontend/components/sections/MaterialShowcase.js` — overline, borders, tags, specs
- `frontend/components/sections/ServiceProcess.js` — background, borders, step circles, CTA
- `frontend/components/sections/Navbar.js` — mobile menu link color
- `frontend/components/sections/WhyChooseUs.js` — wave connector, icon BG
- `frontend/components/sections/Collections.js` — section background
- `frontend/components/sections/Featured.js` — uses Tailwind classes (auto-updated via config)

**4. JSON Config (page-level colors)**
- `frontend/config/pages/ban.json` — nav background color
- `frontend/config/pages/service.json` — section BG, icon accent colors
- `frontend/config/pages/landing.json` — check for hardcoded colors
- `frontend/config/pages/gach-op-lat.json` — check for hardcoded colors
- `frontend/config/pages/tam-op-cau-thang.json` — check for hardcoded colors
- `frontend/config/pages/ghe-da-cong-vien.json` — check for hardcoded colors

## Implementation Steps

### Step 1: Update Tailwind Config
**File:** `frontend/tailwind.config.js`

Replace the color definitions:
```js
colors: {
  cream: '#F0EFE9',
  sand: '#E2E1D6',
  sandstone: '#9B997B',  // fern
  concrete: '#7A7866',
  charcoal: '#1A1A17',
  warm: {
    50:  '#F7F7F4',
    100: '#F0EFE9',
    200: '#E2E1D6',
    300: '#CCC9B8',
    400: '#9B997B',
    500: '#7A7866',
    600: '#5E5C4D',
    700: '#43413A',
    800: '#2B2A25',
    900: '#1A1A17',
  },
},
```

### Step 2: Update Global CSS
**File:** `frontend/styles/globals.css`

Search-and-replace these values:
| Find | Replace | Location |
|------|---------|----------|
| `#F5F0EB` | `#F0EFE9` | scrollbar-track, selection |
| `#C4A882` | `#9B997B` | scrollbar-thumb, selection bg, blockquote border |
| `#8B7D6B` | `#7A7866` | scrollbar-thumb:hover, FAB icon color |
| `#1A1714` | `#1A1A17` | selection text, code block bg |
| `#f5f0eb` | `#F0EFE9` | code block text (lowercase variant) |
| `rgba(196, 168, 130, 0.15)` | `rgba(155, 153, 123, 0.15)` | FAB hover bg |
| `#f9f7f4` | `#f5f5f0` | blockquote bg |

### Step 3: Update Component Inline Styles

For each component, replace hardcoded hex values with the new palette equivalents:

| Old Value | New Value | Affected Components |
|-----------|-----------|---------------------|
| `#C4A882` | `#9B997B` | ColorPicker, MaterialShowcase, ServiceProcess |
| `#8B7D6B` | `#7A7866` | ColorPicker (pagination), MaterialShowcase (specs) |
| `#6B5D4E` | `#5E5C4D` | ColorPicker, MaterialShowcase, ServiceProcess, Navbar |
| `#F5F0EB` | `#F0EFE9` | ServiceProcess (bg), ContactFAB (bg) |
| `#E8E0D6` | `#E2E1D6` | ServiceProcess (image placeholder), MaterialShowcase (border) |
| `#1A1714` | `#1A1A17` | ServiceProcess (CTA), ContactFAB (TikTok hover), ColorPicker |
| `#D4C9BC` | `#C5C4B5` | ColorPicker (disabled pagination) |
| `#A89B8C` | `#9A9888` | ColorPicker (page number text) |
| `#f0ece7` | `#eceee6` | MaterialShowcase (thumbnail bg) |
| `rgba(196,168,130,0.15)` | `rgba(155,153,123,0.15)` | ServiceProcess, ColorPicker |
| `rgba(196,168,130,0.3)` | `rgba(155,153,123,0.3)` | ColorPicker (active shadow) |
| `rgba(196, 168, 130, 0.4)` | `rgba(155, 153, 123, 0.4)` | ContactFAB (border) |

### Step 4: Update JSON Config Colors

For page configs containing hardcoded colors:
- Replace `#F5F0EB` → `#F0EFE9` (section backgrounds)
- Replace `#f7e2ce` → `#e8e9df` (nav backgrounds)
- Replace service icon colors:
  - `#FFD580` → `#D4CC8C`
  - `#A8E6CF` → `#A8C9A0`
  - `#87CEEB` → `#8CB8C4`
  - `#F8B4C8` → `#C4A8B0`

### Step 5: Verify & Test

- Visual check all pages in dev server
- Check hover states on FAB buttons
- Check scrollbar colors
- Check text selection colors
- Check blog page (should be mostly unchanged)
- Check mobile responsive views

## Key Files
- `frontend/tailwind.config.js` — color tokens (source of truth)
- `frontend/styles/globals.css` — global CSS colors
- `frontend/components/ContactFAB.js` — FAB dock
- `frontend/components/sections/ColorPicker.js` — color palette section
- `frontend/components/sections/MaterialShowcase.js` — material showcase section
- `frontend/components/sections/ServiceProcess.js` — service process section
- `frontend/components/sections/Navbar.js` — navigation
- `frontend/components/sections/WhyChooseUs.js` — why choose us section
- `frontend/components/sections/Collections.js` — collections section
- `frontend/components/sections/Featured.js` — featured section (Tailwind classes only)
- `frontend/config/pages/*.json` — page-level color configs

---
*Generated: 2026-04-06*

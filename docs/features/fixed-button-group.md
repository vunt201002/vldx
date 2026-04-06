# Fixed Contact Button Group (FAB) Improvement

## Overview

Improve the floating contact button group: remove Gmail, remove toggle button (always show 3 buttons), add responsive sizing, and upgrade visual style.

## Current State

- **Component:** `frontend/components/ContactFAB.js`
- **Rendered in:** `frontend/pages/_app.js` (globally)
- **Config:** `frontend/config/contact.json`
- 4 buttons: Phone, Zalo, Gmail, TikTok — with toggle open/close
- Fixed 48x48px buttons, no responsive sizing
- Simple flat colored circles with inline SVG icons

## Requirements

### Functional
- Remove Gmail button, keep Phone, Zalo, TikTok (3 buttons)
- Remove toggle (+) button — always show all 3 buttons
- Responsive: smaller on mobile (40px), larger on desktop (52px)

### Non-functional
- Eye-catching style upgrade
- Smooth animations
- Good performance (no heavy GPU usage)

## Style Proposals

### Option A: Glassmorphism Vertical Pill Stack
All 3 buttons in a single frosted-glass vertical pill container. Semi-transparent dark background with `backdrop-blur`, thin sandstone border, `rounded-3xl`. Each icon separated by divider lines. Subtle "breathe" scale animation. On hover, individual cell brightens. Cohesive, modern, blends with the warm earthy palette.

### Option B: Branded Gradient Circles with Glow Pulse + Hover Labels
Three separate circles with brand-color gradients:
- Phone: green gradient + green glow
- Zalo: blue gradient + blue glow  
- TikTok: cyan-to-pink gradient (official brand) + pink glow

Each has a pulsing glow shadow animation. On desktop hover, a text label slides out to the left (e.g., "Goi dien"). Labels hidden on mobile/touch. Vibrant and attention-grabbing.

### Option C: Minimal Sandstone Line-Art Dock
Single vertical dock with cream background and sandstone border, matching the site's earthy aesthetic. Icons rendered as thin line-art strokes in concrete color. On hover, icon transitions to its brand color. Elegant and on-brand, less attention-grabbing.

## Implementation Steps

1. **Edit `frontend/components/ContactFAB.js`:**
   - Remove `email` item from items array
   - Remove `useState` and `open` state
   - Remove toggle button element
   - Remove `{open && ...}` conditional
   - Replace inline sizes with Tailwind responsive classes
   - Apply chosen style (gradients, glow, hover labels, etc.)

2. **Edit `frontend/styles/globals.css`:**
   - Update/replace `@keyframes fab-pop-in` with new animations
   - Add glow-pulse, label-slide, or other needed keyframes

3. **Optionally edit `frontend/config/contact.json`:**
   - Remove `defaultOpen` field

4. **Responsive sizing:**
   - Mobile (< 640px): 40px buttons, 18px icons
   - Desktop (>= 640px): 52px buttons, 22px icons

## Key Files
- `frontend/components/ContactFAB.js` — main component
- `frontend/styles/globals.css` — animations
- `frontend/config/contact.json` — contact config
- `frontend/pages/_app.js` — where FAB is rendered

---
*Generated: 2026-04-06*

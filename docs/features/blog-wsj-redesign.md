# Blog WSJ-Style Redesign Implementation Plan

## Overview

Redesign the blog list page and blog detail page to match WSJ (Wall Street Journal) editorial style. Clean serif typography, horizontal article cards, white backgrounds, minimal decoration, and professional editorial feel. Frontend-only changes — no backend API modifications needed.

## Requirements

### Functional Requirements
- Blog list page with WSJ-style hero section (featured image + sidebar text articles)
- Horizontal article feed cards (image left, text right)
- Category labels from `tags[0]` displayed as small-caps above titles
- Teal-colored timestamps
- Blog detail page with large serif title, action bar (share, like, read time), full-width image
- "Doc tiep" (What to Read Next) section with related posts
- "Xem nhieu nhat" (Most Popular) sticky sidebar on desktop
- Share button (copy URL to clipboard)
- Read time estimation from content length
- All existing functionality preserved (SSE, pagination, tags, likes, comments, analytics)

### Non-Functional Requirements
- No new npm packages
- Responsive design (mobile-first)
- System serif font stack (Georgia, Times New Roman)
- White background throughout

## Architecture

### Components Affected
- `frontend/pages/blog/index.js` — list page JSX rewrite
- `frontend/pages/blog/[id].js` — detail page JSX rewrite + new features
- `frontend/styles/globals.css` — WSJ CSS variables + utility classes

### Data Flow (unchanged)
- `GET /api/blog?page=&limit=&tag=` → list page
- `GET /api/blog/:id` → detail page
- `GET /api/blog/events` → SSE for real-time updates
- `POST /api/blog/:id/likes` → like toggle
- `POST /api/blog/:id/comments` → add comment
- `GET /api/blog?limit=20` → related + popular posts (new call, existing endpoint)

## Implementation Steps

### 1. Add WSJ CSS Design Tokens (`globals.css`)
- CSS variables: `--wsj-serif`, `--wsj-sans`, `--wsj-teal`, `--wsj-divider`, `--wsj-text`
- Utility classes: `.wsj-category`, `.wsj-title`, `.wsj-excerpt`, `.wsj-timestamp`, `.wsj-divider`
- Update `.blog-content` for serif body text at 19px/1.85 line-height

### 2. Rewrite Blog List Page (`blog/index.js`)
- Replace VLXD logo header with centered "Tin tuc" serif heading
- Hero: `grid lg:grid-cols-5` — featured image + text below (3 cols) + text-only sidebar (2 cols)
- Feed: horizontal cards with `flex` layout — 200x130 image left, text right
- Pagination: text-only style, bold+underline for active page
- Remove: gradient overlays, hover scale effects, rounded images, gray background

### 3. Rewrite Blog Detail Page (`blog/[id].js`)
- Two-column desktop layout: `grid lg:grid-cols-[1fr_300px]`
- Left: category label → large serif title → excerpt → metadata → action bar → image → author → content → comments → "Doc tiep"
- Right: sticky "Most Popular" sidebar (top 5 by viewCount)
- Add `estimateReadTime()` helper (word count / 200 wpm)
- Add share handler (`navigator.clipboard.writeText`)
- Move like button from below content into action bar
- Fetch `GET /blog?limit=20` for related + popular posts (single API call, split client-side)

### 4. Testing & Verification
- Blog list: hero, feed, pagination, tag filtering, SSE auto-updates
- Blog detail: title, action bar, share, like, comments, related posts, popular sidebar
- Responsive: mobile/tablet/desktop layouts
- No regressions in existing functionality

## API Changes
None — all existing endpoints used as-is.

## Database Changes
None.

## Testing Strategy
- Manual testing of both pages at all breakpoints
- Verify SSE: create/edit post in admin → list page auto-updates
- Verify tag filtering, pagination, like toggle, comment submission
- Verify share button copies URL
- Verify read time displays correctly
- Verify "Most Popular" sidebar shows correct posts sorted by viewCount

## Rollout Plan
- Single deployment — both pages updated together
- No feature flags needed (purely visual redesign)
- Rollback: revert the 3 changed files

---
*Generated: 2026-04-03*

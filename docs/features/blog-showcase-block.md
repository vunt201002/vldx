# Blog Showcase Block — Implementation Plan

## Overview
A new `blog-showcase` block that displays featured/recent blog posts in a horizontal scrollable row. Shows 4 posts initially. Soft arrow buttons on each side trigger smooth continuous scrolling on hover (not click) to reveal more posts. Posts are fetched dynamically from the existing `GET /api/blog` endpoint.

## Requirements

### Functional
1. Shows 4 post cards in a horizontal row (desktop)
2. Arrow buttons at left/right edges — hover to scroll continuously, smooth and soft
3. Posts fetched dynamically from blog API (not hardcoded in block data)
4. Admin configures: overline, title, post count, tag filter, "view all" link, background color
5. Each card shows: cover image, tag pill, title, excerpt, date
6. Clicking a card navigates to the blog post

### Non-Functional
- Matches existing landing aesthetic (cream/sandstone/charcoal palette, Montserrat font)
- Skeleton loading state while fetching
- Mobile: hide arrows, enable native swipe, cards at 85% width for peek effect
- Lazy-load images beyond the first 4

## Architecture

### Data Flow
```
Admin configures block settings (overline, title, postCount, tag, bgColor)
  → Saved to DB as block.data
  → JSON mapping: settings only, no arrayBlocks (posts are dynamic)
  → BlogShowcase component renders header from settings
  → Client-side fetch: GET /api/blog?limit={postCount}&tag={tag}
  → Posts render in scrollable row
```

### Files to Change/Create

| File | Change |
|------|--------|
| `backend/src/config/blockFieldDefs.ts` | Add `blog-showcase` type (9 settings fields) |
| `backend/src/config/blockJsonMapping.ts` | Add `blog-showcase` mapping (settings only) |
| `frontend/components/sections/BlogShowcase.js` | **New** — main component (~200 lines) |
| `frontend/components/sections/registry.js` | Register `BlogShowcase` |

No API changes needed — existing `GET /api/blog?limit=N&tag=TAG` returns exactly what's needed.

## Implementation Steps

### Step 1: Backend — Block Type Definition (`blockFieldDefs.ts`)

```typescript
{
  type: 'blog-showcase',
  label: 'Blog Showcase',
  icon: '📰',
  fields: [
    { key: 'overline', label: 'Overline', type: 'text', placeholder: 'From our blog' },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'postCount', label: 'Number of Posts', type: 'number', placeholder: '8' },
    { key: 'tag', label: 'Filter by Tag', type: 'text', placeholder: 'Leave empty for latest' },
    { key: 'viewAllLabel', label: 'View All Label', type: 'text', placeholder: 'View all articles' },
    { key: 'viewAllHref', label: 'View All Link', type: 'url', placeholder: '/blog' },
    { key: 'bgColor', label: 'Background Color', type: 'text', placeholder: '#F5F0EB' },
  ],
}
```

### Step 2: Backend — JSON Mapping (`blockJsonMapping.ts`)

```typescript
'blog-showcase': {
  settingsFields: ['overline', 'title', 'description', 'postCount', 'tag', 'viewAllLabel', 'viewAllHref', 'bgColor'],
  arrayBlocks: [],
},
```

### Step 3: Frontend — BlogShowcase Component

**Post Card Design** (matching warm/cream aesthetic):
- Aspect ~3:4 portrait card
- Cover image with `object-cover`
- Bottom gradient overlay (transparent → charcoal/80)
- Tag pill at top-left (`text-sandstone` on `bg-charcoal/60`)
- Title: `font-display`, white, `line-clamp-2`
- Excerpt: `font-body`, warm-200, `line-clamp-2`
- Date: `font-body`, text-xs, warm-300
- Hover: image scales 1.05, subtle border glow

**Hover-to-Scroll Interaction**:
```
Arrow = 40px circle, bg-warm-200/80 backdrop-blur-sm, chevron SVG in text-charcoal

onMouseEnter → start requestAnimationFrame loop:
  each frame: scrollContainer.scrollLeft += direction * 3px (~180px/sec)

onMouseLeave → cancelAnimationFrame

When at scroll start: hide left arrow (opacity 0)
When at scroll end: hide right arrow (opacity 0)
```

**Mobile Behavior**:
- Detect via `matchMedia('(hover: none)')`
- Hide arrow buttons
- Enable native swipe: `overflow-x: auto`, `-webkit-overflow-scrolling: touch`
- Cards at 85% width (peek next card to invite swipe)

### Step 4: Frontend — Register Component (`registry.js`)

```javascript
import BlogShowcase from './BlogShowcase';
// in registry:
'blog-showcase': BlogShowcase,
```

## Post Card Data Shape (from existing API)

```json
{
  "_id": "...",
  "title": "Post title",
  "excerpt": "Short summary...",
  "coverImage": "https://...",
  "tags": ["tag1", "tag2"],
  "publishedAt": "2026-04-01T...",
  "viewCount": 42
}
```

## Edge Cases
- **Loading**: Show 4 skeleton shimmer cards during fetch
- **Empty**: "No articles yet" message if no posts returned
- **< 4 posts**: Show what's available, hide arrows
- **Image performance**: `loading="lazy"` on images beyond first 4

## Implementation Order
1. Backend: `blockFieldDefs.ts` + `blockJsonMapping.ts`
2. Frontend: `BlogShowcase.js` (new file)
3. Frontend: Register in `registry.js`
4. Test: Add block via admin, verify fetch + scroll + mobile

---
*Generated: 2026-04-06*

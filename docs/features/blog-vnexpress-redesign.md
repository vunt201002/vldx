# Blog VnExpress-Style Redesign Implementation Plan

## Overview

Redesign the public blog listing page (`frontend/pages/blog/index.js`) and detail page (`frontend/pages/blog/[id].js`) to match VnExpress (https://vnexpress.net/) — Vietnam's largest news portal. The current blog list is a simple card grid. The new layout will feature a hero featured zone, horizontal article feed, "Most Read" sidebar, tag navigation, and "Load more" instead of pagination.

## Requirements

### Functional
- Featured hero zone with the newest post (large image + overlay title) + 2-3 stacked side articles
- Horizontal article feed (image left, title + excerpt + meta right) — clean, no heavy cards
- "Most Read" sidebar with ranked list (top 10 by viewCount)
- Horizontal scrollable tag bar for filtering
- "Load more" button replacing traditional pagination
- Relative time formatting ("2 gio truoc", "5 ngay truoc")
- Related articles at bottom of detail page
- SSE real-time updates preserved

### Non-functional
- Mobile responsive (single column, sidebar moves below feed)
- Clean minimal design (thin borders, no heavy shadows)
- Fast page load (lightweight API payloads)

## Architecture

### Components affected
- `frontend/pages/blog/index.js` — Complete rewrite
- `frontend/pages/blog/[id].js` — Improvements (related articles, relative time, breadcrumb)
- `frontend/styles/globals.css` — New CSS classes
- `frontend/lib/formatTimeAgo.js` — New utility (relative time)
- `backend/src/controllers/blogController.ts` — Add `getMostRead` + `getTags` endpoints
- `backend/src/routes/blogRoutes.ts` — Register new routes

### Data flow
```
Blog List:
  1. fetchPosts(page=1, limit=13) → posts[0] = featured, posts[1-3] = side, rest = feed
  2. fetchMostRead() → GET /api/blog/most-read?limit=10 → sidebar
  3. fetchTags() → GET /api/blog/tags → tag bar
  4. "Xem them" → fetch next page, append to feed
  5. Tag click → reset posts, fetch with ?tag=X
  6. SSE /api/blog/events → notification or refresh

Blog Detail:
  1. GET /api/blog/:id → article
  2. GET /api/blog?tag=X&limit=4 → related articles
```

## Implementation Steps

### Step 1: Backend — "Most Read" + "Tags" Endpoints

**File: `backend/src/controllers/blogController.ts`**

Add `getMostRead`:
```
GET /blog/most-read?limit=10
→ BlogPost.find({ isPublished: true }).sort({ viewCount: -1 }).limit(10)
→ Select: _id, title, viewCount, publishedAt, coverImage
```

Add `getTags`:
```
GET /blog/tags
→ BlogPost.distinct('tags', { isPublished: true })
→ Returns string[]
```

**File: `backend/src/routes/blogRoutes.ts`**

Add before `/:id` route:
```ts
router.get('/most-read', blogController.getMostRead);
router.get('/tags', blogController.getTags);
```

**File: `backend/src/models/BlogPost.ts`**

Add index: `{ isPublished: 1, viewCount: -1 }`

### Step 2: Frontend Utility — Relative Time

**New file: `frontend/lib/formatTimeAgo.js`**

```js
export function formatTimeAgo(dateString) {
  const ms = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return 'Vua xong'
  if (minutes < 60) return `${minutes} phut truoc`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} gio truoc`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ngay truoc`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} tuan truoc`
  return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
```

### Step 3: Blog List Page Rewrite

**File: `frontend/pages/blog/index.js`**

**Layout structure (top to bottom):**

1. **Compact header** — Slim bar with "Tin tuc" title left, horizontal scrollable tag pills right
2. **Featured zone** (page 1, no tag filter only):
   - Grid: `lg:grid-cols-3`
   - Left `lg:col-span-2`: Large hero article with tall image (16:9), dark gradient overlay, white title + excerpt
   - Right `lg:col-span-1`: 3 stacked compact articles (thumbnail 120x80 + bold title)
3. **Main content + sidebar** — `lg:grid-cols-3`:
   - Left `lg:col-span-2`: Vertical feed of horizontal article cards
     - Each: image left (~200px), title (18px bold) + excerpt (14px gray) + meta (12px, relative time + views) right
     - Separated by thin bottom border, no heavy card styling
   - Right `lg:col-span-1`: Sticky sidebar
     - "Doc nhieu nhat" ranked list 1-10, top 3 with colored rank badges (red/orange/yellow)
     - Optional: tag cloud
4. **"Xem them" (Load more) button** — centered below feed, hidden when no more posts

**State model:**
- `posts` (accumulated array), `hasMore`, `cursor` (page num)
- `mostRead` (array from /most-read)
- `allTags` (array from /tags)
- `activeTag` (filter)
- Tag click resets cursor to 1 and clears posts
- "Xem them" increments cursor and appends

### Step 4: Blog Detail Page Improvements

**File: `frontend/pages/blog/[id].js`**

- Add breadcrumb: "Trang chu > Blog > [tag]"
- Use `formatTimeAgo` for dates
- Add "Bai viet lien quan" (Related articles) section before comments: fetch 4 posts with same tag, exclude current
- Make cover image full-width
- Cleaner comment styling (simple left-border instead of rounded cards)

### Step 5: CSS Additions

**File: `frontend/styles/globals.css`**

```css
/* VnExpress featured overlay */
.blog-featured-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%);
}

/* Most-read rank badges */
.blog-rank-badge { width: 28px; height: 28px; border-radius: 4px; font-size: 14px; font-weight: 700; color: white; }
.blog-rank-1 { background: #dc2626; }
.blog-rank-2 { background: #ea580c; }
.blog-rank-3 { background: #d97706; }

/* Hidden scrollbar for tag bar */
.blog-tag-bar { overflow-x: auto; scrollbar-width: none; }
.blog-tag-bar::-webkit-scrollbar { display: none; }
```

## API Changes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blog/most-read?limit=10` | Top 10 posts by viewCount |
| GET | `/blog/tags` | All distinct tags from published posts |

## Database Changes

- Add compound index `{ isPublished: 1, viewCount: -1 }` on BlogPost for efficient most-read queries

## Testing Strategy

- Verify featured zone with 0, 1, 2, 3, and 13+ posts
- Verify tag filtering resets and refetches
- Verify "Load more" appends correctly and hides when done
- Verify most-read sidebar shows correct ranking
- Verify relative time displays correctly across time ranges
- Verify SSE real-time updates still work
- Verify mobile responsive layout (single column, sidebar below)
- Verify blog detail related articles section

## Rollout Plan

- Branch: `feat/blog-vnexpress-redesign`
- Backend changes are backward-compatible (new endpoints only)
- Frontend is a visual refresh with same data
- No database migrations needed (just a new index)

---
*Generated: 2026-04-01*

# Blog Feature Implementation Plan

## Overview

Add a blog system where admins can create/edit/delete posts, and public users can read, comment, and like posts. Comments and likes work without login — anonymous users display as "Ẩn danh". Logged-in customers show their name.

## Requirements

### Functional
- Admin CRUD for blog posts (title, content, cover image, tags, publish/draft)
- Public blog listing page with pagination
- Public blog detail page with full content
- Anyone can comment (anonymous or logged-in)
- Anyone can like/unlike a post (anonymous via localStorage session, logged-in via customer ID)
- Comments show author name or "Ẩn danh" for anonymous
- Vietnamese-aware slug auto-generation from title

### Non-Functional
- Blog post content uses HTML (rich text editor in admin)
- Cover images uploaded via existing Cloudinary pipeline
- SEO: meta tags, structured data on blog pages
- **Caching**: ETag on GET responses + SSE for real-time cache invalidation (see Caching Strategy below)

## Architecture

### Data Flow

```
Admin Panel                    Backend API                    Frontend (Public)
─────────────                  ───────────                    ─────────────────
BlogPosts.jsx ──POST/PUT──→  /api/blog (requireAuth)
BlogPostDetail.jsx             blogController.ts              blog/index.js (listing)
                               BlogPost model                 blog/[slug].js (detail)
                                                              ← GET /api/blog (public)
                              /api/blog/:slug/comments        ← POST comment (optionalAuth)
                              /api/blog/:slug/likes           ← POST like (optionalAuth)
```

### Key Design Decisions

1. **Comments as subdocuments** on BlogPost (not a separate collection) — simpler queries, no cross-collection joins. Suitable for moderate comment volume.
2. **Likes tracked by customer ID or sessionId** — prevents duplicate likes. Anonymous users get a `sessionId` stored in localStorage.
3. **`optionalAuth` middleware** on comment/like routes — attaches `req.user` if token present, continues without if not.

### Caching Strategy: ETag + SSE

```
Admin publishes/edits/deletes post
  → blogController calls blogEvents.emit('blog-updated')
  → SSE endpoint pushes { event: "blog-updated" } to all connected clients (~50 bytes)
  → Frontend hears event, re-fetches via api.get() which uses existing ETag cache
  → If data changed → fresh response. If unchanged → 304 Not Modified.
```

**Components:**
- **`backend/src/events/blogEvents.ts`** — Node.js `EventEmitter` singleton. Zero dependencies.
- **`GET /api/blog/events`** — SSE endpoint. Sends `data: {"type":"blog-updated"}` when emitter fires. Auto-heartbeat every 30s to keep connection alive.
- **Backend controller** — calls `blogEvents.emit('blog-updated')` after create/update/delete/publish.
- **`sendWithEtag()`** — reused from materialController pattern on all blog GET endpoints.
- **Frontend** — `EventSource('/api/blog/events')` listener. On event, invalidates ETag cache entry and re-fetches. Auto-reconnects on disconnect.

**Why this works for our VPS:**
- Single backend container → in-process EventEmitter reaches all clients. No Redis needed.
- Memory: ~2-4 KB per connected client. 100 readers = ~400 KB.
- Bandwidth: zero until admin actually changes something, then ~50 bytes per client.
- Next.js proxy supports streaming (SSE) out of the box.
- If we scale to multiple backend instances later, swap EventEmitter for Redis pub/sub — same pattern.

## Database Changes

### New Model: `BlogPost`

```typescript
interface IBlogPost extends Document {
  title: string;
  slug: string;           // unique, auto-generated from title
  content: string;        // HTML from rich text editor
  excerpt: string;        // short summary for listing cards
  coverImage?: string;    // Cloudinary URL
  tags: string[];
  isPublished: boolean;   // default: false (draft)
  publishedAt?: Date;     // set when first published
  viewCount: number;      // default: 0
  likes: Array<{
    customer?: ObjectId;  // ref: Customer (if logged in)
    sessionId?: string;   // anonymous session ID
  }>;
  comments: Array<{
    customer?: ObjectId;  // ref: Customer (if logged in)
    name: string;         // display name ("Ẩn danh" for anonymous)
    content: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `{ slug: 1 }` — unique
- `{ isPublished: 1, publishedAt: -1 }` — listing queries
- `{ tags: 1 }` — tag filtering

## API Changes

### Admin Routes (require `requireAuth`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/blog/admin` | List all posts (including drafts) with pagination |
| POST | `/api/blog` | Create new blog post |
| PUT | `/api/blog/:id` | Update blog post |
| DELETE | `/api/blog/:id` | Delete blog post |

### Public Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/blog` | none | List published posts (paginated, filterable by tag) |
| GET | `/api/blog/:slug` | none | Get single published post by slug |
| POST | `/api/blog/:slug/comments` | `optionalAuth` | Add a comment |
| DELETE | `/api/blog/:slug/comments/:commentId` | `requireAuth` | Admin delete comment |
| POST | `/api/blog/:slug/likes` | `optionalAuth` | Toggle like |
| GET | `/api/blog/:slug/comments` | none | Get comments for a post |

### Request/Response Formats

**Create Post:**
```json
POST /api/blog
{
  "title": "Hướng dẫn chọn xi măng",
  "content": "<p>Nội dung bài viết...</p>",
  "excerpt": "Cách chọn xi măng phù hợp cho công trình",
  "coverImage": "https://res.cloudinary.com/...",
  "tags": ["xi-mang", "huong-dan"],
  "isPublished": true
}
```

**Add Comment:**
```json
POST /api/blog/:slug/comments
{
  "content": "Bài viết rất hữu ích!",
  "name": "Nguyễn Văn A"          // optional, ignored if logged in
}
```
- If `req.user` exists: uses `req.user.firstName + req.user.lastName`
- If no `req.user` and no `name`: defaults to "Ẩn danh"

**Toggle Like:**
```json
POST /api/blog/:slug/likes
{
  "sessionId": "abc-123-def"       // required for anonymous users
}
```
- If `req.user` exists: uses customer ID (ignores sessionId)
- If no `req.user`: requires `sessionId` from localStorage

## Implementation Steps

### Step 1: Backend Model + Validators + Events
**Files:** `backend/src/models/BlogPost.ts`, `backend/src/validators/index.ts`, `backend/src/events/blogEvents.ts`
- Create BlogPost Mongoose model with schema above
- Add Zod validators: `createBlogPostSchema`, `updateBlogPostSchema`, `createCommentSchema`, `toggleLikeSchema`
- Vietnamese slug generation (reuse existing `slugify` pattern from Material model)
- Create `blogEvents.ts` — EventEmitter singleton for SSE notifications

### Step 2: Backend Controller + Routes (with ETag + SSE)
**Files:** `backend/src/controllers/blogController.ts`, `backend/src/routes/blogRoutes.ts`, `backend/src/routes/index.ts`
- Controller functions: `getAll`, `getPublished`, `getBySlug`, `create`, `update`, `remove`, `addComment`, `deleteComment`, `toggleLike`, `getComments`
- `sendWithEtag()` on all public GET endpoints (listing + detail)
- SSE endpoint `GET /api/blog/events` — streams `blog-updated` events, 30s heartbeat
- Emit `blogEvents.emit('blog-updated')` in create/update/delete controllers
- Route file with admin (`requireAuth`) and public (`optionalAuth`) route groups
- Register routes in `index.ts`: `router.use('/blog', blogRoutes)`

### Step 3: Allow blog image uploads
**File:** `backend/src/controllers/uploadController.ts`
- Add `'blog'` to `ALLOWED_FOLDERS` array

### Step 4: Admin — Blog List Page
**File:** `admin/src/pages/BlogPosts.jsx`
- Table with columns: Title, Status (draft/published), Tags, Date, Actions
- Filter by status (all/published/draft)
- "New Post" button → navigates to `/blog/new`
- Follow existing `Products.jsx` pattern (inline styles, useState/useEffect)

### Step 5: Admin — Blog Detail/Edit Page
**File:** `admin/src/pages/BlogPostDetail.jsx`
- Form fields: title, slug (auto-generated, editable), excerpt, content (textarea or basic rich text), cover image upload, tags, isPublished toggle
- For content editing: use a `<textarea>` with HTML support initially (can upgrade to a rich text editor later)
- Follow existing `ProductDetail.jsx` pattern
- Comment management section: list comments with delete button

### Step 6: Admin — Register Routes + Nav
**Files:** `admin/src/App.jsx`, `admin/src/layout/AdminLayout.jsx`
- Add routes: `/blog` → `BlogPosts`, `/blog/:id` → `BlogPostDetail`
- Add nav item: `{ to: '/blog', label: 'Blog', icon: '📝' }`

### Step 7: Frontend — Blog Listing Page (with SSE cache invalidation)
**File:** `frontend/pages/blog/index.js`
- Initial fetch via `api.get('/blog')` with ETag caching
- `EventSource('/api/blog/events')` listener — on `blog-updated`, re-fetches listing
- Grid of blog cards: cover image, title, excerpt, date, tag badges
- Pagination (client-side or page-based)
- Match existing site design (Tailwind, cream/charcoal color scheme)

### Step 8: Frontend — Blog Detail Page (with SSE cache invalidation)
**File:** `frontend/pages/blog/[slug].js`
- Initial fetch via `api.get('/blog/:slug')` with ETag caching
- `EventSource('/api/blog/events')` listener — on `blog-updated`, re-fetches post
- SEO: title, description meta, Open Graph tags
- Client-side fetched sections:
  - **Like button**: shows like count, toggles on click, stores `sessionId` in localStorage for anonymous
  - **Comment section**: lists comments (name + content + date), comment form with name field (hidden if logged in)
- Uses `optionalAuth` — sends Authorization header if `getAccessToken()` returns a token

### Step 9: Frontend — Blog link in navigation
- Add "Blog" link to the site's navbar/menu so users can discover it

## Testing Strategy

### Automated API Tests

Run the test script (requires backend running on localhost:5000):

```bash
bash backend/src/scripts/testBlogApi.sh
```

Covers 22 assertions:
- Health check, admin login
- Admin CRUD: create, list, get by ID, update, delete
- Public routes: listing, tag filter, get by slug
- ETag caching: second request returns 304
- Comments: anonymous (Ẩn danh), named anonymous, get comments, admin delete
- Likes: toggle on, toggle off, reject missing sessionId
- Cleanup: delete post, verify 404

### Manual Testing (for frontend — Phase 3)
1. **Anonymous comment**: Open blog post in incognito → submit comment → verify "Ẩn danh" shows
2. **Logged-in comment**: Login → comment → verify name shows
3. **Anonymous like**: Click like → refresh → verify like persists (via localStorage sessionId)
4. **Logged-in like**: Login → like → verify dedup by customer ID
5. **SSE real-time**: Open blog listing → publish a new post from admin → verify listing updates without refresh
6. **Draft/published**: Draft post should not appear on public listing

## Rollout Plan

1. Implement backend (Steps 1-3) — commit
2. Implement admin pages (Steps 4-6) — commit
3. Implement frontend pages (Steps 7-9) — commit
4. Test end-to-end, then merge to main

## Dependencies Between Steps

```
Step 1 (Model) → Step 2 (Controller/Routes) → Step 3 (Upload folder)
                                              ↓
Step 4 (Admin List) → Step 5 (Admin Detail) → Step 6 (Admin Nav)
                                              ↓
Step 7 (Frontend List) → Step 8 (Frontend Detail) → Step 9 (Nav link)
```

Steps 4-6 (admin) and Steps 7-9 (frontend) can be done in parallel after Step 2.

---
*Generated: 2026-03-29*

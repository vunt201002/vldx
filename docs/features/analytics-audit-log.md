# Analytics & Audit Log Implementation Plan

## Overview

Add two features:
1. **Analytics** — Track page views, product views, blog views, and color selections from the storefront. Show summary dashboard, top pages/products/colors, and trends in the admin panel.
2. **Audit Log** — Record all admin actions (create, update, delete) across all entities. Show filterable log in the admin panel.

## Requirements

### Analytics — Functional
- Track page views (which pages are visited, how often)
- Track product detail views (which products are popular)
- Track blog post views (already have `viewCount`, but need time-series data)
- Track color selections in ColorPicker component (which colors customers click)
- Dashboard cards: total views today, total views this week, unique visitors
- Top pages table (most viewed pages)
- Top products table (most viewed products)
- Top colors table (most selected colors)
- Trend chart: views over last 7/30 days
- Replace existing placeholder dashboard stats with real data

### Audit Log — Functional
- Log all admin create/update/delete actions
- Track: who (admin email), what (action + entity type + entity name), when (timestamp)
- For updates: store what changed (before/after diff)
- Filterable by entity type, action type, date range, admin email
- Paginated list view in admin panel

### Non-Functional
- Analytics events are fire-and-forget (don't block page load)
- TTL index on AnalyticsEvent — auto-delete after 90 days to limit DB growth
- Audit logs kept indefinitely (no TTL)
- Analytics endpoint is public (no auth) but rate-limited
- Aggregation queries should use MongoDB indexes for performance

## Architecture

### Data Flow

```
Frontend (storefront)                    Backend                         Admin Panel
─────────────────────                    ───────                         ───────────
Page load → POST /analytics/events  →   Save AnalyticsEvent doc    →   Dashboard.jsx (summary)
Product view → POST /analytics/events                               →   Analytics.jsx (details)
Color click → POST /analytics/events
Blog view → POST /analytics/events

Admin action (CRUD)                  →   auditService.log()         →   AuditLog.jsx (table)
```

### Key Design Decisions

1. **Separate AnalyticsEvent collection** — not embedded in pages/products. Allows flexible querying, TTL cleanup, and time-series analysis.
2. **Audit log via service calls in controllers** (not middleware) — simpler to capture before/after data and entity names. Each controller calls `auditService.log()` after the action.
3. **Session-based visitor tracking** — use `sessionId` from localStorage (same as blog likes) to approximate unique visitors without requiring login.

## Database Changes

### New Model: `AnalyticsEvent`

```typescript
interface IAnalyticsEvent extends Document {
  type: 'page_view' | 'product_view' | 'blog_view' | 'color_select';
  path: string;                    // e.g. "/products/xi-mang-ha-tien"
  referenceId?: string;            // product/blog ObjectId
  referenceName?: string;          // product/blog title for display
  metadata?: Record<string, any>;  // e.g. { colorName: "Xám đậm", hex: "#555" }
  sessionId?: string;              // anonymous visitor tracking
  userAgent?: string;
  createdAt: Date;
}
```

**Indexes:**
- `{ type: 1, createdAt: -1 }` — filter by type + date range
- `{ createdAt: 1 }` — TTL index, expire after 90 days
- `{ referenceId: 1, type: 1 }` — aggregate views per entity
- `{ 'metadata.hex': 1, type: 1 }` — aggregate color selections

### New Model: `AuditLog`

```typescript
interface IAuditLog extends Document {
  adminId: string;
  adminEmail: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  entity: 'product' | 'material' | 'blog' | 'block' | 'page' | 'theme' | 'menu' | 'customer';
  entityId: string;
  entityName: string;             // human-readable: product name, blog title, etc.
  changes?: {                     // for updates: what changed
    before: Record<string, any>;
    after: Record<string, any>;
  };
  createdAt: Date;
}
```

**Indexes:**
- `{ entity: 1, createdAt: -1 }` — filter by entity type
- `{ adminEmail: 1, createdAt: -1 }` — filter by admin
- `{ createdAt: -1 }` — default sort

## API Changes

### Analytics Routes (new)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/analytics/events` | public (rate-limited) | Record a tracking event |
| GET | `/api/analytics/summary` | `requireAuth` | Dashboard summary (totals, today/week) |
| GET | `/api/analytics/top-pages` | `requireAuth` | Top viewed pages |
| GET | `/api/analytics/top-products` | `requireAuth` | Top viewed products |
| GET | `/api/analytics/top-colors` | `requireAuth` | Top selected colors |
| GET | `/api/analytics/trends` | `requireAuth` | Time-series: views per day (7d/30d) |

### Audit Log Routes (new)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/audit-log` | `requireAuth` | Paginated log with filters (entity, action, date, admin) |

### Tracking Event Request Format

```json
POST /api/analytics/events
{
  "type": "product_view",
  "path": "/products/xi-mang-ha-tien",
  "referenceId": "69c8f6c9...",
  "referenceName": "Xi măng Hà Tiên",
  "metadata": {},
  "sessionId": "abc123..."
}
```

## Implementation Steps

### Phase 1: Backend (Models + Routes + Audit Service)

#### Step 1: Create models
**Files:** `backend/src/models/AnalyticsEvent.ts`, `backend/src/models/AuditLog.ts`

#### Step 2: Create analytics controller + routes
**Files:** `backend/src/controllers/analyticsController.ts`, `backend/src/routes/analyticsRoutes.ts`
- `trackEvent` — validate and save event (fire-and-forget response)
- `getSummary` — MongoDB aggregation: total views today, this week, unique sessions
- `getTopPages` — aggregate by `path`, sort by count
- `getTopProducts` — aggregate by `referenceId` where type=product_view
- `getTopColors` — aggregate by `metadata.hex` where type=color_select
- `getTrends` — group by day, last 7/30 days

#### Step 3: Create audit log controller + routes
**Files:** `backend/src/controllers/auditLogController.ts`, `backend/src/routes/auditLogRoutes.ts`

#### Step 4: Create audit service
**File:** `backend/src/services/auditService.ts`
- `auditService.log({ adminId, adminEmail, action, entity, entityId, entityName, changes? })`
- Used by all admin controllers after CUD operations

#### Step 5: Add audit logging to existing controllers
**Files:** All admin controllers (product, material, blog, block, page, theme, menu, customer)
- Add `auditService.log()` calls after create, update, delete operations
- For updates: capture `before` state (pre-save) and `after` state (post-save)

#### Step 6: Register routes
**File:** `backend/src/routes/index.ts`
- Add `router.use('/analytics', analyticsRoutes)`
- Add `router.use('/audit-log', auditLogRoutes)`

### Phase 2: Frontend (Tracking Events)

#### Step 7: Create tracking utility
**File:** `frontend/lib/analytics.js`
- `trackEvent(type, data)` — sends POST to `/api/analytics/events`
- Fire-and-forget (no await, catch silently)
- Generates/reads `sessionId` from localStorage

#### Step 8: Add tracking calls to storefront pages
**Files:**
- `frontend/pages/[slug].js` — track `page_view` on mount
- `frontend/pages/products/[slug].js` — track `product_view` on mount
- `frontend/pages/blog/[id].js` — track `blog_view` on mount (replace/supplement existing viewCount)
- `frontend/components/sections/ColorPicker.js` — track `color_select` on click

### Phase 3: Admin Panel

#### Step 9: Replace Dashboard placeholder with real analytics
**File:** `admin/src/pages/Dashboard.jsx`
- Fetch `/analytics/summary` for stat cards
- Fetch `/analytics/top-pages` and `/analytics/top-products` for tables
- Fetch `/analytics/trends` for a simple chart (can use inline SVG or a lightweight chart lib)

#### Step 10: Create Analytics detail page
**File:** `admin/src/pages/Analytics.jsx`
- Date range picker (7d / 30d / 90d)
- Top pages table
- Top products table
- Top colors table (with hex color preview)
- Trend line chart

#### Step 11: Create Audit Log page
**File:** `admin/src/pages/AuditLog.jsx`
- Filterable table: entity type dropdown, action dropdown, date range
- Columns: Date, Admin, Action, Entity, Name, Details (expandable for changes diff)
- Pagination

#### Step 12: Register admin routes + nav items
**Files:** `admin/src/App.jsx`, `admin/src/layout/AdminLayout.jsx`
- Add Analytics and Audit Log routes and nav items

## Testing Strategy

### Manual Testing
1. **Page view tracking**: Visit storefront pages → check analytics summary shows correct counts
2. **Product view tracking**: Visit product detail → check top products table
3. **Color selection tracking**: Click colors in ColorPicker → check top colors table
4. **Blog view tracking**: Visit blog post → check blog views counted
5. **Audit log**: Create/edit/delete a product in admin → verify log entry appears
6. **Dashboard**: Check stat cards show real data, not placeholders
7. **Filters**: Filter audit log by entity type, action type, date range
8. **TTL**: Verify analytics events have 90-day TTL index

### API Test Script
- Create a test script similar to `testBlogApi.sh` that:
  - Sends multiple tracking events
  - Queries summary, top pages, trends
  - Creates/updates/deletes a product and checks audit log

## Rollout Plan

1. Phase 1 (Backend models + routes + audit service) — commit
2. Phase 2 (Frontend tracking) — commit
3. Phase 3 (Admin pages) — commit
4. Test end-to-end, then merge to main

## Dependencies Between Steps

```
Step 1 (Models) → Step 2 (Analytics routes) → Step 6 (Register)
               → Step 3 (Audit log routes)  → Step 6
               → Step 4 (Audit service)     → Step 5 (Add to controllers)

Step 2 → Step 7 (Tracking utility) → Step 8 (Add to pages)
Step 2 → Step 9 (Dashboard) → Step 10 (Analytics page)
Step 3 → Step 11 (Audit Log page) → Step 12 (Register admin routes)
```

Phase 2 and Phase 3 can run in parallel after Phase 1.

---
*Generated: 2026-03-30*

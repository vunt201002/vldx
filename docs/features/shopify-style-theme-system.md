# Shopify-Style Theme System Implementation Plan

## Overview

This plan outlines the refactor of the VLXD theme editor to adopt a Shopify-inspired architecture with global themes, reusable menus, block preview system, and unified product pages. The goal is to eliminate header/footer duplication across pages, introduce centralized menu management, enable block previewing without affecting live pages, and consolidate product pages into a single dynamic template.

## Requirements

### Functional Requirements

1. **Menu Management System**
   - Create new "Menu" tab in admin dashboard
   - CRUD operations for menus (name, label, link)
   - Menu collection in MongoDB
   - Ability to select menus in navbar block settings

2. **Block Preview System**
   - Create new "Blocks" tab in admin dashboard
   - View all available block types
   - Live preview of blocks with mock data
   - Update settings to see visual changes without affecting live pages
   - Default mock data for each block type

3. **Global Theme Architecture**
   - Introduce concept of "Theme" as container for all pages
   - Three global sections: Header, Body, Footer
   - Header and Footer shared across all pages
   - Body section varies per page
   - Block types tagged with placement: "header", "body", or "footer"

4. **Product Management System**
   - Create new "Products" tab in admin dashboard (NOTE: already exists, needs enhancement)
   - CRUD for products with fields: name, description, variants, colors
   - Products collection in MongoDB
   - Single dynamic product detail page template
   - Product listing page

5. **Unified Product Pages**
   - Replace individual product pages (tam-op-cau-thang, gach-op-lat, etc.) with single `/product/:slug` route
   - All products render using same layout
   - Menu links point to product slugs

### Non-Functional Requirements

- Backward compatibility during migration
- Performance: JSON generation should complete < 500ms
- Data integrity: Atomic operations for theme updates
- UX: No page refresh required when editing in admin
- Responsive: All new UI works on desktop/tablet/mobile

## Architecture

### New Data Models

#### 1. Menu Model (`/backend/src/models/Menu.ts`)
```typescript
{
  _id: ObjectId,
  name: string,              // Display name in admin
  handle: string,            // Unique identifier
  items: [{
    label: string,           // Display text
    url: string,             // Link destination
    order: number            // Sort order
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Theme Model (`/backend/src/models/Theme.ts`)
```typescript
{
  _id: ObjectId,
  name: string,              // "Default Theme"
  isActive: boolean,         // Only one active at a time
  header: {
    blocks: [{
      block: ObjectId,       // ref: Block
      order: number
    }]
  },
  footer: {
    blocks: [{
      block: ObjectId,
      order: number
    }]
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Enhanced Page Model
```typescript
{
  // ... existing fields ...
  themeSection: 'body',      // Always 'body' for content pages
  // blocks array remains for body content only
}
```

#### 4. Enhanced Block Model
```typescript
{
  // ... existing fields ...
  placement: 'header' | 'body' | 'footer',  // Where block can be used
  isTemplate: boolean,       // True for preview-only blocks
}
```

#### 5. Product Model (`/backend/src/models/Product.ts`)
```typescript
{
  _id: ObjectId,
  slug: string (unique),     // URL-friendly identifier
  name: string,              // Product name
  description: string,       // Rich text description
  variants: [{
    name: string,            // e.g., "Size A"
    sku: string,
    price: number
  }],
  colors: [{
    name: string,            // e.g., "Xanh lá"
    hex: string,             // e.g., "#00ff00"
    image: string            // Color swatch image URL
  }],
  images: [string],          // Product gallery images
  isPublished: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Updated Block Field Definitions

Add placement metadata to `blockFieldDefs.ts`:

```typescript
{
  type: 'navbar',
  placement: 'header',  // Can only be used in header
  // ... existing fields ...
},
{
  type: 'hero',
  placement: 'body',    // Body content only
  // ... existing fields ...
},
{
  type: 'footer',
  placement: 'footer',  // Footer only
  // ... existing fields ...
}
```

Add menu selection field to navbar:

```typescript
{
  type: 'navbar',
  fields: [
    // ... existing fields ...
    {
      key: 'menuId',
      label: 'Navigation Menu',
      type: 'select',
      options: 'menus',  // Dynamic fetch from Menu collection
      required: true
    }
  ]
}
```

### Component Architecture Changes

#### Admin Dashboard Navigation
File: `/admin/src/layout/AdminLayout.jsx`

Add new tabs:
1. Dashboard
2. **Menus** (new)
3. **Products** (enhance existing)
4. **Blocks** (new)
5. **Theme** (renamed from "Theme Editor")

#### New Admin Pages

1. **Menu Manager** (`/admin/src/pages/MenuManager.jsx`)
   - List all menus
   - Create/edit/delete menus
   - Drag-to-reorder menu items
   - Add/remove menu items

2. **Block Library** (`/admin/src/pages/BlockLibrary.jsx`)
   - Grid/list view of all block types
   - Click to open preview modal
   - Live preview iframe with mock data
   - Settings panel to modify preview
   - Reset to default mock data button

3. **Theme Editor** (refactored `/admin/src/pages/ThemeEditor.jsx`)
   - Three-section layout: Header | Body | Footer
   - Header section (global, shared)
   - Body section (page-specific, existing functionality)
   - Footer section (global, shared)
   - Visual indicator for global vs page-specific sections
   - Warning when editing global sections

4. **Product Manager** (enhance existing `/admin/src/pages/Products.jsx`)
   - List all products
   - Create/edit/delete products
   - Product form with:
     - Name, slug, description
     - Variants (name, SKU, price)
     - Colors (name, hex, image)
     - Image gallery
     - Publish status

#### Frontend Changes

1. **Product Detail Page** (`/frontend/pages/product/[slug].js`)
   - Fetch product by slug
   - Render using product template config
   - Display variants, colors, images
   - Add to cart functionality (future)

2. **Enhanced Dynamic Page** (`/frontend/pages/[slug].js`)
   - Fetch active theme (header + footer)
   - Fetch page body content
   - Merge into single config
   - Render header → body → footer

3. **Section Renderer** (update `/frontend/components/sections/SectionRenderer.js`)
   - Add visual debug mode to show section boundaries
   - Pass `isGlobal` prop to header/footer sections

### Data Flow

#### Page Rendering Flow (Frontend)
```
1. User visits /:slug
2. getServerSideProps runs:
   a. Load active theme (header + footer blocks)
   b. Load page by slug (body blocks only)
   c. Merge into unified config:
      - order: [...headerBlockIds, ...bodyBlockIds, ...footerBlockIds]
      - sections: { ...headerSections, ...bodySections, ...footerSections }
3. Return merged config to component
4. SectionRenderer renders all sections in order
```

#### Theme Editor Save Flow (Admin → Backend)
```
1. User clicks Save in Theme Editor
2. Determine what changed:
   a. Global header blocks? → Update Theme.header
   b. Global footer blocks? → Update Theme.footer
   c. Page body blocks? → Update Page.blocks
3. Send appropriate API calls:
   - PUT /api/theme (for global changes)
   - PUT /api/theme/pages/:slug (for page-specific)
4. Backend:
   a. Update MongoDB documents
   b. Regenerate all affected JSON files
   c. Return success
5. Admin refreshes preview iframe
```

#### Menu Selection Flow
```
1. Admin edits navbar block
2. Opens "Navigation Menu" dropdown
3. Dropdown populated via GET /api/menus
4. Selects menu ID
5. On save:
   a. Block.data.menuId stored
   b. JSON generation looks up menu items
   c. Frontend navbar component fetches menu by ID on render
```

#### Block Preview Flow
```
1. Admin opens Blocks tab
2. Clicks on "Hero" block type
3. Modal opens with:
   a. Preview iframe (isolated route: /preview/block/:type)
   b. Settings panel (using blockFieldDefs)
   c. Mock data loaded from defaults
4. Admin changes setting (e.g., heading text)
5. Preview updates via postMessage (similar to theme editor)
6. Changes NOT saved (preview only)
7. Admin can reset to defaults or close modal
```

## Implementation Steps

### Phase 1: Database & Backend Foundation

1. **Create Menu System**
   - [ ] Create Menu model (`/backend/src/models/Menu.ts`)
   - [ ] Create menu routes (`/backend/src/routes/menu.routes.ts`)
   - [ ] Create menu controller with CRUD operations
   - [ ] Add menu API endpoints:
     - `GET /api/menus` - List all menus
     - `POST /api/menus` - Create menu
     - `GET /api/menus/:id` - Get menu by ID
     - `PUT /api/menus/:id` - Update menu
     - `DELETE /api/menus/:id` - Delete menu
   - [ ] Seed default main navigation menu

2. **Create Theme Model**
   - [ ] Create Theme model (`/backend/src/models/Theme.ts`)
   - [ ] Create theme routes (`/backend/src/routes/theme.routes.ts`)
   - [ ] Create theme controller
   - [ ] Add theme API endpoints:
     - `GET /api/theme` - Get active theme
     - `PUT /api/theme/header` - Update header blocks
     - `PUT /api/theme/footer` - Update footer blocks
   - [ ] Migration script: Extract header/footer from landing.json into default theme

3. **Create Product Model**
   - [ ] Create Product model (`/backend/src/models/Product.ts`)
   - [ ] Create product routes (`/backend/src/routes/product.routes.ts`)
   - [ ] Create product controller with CRUD
   - [ ] Add product API endpoints:
     - `GET /api/products` - List products
     - `POST /api/products` - Create product
     - `GET /api/products/:slug` - Get by slug
     - `PUT /api/products/:id` - Update product
     - `DELETE /api/products/:id` - Delete product
   - [ ] Migration script: Convert tam-op-cau-thang, gach-op-lat, etc. to product records

4. **Update Block Model**
   - [ ] Add `placement` field to Block model (enum: header/body/footer)
   - [ ] Add `isTemplate` field for preview-only blocks
   - [ ] Update block creation to require placement
   - [ ] Create default template blocks for each type

5. **Update Page Model**
   - [ ] Ensure pages only store body blocks
   - [ ] Add migration to remove header/footer blocks from existing pages

6. **Update JSON Generation**
   - [ ] Modify `generatePageJson.ts` to merge theme + page data
   - [ ] Update to fetch active theme (header + footer)
   - [ ] Update to combine theme sections with page body
   - [ ] Ensure correct section ordering (header → body → footer)

### Phase 2: Admin UI - Menu Manager

7. **Create Menu Manager Page**
   - [ ] Create `/admin/src/pages/MenuManager.jsx`
   - [ ] Menu list view with create/delete actions
   - [ ] Menu detail editor with:
     - Menu name field
     - Menu handle (auto-generated from name)
     - Menu items list (draggable)
     - Add item button
     - Item editor (label, URL, order)
   - [ ] API integration for CRUD operations
   - [ ] Validation (unique handles, valid URLs)

8. **Update Admin Navigation**
   - [ ] Add "Menus" tab to `AdminLayout.jsx`
   - [ ] Add menu icon and route
   - [ ] Update active state detection

### Phase 3: Admin UI - Product Manager

9. **Enhance Product Manager**
   - [ ] Update existing `/admin/src/pages/Products.jsx`
   - [ ] Product list view with search/filter
   - [ ] Create product form:
     - Name, slug (auto-generated), description
     - Variants section (add/remove variants)
     - Colors section (color picker + image upload)
     - Image gallery (multiple images)
     - Publish toggle
   - [ ] Product detail page (`/admin/src/pages/ProductDetail.jsx`)
   - [ ] API integration
   - [ ] Image upload handling
   - [ ] Validation (unique slugs, required fields)

### Phase 4: Admin UI - Block Library

10. **Create Block Library Page**
    - [ ] Create `/admin/src/pages/BlockLibrary.jsx`
    - [ ] Grid view of all block types (from blockFieldDefs)
    - [ ] Block type card (icon, name, description)
    - [ ] Click to open preview modal

11. **Create Block Preview System**
    - [ ] Create preview modal component
    - [ ] Create isolated preview route in frontend (`/preview/block/:type`)
    - [ ] Load default mock data for each block type
    - [ ] Settings panel (reuse BlockEditorPanel component)
    - [ ] Live preview updates via postMessage
    - [ ] Reset to defaults button
    - [ ] Close without saving

12. **Define Mock Data**
    - [ ] Create `/backend/src/config/blockMockData.ts`
    - [ ] Define default data for each block type
    - [ ] Ensure mock data showcases all features
    - [ ] Add mock menu data for navbar previews

### Phase 5: Admin UI - Theme Editor Refactor

13. **Refactor Theme Editor Layout**
    - [ ] Update `/admin/src/pages/ThemeEditor.jsx`
    - [ ] Three-section accordion/tab layout:
      - Header (global)
      - Body (page-specific)
      - Footer (global)
    - [ ] Visual indicators for global vs local sections
    - [ ] Warning dialog when editing global sections

14. **Update Theme Editor Sidebar**
    - [ ] Update `ThemeEditorSidebar.jsx`
    - [ ] Add section switcher (Header/Body/Footer)
    - [ ] Filter block list by active section
    - [ ] Show global lock icon on header/footer
    - [ ] Update "Add Section" to respect placement constraints

15. **Update Save Logic**
    - [ ] Detect which section was modified
    - [ ] Route to correct API endpoint:
      - Header → `PUT /api/theme/header`
      - Footer → `PUT /api/theme/footer`
      - Body → `PUT /api/theme/pages/:slug`
    - [ ] Handle concurrent edits (optimistic locking)
    - [ ] Success/error notifications

16. **Update Menu Integration**
    - [ ] Add menu selector field to navbar block settings
    - [ ] Fetch menu list from API
    - [ ] Populate dropdown dynamically
    - [ ] Update navbar preview when menu changes

### Phase 6: Frontend Updates

17. **Create Product Detail Page**
    - [ ] Create `/frontend/pages/product/[slug].js`
    - [ ] Fetch product by slug (SSR via getServerSideProps)
    - [ ] Create product template component (`/frontend/components/ProductDetail.js`)
    - [ ] Display:
      - Product name, description
      - Image gallery (with zoom/lightbox)
      - Variant selector
      - Color swatches
      - Price display
      - Add to cart button (placeholder)

18. **Update Dynamic Page Loader**
    - [ ] Update `/frontend/pages/[slug].js`
    - [ ] Fetch active theme in getServerSideProps
    - [ ] Merge theme header + page body + theme footer
    - [ ] Pass merged config to renderer
    - [ ] Add error handling for missing pages/theme

19. **Create Preview Routes**
    - [ ] Create `/frontend/pages/preview/block/[type].js`
    - [ ] Accept mock data via query params or postMessage
    - [ ] Render single block in isolation
    - [ ] Apply minimal styling (reset.css only)

20. **Update Navbar Component**
    - [ ] Update `/frontend/components/sections/Navbar.js`
    - [ ] Fetch menu by ID if menuId provided
    - [ ] Fallback to inline links if no menuId
    - [ ] Cache menu data (React Query or SWR)

### Phase 7: Data Migration

21. **Create Migration Scripts**
    - [ ] Script 1: Extract header/footer from existing pages
      - Find first navbar block across all pages
      - Find first footer block across all pages
      - Create default Theme document with these blocks
      - Remove header/footer blocks from all pages
    - [ ] Script 2: Create default main menu
      - Extract nav links from landing navbar
      - Create Menu document with these items
      - Update navbar block to reference menu
    - [ ] Script 3: Convert product pages to Product documents
      - Create products from tam-op-cau-thang.json
      - Create products from gach-op-lat.json
      - Create products from ban.json
      - Create products from ghe-da-cong-vien.json
      - Mark old pages as archived (don't delete yet)

22. **Run Migrations**
    - [ ] Backup MongoDB database
    - [ ] Backup frontend/config/pages/*.json files
    - [ ] Run migration scripts in order
    - [ ] Verify data integrity
    - [ ] Regenerate all JSON files
    - [ ] Test frontend rendering

### Phase 8: Testing & Polish

23. **Testing**
    - [ ] Manual testing of all CRUD operations
    - [ ] Test theme editor with header/body/footer sections
    - [ ] Test menu selection in navbar
    - [ ] Test block preview system
    - [ ] Test product pages rendering
    - [ ] Test responsive design on all new pages
    - [ ] Test live preview updates
    - [ ] Test data integrity after saves

24. **Bug Fixes & Edge Cases**
    - [ ] Handle missing menus gracefully
    - [ ] Handle missing theme gracefully
    - [ ] Handle invalid product slugs
    - [ ] Validate menu URLs
    - [ ] Prevent deleting active theme
    - [ ] Prevent deleting menus in use

25. **Documentation**
    - [ ] Update README with new architecture
    - [ ] Document menu system usage
    - [ ] Document block preview workflow
    - [ ] Document product management
    - [ ] Document theme vs page sections
    - [ ] Create admin user guide

### Phase 9: Cleanup & Optimization

26. **Code Cleanup**
    - [ ] Remove deprecated code
    - [ ] Archive old product page configs
    - [ ] Clean up unused block types
    - [ ] Refactor duplicated code

27. **Performance Optimization**
    - [ ] Add database indexes:
      - Menu.handle (unique)
      - Product.slug (unique)
      - Theme.isActive
    - [ ] Optimize JSON generation (batch operations)
    - [ ] Add caching for menu/theme API responses
    - [ ] Lazy load block preview modals

## API Changes

### New Endpoints

#### Menus
- `GET /api/menus` - List all menus
- `POST /api/menus` - Create menu (body: { name, items })
- `GET /api/menus/:id` - Get menu by ID
- `PUT /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Delete menu

#### Theme
- `GET /api/theme` - Get active theme with populated blocks
- `PUT /api/theme/header` - Update header blocks (body: { blocks: [...] })
- `PUT /api/theme/footer` - Update footer blocks (body: { blocks: [...] })
- `POST /api/theme/header/blocks` - Add block to header
- `DELETE /api/theme/header/blocks/:blockId` - Remove block from header
- (Similar endpoints for footer)

#### Products
- `GET /api/products` - List products (query: ?published=true)
- `POST /api/products` - Create product
- `GET /api/products/:slug` - Get product by slug
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/images` - Upload product image

#### Block Previews
- `GET /api/blocks/templates` - Get all template blocks with mock data
- `GET /api/blocks/templates/:type` - Get mock data for specific block type

### Modified Endpoints

#### Pages
- `GET /api/theme/pages/:slug` - Now returns ONLY body blocks (header/footer in theme)
- `PUT /api/theme/pages/:slug` - Now updates ONLY body blocks

## Database Changes

### New Collections

1. **menus**
   - Indexes: `handle` (unique)
   - Validation: handle format (lowercase, hyphens only)

2. **themes**
   - Indexes: `isActive` (only one true at a time)
   - Pre-save hook: Ensure only one active theme

3. **products**
   - Indexes: `slug` (unique), `isPublished`
   - Validation: slug format, required fields

### Modified Collections

1. **blocks**
   - Add field: `placement` (enum, required)
   - Add field: `isTemplate` (boolean, default false)
   - Add index: `placement`, `isTemplate`

2. **pages**
   - Add field: `themeSection` (default "body")
   - Ensure blocks array only contains body blocks

### Migration Scripts

Create migration files in `/backend/src/migrations/`:

1. `001-create-default-theme.ts`
2. `002-create-default-menu.ts`
3. `003-migrate-products.ts`
4. `004-update-block-placements.ts`

## Testing Strategy

### Unit Tests

1. **Backend Models**
   - Menu validation (unique handles, valid URLs)
   - Theme validation (only one active)
   - Product validation (unique slugs)
   - Block placement enforcement

2. **Backend Controllers**
   - Menu CRUD operations
   - Theme update operations
   - Product CRUD operations
   - JSON generation with merged theme

3. **Frontend Components**
   - Menu manager component
   - Block library component
   - Product form component
   - Theme editor section switcher

### Integration Tests

1. **API Endpoints**
   - Menu API full CRUD cycle
   - Theme header/footer updates
   - Product API full CRUD cycle
   - Page rendering with merged theme

2. **Data Flow**
   - Theme save → JSON generation → frontend render
   - Menu creation → navbar selection → frontend render
   - Product creation → product page render

### Manual Testing

1. **Theme Editor Workflow**
   - Create new page
   - Edit header (verify changes across all pages)
   - Edit body (verify changes only on current page)
   - Edit footer (verify changes across all pages)
   - Save and verify preview updates

2. **Menu Management**
   - Create menu with multiple items
   - Reorder menu items
   - Select menu in navbar block
   - Verify menu renders on frontend

3. **Block Preview**
   - Open preview for each block type
   - Modify settings and see live updates
   - Reset to defaults
   - Verify no changes saved to actual blocks

4. **Product Management**
   - Create product with variants and colors
   - Upload images
   - View product page on frontend
   - Update product details
   - Delete product

### Performance Testing

1. **JSON Generation**
   - Measure time to generate page JSON with theme
   - Target: < 500ms for pages with 20+ blocks

2. **Admin Preview**
   - Measure preview update latency
   - Target: < 100ms for setting changes

3. **Frontend Rendering**
   - Measure SSR time for merged theme + page
   - Target: < 1s server response time

## Rollout Plan

### Pre-Rollout

1. **Database Backup**
   - Full MongoDB export
   - Backup frontend/config/pages/ directory
   - Tag current codebase in git

2. **Feature Branch**
   - Create `feat/shopify-theme-system` branch
   - Develop all changes in isolation
   - Code review before merge

### Rollout Stages

#### Stage 1: Backend Infrastructure (Low Risk)
- Deploy new models (Menu, Theme, Product)
- Deploy new API endpoints
- No frontend changes yet
- Rollback: Remove new endpoints, drop collections

#### Stage 2: Admin Dashboard (Medium Risk)
- Deploy menu manager
- Deploy product manager
- Deploy block library
- Old theme editor still works
- Rollback: Revert admin build

#### Stage 3: Theme Editor Refactor (High Risk)
- Deploy new theme editor with sections
- Run migration scripts (after hours)
- Regenerate all JSON files
- Verify all pages render correctly
- Rollback: Restore JSON backups, revert theme editor

#### Stage 4: Frontend Updates (Critical)
- Deploy product detail page
- Deploy merged theme rendering
- Monitor error rates
- Rollback: Revert frontend build, restore JSON

### Monitoring

1. **Error Tracking**
   - Log all API errors
   - Track 404s on product pages
   - Monitor JSON generation failures

2. **Performance Metrics**
   - API response times
   - Page load times
   - Database query performance

3. **User Feedback**
   - Admin user testing sessions
   - Bug reports via GitHub issues

### Rollback Strategy

Each stage has independent rollback:
- **Stage 1-2:** Code revert only
- **Stage 3:** Code revert + JSON restore + MongoDB restore
- **Stage 4:** Code revert + clear CDN cache

Critical data preserved:
- Pre-migration JSON files backed up
- MongoDB dump before migrations
- Git tags for each deployment stage

## Dependencies

### External Dependencies
- No new npm packages required (use existing React, Next.js, Express, Mongoose)

### Internal Dependencies
- Menu system must exist before navbar menu selection
- Theme model must exist before theme editor refactor
- Product model must exist before product pages
- Migration scripts must run before frontend deployment

### Critical Path
1. Backend models → API endpoints → Admin UI → Frontend
2. Cannot deploy theme editor refactor without Theme model
3. Cannot deploy product pages without Product model
4. Cannot use menu selection without Menu collection

## Risks & Mitigation

### Risk 1: Data Loss During Migration
- **Mitigation:** Comprehensive backups, dry-run migrations, manual verification

### Risk 2: Breaking Existing Pages
- **Mitigation:** Backward-compatible JSON structure, gradual rollout, extensive testing

### Risk 3: Theme Conflicts (Multiple Editors)
- **Mitigation:** Optimistic locking, last-write-wins with warnings, activity indicators

### Risk 4: Performance Degradation
- **Mitigation:** Database indexes, query optimization, caching, load testing

### Risk 5: Menu Deletion Breaks Navbars
- **Mitigation:** Prevent deletion if menu in use, cascade warnings, default fallback menu

## Future Enhancements

(Out of scope for initial implementation)

1. **Multi-Theme Support**
   - Create multiple themes
   - Switch active theme without data loss
   - Preview themes before activation

2. **Block Versioning**
   - Track history of block changes
   - Rollback to previous versions
   - Compare versions side-by-side

3. **Theme Templates**
   - Pre-built theme templates
   - One-click theme installation
   - Export/import themes

4. **Advanced Product Features**
   - Product categories/tags
   - Related products
   - Product reviews
   - Inventory management

5. **Menu Enhancements**
   - Nested menu items (dropdowns)
   - Mega menus with images
   - Conditional menu visibility

6. **Block Marketplace**
   - Community-contributed blocks
   - Block plugins system
   - Third-party integrations

## Success Criteria

1. **Functionality**
   - All menus CRUD operations work
   - All products CRUD operations work
   - Block previews render correctly
   - Header/footer changes apply globally
   - Body changes apply per-page only
   - Product pages render dynamically

2. **Performance**
   - JSON generation < 500ms
   - Preview updates < 100ms
   - Page SSR < 1s

3. **UX**
   - Admin can create menu in < 2 minutes
   - Admin can preview block in < 30 seconds
   - Admin understands global vs local sections
   - No unexpected data loss reported

4. **Data Integrity**
   - All existing pages render correctly
   - No orphaned blocks in database
   - No 404s on frontend
   - All images load correctly

---

*Generated: 2026-03-26*

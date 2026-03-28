# Backend Skill

## Overview

The API server is an Express.js application written in **TypeScript**, using Mongoose for MongoDB access.

## Architecture

```
backend/
  src/
    index.ts          # Entry point: load config → create app → middleware → routes → connect DB → start
    config/
      env.ts          # Centralized environment config (single source of truth)
      database.ts     # MongoDB connection via Mongoose
    middleware/
      errorHandler.ts # Global error handler (must be last middleware)
    models/           # Mongoose schemas and models
    controllers/      # Route handler logic
    routes/
      index.ts        # Route registration
```

## Key Patterns

### Centralized Config
All environment variables are accessed through `config/env.ts`. Never use `process.env` directly in routes, controllers, or models.

```typescript
// config/env.ts exports a typed config object
import { env } from '../config/env';
const port = env.PORT; // not process.env.PORT
```

### Global Error Handler
A middleware at the end of the middleware chain catches all errors and returns consistent JSON responses. Uses an `AppError` interface extending `Error` with optional `statusCode`. Development mode includes stack traces.

### Startup Sequence
1. Load environment config
2. Create Express app
3. Apply middleware (cors, json parser)
4. Mount routes
5. Connect to MongoDB
6. Start HTTP server

## Current API Endpoints

### Materials
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/materials` | List materials (supports `limit`, `page`, `category`, `inStock` query params) |
| GET | `/api/materials/:id` | Get single material by MongoDB ID |
| POST | `/api/materials` | Create material |
| PUT | `/api/materials/:id` | Update material |
| DELETE | `/api/materials/:id` | Delete material |

### Theme Editor (`/api/theme/`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/theme/field-defs` | Return block field definitions for the admin editor |
| GET | `/api/theme/pages` | List all pages (slug, title, block count) |
| POST | `/api/theme/pages` | Create page — clones blocks from `landing` template, auto-updates navbar links |
| DELETE | `/api/theme/pages/:slug` | Delete page + its JSON file |
| GET | `/api/theme/pages/:slug` | Load page + blocks for editor |
| PUT | `/api/theme/pages/:slug` | Save page + blocks → regenerates `{slug}.json` |
| POST | `/api/theme/pages/:slug/blocks` | Add new empty block to page |
| DELETE | `/api/theme/pages/:slug/blocks/:blockId` | Delete block |
| POST | `/api/theme/pages/:slug/blocks/clone` | Clone a block from another page (`{ sourceBlockId }`) |

### Image Upload
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/upload/image` | Upload image to Cloudinary; `?uploadFolder=pages\|products` |

## Environment Variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vlxd
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_CONFIG_DIR=../frontend/config/pages
```

## Build & Run

- **Dev**: `ts-node-dev` with hot reload (no compilation step)
- **Build**: `tsc` compiles to `dist/`
- **Production**: `node dist/index.js`

## Theme Editor Architecture

The backend owns the full lifecycle of page content for the theme editor:

```
DB (Page + Block models)
  → generatePageJson()     # transforms DB data → {slug}.json format
  → writePageJson()        # writes to frontend/config/pages/{slug}.json
  → sectionToBlockData()   # reverse: JSON payload → DB block.data format
```

### Config files
- `config/blockFieldDefs.ts` — field schema per block type; served to admin via `GET /api/theme/field-defs`
- `config/blockJsonMapping.ts` — controls how `block.data` ↔ `section.settings + blocks[]`

### Mapping structure (blockJsonMapping)
```typescript
{
  settingsFields: string[];         // scalar keys → section.settings
  arrayBlocks: { dataKey, blockType }[];  // arrays → section.blocks[]
  settingsArrayFields?: string[];   // arrays that stay in settings (not converted to blocks)
  flattenFields?: { dataKey, prefix, subKeys }[]; // nested objects flattened to prefixed keys
}
```

### Page JSON Sync (syncPageJsons.ts)
- Runs once on startup + scheduled daily at 3:30 AM via `node-cron`
- Regenerates all `{slug}.json` files from MongoDB to keep them in sync
- MongoDB is the source of truth; JSON files are derived artifacts

### Adding a new block type
1. Add field schema to `config/blockFieldDefs.ts`
2. Add mapping entry to `config/blockJsonMapping.ts`
3. Add the section component to frontend registry (see Frontend Skill)

## Dependencies

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ORM |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable loading |
| cloudinary | Image upload (Cloudinary SDK) |
| multer | Multipart form parsing for image uploads |
| node-cron | Scheduled daily JSON sync |

## Model Patterns

### pre('save') hooks don't work with `required` + `Model.create()`
If a field is `required: true` in the schema AND you have a `pre('save')` hook to auto-generate it, `Model.create()` will fail because validators run *before* the hook. **Always generate the value in the controller** before calling `create()`:

```typescript
// WRONG — pre('save') sets handle, but required validation fires first
// Error: "Menu validation failed: handle: Path `handle` is required"
menuSchema.pre('save', function(next) {
  if (!this.handle) this.handle = slugify(this.name);
  next();
});
await Menu.create({ name: 'Foo' }); // handle is undefined → fails validation

// CORRECT — generate in controller before create
const finalHandle = handle || slugify(name);
await Menu.create({ name, handle: finalHandle });
```

### Auto-slug generation
The `Material` model auto-generates a `slug` from `name` on `pre('save')`. For Vietnamese product names, strip diacritics before slugifying:

```typescript
MaterialSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip diacritics
      .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});
```

### Vietnamese product categories
Standard category slugs used in the Material model:
`xi-mang`, `gach`, `cat-son`, `thep`, `da`, `cat`, `ong-nuoc`, `vat-lieu-khac`

### CRUD controller pattern
Controllers follow: validate params → query with filters → paginate → return JSON.
Pagination uses `limit` (default 20) and `page` (default 1) query params.

### Block save: use `findByIdAndUpdate` + `$set` — never `.save()`
When updating existing blocks in bulk (theme editor save), always use `findByIdAndUpdate` with `$set`. Do **not** use `findById` + `.save()`.

```typescript
// CORRECT — bypasses Mongoose schema validators, works with empty data {}
const updateFields: Record<string, any> = {
  name: b.name,
  data: b.data ?? {},
};
if (b.settings !== undefined) {
  updateFields.settings = b.settings;
}
await Block.findByIdAndUpdate(b._id, { $set: updateFields });

// WRONG — Mongoose 8.x required validator on Mixed type rejects {} during .save()
// Error: "Block validation failed: data: Path `data` is required"
blockDoc.data = b.data ?? {};
blockDoc.markModified('data');
await blockDoc.save();
```

**Why**: `Schema.Types.Mixed` with `required: true` in Mongoose 8.x fails validation during `.save()` when the field was previously `null` or missing in the document and is being set to `{}`. `findByIdAndUpdate` + `$set` writes directly to MongoDB and bypasses the validator entirely.

### Seed script pattern (`backend/src/scripts/`)
Use this to insert or update pages + blocks without going through the theme editor UI.

```typescript
// 1. Define block data as plain arrays
const pageBlocks = [
  { type: 'navbar', name: 'Navigation', data: navbarData },
  { type: 'hero',   name: 'Hero',       data: heroData   },
];

// 2. Connect, insert blocks, create page, generate JSON
await mongoose.connect(config.mongodbUri);
const createdBlocks = await Block.insertMany(pageBlocks);
const page = await Page.create({
  slug, title, description, bodyClass,
  blocks: createdBlocks.map((b, i) => ({ block: b._id, order: i })),
  isPublished: true,
});
const populated = await Page.findById(page._id).populate('blocks.block').lean();
const json = generatePageJson(populated as any);
writePageJson(slug, json);
await mongoose.disconnect();
```

Key points:
- Skip the page if it already exists (`Page.findOne({ slug })`) to make scripts idempotent
- Always call `generatePageJson` + `writePageJson` at the end to keep the JSON file in sync
- Shared blocks (navbar, footer) can be defined once and reused across multiple page definitions

#### Non-destructive patch scripts
When backfilling missing data on existing documents (post-migration, post-merge), only write fields that are empty or missing — never overwrite valid data:

```typescript
// Non-destructive: only patch if the array is empty/missing
const block = await Block.findById(id);
const isEmpty = (v: any) => !v || (Array.isArray(v) && v.length === 0);

if (isEmpty(block.data?.products)) {
  await Block.findByIdAndUpdate(id, { $set: { 'data.products': seedProducts } });
  console.log('Patched products');
} else {
  console.log(`products OK (${block.data.products.length} items) — skipped`);
}
```

This makes patch scripts safe to re-run and reveals exactly which fields were already correct.

#### Patching nested fields with dot-notation `$set`
To update a single sub-field inside `data` without overwriting its siblings, use a dot-notation key in `$set`:

```typescript
// Patches only data.products — data.stats, data.title, etc. are untouched
await Block.findByIdAndUpdate(id, { $set: { 'data.products': seedProducts } });

// Compare: this would REPLACE the entire data object, wiping other fields
await Block.findByIdAndUpdate(id, { $set: { data: { products: seedProducts } } }); // WRONG
```

Use this whenever you want to backfill or patch a specific nested array/field in isolation.

#### Batch page regeneration in patch scripts
When a patch script touches blocks across multiple pages, collect affected slugs first, then regenerate each page's JSON once at the end — avoids redundant regenerations if multiple blocks belong to the same page:

```typescript
const pagesToRegenerate = new Set<string>();

for (const entry of blocksToCheck) {
  // ... patch logic ...
  pagesToRegenerate.add(entry.pageSlug);
}

// Regenerate each affected page exactly once
for (const slug of pagesToRegenerate) {
  const page = await Page.findOne({ slug }).populate('blocks.block').lean();
  if (page) {
    const json = generatePageJson(page as any);
    writePageJson(slug, json);
    console.log(`Regenerated ${slug}.json`);
  }
}
```

### Cross-collection data resolution in API responses
When a block references another collection by handle/slug (e.g., navbar's `menuHandle` → Menu collection), resolve the reference in the API controller before sending to the frontend:

```typescript
// In getActiveTheme: resolve menuHandle → menu items
if (b.block.type === 'navbar' && b.block.data?.menuHandle) {
  const menu = await Menu.findOne({ handle: b.block.data.menuHandle }).lean();
  if (menu) {
    blockData.menuItems = menu.items.map(item => ({ label: item.label, url: item.url }));
  }
}
```

The frontend then merges extra fields into settings via `transformPageConfig.js` (`if (block.menuItems) settings.menuItems = block.menuItems`).

### Migration scripts for data model changes
When changing how blocks store data (e.g., replacing inline arrays with collection references), write an idempotent migration script:

1. Check if target already exists (skip if so)
2. Read old data from blocks
3. Create new collection documents
4. Update blocks with `$set` (new field) + `$unset` (old field)
5. Regenerate all page JSONs

```typescript
// Idempotent: skip if already migrated
const existing = await Menu.findOne({ handle: MENU_HANDLE });
if (existing) { console.log('Already exists — skipping'); }
else { /* create from old data */ }

// Atomic update: set new field, remove old one
await Block.updateMany(
  { type: 'navbar' },
  { $set: { 'data.menuHandle': MENU_HANDLE }, $unset: { 'data.links': '' } }
);
```

## Conventions

1. **TypeScript** — all backend code is typed
2. **Centralized config** — never use `process.env` directly
3. **Error handler middleware** — always the last middleware registered
4. **CORS** — restricted to `FRONTEND_URL` in production

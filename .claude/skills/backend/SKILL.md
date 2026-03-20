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

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/materials` | List materials (supports `limit`, `page`, `category`, `inStock` query params) |
| GET | `/api/materials/:id` | Get single material by MongoDB ID |
| POST | `/api/materials` | Create material |
| PUT | `/api/materials/:id` | Update material |
| DELETE | `/api/materials/:id` | Delete material |

## Environment Variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vlxd
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

## Build & Run

- **Dev**: `ts-node-dev` with hot reload (no compilation step)
- **Build**: `tsc` compiles to `dist/`
- **Production**: `node dist/index.js`

## Dependencies

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ORM |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable loading |

## Model Patterns

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

## Conventions

1. **TypeScript** — all backend code is typed
2. **Centralized config** — never use `process.env` directly
3. **Error handler middleware** — always the last middleware registered
4. **CORS** — restricted to `FRONTEND_URL` in production

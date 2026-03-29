# Security Hardening Implementation Plan

## Overview
Harden the Express.js backend against common web security vulnerabilities. The app is currently deployed to production with no authentication on write endpoints, open CORS, no security headers, and a hardcoded JWT fallback. This plan addresses issues found during a security audit, prioritized by severity.

## Requirements

### Functional
- Admin write endpoints (create, update, delete) must require authentication
- Public read endpoints (storefront pages, products) remain open
- CORS must restrict origins to known frontends in production
- File uploads must validate both MIME type and extension
- Environment validation must fail fast on missing critical config

### Non-functional
- No breaking changes to the admin frontend (add auth header support)
- Local dev must still work without auth (optional middleware bypass)
- Zero downtime deployment

## Architecture

### Components affected
- `backend/src/index.ts` — middleware stack
- `backend/src/config/env.ts` — env validation
- `backend/src/middleware/` — new auth middleware, improved error handler
- `backend/src/routes/` — apply auth middleware to write routes
- `admin/src/lib/api.js` — send auth token with requests

### Data flow (auth)
```
Admin login → POST /api/auth/login → JWT token
Admin stores token in localStorage
Admin API calls → Authorization: Bearer <token> → auth middleware → controller
```

### New dependencies
- `helmet` — security headers
- `zod` — input validation (future phase)

## Implementation Steps

### Phase 1: Quick Wins (no breaking changes)

#### Step 1.1: Add Helmet security headers
**File**: `backend/src/index.ts`
```typescript
import helmet from 'helmet';
app.use(helmet());
```
**Risk**: Low. Adds standard security headers.

#### Step 1.2: Restrict CORS in production
**File**: `backend/src/index.ts`
```typescript
app.use(cors({
  origin: config.nodeEnv === 'production'
    ? [config.frontendUrl, config.adminUrl].filter(Boolean)
    : true,
  credentials: true,
}));
```
**Risk**: Low. Only restricts in production mode.

#### Step 1.3: Add request body size limits
**File**: `backend/src/index.ts`
```typescript
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```
**Risk**: None.

#### Step 1.4: Remove hardcoded JWT fallback
**File**: `backend/src/config/env.ts`
```typescript
jwtSecret: process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  return 'dev_fallback_not_for_production';
})(),
```
**Risk**: Low. Only affects production if JWT_SECRET is missing (which it shouldn't be).

#### Step 1.5: Validate required env vars on startup
**File**: `backend/src/config/env.ts`
Add validation that `MONGODB_URI` exists. Warn if `CLOUDINARY_*` keys are empty.

#### Step 1.6: Sanitize error messages in production
**File**: `backend/src/middleware/errorHandler.ts`
Never send `err.message` directly to client in production. Use generic "Internal server error" instead.

#### Step 1.7: Improve file upload validation
**File**: `backend/src/routes/uploadRoutes.ts`
Add file extension whitelist (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`) in addition to MIME check.

### Phase 2: Authentication (breaking change for admin)

#### Step 2.1: Create Admin User model
**File**: `backend/src/models/AdminUser.ts`
```typescript
{
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
}
```
Use `bcrypt` for password hashing.

#### Step 2.2: Create auth controller
**File**: `backend/src/controllers/authController.ts`
- `POST /api/auth/login` — validate email/password, return JWT
- `GET /api/auth/me` — return current user from token

#### Step 2.3: Create auth middleware
**File**: `backend/src/middleware/auth.ts`
```typescript
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

#### Step 2.4: Apply auth to write routes
**Files**: All route files
```typescript
// Public (no auth)
router.get('/products', getAllProducts);
router.get('/products/:id', getProduct);
router.get('/theme/active', getActiveTheme);

// Protected (require auth)
router.post('/products', requireAuth, createProduct);
router.put('/products/:id', requireAuth, updateProduct);
router.delete('/products/:id', requireAuth, deleteProduct);
router.post('/theme/pages', requireAuth, createPage);
// ... all write operations
```

#### Step 2.5: Update admin frontend
**File**: `admin/src/lib/api.js`
- Add token storage (localStorage)
- Add `Authorization` header to all requests
- Add login page component
- Add auth context/hook
- Redirect to login if 401 received

#### Step 2.6: Create seed script for first admin user
**File**: `backend/src/scripts/seedAdminUser.ts`
Creates the initial admin account. Run once on first deploy.

### Phase 3: Input Validation (future)

#### Step 3.1: Add Zod validation schemas
**File**: `backend/src/validators/`
Define schemas for each endpoint's request body.

#### Step 3.2: Create validation middleware
```typescript
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error.issues });
  req.body = result.data;
  next();
};
```

#### Step 3.3: Apply to all write endpoints
Add `validate(createProductSchema)` before each controller.

## API Changes

### New endpoints (Phase 2)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Current user info |

### Modified endpoints (Phase 2)
All POST/PUT/DELETE endpoints will require `Authorization: Bearer <token>` header.

## Database Changes

### New collection (Phase 2)
- `adminusers` — email, passwordHash, role, createdAt

### Seed data
- Initial admin user created via `npm run seed:admin`

## Testing Strategy

### Phase 1
- Manual: verify CORS blocks unknown origins in production mode
- Manual: verify Helmet headers present (`curl -I`)
- Manual: verify oversized body is rejected
- Manual: verify error messages don't leak in production

### Phase 2
- Manual: login flow works in admin
- Manual: unauthenticated POST/PUT/DELETE returns 401
- Manual: authenticated requests succeed
- Manual: expired token returns 401

## Rollout Plan

### Phase 1 (safe, no breaking changes)
1. Implement all Step 1.x changes
2. Test locally with `npm run dev`
3. Build and push Docker images
4. Deploy to VPS — zero downtime, backward compatible

### Phase 2 (breaking change for admin)
1. Implement auth backend + admin login page together
2. Test full flow locally
3. Run seed script for admin user on VPS
4. Deploy both backend + admin images simultaneously
5. Verify admin login works on VPS

### Rollback
- Phase 1: revert to previous Docker image tag
- Phase 2: revert both backend + admin images to pre-auth tag

## Timeline Considerations

- Phase 1 steps are independent — can be done in any order
- Phase 2 steps must be done together (backend auth + admin login)
- Phase 3 can be done incrementally per endpoint

## Dependencies between steps

```
Phase 1 (all independent, no ordering needed)
  1.1 Helmet
  1.2 CORS
  1.3 Body limits
  1.4 JWT fallback
  1.5 Env validation
  1.6 Error sanitization
  1.7 Upload validation

Phase 2 (sequential)
  2.1 Admin User model
  2.2 Auth controller  → depends on 2.1
  2.3 Auth middleware   → depends on 2.2
  2.4 Apply to routes   → depends on 2.3
  2.5 Admin frontend    → depends on 2.2, 2.3
  2.6 Seed admin user   → depends on 2.1

Phase 3 (independent, after Phase 2)
  3.1 Zod schemas
  3.2 Validation middleware → depends on 3.1
  3.3 Apply to endpoints    → depends on 3.2
```

---
*Generated: 2026-03-29*

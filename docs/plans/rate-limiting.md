# Rate Limiting Implementation Plan

## Goal
Implement rate limiting for all API endpoints (60 requests/minute per IP), returning 429 status when exceeded.

## Configuration
- **Limit**: 60 requests per IP
- **Window**: 1 minute
- **Scope**: All `/api/*` endpoints
- **Identifier**: IP address

## Implementation Steps

### Step 1: Install `express-rate-limit`

```bash
cd backend && npm install express-rate-limit
```

### Step 2: Create Rate Limit Middleware

Create `backend/src/middleware/rateLimiter.ts`:

```typescript
import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // 60 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,  // Return rate limit info in headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
});
```

### Step 3: Apply Middleware in `backend/src/index.ts`

Add import at top:
```typescript
import { rateLimiter } from './middleware/rateLimiter';
```

Add before routes (after body parsers, before `/api` routes):
```typescript
// Apply rate limiter to all API routes
app.use('/api', rateLimiter);
```

## Files to Modify

| File | Action |
|------|--------|
| `backend/package.json` | Add `express-rate-limit` dependency |
| `backend/src/middleware/rateLimiter.ts` | Create new file |
| `backend/src/index.ts` | Import and apply middleware |

## Response Format

When rate limit exceeded:
```json
HTTP 429 Too Many Requests
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

Response headers included:
- `RateLimit-Limit`: 60
- `RateLimit-Remaining`: X
- `RateLimit-Reset`: timestamp (seconds until reset)

## Testing

```bash
# Test with curl - should get 429 after 60 rapid requests
for i in {1..65}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health; done
```

# Conventions

## Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/). Format:

```
<type>(<scope>): <short description>
```

### Types

| Type | When to use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `perf` | Performance improvement (no behavior change) |
| `refactor` | Code restructure, no behavior change, no bug fix |
| `chore` | Tooling, dependencies, config, build scripts |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `style` | Formatting only — no logic change |

### Scope (optional but recommended)

Use the area of the codebase:

```
feat(products): add product listing page
fix(auth): handle expired JWT tokens
perf(frontend): enable Turbopack for faster dev startup
chore(deps): upgrade mongoose to v8
docs(api): document product endpoints
```

### Rules

- Use lowercase
- No period at the end
- Subject line max ~72 characters
- Present tense: "add" not "added", "fix" not "fixed"

---

## Code Style

### Frontend (JavaScript)

- Functional components only — no class components
- Props destructured in function signature
- One component per file
- File name matches component name: `ProductCard.js` exports `ProductCard`
- Use `@/` path aliases — no relative `../../` imports beyond one level

```js
// Good
import ProductCard from '@/components/ProductCard';

// Avoid
import ProductCard from '../../components/ProductCard';
```

### Backend (TypeScript)

- Strict TypeScript — no `any` without a comment explaining why
- All route handlers are `async` and pass errors to `next(error)`
- Never access `process.env` directly — use `config` from `src/config/env.ts`
- Models go in `src/models/`, controllers in `src/controllers/`

---

## Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| React components | PascalCase | `ProductCard`, `NavBar` |
| JS/TS files | camelCase | `productController.ts`, `useCart.js` |
| CSS classes | kebab-case | `product-card`, `nav-bar` |
| API routes | kebab-case | `/api/product-categories` |
| Env vars | UPPER_SNAKE_CASE | `MONGODB_URI`, `JWT_SECRET` |
| MongoDB collections | Mongoose auto-pluralizes model name | `Product` → `products` |

---

## Branching (recommended)

```
main          ← production-ready, protected
feat/<name>   ← new features
fix/<name>    ← bug fixes
chore/<name>  ← tooling/config changes
```

Never commit directly to `main`. Open a PR and review before merging.

---

## Environment Files

| File | Committed | Purpose |
|------|-----------|---------|
| `.env.example` | Yes | Template — shows what vars are needed |
| `.env` | No | Actual secrets — never commit |
| `.env.local` | No | Next.js local overrides — never commit |

Always update `.env.example` when adding a new environment variable.

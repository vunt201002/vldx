# Backend

Express + TypeScript REST API. Source in `backend/src/`.

## Entry point

`src/index.ts` — sets up Express middleware, connects MongoDB, starts server.

Boot order:
1. Load env (`dotenv.config` via `config/env.ts`)
2. Create Express app
3. Apply middleware: CORS, JSON body parser
4. Mount routes under `/api`
5. Mount error handler (must be last)
6. Connect MongoDB (`config/database.ts`)
7. Start HTTP server

## Config

All environment variables are accessed through `src/config/env.ts`:

```ts
export const config = {
  nodeEnv:     process.env.NODE_ENV,
  port:        Number(process.env.PORT),
  mongodbUri:  process.env.MONGODB_URI,
  jwtSecret:   process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
};
```

Never call `process.env` directly outside this file.

## Routes

Base path: `/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |

Add new routes in `src/routes/index.ts`.

## Adding a resource (example: Products)

**1. Model** — `src/models/Product.ts`
```ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
}

const ProductSchema = new Schema<IProduct>({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
```

**2. Controller** — `src/controllers/productController.ts`
```ts
import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};
```

**3. Route** — `src/routes/productRoutes.ts`
```ts
import { Router } from 'express';
import { getProducts } from '../controllers/productController';

const router = Router();
router.get('/', getProducts);
export default router;
```

**4. Register** — `src/routes/index.ts`
```ts
import productRoutes from './productRoutes';
router.use('/products', productRoutes);
```

## Error handling

Use the `AppError` interface from `src/middleware/errorHandler.ts`:

```ts
const err: AppError = new Error('Product not found');
err.statusCode = 404;
next(err);  // pass to global handler
```

Response format:
```json
{ "success": false, "message": "Product not found" }
```

In development, `stack` trace is also included.

## Scripts

```bash
npm run dev      # ts-node-dev with hot reload
npm run build    # tsc → dist/
npm run start    # node dist/index.js
npm run lint     # eslint src/**/*.ts
```

## TypeScript config

`tsconfig.json` targets ES2020, strict mode on, outputs to `dist/`. Source maps enabled for debugging.

import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../controllers/productController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../validators';

const router = Router();

// Public
router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Protected
router.post('/', requireAuth, validate(createProductSchema), createProduct);
router.put('/:id', requireAuth, validate(updateProductSchema), updateProduct);
router.delete('/:id', requireAuth, deleteProduct);
router.post('/:id/images', requireAuth, uploadProductImage);

export default router;

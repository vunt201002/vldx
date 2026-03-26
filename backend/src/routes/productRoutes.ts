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

const router = Router();

// Get all products
router.get('/', getAllProducts);

// Get product by slug
router.get('/slug/:slug', getProductBySlug);

// Get product by ID
router.get('/:id', getProductById);

// Create product
router.post('/', createProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

// Upload product image
router.post('/:id/images', uploadProductImage);

export default router;

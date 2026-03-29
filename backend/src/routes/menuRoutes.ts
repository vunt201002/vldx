import { Router } from 'express';
import {
  getAllMenus,
  getMenuById,
  getMenuByHandle,
  createMenu,
  updateMenu,
  deleteMenu,
} from '../controllers/menuController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createMenuSchema, updateMenuSchema } from '../validators';

const router = Router();

// Public
router.get('/', getAllMenus);
router.get('/handle/:handle', getMenuByHandle);
router.get('/:id', getMenuById);

// Protected
router.post('/', requireAuth, validate(createMenuSchema), createMenu);
router.put('/:id', requireAuth, validate(updateMenuSchema), updateMenu);
router.delete('/:id', requireAuth, deleteMenu);

export default router;

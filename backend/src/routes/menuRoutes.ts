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

const router = Router();

// Public
router.get('/', getAllMenus);
router.get('/handle/:handle', getMenuByHandle);
router.get('/:id', getMenuById);

// Protected
router.post('/', requireAuth, createMenu);
router.put('/:id', requireAuth, updateMenu);
router.delete('/:id', requireAuth, deleteMenu);

export default router;

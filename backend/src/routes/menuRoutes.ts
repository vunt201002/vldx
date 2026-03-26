import { Router } from 'express';
import {
  getAllMenus,
  getMenuById,
  getMenuByHandle,
  createMenu,
  updateMenu,
  deleteMenu,
} from '../controllers/menuController';

const router = Router();

// Get all menus
router.get('/', getAllMenus);

// Get menu by handle
router.get('/handle/:handle', getMenuByHandle);

// Get menu by ID
router.get('/:id', getMenuById);

// Create menu
router.post('/', createMenu);

// Update menu
router.put('/:id', updateMenu);

// Delete menu
router.delete('/:id', deleteMenu);

export default router;

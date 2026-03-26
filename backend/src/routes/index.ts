import { Router } from 'express';
import materialRoutes from './materialRoutes';
import blockRoutes from './blockRoutes';
import pageRoutes from './pageRoutes';
import themeRoutes from './themeRoutes';
import uploadRoutes from './uploadRoutes';
import menuRoutes from './menuRoutes';
import productRoutes from './productRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/materials', materialRoutes);
router.use('/blocks', blockRoutes);
router.use('/pages', pageRoutes);
router.use('/theme', themeRoutes);
router.use('/upload', uploadRoutes);
router.use('/menus', menuRoutes);
router.use('/products', productRoutes);

export default router;

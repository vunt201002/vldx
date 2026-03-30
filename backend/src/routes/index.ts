import { Router } from 'express';
import materialRoutes from './materialRoutes';
import blockRoutes from './blockRoutes';
import pageRoutes from './pageRoutes';
import themeRoutes from './themeRoutes';
import uploadRoutes from './uploadRoutes';
import menuRoutes from './menuRoutes';
import productRoutes from './productRoutes';
import blogRoutes from './blogRoutes';
import authRoutes from './authRoutes';
import adminAuthRoutes from './adminAuthRoutes';
import customerRoutes from './customerRoutes';
import analyticsRoutes from './analyticsRoutes';
import auditLogRoutes from './auditLogRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/customers', customerRoutes);
router.use('/materials', materialRoutes);
router.use('/blocks', blockRoutes);
router.use('/pages', pageRoutes);
router.use('/theme', themeRoutes);
router.use('/upload', uploadRoutes);
router.use('/menus', menuRoutes);
router.use('/products', productRoutes);
router.use('/blog', blogRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/audit-log', auditLogRoutes);

export default router;

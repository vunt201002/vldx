import { Router } from 'express';
import materialRoutes from './materialRoutes';
import blockRoutes from './blockRoutes';
import pageRoutes from './pageRoutes';
import themeRoutes from './themeRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/materials', materialRoutes);
router.use('/blocks', blockRoutes);
router.use('/pages', pageRoutes);
router.use('/theme', themeRoutes);
router.use('/upload', uploadRoutes);

export default router;

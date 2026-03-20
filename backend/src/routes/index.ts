import { Router } from 'express';
import materialRoutes from './materialRoutes';
import blockRoutes from './blockRoutes';
import pageRoutes from './pageRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/materials', materialRoutes);
router.use('/blocks', blockRoutes);
router.use('/pages', pageRoutes);

export default router;

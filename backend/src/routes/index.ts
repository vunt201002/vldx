import { Router } from 'express';
import materialRoutes from './materialRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/materials', materialRoutes);

export default router;

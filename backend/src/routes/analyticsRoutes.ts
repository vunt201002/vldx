import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public — tracking endpoint (rate limited by general express rate limiter)
router.post('/events', analyticsController.trackEvent);

// Admin — dashboard data
router.get('/summary', requireAuth, analyticsController.getSummary);
router.get('/top-pages', requireAuth, analyticsController.getTopPages);
router.get('/top-products', requireAuth, analyticsController.getTopProducts);
router.get('/top-colors', requireAuth, analyticsController.getTopColors);
router.get('/trends', requireAuth, analyticsController.getTrends);

export default router;

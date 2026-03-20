import { Router } from 'express';
import { getPageBySlug } from '../controllers/pageController';

const router = Router();

router.get('/:slug', getPageBySlug);

export default router;

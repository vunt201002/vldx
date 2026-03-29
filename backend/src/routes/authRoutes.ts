import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, getMe);

export default router;

import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes (with rate limiting)
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/google', authLimiter, authController.googleLogin);

// Email verification
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

// Password reset (with stricter rate limiting)
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Token management
router.post('/refresh', authController.refresh);

// Protected routes (require authentication)
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, authController.updateMe);
router.put('/change-password', authenticate, authController.changePassword);
router.post('/favorites/:productId', authenticate, authController.toggleFavorite);
router.get('/favorites', authenticate, authController.getFavorites);

export default router;

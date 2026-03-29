import { Router } from 'express';
import * as blogController from '../controllers/blogController';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBlogPostSchema, updateBlogPostSchema, createCommentSchema } from '../validators';

const router = Router();

// SSE — must be before any JSON-parsing middleware issues
router.get('/events', blogController.events);

// Public routes
router.get('/', blogController.getPublished);
router.get('/:slug', blogController.getBySlug);
router.get('/:slug/comments', blogController.getComments);

// Public interactions (anonymous or authenticated)
router.post('/:slug/comments', optionalAuth, validate(createCommentSchema), blogController.addComment);
router.post('/:slug/likes', optionalAuth, blogController.toggleLike);

// Admin routes
router.get('/admin/list', requireAuth, blogController.getAll);
router.get('/admin/:id', requireAuth, blogController.getById as any);
router.post('/admin', requireAuth, validate(createBlogPostSchema), blogController.create);
router.put('/admin/:id', requireAuth, validate(updateBlogPostSchema), blogController.update as any);
router.delete('/admin/:id', requireAuth, blogController.remove as any);
router.delete('/:slug/comments/:commentId', requireAuth, blogController.deleteComment as any);

export default router;

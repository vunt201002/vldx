import { Router } from 'express';
import * as blogController from '../controllers/blogController';
import { requireAuth } from '../middleware/auth';
import { optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBlogPostSchema, updateBlogPostSchema, createCommentSchema } from '../validators';

const router = Router();

// SSE
router.get('/events', blogController.events);

// Public routes
router.get('/', blogController.getPublished);
router.get('/:id', blogController.getById);
router.get('/:id/comments', blogController.getComments);

// Public interactions (anonymous or authenticated)
router.post('/:id/comments', optionalAuth, validate(createCommentSchema), blogController.addComment);
router.post('/:id/likes', optionalAuth, blogController.toggleLike);

// Admin routes
router.get('/admin/list', requireAuth, blogController.getAll);
router.get('/admin/:id', requireAuth, blogController.getByIdAdmin as any);
router.post('/admin', requireAuth, validate(createBlogPostSchema), blogController.create);
router.put('/admin/:id', requireAuth, validate(updateBlogPostSchema), blogController.update as any);
router.delete('/admin/:id', requireAuth, blogController.remove as any);
router.delete('/:id/comments/:commentId', requireAuth, blogController.deleteComment as any);

export default router;

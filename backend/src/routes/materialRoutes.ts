import { Router } from 'express';
import * as materialController from '../controllers/materialController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public
router.get('/', materialController.getAll);
router.get('/:id', materialController.getById);

// Protected
router.post('/', requireAuth, materialController.create);
router.put('/:id', requireAuth, materialController.update);
router.delete('/:id', requireAuth, materialController.remove);

export default router;

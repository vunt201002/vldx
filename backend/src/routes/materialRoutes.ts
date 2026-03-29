import { Router } from 'express';
import * as materialController from '../controllers/materialController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createMaterialSchema, updateMaterialSchema } from '../validators';

const router = Router();

// Public
router.get('/', materialController.getAll);
router.get('/:id', materialController.getById);

// Protected
router.post('/', requireAuth, validate(createMaterialSchema), materialController.create);
router.put('/:id', requireAuth, validate(updateMaterialSchema), materialController.update);
router.delete('/:id', requireAuth, materialController.remove);

export default router;

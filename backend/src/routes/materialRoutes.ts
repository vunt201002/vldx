import { Router } from 'express';
import * as materialController from '../controllers/materialController';

const router = Router();

router.get('/', materialController.getAll);
router.get('/:id', materialController.getById);
router.post('/', materialController.create);
router.put('/:id', materialController.update);
router.delete('/:id', materialController.remove);

export default router;

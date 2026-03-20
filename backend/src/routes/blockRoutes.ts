import { Router } from 'express';
import { getBlocks, getBlockById } from '../controllers/blockController';

const router = Router();

router.get('/', getBlocks);
router.get('/:id', getBlockById);

export default router;

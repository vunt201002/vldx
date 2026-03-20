import { Router } from 'express';
import {
  getLandingTheme,
  saveLandingTheme,
  getFieldDefs,
  addBlock,
  deleteBlock,
} from '../controllers/themeController';

const router = Router();

// Field definitions for the editor
router.get('/field-defs', getFieldDefs);

// Landing page theme
router.get('/landing', getLandingTheme);
router.put('/landing', saveLandingTheme);

// Block management
router.post('/landing/blocks', addBlock);
router.delete('/landing/blocks/:blockId', deleteBlock);

export default router;

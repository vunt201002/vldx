import { Router } from 'express';
import {
  listPages,
  createPage,
  deletePage,
  getPageTheme,
  savePageTheme,
  getFieldDefs,
  addBlock,
  deleteBlock,
} from '../controllers/themeController';

const router = Router();

// Field definitions for the editor
router.get('/field-defs', getFieldDefs);

// Page management
router.get('/pages', listPages);
router.post('/pages', createPage);
router.delete('/pages/:slug', deletePage);

// Page theme (load / save)
router.get('/pages/:slug', getPageTheme);
router.put('/pages/:slug', savePageTheme);

// Block management within a page
router.post('/pages/:slug/blocks', addBlock);
router.delete('/pages/:slug/blocks/:blockId', deleteBlock);

export default router;

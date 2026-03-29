import { Router } from 'express';
import {
  listPages,
  createPage,
  deletePage,
  getPageTheme,
  savePageTheme,
  getFieldDefs,
  addBlock,
  cloneBlock,
  deleteBlock,
  getActiveTheme,
  updateThemeHeader,
  updateThemeFooter,
  addHeaderBlock,
  addFooterBlock,
  cloneHeaderBlock,
  cloneFooterBlock,
  deleteHeaderBlock,
  deleteFooterBlock,
} from '../controllers/themeController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public
router.get('/field-defs', getFieldDefs);
router.get('/', getActiveTheme);
router.get('/active', getActiveTheme);
router.get('/pages', listPages);
router.get('/pages/:slug', getPageTheme);

// Protected
router.put('/header', requireAuth, updateThemeHeader);
router.put('/footer', requireAuth, updateThemeFooter);
router.post('/header/blocks', requireAuth, addHeaderBlock);
router.post('/header/blocks/clone', requireAuth, cloneHeaderBlock);
router.post('/footer/blocks', requireAuth, addFooterBlock);
router.post('/footer/blocks/clone', requireAuth, cloneFooterBlock);
router.delete('/header/blocks/:blockId', requireAuth, deleteHeaderBlock);
router.delete('/footer/blocks/:blockId', requireAuth, deleteFooterBlock);
router.post('/pages', requireAuth, createPage);
router.delete('/pages/:slug', requireAuth, deletePage);
router.put('/pages/:slug', requireAuth, savePageTheme);
router.post('/pages/:slug/blocks/clone', requireAuth, cloneBlock);
router.post('/pages/:slug/blocks', requireAuth, addBlock);
router.delete('/pages/:slug/blocks/:blockId', requireAuth, deleteBlock);

export default router;

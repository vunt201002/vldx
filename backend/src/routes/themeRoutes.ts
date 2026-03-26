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

const router = Router();

// Field definitions for the editor
router.get('/field-defs', getFieldDefs);

// Global theme management
router.get('/', getActiveTheme);
router.get('/active', getActiveTheme); // Alias for clarity
router.put('/header', updateThemeHeader);
router.put('/footer', updateThemeFooter);
router.post('/header/blocks', addHeaderBlock);
router.post('/header/blocks/clone', cloneHeaderBlock);
router.post('/footer/blocks', addFooterBlock);
router.post('/footer/blocks/clone', cloneFooterBlock);
router.delete('/header/blocks/:blockId', deleteHeaderBlock);
router.delete('/footer/blocks/:blockId', deleteFooterBlock);

// Page management
router.get('/pages', listPages);
router.post('/pages', createPage);
router.delete('/pages/:slug', deletePage);

// Page theme (load / save)
router.get('/pages/:slug', getPageTheme);
router.put('/pages/:slug', savePageTheme);

// Block management within a page
router.post('/pages/:slug/blocks/clone', cloneBlock);
router.post('/pages/:slug/blocks', addBlock);
router.delete('/pages/:slug/blocks/:blockId', deleteBlock);

export default router;

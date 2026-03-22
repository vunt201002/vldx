import { Request, Response } from 'express';
import Page from '../models/Page';
import Block from '../models/Block';
import blockFieldDefs from '../config/blockFieldDefs';
import { generatePageJson, writePageJson, deletePageJson } from '../utils/generatePageJson';

/**
 * GET /api/theme/pages
 * List all pages (slug, title, isPublished, block count).
 */
export const listPages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pages = await Page.find()
      .select('slug title description isPublished blocks')
      .sort({ slug: 1 })
      .lean();

    res.json({
      success: true,
      data: pages.map((p: any) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        isPublished: p.isPublished,
        blockCount: p.blocks?.length || 0,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/theme/pages
 * Create a new page by cloning blocks from the landing template.
 * The navbar block's links are updated to include all existing pages + the new one.
 */
export const createPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug, title, description, bodyClass } = req.body;

    if (!slug || !title) {
      res.status(400).json({ success: false, message: 'slug and title are required' });
      return;
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      res.status(400).json({ success: false, message: 'slug must be lowercase letters, numbers, and hyphens only' });
      return;
    }

    const existing = await Page.findOne({ slug });
    if (existing) {
      res.status(409).json({ success: false, message: `Page "${slug}" already exists` });
      return;
    }

    // Find the landing page to use as template
    const template = await Page.findOne({ slug: 'landing' }).populate('blocks.block').lean();

    let pageBlocks: { block: any; order: number }[] = [];

    if (template && template.blocks.length > 0) {
      // Clone each block from the template
      const sorted = [...template.blocks].sort((a: any, b: any) => a.order - b.order);

      // Build nav links: list all existing pages + the new one
      const allPages = await Page.find().select('slug title').lean();
      const navLinks = [
        { label: 'trang chủ', href: '/landing' },
        ...allPages
          .filter((p: any) => p.slug !== 'landing')
          .map((p: any) => ({ label: p.title.split('—')[0].trim().toLowerCase(), href: `/${p.slug}` })),
        { label: title.split('—')[0].trim().toLowerCase(), href: `/${slug}` },
      ];

      for (let i = 0; i < sorted.length; i++) {
        const srcBlock = (sorted[i] as any).block;
        const clonedData = JSON.parse(JSON.stringify(srcBlock.data || {}));

        // Update navbar links to include all pages
        if (srcBlock.type === 'navbar' && clonedData.links) {
          clonedData.links = navLinks;
        }

        const newBlock = await Block.create({
          type: srcBlock.type,
          name: srcBlock.name,
          data: clonedData,
          settings: srcBlock.settings ? JSON.parse(JSON.stringify(srcBlock.settings)) : {},
        });

        pageBlocks.push({ block: newBlock._id, order: i });
      }
    }

    const page = await Page.create({
      slug,
      title,
      description: description || '',
      bodyClass: bodyClass || template?.bodyClass || '',
      blocks: pageBlocks,
      isPublished: false,
    });

    // Generate JSON file
    const populated = await Page.findById(page._id).populate('blocks.block').lean();
    if (populated) {
      const json = generatePageJson(populated as any);
      writePageJson(slug, json);
    }

    res.status(201).json({
      success: true,
      data: {
        slug: page.slug,
        title: page.title,
        description: page.description,
        isPublished: page.isPublished,
        blockCount: pageBlocks.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/theme/pages/:slug
 * Delete a page and all its blocks.
 */
export const deletePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const page = await Page.findOne({ slug });
    if (!page) {
      res.status(404).json({ success: false, message: 'Page not found' });
      return;
    }

    // Delete all blocks belonging to this page
    const blockIds = page.blocks.map((b: any) => b.block);
    if (blockIds.length > 0) {
      await Block.deleteMany({ _id: { $in: blockIds } });
    }

    await Page.deleteOne({ slug });
    deletePageJson(slug);

    res.json({ success: true, message: `Page "${slug}" deleted` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/theme/pages/:slug
 * Load a page with all blocks populated and ordered.
 */
export const getPageTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug }).populate('blocks.block').lean();

    if (!page) {
      res.status(404).json({ success: false, message: `Page "${slug}" not found` });
      return;
    }

    const sortedBlocks = [...page.blocks].sort((a: any, b: any) => a.order - b.order);

    res.json({
      success: true,
      data: {
        page: {
          slug: page.slug,
          title: page.title,
          description: page.description,
          bodyClass: page.bodyClass,
          displayFont: page.displayFont || '',
          bodyFont: page.bodyFont || '',
          isPublished: page.isPublished,
        },
        blocks: sortedBlocks.map((pb: any) => ({
          _id: pb.block._id,
          type: pb.block.type,
          name: pb.block.name,
          data: pb.block.data,
          settings: pb.block.settings,
          order: pb.order,
        })),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/theme/pages/:slug
 * Full-state save: update page meta, update all blocks, regenerate {slug}.json.
 */
export const savePageTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { page: pageMeta, blocks } = req.body;

    if (!pageMeta || !blocks) {
      res.status(400).json({ success: false, message: 'Missing page or blocks data' });
      return;
    }

    const page = await Page.findOne({ slug });
    if (!page) {
      res.status(404).json({ success: false, message: `Page "${slug}" not found` });
      return;
    }

    page.title = pageMeta.title;
    page.description = pageMeta.description || '';
    page.bodyClass = pageMeta.bodyClass || '';
    page.displayFont = pageMeta.displayFont || '';
    page.bodyFont = pageMeta.bodyFont || '';

    const updatedPageBlocks: { block: any; order: number }[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      const blockDoc = await Block.findById(b._id);
      if (!blockDoc) continue;

      blockDoc.name = b.name;
      blockDoc.data = b.data;
      if (b.settings !== undefined) {
        blockDoc.settings = b.settings;
      }
      blockDoc.markModified('data');
      blockDoc.markModified('settings');
      await blockDoc.save();

      updatedPageBlocks.push({ block: blockDoc._id, order: i });
    }

    page.blocks = updatedPageBlocks as any;
    await page.save();

    // Regenerate {slug}.json
    const freshPage = await Page.findOne({ slug }).populate('blocks.block').lean();
    if (freshPage) {
      const json = generatePageJson(freshPage as any);
      writePageJson(slug, json);
    }

    res.json({ success: true, message: `Theme saved and ${slug}.json regenerated` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/theme/field-defs
 */
export const getFieldDefs = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: blockFieldDefs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/theme/pages/:slug/blocks
 * Add a new block to a page.
 */
export const addBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { type, name, position } = req.body;

    if (!type) {
      res.status(400).json({ success: false, message: 'Block type is required' });
      return;
    }

    const page = await Page.findOne({ slug });
    if (!page) {
      res.status(404).json({ success: false, message: `Page "${slug}" not found` });
      return;
    }

    const typeDef = blockFieldDefs.find(d => d.type === type);
    const blockName = name || typeDef?.label || type;

    const block = await Block.create({
      type,
      name: blockName,
      data: {},
      settings: {},
    });

    const pos = position !== undefined ? position : page.blocks.length;

    const blocks = page.blocks.map((b: any) => ({
      block: b.block,
      order: b.order >= pos ? b.order + 1 : b.order,
    }));
    blocks.push({ block: block._id as any, order: pos });
    blocks.sort((a: any, b: any) => a.order - b.order);

    page.blocks = blocks as any;
    await page.save();

    res.json({
      success: true,
      data: {
        _id: block._id,
        type: block.type,
        name: block.name,
        data: block.data,
        settings: block.settings,
        order: pos,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/theme/pages/:slug/blocks/clone
 * Clone a block from another page (copies type, name, data, settings).
 */
export const cloneBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { sourceBlockId, position } = req.body;

    if (!sourceBlockId) {
      res.status(400).json({ success: false, message: 'sourceBlockId is required' });
      return;
    }

    const page = await Page.findOne({ slug });
    if (!page) {
      res.status(404).json({ success: false, message: `Page "${slug}" not found` });
      return;
    }

    const sourceBlock = await Block.findById(sourceBlockId).lean();
    if (!sourceBlock) {
      res.status(404).json({ success: false, message: 'Source block not found' });
      return;
    }

    const newBlock = await Block.create({
      type: sourceBlock.type,
      name: sourceBlock.name,
      data: sourceBlock.data || {},
      settings: sourceBlock.settings || {},
    });

    const pos = position !== undefined ? position : page.blocks.length;

    const blocks = page.blocks.map((b: any) => ({
      block: b.block,
      order: b.order >= pos ? b.order + 1 : b.order,
    }));
    blocks.push({ block: newBlock._id as any, order: pos });
    blocks.sort((a: any, b: any) => a.order - b.order);

    page.blocks = blocks as any;
    await page.save();

    res.json({
      success: true,
      data: {
        _id: newBlock._id,
        type: newBlock.type,
        name: newBlock.name,
        data: newBlock.data,
        settings: newBlock.settings,
        order: pos,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/theme/pages/:slug/blocks/:blockId
 * Remove a block from a page and delete the block document.
 */
export const deleteBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug, blockId } = req.params;

    const page = await Page.findOne({ slug });
    if (!page) {
      res.status(404).json({ success: false, message: `Page "${slug}" not found` });
      return;
    }

    page.blocks = page.blocks.filter((b: any) => b.block.toString() !== blockId) as any;

    const sorted = [...page.blocks].sort((a: any, b: any) => a.order - b.order);
    page.blocks = sorted.map((b: any, i: number) => ({
      block: b.block,
      order: i,
    })) as any;

    await page.save();
    await Block.findByIdAndDelete(blockId);

    // Regenerate {slug}.json
    const freshPage = await Page.findOne({ slug }).populate('blocks.block').lean();
    if (freshPage) {
      const json = generatePageJson(freshPage as any);
      writePageJson(slug, json);
    }

    res.json({ success: true, message: 'Block removed' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

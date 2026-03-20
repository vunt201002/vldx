import { Request, Response } from 'express';
import Page from '../models/Page';
import Block from '../models/Block';
import blockFieldDefs from '../config/blockFieldDefs';
import { generateLandingJson, writeLandingJson, sectionToBlockData } from '../utils/generateLandingJson';

/**
 * GET /api/theme/landing
 * Load the landing page with all blocks populated and ordered.
 */
export const getLandingTheme = async (_req: Request, res: Response): Promise<void> => {
  try {
    const page = await Page.findOne({ slug: 'landing' }).populate('blocks.block').lean();

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page not found' });
      return;
    }

    // Sort blocks by order
    const sortedBlocks = [...page.blocks].sort((a: any, b: any) => a.order - b.order);

    res.json({
      success: true,
      data: {
        page: {
          title: page.title,
          description: page.description,
          bodyClass: page.bodyClass,
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
 * PUT /api/theme/landing
 * Full-state save: update page meta, update all blocks, regenerate landing.json.
 */
export const saveLandingTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page: pageMeta, blocks } = req.body;

    if (!pageMeta || !blocks) {
      res.status(400).json({ success: false, message: 'Missing page or blocks data' });
      return;
    }

    const page = await Page.findOne({ slug: 'landing' });
    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page not found' });
      return;
    }

    // Update page metadata
    page.title = pageMeta.title;
    page.description = pageMeta.description || '';
    page.bodyClass = pageMeta.bodyClass || '';

    // Update each block document
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

    // Update page block order
    page.blocks = updatedPageBlocks as any;
    await page.save();

    // Regenerate landing.json
    const freshPage = await Page.findOne({ slug: 'landing' }).populate('blocks.block').lean();
    if (freshPage) {
      const json = generateLandingJson(freshPage as any);
      writeLandingJson(json);
    }

    res.json({ success: true, message: 'Theme saved and landing.json regenerated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/theme/field-defs
 * Return block field definitions for the editor UI.
 */
export const getFieldDefs = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: blockFieldDefs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/theme/landing/blocks
 * Add a new block to the landing page.
 */
export const addBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, name, position } = req.body;

    if (!type) {
      res.status(400).json({ success: false, message: 'Block type is required' });
      return;
    }

    const page = await Page.findOne({ slug: 'landing' });
    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page not found' });
      return;
    }

    // Find the field def for this type to get a default label
    const typeDef = blockFieldDefs.find(d => d.type === type);
    const blockName = name || typeDef?.label || type;

    // Create a new block with empty data
    const block = await Block.create({
      type,
      name: blockName,
      data: {},
      settings: {},
    });

    // Determine insertion position
    const pos = position !== undefined ? position : page.blocks.length;

    // Re-index: shift everything >= pos by 1
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
 * DELETE /api/theme/landing/blocks/:blockId
 * Remove a block from the landing page and delete the block document.
 */
export const deleteBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blockId } = req.params;

    const page = await Page.findOne({ slug: 'landing' });
    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page not found' });
      return;
    }

    // Remove block reference from page
    page.blocks = page.blocks.filter((b: any) => b.block.toString() !== blockId) as any;

    // Re-index orders
    const sorted = [...page.blocks].sort((a: any, b: any) => a.order - b.order);
    page.blocks = sorted.map((b: any, i: number) => ({
      block: b.block,
      order: i,
    })) as any;

    await page.save();

    // Delete the block document
    await Block.findByIdAndDelete(blockId);

    // Regenerate landing.json
    const freshPage = await Page.findOne({ slug: 'landing' }).populate('blocks.block').lean();
    if (freshPage) {
      const json = generateLandingJson(freshPage as any);
      writeLandingJson(json);
    }

    res.json({ success: true, message: 'Block removed' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

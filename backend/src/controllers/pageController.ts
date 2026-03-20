import { Request, Response, NextFunction } from 'express';
import Page from '../models/Page';

export const getPageBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true })
      .populate('blocks.block')
      .lean();

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Transform to frontend-friendly format
    const result = {
      page: {
        title: page.title,
        description: page.description,
        bodyClass: page.bodyClass,
      },
      blocks: page.blocks
        .sort((a, b) => a.order - b.order)
        .map((entry: any) => ({
          _id: entry.block._id,
          type: entry.block.type,
          name: entry.block.name,
          data: entry.block.data,
          settings: entry.block.settings,
        })),
    };

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import Page from '../models/Page';
import { generatePageJson } from '../utils/generatePageJson';

export const getPageBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true })
      .populate('blocks.block')
      .lean();

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    const config = generatePageJson(page as any);

    res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
};

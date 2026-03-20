import { Request, Response, NextFunction } from 'express';
import Block from '../models/Block';

export const getBlocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const filter: Record<string, any> = {};
    if (type) filter.type = type;

    const blocks = await Block.find(filter).sort({ type: 1 }).lean();
    res.json({ success: true, data: blocks });
  } catch (err) {
    next(err);
  }
};

export const getBlockById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const block = await Block.findById(req.params.id).lean();
    if (!block) {
      return res.status(404).json({ success: false, message: 'Block not found' });
    }
    res.json({ success: true, data: block });
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import mongoose from 'mongoose';
import { Material } from '../models/Material';
import { AppError } from '../middleware/errorHandler';

function makeEtag(data: unknown): string {
  return `"${createHash('md5').update(JSON.stringify(data)).digest('hex')}"`;
}

function sendWithEtag(req: Request, res: Response, data: unknown): void {
  const etag = makeEtag(data);
  if (req.headers['if-none-match'] === etag) {
    res.status(304).end();
    return;
  }
  res.set('ETag', etag).json(data);
}

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, inStock, limit = '20', page = '1' } = req.query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (inStock !== undefined) filter.inStock = inStock === 'true';

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Material.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Material.countDocuments(filter),
    ]);

    sendWithEtag(req, res, {
      success: true,
      data,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const material = mongoose.Types.ObjectId.isValid(id)
      ? await Material.findById(id).lean()
      : await Material.findOne({ slug: id }).lean();

    if (!material) {
      const error: AppError = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    sendWithEtag(req, res, { success: true, data: material });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await Material.create(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const material = await Material.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!material) {
      const error: AppError = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: material });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const material = await Material.findByIdAndDelete(id);

    if (!material) {
      const error: AppError = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, message: 'Material deleted' });
  } catch (err) {
    next(err);
  }
};

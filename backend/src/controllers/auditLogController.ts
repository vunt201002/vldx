import { Request, Response, NextFunction } from 'express';
import AuditLog from '../models/AuditLog';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { entity, action, admin, limit = '50', page = '1' } = req.query;
    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);
    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (entity) filter.entity = entity;
    if (action) filter.action = action;
    if (admin) filter.adminEmail = admin;

    const [data, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
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

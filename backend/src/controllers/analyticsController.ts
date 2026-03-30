import { Request, Response, NextFunction } from 'express';
import AnalyticsEvent from '../models/AnalyticsEvent';

export const trackEvent = async (req: Request, res: Response) => {
  try {
    const { type, path, referenceId, referenceName, metadata, sessionId } = req.body;

    if (!type || !path) {
      res.status(400).json({ success: false, message: 'type and path are required' });
      return;
    }

    // Fire and forget
    AnalyticsEvent.create({
      type,
      path,
      referenceId,
      referenceName,
      metadata,
      sessionId,
      userAgent: req.headers['user-agent'],
    }).catch(() => {});

    res.json({ success: true });
  } catch {
    res.json({ success: true }); // Never fail tracking
  }
};

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [todayViews, weekViews, todayUnique, totalEvents] = await Promise.all([
      AnalyticsEvent.countDocuments({ createdAt: { $gte: todayStart } }),
      AnalyticsEvent.countDocuments({ createdAt: { $gte: weekStart } }),
      AnalyticsEvent.distinct('sessionId', { createdAt: { $gte: todayStart } }).then((s) => s.length),
      AnalyticsEvent.countDocuments(),
    ]);

    res.json({
      success: true,
      data: { todayViews, weekViews, todayUnique, totalEvents },
    });
  } catch (err) {
    next(err);
  }
};

export const getTopPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string, 10) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await AnalyticsEvent.aggregate([
      { $match: { type: 'page_view', createdAt: { $gte: since } } },
      { $group: { _id: '$path', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 20 },
      { $project: { path: '$_id', views: 1, _id: 0 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getTopProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string, 10) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await AnalyticsEvent.aggregate([
      { $match: { type: 'product_view', createdAt: { $gte: since } } },
      { $group: { _id: { id: '$referenceId', name: '$referenceName' }, views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 20 },
      { $project: { referenceId: '$_id.id', name: '$_id.name', views: 1, _id: 0 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getTopColors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string, 10) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await AnalyticsEvent.aggregate([
      { $match: { type: 'color_select', createdAt: { $gte: since } } },
      { $group: { _id: { name: '$metadata.colorName', hex: '$metadata.hex' }, clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 20 },
      { $project: { name: '$_id.name', hex: '$_id.hex', clicks: 1, _id: 0 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string, 10) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
      {
        $group: {
          _id: '$_id.date',
          total: { $sum: '$count' },
          breakdown: { $push: { type: '$_id.type', count: '$count' } },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', total: 1, breakdown: 1, _id: 0 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import BlogPost from '../models/BlogPost';
import blogEvents from '../events/blogEvents';
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

// ─── SSE endpoint ────────────────────────────────────────────────────────────

export const events = (req: Request, res: Response) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  const onUpdate = () => {
    res.write(`data: ${JSON.stringify({ type: 'blog-updated' })}\n\n`);
  };

  blogEvents.on('blog-updated', onUpdate);

  // Heartbeat every 30s to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  req.on('close', () => {
    blogEvents.off('blog-updated', onUpdate);
    clearInterval(heartbeat);
  });
};

// ─── Public routes ───────────────────────────────────────────────────────────

export const getPublished = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tag, limit = '12', page = '1' } = req.query;
    const limitNum = Math.min(parseInt(limit as string, 10) || 12, 50);
    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = { isPublished: true };
    if (tag) filter.tags = tag;

    const [data, total] = await Promise.all([
      BlogPost.find(filter)
        .select('-content -comments -likes')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      BlogPost.countDocuments(filter),
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
    const post = await BlogPost.findOne({ _id: req.params.id, isPublished: true })
      .populate('comments.customer', 'firstName lastName profilePicture')
      .lean();

    if (!post) {
      const error: AppError = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }

    // Increment view count (fire and forget)
    BlogPost.updateOne({ _id: post._id }, { $inc: { viewCount: 1 } }).exec();

    sendWithEtag(req, res, {
      success: true,
      data: {
        ...post,
        likeCount: post.likes.length,
        commentCount: post.comments.length,
        likes: undefined, // don't expose raw likes array
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Comments ────────────────────────────────────────────────────────────────

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, isPublished: true })
      .select('comments')
      .populate('comments.customer', 'firstName lastName profilePicture')
      .lean();

    if (!post) {
      const error: AppError = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }

    const comments = [...post.comments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    sendWithEtag(req, res, { success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, isPublished: true });
    if (!post) {
      const error: AppError = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }

    const user = req.user;
    const name = user
      ? `${user.firstName} ${user.lastName}`.trim()
      : req.body.name?.trim() || 'Ẩn danh';

    post.comments.push({
      customer: user?._id,
      name,
      content: req.body.content,
      createdAt: new Date(),
    } as any);

    await post.save();
    blogEvents.emit('blog-updated');

    const added = post.comments[post.comments.length - 1];
    res.status(201).json({ success: true, data: added });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, commentId } = req.params;
    const result = await BlogPost.updateOne(
      { _id: id },
      { $pull: { comments: { _id: commentId } } },
    );

    if (result.modifiedCount === 0) {
      const error: AppError = new Error('Comment not found');
      error.statusCode = 404;
      throw error;
    }

    blogEvents.emit('blog-updated');
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

// ─── Likes ───────────────────────────────────────────────────────────────────

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, isPublished: true });
    if (!post) {
      const error: AppError = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }

    const user = req.user;
    const sessionId = req.body.sessionId as string | undefined;

    if (!user && !sessionId) {
      res.status(400).json({ success: false, message: 'sessionId is required for anonymous likes' });
      return;
    }

    // Find existing like
    const existingIndex = post.likes.findIndex((like) => {
      if (user) return like.customer?.toString() === user._id.toString();
      return like.sessionId === sessionId;
    });

    let liked: boolean;
    if (existingIndex >= 0) {
      post.likes.splice(existingIndex, 1);
      liked = false;
    } else {
      post.likes.push(user ? { customer: user._id } : { sessionId });
      liked = true;
    }

    await post.save();

    res.json({ success: true, data: { liked, likeCount: post.likes.length } });
  } catch (err) {
    next(err);
  }
};

// ─── Admin routes ────────────────────────────────────────────────────────────

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, limit = '20', page = '1' } = req.query;
    const limitNum = Math.min(parseInt(limit as string, 10) || 20, 100);
    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (status === 'published') filter.isPublished = true;
    if (status === 'draft') filter.isPublished = false;

    const [data, total] = await Promise.all([
      BlogPost.find(filter)
        .select('-content -comments -likes')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      BlogPost.countDocuments(filter),
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

export const getByIdAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findById(req.params.id).lean();
    if (!post) {
      const error: AppError = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.create(req.body);
    blogEvents.emit('blog-updated');
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      const error: AppError = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }

    // Set publishedAt when first published
    if (req.body.isPublished && !post.publishedAt) {
      req.body.publishedAt = new Date();
    }

    Object.assign(post, req.body);
    await post.save();
    blogEvents.emit('blog-updated');

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      const error: AppError = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }

    blogEvents.emit('blog-updated');
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (err) {
    next(err);
  }
};

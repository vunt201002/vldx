import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import Customer, { ICustomer } from '../models/Customer';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: ICustomer;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT from Authorization header
 * Attaches user to req.user if token is valid
 * Returns 401 if token is missing or invalid
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch user from database
    const user = await Customer.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Invalid or expired token',
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  }
};

/**
 * Optional authentication middleware
 * Attaches user to req.user if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user
      next();
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      const user = await Customer.findById(decoded.userId);

      if (user) {
        req.user = user;
      }
    } catch {
      // Invalid token, continue without user
    }

    next();
  } catch (error) {
    // Continue even if there's an error
    next();
  }
};

/**
 * Middleware to require email verification
 * Must be used after authenticate middleware
 * Returns 403 if email is not verified
 */
export const requireEmailVerified = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  if (!req.user.isEmailVerified) {
    res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email before accessing this resource.',
    });
    return;
  }

  next();
};

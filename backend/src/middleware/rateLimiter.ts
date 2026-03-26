import rateLimit from 'express-rate-limit';

// More permissive rate limits in development for theme editor
const isDevelopment = process.env.NODE_ENV !== 'production';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDevelopment ? 300 : 60, // 300 requests per minute in dev, 60 in production
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,  // Return rate limit info in headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
});

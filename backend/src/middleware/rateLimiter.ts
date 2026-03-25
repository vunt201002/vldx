import rateLimit from 'express-rate-limit';

// General rate limiter
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // 60 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,  // Return rate limit info in headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
});

// Stricter rate limiter for auth endpoints (login, register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // 5 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
});

// Rate limiter for password reset requests
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,                   // 3 requests per window
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

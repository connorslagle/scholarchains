import rateLimit from 'express-rate-limit';

export const createRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const verifyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // More generous for verification
  message: {
    error: 'Too many verification requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const upgradeRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: {
    error: 'Too many upgrade requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

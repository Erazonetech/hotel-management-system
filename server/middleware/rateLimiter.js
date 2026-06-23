import rateLimit from 'express-rate-limit';

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.'
  }
});


const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20, 
  message: {
    success: false,
    error: 'Order creation limit reached. Please try again later.'
  }
});

export { apiLimiter, authLimiter, orderLimiter };
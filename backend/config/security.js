const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Rate limiting configuration
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// API rate limiters
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 auth attempts per 15 minutes
const leadSubmitLimiter = createRateLimiter(60 * 60 * 1000, 10); // 10 submissions per hour

// Security middleware setup
const setupSecurity = (app) => {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:*", "https://api.ipify.org"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Prevent NoSQL injection attacks
  app.use(mongoSanitize({
    allowDots: true,
    replaceWith: '_'
  }));

  // Prevent XSS attacks
  app.use(xss());

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
};

// Input validation patterns
const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[0-9]{10,15}$/,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  company: /^[a-zA-Z0-9\s&,.-]{2,100}$/,
  alphanumeric: /^[a-zA-Z0-9\s-]+$/,
  url: /^https?:\/\/.+/,
  mongoId: /^[0-9a-fA-F]{24}$/
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove any script tags
  input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove any HTML tags
  input = input.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  input = input.trim();
  
  return input;
};

// Password strength validator
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!hasUpperCase || !hasLowerCase) {
    return { valid: false, message: 'Password must contain both uppercase and lowercase letters' };
  }
  
  if (!hasNumbers) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!hasSpecialChar) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};

module.exports = {
  setupSecurity,
  createRateLimiter,
  apiLimiter,
  authLimiter,
  leadSubmitLimiter,
  validationPatterns,
  sanitizeInput,
  validatePasswordStrength
};
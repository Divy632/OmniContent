const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const json = (message, code) => ({ success: false, message, code });

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many requests. Please slow down.', 'RATE_LIMITED'),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many attempts. Try again in a few minutes.', 'RATE_LIMITED'),
});

// Applied after auth so the quota is per user, protecting the AI bill during demos.
const generationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: env.generationLimitPerHour,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req.user ? String(req.user._id) : req.ip),
  message: json('Generation limit reached for this hour. Please try again later.', 'GENERATION_LIMIT'),
});

module.exports = { generalLimiter, authLimiter, generationLimiter };

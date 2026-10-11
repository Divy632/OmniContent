const jwt = require('jsonwebtoken');
const { userStore } = require('../services/dataStore');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_ai_content_platform_2026_dev';

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required. Please log in.',
        code: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await userStore.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session invalid or expired.',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      code: 'INVALID_TOKEN'
    });
  }
};

module.exports = {
  requireAuth,
  JWT_SECRET
};

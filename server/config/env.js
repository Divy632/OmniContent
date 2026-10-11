require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  publicUrl: (process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/$/, ''),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/content_platform',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  textProvider: (process.env.TEXT_PROVIDER || 'mock').toLowerCase(),
  imageProvider: (process.env.IMAGE_PROVIDER || 'mock').toLowerCase(),
  aiApiKey: process.env.AI_API_KEY || '',
  imageApiKey: process.env.IMAGE_API_KEY || process.env.AI_API_KEY || '',
  textModel: process.env.TEXT_MODEL || 'claude-sonnet-5-5',
  imageModel: process.env.IMAGE_MODEL || 'gpt-image-1',
  generationLimitPerHour: Number(process.env.GENERATION_LIMIT_PER_HOUR) || 15,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
};
env.cloudinary.enabled = Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);

module.exports = env;

import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first (local dev), fall back to .env (Docker/prod sets env vars directly)
dotenv.config({ path: '.env.local' });
dotenv.config(); // won't overwrite vars already set by .env.local

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vlxd',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5173',
  frontendConfigDir: process.env.FRONTEND_CONFIG_DIR ||
    path.resolve(__dirname, '../../../frontend/config/pages'),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

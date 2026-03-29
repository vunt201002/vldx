import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first (local dev), fall back to .env (Docker/prod sets env vars directly)
dotenv.config({ path: '.env.local' });
dotenv.config(); // won't overwrite vars already set by .env.local

const isProduction = process.env.NODE_ENV === 'production';

// Fail fast on missing critical config in production
if (isProduction) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'fallback_secret') {
    throw new Error('JWT_SECRET must be set to a strong value in production');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required in production');
  }
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vlxd',
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'dev_only_fallback_secret',
  jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',

  // Email Configuration (SMTP)
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || 'noreply@vlxd.com',

  // URLs
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5173',
  frontendConfigDir: process.env.FRONTEND_CONFIG_DIR ||
    path.resolve(__dirname, '../../../frontend/config/pages'),

  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

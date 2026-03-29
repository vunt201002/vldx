import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import routes from './routes/index';
import { startPageJsonSync } from './utils/syncPageJsons';

const app = express();

// Trust proxy (needed behind Docker/nginx reverse proxy)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS — restrict to known origins in production
app.use(cors({
  origin: config.nodeEnv === 'production'
    ? [config.frontendUrl, config.adminUrl].filter(Boolean)
    : true,
  credentials: true,
}));

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting
app.use('/api', rateLimiter);

// Routes
app.use('/api', routes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const start = async (): Promise<void> => {
  await connectDB();
  startPageJsonSync();
  app.listen(config.port, '0.0.0.0', () => {
    console.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
  });
};

start();

export default app;

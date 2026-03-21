import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import routes from './routes/index';
import { startPageJsonSync } from './utils/syncPageJsons';

const app = express();

// Middleware
app.use(cors({
  origin: [config.frontendUrl, config.adminUrl],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  app.listen(config.port, () => {
    console.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
  });
};

start();

export default app;

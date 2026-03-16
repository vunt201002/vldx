import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes/index';

const app = express();

// Middleware
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const start = async (): Promise<void> => {
  await connectDB();
  app.listen(config.port, () => {
    console.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
  });
};

start();

export default app;

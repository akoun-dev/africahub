import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { setupMessageQueue } from './config/messageQueue';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';
import recommendationsRoutes from './routes/recommendations';
import enhancedRecommendationsRoutes from './routes/enhancedRecommendations';
import healthRoutes from './routes/health';
import metricsRoutes from './routes/metrics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(rateLimiter);

// Routes
app.use('/api/v1/recommendations', recommendationsRoutes);
app.use('/api/v1/enhanced-recommendations', enhancedRecommendationsRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/metrics', metricsRoutes);

// Error handling
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();
    await setupMessageQueue();
    
    app.listen(PORT, () => {
      logger.info(`AI Recommendations Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

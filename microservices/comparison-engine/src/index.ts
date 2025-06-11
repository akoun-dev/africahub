
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';

// Import routes
import healthRoutes from './routes/health';
import comparisonRoutes from './routes/comparison';
import scoringRoutes from './routes/scoring';

const app = express();
const PORT = process.env.PORT || 3007;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(compression());

// Rate limiting
app.use(rateLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1/compare', comparisonRoutes);
app.use('/api/v1/scoring', scoringRoutes);

// Error handling
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();

    app.listen(PORT, () => {
      logger.info(`Comparison Engine Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

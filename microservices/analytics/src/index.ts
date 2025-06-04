
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { connectRabbitMQ } from './config/rabbitmq';
import { connectTimeSeries } from './config/timeseries';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { EventProcessor } from './services/EventProcessor';
import { RealtimeStreaming } from './services/RealtimeStreaming';

// Routes
import healthRoutes from './routes/health';
import metricsRoutes from './routes/metrics';
import eventsRoutes from './routes/events';
import analyticsRoutes from './routes/analytics';
import reportsRoutes from './routes/reports';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(rateLimiter);

// Routes
app.use('/health', healthRoutes);
app.use('/metrics', metricsRoutes);
app.use('/api/v1/events', eventsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/reports', reportsRoutes);

// Error handling
app.use(errorHandler);

async function startServer() {
  try {
    // Connect to databases
    await connectDatabase();
    logger.info('Connected to PostgreSQL database');

    await connectRedis();
    logger.info('Connected to Redis cache');

    await connectRabbitMQ();
    logger.info('Connected to RabbitMQ');

    await connectTimeSeries();
    logger.info('Connected to TimeSeries database');

    // Initialize services
    const eventProcessor = new EventProcessor();
    await eventProcessor.start();
    logger.info('Event processor started');

    const realtimeStreaming = new RealtimeStreaming();
    await realtimeStreaming.start();
    logger.info('Realtime streaming started');

    // Start server
    app.listen(PORT, () => {
      logger.info(`Analytics microservice running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();

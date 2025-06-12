
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { connectRabbitMQ } from './config/rabbitmq';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { NotificationService } from './services/NotificationService';
import { QueueProcessor } from './services/QueueProcessor';

// Routes
import healthRoutes from './routes/health';
import metricsRoutes from './routes/metrics';
import notificationRoutes from './routes/notifications';
import templateRoutes from './routes/templates';
import preferencesRoutes from './routes/preferences';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

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
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/preferences', preferencesRoutes);

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

    // Initialize services
    const notificationService = NotificationService.getInstance();
    await notificationService.initialize();
    logger.info('Notification service initialized');

    const queueProcessor = new QueueProcessor();
    await queueProcessor.start();
    logger.info('Queue processor started');

    // Start server
    app.listen(PORT, () => {
      logger.info(`Notifications microservice running on port ${PORT}`);
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

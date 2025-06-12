
import { Router } from 'express';
import { pool } from '../config/database';
import { redisClient } from '../config/redis';
import { HealthCheckService } from '../../shared/src/health/healthChecks';

const router = Router();
const healthChecker = new HealthCheckService('comparison-engine', '1.0.0');

// Add health checkers
healthChecker.addDatabaseChecker(pool);
healthChecker.addRedisChecker(redisClient);
healthChecker.addMemoryChecker(512); // 512MB threshold
healthChecker.addExternalServiceChecker(
  'https://httpbin.org/status/200',
  'external-api-test'
);

// Health endpoints
router.get('/', healthChecker.getHealthMiddleware());
router.get('/live', healthChecker.getLivenessMiddleware());
router.get('/ready', healthChecker.getReadinessMiddleware());

export default router;

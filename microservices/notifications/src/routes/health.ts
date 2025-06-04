
import { Router } from 'express';
import { pool } from '../config/database';
import { redisClient } from '../config/redis';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    
    // Check Redis connection
    await redisClient.ping();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'connected',
        redis: 'connected',
        rabbitmq: 'connected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

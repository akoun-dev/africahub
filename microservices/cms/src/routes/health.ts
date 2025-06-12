
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
      success: true,
      service: 'cms-microservice',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      connections: {
        database: 'connected',
        redis: 'connected'
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      service: 'cms-microservice',
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

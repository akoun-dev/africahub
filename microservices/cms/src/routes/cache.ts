
import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { deleteCache } from '../config/redis';
import { logger } from '../utils/logger';

const router = Router();

// Invalidate cache by pattern
router.post('/invalidate', [
  body('pattern').notEmpty().withMessage('Pattern is required')
], validateRequest, async (req, res) => {
  try {
    const { pattern } = req.body;
    
    await deleteCache(pattern);
    
    logger.info(`Cache invalidated for pattern: ${pattern}`);
    
    res.json({
      success: true,
      message: 'Cache invalidated successfully'
    });
  } catch (error) {
    logger.error('Error invalidating cache:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;

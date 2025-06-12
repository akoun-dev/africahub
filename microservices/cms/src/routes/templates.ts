
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { pool } from '../config/database';
import { setCache, getCache, deleteCache } from '../config/redis';
import { publishEvent } from '../config/rabbitmq';
import { logger } from '../utils/logger';

const router = Router();

// Get templates with filters
router.get('/', async (req, res) => {
  try {
    const { country, sector, type } = req.query as Record<string, string>;
    
    let whereConditions = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (country) {
      whereConditions.push(`(country_code = $${paramIndex} OR country_code IS NULL)`);
      queryParams.push(country);
      paramIndex++;
    }

    if (sector) {
      whereConditions.push(`(sector_slug = $${paramIndex} OR sector_slug IS NULL)`);
      queryParams.push(sector);
      paramIndex++;
    }

    if (type) {
      whereConditions.push(`template_type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const query = `
      SELECT * FROM cms_templates 
      ${whereClause}
      ORDER BY is_default DESC, created_at DESC
    `;

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting templates:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;

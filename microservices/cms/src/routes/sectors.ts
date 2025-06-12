
import { Router } from 'express';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

// Get sector-specific content
router.get('/:sector/content', async (req, res) => {
  try {
    const { sector } = req.params;
    const { country, language = 'en' } = req.query as Record<string, string>;

    const query = `
      SELECT * FROM cms_content 
      WHERE (sector_slug = $1 OR sector_slug IS NULL)
        AND (country_code = $2 OR country_code IS NULL)
        AND language_code = $3
        AND status = 'published'
        AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY 
        CASE WHEN sector_slug = $1 AND country_code = $2 THEN 1
             WHEN sector_slug = $1 AND country_code IS NULL THEN 2
             WHEN sector_slug IS NULL AND country_code = $2 THEN 3
             ELSE 4 END,
        created_at DESC
    `;

    const result = await pool.query(query, [sector, country, language]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting sector content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;

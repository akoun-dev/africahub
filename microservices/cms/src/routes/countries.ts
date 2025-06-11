
import { Router } from 'express';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

// Get country-specific content
router.get('/:country/content', async (req, res) => {
  try {
    const { country } = req.params;
    const { sector, language = 'en' } = req.query as Record<string, string>;

    const query = `
      SELECT * FROM cms_content 
      WHERE (country_code = $1 OR country_code IS NULL)
        AND (sector_slug = $2 OR sector_slug IS NULL)
        AND language_code = $3
        AND status = 'published'
        AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY 
        CASE WHEN country_code = $1 AND sector_slug = $2 THEN 1
             WHEN country_code = $1 AND sector_slug IS NULL THEN 2
             WHEN country_code IS NULL AND sector_slug = $2 THEN 3
             ELSE 4 END,
        created_at DESC
    `;

    const result = await pool.query(query, [country, sector, language]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting country content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;

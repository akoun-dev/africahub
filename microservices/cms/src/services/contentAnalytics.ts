
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export class ContentAnalytics {
  async trackContentView(contentId: string, country?: string, sector?: string): Promise<void> {
    try {
      await pool.query(`
        INSERT INTO cms_content_analytics (content_id, country_code, sector_slug, views)
        VALUES ($1, $2, $3, 1)
        ON CONFLICT (content_id, country_code, sector_slug, date)
        DO UPDATE SET views = cms_content_analytics.views + 1
      `, [contentId, country, sector]);
    } catch (error) {
      logger.error('Error tracking content view:', error);
    }
  }
}

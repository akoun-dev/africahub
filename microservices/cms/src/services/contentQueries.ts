
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export interface ContentQueryParams {
  contentKey: string;
  language: string;
  country?: string;
  sector?: string;
}

export interface ContentFilters {
  country?: string;
  sector?: string;
  language: string;
  status?: string;
  page: number;
  limit: number;
}

export class ContentQueries {
  async findContentWithFallback(params: ContentQueryParams): Promise<any> {
    const { contentKey, language, country, sector } = params;

    // Fallback strategy: country+sector -> country -> sector -> global
    const fallbackQueries = [
      { country_code: country, sector_slug: sector },
      { country_code: country, sector_slug: null },
      { country_code: null, sector_slug: sector },
      { country_code: null, sector_slug: null }
    ].filter(query => query.country_code || query.sector_slug || (!query.country_code && !query.sector_slug));

    for (const fallback of fallbackQueries) {
      const query = `
        SELECT * FROM cms_content 
        WHERE content_key = $1 
          AND language_code = $2 
          AND status = 'published'
          AND (expires_at IS NULL OR expires_at > NOW())
          AND ($3::text IS NULL OR country_code = $3 OR country_code IS NULL)
          AND ($4::text IS NULL OR sector_slug = $4 OR sector_slug IS NULL)
        ORDER BY 
          CASE WHEN country_code = $3 AND sector_slug = $4 THEN 1
               WHEN country_code = $3 AND sector_slug IS NULL THEN 2
               WHEN country_code IS NULL AND sector_slug = $4 THEN 3
               ELSE 4 END
        LIMIT 1
      `;

      const result = await pool.query(query, [
        contentKey,
        language,
        fallback.country_code,
        fallback.sector_slug
      ]);

      if (result.rows.length > 0) {
        return result.rows[0];
      }
    }

    return null;
  }

  async getAllContent(filters: ContentFilters): Promise<{ content: any[], totalCount: number }> {
    const { country, sector, language, status, page, limit } = filters;
    const offset = (page - 1) * limit;

    let whereConditions = ['language_code = $1'];
    const queryParams: any[] = [language];
    let paramIndex = 2;

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

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM cms_content ${whereClause}`;
    const contentQuery = `
      SELECT * FROM cms_content 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const [countResult, contentResult] = await Promise.all([
      pool.query(countQuery, queryParams.slice(0, -2)),
      pool.query(contentQuery, queryParams)
    ]);

    return {
      content: contentResult.rows,
      totalCount: parseInt(countResult.rows[0].count)
    };
  }

  async createContent(contentData: any, userId: string): Promise<any> {
    const {
      content_key,
      content_type,
      title,
      content,
      metadata = {},
      country_code,
      sector_slug,
      language_code = 'en'
    } = contentData;

    const query = `
      INSERT INTO cms_content (
        content_key, content_type, title, content, metadata,
        country_code, sector_slug, language_code, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      content_key,
      content_type,
      title,
      content,
      JSON.stringify(metadata),
      country_code,
      sector_slug,
      language_code,
      userId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async updateContent(id: string, updateFields: any): Promise<any> {
    const allowedFields = ['title', 'content', 'metadata', 'status'];
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateFields)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(key === 'metadata' ? JSON.stringify(value) : value);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    updates.push(`updated_at = NOW()`);
    updates.push(`version = version + 1`);
    values.push(id);

    const query = `
      UPDATE cms_content 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error('Content not found');
    }
    return result.rows[0];
  }

  async deleteContent(id: string): Promise<any> {
    const result = await pool.query('DELETE FROM cms_content WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('Content not found');
    }
    return result.rows[0];
  }

  async publishContent(id: string): Promise<any> {
    const result = await pool.query(`
      UPDATE cms_content 
      SET status = 'published', published_at = NOW(), updated_at = NOW()
      WHERE id = $1 
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      throw new Error('Content not found');
    }
    return result.rows[0];
  }

  async getContentById(id: string): Promise<any> {
    const result = await pool.query('SELECT * FROM cms_content WHERE id = $1', [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

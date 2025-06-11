
import { executeQuery } from '../config/database';
import { logger } from '../utils/logger';

export interface CMSContent {
  id: string;
  content_key: string;
  content_type: string;
  title?: string;
  content: string;
  metadata?: Record<string, any>;
  country_code?: string;
  sector_slug?: string;
  language_code: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentFilters {
  country?: string;
  sector?: string;
  language?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class ContentModel {
  static async getContent(contentKey: string, options: {
    country?: string;
    sector?: string;
    language?: string;
  } = {}): Promise<CMSContent | null> {
    try {
      let query = `
        SELECT * FROM localized_content 
        WHERE content_key = $1
      `;
      const params: any[] = [contentKey];
      let paramIndex = 2;

      if (options.language) {
        query += ` AND language_code = $${paramIndex}`;
        params.push(options.language);
        paramIndex++;
      }

      if (options.country) {
        query += ` AND (country_code = $${paramIndex} OR country_code IS NULL)`;
        params.push(options.country);
        paramIndex++;
      }

      query += ` ORDER BY country_code DESC NULLS LAST, created_at DESC LIMIT 1`;

      const result = await executeQuery(query, params);
      
      if (!result.rows.length) {
        return null;
      }

      const row = result.rows[0];
      return this.transformToContent(row);
    } catch (error) {
      logger.error('Error fetching content:', error);
      throw error;
    }
  }

  static async getAllContent(filters: ContentFilters = {}): Promise<{
    content: CMSContent[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const { page = 1, limit = 10 } = filters;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (filters.language) {
        whereClause += ` AND language_code = $${paramIndex}`;
        params.push(filters.language);
        paramIndex++;
      }

      if (filters.country) {
        whereClause += ` AND (country_code = $${paramIndex} OR country_code IS NULL)`;
        params.push(filters.country);
        paramIndex++;
      }

      if (filters.status) {
        whereClause += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      // Count query
      const countQuery = `SELECT COUNT(*) FROM localized_content ${whereClause}`;
      const countResult = await executeQuery(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      // Data query
      const dataQuery = `
        SELECT * FROM localized_content 
        ${whereClause}
        ORDER BY updated_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      params.push(limit, offset);

      const result = await executeQuery(dataQuery, params);
      
      const content = result.rows.map(row => this.transformToContent(row));

      return {
        content,
        total,
        page,
        limit
      };
    } catch (error) {
      logger.error('Error fetching all content:', error);
      throw error;
    }
  }

  static async createContent(contentData: Partial<CMSContent>): Promise<CMSContent | null> {
    try {
      const query = `
        INSERT INTO localized_content (
          content_key, title, content, metadata, 
          country_code, language_code
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const params = [
        contentData.content_key,
        contentData.title,
        contentData.content,
        JSON.stringify(contentData.metadata || {}),
        contentData.country_code,
        contentData.language_code
      ];

      const result = await executeQuery(query, params);
      return this.transformToContent(result.rows[0]);
    } catch (error) {
      logger.error('Error creating content:', error);
      throw error;
    }
  }

  static async updateContent(id: string, updates: Partial<CMSContent>): Promise<CMSContent | null> {
    try {
      const setClauses = [];
      const params = [id];
      let paramIndex = 2;

      if (updates.title !== undefined) {
        setClauses.push(`title = $${paramIndex}`);
        params.push(updates.title);
        paramIndex++;
      }

      if (updates.content !== undefined) {
        setClauses.push(`content = $${paramIndex}`);
        params.push(updates.content);
        paramIndex++;
      }

      if (updates.metadata !== undefined) {
        setClauses.push(`metadata = $${paramIndex}`);
        params.push(JSON.stringify(updates.metadata));
        paramIndex++;
      }

      setClauses.push(`updated_at = NOW()`);

      const query = `
        UPDATE localized_content 
        SET ${setClauses.join(', ')}
        WHERE id = $1
        RETURNING *
      `;

      const result = await executeQuery(query, params);
      
      if (!result.rows.length) {
        return null;
      }

      return this.transformToContent(result.rows[0]);
    } catch (error) {
      logger.error('Error updating content:', error);
      throw error;
    }
  }

  static async deleteContent(id: string): Promise<boolean> {
    try {
      const query = 'DELETE FROM localized_content WHERE id = $1';
      const result = await executeQuery(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      logger.error('Error deleting content:', error);
      throw error;
    }
  }

  private static transformToContent(row: any): CMSContent {
    return {
      id: row.id,
      content_key: row.content_key,
      content_type: 'text',
      title: row.title,
      content: row.content || '',
      metadata: typeof row.metadata === 'object' ? row.metadata : {},
      country_code: row.country_code,
      sector_slug: null,
      language_code: row.language_code,
      status: 'published',
      version: 1,
      published_at: row.created_at,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

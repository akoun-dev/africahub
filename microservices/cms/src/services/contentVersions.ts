
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export class ContentVersions {
  async createContentVersion(contentId: string, contentData: any, userId: string): Promise<void> {
    await pool.query(`
      INSERT INTO cms_content_versions (content_id, version, content_data, created_by)
      VALUES ($1, $2, $3, $4)
    `, [
      contentId,
      contentData.version,
      JSON.stringify({
        title: contentData.title,
        content: contentData.content,
        metadata: contentData.metadata
      }),
      userId || 'system'
    ]);
  }

  async getContentVersions(id: string): Promise<any[]> {
    const result = await pool.query(`
      SELECT v.*, c.content_key 
      FROM cms_content_versions v
      JOIN cms_content c ON v.content_id = c.id
      WHERE v.content_id = $1
      ORDER BY v.version DESC
    `, [id]);

    return result.rows;
  }

  async getContentVersion(contentId: string, version: string): Promise<any> {
    const result = await pool.query(`
      SELECT content_data FROM cms_content_versions
      WHERE content_id = $1 AND version = $2
    `, [contentId, version]);

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async restoreContentVersion(id: string, version: string, userId: string): Promise<any> {
    // Get the version data
    const versionResult = await this.getContentVersion(id, version);
    if (!versionResult) {
      throw new Error('Version not found');
    }

    const versionData = versionResult.content_data;

    // Update content with version data
    const result = await pool.query(`
      UPDATE cms_content 
      SET title = $1, content = $2, metadata = $3, 
          version = version + 1, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [
      versionData.title,
      versionData.content,
      JSON.stringify(versionData.metadata),
      id
    ]);

    if (result.rows.length === 0) {
      throw new Error('Content not found');
    }

    const restoredContent = result.rows[0];

    // Create new version for the restore
    await this.createContentVersion(id, restoredContent, userId);

    return restoredContent;
  }
}

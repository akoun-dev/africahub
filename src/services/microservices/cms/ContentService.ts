
import { logger } from '@/utils/logger';
import { CMSContent, CMSContentOptions, CMSContentFilters, CMSPaginatedResponse } from './types';

export class ContentService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async getContent(contentKey: string, options: CMSContentOptions = {}): Promise<CMSContent | null> {
    try {
      const params = new URLSearchParams();
      if (options.country) params.append('country', options.country);
      if (options.sector) params.append('sector', options.sector);
      if (options.language) params.append('language', options.language);

      const url = `${this.baseURL}/api/v1/content/${contentKey}${params.toString() ? `?${params}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      logger.error('Failed to get content from CMS:', error);
      return null;
    }
  }

  async getAllContent(filters: CMSContentFilters = {}): Promise<CMSPaginatedResponse<CMSContent> | null> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseURL}/api/v1/content?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? {
        content: result.data,
        pagination: result.pagination
      } : null;
    } catch (error) {
      logger.error('Failed to get all content from CMS:', error);
      return null;
    }
  }

  async createContent(contentData: Partial<CMSContent>): Promise<CMSContent | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      logger.error('Failed to create content in CMS:', error);
      return null;
    }
  }

  async updateContent(id: string, updates: Partial<CMSContent>): Promise<CMSContent | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      logger.error('Failed to update content in CMS:', error);
      return null;
    }
  }

  async deleteContent(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/content/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      logger.error('Failed to delete content in CMS:', error);
      return false;
    }
  }

  async publishContent(id: string): Promise<CMSContent | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/content/${id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      logger.error('Failed to publish content in CMS:', error);
      return null;
    }
  }
}

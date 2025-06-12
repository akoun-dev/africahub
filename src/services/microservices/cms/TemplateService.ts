
import { logger } from '@/utils/logger';
import { CMSTemplate, CMSTemplateFilters } from './types';

export class TemplateService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async getTemplates(filters: CMSTemplateFilters = {}): Promise<CMSTemplate[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });

      const response = await fetch(`${this.baseURL}/api/v1/templates?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      logger.error('Failed to get templates from CMS:', error);
      return [];
    }
  }
}

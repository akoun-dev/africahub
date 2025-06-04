
import { ContentService } from './cms/ContentService';
import { TemplateService } from './cms/TemplateService';
import { CacheService } from './cms/CacheService';
import { 
  CMSContent, 
  CMSTemplate, 
  CMSContentOptions, 
  CMSContentFilters, 
  CMSTemplateFilters,
  CMSPaginatedResponse 
} from './cms/types';

// Re-export types for backward compatibility
export type { 
  CMSContent, 
  CMSTemplate, 
  CMSContentOptions, 
  CMSContentFilters, 
  CMSTemplateFilters,
  CMSPaginatedResponse 
};

class CMSMicroservice {
  private contentService: ContentService;
  private templateService: TemplateService;
  private cacheService: CacheService;

  constructor() {
    const baseURL = import.meta.env.VITE_CMS_SERVICE_URL || 'http://localhost:8000/cms';
    this.contentService = new ContentService(baseURL);
    this.templateService = new TemplateService(baseURL);
    this.cacheService = new CacheService(baseURL);
  }

  // Content operations
  async getContent(contentKey: string, options: CMSContentOptions = {}): Promise<CMSContent | null> {
    return this.contentService.getContent(contentKey, options);
  }

  async getAllContent(filters: CMSContentFilters = {}): Promise<CMSPaginatedResponse<CMSContent> | null> {
    return this.contentService.getAllContent(filters);
  }

  async createContent(contentData: Partial<CMSContent>): Promise<CMSContent | null> {
    return this.contentService.createContent(contentData);
  }

  async updateContent(id: string, updates: Partial<CMSContent>): Promise<CMSContent | null> {
    return this.contentService.updateContent(id, updates);
  }

  async deleteContent(id: string): Promise<boolean> {
    return this.contentService.deleteContent(id);
  }

  async publishContent(id: string): Promise<CMSContent | null> {
    return this.contentService.publishContent(id);
  }

  // Template operations
  async getTemplates(filters: CMSTemplateFilters = {}): Promise<CMSTemplate[]> {
    return this.templateService.getTemplates(filters);
  }

  // Cache operations
  async invalidateCache(pattern: string): Promise<boolean> {
    return this.cacheService.invalidateCache(pattern);
  }
}

export const cmsMicroservice = new CMSMicroservice();

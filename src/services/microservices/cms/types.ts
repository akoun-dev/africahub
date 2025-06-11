
export interface CMSContent {
  id: string;
  content_key: string;
  content_type: string;
  title?: string;
  content: string;
  metadata: Record<string, any>;
  country_code?: string;
  sector_slug?: string;
  language_code: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CMSTemplate {
  id: string;
  template_name: string;
  template_type: string;
  template_content: string;
  variables: string[];
  country_code?: string;
  sector_slug?: string;
  is_default: boolean;
}

export interface CMSContentFilters {
  country?: string;
  sector?: string;
  language?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CMSContentOptions {
  country?: string;
  sector?: string;
  language?: string;
}

export interface CMSPaginatedResponse<T> {
  content: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface CMSTemplateFilters {
  country?: string;
  sector?: string;
  type?: string;
}


export interface Sector {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectorCriteria {
  id: string;
  sector_id: string;
  name: string;
  data_type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  unit?: string;
  options?: Record<string, any>;
  is_required: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface SectorConfiguration {
  id: string;
  sector_id: string;
  theme_colors?: Record<string, any>;
  page_content?: Record<string, any>;
  email_templates?: Record<string, any>;
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

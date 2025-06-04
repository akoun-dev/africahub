
export interface TemplateConfig {
  currency: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  commissionRate: number;
  emailTemplates: string;
  regulatoryLevel: string;
}

export interface CountryTemplate {
  id: string;
  name: string;
  description: string;
  usageCount: number;
  countries: string[];
  config: TemplateConfig;
  lastUpdated: string;
}

export interface CountryTemplateManagerProps {
  selectedTemplate?: string;
  onTemplateSelect?: (templateId: string) => void;
}

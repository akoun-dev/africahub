
import { CountryTemplate } from './types';

export const mockTemplates: CountryTemplate[] = [
  {
    id: 'premium',
    name: 'Zone Premium',
    description: 'Configuration pour pays à forte économie',
    usageCount: 5,
    countries: ['NG', 'ZA', 'KE', 'EG'],
    config: {
      currency: 'USD',
      timezone: 'UTC+1',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'en-US',
      commissionRate: 15,
      emailTemplates: 'premium_set',
      regulatoryLevel: 'high'
    },
    lastUpdated: '2025-01-25'
  },
  {
    id: 'standard',
    name: 'Zone Standard',
    description: 'Configuration standard pour la plupart des pays',
    usageCount: 12,
    countries: ['SN', 'CI', 'GH', 'CM'],
    config: {
      currency: 'XOF',
      timezone: 'UTC+0',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'fr-FR',
      commissionRate: 10,
      emailTemplates: 'standard_set',
      regulatoryLevel: 'medium'
    },
    lastUpdated: '2025-01-20'
  },
  {
    id: 'emerging',
    name: 'Zone Émergente',
    description: 'Configuration adaptée aux économies émergentes',
    usageCount: 8,
    countries: ['ML', 'BF', 'NE', 'TD'],
    config: {
      currency: 'XOF',
      timezone: 'UTC+0',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'fr-FR',
      commissionRate: 8,
      emailTemplates: 'basic_set',
      regulatoryLevel: 'low'
    },
    lastUpdated: '2025-01-18'
  }
];

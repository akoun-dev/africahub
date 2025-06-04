
import { MockProduct } from './types';

export const mockProducts: MockProduct[] = [
  {
    id: '1',
    name: 'Assurance Auto Complète',
    sector: 'Assurance',
    company: 'Allianz Sénégal',
    status: 'active',
    countries: ['SN', 'CI', 'ML'],
    basePrice: 150000,
    versions: 3,
    lastUpdated: '2025-01-25'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    sector: 'Téléphonie',
    company: 'Orange',
    status: 'pending_approval',
    countries: ['SN', 'CI'],
    basePrice: 850000,
    versions: 1,
    lastUpdated: '2025-01-26'
  }
];


import { http, HttpResponse } from 'msw';

const mockProducts = [
  {
    id: '1',
    name: 'Assurance Auto Premium',
    brand: 'AXA Cameroun',
    price: 150000,
    currency: 'XAF',
    description: 'Couverture complète pour votre véhicule',
    is_active: true,
    country_availability: ['CM', 'SN'],
    criteria_values: [
      {
        id: '1',
        comparison_criteria: { id: '1', name: 'Note', data_type: 'number' },
        value: '8.5'
      },
      {
        id: '2', 
        comparison_criteria: { id: '2', name: 'Franchise', data_type: 'number' },
        value: '50000'
      }
    ]
  },
  {
    id: '2',
    name: 'Assurance Auto Basique',
    brand: 'NSIA Cameroun',
    price: 85000,
    currency: 'XAF',
    description: 'Protection essentielle au meilleur prix',
    is_active: true,
    country_availability: ['CM'],
    criteria_values: [
      {
        id: '3',
        comparison_criteria: { id: '1', name: 'Note', data_type: 'number' },
        value: '7.2'
      },
      {
        id: '4',
        comparison_criteria: { id: '2', name: 'Franchise', data_type: 'number' },
        value: '75000'
      }
    ]
  }
];

const mockSectors = [
  { id: '1', name: 'Auto', slug: 'auto', description: 'Assurance automobile', color: '#3B82F6', icon: 'Car' },
  { id: '2', name: 'Santé', slug: 'health', description: 'Assurance santé', color: '#10B981', icon: 'Shield' },
  { id: '3', name: 'Habitation', slug: 'home', description: 'Assurance habitation', color: '#F59E0B', icon: 'Home' },
  { id: '4', name: 'Micro-assurance', slug: 'micro', description: 'Micro-assurance', color: '#8B5CF6', icon: 'Sprout' }
];

const mockCompanies = [
  { id: '1', name: 'AXA Cameroun', sector_slug: 'auto' },
  { id: '2', name: 'NSIA Cameroun', sector_slug: 'auto' }
];

export const handlers = [
  // Products endpoints
  http.get('*/rest/v1/products_with_criteria', () => {
    return HttpResponse.json(mockProducts);
  }),

  http.get('*/rest/v1/products', () => {
    return HttpResponse.json(mockProducts);
  }),

  // Sectors endpoints
  http.get('*/rest/v1/sectors', () => {
    return HttpResponse.json(mockSectors);
  }),

  // Companies endpoints
  http.get('*/rest/v1/companies', () => {
    return HttpResponse.json(mockCompanies);
  }),

  // AI Recommendations endpoints
  http.get('*/rest/v1/ai_recommendations', () => {
    return HttpResponse.json([
      {
        id: '1',
        user_id: 'test-user',
        product_id: '1',
        recommendation_score: 0.85,
        reasoning: 'Excellent rapport qualité-prix pour votre profil',
        insurance_type: 'auto',
        created_at: new Date().toISOString(),
        products: mockProducts[0]
      }
    ]);
  }),

  // Auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-token',
      user: { id: 'test-user', email: 'test@example.com' }
    });
  })
];

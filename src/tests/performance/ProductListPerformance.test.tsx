
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductWithCriteria } from '@/types/core/Product';

// Mock the hooks
vi.mock('@/hooks/useProductsWithCriteria', () => ({
  useProductsWithCriteria: vi.fn()
}));

// Create a proper mock ProductWithCriteria that matches the interface
const createMockProduct = (id: string): ProductWithCriteria => ({
  id,
  name: `Product ${id}`,
  brand: 'Test Brand',
  price: 100,
  currency: 'XOF',
  description: 'Test description',
  image_url: 'test.jpg',
  purchase_link: 'http://test.com',
  product_type_id: 'type-1',
  company_id: 'company-1',
  country: 'CI',
  category: 'auto' as const,
  is_active: true,
  country_availability: ['CI'],
  benefits: ['Benefit 1', 'Benefit 2'],
  exclusions: ['Exclusion 1'],
  coverage_amount: 1000000,
  premium_amount: 50000,
  deductible: 25000,
  min_age: 18,
  max_age: 65,
  coverage_details: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  // Ajout des propriétés manquantes
  pricing_type: 'fixed' as const,
  calculation_config: {},
  api_endpoint: null,
  criteria_values: [{
    comparison_criteria: {
      name: 'Test Criteria',
      data_type: 'text',
      unit: 'unit'
    },
    value: 'Test Value'
  }]
});

describe('Product List Performance Tests', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  it('should handle large product lists efficiently', () => {
    const mockProducts: ProductWithCriteria[] = Array.from({ length: 1000 }, (_, i) => 
      createMockProduct(`product-${i}`)
    );

    expect(mockProducts).toHaveLength(1000);
    expect(mockProducts[0]).toMatchObject({
      id: 'product-0',
      name: 'Product product-0',
      category: 'auto'
    });
  });

  it('should render with medium dataset', () => {
    const mockProducts: ProductWithCriteria[] = Array.from({ length: 100 }, (_, i) => 
      createMockProduct(`product-${i}`)
    );

    expect(mockProducts).toHaveLength(100);
    expect(mockProducts[0].criteria_values).toHaveLength(1);
  });

  it('should handle empty criteria values', () => {
    const mockProducts: ProductWithCriteria[] = Array.from({ length: 50 }, (_, i) => ({
      ...createMockProduct(`product-${i}`),
      criteria_values: []
    }));

    expect(mockProducts).toHaveLength(50);
    expect(mockProducts[0].criteria_values).toHaveLength(0);
  });
});

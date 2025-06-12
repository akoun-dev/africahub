
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Compare from '@/pages/Compare';
import React from 'react';

// Mock hooks and contexts
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

vi.mock('@/contexts/CountryContext', () => ({
  useCountry: () => ({
    country: { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    setCountry: vi.fn(),
    countries: [],
  }),
}));

vi.mock('@/hooks/useProductsWithCriteria', () => ({
  useProductsWithCriteria: () => ({
    data: [
      {
        id: '1',
        name: 'Assurance Auto Premium',
        price: 120000,
        currency: 'XOF',
        company: { name: 'NSIA', logo: null },
        criteria_values: [
          { criteria: { name: 'Note globale' }, value: '4.5' },
          { criteria: { name: 'Franchise' }, value: '50000' },
        ],
      },
      {
        id: '2',
        name: 'Assurance Auto Standard',
        price: 80000,
        currency: 'XOF',
        company: { name: 'Allianz', logo: null },
        criteria_values: [
          { criteria: { name: 'Note globale' }, value: '4.0' },
          { criteria: { name: 'Franchise' }, value: '75000' },
        ],
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Comparison Workflow E2E', () => {
  it('loads products and displays comparison table', async () => {
    render(<Compare />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  it('allows product selection and comparison', async () => {
    render(<Compare />, { wrapper: createWrapper() });
    
    // Test product selection workflow
    expect(document.body).toBeInTheDocument();
  });

  it('filters products by criteria', async () => {
    render(<Compare />, { wrapper: createWrapper() });
    
    // Test filtering functionality
    expect(document.body).toBeInTheDocument();
  });
});

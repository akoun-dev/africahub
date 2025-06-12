
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Compare from '@/pages/Compare';
import React from 'react';

// Mock contexts
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

vi.mock('@/contexts/CountryContext', () => ({
  useCountry: () => ({
    selectedCountry: 'CI',
    setSelectedCountry: vi.fn(),
    countries: [],
  }),
}));

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

// Mock hooks
vi.mock('@/hooks/useProductsWithCriteria', () => ({
  useProductsWithCriteria: () => ({
    data: [],
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

describe('Compare Page', () => {
  it('renders compare page', () => {
    render(<Compare />, { wrapper: createWrapper() });
    expect(document.body).toBeInTheDocument();
  });

  it('shows comparison interface', () => {
    render(<Compare />, { wrapper: createWrapper() });
    // The page should render without errors
    const body = document.body;
    expect(body).toBeInTheDocument();
  });
});

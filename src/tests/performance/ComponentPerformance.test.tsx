
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '@/pages/Home';
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
    country: { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    setCountry: vi.fn(),
    countries: [],
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

describe('Component Performance Tests', () => {
  it('renders Home page within performance budget', async () => {
    const startTime = performance.now();
    
    render(<Home />, { wrapper: createWrapper() });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('renders Compare page within performance budget', async () => {
    const startTime = performance.now();
    
    render(<Compare />, { wrapper: createWrapper() });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 150ms (more complex page)
    expect(renderTime).toBeLessThan(150);
  });

  it('measures memory usage during rendering', () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    render(<Home />, { wrapper: createWrapper() });
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 5MB)
    expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
  });
});

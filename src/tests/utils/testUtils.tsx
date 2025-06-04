
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CountryProvider } from '@/contexts/CountryContext';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CountryProvider>
            {children}
          </CountryProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library/react
export * from '@testing-library/react';
export { customRender as render, screen, fireEvent, waitFor, userEvent };

// Mock data factories
export const createMockProduct = (overrides = {}) => ({
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  currency: 'XOF',
  brand: 'Test Brand',
  is_active: true,
  country_availability: ['CM', 'SN'],
  criteria_values: [],
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  user_metadata: {},
  ...overrides,
});

export function createMockApiResponse<T>(data: T, overrides = {}) {
  return {
    success: true,
    data,
    message: 'Success',
    count: Array.isArray(data) ? data.length : 1,
    ...overrides,
  };
}

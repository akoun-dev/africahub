
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '@/pages/Home';
import React from 'react';

// Mock all contexts and hooks
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('@/contexts/CountryContext', () => ({
  useCountry: () => ({
    selectedCountry: 'CI',
    setSelectedCountry: vi.fn(),
    countries: [
      { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
      { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    ],
  }),
}));

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
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

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />, { wrapper: createWrapper() });
    // Just check that it renders without throwing
    expect(document.body).toBeInTheDocument();
  });

  it('contains main sections', () => {
    render(<Home />, { wrapper: createWrapper() });
    
    // Check for common elements that should be present
    const mainElement = document.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });
});

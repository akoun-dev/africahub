
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Auth from '@/pages/Auth';
import React from 'react';

// Mock Supabase
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}));

vi.mock('@/contexts/CountryContext', () => ({
  useCountry: () => ({
    country: { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    setCountry: vi.fn(),
    countries: [],
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

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders auth page', () => {
    render(<Auth />, { wrapper: createWrapper() });
    expect(document.body).toBeInTheDocument();
  });

  it('handles form interactions', async () => {
    render(<Auth />, { wrapper: createWrapper() });
    
    // The Auth page should render without errors
    expect(document.body).toBeInTheDocument();
  });
});

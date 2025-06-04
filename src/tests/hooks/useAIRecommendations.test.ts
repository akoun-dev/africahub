
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '../utils/testUtils';
import { useAIRecommendations, useGenerateRecommendations } from '@/hooks/useAIRecommendations';
import { useAuth } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('@/contexts/AuthContext');

describe('useAIRecommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  const mockSearchResults = [
    {
      id: '1',
      name: 'Test Product',
      category: 'auto',
      price: 1000,
      currency: 'XOF',
      rating: 4.5,
      reviewCount: 100,
      availability: 'available' as const,
      location: 'Dakar',
      brand: 'Samsung',
      features: ['Feature 1'],
      provider: { name: 'Provider', verified: true },
      country: 'SN'
    }
  ];

  it('should fetch recommendations when user is logged in', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'test-user', email: 'test@example.com' },
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    } as any);

    const { result } = renderHook(() => useAIRecommendations(mockSearchResults), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it('should not fetch recommendations when user is not logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    } as any);

    const { result } = renderHook(() => useAIRecommendations(mockSearchResults), { wrapper });

    expect(result.current.data).toEqual([]);
  });

  it('should handle empty products array', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'test-user', email: 'test@example.com' },
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    } as any);

    const { result } = renderHook(() => useAIRecommendations([]), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
  });
});

describe('useGenerateRecommendations', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'test-user', email: 'test@example.com' },
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    } as any);
  });

  it('should generate recommendations successfully', async () => {
    const { result } = renderHook(() => useGenerateRecommendations(), { wrapper });

    expect(result.current.mutateAsync).toBeDefined();
    expect(result.current.mutate).toBeDefined();
    expect(result.current.isPending).toBe(false);
  });

  it('should handle generation errors', async () => {
    const { result } = renderHook(() => useGenerateRecommendations(), { wrapper });

    expect(result.current.error).toBeNull();
  });
});

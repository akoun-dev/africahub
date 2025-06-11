
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '../utils/testUtils';
import { useProductsWithCriteria } from '@/hooks/useProductsWithCriteria';
import { useSectors } from '@/hooks/useSectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('@/hooks/useSectors');

describe('useProductsWithCriteria', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSectors).mockReturnValue({
      data: [
        { id: '1', name: 'Auto', slug: 'auto', description: 'Assurance automobile', color: '#3B82F6', icon: 'Car' }
      ],
      isLoading: false,
      error: null
    } as any);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  it('should fetch products with criteria for a sector', async () => {
    const { result } = renderHook(() => useProductsWithCriteria('auto'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('should return empty array when sector not found', async () => {
    vi.mocked(useSectors).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    } as any);

    const { result } = renderHook(() => useProductsWithCriteria('nonexistent'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
  });

  it('should handle loading state correctly', () => {
    vi.mocked(useSectors).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    } as any);

    const { result } = renderHook(() => useProductsWithCriteria('auto'), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle sector loading state', () => {
    vi.mocked(useSectors).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    } as any);

    const { result } = renderHook(() => useProductsWithCriteria('auto'), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });
});

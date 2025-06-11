
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { waitFor } from '../utils/testUtils';
import { useProducts, useProduct, useComparison } from '@/hooks/useApiService';
import { ApiService } from '@/services/ApiService';

vi.mock('@/services/ApiService');

describe('useApiService hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useProducts', () => {
    it('should fetch products on mount', async () => {
      const mockProducts = {
        success: true,
        data: [{ id: '1', name: 'Product 1' }],
        count: 1
      };

      vi.mocked(ApiService.getProducts).mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useProducts({ sector: 'auto' }));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProducts.data);
      expect(result.current.error).toBe(null);
      expect(ApiService.getProducts).toHaveBeenCalledWith({ sector: 'auto' });
    });

    it('should handle errors gracefully', async () => {
      const errorMessage = 'Failed to fetch products';
      vi.mocked(ApiService.getProducts).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should refetch when filters change', async () => {
      const mockProducts = { success: true, data: [], count: 0 };
      vi.mocked(ApiService.getProducts).mockResolvedValue(mockProducts);

      const { result, rerender } = renderHook(
        ({ filters }) => useProducts(filters),
        { initialProps: { filters: { sector: 'auto' } } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(ApiService.getProducts).toHaveBeenCalledTimes(1);

      rerender({ filters: { sector: 'health' } });

      await waitFor(() => {
        expect(ApiService.getProducts).toHaveBeenCalledTimes(2);
      });

      expect(ApiService.getProducts).toHaveBeenLastCalledWith({ sector: 'health' });
    });
  });

  describe('useProduct', () => {
    it('should fetch single product by ID', async () => {
      const mockProduct = {
        success: true,
        data: { id: '1', name: 'Product 1' }
      };

      vi.mocked(ApiService.getProductById).mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useProduct('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProduct.data);
      expect(ApiService.getProductById).toHaveBeenCalledWith('1');
    });

    it('should not fetch when no ID provided', () => {
      const { result } = renderHook(() => useProduct(''));

      expect(result.current.loading).toBe(true);
      expect(ApiService.getProductById).not.toHaveBeenCalled();
    });
  });

  describe('useComparison', () => {
    it('should compare products successfully', async () => {
      const mockComparison = {
        success: true,
        data: { comparison_matrix: {}, scores: {} }
      };

      vi.mocked(ApiService.compareProducts).mockResolvedValue(mockComparison);

      const { result } = renderHook(() => useComparison());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      const comparisonResult = await result.current.compareProducts(['1', '2']);

      expect(comparisonResult).toEqual(mockComparison.data);
      expect(ApiService.compareProducts).toHaveBeenCalledWith(['1', '2'], {});
    });

    it('should get recommendations successfully', async () => {
      const mockRecommendations = {
        success: true,
        data: [{ product_id: '1', score: 8.5 }]
      };

      vi.mocked(ApiService.getRecommendations).mockResolvedValue(mockRecommendations);

      const { result } = renderHook(() => useComparison());

      const recommendations = await result.current.getRecommendations('auto', 'CM');

      expect(recommendations).toEqual(mockRecommendations.data);
      expect(ApiService.getRecommendations).toHaveBeenCalledWith('auto', 'CM', {});
    });
  });
});


import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiService } from '@/services/ApiService';

// Mock fetch globally
global.fetch = vi.fn();

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  describe('getProducts', () => {
    it('should fetch products with filters', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: '1', name: 'Product 1' },
          { id: '2', name: 'Product 2' }
        ],
        count: 2
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await ApiService.getProducts({ sector: 'auto', country: 'CM' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(ApiService.getProducts()).rejects.toThrow('Internal Server Error');
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(ApiService.getProducts()).rejects.toThrow('Network error');
    });
  });

  describe('getProductById', () => {
    it('should fetch single product by ID', async () => {
      const mockProduct = {
        success: true,
        data: { id: '1', name: 'Product 1' }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      });

      const result = await ApiService.getProductById('1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/products/1'),
        expect.objectContaining({
          method: 'GET'
        })
      );

      expect(result).toEqual(mockProduct);
    });

    it('should handle product not found', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(ApiService.getProductById('999')).rejects.toThrow('Not Found');
    });
  });

  describe('compareProducts', () => {
    it('should compare multiple products', async () => {
      const mockComparison = {
        success: true,
        data: {
          comparison_matrix: {
            '1': { score: 8.5, rank: 1 },
            '2': { score: 7.2, rank: 2 }
          },
          scores: { '1': 8.5, '2': 7.2 }
        }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComparison)
      });

      const result = await ApiService.compareProducts(['1', '2'], { criteria: 'price' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compare'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            product_ids: ['1', '2'],
            preferences: { criteria: 'price' }
          })
        })
      );

      expect(result).toEqual(mockComparison);
    });

    it('should handle empty product list', async () => {
      await expect(ApiService.compareProducts([])).rejects.toThrow();
    });
  });

  describe('getRecommendations', () => {
    it('should fetch recommendations for sector and country', async () => {
      const mockRecommendations = {
        success: true,
        data: [
          { product_id: '1', score: 8.5, reason: 'Best value' },
          { product_id: '2', score: 7.8, reason: 'Good coverage' }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendations)
      });

      const result = await ApiService.getRecommendations('auto', 'CM', { budget: 'high' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/recommendations'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            sector: 'auto',
            country: 'CM',
            preferences: { budget: 'high' }
          })
        })
      );

      expect(result).toEqual(mockRecommendations);
    });

    it('should handle missing required parameters', async () => {
      await expect(ApiService.getRecommendations('', '')).rejects.toThrow();
    });
  });

  describe('API error handling', () => {
    it('should handle 401 unauthorized', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      await expect(ApiService.getProducts()).rejects.toThrow('Unauthorized');
    });

    it('should handle 403 forbidden', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });

      await expect(ApiService.getProducts()).rejects.toThrow('Forbidden');
    });

    it('should handle 429 rate limit', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });

      await expect(ApiService.getProducts()).rejects.toThrow('Too Many Requests');
    });
  });
});

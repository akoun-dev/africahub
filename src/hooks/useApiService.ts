
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/ApiService';

// Types pour les réponses des APIs
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export const useProducts = (filters: any = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await ApiService.getProducts(filters) as ApiResponse<any>;
      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchProducts 
  };
};

export const useProduct = (id: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await ApiService.getProductById(id) as ApiResponse<any>;
        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { data, loading, error };
};

export const useComparison = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compareProducts = async (productIds: string[], options: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.compareProducts(productIds, options) as ApiResponse<any>;
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async (sectorSlug: string, countryCode: string, options: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.getRecommendations(sectorSlug, countryCode, options) as ApiResponse<any>;
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    compareProducts,
    getRecommendations,
    loading,
    error
  };
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await ApiService.getUserProfile() as ApiResponse<any>;
      setProfile(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const result = await ApiService.updateUserProfile(updates) as ApiResponse<any>;
      setProfile(result.data);
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};


import { useState, useEffect } from 'react';
import { OfflineCacheService } from '@/services/cache/OfflineCacheService';

interface UseOfflineCacheOptions {
  ttl?: number;
  enableOfflineMode?: boolean;
}

export const useOfflineCache = <T,>(
  key: string,
  fetchFunction: () => Promise<T>,
  options: UseOfflineCacheOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const cache = OfflineCacheService.getInstance();
  const { ttl, enableOfflineMode = true } = options;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      if (!forceRefresh) {
        const cachedData = await cache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setIsFromCache(true);
          setLoading(false);
          
          // If offline, return cached data
          if (!isOnline && enableOfflineMode) {
            return;
          }
        }
      }

      // If online, try to fetch fresh data
      if (isOnline) {
        const freshData = await fetchFunction();
        setData(freshData);
        setIsFromCache(false);
        
        // Cache the fresh data
        await cache.set(key, freshData, ttl);
      } else if (!data && enableOfflineMode) {
        // If offline and no cached data, show error
        setError('Mode hors ligne - aucune donnée en cache disponible');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      
      // If online fetch fails, try to use cached data
      if (enableOfflineMode) {
        const cachedData = await cache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setIsFromCache(true);
          setError('Utilisation des données en cache (erreur réseau)');
        } else {
          setError('Erreur de connexion et aucune donnée en cache');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => fetchData(true);

  const clearCache = async () => {
    await cache.remove(key);
  };

  useEffect(() => {
    fetchData();
  }, [key, isOnline]);

  return {
    data,
    loading,
    error,
    isFromCache,
    isOnline,
    refreshData,
    clearCache
  };
};

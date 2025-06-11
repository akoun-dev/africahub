
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
}

export const useRecommendationErrorHandler = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const defaultConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const withRetry = useCallback(async <T,>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> => {
    const { maxRetries, retryDelay, exponentialBackoff } = { ...defaultConfig, ...config };
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          setIsRetrying(true);
          const delay = exponentialBackoff ? retryDelay * Math.pow(2, attempt - 1) : retryDelay;
          await sleep(delay);
        }

        const result = await operation();
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        lastError = error as Error;
        setRetryCount(attempt + 1);

        if (attempt === maxRetries) {
          setIsRetrying(false);
          throw lastError;
        }

        console.warn(`Attempt ${attempt + 1} failed, retrying...`, error);
        toast({
          title: `Tentative ${attempt + 1} échouée`,
          description: `Nouvelle tentative dans ${exponentialBackoff ? retryDelay * Math.pow(2, attempt) : retryDelay}ms`,
          variant: "default",
        });
      }
    }

    throw lastError!;
  }, []);

  const withFallback = useCallback(async <T,>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    config?: Partial<RetryConfig>
  ): Promise<T> => {
    try {
      return await withRetry(primaryOperation, config);
    } catch (primaryError) {
      console.warn('Primary operation failed, using fallback:', primaryError);
      toast({
        title: "Utilisation du système de secours",
        description: "Tentative avec une méthode alternative",
        variant: "default",
      });

      try {
        return await withRetry(fallbackOperation, { ...config, maxRetries: 1 });
      } catch (fallbackError) {
        console.error('Both primary and fallback operations failed:', { primaryError, fallbackError });
        toast({
          title: "Erreur système",
          description: "Impossible d'effectuer l'opération. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        throw fallbackError;
      }
    }
  }, [withRetry]);

  const handleError = useCallback((error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    
    const errorMessages: Record<string, string> = {
      'network': 'Problème de connexion réseau',
      'timeout': 'Délai d\'attente dépassé',
      'server': 'Erreur du serveur',
      'unauthorized': 'Non autorisé',
      'not_found': 'Ressource non trouvée',
      'validation': 'Données invalides',
      'default': 'Une erreur inattendue s\'est produite'
    };

    const errorType = error.message.toLowerCase().includes('network') ? 'network' :
                     error.message.toLowerCase().includes('timeout') ? 'timeout' :
                     error.message.toLowerCase().includes('401') ? 'unauthorized' :
                     error.message.toLowerCase().includes('404') ? 'not_found' :
                     error.message.toLowerCase().includes('400') ? 'validation' :
                     error.message.toLowerCase().includes('5') ? 'server' : 'default';

    toast({
      title: "Erreur",
      description: errorMessages[errorType],
      variant: "destructive",
    });

    return errorType;
  }, []);

  return {
    withRetry,
    withFallback,
    handleError,
    retryCount,
    isRetrying
  };
};

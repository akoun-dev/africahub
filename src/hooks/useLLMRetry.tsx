
import { useCallback } from 'react';

export const useLLMRetry = () => {
  const executeWithRetry = useCallback(async (
    operation: (fallbackProvider?: string) => Promise<any>,
    onError?: (attempt: number, error: any, nextProvider?: string) => void
  ) => {
    try {
      return await operation();
    } catch (error) {
      console.error('LLM operation failed:', error);
      if (onError) {
        onError(1, error, 'fallback-provider');
      }
      throw error;
    }
  }, []);

  return {
    executeWithRetry
  };
};


import { useState, useCallback } from 'react';
import { PricingCalculationService } from '@/services/PricingCalculationService';
import type { PricingCalculationRequest, PricingCalculationResponse } from '@/types/pricing';
import { toast } from 'sonner';

interface UsePricingCalculationReturn {
  calculatePrice: (request: PricingCalculationRequest) => Promise<PricingCalculationResponse>;
  loading: boolean;
  error: string | null;
  lastCalculation: PricingCalculationResponse | null;
}

export const usePricingCalculation = (): UsePricingCalculationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCalculation, setLastCalculation] = useState<PricingCalculationResponse | null>(null);

  const calculatePrice = useCallback(async (request: PricingCalculationRequest): Promise<PricingCalculationResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await PricingCalculationService.calculatePrice(request);
      
      setLastCalculation(result);
      
      if (!result.success) {
        setError(result.error || 'Erreur lors du calcul');
        toast.error(result.error || 'Erreur lors du calcul du prix');
      } else {
        setError(null);
      }

      return result;
    } catch (error) {
      const errorMessage = 'Erreur technique lors du calcul';
      setError(errorMessage);
      toast.error(errorMessage);
      
      const failedResult: PricingCalculationResponse = {
        success: false,
        error: errorMessage
      };
      
      setLastCalculation(failedResult);
      return failedResult;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    calculatePrice,
    loading,
    error,
    lastCalculation
  };
};

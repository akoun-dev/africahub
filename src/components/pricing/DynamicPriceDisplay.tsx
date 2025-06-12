
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePricingCalculation } from '@/hooks/usePricingCalculation';
import { Calculator, RefreshCw, AlertCircle } from 'lucide-react';
import type { Product } from '@/types/core/Product';

interface DynamicPriceDisplayProps {
  product: Product;
  userCriteria: Record<string, any>;
  autoCalculate?: boolean;
  onPriceCalculated?: (price: number, currency: string) => void;
}

export const DynamicPriceDisplay: React.FC<DynamicPriceDisplayProps> = ({
  product,
  userCriteria,
  autoCalculate = false,
  onPriceCalculated
}) => {
  const { calculatePrice, loading, error, lastCalculation } = usePricingCalculation();
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    if (autoCalculate && !hasCalculated && Object.keys(userCriteria).length > 0) {
      handleCalculatePrice();
    }
  }, [autoCalculate, userCriteria, hasCalculated]);

  const handleCalculatePrice = async () => {
    if (!product || Object.keys(userCriteria).length === 0) return;

    const result = await calculatePrice({
      productId: product.id,
      userCriteria
    });

    setHasCalculated(true);

    if (result.success && result.price && onPriceCalculated) {
      onPriceCalculated(result.price, result.currency || 'XOF');
    }
  };

  // Affichage pour les prix fixes
  if (product.pricing_type === 'fixed') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-afroGreen">
          {product.price} {product.currency || 'XOF'}
        </span>
        <Badge variant="outline" className="text-xs">
          Prix fixe
        </Badge>
      </div>
    );
  }

  // Affichage pour les prix calculés
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4 text-brandBlue" />
        <span className="text-sm font-medium text-gray-700">Prix calculé</span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Calcul en cours...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {lastCalculation?.success && lastCalculation.price && (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-afroGreen">
            {lastCalculation.price} {lastCalculation.currency}
          </span>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
            Calculé
          </Badge>
        </div>
      )}

      {!hasCalculated && !loading && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleCalculatePrice}
          disabled={Object.keys(userCriteria).length === 0}
          className="text-xs"
        >
          <Calculator className="h-3 w-3 mr-1" />
          Calculer le prix
        </Button>
      )}

      {hasCalculated && !loading && lastCalculation?.success && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCalculatePrice}
          className="text-xs text-gray-600"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Recalculer
        </Button>
      )}
    </div>
  );
};

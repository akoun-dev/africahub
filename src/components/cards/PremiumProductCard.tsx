
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Star, TrendingUp, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price?: number;
    currency?: string;
    description?: string;
    features?: string[];
    rating?: number;
    popular?: boolean;
    recommended?: boolean;
  };
  criteria?: Array<{
    id: string;
    name: string;
    value: string;
    type: string;
    unit?: string;
  }>;
  sectorColor?: string;
  onCompare?: (productId: string) => void;
  onQuote?: (productId: string) => void;
  delay?: number;
}

export const PremiumProductCard: React.FC<PremiumProductCardProps> = ({
  product,
  criteria = [],
  sectorColor = '#009639',
  onCompare,
  onQuote,
  delay = 0
}) => {
  const renderCriteriaValue = (criterion: any) => {
    if (criterion.type === 'boolean') {
      return criterion.value === 'true' ? 
        <Check className="w-4 h-4 text-emerald-600" /> : 
        <X className="w-4 h-4 text-red-500" />;
    }
    return `${criterion.value}${criterion.unit ? ` ${criterion.unit}` : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="h-full"
    >
      <Card className={`h-full group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white relative ${
        product.recommended ? 'ring-2 ring-afroGold ring-opacity-50' : ''
      }`}>
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[url('/patterns/kente-pattern.svg')] opacity-5 group-hover:opacity-10 transition-opacity"></div>
        
        {/* Premium gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${sectorColor}20, ${sectorColor}05)` }}
        ></div>

        {/* Badges */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {product.popular && (
            <Badge className="bg-afroRed text-white px-3 py-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Populaire
            </Badge>
          )}
          {product.recommended && (
            <Badge className="bg-afroGold text-afroBlack px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              Recommandé
            </Badge>
          )}
        </div>

        <CardHeader className="relative z-10 pb-4">
          {/* Brand and product name */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {product.brand}
            </p>
            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors leading-tight">
              {product.name}
            </CardTitle>
          </div>

          {/* Rating and price */}
          <div className="flex items-center justify-between pt-2">
            {product.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-afroGold fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
            
            {product.price ? (
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: sectorColor }}>
                  {product.price}
                </div>
                <div className="text-sm text-gray-500">
                  {product.currency || 'CFA'}/mois
                </div>
              </div>
            ) : (
              <Badge variant="outline" className="text-gray-600">
                Sur demande
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Description */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed text-sm line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Key features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                <Shield className="w-4 h-4 mr-2" style={{ color: sectorColor }} />
                Caractéristiques clés
              </h4>
              <div className="space-y-1">
                {product.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="w-3 h-3 mr-2 text-emerald-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Criteria comparison */}
          {criteria.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                <Zap className="w-4 h-4 mr-2" style={{ color: sectorColor }} />
                Comparaison
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {criteria.slice(0, 4).map((criterion) => (
                  <div key={criterion.id} className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500 truncate">
                      {criterion.name}
                    </div>
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      {renderCriteriaValue(criterion)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCompare?.(product.id)}
              className="flex-1 border-gray-300 hover:border-gray-400 transition-all"
            >
              Comparer
            </Button>
            <Button
              size="sm"
              onClick={() => onQuote?.(product.id)}
              className="flex-1 text-white hover:brightness-110 transition-all"
              style={{ backgroundColor: sectorColor }}
            >
              Devis
            </Button>
          </div>
        </CardContent>

        {/* Bottom accent line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          style={{ backgroundColor: sectorColor }}
        ></div>
      </Card>
    </motion.div>
  );
};

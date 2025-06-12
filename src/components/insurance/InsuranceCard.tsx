
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface InsuranceCardProps {
  provider: Product & { 
    product_types?: { slug: string; name: string };
    criteria_values?: Array<{
      comparison_criteria: { name: string; data_type: string; unit?: string };
      value: string;
    }>;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
  priceLabel: string;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({ 
  provider, 
  isSelected, 
  onSelect,
  priceLabel 
}) => {
  // Extract rating from criteria values
  const ratingCriteria = provider.criteria_values?.find(
    cv => cv.comparison_criteria.name === 'Note'
  );
  const rating = ratingCriteria ? parseFloat(ratingCriteria.value) : 4.0;

  // Extract franchise from criteria values
  const franchiseCriteria = provider.criteria_values?.find(
    cv => cv.comparison_criteria.name === 'Franchise'
  );
  const franchise = franchiseCriteria ? franchiseCriteria.value : '0';

  // Extract coverage limit from criteria values
  const coverageCriteria = provider.criteria_values?.find(
    cv => cv.comparison_criteria.name === 'Limite de couverture'
  );
  const coverageLimit = coverageCriteria ? coverageCriteria.value : 'Non spécifié';

  // Get boolean features from criteria values
  const features = provider.criteria_values?.filter(
    cv => cv.comparison_criteria.data_type === 'boolean' && cv.value === 'true'
  ).map(cv => cv.comparison_criteria.name) || [];

  // Check if adapted to African market (simplified check)
  const africanSpecific = provider.country_availability && 
    provider.country_availability.some(country => 
      ['Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Senegal', 'Ethiopia'].includes(country)
    );

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
      </div>
    );
  };

  return (
    <Card className={`insurance-card relative ${isSelected ? 'ring-2 ring-afroGreen' : ''}`}>
      <CardContent className="p-0">
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">{provider.name}</h3>
              <p className="text-sm text-gray-500">{provider.brand}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-afroGreen">
                {provider.price} {provider.currency}
                <span className="text-sm font-normal text-gray-500">{priceLabel}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            {renderRatingStars(rating)}
          </div>
          
          <div className="mb-4 flex-grow">
            <h4 className="font-semibold text-sm mb-2">Garanties incluses:</h4>
            <ul className="space-y-1">
              {features.length > 0 ? (
                features.slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-afroGreen mr-2" />
                    {feature}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">Informations en cours de chargement...</li>
              )}
            </ul>
            {features.length > 4 && (
              <p className="text-xs text-gray-500 mt-1">+{features.length - 4} autres garanties</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-500">Plafond:</p>
              <p className="font-medium">{coverageLimit}</p>
            </div>
            <div>
              <p className="text-gray-500">Franchise:</p>
              <p className="font-medium">{franchise} {provider.currency}</p>
            </div>
          </div>
          
          {africanSpecific && (
            <div className="mb-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FCD116]/20 text-[#CE1126]">
                Adapté au marché africain
              </span>
            </div>
          )}

          {provider.description && (
            <div className="mb-4">
              <p className="text-xs text-gray-600">{provider.description}</p>
            </div>
          )}
          
          <Button 
            className={isSelected 
              ? "bg-gray-200 hover:bg-gray-300 text-gray-800" 
              : "bg-afroGreen hover:bg-afroGreen/80 text-white"
            }
            onClick={() => onSelect(provider.id)}
          >
            {isSelected ? "Sélectionné" : "Sélectionner"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { InsuranceCard } from './InsuranceCard';
import { Country } from '@/components/CountrySelector';
import { Product } from '@/hooks/useProducts';

interface InsuranceTabContentProps {
  tabValue: string;
  providers: (Product & { 
    product_types?: { slug: string; name: string };
    criteria_values?: Array<{
      comparison_criteria: { name: string; data_type: string; unit?: string };
      value: string;
    }>;
  })[];
  selectedItems: string[];
  toggleSelect: (id: string) => void;
  selectedCountry: Country;
  priceLabel: string;
}

export const InsuranceTabContent: React.FC<InsuranceTabContentProps> = ({
  tabValue,
  providers,
  selectedItems,
  toggleSelect,
  selectedCountry,
  priceLabel
}) => {
  return (
    <TabsContent value={tabValue} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers && providers.length > 0 ? (
          providers.map((provider) => (
            <InsuranceCard
              key={provider.id}
              provider={provider}
              isSelected={selectedItems.includes(provider.id)}
              onSelect={toggleSelect}
              priceLabel={priceLabel}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500">
              Aucune offre d'assurance {tabValue === 'auto' ? 'auto' : 
                                       tabValue === 'home' ? 'habitation' : 
                                       tabValue === 'health' ? 'santé' : 
                                       'microassurance'} disponible pour {selectedCountry.name} pour le moment.
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

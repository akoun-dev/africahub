
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useSectorProducts, SectorProduct } from '@/hooks/useSectorProducts';
import { useCountry } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ExternalLink, BarChart3, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface SectorComparisonInterfaceProps {
  sectorSlug: string;
  sectorName: string;
}

export const SectorComparisonInterface: React.FC<SectorComparisonInterfaceProps> = ({
  sectorSlug,
  sectorName
}) => {
  const { country } = useCountry();
  const { t } = useTranslation();
  const { data: products, isLoading } = useSectorProducts(sectorSlug, country.code);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleProductSelect = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      if (selectedProducts.length >= 3) {
        toast.error(t('validation.comparison.select_maximum'));
        return;
      }
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleCompare = () => {
    if (selectedProducts.length < 2) {
      toast.error(t('validation.comparison.select_minimum'));
      return;
    }
    setShowComparison(true);
  };

  const selectedProductsData = products?.filter(p => selectedProducts.includes(p.id)) || [];
  
  // Get all unique criteria from selected products
  const allCriteria = selectedProductsData.reduce((acc, product) => {
    product.criteria_values.forEach(cv => {
      const criteriaName = cv.comparison_criteria.name;
      if (!acc.find(c => c.name === criteriaName)) {
        acc.push(cv.comparison_criteria);
      }
    });
    return acc;
  }, [] as Array<{ name: string; data_type: string; unit?: string }>);

  const formatValue = (product: SectorProduct, criteriaName: string) => {
    const criteriaValue = product.criteria_values.find(
      cv => cv.comparison_criteria.name === criteriaName
    );
    
    if (!criteriaValue) return t('common.no_data_available');
    
    const { value } = criteriaValue;
    const { data_type, unit } = criteriaValue.comparison_criteria;
    
    if (data_type === 'boolean') {
      return value === 'true' ? '✅ ' + t('common.available') : '❌ ' + t('validation.required');
    }
    
    if (data_type === 'number' && unit) {
      return `${value} ${unit}`;
    }
    
    return value;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afroGreen"></div>
        <span className="ml-3">{t('messages.loading')}</span>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h3 className="text-lg font-semibold mb-2">{t('messages.no_data')}</h3>
          <p className="text-gray-600">
            {t('messages.no_results')} {sectorName} ({country.name}).
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showComparison) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {t('comparison.tab.comparison')} - {sectorName}
          </h3>
          <Button 
            variant="outline" 
            onClick={() => setShowComparison(false)}
          >
            {t('buttons.back')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('comparison.tab.comparison')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">{t('comparison.feature.comparison')}</th>
                    {selectedProductsData.map(product => (
                      <th key={product.id} className="text-center p-4 font-semibold min-w-[200px]">
                        <div>
                          <div className="font-bold">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.brand}</div>
                          <div className="text-lg font-bold text-afroGreen mt-1">
                            {product.price} {product.currency}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allCriteria.map(criteria => (
                    <tr key={criteria.name} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{criteria.name}</td>
                      {selectedProductsData.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          {formatValue(product, criteria.name)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{t('forms.availability')}</td>
                    {selectedProductsData.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        {product.country_availability.includes(country.code) ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {t('common.available')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">{t('messages.no_data')}</Badge>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">{t('admin.actions')}</td>
                    {selectedProductsData.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        {product.purchase_link ? (
                          <Button size="sm" asChild>
                            <a href={product.purchase_link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {t('purchase.where_to_buy')}
                            </a>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            {t('purchase.request_quote')}
                          </Button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            {t('admin.products')} - {sectorName}
          </h3>
          <p className="text-gray-600">
            {products.length} {t('comparison.products')} {t('common.available')} {country.name}
          </p>
        </div>
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {selectedProducts.length} {t('comparison.products')}
            </Badge>
            <Button 
              onClick={handleCompare}
              disabled={selectedProducts.length < 2}
              className="bg-afroGreen hover:bg-afroGreen/90"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('buttons.compare')}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <Card 
            key={product.id} 
            className={`transition-all duration-200 ${
              selectedProducts.includes(product.id) 
                ? 'ring-2 ring-afroGreen bg-afroGreen/5' 
                : 'hover:shadow-lg'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
                  <p className="text-xl font-bold text-afroGreen mt-2">
                    {product.price} {product.currency}
                  </p>
                </div>
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleProductSelect(product.id)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{product.description}</p>
              
              {/* Display key criteria */}
              <div className="space-y-2">
                {product.criteria_values.slice(0, 3).map(cv => (
                  <div key={cv.criteria_id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{cv.comparison_criteria.name}:</span>
                    <span className="font-medium">
                      {formatValue(product, cv.comparison_criteria.name)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Badge variant="outline">
                  {product.company?.name}
                </Badge>
                {product.country_availability.includes(country.code) ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {t('common.available')}
                  </Badge>
                ) : (
                  <Badge variant="secondary">{t('messages.no_data')}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

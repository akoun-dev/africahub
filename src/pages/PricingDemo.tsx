
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicCriteriaForm } from '@/components/pricing/DynamicCriteriaForm';
import { PricingCriteriaManager } from '@/components/pricing/PricingCriteriaManager';
import { PricingAnalyticsDashboard } from '@/components/pricing/PricingAnalyticsDashboard';
import { useProductsWithCriteria } from '@/hooks/useProductsWithCriteria';
import { Calculator, Settings, BarChart3, Sparkles } from 'lucide-react';

const PricingDemo: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedCriteria, setSelectedCriteria] = useState<Record<string, any>>({});
  
  const { data: products, isLoading } = useProductsWithCriteria();

  const selectedProductData = products?.find(p => p.id === selectedProduct);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-brandBlue mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-brandBlue" />
                Système de Pricing Dynamique
              </h1>
              <p className="text-gray-600 mt-2">
                Démonstration complète du calcul de prix personnalisé selon les critères utilisateur
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculateur
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Gestion
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Onglet Calculateur */}
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sélection du produit</CardTitle>
                <p className="text-sm text-gray-600">
                  Choisissez un produit pour tester le calcul de prix dynamique
                </p>
              </CardHeader>
              <CardContent>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un produit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-gray-500">({product.companies?.name})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedProductData && (
              <DynamicCriteriaForm
                product={selectedProductData}
                onCriteriaChange={setSelectedCriteria}
                autoCalculate={true}
              />
            )}

            {selectedProductData && Object.keys(selectedCriteria).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Critères saisis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(selectedCriteria).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {key.replace('_', ' ')}
                        </p>
                        <p className="text-gray-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Gestion */}
          <TabsContent value="management" className="space-y-6">
            {selectedProductData ? (
              <PricingCriteriaManager
                productTypeId={selectedProductData.product_type_id || ''}
                category={selectedProductData.category}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sélectionnez un produit
                  </h3>
                  <p className="text-gray-600">
                    Choisissez d'abord un produit dans l'onglet Calculateur pour gérer ses critères
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Analytics */}
          <TabsContent value="analytics">
            <PricingAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PricingDemo;

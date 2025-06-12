import React, { useState, useEffect } from 'react';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { useProductsWithCriteria, ProductWithCriteria } from '@/hooks/useProductsWithCriteria';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, Info, Share2, Download, ArrowLeft } from 'lucide-react';
import { useSectorCriteria } from '@/hooks/useSectorCriteria';
import { useSectorConfiguration } from '@/hooks/useSectorConfiguration';
import { useUserInteractions } from '@/hooks/useUserInteractions';
import { Link } from 'react-router-dom';

const AdvancedCompare = () => {
  const [searchParams] = useSearchParams();
  const productIds = searchParams.get('products')?.split(',') || [];
  const selectedCountry = searchParams.get('country') || '';
  const sectorType = searchParams.get('type') || '';
  
  const { data: products, isLoading } = useProductsWithCriteria(sectorType);
  const { data: sectorCriteria } = useSectorCriteria(sectorType);
  const { data: sectorConfig } = useSectorConfiguration(sectorType);
  const { trackInteraction } = useUserInteractions();
  
  const [selectedProducts, setSelectedProducts] = useState<ProductWithCriteria[]>([]);
  const [activeTab, setActiveTab] = useState('features');
  
  useEffect(() => {
    if (products && productIds.length > 0) {
      const filtered = products.filter(product => 
        productIds.includes(product.id)
      );
      setSelectedProducts(filtered);
      
      // Track comparison view
      trackInteraction({
        interaction_type: 'compare',
        metadata: {
          product_ids: productIds,
          sector: sectorType,
          country: selectedCountry
        }
      });
    }
  }, [products, productIds, sectorType, selectedCountry, trackInteraction]);

  // Group criteria by type for better organization
  const groupedCriteria = sectorCriteria?.reduce((acc, criterion) => {
    const group = criterion.data_type === 'boolean' ? 'features' : 'specs';
    if (!acc[group]) acc[group] = [];
    acc[group].push(criterion);
    return acc;
  }, {} as Record<string, typeof sectorCriteria>);

  const renderCriteriaRow = (criterionName: string, unit?: string) => {
    return (
      <tr key={criterionName} className="border-b border-gray-100">
        <td className="py-4 px-6 font-medium">{criterionName} {unit ? `(${unit})` : ''}</td>
        {selectedProducts.map(product => {
          const criterionValue = product.criteria_values?.find(
            cv => cv.comparison_criteria.name === criterionName
          );
          
          return (
            <td key={`${product.id}-${criterionName}`} className="py-4 px-6 text-center">
              {renderCriterionValue(criterionValue?.value, criterionValue?.comparison_criteria.data_type)}
            </td>
          );
        })}
      </tr>
    );
  };

  const renderCriterionValue = (value?: string, dataType?: string) => {
    if (!value) return <span className="text-gray-400">-</span>;
    
    switch(dataType) {
      case 'boolean':
        return value === 'true' ? 
          <Check className="mx-auto h-5 w-5 text-green-500" /> : 
          <X className="mx-auto h-5 w-5 text-red-500" />;
      case 'number':
        return <span>{value}</span>;
      default:
        return <span>{value}</span>;
    }
  };

  const renderProductHeader = (product: ProductWithCriteria) => (
    <div className="space-y-2 text-center">
      {product.companies?.logo_url && (
        <img 
          src={product.companies.logo_url} 
          alt={product.companies?.name || 'Company logo'} 
          className="h-12 mx-auto object-contain"
        />
      )}
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.companies?.name}</p>
      <div className="text-xl font-bold text-afroGreen">
        {product.price} {product.currency}
      </div>
      <div className="flex justify-center gap-2">
        <Badge variant="outline">{product.category}</Badge>
        {product.product_types?.name && (
          <Badge variant="secondary">{product.product_types.name}</Badge>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afroGreen mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de la comparaison...</p>
          </div>
        </main>
        <UnifiedFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Button variant="ghost" asChild className="mb-2">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Link>
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Comparaison Avancée
                </h1>
                <p className="text-gray-600">
                  {selectedProducts.length} produit{selectedProducts.length !== 1 ? 's' : ''} 
                  {selectedCountry && ` en ${selectedCountry}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>

            {selectedProducts.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun produit à comparer</h3>
                  <p className="text-gray-600 mb-6">
                    Retournez à la page principale pour sélectionner des produits à comparer
                  </p>
                  <Button asChild>
                    <Link to="/">Retour à l'accueil</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Tableau comparatif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="w-1/4 p-4 border-b"></th>
                          {selectedProducts.map((product) => (
                            <th key={product.id} className="p-4 border-b">
                              {renderProductHeader(product)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-gray-50">
                          <td colSpan={selectedProducts.length + 1} className="py-2 px-6 font-semibold">
                            Informations générales
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-6 font-medium">Description</td>
                          {selectedProducts.map((product) => (
                            <td key={`${product.id}-description`} className="py-4 px-6">
                              <p className="text-sm">{product.description || '-'}</p>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-6 font-medium">Couverture</td>
                          {selectedProducts.map((product) => (
                            <td key={`${product.id}-coverage`} className="py-4 px-6">
                              <Badge>{product.coverage_amount?.toLocaleString()} {product.currency}</Badge>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-6 font-medium">Franchise</td>
                          {selectedProducts.map((product) => (
                            <td key={`${product.id}-deductible`} className="py-4 px-6 text-center">
                              {product.deductible ? 
                                <Badge variant="outline">{product.deductible?.toLocaleString()} {product.currency}</Badge> : 
                                <span className="text-gray-400">-</span>
                              }
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-6 font-medium">Âge</td>
                          {selectedProducts.map((product) => (
                            <td key={`${product.id}-age`} className="py-4 px-6 text-center">
                              {product.min_age && product.max_age ? 
                                `${product.min_age} - ${product.max_age} ans` : 
                                <span className="text-gray-400">-</span>
                              }
                            </td>
                          ))}
                        </tr>

                        {/* Criteria from sector */}
                        {groupedCriteria?.features && (
                          <>
                            <tr className="bg-gray-50">
                              <td colSpan={selectedProducts.length + 1} className="py-2 px-6 font-semibold">
                                Caractéristiques
                              </td>
                            </tr>
                            {groupedCriteria.features.map(criterion => 
                              renderCriteriaRow(criterion.name, criterion.unit)
                            )}
                          </>
                        )}

                        {groupedCriteria?.specs && (
                          <>
                            <tr className="bg-gray-50">
                              <td colSpan={selectedProducts.length + 1} className="py-2 px-6 font-semibold">
                                Spécifications
                              </td>
                            </tr>
                            {groupedCriteria.specs.map(criterion => 
                              renderCriteriaRow(criterion.name, criterion.unit)
                            )}
                          </>
                        )}

                        <tr className="bg-gray-50">
                          <td colSpan={selectedProducts.length + 1} className="py-2 px-6 font-semibold">
                            Avantages et exclusions
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-6 font-medium">Avantages</td>
                          {selectedProducts.map((product) => (
                            <td key={`${product.id}-benefits`} className="py-4 px-6">
                              {product.benefits && product.benefits.length > 0 ? (
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {product.benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-6 font-medium">Exclusions</td>
                          {selectedProducts.map((product) => (
                            <td key={`${product.id}-exclusions`} className="py-4 px-6">
                              {product.exclusions && product.exclusions.length > 0 ? (
                                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                                  {product.exclusions.map((exclusion, index) => (
                                    <li key={index}>{exclusion}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedProducts.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mb-4">
                  <Info className="h-4 w-4" />
                  Les informations présentées sont à titre indicatif et peuvent varier selon les conditions spécifiques.
                </p>
                <Button asChild>
                  <Link to="/quote">Demander un devis personnalisé</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <UnifiedFooter />
    </div>
  );
};

export default AdvancedCompare;

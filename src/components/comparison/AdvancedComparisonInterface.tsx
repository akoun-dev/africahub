
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, TrendingUp, Share2, Download, BarChart3, Target, Zap } from 'lucide-react';
import { ComparisonRadarChart } from './ComparisonRadarChart';
import { ComparisonScoreCard } from './ComparisonScoreCard';
import { SmartRecommendationEngine } from './SmartRecommendationEngine';
import { GuidedSelectionAssistant } from './GuidedSelectionAssistant';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  criteria: Record<string, any>;
  score?: number;
  recommendation?: 'best_value' | 'best_for_you' | 'premium' | 'budget';
}

interface AdvancedComparisonInterfaceProps {
  products: Product[];
  onProductSelect?: (productId: string) => void;
  userProfile?: any;
}

export const AdvancedComparisonInterface: React.FC<AdvancedComparisonInterfaceProps> = ({
  products,
  onProductSelect,
  userProfile
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [criteriaWeights, setCriteriaWeights] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'radar'>('grid');
  const [showAssistant, setShowAssistant] = useState(false);

  const availableCriteria = useMemo(() => {
    if (!products.length) return [];
    const allCriteria = new Set<string>();
    products.forEach(product => {
      Object.keys(product.criteria || {}).forEach(key => allCriteria.add(key));
    });
    return Array.from(allCriteria);
  }, [products]);

  const calculateProductScore = (product: Product) => {
    if (!Object.keys(criteriaWeights).length) return 0;
    
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(criteriaWeights).forEach(([criteria, weight]) => {
      const value = product.criteria[criteria];
      if (value !== undefined) {
        // Normaliser la valeur selon le type
        let normalizedValue = 0;
        if (typeof value === 'boolean') {
          normalizedValue = value ? 100 : 0;
        } else if (typeof value === 'number') {
          normalizedValue = Math.min(100, (value / 100) * 100);
        } else if (typeof value === 'string') {
          // Pour les valeurs textuelles, on peut définir un scoring
          normalizedValue = 50; // Valeur par défaut
        }
        
        totalScore += normalizedValue * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  };

  const scoredProducts = useMemo(() => {
    return products.map(product => ({
      ...product,
      score: calculateProductScore(product)
    })).sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [products, criteriaWeights]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId].slice(0, 4) // Max 4 produits
    );
  };

  const handleExportComparison = () => {
    const comparisonData = {
      products: scoredProducts.filter(p => selectedProducts.includes(p.id)),
      criteria: criteriaWeights,
      date: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparison-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-afroGreen" />
              <div>
                <p className="text-sm text-gray-600">Produits analysés</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-afroGold" />
              <div>
                <p className="text-sm text-gray-600">Sélectionnés</p>
                <p className="text-2xl font-bold">{selectedProducts.length}/4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-afroRed" />
              <div>
                <p className="text-sm text-gray-600">Critères actifs</p>
                <p className="text-2xl font-bold">{Object.keys(criteriaWeights).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Meilleur score</p>
                <p className="text-2xl font-bold">
                  {scoredProducts[0]?.score?.toFixed(0) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions principales */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={() => setShowAssistant(true)}
          className="bg-afroGreen hover:bg-afroGreen/90"
        >
          <Target className="h-4 w-4 mr-2" />
          Assistant de sélection
        </Button>
        
        <Button variant="outline" onClick={handleExportComparison}>
          <Download className="h-4 w-4 mr-2" />
          Exporter la comparaison
        </Button>
        
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </div>

      {/* Onglets de visualisation */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList>
          <TabsTrigger value="grid">Vue Grille</TabsTrigger>
          <TabsTrigger value="table">Tableau Détaillé</TabsTrigger>
          <TabsTrigger value="radar">Graphique Radar</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scoredProducts.map((product) => (
              <ComparisonScoreCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onToggleSelect={() => toggleProductSelection(product.id)}
                criteriaWeights={criteriaWeights}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left">Produit</th>
                      <th className="p-4 text-left">Score</th>
                      <th className="p-4 text-left">Prix</th>
                      {availableCriteria.map(criteria => (
                        <th key={criteria} className="p-4 text-left">{criteria}</th>
                      ))}
                      <th className="p-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoredProducts.map((product, index) => (
                      <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-4">
                          <div>
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-sm text-gray-600">{product.brand}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Progress value={product.score || 0} className="w-20" />
                            <span className="text-sm font-medium">
                              {(product.score || 0).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold">
                          {product.price} {product.currency}
                        </td>
                        {availableCriteria.map(criteria => (
                          <td key={criteria} className="p-4 text-sm">
                            {product.criteria[criteria]?.toString() || '-'}
                          </td>
                        ))}
                        <td className="p-4">
                          <Button
                            size="sm"
                            variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                            onClick={() => toggleProductSelection(product.id)}
                          >
                            {selectedProducts.includes(product.id) ? 'Sélectionné' : 'Sélectionner'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar">
          {selectedProducts.length > 0 && (
            <ComparisonRadarChart
              products={scoredProducts.filter(p => selectedProducts.includes(p.id))}
              criteria={availableCriteria}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Moteur de recommandation intelligent */}
      <SmartRecommendationEngine
        products={scoredProducts}
        userProfile={userProfile}
        selectedProducts={selectedProducts}
        onProductRecommend={toggleProductSelection}
      />

      {/* Assistant de sélection guidée */}
      {showAssistant && (
        <GuidedSelectionAssistant
          products={products}
          onClose={() => setShowAssistant(false)}
          onCriteriaWeightsChange={setCriteriaWeights}
          onProductSelect={onProductSelect}
        />
      )}
    </div>
  );
};

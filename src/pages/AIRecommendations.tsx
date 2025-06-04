import React, { useState, useEffect } from 'react';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { AIRecommendationWidget } from '@/components/recommendations/AIRecommendationWidget';
import { PersonalizedInsights } from '@/components/recommendations/PersonalizedInsights';
import { SmartSuggestions } from '@/components/recommendations/SmartSuggestions';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { useSearch } from '@/hooks/useSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, Zap } from 'lucide-react';

const AIRecommendations = () => {
  const [selectedTab, setSelectedTab] = useState('recommendations');
  const { searchResults } = useSearch();
  const { 
    recommendations, 
    loading, 
    insights, 
    trackRecommendationClick, 
    refreshRecommendations 
  } = useAIRecommendations(searchResults, {});

  const handleProductClick = (productId: string) => {
    trackRecommendationClick(productId);
    console.log('Produit cliqué:', productId);
  };

  const handleSuggestionClick = (suggestion: any) => {
    console.log('Suggestion cliquée:', suggestion);
    // Ici on pourrait déclencher une recherche ou navigation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Intelligence Artificielle
          </h1>
          <p className="text-gray-600">
            Découvrez des recommandations personnalisées et des insights intelligents
          </p>
        </div>

        <SmartSuggestions onSuggestionClick={handleSuggestionClick} />

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Recommandations
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Analytics IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AIRecommendationWidget
                  recommendations={recommendations}
                  loading={loading}
                  onProductClick={handleProductClick}
                  onRefresh={refreshRecommendations}
                />
              </div>
              <div>
                <PersonalizedInsights insights={insights} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PersonalizedInsights insights={insights} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Tendances de marché</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Assurance auto</span>
                      <span className="text-sm font-medium text-green-600">+12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Smartphones</span>
                      <span className="text-sm font-medium text-green-600">+8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Assurance santé</span>
                      <span className="text-sm font-medium text-red-600">-3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Précision IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                    <p className="text-sm text-gray-600">Taux de satisfaction</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommandations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {recommendations.length}
                    </div>
                    <p className="text-sm text-gray-600">Actives</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Apprentissage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {insights?.activity_score ? Math.round(insights.activity_score * 100) : 0}%
                    </div>
                    <p className="text-sm text-gray-600">Progression</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance du modèle IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800">Recommandations acceptées</h4>
                      <p className="text-2xl font-bold text-green-600">87%</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800">Temps de réponse</h4>
                      <p className="text-2xl font-bold text-blue-600">0.3s</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Améliorations récentes</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Algorithme de similarité optimisé (+15% précision)</li>
                      <li>• Prise en compte du contexte géographique</li>
                      <li>• Apprentissage des préférences utilisateur amélioré</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <UnifiedFooter />
    </div>
  );
};

export default AIRecommendations;

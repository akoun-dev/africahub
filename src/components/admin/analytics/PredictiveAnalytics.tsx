
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLLMAnalytics } from '@/hooks/useMultiLLM';
import { useAfricaGeolocation } from '@/hooks/useAfricaGeolocation';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Brain, AlertTriangle, Target, DollarSign } from 'lucide-react';

export const PredictiveAnalytics: React.FC = () => {
  const { countryInfo } = useAfricaGeolocation();
  const { data: analytics } = useLLMAnalytics('7d');

  // Generate predictive cost data
  const costPredictionData = React.useMemo(() => {
    const baseData = [
      { month: 'Jan', actual: 120, predicted: 118 },
      { month: 'Fév', actual: 145, predicted: 142 },
      { month: 'Mar', actual: 133, predicted: 138 },
      { month: 'Avr', actual: 167, predicted: 165 },
      { month: 'Mai', actual: 189, predicted: 185 },
      { month: 'Juin', actual: null, predicted: 195 },
      { month: 'Juil', actual: null, predicted: 201 },
      { month: 'Août', actual: null, predicted: 207 },
    ];
    
    return baseData;
  }, []);

  // Provider efficiency predictions
  const providerPredictions = React.useMemo(() => [
    { provider: 'DeepSeek', efficiency: 92, cost: 0.14, trend: 'up', recommendation: 'Excellent pour les marchés émergents africains' },
    { provider: 'Qwen', efficiency: 88, cost: 0.60, trend: 'stable', recommendation: 'Optimal pour le français et contexte culturel' },
    { provider: 'OpenAI', efficiency: 94, cost: 20.00, trend: 'down', recommendation: 'Réserver aux cas complexes uniquement' },
  ], []);

  // Regional load predictions
  const regionalLoadData = React.useMemo(() => [
    { region: 'Afrique Ouest', current: 65, predicted: 78, growth: '+20%' },
    { region: 'Afrique Est', current: 42, predicted: 55, growth: '+31%' },
    { region: 'Afrique Sud', current: 38, predicted: 41, growth: '+8%' },
    { region: 'Afrique Nord', current: 28, predicted: 35, growth: '+25%' },
    { region: 'Afrique Centrale', current: 15, predicted: 22, growth: '+47%' },
  ], []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Predictive Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Prédiction des Coûts IA - 8 Mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              actual: { label: 'Coûts réels', color: '#3B82F6' },
              predicted: { label: 'Prédictions', color: '#10B981' }
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costPredictionData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                ${countryInfo?.currency_symbol}195
              </div>
              <div className="text-sm text-gray-600">Coût prévu Juin</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">-23%</div>
              <div className="text-sm text-gray-600">Économies vs baseline</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">89%</div>
              <div className="text-sm text-gray-600">Précision prédictions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Efficiency Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Prédictions d'Efficacité par Provider
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providerPredictions.map((provider) => (
              <div key={provider.provider} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{provider.provider}</h4>
                    {getTrendIcon(provider.trend)}
                    <Badge variant="outline">${provider.cost}/1M tokens</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{provider.efficiency}%</div>
                    <div className="text-xs text-gray-600">Efficacité</div>
                  </div>
                </div>
                
                <Progress value={provider.efficiency} className="mb-2" />
                
                <p className="text-sm text-gray-600">{provider.recommendation}</p>
                
                {provider.provider === 'DeepSeek' && countryInfo?.insurance_context.market_maturity === 'emerging' && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-800">
                    💡 Recommandé pour {countryInfo.country} (marché émergent)
                  </div>
                )}
                
                {provider.provider === 'Qwen' && countryInfo?.primary_language === 'fr' && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                    🇫🇷 Optimisé pour le contexte francophone
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Load Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Prédiction de Charge par Région
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionalLoadData.map((region, index) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{region.region}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{region.current} → {region.predicted}</span>
                      <Badge variant="secondary" className="text-xs">{region.growth}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress value={(region.current / 100) * 100} className="flex-1 h-2" />
                    <Progress value={(region.predicted / 100) * 100} className="flex-1 h-2" />
                  </div>
                  {region.region.includes(countryInfo?.region === 'west' ? 'Ouest' : countryInfo?.region === 'east' ? 'Est' : '') && (
                    <div className="text-xs text-blue-600">📍 Votre région actuelle</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes Prédictives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border-l-4 border-l-yellow-500 bg-yellow-50">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Pic de charge prévu</span>
                </div>
                <p className="text-xs text-yellow-800">
                  Augmentation de 40% attendue en Afrique de l'Ouest dans 2 semaines
                </p>
              </div>
              
              <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Optimisation recommandée</span>
                </div>
                <p className="text-xs text-blue-800">
                  Basculer 60% du trafic vers DeepSeek permettrait 35% d'économies
                </p>
              </div>
              
              <div className="p-3 border-l-4 border-l-green-500 bg-green-50">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Opportunité d'expansion</span>
                </div>
                <p className="text-xs text-green-800">
                  Marché Afrique Centrale montre 47% de croissance potentielle
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des Métriques Avancées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">94.2%</div>
              <div className="text-sm text-gray-600">Précision ML</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">-31%</div>
              <div className="text-sm text-gray-600">Réduction coûts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.3s</div>
              <div className="text-sm text-gray-600">Latence prédite</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">89%</div>
              <div className="text-sm text-gray-600">Fiabilité système</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

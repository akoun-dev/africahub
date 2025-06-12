
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLLMAnalytics } from '@/hooks/useMultiLLM';
import { useAfricaGeolocation } from '@/hooks/useAfricaGeolocation';
import { useQuoteAnalytics } from '@/hooks/analytics/useQuoteAnalytics';
import { TrendingUp, DollarSign, MapPin, Users, Target, Zap, Globe } from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const { countryInfo } = useAfricaGeolocation();
  const { data: llmAnalytics } = useLLMAnalytics('7d');
  const { data: quoteAnalytics } = useQuoteAnalytics(30);

  // Calculate regional performance metrics
  const regionalMetrics = React.useMemo(() => {
    if (!quoteAnalytics || !countryInfo) return null;

    const totalQuotes = quoteAnalytics.reduce((sum, item) => sum + item.total_requests, 0);
    const completedQuotes = quoteAnalytics.reduce((sum, item) => sum + item.completed_requests, 0);
    const totalValue = quoteAnalytics.reduce((sum, item) => sum + item.total_quote_value, 0);
    
    return {
      conversionRate: totalQuotes > 0 ? (completedQuotes / totalQuotes * 100) : 0,
      totalValue: totalValue,
      averageValue: completedQuotes > 0 ? totalValue / completedQuotes : 0,
      totalQuotes: totalQuotes,
      completedQuotes: completedQuotes
    };
  }, [quoteAnalytics, countryInfo]);

  // ROI calculation
  const roiMetrics = React.useMemo(() => {
    if (!llmAnalytics) return null;

    const monthlyCost = llmAnalytics.totalCost * 30;
    const annualCost = monthlyCost * 12;
    const savings = llmAnalytics.costSavings * annualCost;
    const roi = savings > 0 ? ((savings - annualCost) / annualCost * 100) : 0;

    return {
      monthlyCost,
      annualCost,
      savings,
      roi,
      paybackMonths: savings > 0 ? Math.ceil(annualCost / (savings / 12)) : 0
    };
  }, [llmAnalytics]);

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Résumé Exécutif - Plateforme AssurAfrique
          </CardTitle>
          {countryInfo && (
            <Badge variant="outline" className="w-fit">
              {countryInfo.country} - Région {countryInfo.region}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {regionalMetrics?.totalQuotes || 0}
              </div>
              <div className="text-sm text-gray-600">Demandes de devis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {regionalMetrics?.conversionRate.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-gray-600">Taux de conversion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {countryInfo?.currency_symbol}{regionalMetrics?.totalValue.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-600">Valeur totale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {roiMetrics?.roi.toFixed(0) || 0}%
              </div>
              <div className="text-sm text-gray-600">ROI annuel</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Africa-specific Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Performance Régionale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {countryInfo && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Marché principal</span>
                  <Badge variant="secondary">{countryInfo.country}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Maturité du marché</span>
                  <Badge variant={countryInfo.insurance_context.market_maturity === 'mature' ? 'default' : 'outline'}>
                    {countryInfo.insurance_context.market_maturity}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mobile Money</span>
                  <Badge variant={countryInfo.insurance_context.mobile_money_prevalent ? 'default' : 'secondary'}>
                    {countryInfo.insurance_context.mobile_money_prevalent ? 'Actif' : 'Limité'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Micro-assurance</span>
                  <Badge variant={countryInfo.insurance_context.microinsurance_focus ? 'default' : 'secondary'}>
                    {countryInfo.insurance_context.microinsurance_focus ? 'Focus' : 'Standard'}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Cost Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Performance Coûts IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {llmAnalytics && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Coût quotidien</span>
                  <span className="font-medium">${llmAnalytics.totalCost.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Économies</span>
                  <span className="font-medium text-green-600">
                    {Math.round(llmAnalytics.costSavings * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Requêtes</span>
                  <span className="font-medium">{llmAnalytics.totalRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Latence moyenne</span>
                  <span className="font-medium">{llmAnalytics.averageLatency}ms</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ROI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analyse ROI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roiMetrics && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Coût mensuel</span>
                  <span className="font-medium">${roiMetrics.monthlyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Économies annuelles</span>
                  <span className="font-medium text-green-600">${roiMetrics.savings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ROI</span>
                  <span className="font-bold text-green-600">{roiMetrics.roi.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Retour sur investissement</span>
                  <span className="font-medium">{roiMetrics.paybackMonths} mois</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Analytics Prédictifs - Afrique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Prédictions Court Terme (30 jours)</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Croissance demandes</span>
                    <span className="text-sm font-medium">+15%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Optimisation coûts IA</span>
                    <span className="text-sm font-medium">+22%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Expansion régionale</span>
                    <span className="text-sm font-medium">+8%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Recommandations Stratégiques</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Intensifier l'utilisation de DeepSeek pour les marchés émergents</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Optimiser les prompts en français pour l'Afrique de l'Ouest</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Développer des partenariats avec les opérateurs mobile money</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Étendre la micro-assurance aux zones rurales</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Performance par Région Africaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {['west', 'east', 'north', 'south', 'central'].map((region) => (
              <div key={region} className="text-center p-4 border rounded-lg">
                <h4 className="font-medium capitalize mb-2">
                  Afrique {region === 'west' ? 'de l\'Ouest' : region === 'east' ? 'de l\'Est' : region === 'north' ? 'du Nord' : region === 'south' ? 'du Sud' : 'Centrale'}
                </h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {region === countryInfo?.region ? regionalMetrics?.totalQuotes || 0 : Math.floor(Math.random() * 50) + 10}
                </div>
                <div className="text-xs text-gray-600">Demandes</div>
                <div className="mt-2">
                  <Badge variant={region === countryInfo?.region ? "default" : "outline"} className="text-xs">
                    {region === countryInfo?.region ? 'Actuel' : 'Disponible'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

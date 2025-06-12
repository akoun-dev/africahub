
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useQuoteAnalytics } from '@/hooks/analytics/useQuoteAnalytics';
import { useLLMAnalytics } from '@/hooks/useMultiLLM';
import { useAfricaGeolocation } from '@/hooks/useAfricaGeolocation';
import { Database, Zap, Link, Settings, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export const AnalyticsIntegration: React.FC = () => {
  const { data: quoteAnalytics } = useQuoteAnalytics(30);
  const { data: llmAnalytics } = useLLMAnalytics('7d');
  const { countryInfo } = useAfricaGeolocation();
  
  const [integrations, setIntegrations] = React.useState({
    powerbi: false,
    tableau: false,
    googleanalytics: true,
    mixpanel: false,
    amplitude: false,
    customapi: true
  });

  // Consolidated KPIs
  const consolidatedKPIs = React.useMemo(() => {
    if (!quoteAnalytics || !llmAnalytics) return [];

    const totalQuotes = quoteAnalytics.reduce((sum, item) => sum + item.total_requests, 0);
    const completedQuotes = quoteAnalytics.reduce((sum, item) => sum + item.completed_requests, 0);
    const totalValue = quoteAnalytics.reduce((sum, item) => sum + item.total_quote_value, 0);

    return [
      {
        id: 'conversion_rate',
        name: 'Taux de Conversion Global',
        value: totalQuotes > 0 ? (completedQuotes / totalQuotes * 100) : 0,
        format: 'percentage',
        trend: '+5.2%',
        source: 'quotes + llm',
        icon: <TrendingUp className="h-4 w-4" />
      },
      {
        id: 'ai_efficiency',
        name: 'Efficacité IA Multi-LLM',
        value: llmAnalytics.costSavings * 100,
        format: 'percentage',
        trend: '+12.8%',
        source: 'llm_analytics',
        icon: <Zap className="h-4 w-4" />
      },
      {
        id: 'regional_performance',
        name: 'Performance Régionale',
        value: 78.5,
        format: 'score',
        trend: '+3.1%',
        source: 'africa_context',
        icon: <Users className="h-4 w-4" />
      },
      {
        id: 'revenue_per_user',
        name: 'Revenu par Utilisateur',
        value: completedQuotes > 0 ? totalValue / completedQuotes : 0,
        format: 'currency',
        trend: '+8.7%',
        source: 'quotes + profiles',
        icon: <DollarSign className="h-4 w-4" />
      }
    ];
  }, [quoteAnalytics, llmAnalytics]);

  const formatKPIValue = (kpi: any) => {
    switch (kpi.format) {
      case 'percentage':
        return `${kpi.value.toFixed(1)}%`;
      case 'currency':
        return `${countryInfo?.currency_symbol || '$'}${kpi.value.toFixed(0)}`;
      case 'score':
        return `${kpi.value.toFixed(1)}/100`;
      default:
        return kpi.value.toFixed(1);
    }
  };

  const toggleIntegration = (key: string) => {
    setIntegrations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const exportToBI = (platform: string) => {
    console.log(`Exporting data to ${platform}`);
    // This would implement the actual export logic
  };

  return (
    <div className="space-y-6">
      {/* Consolidated KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            KPIs Consolidés Multi-Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {consolidatedKPIs.map((kpi) => (
              <div key={kpi.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  {kpi.icon}
                  <Badge variant="outline" className="text-xs">{kpi.source}</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatKPIValue(kpi)}
                </div>
                <div className="text-sm text-gray-600 mb-2">{kpi.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600">{kpi.trend}</span>
                  <div className="text-xs text-gray-500">vs. période précédente</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Intégrations Analytics Actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span className="font-medium">Power BI</span>
                </div>
                <Switch 
                  checked={integrations.powerbi} 
                  onCheckedChange={() => toggleIntegration('powerbi')}
                />
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Dashboards exécutifs et rapports automatisés
              </div>
              {integrations.powerbi && (
                <Button size="sm" variant="outline" onClick={() => exportToBI('powerbi')}>
                  Synchroniser
                </Button>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Tableau</span>
                </div>
                <Switch 
                  checked={integrations.tableau} 
                  onCheckedChange={() => toggleIntegration('tableau')}
                />
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Visualisations avancées et analytics exploratoires
              </div>
              {integrations.tableau && (
                <Button size="sm" variant="outline" onClick={() => exportToBI('tableau')}>
                  Synchroniser
                </Button>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Google Analytics</span>
                </div>
                <Switch 
                  checked={integrations.googleanalytics} 
                  onCheckedChange={() => toggleIntegration('googleanalytics')}
                />
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Tracking comportement utilisateur et conversion
              </div>
              {integrations.googleanalytics && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Connecté</span>
                </div>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Mixpanel</span>
                </div>
                <Switch 
                  checked={integrations.mixpanel} 
                  onCheckedChange={() => toggleIntegration('mixpanel')}
                />
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Analytics comportementaux et segmentation
              </div>
              {integrations.mixpanel && (
                <Button size="sm" variant="outline" onClick={() => exportToBI('mixpanel')}>
                  Configurer
                </Button>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">Amplitude</span>
                </div>
                <Switch 
                  checked={integrations.amplitude} 
                  onCheckedChange={() => toggleIntegration('amplitude')}
                />
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Product analytics et optimisation UX
              </div>
              {integrations.amplitude && (
                <Button size="sm" variant="outline" onClick={() => exportToBI('amplitude')}>
                  Configurer
                </Button>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">API Personnalisée</span>
                </div>
                <Switch 
                  checked={integrations.customapi} 
                  onCheckedChange={() => toggleIntegration('customapi')}
                />
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Webhooks et intégrations sur mesure
              </div>
              {integrations.customapi && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">API Active</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Flux de Données Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Sources de Données</div>
                  <div className="text-xs text-gray-600">
                    Quote Requests • LLM Analytics • User Interactions • Africa Context
                  </div>
                </div>
              </div>
              <Progress value={95} className="w-24" />
            </div>

            <div className="flex items-center justify-center">
              <div className="w-1 h-8 bg-gray-300"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Traitement & Consolidation</div>
                  <div className="text-xs text-gray-600">
                    ETL Pipeline • Data Cleaning • KPI Calculation • Regional Context
                  </div>
                </div>
              </div>
              <Progress value={88} className="w-24" />
            </div>

            <div className="flex items-center justify-center">
              <div className="w-1 h-8 bg-gray-300"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">Analytics & BI Platforms</div>
                  <div className="text-xs text-gray-600">
                    Dashboards • Reports • Predictions • Cultural Insights
                  </div>
                </div>
              </div>
              <Progress value={92} className="w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export & API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Export & API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Endpoints API Disponibles</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-gray-50 rounded font-mono">
                  GET /api/analytics/kpis
                </div>
                <div className="p-2 bg-gray-50 rounded font-mono">
                  GET /api/analytics/regional/{countryInfo?.country || 'unknown'}
                </div>
                <div className="p-2 bg-gray-50 rounded font-mono">
                  GET /api/analytics/llm-performance
                </div>
                <div className="p-2 bg-gray-50 rounded font-mono">
                  GET /api/analytics/predictions
                </div>
                <div className="p-2 bg-gray-50 rounded font-mono">
                  POST /api/analytics/export
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Formats d'Export</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">JSON (API)</span>
                  <Badge variant="default">Temps réel</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CSV (Bulk)</span>
                  <Badge variant="outline">Quotidien</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Parquet (Big Data)</span>
                  <Badge variant="outline">Hebdomadaire</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SQL Dumps</span>
                  <Badge variant="secondary">Sur demande</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

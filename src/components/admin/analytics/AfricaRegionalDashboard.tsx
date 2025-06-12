
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAfricaGeolocation } from '@/hooks/useAfricaGeolocation';
import { useQuoteAnalytics } from '@/hooks/analytics/useQuoteAnalytics';
import { useLLMAnalytics } from '@/hooks/useMultiLLM';
import { MapPin, Users, TrendingUp, DollarSign, Globe, Smartphone, CreditCard } from 'lucide-react';

export const AfricaRegionalDashboard: React.FC = () => {
  const { countryInfo, getAllCountries } = useAfricaGeolocation();
  const { data: quoteAnalytics } = useQuoteAnalytics(30);
  const { data: llmAnalytics } = useLLMAnalytics('7d');
  const [selectedCountry, setSelectedCountry] = React.useState(countryInfo?.country_code || 'SN');

  const countries = getAllCountries();
  const selectedCountryInfo = countries.find(c => c.country_code === selectedCountry) || countryInfo;

  // Regional performance metrics
  const regionalMetrics = React.useMemo(() => {
    if (!selectedCountryInfo) return null;

    // Simulate regional data based on country characteristics
    const baseMetrics = {
      totalUsers: Math.floor(Math.random() * 10000) + 1000,
      activeUsers: Math.floor(Math.random() * 5000) + 500,
      conversionRate: Math.random() * 20 + 5,
      averageQuoteValue: Math.random() * 50000 + 10000,
      mobileAdoption: selectedCountryInfo.insurance_context.mobile_money_prevalent ? 85 : 45,
      culturalAdaptation: 78 + Math.random() * 15
    };

    return baseMetrics;
  }, [selectedCountryInfo]);

  // Currency formatting helper
  const formatCurrency = (value: number) => {
    if (!selectedCountryInfo) return `$${value.toFixed(2)}`;
    
    const formatted = value.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return `${formatted} ${selectedCountryInfo.currency_symbol}`;
  };

  // Regional insights
  const regionalInsights = React.useMemo(() => {
    if (!selectedCountryInfo) return [];

    const insights = [];
    
    if (selectedCountryInfo.insurance_context.mobile_money_prevalent) {
      insights.push({
        type: 'opportunity',
        icon: <Smartphone className="h-4 w-4" />,
        title: 'Mobile Money Intégré',
        description: 'Forte adoption du mobile money - optimiser les paiements numériques'
      });
    }

    if (selectedCountryInfo.insurance_context.microinsurance_focus) {
      insights.push({
        type: 'strategy',
        icon: <Users className="h-4 w-4" />,
        title: 'Focus Micro-assurance',
        description: 'Marché prioritaire pour les produits accessibles et inclusifs'
      });
    }

    if (selectedCountryInfo.primary_language === 'fr') {
      insights.push({
        type: 'cultural',
        icon: <Globe className="h-4 w-4" />,
        title: 'Marché Francophone',
        description: 'Optimiser le contenu et support en français'
      });
    }

    return insights;
  }, [selectedCountryInfo]);

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200 text-green-800';
      case 'strategy': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'cultural': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Country Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Dashboard Régional Afrique
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.country_code} value={country.country_code}>
                    {country.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
      </Card>

      {selectedCountryInfo && (
        <>
          {/* Country Overview */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedCountryInfo.country}</span>
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedCountryInfo.region}</Badge>
                  <Badge variant="secondary">{selectedCountryInfo.currency}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {regionalMetrics?.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Utilisateurs totaux</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {regionalMetrics?.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Taux de conversion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(regionalMetrics?.averageQuoteValue || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Devis moyen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {regionalMetrics?.mobileAdoption}%
                  </div>
                  <div className="text-sm text-gray-600">Adoption mobile</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Characteristics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Caractéristiques du Marché
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Maturité du marché</span>
                  <Badge variant={selectedCountryInfo.insurance_context.market_maturity === 'mature' ? 'default' : 'outline'}>
                    {selectedCountryInfo.insurance_context.market_maturity}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mobile Money</span>
                  <div className="flex items-center gap-2">
                    {selectedCountryInfo.insurance_context.mobile_money_prevalent && (
                      <Smartphone className="h-4 w-4 text-green-500" />
                    )}
                    <Badge variant={selectedCountryInfo.insurance_context.mobile_money_prevalent ? 'default' : 'secondary'}>
                      {selectedCountryInfo.insurance_context.mobile_money_prevalent ? 'Actif' : 'Limité'}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Focus Micro-assurance</span>
                  <Badge variant={selectedCountryInfo.insurance_context.microinsurance_focus ? 'default' : 'secondary'}>
                    {selectedCountryInfo.insurance_context.microinsurance_focus ? 'Prioritaire' : 'Standard'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Langue principale</span>
                  <Badge variant="outline">{selectedCountryInfo.primary_language}</Badge>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-sm font-medium mb-2">Assureurs clés</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCountryInfo.insurance_context.key_providers.map((provider, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {provider}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Performance IA Locale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Adaptation culturelle</span>
                  <div className="flex items-center gap-2">
                    <Progress value={regionalMetrics?.culturalAdaptation} className="w-20 h-2" />
                    <span className="text-sm font-medium">{regionalMetrics?.culturalAdaptation.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Optimisation coûts</span>
                  <div className="flex items-center gap-2">
                    <Progress value={75} className="w-20 h-2" />
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Satisfaction utilisateur</span>
                  <div className="flex items-center gap-2">
                    <Progress value={88} className="w-20 h-2" />
                    <span className="text-sm font-medium">88%</span>
                  </div>
                </div>

                {llmAnalytics && (
                  <div className="pt-3 border-t">
                    <div className="text-sm font-medium mb-2">Provider optimal</div>
                    <div className="text-xs text-gray-600">
                      {selectedCountryInfo.primary_language === 'fr' ? 'Qwen (multilingue)' : 
                       selectedCountryInfo.insurance_context.market_maturity === 'emerging' ? 'DeepSeek (coût-efficace)' : 
                       'Stratégie équilibrée'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Regional Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Insights Régionaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {regionalInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {insight.icon}
                      <span className="font-medium text-sm">{insight.title}</span>
                    </div>
                    <p className="text-xs">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Local Languages & Cultural Context */}
          <Card>
            <CardHeader>
              <CardTitle>Contexte Culturel et Linguistique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Langues locales</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountryInfo.local_languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="capitalize">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Recommandations culturelles</h4>
                  <ul className="text-sm space-y-1">
                    {selectedCountryInfo.region === 'west' && (
                      <li>• Mettre l'accent sur la solidarité communautaire et les tontines</li>
                    )}
                    {selectedCountryInfo.region === 'east' && (
                      <li>• Privilégier les coopératives et l'économie agro-pastorale</li>
                    )}
                    {selectedCountryInfo.insurance_context.mobile_money_prevalent && (
                      <li>• Intégrer fortement les solutions de paiement mobile</li>
                    )}
                    {selectedCountryInfo.insurance_context.microinsurance_focus && (
                      <li>• Développer des produits accessibles aux petits revenus</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

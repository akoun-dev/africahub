
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAfricaGeolocation } from '@/hooks/useAfricaGeolocation';
import { useLLMAnalytics } from '@/hooks/useMultiLLM';
import { useQuoteAnalytics } from '@/hooks/analytics/useQuoteAnalytics';
import { FileText, Download, TrendingUp, DollarSign, Users, Target, Calendar, Mail } from 'lucide-react';

export const BusinessReports: React.FC = () => {
  const { countryInfo } = useAfricaGeolocation();
  const { data: llmAnalytics } = useLLMAnalytics('7d');
  const { data: quoteAnalytics } = useQuoteAnalytics(30);
  const [reportPeriod, setReportPeriod] = React.useState('monthly');
  const [reportType, setReportType] = React.useState('executive');

  // Generate report data
  const reportData = React.useMemo(() => {
    if (!llmAnalytics || !quoteAnalytics) return null;

    const totalQuotes = quoteAnalytics.reduce((sum, item) => sum + item.total_requests, 0);
    const completedQuotes = quoteAnalytics.reduce((sum, item) => sum + item.completed_requests, 0);
    const totalValue = quoteAnalytics.reduce((sum, item) => sum + item.total_quote_value, 0);

    return {
      period: reportPeriod,
      generatedAt: new Date().toISOString(),
      metrics: {
        totalRequests: totalQuotes,
        completedRequests: completedQuotes,
        conversionRate: totalQuotes > 0 ? (completedQuotes / totalQuotes * 100) : 0,
        totalValue: totalValue,
        averageValue: completedQuotes > 0 ? totalValue / completedQuotes : 0,
        aiCosts: llmAnalytics.totalCost * 30, // Monthly projection from 7d data
        costSavings: llmAnalytics.costSavings * 100,
        roi: (totalValue - (llmAnalytics.totalCost * 30)) / (llmAnalytics.totalCost * 30) * 100
      },
      regional: {
        primaryMarket: countryInfo?.country || 'Multi-pays',
        currency: countryInfo?.currency_symbol || '$',
        marketMaturity: countryInfo?.insurance_context.market_maturity || 'Mixed',
        mobileMoneyActive: countryInfo?.insurance_context.mobile_money_prevalent || false
      }
    };
  }, [llmAnalytics, quoteAnalytics, reportPeriod, countryInfo]);

  // Report templates
  const reportTemplates = [
    {
      id: 'executive',
      name: 'Rapport Exécutif',
      description: 'Vue d\'ensemble stratégique pour la direction',
      icon: <Target className="h-4 w-4" />,
      frequency: 'Mensuel/Trimestriel'
    },
    {
      id: 'financial',
      name: 'Analyse Financière',
      description: 'Coûts, ROI et optimisations IA',
      icon: <DollarSign className="h-4 w-4" />,
      frequency: 'Mensuel'
    },
    {
      id: 'operational',
      name: 'Performance Opérationnelle',
      description: 'Métriques de performance par région',
      icon: <TrendingUp className="h-4 w-4" />,
      frequency: 'Hebdomadaire'
    },
    {
      id: 'cultural',
      name: 'Adaptation Culturelle',
      description: 'Analyse par marché africain',
      icon: <Users className="h-4 w-4" />,
      frequency: 'Trimestriel'
    }
  ];

  const generateReport = () => {
    console.log(`Generating ${reportType} report for ${reportPeriod} period`);
    // Simulate report generation
    const reportContent = {
      type: reportType,
      period: reportPeriod,
      data: reportData,
      generatedAt: new Date().toISOString()
    };
    
    // In a real implementation, this would call an API or download a PDF
    const dataStr = JSON.stringify(reportContent, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `rapport-${reportType}-${reportPeriod}-${new Date().getTime()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const scheduleAutomaticReport = () => {
    console.log(`Scheduling automatic ${reportType} reports`);
    // This would integrate with a scheduling system
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Générateur de Rapports Business Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Type de rapport" />
              </SelectTrigger>
              <SelectContent>
                {reportTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="quarterly">Trimestriel</SelectItem>
                <SelectItem value="annual">Annuel</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button onClick={generateReport} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Générer
              </Button>
              <Button variant="outline" onClick={scheduleAutomaticReport}>
                <Calendar className="h-4 w-4 mr-2" />
                Planifier
              </Button>
            </div>
          </div>
          
          {reportData && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Aperçu du rapport sélectionné</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Période:</span>
                  <div className="font-medium capitalize">{reportPeriod}</div>
                </div>
                <div>
                  <span className="text-gray-600">Marché:</span>
                  <div className="font-medium">{reportData.regional.primaryMarket}</div>
                </div>
                <div>
                  <span className="text-gray-600">Demandes:</span>
                  <div className="font-medium">{reportData.metrics.totalRequests}</div>
                </div>
                <div>
                  <span className="text-gray-600">ROI:</span>
                  <div className="font-medium text-green-600">{reportData.metrics.roi.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((template) => (
          <Card key={template.id} className={`cursor-pointer transition-colors ${
            reportType === template.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`} onClick={() => setReportType(template.id)}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {template.icon}
                  {template.name}
                </div>
                <Badge variant="outline">{template.frequency}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              {template.id === 'executive' && reportData && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Conversion:</span>
                    <span className="font-medium">{reportData.metrics.conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valeur totale:</span>
                    <span className="font-medium">{reportData.regional.currency}{reportData.metrics.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Économies IA:</span>
                    <span className="font-medium text-green-600">{reportData.metrics.costSavings.toFixed(0)}%</span>
                  </div>
                </div>
              )}
              
              {template.id === 'financial' && reportData && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Coûts IA:</span>
                    <span className="font-medium">${reportData.metrics.aiCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI:</span>
                    <span className="font-medium text-green-600">{reportData.metrics.roi.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Optimisation:</span>
                    <span className="font-medium">{reportData.metrics.costSavings.toFixed(0)}%</span>
                  </div>
                </div>
              )}
              
              {template.id === 'cultural' && countryInfo && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Région:</span>
                    <span className="font-medium capitalize">{countryInfo.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Money:</span>
                    <span className="font-medium">{countryInfo.insurance_context.mobile_money_prevalent ? 'Actif' : 'Limité'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Langues:</span>
                    <span className="font-medium">{countryInfo.local_languages.length}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automated Reporting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Rapports Automatisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Rapport Exécutif Mensuel</h4>
                <Badge variant="default">Actif</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Envoyé le 1er de chaque mois à l'équipe dirigeante
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>• Métriques clés de performance</span>
                <span>• Analyse ROI multi-LLM</span>
                <span>• Recommandations stratégiques</span>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Dashboard Régional Hebdomadaire</h4>
                <Badge variant="outline">Planifié</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Performance par pays africain - tous les lundis
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>• Métriques par pays</span>
                <span>• Adaptation culturelle</span>
                <span>• Optimisations locales</span>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Analyse Prédictive Trimestrielle</h4>
                <Badge variant="secondary">En cours</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Prévisions et recommandations d'optimisation
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>• Prédictions de coûts</span>
                <span>• Tendances marché</span>
                <span>• Opportunités expansion</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Options d'Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">PDF Rapport</div>
                <div className="text-xs text-gray-600">Format professionnel</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Excel Dashboard</div>
                <div className="text-xs text-gray-600">Données interactives</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">PowerPoint</div>
                <div className="text-xs text-gray-600">Présentation exécutive</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

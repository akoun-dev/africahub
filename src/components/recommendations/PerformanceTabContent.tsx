
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Recommendation } from '@/domain/entities/Recommendation';
import { useTranslation } from '@/hooks/useTranslation';
import { Activity, Target, TrendingUp } from 'lucide-react';

interface PerformanceTabContentProps {
  recommendations: Recommendation[];
}

const PerformanceTabContent: React.FC<PerformanceTabContentProps> = ({ recommendations }) => {
  const { t } = useTranslation();

  const avgConfidence = recommendations.length > 0 
    ? (recommendations.reduce((acc, r) => acc + r.confidenceScore, 0) / recommendations.length * 100)
    : 0;

  const conversionRate = recommendations.length > 0 
    ? (recommendations.filter(r => r.isPurchased).length / recommendations.length * 100)
    : 0;

  const engagementRate = recommendations.length > 0 
    ? (recommendations.filter(r => r.isViewed || r.isClicked).length / recommendations.length * 100)
    : 0;

  const performanceMetrics = [
    {
      title: t('performance.avg_confidence'),
      value: avgConfidence,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: Target
    },
    {
      title: t('performance.conversion_rate'),
      value: conversionRate,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: TrendingUp
    },
    {
      title: 'Taux d\'engagement',
      value: engagementRate,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: Activity
    }
  ];

  return (
    <Card className="bg-white rounded-xl shadow-sm border">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-gray-900">
            {t('performance.title')}
          </span>
        </CardTitle>
        <CardDescription>
          {t('performance.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                    <h4 className="font-medium text-gray-900">{metric.title}</h4>
                  </div>
                  <span className={`text-lg font-bold ${metric.color}`}>
                    {metric.value.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-700 ease-out ${metric.bgColor}`}
                    style={{ width: `${Math.min(metric.value, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyse détaillée
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Score de confiance moyen:</p>
                <p className="font-semibold text-blue-600">
                  {avgConfidence >= 80 ? 'Excellent' : avgConfidence >= 60 ? 'Bon' : 'À améliorer'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Performance globale:</p>
                <p className="font-semibold text-green-600">
                  {recommendations.length > 5 ? 'Volume suffisant' : 'Générer plus de recommandations'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceTabContent;

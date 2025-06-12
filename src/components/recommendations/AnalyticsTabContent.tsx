
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Recommendation } from '@/domain/entities/Recommendation';
import { useTranslation } from '@/hooks/useTranslation';
import { BarChart3, Eye, MousePointer, ShoppingCart, TrendingUp } from 'lucide-react';

interface AnalyticsTabContentProps {
  recommendations: Recommendation[];
}

const AnalyticsTabContent: React.FC<AnalyticsTabContentProps> = ({ recommendations }) => {
  const { t } = useTranslation();

  const metrics = [
    {
      title: t('analytics.total_recommendations'),
      value: recommendations.length,
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: t('analytics.views'),
      value: recommendations.filter(r => r.isViewed).length,
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: t('analytics.clicks'),
      value: recommendations.filter(r => r.isClicked).length,
      icon: MousePointer,
      color: 'text-yellow-600'
    },
    {
      title: t('analytics.conversions'),
      value: recommendations.filter(r => r.isPurchased).length,
      icon: ShoppingCart,
      color: 'text-red-600'
    }
  ];

  return (
    <Card className="bg-white rounded-xl shadow-sm border">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-gray-900">
            {t('analytics.title')}
          </span>
        </CardTitle>
        <CardDescription>
          {t('analytics.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={index}
                className="text-center p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center justify-center mb-2">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className={`text-2xl font-bold ${metric.color} mb-1`}>
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 leading-tight">
                  {metric.title}
                </div>
              </div>
            );
          })}
        </div>

        {recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Aperçu des performances
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Taux de visualisation:</span>
                <div className="font-semibold text-green-600">
                  {recommendations.length > 0 ? Math.round((recommendations.filter(r => r.isViewed).length / recommendations.length) * 100) : 0}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Taux de clic:</span>
                <div className="font-semibold text-blue-600">
                  {recommendations.length > 0 ? Math.round((recommendations.filter(r => r.isClicked).length / recommendations.length) * 100) : 0}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Taux de conversion:</span>
                <div className="font-semibold text-red-600">
                  {recommendations.length > 0 ? Math.round((recommendations.filter(r => r.isPurchased).length / recommendations.length) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsTabContent;

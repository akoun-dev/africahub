
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { useAdvancedRecommendations } from '@/hooks/useAdvancedRecommendations';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

export const AIInsightsWidget: React.FC = () => {
  const { user } = useAuth();
  const { data: recommendations } = useAdvancedRecommendations();
  const { t } = useTranslation();

  if (!user) return null;

  const insights = [
    {
      type: 'opportunity',
      title: t('insights.opportunity.detected', 'Nouvelle opportunité détectée'),
      description: 'Assurance auto : économie potentielle de 15% identifiée',
      confidence: 0.85,
      action: t('insights.action.view_options', 'Voir les options')
    },
    {
      type: 'trend',
      title: t('insights.market.trend', 'Tendance du marché'),
      description: 'Les prix d\'assurance habitation baissent dans votre région',
      confidence: 0.72,
      action: t('insights.action.compare_now', 'Comparer maintenant')
    },
    {
      type: 'recommendation',
      title: t('insights.personalized.recommendation', 'Recommandation personnalisée'),
      description: 'Produit adapté à votre profil disponible',
      confidence: 0.91,
      action: t('insights.action.discover', 'Découvrir')
    }
  ];

  return (
    <Card className="border-l-4 border-l-afroGreen bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-afroGreen" />
          <span className="bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
            {t('insights.ai_title', 'IA Insights')}
          </span>
          <Badge className="bg-gradient-to-r from-afroGreen/10 to-afroGold/10 text-afroGreen border-afroGreen/20">
            <Sparkles className="w-3 h-3 mr-1" />
            {t('insights.new_badge', 'Nouveau')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div key={index} className="border border-afroGreen/10 rounded-lg p-3 space-y-2 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {insight.type === 'opportunity' && <TrendingUp className="h-4 w-4 text-afroGreen" />}
                    {insight.type === 'trend' && <AlertCircle className="h-4 w-4 text-afroGold" />}
                    {insight.type === 'recommendation' && <Brain className="h-4 w-4 text-afroRed" />}
                    <h4 className="font-medium text-sm text-gray-900">{insight.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs border-afroGreen/30 text-afroGreen">
                      {Math.round(insight.confidence * 100)}% {t('insights.confidence.reliable', 'fiable')}
                    </Badge>
                    <Button size="sm" variant="outline" className="border-afroGreen/30 text-afroGreen hover:bg-afroGreen hover:text-white transition-all">
                      {insight.action}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <Zap className="h-8 w-8 text-afroGold mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              {t('insights.empty.title', 'Aucun insight disponible pour le moment')}
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t('insights.empty.description', 'Commencez à explorer notre plateforme pour obtenir des recommandations et insights personnalisés.')}
            </p>
            <Button size="sm" className="bg-gradient-to-r from-afroGreen to-afroGold hover:from-afroGreen-dark hover:to-afroGold-dark text-white">
              {t('insights.generate.button', 'Générer des insights')}
            </Button>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div className="border-t border-afroGreen/20 pt-3 mt-4">
            <p className="text-sm text-gray-600 mb-3">
              <strong className="text-afroGreen">{recommendations.length}</strong> {t('insights.recommendations_available', 'recommandations IA disponibles')}
            </p>
            <Button size="sm" className="w-full bg-gradient-to-r from-afroGreen to-afroGold hover:from-afroGreen-dark hover:to-afroGold-dark text-white shadow-lg hover:shadow-xl transition-all">
              {t('insights.view_all_recommendations', 'Voir toutes les recommandations')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDomainRecommendations } from '@/hooks/useDomainRecommendations';
import { useRecommendationInteractions } from '@/hooks/useRecommendationInteractions';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { SectionBackground } from '@/components/ui/section-background';
import { GlassCard } from '@/components/ui/glass-card';
import RecommendationsPageHeader from '@/components/recommendations/RecommendationsPageHeader';
import RecommendationsList from '@/components/recommendations/RecommendationsList';
import AnalyticsTabContent from '@/components/recommendations/AnalyticsTabContent';
import PerformanceTabContent from '@/components/recommendations/PerformanceTabContent';

const RecommendationsDemo = () => {
  const [selectedInsuranceType, setSelectedInsuranceType] = useState('auto');
  const { t } = useTranslation();
  const { 
    recommendations, 
    loading, 
    error, 
    generateRecommendations, 
    updateInteraction,
    refetch 
  } = useDomainRecommendations(selectedInsuranceType);

  const { 
    handleGenerateRecommendations,
    handleRecommendationClick,
    isGenerating 
  } = useRecommendationInteractions(recommendations, selectedInsuranceType);

  const handleGenerateWithPreferences = async () => {
    try {
      await generateRecommendations({
        budget_range: 'medium',
        risk_tolerance: 'moderate',
        coverage_priorities: ['comprehensive']
      });
      toast({
        title: t('toast.recommendations_generated'),
        description: t('toast.recommendations_success'),
      });
    } catch (error) {
      toast({
        title: t('toast.error'),
        description: t('toast.cannot_generate'),
        variant: "destructive",
      });
    }
  };

  const handleInteraction = async (recommendationId: string, type: 'viewed' | 'clicked' | 'purchased') => {
    try {
      await updateInteraction(recommendationId, type);
      handleRecommendationClick(recommendations.find(r => r.id === recommendationId)!);
    } catch (error) {
      toast({
        title: t('toast.error'),
        description: t('toast.cannot_record'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <UnifiedHeader />
      
      <RecommendationsPageHeader
        selectedInsuranceType={selectedInsuranceType}
        onInsuranceTypeChange={setSelectedInsuranceType}
        onGenerate={handleGenerateWithPreferences}
        onRefresh={refetch}
        loading={loading}
        isGenerating={isGenerating}
      />

      <SectionBackground variant="premium" withDecorations>
        <div className="container mx-auto px-4 py-12">
          {error && (
            <Alert className="mb-8 bg-white/95 backdrop-blur-sm border-red-100 shadow-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('recommendations.error_loading')}: {error}
              </AlertDescription>
            </Alert>
          )}

          <GlassCard variant="premium" size="xl" radius="xl">
            <Tabs defaultValue="recommendations" className="space-y-8">
              <TabsList className="bg-gray-50/60 backdrop-blur-sm border border-gray-100 grid w-full grid-cols-3 rounded-2xl p-2">
                <TabsTrigger value="recommendations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl py-3 font-medium">
                  {t('tabs.recommendations')}
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl py-3 font-medium">
                  {t('tabs.analytics')}
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl py-3 font-medium">
                  {t('tabs.performance')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations">
                <RecommendationsList
                  recommendations={recommendations}
                  loading={loading}
                  onGenerateWithPreferences={handleGenerateWithPreferences}
                  onInteraction={handleInteraction}
                />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsTabContent recommendations={recommendations} />
              </TabsContent>

              <TabsContent value="performance">
                <PerformanceTabContent recommendations={recommendations} />
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>
      </SectionBackground>
      
      <UnifiedFooter />
    </div>
  );
};

export default RecommendationsDemo;

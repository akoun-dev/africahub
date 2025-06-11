
import { useState } from 'react';
import { useGenerateRecommendations } from '@/hooks/useAIRecommendations';
import { toast } from '@/hooks/use-toast';
import { Recommendation } from '@/domain/entities/Recommendation';

export const useRecommendationInteractions = (
  recommendations: Recommendation[], 
  insuranceType?: string
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const generateRecommendations = useGenerateRecommendations();

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true);
    try {
      await generateRecommendations.mutateAsync({
        insuranceType: insuranceType || 'auto',
        preferences: {
          budget_range: 'medium',
          risk_tolerance: 'moderate'
        }
      });
      toast({
        title: "Recommandations générées",
        description: "De nouvelles recommandations IA ont été créées pour vous",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les recommandations",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecommendationClick = (recommendation: Recommendation) => {
    console.log('Recommendation clicked:', recommendation);
    toast({
      title: "Recommandation sélectionnée",
      description: `Vous avez cliqué sur ${recommendation.product?.name}`,
    });
  };

  return {
    handleGenerateRecommendations,
    handleRecommendationClick,
    isGenerating
  };
};

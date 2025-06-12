
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, RefreshCw, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface RecommendationsPageHeaderProps {
  selectedInsuranceType: string;
  onInsuranceTypeChange: (value: string) => void;
  onGenerate: () => void;
  onRefresh: () => void;
  loading: boolean;
  isGenerating: boolean;
}

const RecommendationsPageHeader: React.FC<RecommendationsPageHeaderProps> = ({
  selectedInsuranceType,
  onInsuranceTypeChange,
  onGenerate,
  onRefresh,
  loading,
  isGenerating
}) => {
  const { t } = useTranslation();

  const insuranceTypes = [
    { value: 'auto', label: t('insurance.auto') },
    { value: 'home', label: t('insurance.home') },
    { value: 'health', label: t('insurance.health') },
    { value: 'micro', label: t('insurance.micro') }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {t('recommendations.title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('recommendations.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedInsuranceType} onValueChange={onInsuranceTypeChange}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder={t('recommendations.insurance_type')} />
                </SelectTrigger>
                <SelectContent>
                  {insuranceTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={onGenerate}
                disabled={loading || isGenerating}
                className="flex items-center space-x-2"
              >
                {(loading || isGenerating) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                <span>{t('recommendations.generate')}</span>
              </Button>

              <Button 
                variant="outline" 
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{t('recommendations.refresh')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsPageHeader;

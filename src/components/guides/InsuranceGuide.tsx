
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, MapPin, Globe } from 'lucide-react';
import { useInsuranceGuide } from '@/hooks/useLocalizedContent';
import { useCountry } from '@/contexts/CountryContext';

interface InsuranceGuideProps {
  sector: string;
  className?: string;
}

export const InsuranceGuide: React.FC<InsuranceGuideProps> = ({ sector, className }) => {
  const { data: guide, isLoading } = useInsuranceGuide(sector);
  const { country, language } = useCountry();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!guide) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            {guide.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {guide.country_code && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {country?.name}
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {language.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">{guide.content}</p>
        
        {guide.metadata?.category && (
          <div className="mt-4">
            <Badge variant="outline">
              {guide.metadata.category}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

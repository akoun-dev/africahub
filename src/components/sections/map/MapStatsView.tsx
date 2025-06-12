
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/useTranslation';
import { getAllCountries } from '@/data/africaGeoJSON';

export const MapStatsView: React.FC = () => {
  const { t } = useTranslation();
  const countries = getAllCountries();

  const topCountries = countries
    .sort((a, b) => b.companies - a.companies)
    .slice(0, 5);

  const getStatsTitle = () => {
    return t('map.african_market_stats');
  };

  return (
    <GlassCard variant="premium" size="lg" className="p-6">
      <h3 className="font-bold text-xl mb-6 text-gray-900">{getStatsTitle()}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-afroGreen mb-2">
            {countries.reduce((sum, c) => sum + c.companies, 0)}
          </div>
          <div className="text-sm text-gray-600">{t('map.total_companies')}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-afroGold mb-2">
            {countries.length}
          </div>
          <div className="text-sm text-gray-600">{t('map.countries_covered')}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-afroRed mb-2">
            {(countries.reduce((sum, c) => sum + c.population, 0) / 1000000).toFixed(0)}M
          </div>
          <div className="text-sm text-gray-600">{t('map.total_population')}</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">{t('map.top_markets')}</h4>
        {topCountries.map((country, index) => (
          <div key={country.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-afroGreen to-afroGold rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <div className="font-medium">{country.name}</div>
                <div className="text-sm text-gray-500">{country.marketSize}</div>
              </div>
            </div>
            <Badge variant="outline">{country.companies} {t('map.companies_count')}</Badge>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

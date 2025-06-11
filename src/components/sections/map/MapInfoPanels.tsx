
import React from 'react';
import { Target, Map, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/useTranslation';
import { useCountry } from '@/contexts/CountryContext';
import { getAllCountries } from '@/data/africaGeoJSON';

export const MapInfoPanels: React.FC = () => {
  const { t } = useTranslation();
  const { country } = useCountry();
  const countries = getAllCountries();

  return (
    <div className="space-y-6">
      {/* Selected Country Panel */}
      <GlassCard variant="accent" size="default">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-afroGreen" />
            <h3 className="font-bold text-lg">{t('country.selected')}</h3>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <h4 className="font-bold text-lg">{country.name}</h4>
              <p className="text-sm text-gray-600">{country.region}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('country.currency')}:</span>
              <span className="font-medium">{country.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('country.languages')}:</span>
              <span className="font-medium">{country.languages.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Instructions Panel */}
      <GlassCard variant="gold" size="default">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Map className="w-5 h-5 text-afroGold" />
            <h3 className="font-bold text-lg">{t('nav.explore_sections')}</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-afroGreen rounded-full mt-2 flex-shrink-0"></div>
              <p>{t('common.hover_country_stats')}</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-afroGold rounded-full mt-2 flex-shrink-0"></div>
              <p>{t('common.click_to_select')}</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-afroRed rounded-full mt-2 flex-shrink-0"></div>
              <p>{t('common.use_controls_navigate')}</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>{t('common.fullscreen_available')}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Market Data Panel */}
      <GlassCard variant="premium" size="default">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg">{t('common.selected_market')}</h3>
          </div>
          {(() => {
            const countryData = countries.find(c => c.code === country.code);
            return countryData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('map.total_population')}</span>
                  <Badge variant="outline">
                    {(countryData.population / 1000000).toFixed(1)}M
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('map.companies_count')}</span>
                  <Badge variant="outline">
                    {countryData.companies}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('common.market_size')}</span>
                  <Badge variant="outline">
                    {countryData.marketSize}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">{t('common.no_data_available')}</p>
            );
          })()}
        </div>
      </GlassCard>
    </div>
  );
};

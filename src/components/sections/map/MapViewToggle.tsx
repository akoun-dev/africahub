
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface MapViewToggleProps {
  selectedView: 'map' | 'stats';
  onViewChange: (view: 'map' | 'stats') => void;
}

export const MapViewToggle: React.FC<MapViewToggleProps> = ({
  selectedView,
  onViewChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <Button
        variant={selectedView === 'map' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('map')}
        className="flex items-center gap-2"
      >
        <Map className="h-4 w-4" />
        {t('map.market_view')}
      </Button>
      <Button
        variant={selectedView === 'stats' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('stats')}
        className="flex items-center gap-2"
      >
        <TrendingUp className="h-4 w-4" />
        {t('map.statistics_view')}
      </Button>
    </div>
  );
};

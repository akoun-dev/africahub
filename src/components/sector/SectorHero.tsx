
import React from 'react';
import { PremiumSectorHero } from '@/components/hero/PremiumSectorHero';
import { Sector } from '@/hooks/useSectors';

interface SectorHeroProps {
  sector: Sector;
  themeColor: string;
  IconComponent: React.ComponentType<{ className?: string }>;
}

// Replace the existing SectorHero with the new premium version
export const SectorHero: React.FC<SectorHeroProps> = (props) => {
  return <PremiumSectorHero {...props} />;
};

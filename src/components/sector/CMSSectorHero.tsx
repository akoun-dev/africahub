
import React from 'react';
import { PremiumSectorHero } from '@/components/hero/PremiumSectorHero';
import { Sector } from '@/hooks/useSectors';

interface CMSSectorHeroProps {
  sector: Sector;
  themeColor: string;
  IconComponent: React.ComponentType<{ className?: string }>;
}

// Replace the CMS SectorHero with the new premium version for consistency
export const CMSSectorHero: React.FC<CMSSectorHeroProps> = (props) => {
  return <PremiumSectorHero {...props} />;
};

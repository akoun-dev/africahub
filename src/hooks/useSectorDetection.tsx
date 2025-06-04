
import { useLocation } from 'react-router-dom';
import { useSectors } from '@/hooks/useSectors';

export const useSectorDetection = () => {
  const location = useLocation();
  const { data: sectors } = useSectors();

  const getCurrentSector = () => {
    // Check if we're on a sector page
    const sectorMatch = location.pathname.match(/^\/secteur\/([^\/]+)/);
    if (sectorMatch && sectors) {
      const sectorSlug = sectorMatch[1];
      return sectors.find(sector => sector.slug === sectorSlug);
    }
    return null;
  };

  const getSectorName = () => {
    const sector = getCurrentSector();
    if (sector) {
      return sector.name.toLowerCase();
    }
    return 'l\'assurance'; // Default fallback
  };

  const isInsuranceSector = () => {
    const sector = getCurrentSector();
    return !sector || (sector && sector.slug.includes('assurance'));
  };

  return {
    currentSector: getCurrentSector(),
    sectorName: getSectorName(),
    isInsuranceSector: isInsuranceSector(),
    isOnSectorPage: !!getCurrentSector()
  };
};

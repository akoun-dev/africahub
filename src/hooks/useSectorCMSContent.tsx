
import { useCMSContent } from './useCMSContent';
import { useCountry } from '@/contexts/CountryContext';

interface SectorCMSContent {
  hero_title?: string;
  hero_description?: string;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  benefits?: Array<{
    title: string;
    description: string;
  }>;
  cta_text?: string;
  regulatory_info?: string;
  local_partnerships?: string;
}

export const useSectorCMSContent = (sectorSlug: string) => {
  const { country, language } = useCountry();
  
  // Get main sector content
  const { data: heroContent } = useCMSContent(`sector.${sectorSlug}.hero`, {
    country: country?.code,
    sector: sectorSlug,
    language
  });

  const { data: featuresContent } = useCMSContent(`sector.${sectorSlug}.features`, {
    country: country?.code,
    sector: sectorSlug,
    language
  });

  const { data: benefitsContent } = useCMSContent(`sector.${sectorSlug}.benefits`, {
    country: country?.code,
    sector: sectorSlug,
    language
  });

  const { data: ctaContent } = useCMSContent(`sector.${sectorSlug}.cta`, {
    country: country?.code,
    sector: sectorSlug,
    language
  });

  const { data: regulatoryContent } = useCMSContent(`sector.${sectorSlug}.regulatory`, {
    country: country?.code,
    sector: sectorSlug,
    language
  });

  // Combine all content into a structured format
  const content: SectorCMSContent = {
    hero_title: heroContent?.title,
    hero_description: heroContent?.content,
    features: featuresContent?.metadata?.features || [],
    benefits: benefitsContent?.metadata?.benefits || [],
    cta_text: ctaContent?.content,
    regulatory_info: regulatoryContent?.content,
    local_partnerships: regulatoryContent?.metadata?.partnerships
  };

  const isLoading = !heroContent && !featuresContent && !benefitsContent;

  return {
    content,
    isLoading
  };
};

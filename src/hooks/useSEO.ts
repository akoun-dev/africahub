
import { useEffect } from 'react';
import { updatePageMetadata, generateStructuredData, SEOMetadata } from '@/utils/seo';

export const useSEO = (metadata: SEOMetadata, structuredData?: any) => {
  useEffect(() => {
    updatePageMetadata(metadata);

    if (structuredData) {
      generateStructuredData(structuredData.type, structuredData.data);
    }

    // Cleanup function to reset to default metadata when component unmounts
    return () => {
      // Optional: Reset to default metadata
    };
  }, [metadata, structuredData]);
};

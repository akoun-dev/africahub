
import React from 'react';
import { useSEO } from '@/hooks/useSEO';
import { SEOMetadata } from '@/utils/seo';

interface SEOHeadProps {
  metadata: SEOMetadata;
  structuredData?: {
    type: 'Organization' | 'WebSite' | 'Product' | 'Article';
    data: any;
  };
}

export const SEOHead: React.FC<SEOHeadProps> = ({ metadata, structuredData }) => {
  useSEO(metadata, structuredData);
  return null; // This component doesn't render anything visible
};

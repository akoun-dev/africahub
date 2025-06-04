
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const updatePageMetadata = (metadata: SEOMetadata) => {
  // Update title
  document.title = metadata.title;

  // Update or create meta tags
  const updateMetaTag = (name: string, content: string, property?: boolean) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Basic meta tags
  updateMetaTag('description', metadata.description);
  if (metadata.keywords) {
    updateMetaTag('keywords', metadata.keywords);
  }
  if (metadata.author) {
    updateMetaTag('author', metadata.author);
  }

  // Open Graph tags
  updateMetaTag('og:title', metadata.title, true);
  updateMetaTag('og:description', metadata.description, true);
  updateMetaTag('og:type', metadata.ogType || 'website', true);
  
  if (metadata.ogImage) {
    updateMetaTag('og:image', metadata.ogImage, true);
  }

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', metadata.title);
  updateMetaTag('twitter:description', metadata.description);
  
  if (metadata.ogImage) {
    updateMetaTag('twitter:image', metadata.ogImage);
  }

  // Canonical URL
  if (metadata.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', metadata.canonicalUrl);
  }

  // Structured data timestamps
  if (metadata.publishedTime) {
    updateMetaTag('article:published_time', metadata.publishedTime, true);
  }
  if (metadata.modifiedTime) {
    updateMetaTag('article:modified_time', metadata.modifiedTime, true);
  }
};

export const generateStructuredData = (type: 'Organization' | 'WebSite' | 'Product' | 'Article', data: any) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(baseData);
  document.head.appendChild(script);
};

export const getDefaultSEOMetadata = (): SEOMetadata => ({
  title: 'Comparateur d\'Assurances Afrique - Trouvez la meilleure assurance',
  description: 'Comparez facilement les assurances auto, santé, habitation et voyage en Afrique. Trouvez la meilleure couverture au meilleur prix avec notre comparateur intelligent.',
  keywords: 'assurance, comparateur, Afrique, auto, santé, habitation, voyage, Côte d\'Ivoire, Sénégal',
  ogType: 'website',
  author: 'Comparateur Assurances Afrique',
  canonicalUrl: window.location.href
});

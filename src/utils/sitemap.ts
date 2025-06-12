
interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (entries: SitemapEntry[]): string => {
  const baseUrl = window.location.origin;
  
  const xmlEntries = entries.map(entry => `
  <url>
    <loc>${baseUrl}${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
};

export const getDefaultSitemapEntries = (): SitemapEntry[] => [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/compare', changefreq: 'daily', priority: 0.9 },
  { url: '/recommendations', changefreq: 'weekly', priority: 0.8 },
  { url: '/advanced-search', changefreq: 'weekly', priority: 0.7 },
  { url: '/auth', changefreq: 'monthly', priority: 0.5 },
  { url: '/secteur/auto', changefreq: 'daily', priority: 0.8 },
  { url: '/secteur/sante', changefreq: 'daily', priority: 0.8 },
  { url: '/secteur/habitation', changefreq: 'daily', priority: 0.8 },
  { url: '/secteur/voyage', changefreq: 'daily', priority: 0.8 }
];

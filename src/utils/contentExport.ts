
import { CMSContent } from '@/services/microservices/CMSMicroservice';

export const exportToCSV = (content: CMSContent[], filename: string = 'cms-content') => {
  // Prepare CSV headers
  const headers = [
    'ID',
    'Clé de contenu',
    'Titre',
    'Type de contenu',
    'Statut',
    'Langue',
    'Pays',
    'Secteur',
    'Version',
    'Date de création',
    'Date de modification',
    'Date de publication',
    'Contenu (extrait)'
  ];

  // Convert content to CSV rows
  const rows = content.map(item => [
    item.id,
    item.content_key,
    item.title || '',
    item.content_type,
    item.status,
    item.language_code,
    item.country_code || '',
    item.sector_slug || '',
    item.version.toString(),
    new Date(item.created_at).toLocaleDateString('fr-FR'),
    new Date(item.updated_at).toLocaleDateString('fr-FR'),
    item.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR') : '',
    (item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '')).replace(/\n/g, ' ')
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (content: CMSContent[], filename: string = 'cms-content') => {
  // Prepare export data with metadata
  const exportData = {
    exportDate: new Date().toISOString(),
    totalItems: content.length,
    version: '1.0',
    content: content.map(item => ({
      id: item.id,
      content_key: item.content_key,
      content_type: item.content_type,
      title: item.title,
      content: item.content,
      metadata: item.metadata,
      country_code: item.country_code,
      sector_slug: item.sector_slug,
      language_code: item.language_code,
      status: item.status,
      version: item.version,
      published_at: item.published_at,
      created_at: item.created_at,
      updated_at: item.updated_at
    }))
  };

  // Download JSON file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const highlightSearchTerms = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text;
  
  const terms = searchTerm.trim().split(/\s+/);
  let highlightedText = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
};

export const getContentExcerpt = (content: string, maxLength: number = 150): string => {
  if (content.length <= maxLength) return content;
  
  const excerpt = content.substring(0, maxLength);
  const lastSpaceIndex = excerpt.lastIndexOf(' ');
  
  return lastSpaceIndex > maxLength * 0.8 
    ? excerpt.substring(0, lastSpaceIndex) + '...'
    : excerpt + '...';
};

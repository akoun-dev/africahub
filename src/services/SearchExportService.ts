
import { SearchResult } from './SearchService';

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeImages: boolean;
  includeComparison: boolean;
  customFields?: string[];
}

export interface ExportData {
  results: SearchResult[];
  metadata: {
    query: string;
    totalResults: number;
    exportDate: string;
    filters: Record<string, any>;
  };
}

export class SearchExportService {
  // Exporter les résultats en PDF
  static async exportToPDF(data: ExportData, options: ExportOptions): Promise<Blob> {
    const content = this.generatePDFContent(data, options);
    
    // Pour une implémentation complète, vous pourriez utiliser jsPDF ou Puppeteer
    // Ici, nous créons un HTML qui peut être converti en PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Résultats de recherche - ${data.metadata.query}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
          .result { border: 1px solid #e5e7eb; margin-bottom: 20px; padding: 15px; border-radius: 8px; }
          .result-header { display: flex; justify-content: between; margin-bottom: 10px; }
          .result-title { font-size: 18px; font-weight: bold; color: #1f2937; }
          .result-price { font-size: 16px; color: #059669; font-weight: bold; }
          .result-details { margin-top: 10px; }
          .meta-info { color: #6b7280; font-size: 14px; }
          .comparison-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .comparison-table th, .comparison-table td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          .comparison-table th { background-color: #f3f4f6; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;

    return new Blob([htmlContent], { type: 'application/pdf' });
  }

  // Exporter en Excel/CSV
  static async exportToExcel(data: ExportData, options: ExportOptions): Promise<Blob> {
    const csvContent = this.generateCSVContent(data, options);
    
    if (options.format === 'csv') {
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    }

    // Pour Excel, on utilise du CSV avec des métadonnées
    const excelContent = `data:application/vnd.ms-excel;charset=utf-8,${encodeURIComponent(csvContent)}`;
    return new Blob([excelContent], { type: 'application/vnd.ms-excel' });
  }

  // Générer le contenu PDF en HTML
  private static generatePDFContent(data: ExportData, options: ExportOptions): string {
    let content = `
      <div class="header">
        <h1>Résultats de recherche</h1>
        <div class="meta-info">
          <p><strong>Recherche:</strong> "${data.metadata.query}"</p>
          <p><strong>Nombre de résultats:</strong> ${data.metadata.totalResults}</p>
          <p><strong>Date d'export:</strong> ${new Date(data.metadata.exportDate).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    `;

    if (options.includeComparison && data.results.length > 1) {
      content += this.generateComparisonTable(data.results);
    }

    content += '<div class="results-section"><h2>Détail des produits</h2>';

    data.results.forEach((result, index) => {
      content += `
        <div class="result">
          <div class="result-header">
            <div class="result-title">${result.name}</div>
            <div class="result-price">${this.formatPrice(result.price, result.currency)}</div>
          </div>
          <div class="result-details">
            <p><strong>Marque:</strong> ${result.brand}</p>
            <p><strong>Catégorie:</strong> ${result.category}</p>
            <p><strong>Fournisseur:</strong> ${result.provider.name}</p>
            <p><strong>Pays:</strong> ${result.location}</p>
            <p><strong>Note:</strong> ${result.rating}/5 (${result.reviewCount} avis)</p>
            <p><strong>Disponibilité:</strong> ${this.getAvailabilityText(result.availability)}</p>
            ${result.features && result.features.length > 0 ? 
              `<p><strong>Caractéristiques:</strong> ${result.features.join(', ')}</p>` : ''}
          </div>
        </div>
      `;
    });

    content += '</div>';
    return content;
  }

  // Générer le contenu CSV
  private static generateCSVContent(data: ExportData, options: ExportOptions): string {
    const headers = [
      'Nom',
      'Marque',
      'Catégorie',
      'Prix',
      'Devise',
      'Note',
      'Nombre d\'avis',
      'Fournisseur',
      'Pays',
      'Disponibilité',
      'Caractéristiques'
    ];

    if (options.customFields) {
      headers.push(...options.customFields);
    }

    let csv = headers.join(',') + '\n';

    data.results.forEach(result => {
      const row = [
        `"${result.name.replace(/"/g, '""')}"`,
        `"${result.brand.replace(/"/g, '""')}"`,
        `"${result.category.replace(/"/g, '""')}"`,
        result.price.toString(),
        result.currency,
        result.rating.toString(),
        result.reviewCount.toString(),
        `"${result.provider.name.replace(/"/g, '""')}"`,
        `"${result.location.replace(/"/g, '""')}"`,
        `"${this.getAvailabilityText(result.availability)}"`,
        `"${(result.features || []).join('; ').replace(/"/g, '""')}"`
      ];

      csv += row.join(',') + '\n';
    });

    return csv;
  }

  // Générer un tableau de comparaison
  private static generateComparisonTable(results: SearchResult[]): string {
    if (results.length === 0) return '';

    let table = `
      <div class="comparison-section">
        <h2>Tableau de comparaison</h2>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Critère</th>
              ${results.map((result, i) => `<th>Produit ${i + 1}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    // Lignes de comparaison
    const comparisonRows = [
      { label: 'Nom', getValue: (r: SearchResult) => r.name },
      { label: 'Prix', getValue: (r: SearchResult) => this.formatPrice(r.price, r.currency) },
      { label: 'Marque', getValue: (r: SearchResult) => r.brand },
      { label: 'Note', getValue: (r: SearchResult) => `${r.rating}/5` },
      { label: 'Fournisseur', getValue: (r: SearchResult) => r.provider.name },
      { label: 'Disponibilité', getValue: (r: SearchResult) => this.getAvailabilityText(r.availability) }
    ];

    comparisonRows.forEach(row => {
      table += `
        <tr>
          <td><strong>${row.label}</strong></td>
          ${results.map(result => `<td>${row.getValue(result)}</td>`).join('')}
        </tr>
      `;
    });

    table += `
          </tbody>
        </table>
      </div>
    `;

    return table;
  }

  // Utilitaires
  private static formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  }

  private static getAvailabilityText(availability: string): string {
    switch (availability) {
      case 'available': return 'Disponible';
      case 'limited': return 'Stock limité';
      case 'out_of_stock': return 'Rupture de stock';
      case 'pre-order': return 'Pré-commande';
      default: return 'Non disponible';
    }
  }

  // Déclencher le téléchargement
  static downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Créer un nom de fichier unique
  static generateFilename(query: string, format: string): string {
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    const timestamp = new Date().toISOString().slice(0, 10);
    return `recherche_${sanitizedQuery}_${timestamp}.${format}`;
  }
}

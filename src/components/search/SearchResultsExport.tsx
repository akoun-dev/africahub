
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SearchResult } from '@/services/SearchService';
import { SearchExportService, ExportOptions, ExportData } from '@/services/SearchExportService';
import { Download, FileText, Table, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SearchResultsExportProps {
  results: SearchResult[];
  query: string;
  totalResults: number;
  filters: Record<string, any>;
}

export const SearchResultsExport: React.FC<SearchResultsExportProps> = ({
  results,
  query,
  totalResults,
  filters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeImages: false,
    includeComparison: true
  });

  const handleExport = async () => {
    if (results.length === 0) {
      toast.error('Aucun résultat à exporter');
      return;
    }

    setExporting(true);
    try {
      const exportData: ExportData = {
        results,
        metadata: {
          query,
          totalResults,
          exportDate: new Date().toISOString(),
          filters
        }
      };

      let blob: Blob;
      let filename: string;

      switch (exportOptions.format) {
        case 'pdf':
          blob = await SearchExportService.exportToPDF(exportData, exportOptions);
          filename = SearchExportService.generateFilename(query, 'pdf');
          break;
        case 'excel':
          blob = await SearchExportService.exportToExcel(exportData, exportOptions);
          filename = SearchExportService.generateFilename(query, 'xlsx');
          break;
        case 'csv':
          blob = await SearchExportService.exportToExcel(exportData, { ...exportOptions, format: 'csv' });
          filename = SearchExportService.generateFilename(query, 'csv');
          break;
        default:
          throw new Error('Format non supporté');
      }

      SearchExportService.downloadFile(blob, filename);
      toast.success(`Résultats exportés en ${exportOptions.format.toUpperCase()}`);
      setIsOpen(false);

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'csv':
        return <Table className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'pdf':
        return 'Document PDF avec mise en forme complète';
      case 'excel':
        return 'Fichier Excel avec données structurées';
      case 'csv':
        return 'Fichier CSV pour analyse de données';
      default:
        return '';
    }
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exporter ({results.length} résultats)
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exporter les résultats de recherche</DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Options d'export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Format d'export */}
            <div>
              <label className="text-sm font-medium mb-2 block">Format</label>
              <Select
                value={exportOptions.format}
                onValueChange={(value: 'pdf' | 'excel' | 'csv') =>
                  setExportOptions(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      {getFormatIcon('pdf')}
                      <div>
                        <div>PDF</div>
                        <div className="text-xs text-gray-500">
                          {getFormatDescription('pdf')}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      {getFormatIcon('excel')}
                      <div>
                        <div>Excel</div>
                        <div className="text-xs text-gray-500">
                          {getFormatDescription('excel')}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      {getFormatIcon('csv')}
                      <div>
                        <div>CSV</div>
                        <div className="text-xs text-gray-500">
                          {getFormatDescription('csv')}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options d'inclusion */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Contenu à inclure</label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeComparison"
                  checked={exportOptions.includeComparison}
                  onCheckedChange={(checked) =>
                    setExportOptions(prev => ({ ...prev, includeComparison: !!checked }))
                  }
                />
                <label htmlFor="includeComparison" className="text-sm">
                  Tableau de comparaison
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeImages"
                  checked={exportOptions.includeImages}
                  onCheckedChange={(checked) =>
                    setExportOptions(prev => ({ ...prev, includeImages: !!checked }))
                  }
                />
                <label htmlFor="includeImages" className="text-sm">
                  Images des produits (PDF uniquement)
                </label>
              </div>
            </div>

            {/* Résumé */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Recherche:</span>
                  <span className="font-medium">"{query}"</span>
                </div>
                <div className="flex justify-between">
                  <span>Résultats:</span>
                  <span className="font-medium">{results.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-medium uppercase">{exportOptions.format}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleExport}
                disabled={exporting}
                className="flex-1"
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    {getFormatIcon(exportOptions.format)}
                    <span className="ml-2">Exporter</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={exporting}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

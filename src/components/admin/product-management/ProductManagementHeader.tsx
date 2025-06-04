
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Plus, Settings } from 'lucide-react';
import { ProductFormDialog } from './ProductFormDialog';

export const ProductManagementHeader: React.FC = () => {
  const handleImport = () => {
    // TODO: Implement Excel import functionality
    console.log('Import Excel functionality coming soon...');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export functionality coming soon...');
  };

  const handleAdvancedSettings = () => {
    // TODO: Implement advanced settings
    console.log('Advanced settings coming soon...');
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
          Gestion Avancée des Produits
        </h2>
        <p className="text-gray-600">Configuration complète des produits multi-pays et multi-secteurs</p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleImport}>
          <Upload className="h-4 w-4 mr-2" />
          Import Excel
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={handleAdvancedSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </Button>
        <ProductFormDialog>
          <Button size="sm" className="bg-afroGreen hover:bg-afroGreen/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Produit
          </Button>
        </ProductFormDialog>
      </div>
    </div>
  );
};

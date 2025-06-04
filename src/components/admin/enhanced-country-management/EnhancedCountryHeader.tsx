
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Plus, FileSpreadsheet } from 'lucide-react';

export const EnhancedCountryHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
          Gestion Avancée des Pays
        </h2>
        <p className="text-gray-600">Configuration complète et analytics pour les 54 pays africains</p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Template Excel
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Masse
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Complet
        </Button>
        <Button size="sm" className="bg-afroGreen hover:bg-afroGreen/90">
          <Plus className="h-4 w-4 mr-2" />
          Configuration Rapide
        </Button>
      </div>
    </div>
  );
};

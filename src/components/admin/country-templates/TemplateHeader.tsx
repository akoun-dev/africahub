
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

export const TemplateHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold">Templates de Configuration</h3>
        <p className="text-gray-600">Modèles réutilisables pour la configuration des pays</p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Importer Template
        </Button>
        <Button size="sm" className="bg-afroGreen hover:bg-afroGreen/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Template
        </Button>
      </div>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  Settings,
  Globe,
  TrendingUp
} from 'lucide-react';

export const MassOperationsTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Opérations en Masse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Import/Export */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import Configurations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Importer configurations pays depuis Excel/CSV
                  </p>
                  <Button variant="outline" size="sm">
                    Choisir fichier
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Options d'import</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      Remplacer existant
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      Fusion intelligente
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      Validation uniquement
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export complet (54 pays)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export pays actifs uniquement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export configurations par région
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export template vierge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions Groupées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Settings className="h-6 w-6" />
                  <span className="text-sm">Appliquer template par région</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Globe className="h-6 w-6" />
                  <span className="text-sm">Mise à jour devises en masse</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Recalcul performances</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

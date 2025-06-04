
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, Globe, DollarSign } from 'lucide-react';

export const ProductStatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produits Actifs</p>
              <p className="text-2xl font-bold text-afroGreen">1,247</p>
            </div>
            <Package className="h-8 w-8 text-afroGreen" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-afroGold">23</p>
            </div>
            <Clock className="h-8 w-8 text-afroGold" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Zones Tarifaires</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sociétés Partenaires</p>
              <p className="text-2xl font-bold text-purple-600">89</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

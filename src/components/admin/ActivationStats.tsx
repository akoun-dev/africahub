
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useActivationStats } from '@/hooks/useActivationStats';
import { Building2, Package, Globe, Activity } from 'lucide-react';

export const ActivationStats = () => {
  const { data: stats, isLoading } = useActivationStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const activationRate = {
    companies: (stats.activeCompanies / stats.totalCompanies) * 100,
    products: (stats.activeProducts / stats.totalProducts) * 100,
    sectors: (stats.activeSectors / stats.totalSectors) * 100
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sociétés</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeCompanies}/{stats.totalCompanies}
            </div>
            <Progress value={activationRate.companies} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {activationRate.companies.toFixed(1)}% activées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeProducts}/{stats.totalProducts}
            </div>
            <Progress value={activationRate.products} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {activationRate.products.toFixed(1)}% activés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secteurs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeSectors}/{stats.totalSectors}
            </div>
            <Progress value={activationRate.sectors} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {activationRate.sectors.toFixed(1)}% activés
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Couverture géographique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.countryCoverage)
              .sort(([,a], [,b]) => b - a)
              .map(([country, count]) => (
                <div key={country} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-sm text-gray-500">{country}</div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGeographicPerformance, useCountryConfigurations } from '@/hooks/useGeographicManagement';
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';

export const GeographicMapDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const { data: performance, isLoading } = useGeographicPerformance(timeRange);
  const { data: countries } = useCountryConfigurations();

  if (isLoading) {
    return <div className="p-6">Chargement des données géographiques...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Aperçu géographique</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 derniers jours</SelectItem>
            <SelectItem value="30">30 derniers jours</SelectItem>
            <SelectItem value="90">90 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pays actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {countries?.filter(c => c.is_active).length || 0}
            </div>
            <p className="text-xs text-gray-500">sur {countries?.length || 0} configurés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Performance globale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +5% ce mois
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Croissance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">+12%</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              vs période précédente
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails par pays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {countries?.map((country) => (
              <div key={country.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">{country.country_name}</span>
                    <Badge variant="outline" className="ml-2">{country.country_code}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={country.is_active ? "default" : "secondary"}>
                    {country.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                  <span className="text-sm text-gray-600">{country.currency_code}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

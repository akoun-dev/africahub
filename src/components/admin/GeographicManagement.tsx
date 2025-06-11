
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Globe, MapPin, AlertTriangle, TrendingUp, Settings, DollarSign } from 'lucide-react';
import { 
  useCountryConfigurations, 
  usePricingZones,
  useGeographicPerformance,
  useGeographicAlerts,
  useUpdateCountryConfiguration,
  useResolveAlert,
  CountryConfiguration 
} from '@/hooks/useGeographicManagement';
import { GeographicDashboard } from './GeographicDashboard';

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

export const GeographicManagement = () => {
  const { data: countries, isLoading } = useCountryConfigurations();
  const { data: pricingZones } = usePricingZones();
  const { data: alerts } = useGeographicAlerts();
  const updateCountry = useUpdateCountryConfiguration();
  const resolveAlert = useResolveAlert();
  const [selectedCountry, setSelectedCountry] = useState<CountryConfiguration | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleToggleCountry = async (country: CountryConfiguration) => {
    try {
      await updateCountry.mutateAsync({
        id: country.id,
        updates: { is_active: !country.is_active }
      });
    } catch (error) {
      console.error('Error toggling country:', error);
    }
  };

  const activeCountries = countries?.filter(c => c.is_active) || [];
  const inactiveCountries = countries?.filter(c => !c.is_active) || [];
  const criticalAlerts = alerts?.filter(a => a.severity === 'critical') || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Gestion géographique
          </CardTitle>
          <p className="text-gray-600">
            Gérez le déploiement progressif par pays et surveillez les performances régionales
          </p>
        </CardHeader>
      </Card>

      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Alertes critiques ({criticalAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.country_code} - {alert.message}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => resolveAlert.mutate(alert.id)}
                  >
                    Résoudre
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pays actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCountries.length}</div>
            <p className="text-xs text-gray-500">sur {countries?.length || 0} configurés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Zones de tarification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pricingZones?.length || 0}</div>
            <p className="text-xs text-gray-500">zones configurées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alertes actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{alerts?.length || 0}</div>
            <p className="text-xs text-gray-500">nécessitent attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="countries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="countries" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Pays
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Tarification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="countries">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Configuration des pays</CardTitle>
              <Button disabled>Nouveau pays</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pays</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Devise</TableHead>
                    <TableHead>Zone tarifaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries?.map(country => (
                    <TableRow key={country.id}>
                      <TableCell className="font-medium">
                        {country.country_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{country.country_code}</Badge>
                      </TableCell>
                      <TableCell>{country.currency_code}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{country.pricing_zone}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={country.is_active}
                            onCheckedChange={() => handleToggleCountry(country)}
                          />
                          <span className="text-sm">
                            {country.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <GeographicDashboard />
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Zones de tarification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Fonctionnalité en développement</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

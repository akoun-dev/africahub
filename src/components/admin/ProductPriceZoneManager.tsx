
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Settings, 
  DollarSign, 
  Globe,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const ProductPriceZoneManager: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('premium');

  const priceZones = [
    {
      id: 'premium',
      name: 'Zone Premium',
      countries: ['NG', 'ZA', 'KE', 'EG'],
      multiplier: 1.5,
      currency: 'USD',
      products: 156,
      avgPrice: 2500
    },
    {
      id: 'standard',
      name: 'Zone Standard',
      countries: ['SN', 'CI', 'GH', 'CM'],
      multiplier: 1.0,
      currency: 'XOF',
      products: 189,
      avgPrice: 180000
    },
    {
      id: 'emerging',
      name: 'Zone Émergente',
      countries: ['ML', 'BF', 'NE', 'TD'],
      multiplier: 0.7,
      currency: 'XOF',
      products: 98,
      avgPrice: 125000
    }
  ];

  const productPrices = [
    {
      id: '1',
      name: 'Assurance Auto Premium',
      basePrice: 200000,
      zones: {
        premium: 300000,
        standard: 200000,
        emerging: 140000
      },
      currency: 'XOF',
      lastUpdated: '2025-01-25'
    },
    {
      id: '2',
      name: 'Forfait Internet Fibre',
      basePrice: 45000,
      zones: {
        premium: 67500,
        standard: 45000,
        emerging: 31500
      },
      currency: 'XOF',
      lastUpdated: '2025-01-24'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Gestion des Zones Tarifaires</h3>
          <p className="text-gray-600">Configuration des prix par région géographique</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres Globaux
          </Button>
          <Button size="sm" className="bg-afroGreen hover:bg-afroGreen/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Zone
          </Button>
        </div>
      </div>

      {/* Price Zones Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {priceZones.map((zone) => (
          <Card 
            key={zone.id} 
            className={`cursor-pointer transition-all ${
              selectedZone === zone.id ? 'ring-2 ring-afroGreen border-afroGreen' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedZone(zone.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{zone.name}</CardTitle>
                <Badge variant="outline">x{zone.multiplier}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pays</span>
                <div className="flex gap-1">
                  {zone.countries.slice(0, 3).map(country => (
                    <Badge key={country} variant="secondary" className="text-xs">
                      {country}
                    </Badge>
                  ))}
                  {zone.countries.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{zone.countries.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Produits</span>
                <span className="font-medium">{zone.products}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Prix moyen</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <span className="font-medium">
                    {zone.avgPrice.toLocaleString()} {zone.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Zone Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration de Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zoneName">Nom de la zone</Label>
              <Input
                id="zoneName"
                placeholder="Ex: Zone Premium Afrique de l'Ouest"
                defaultValue={priceZones.find(z => z.id === selectedZone)?.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="multiplier">Multiplicateur de prix</Label>
              <Input
                id="multiplier"
                type="number"
                step="0.1"
                placeholder="1.0"
                defaultValue={priceZones.find(z => z.id === selectedZone)?.multiplier}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise par défaut</Label>
              <Select defaultValue={priceZones.find(z => z.id === selectedZone)?.currency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">XOF (Franc CFA)</SelectItem>
                  <SelectItem value="USD">USD (Dollar US)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="MAD">MAD (Dirham)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pays inclus</Label>
              <div className="flex flex-wrap gap-2">
                {priceZones.find(z => z.id === selectedZone)?.countries.map(country => (
                  <Badge key={country} variant="outline" className="cursor-pointer hover:bg-gray-100">
                    {country} ✕
                  </Badge>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter pays
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="bg-afroGreen hover:bg-afroGreen/90">
                Sauvegarder
              </Button>
              <Button variant="outline">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Price Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des Prix</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Prix de base</TableHead>
                  <TableHead>Prix zone</TableHead>
                  <TableHead>Variation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productPrices.map((product) => {
                  const zonePrice = product.zones[selectedZone as keyof typeof product.zones];
                  const variation = ((zonePrice - product.basePrice) / product.basePrice * 100).toFixed(1);
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.basePrice.toLocaleString()} {product.currency}</TableCell>
                      <TableCell>{zonePrice.toLocaleString()} {product.currency}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {parseFloat(variation) > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : parseFloat(variation) < 0 ? (
                            <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                          ) : null}
                          <span className={
                            parseFloat(variation) > 0 ? 'text-green-600' : 
                            parseFloat(variation) < 0 ? 'text-red-600' : 'text-gray-600'
                          }>
                            {variation}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Appliquer aux nouveaux pays
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Recalculer tous les prix
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Vérifier incohérences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

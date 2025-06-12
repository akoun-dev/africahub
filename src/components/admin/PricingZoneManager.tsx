
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { DollarSign, Edit, Plus } from 'lucide-react';
import { usePricingZones, useUpdatePricingZone, PricingZone } from '@/hooks/useGeographicManagement';

export const PricingZoneManager: React.FC = () => {
  const { data: pricingZones, isLoading } = usePricingZones();
  const updatePricingZone = useUpdatePricingZone();
  const [selectedZone, setSelectedZone] = useState<PricingZone | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      zone_name: '',
      zone_code: '',
      description: '',
      base_multiplier: 1.0,
      countries: '',
      is_active: true
    }
  });

  React.useEffect(() => {
    if (selectedZone) {
      reset({
        zone_name: selectedZone.zone_name,
        zone_code: selectedZone.zone_code,
        description: selectedZone.description || '',
        base_multiplier: selectedZone.base_multiplier || 1.0,
        countries: selectedZone.countries?.join(', ') || '',
        is_active: selectedZone.is_active
      });
    } else {
      reset({
        zone_name: '',
        zone_code: '',
        description: '',
        base_multiplier: 1.0,
        countries: '',
        is_active: true
      });
    }
  }, [selectedZone, reset]);

  const onSubmit = async (data: any) => {
    try {
      const formData = {
        ...data,
        countries: data.countries.split(',').map((c: string) => c.trim()).filter(Boolean),
        base_multiplier: parseFloat(data.base_multiplier)
      };

      if (selectedZone) {
        await updatePricingZone.mutateAsync({ id: selectedZone.id, ...formData });
      }
      
      setShowForm(false);
      setSelectedZone(null);
    } catch (error) {
      console.error('Error saving pricing zone:', error);
    }
  };

  const getMultiplierColor = (multiplier: number | null) => {
    if (!multiplier) return 'bg-gray-100 text-gray-800';
    if (multiplier < 1) return 'bg-green-100 text-green-800';
    if (multiplier === 1) return 'bg-blue-100 text-blue-800';
    return 'bg-orange-100 text-orange-800';
  };

  if (isLoading) {
    return <div className="p-6">Chargement des zones de tarification...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Zones de tarification
          </CardTitle>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedZone(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle zone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedZone ? 'Modifier la zone' : 'Créer une nouvelle zone'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zone_name">Nom de la zone</Label>
                    <Input
                      id="zone_name"
                      {...register('zone_name', { required: true })}
                      placeholder="Zone Premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zone_code">Code de la zone</Label>
                    <Input
                      id="zone_code"
                      {...register('zone_code', { required: true })}
                      placeholder="PREMIUM"
                      disabled={!!selectedZone}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Description de la zone de tarification"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="base_multiplier">Multiplicateur de base</Label>
                  <Input
                    id="base_multiplier"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    {...register('base_multiplier', { required: true })}
                  />
                  <p className="text-sm text-gray-500">
                    1.0 = tarif standard, &lt;1.0 = réduction, &gt;1.0 = majoration
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countries">Pays (codes séparés par des virgules)</Label>
                  <Input
                    id="countries"
                    {...register('countries')}
                    placeholder="NG, GH, KE, TZ"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={watch('is_active')}
                    onCheckedChange={(checked) => setValue('is_active', checked)}
                  />
                  <Label>Zone active</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {selectedZone ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Multiplicateur</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingZones?.map(zone => (
                <TableRow key={zone.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{zone.zone_name}</div>
                      {zone.description && (
                        <div className="text-sm text-gray-500">{zone.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{zone.zone_code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getMultiplierColor(zone.base_multiplier)}>
                      x{zone.base_multiplier?.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {zone.countries?.slice(0, 3).map(country => (
                        <Badge key={country} variant="secondary" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                      {zone.countries && zone.countries.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{zone.countries.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={zone.is_active ? "default" : "secondary"}>
                      {zone.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedZone(zone);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const CreateTemplateForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un Nouveau Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Nom du template</Label>
            <Input
              id="templateName"
              placeholder="Ex: Zone Maghreb Premium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateDesc">Description</Label>
            <Input
              id="templateDesc"
              placeholder="Description du template..."
            />
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <h4 className="font-medium">Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Devise par défaut</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner devise" />
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
              <Label>Fuseau horaire</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner fuseau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                  <SelectItem value="UTC+1">UTC+1 (WAT/CET)</SelectItem>
                  <SelectItem value="UTC+2">UTC+2 (CAT/EET)</SelectItem>
                  <SelectItem value="UTC+3">UTC+3 (EAT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format de date</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Format date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Taux de commission (%)</Label>
              <Input type="number" placeholder="10" min="0" max="50" />
            </div>
          </div>
        </div>

        {/* Regulatory Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Paramètres Réglementaires</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Niveau réglementaire</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bas</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="high">Élevé</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Set de templates email</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Templates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic_set">Set Basique</SelectItem>
                  <SelectItem value="standard_set">Set Standard</SelectItem>
                  <SelectItem value="premium_set">Set Premium</SelectItem>
                  <SelectItem value="custom_set">Set Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="bg-afroGreen hover:bg-afroGreen/90">
            Créer Template
          </Button>
          <Button variant="outline">
            Prévisualiser
          </Button>
          <Button variant="outline">
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IntegrationFormProps {
  onClose: () => void;
}

export const IntegrationForm: React.FC<IntegrationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    connector_type: '',
    api_endpoint: '',
    sector_slug: '',
    sync_frequency: 24,
    api_key: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating integration:', formData);
    // Ici vous pouvez appeler votre API pour créer l'intégration
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle intégration externe</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l'intégration</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: API Jumia Products"
              required
            />
          </div>

          <div>
            <Label htmlFor="connectorType">Type de connecteur</Label>
            <Select value={formData.connector_type} onValueChange={(value) => setFormData({ ...formData, connector_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rest">REST API</SelectItem>
                <SelectItem value="graphql">GraphQL</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="csv">Import CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="endpoint">URL de l'API</Label>
            <Input
              id="endpoint"
              value={formData.api_endpoint}
              onChange={(e) => setFormData({ ...formData, api_endpoint: e.target.value })}
              placeholder="https://api.example.com/v1"
              required
            />
          </div>

          <div>
            <Label htmlFor="sector">Secteur</Label>
            <Select value={formData.sector_slug} onValueChange={(value) => setFormData({ ...formData, sector_slug: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un secteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assurance">Assurance</SelectItem>
                <SelectItem value="telecom">Télécoms</SelectItem>
                <SelectItem value="banque">Banque</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="syncFreq">Fréquence de synchronisation (heures)</Label>
            <Input
              id="syncFreq"
              type="number"
              value={formData.sync_frequency}
              onChange={(e) => setFormData({ ...formData, sync_frequency: parseInt(e.target.value) })}
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="apiKey">Clé API (optionnel)</Label>
            <Input
              id="apiKey"
              type="password"
              value={formData.api_key}
              onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
              placeholder="Clé d'authentification"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Créer</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

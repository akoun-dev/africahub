
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Plus, Edit, Eye, BarChart3 } from 'lucide-react';

export const AdvertisementManager: React.FC = () => {
  const [campaigns] = useState([
    {
      id: '1',
      name: 'Promotion Assurance Auto',
      status: 'active',
      budget: 50000,
      spent: 12500,
      impressions: 45000,
      clicks: 1200,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      targetCountries: ['CI', 'SN'],
      targetSectors: ['assurance']
    },
    {
      id: '2',
      name: 'Forfaits Internet Mobile',
      status: 'paused',
      budget: 30000,
      spent: 18000,
      impressions: 32000,
      clicks: 890,
      startDate: '2024-01-10',
      endDate: '2024-01-31',
      targetCountries: ['CI'],
      targetSectors: ['telecom']
    },
    {
      id: '3',
      name: 'Services Bancaires',
      status: 'draft',
      budget: 75000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      targetCountries: ['CI', 'SN', 'BF'],
      targetSectors: ['banque']
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge variant="outline" className="border-orange-200 text-orange-800">En pause</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'completed':
        return <Badge variant="outline">Terminée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  };

  const calculateCPC = (spent: number, clicks: number) => {
    return clicks > 0 ? (spent / clicks).toFixed(0) : '0';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Gestion des publicités
            </CardTitle>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle campagne
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <Card className="mb-6 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Créer une campagne publicitaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaignName">Nom de la campagne</Label>
                    <Input id="campaignName" placeholder="Ex: Promotion Assurance Auto" />
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Budget total (XOF)</Label>
                    <Input id="budget" type="number" placeholder="50000" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Description de la campagne..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Date de début</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">Date de fin</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetCountries">Pays ciblés</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner les pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                        <SelectItem value="SN">Sénégal</SelectItem>
                        <SelectItem value="BF">Burkina Faso</SelectItem>
                        <SelectItem value="MA">Maroc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="targetSectors">Secteurs ciblés</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner les secteurs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assurance">Assurance</SelectItem>
                        <SelectItem value="telecom">Télécoms</SelectItem>
                        <SelectItem value="banque">Banque</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>Créer la campagne</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Pays: {campaign.targetCountries.join(', ')}</span>
                        <span>Secteurs: {campaign.targetSectors.join(', ')}</span>
                        <span>{campaign.startDate} - {campaign.endDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Budget:</span>
                      <p className="font-medium">{campaign.budget.toLocaleString()} XOF</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Dépensé:</span>
                      <p className="font-medium text-blue-600">{campaign.spent.toLocaleString()} XOF</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Impressions:</span>
                      <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Clics:</span>
                      <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">CTR:</span>
                      <p className="font-medium">{calculateCTR(campaign.clicks, campaign.impressions)}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">CPC:</span>
                      <p className="font-medium">{calculateCPC(campaign.spent, campaign.clicks)} XOF</p>
                    </div>
                  </div>
                  
                  {campaign.budget > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progression du budget</span>
                        <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {campaigns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune campagne publicitaire trouvée
              </div>
            )}
          </div>

          <div className="mt-6 bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 mb-2">
              Gestion des publicités
            </h4>
            <div className="text-xs text-purple-700 space-y-1">
              <p>• Créez et gérez des campagnes publicitaires ciblées</p>
              <p>• Suivez les performances en temps réel</p>
              <p>• Optimisez le budget et le ciblage</p>
              <p>• Analysez le retour sur investissement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Smartphone, Settings, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export const MobilePaymentIntegrations: React.FC = () => {
  const [integrations] = useState([
    {
      id: '1',
      provider: 'Orange Money',
      country: 'CI',
      status: 'active',
      lastSync: '2024-01-20 14:30',
      transactionCount: 1250,
      apiVersion: 'v2.1'
    },
    {
      id: '2',
      provider: 'MTN Mobile Money',
      country: 'CI',
      status: 'active',
      lastSync: '2024-01-20 14:25',
      transactionCount: 980,
      apiVersion: 'v1.5'
    },
    {
      id: '3',
      provider: 'Moov Money',
      country: 'CI',
      status: 'inactive',
      lastSync: '2024-01-15 10:00',
      transactionCount: 0,
      apiVersion: 'v1.2'
    },
    {
      id: '4',
      provider: 'Wave',
      country: 'SN',
      status: 'testing',
      lastSync: '2024-01-20 12:00',
      transactionCount: 45,
      apiVersion: 'v2.0'
    }
  ]);

  const [showNewIntegration, setShowNewIntegration] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      case 'testing':
        return <Badge variant="outline" className="border-orange-200 text-orange-800">Test</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      case 'testing':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Intégrations Mobile Money
            </CardTitle>
            <Button onClick={() => setShowNewIntegration(!showNewIntegration)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle intégration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showNewIntegration && (
            <Card className="mb-6 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Nouvelle intégration Mobile Money</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provider">Fournisseur</Label>
                    <Input id="provider" placeholder="Ex: Orange Money" />
                  </div>
                  <div>
                    <Label htmlFor="country">Pays</Label>
                    <Input id="country" placeholder="Ex: CI, SN, BF..." />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apiKey">Clé API</Label>
                    <Input id="apiKey" type="password" placeholder="Clé API du fournisseur" />
                  </div>
                  <div>
                    <Label htmlFor="apiSecret">Secret API</Label>
                    <Input id="apiSecret" type="password" placeholder="Secret API" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="sandbox" />
                  <Label htmlFor="sandbox">Mode test (Sandbox)</Label>
                </div>
                
                <div className="flex gap-2">
                  <Button>Tester la connexion</Button>
                  <Button variant="outline" onClick={() => setShowNewIntegration(false)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(integration.status)}
                      <div>
                        <h3 className="font-medium">{integration.provider}</h3>
                        <p className="text-sm text-gray-600">Pays: {integration.country}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(integration.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Dernière sync:</span>
                      <p className="font-medium">{integration.lastSync}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Transactions:</span>
                      <p className="font-medium">{integration.transactionCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Version API:</span>
                      <p className="font-medium">{integration.apiVersion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Configuration Mobile Money
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Configurez les API des principaux fournisseurs Mobile Money d'Afrique</p>
              <p>• Testez les intégrations en mode sandbox avant la mise en production</p>
              <p>• Surveillez les transactions et la synchronisation en temps réel</p>
              <p>• Gérez les devises et taux de change automatiquement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

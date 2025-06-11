
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, ExternalLink, Plus, Settings } from 'lucide-react';

export const EcommerceIntegrations: React.FC = () => {
  const [partners] = useState([
    {
      id: '1',
      name: 'Jumia CI',
      website: 'jumia.ci',
      category: 'Marketplace',
      status: 'active',
      commissionRate: 3.5,
      redirectCount: 2450,
      conversionRate: 12.8
    },
    {
      id: '2',
      name: 'Telecel Shop',
      website: 'shop.telecel.ci',
      category: 'Télécom',
      status: 'active',
      commissionRate: 5.0,
      redirectCount: 1200,
      conversionRate: 18.5
    },
    {
      id: '3',
      name: 'NSIA Assurance',
      website: 'nsia.ci',
      category: 'Assurance',
      status: 'pending',
      commissionRate: 2.0,
      redirectCount: 890,
      conversionRate: 8.2
    },
    {
      id: '4',
      name: 'UBA Mobile',
      website: 'uba.ci',
      category: 'Banque',
      status: 'inactive',
      commissionRate: 1.5,
      redirectCount: 120,
      conversionRate: 5.1
    }
  ]);

  const [showNewPartner, setShowNewPartner] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-orange-200 text-orange-800">En attente</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Partenaires E-commerce
            </CardTitle>
            <Button onClick={() => setShowNewPartner(!showNewPartner)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau partenaire
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showNewPartner && (
            <Card className="mb-6 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Nouveau partenaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partnerName">Nom du partenaire</Label>
                    <Input id="partnerName" placeholder="Ex: Jumia CI" />
                  </div>
                  <div>
                    <Label htmlFor="website">Site web</Label>
                    <Input id="website" placeholder="Ex: jumia.ci" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Input id="category" placeholder="Ex: Marketplace, Banque..." />
                  </div>
                  <div>
                    <Label htmlFor="commission">Taux de commission (%)</Label>
                    <Input id="commission" type="number" placeholder="Ex: 3.5" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="redirectUrl">URL de redirection</Label>
                  <Input id="redirectUrl" placeholder="https://..." />
                </div>
                
                <div className="flex gap-2">
                  <Button>Ajouter le partenaire</Button>
                  <Button variant="outline" onClick={() => setShowNewPartner(false)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {partners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{partner.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{partner.category}</Badge>
                        <a 
                          href={`https://${partner.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {partner.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(partner.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Commission:</span>
                      <p className="font-medium">{partner.commissionRate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Redirections:</span>
                      <p className="font-medium">{partner.redirectCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Taux de conversion:</span>
                      <p className="font-medium">{partner.conversionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">
              Intégrations E-commerce
            </h4>
            <div className="text-xs text-green-700 space-y-1">
              <p>• Gérez les redirections vers les sites partenaires</p>
              <p>• Suivez les commissions et taux de conversion</p>
              <p>• Configurez les URLs de tracking personnalisées</p>
              <p>• Analysez les performances par secteur</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Settings, 
  Users, 
  Calendar,
  MapPin,
  Filter,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export const ProductAvailabilityRules: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState('geographic');

  const availabilityRules = [
    {
      id: '1',
      name: 'Restriction géographique - Assurance Auto',
      type: 'geographic',
      conditions: ['SN', 'CI', 'ML'],
      products: 23,
      status: 'active',
      description: 'Disponible uniquement dans les pays CEDEAO'
    },
    {
      id: '2',
      name: 'Âge minimum - Produits bancaires',
      type: 'demographic',
      conditions: ['age >= 18'],
      products: 45,
      status: 'active',
      description: 'Réservé aux adultes majeurs'
    },
    {
      id: '3',
      name: 'Revenus - Assurance Premium',
      type: 'financial',
      conditions: ['income >= 500000'],
      products: 12,
      status: 'draft',
      description: 'Pour clients à revenus élevés'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      draft: { variant: 'secondary', icon: Settings, color: 'text-gray-600' },
      inactive: { variant: 'outline', icon: AlertCircle, color: 'text-red-600' }
    } as const;

    const config = variants[status as keyof typeof variants] || variants.inactive;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'geographic': return <MapPin className="h-4 w-4" />;
      case 'demographic': return <Users className="h-4 w-4" />;
      case 'financial': return <Settings className="h-4 w-4" />;
      case 'temporal': return <Calendar className="h-4 w-4" />;
      default: return <Filter className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Règles de Disponibilité</h3>
          <p className="text-gray-600">Configuration des conditions d'accès aux produits</p>
        </div>
        
        <Button size="sm" className="bg-afroGreen hover:bg-afroGreen/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Règle
        </Button>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Règles Actives</TabsTrigger>
          <TabsTrigger value="create">Créer Règle</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Règles Actives</p>
                    <p className="text-2xl font-bold text-afroGreen">12</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-afroGreen" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Géographiques</p>
                    <p className="text-2xl font-bold text-blue-600">8</p>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Démographiques</p>
                    <p className="text-2xl font-bold text-purple-600">3</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Produits Affectés</p>
                    <p className="text-2xl font-bold text-afroGold">234</p>
                  </div>
                  <Filter className="h-8 w-8 text-afroGold" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rules List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {availabilityRules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getRuleIcon(rule.type)}
                      <div>
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(rule.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <Badge variant="outline" className="capitalize">
                      {rule.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conditions</span>
                    <div className="flex gap-1 flex-wrap">
                      {rule.conditions.slice(0, 2).map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                      {rule.conditions.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{rule.conditions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Produits affectés</span>
                    <span className="font-medium">{rule.products}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configurer
                    </Button>
                    <Button size="sm" variant="outline">
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Créer une Nouvelle Règle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rule Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ruleName">Nom de la règle</Label>
                  <Input
                    id="ruleName"
                    placeholder="Ex: Restriction géographique Afrique de l'Ouest"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ruleType">Type de règle</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geographic">Géographique</SelectItem>
                      <SelectItem value="demographic">Démographique</SelectItem>
                      <SelectItem value="financial">Financière</SelectItem>
                      <SelectItem value="temporal">Temporelle</SelectItem>
                      <SelectItem value="composite">Composite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Description détaillée de la règle..."
                />
              </div>

              {/* Rule Conditions */}
              <div className="space-y-4">
                <Label>Conditions d'application</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pays autorisés</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SN">Sénégal</SelectItem>
                        <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                        <SelectItem value="ML">Mali</SelectItem>
                        <SelectItem value="BF">Burkina Faso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Âge minimum</Label>
                    <Input type="number" placeholder="18" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Revenus minimum (XOF)</Label>
                    <Input type="number" placeholder="100000" />
                  </div>

                  <div className="space-y-2">
                    <Label>Secteur d'activité</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous secteurs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous secteurs</SelectItem>
                        <SelectItem value="assurance">Assurance</SelectItem>
                        <SelectItem value="banque">Banque</SelectItem>
                        <SelectItem value="telephonie">Téléphonie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Rule Settings */}
              <div className="space-y-4">
                <Label>Paramètres de la règle</Label>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="priority">Priorité élevée</Label>
                    <p className="text-sm text-gray-600">Cette règle sera appliquée en premier</p>
                  </div>
                  <Switch id="priority" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="active">Activer immédiatement</Label>
                    <p className="text-sm text-gray-600">La règle sera active dès sa création</p>
                  </div>
                  <Switch id="active" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notification">Notifications</Label>
                    <p className="text-sm text-gray-600">Alerter lors de violations de règle</p>
                  </div>
                  <Switch id="notification" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-afroGreen hover:bg-afroGreen/90">
                  Créer la Règle
                </Button>
                <Button variant="outline">
                  Test Préalable
                </Button>
                <Button variant="outline">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Règles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Restriction CEDEAO',
                    type: 'geographic',
                    description: 'Limiter aux pays de la CEDEAO',
                    uses: 45
                  },
                  {
                    name: 'Âge Bancaire',
                    type: 'demographic',
                    description: 'Produits bancaires pour majeurs',
                    uses: 23
                  },
                  {
                    name: 'Premium Revenus',
                    type: 'financial',
                    description: 'Produits haut de gamme',
                    uses: 12
                  }
                ].map((template, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getRuleIcon(template.type)}
                        <h4 className="font-medium">{template.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {template.uses} utilisations
                        </Badge>
                        <Button size="sm" variant="outline">
                          Utiliser
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Key, 
  Code, 
  Globe, 
  Settings, 
  Users, 
  Activity,
  Copy,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  BarChart3
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rate_limit: number;
  usage_count: number;
  last_used: string | null;
  is_active: boolean;
  created_at: string;
}

interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  parameters: any[];
  example_request: string;
  example_response: string;
}

interface APIUsage {
  id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time: number | null;
  created_at: string;
}

export const PublicAPIManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [apiUsage, setApiUsage] = useState<APIUsage[]>([]);
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    permissions: [] as string[],
    rate_limit: 1000
  });
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  const apiEndpoints: APIEndpoint[] = [
    {
      path: '/api/v1/products',
      method: 'GET',
      description: 'Récupérer la liste des produits avec filtres',
      parameters: [
        { name: 'sector', type: 'string', required: false, description: 'Filtrer par secteur' },
        { name: 'country', type: 'string', required: false, description: 'Filtrer par pays' },
        { name: 'limit', type: 'number', required: false, description: 'Nombre de résultats (max 100)' },
        { name: 'offset', type: 'number', required: false, description: 'Décalage pour pagination' }
      ],
      example_request: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.votre-domaine.com/api/v1/products?sector=insurance&country=senegal&limit=10"`,
      example_response: `{
  "data": [
    {
      "id": "123",
      "name": "Assurance Auto Premium",
      "description": "Couverture complète...",
      "price": 250000,
      "currency": "XOF",
      "company": {
        "name": "AssurPlus",
        "logo_url": "..."
      }
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 10,
    "offset": 0
  }
}`
    },
    {
      path: '/api/v1/compare',
      method: 'POST',
      description: 'Comparer plusieurs produits',
      parameters: [
        { name: 'product_ids', type: 'array', required: true, description: 'IDs des produits à comparer' },
        { name: 'criteria', type: 'array', required: false, description: 'Critères de comparaison spécifiques' }
      ],
      example_request: `curl -X POST \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "product_ids": ["123", "456", "789"],
    "criteria": ["price", "coverage", "rating"]
  }' \\
  "https://api.votre-domaine.com/api/v1/compare"`,
      example_response: `{
  "comparison": {
    "products": [...],
    "criteria_comparison": {...},
    "recommendation": {
      "best_overall": "123",
      "best_price": "456",
      "reasoning": "..."
    }
  }
}`
    },
    {
      path: '/api/v1/quote',
      method: 'POST',
      description: 'Demander un devis',
      parameters: [
        { name: 'product_id', type: 'string', required: true, description: 'ID du produit' },
        { name: 'user_data', type: 'object', required: true, description: 'Données utilisateur' },
        { name: 'preferences', type: 'object', required: false, description: 'Préférences spécifiques' }
      ],
      example_request: `curl -X POST \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "product_id": "123",
    "user_data": {
      "age": 30,
      "location": "Dakar",
      "profile": "standard"
    }
  }' \\
  "https://api.votre-domaine.com/api/v1/quote"`,
      example_response: `{
  "quote": {
    "id": "quote_789",
    "product_id": "123",
    "estimated_price": 285000,
    "currency": "XOF",
    "valid_until": "2024-02-15T00:00:00Z",
    "details": {...}
  }
}`
    }
  ];

  const availablePermissions = [
    'products:read',
    'products:write',
    'comparisons:create',
    'quotes:create',
    'analytics:read',
    'users:read'
  ];

  useEffect(() => {
    loadAPIKeys();
    loadAPIUsage();
  }, []);

  const loadAPIKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des clés API:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clés API",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAPIUsage = async () => {
    try {
      const { data, error } = await supabase
        .from('api_usage')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setApiUsage(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const generateAPIKey = async () => {
    if (!newKeyForm.name) {
      toast({
        title: "Erreur",
        description: "Le nom de la clé est requis",
        variant: "destructive"
      });
      return;
    }

    try {
      const apiKey = `ak_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      
      const { error } = await supabase
        .from('api_keys')
        .insert({
          name: newKeyForm.name,
          key: apiKey,
          permissions: newKeyForm.permissions,
          rate_limit: newKeyForm.rate_limit,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      await loadAPIKeys();
      setNewKeyForm({ name: '', permissions: [], rate_limit: 1000 });
      
      toast({
        title: "Clé API créée",
        description: "La nouvelle clé API a été générée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la création de la clé API:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la clé API",
        variant: "destructive"
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Clé API copiée dans le presse-papiers"
    });
  };

  const deactivateKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;
      await loadAPIKeys();
      
      toast({
        title: "Clé désactivée",
        description: "La clé API a été désactivée"
      });
    } catch (error) {
      console.error('Erreur lors de la désactivation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const todayRequests = apiUsage.filter(usage => {
    const today = new Date();
    const usageDate = new Date(usage.created_at);
    return usageDate.toDateString() === today.toDateString();
  }).length;

  const errors = apiUsage.filter(usage => usage.status_code >= 400).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Publique</h1>
          <p className="text-gray-600">Gestion des accès et documentation API</p>
        </div>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">Clés API</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="usage">Utilisation</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          {/* Créer nouvelle clé */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Créer une nouvelle clé API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="keyName">Nom de la clé</Label>
                  <Input
                    id="keyName"
                    value={newKeyForm.name}
                    onChange={(e) => setNewKeyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ex: Application Mobile"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rateLimit">Limite de requêtes/heure</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={newKeyForm.rate_limit}
                    onChange={(e) => setNewKeyForm(prev => ({ ...prev, rate_limit: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {availablePermissions.map(permission => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newKeyForm.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewKeyForm(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, permission]
                            }));
                          } else {
                            setNewKeyForm(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Button onClick={generateAPIKey}>
                <Key className="h-4 w-4 mr-2" />
                Générer la clé
              </Button>
            </CardContent>
          </Card>

          {/* Liste des clés existantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Clés API existantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                            {apiKey.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Permissions: {apiKey.permissions.join(', ')}</div>
                          <div>Limite: {apiKey.rate_limit} req/h | Utilisé: {apiKey.usage_count}</div>
                          <div>Dernière utilisation: {apiKey.last_used ? new Date(apiKey.last_used).toLocaleString() : 'Jamais'}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deactivateKey(apiKey.id)}
                          disabled={!apiKey.is_active}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {apiKeys.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Key className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune clé API créée</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Documentation API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  URL de base: <code>https://api.votre-domaine.com</code><br/>
                  Authentification: <code>Authorization: Bearer YOUR_API_KEY</code>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-8">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-lg font-medium">{endpoint.path}</code>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{endpoint.description}</p>
                    
                    {endpoint.parameters.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Paramètres</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Nom</th>
                                <th className="text-left p-2">Type</th>
                                <th className="text-left p-2">Requis</th>
                                <th className="text-left p-2">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.parameters.map((param, paramIndex) => (
                                <tr key={paramIndex} className="border-b">
                                  <td className="p-2"><code>{param.name}</code></td>
                                  <td className="p-2">{param.type}</td>
                                  <td className="p-2">{param.required ? 'Oui' : 'Non'}</td>
                                  <td className="p-2">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Exemple de requête</h4>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                          {endpoint.example_request}
                        </pre>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Exemple de réponse</h4>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                          {endpoint.example_response}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Requêtes Aujourd'hui</p>
                    <p className="text-2xl font-bold">{todayRequests}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clés Actives</p>
                    <p className="text-2xl font-bold">{apiKeys.filter(k => k.is_active).length}</p>
                  </div>
                  <Key className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Erreurs</p>
                    <p className="text-2xl font-bold text-red-600">{errors}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Utilisation par endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { endpoint: '/api/v1/products', requests: 1247, errors: 5 },
                  { endpoint: '/api/v1/compare', requests: 892, errors: 3 },
                  { endpoint: '/api/v1/quote', requests: 708, errors: 4 }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <code className="font-medium">{stat.endpoint}</code>
                      <div className="text-sm text-gray-600">
                        {stat.requests} requêtes | {stat.errors} erreurs
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{Math.round((stat.requests - stat.errors) / stat.requests * 100)}%</div>
                      <div className="text-xs text-gray-500">succès</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

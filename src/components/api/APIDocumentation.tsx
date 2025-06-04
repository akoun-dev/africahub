
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Globe, Key, Shield } from 'lucide-react';

export const APIDocumentation: React.FC = () => {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/products',
      description: 'Récupérer la liste des produits',
      auth: 'API Key',
      params: ['country', 'sector', 'limit', 'offset']
    },
    {
      method: 'POST',
      path: '/api/v1/products',
      description: 'Créer un nouveau produit',
      auth: 'API Key + Write Permission',
      params: ['name', 'description', 'price', 'company_id']
    },
    {
      method: 'GET',
      path: '/api/v1/companies',
      description: 'Récupérer la liste des entreprises',
      auth: 'API Key',
      params: ['country', 'sector', 'is_partner']
    },
    {
      method: 'POST',
      path: '/api/v1/quotes',
      description: 'Créer une demande de devis',
      auth: 'API Key + Write Permission',
      params: ['insurance_type', 'user_data', 'specific_data']
    }
  ];

  const getMethodBadge = (method: string) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {method}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Documentation API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Introduction */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">API AfricaHub v1.0</h3>
            <p className="text-sm text-blue-700">
              Notre API RESTful permet d'accéder aux données de produits, entreprises et devis 
              à travers l'Afrique. Utilisez votre clé API pour authentifier vos requêtes.
            </p>
          </div>

          {/* Authentification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-4 w-4" />
                Authentification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">Incluez votre clé API dans l'en-tête de chaque requête :</p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </div>
                <p className="text-xs text-gray-600">
                  Vous pouvez créer une clé API dans l'onglet "Clés API" de cette interface.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Endpoints disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {getMethodBadge(endpoint.method)}
                      <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{endpoint.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium">Authentification:</span>
                        <span className="ml-1 text-gray-600">{endpoint.auth}</span>
                      </div>
                      <div>
                        <span className="font-medium">Paramètres:</span>
                        <span className="ml-1 text-gray-600">
                          {endpoint.params.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Limites */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Limites et quotas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Requêtes par minute (par défaut):</span>
                  <span className="font-medium">1,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Requêtes par jour:</span>
                  <span className="font-medium">100,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Taille max des réponses:</span>
                  <span className="font-medium">10 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Timeout:</span>
                  <span className="font-medium">30 secondes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exemple */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exemple de requête</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">Récupérer les produits d'assurance en Côte d'Ivoire :</p>
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                  {`curl -X GET "https://api.africahub.com/v1/products?country=CI&sector=assurance" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

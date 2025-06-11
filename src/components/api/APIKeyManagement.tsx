
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAPIKeys } from '@/hooks/useAPIManagement';
import { APIKeyForm } from './APIKeyForm';
import { APIKeyDetails } from './APIKeyDetails';
import { 
  Key, 
  Plus, 
  Eye, 
  Trash2, 
  Copy,
  Calendar,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

export const APIKeyManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  
  const { data: apiKeys, isLoading } = useAPIKeys();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Clé API copiée dans le presse-papiers');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des clés API</h2>
          <p className="text-gray-600">Créez et gérez les clés API pour l'accès aux services</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-afroGreen hover:bg-afroGreen/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle clé API
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Total clés</span>
            </div>
            <p className="text-2xl font-bold">{apiKeys?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Actives</span>
            </div>
            <p className="text-2xl font-bold">
              {apiKeys?.filter(key => key.is_active).length || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-600">Ce mois</span>
            </div>
            <p className="text-2xl font-bold">
              {apiKeys?.reduce((sum, key) => sum + (key.usage_count || 0), 0) || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-600">Dernière utilisation</span>
            </div>
            <p className="text-sm font-medium">
              {apiKeys?.find(key => key.last_used) 
                ? formatDate(apiKeys.find(key => key.last_used)!.last_used!)
                : 'Aucune'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys?.map((apiKey) => (
          <Card key={apiKey.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{apiKey.name}</h3>
                    <Badge 
                      variant={apiKey.is_active ? 'default' : 'secondary'}
                      className={apiKey.is_active ? 'bg-green-100 text-green-800' : ''}
                    >
                      {apiKey.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Clé:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {apiKey.key.substring(0, 20)}...
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-1 h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Limite:</span>
                      <p>{apiKey.rate_limit}/min</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Utilisation:</span>
                      <p>{apiKey.usage_count || 0} requêtes</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Dernière utilisation:</span>
                      <p>{apiKey.last_used ? formatDate(apiKey.last_used) : 'Jamais'}</p>
                    </div>
                  </div>
                  
                  {apiKey.permissions && apiKey.permissions.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-600">Permissions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {apiKey.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedKey(apiKey.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(!apiKeys || apiKeys.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune clé API
              </h3>
              <p className="text-gray-600 mb-4">
                Créez votre première clé API pour permettre l'accès aux services.
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-afroGreen hover:bg-afroGreen/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer une clé API
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create API Key Form Modal */}
      {showCreateForm && (
        <APIKeyForm onClose={() => setShowCreateForm(false)} />
      )}

      {/* API Key Details Modal */}
      {selectedKey && (
        <APIKeyDetails 
          keyId={selectedKey} 
          onClose={() => setSelectedKey(null)} 
        />
      )}
    </div>
  );
};

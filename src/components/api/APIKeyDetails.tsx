
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAPIUsage } from '@/hooks/useAPIManagement';
import { X, Activity, Clock, TrendingUp } from 'lucide-react';

interface APIKeyDetailsProps {
  keyId: string;
  onClose: () => void;
}

export const APIKeyDetails: React.FC<APIKeyDetailsProps> = ({ keyId, onClose }) => {
  const { data: usageData, isLoading } = useAPIUsage(keyId);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR');
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-100 text-green-800';
    if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-100 text-yellow-800';
    if (statusCode >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Détails d'utilisation de la clé API
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afroGreen mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement des données d'utilisation...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Statistiques rapides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Total requêtes</span>
                    </div>
                    <p className="text-2xl font-bold">{usageData?.length || 0}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">Temps moyen</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {usageData?.length ? 
                        Math.round(usageData.reduce((acc, usage) => acc + usage.response_time, 0) / usageData.length) 
                        : 0}ms
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Taux de succès</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {usageData?.length ? 
                        Math.round((usageData.filter(usage => usage.status_code < 400).length / usageData.length) * 100) 
                        : 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Historique des requêtes */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Historique des requêtes récentes</h3>
                
                {usageData && usageData.length > 0 ? (
                  <div className="space-y-2">
                    {usageData.slice(0, 50).map((usage) => (
                      <div key={usage.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(usage.status_code)}>
                            {usage.status_code}
                          </Badge>
                          <span className="font-mono text-sm">{usage.method}</span>
                          <span className="text-sm text-gray-600">{usage.endpoint}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{usage.response_time}ms</span>
                          <span>{formatDate(usage.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune utilisation enregistrée pour cette clé API</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

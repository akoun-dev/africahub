
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Webhook, 
  Plus, 
  Play, 
  Pause,
  Trash2,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export const APIWebhooks: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const mockWebhooks = [
    {
      id: '1',
      name: 'Nouvelles demandes de devis',
      url: 'https://partner-api.example.com/webhooks/quotes',
      events: ['quote.created', 'quote.updated'],
      status: 'active',
      lastTriggered: '2024-01-15T10:30:00Z',
      successRate: 98.5
    },
    {
      id: '2', 
      name: 'Comparaisons de produits',
      url: 'https://analytics.partner.com/api/comparisons',
      events: ['comparison.created'],
      status: 'active',
      lastTriggered: '2024-01-15T09:15:00Z',
      successRate: 100
    },
    {
      id: '3',
      name: 'Alertes d\'erreur',
      url: 'https://monitoring.example.com/alerts',
      events: ['error.critical'],
      status: 'paused',
      lastTriggered: '2024-01-10T14:22:00Z',
      successRate: 89.2
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles] || styles.error}>
        {status === 'active' ? 'Actif' : status === 'paused' ? 'Pausé' : 'Erreur'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Webhooks</h2>
          <p className="text-gray-600">Configurez les notifications temps réel pour vos intégrations</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-afroGreen hover:bg-afroGreen/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau webhook
        </Button>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {mockWebhooks.map((webhook) => (
          <Card key={webhook.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{webhook.name}</h3>
                    {getStatusBadge(webhook.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">URL:</span>
                      <p className="font-mono text-xs mt-1 truncate">{webhook.url}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Événements:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {webhook.events.map((event, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Dernière utilisation:</span>
                      <p>{new Date(webhook.lastTriggered).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      {webhook.successRate >= 95 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="text-sm">Taux de succès: {webhook.successRate}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className={webhook.status === 'active' ? 'text-yellow-600' : 'text-green-600'}
                  >
                    {webhook.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
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
        
        {mockWebhooks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun webhook configuré
              </h3>
              <p className="text-gray-600 mb-4">
                Créez votre premier webhook pour recevoir des notifications en temps réel.
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-afroGreen hover:bg-afroGreen/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un webhook
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Webhook Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouveau webhook</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="webhookName">Nom du webhook</Label>
                  <Input
                    id="webhookName"
                    placeholder="Ex: Notifications de devis"
                  />
                </div>
                
                <div>
                  <Label htmlFor="webhookUrl">URL de destination</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder="https://votre-api.com/webhook"
                  />
                </div>
              </div>
              
              <div>
                <Label>Événements à surveiller</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {[
                    'quote.created', 'quote.updated', 'quote.completed',
                    'comparison.created', 'user.registered', 'error.critical'
                  ].map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  className="bg-afroGreen hover:bg-afroGreen/90"
                >
                  Créer le webhook
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

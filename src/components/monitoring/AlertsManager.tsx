
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Bell, 
  Check, 
  Filter, 
  Search, 
  Settings,
  X,
  Clock,
  Zap,
  Database,
  Globe,
  Users
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'performance' | 'security' | 'availability' | 'cost';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  autoResolution?: string;
  affectedServices: string[];
  region?: string;
}

export const AlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'performance',
      severity: 'high',
      title: 'Latence élevée détectée',
      description: 'Le service AI Recommendations affiche une latence moyenne de 1.2s (seuil: 800ms)',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      resolved: false,
      affectedServices: ['AI Recommendations'],
      region: 'Afrique de l\'Ouest'
    },
    {
      id: '2',
      type: 'availability',
      severity: 'critical',
      title: 'Service temporairement indisponible',
      description: 'Le service de comparaison a été indisponible pendant 3 minutes',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      resolved: true,
      autoResolution: 'Redémarrage automatique du service effectué',
      affectedServices: ['Comparison Engine'],
      region: 'Afrique Centrale'
    },
    {
      id: '3',
      type: 'cost',
      severity: 'medium',
      title: 'Pic de coûts IA détecté',
      description: 'Les coûts d\'API IA ont augmenté de 150% par rapport à la moyenne',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      resolved: false,
      affectedServices: ['AI Recommendations', 'Virtual Assistant'],
      region: 'Global'
    },
    {
      id: '4',
      type: 'security',
      severity: 'high',
      title: 'Tentatives de connexion suspectes',
      description: 'Plus de 100 tentatives de connexion échouées depuis la même IP',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      resolved: false,
      autoResolution: 'IP bloquée automatiquement pour 24h',
      affectedServices: ['User Management'],
      region: 'Afrique du Nord'
    }
  ]);

  const [filter, setFilter] = useState<{
    severity: string;
    type: string;
    status: string;
    search: string;
  }>({
    severity: 'all',
    type: 'all',
    status: 'all',
    search: ''
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'availability': return <Database className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      case 'cost': return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'availability': return 'bg-red-100 text-red-800';
      case 'security': return 'bg-orange-100 text-orange-800';
      case 'cost': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filter.severity === 'all' || alert.severity === filter.severity;
    const matchesType = filter.type === 'all' || alert.type === filter.type;
    const matchesStatus = filter.status === 'all' || 
      (filter.status === 'active' && !alert.resolved) ||
      (filter.status === 'resolved' && alert.resolved);
    const matchesSearch = filter.search === '' || 
      alert.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      alert.description.toLowerCase().includes(filter.search.toLowerCase());

    return matchesSeverity && matchesType && matchesStatus && matchesSearch;
  });

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    return timestamp.toLocaleDateString();
  };

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  const criticalAlertsCount = alerts.filter(a => !a.resolved && a.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestionnaire d'Alertes</h2>
          <p className="text-gray-600">
            {activeAlertsCount} alertes actives • {criticalAlertsCount} critiques
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={criticalAlertsCount > 0 ? 'destructive' : 'secondary'}>
            {criticalAlertsCount} Critiques
          </Badge>
          <Badge variant="outline">
            {activeAlertsCount} Actives
          </Badge>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sévérité</label>
              <Select value={filter.severity} onValueChange={(value) => setFilter(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={filter.type} onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="availability">Disponibilité</SelectItem>
                  <SelectItem value="security">Sécurité</SelectItem>
                  <SelectItem value="cost">Coût</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={filter.status} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="resolved">Résolues</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune alerte trouvée</h3>
              <p className="text-gray-600">Aucune alerte ne correspond aux filtres sélectionnés.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.severity === 'critical' ? 'border-l-red-500' :
              alert.severity === 'high' ? 'border-l-orange-500' :
              alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
            } ${alert.resolved ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeColor(alert.type)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        {alert.resolved && (
                          <Badge variant="secondary">
                            <Check className="h-3 w-3 mr-1" />
                            Résolu
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{alert.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(alert.timestamp)}</span>
                        </div>
                        {alert.region && (
                          <div className="flex items-center space-x-1">
                            <Globe className="h-4 w-4" />
                            <span>{alert.region}</span>
                          </div>
                        )}
                      </div>
                      
                      {alert.affectedServices.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-1">Services affectés:</p>
                          <div className="flex flex-wrap gap-1">
                            {alert.affectedServices.map((service) => (
                              <Badge key={service} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {alert.autoResolution && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Résolution automatique:</strong> {alert.autoResolution}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.resolved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Résoudre
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

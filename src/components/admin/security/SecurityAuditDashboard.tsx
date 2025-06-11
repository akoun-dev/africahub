
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Database,
  Key,
  Activity
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: any;
  created_at: string;
  resolved: boolean;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  failedLogins: number;
  suspiciousActivity: number;
  lastScan: Date;
  vulnerabilities: number;
}

export const SecurityAuditDashboard: React.FC = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    failedLogins: 0,
    suspiciousActivity: 0,
    lastScan: new Date(),
    vulnerabilities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
    
    // Actualiser toutes les 30 secondes
    const interval = setInterval(loadSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      // Simuler des données de sécurité (en production, connecter aux vrais logs)
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          event_type: 'failed_login',
          user_id: null,
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0...',
          severity: 'medium',
          description: 'Tentative de connexion échouée - mot de passe incorrect',
          metadata: { attempts: 3 },
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          resolved: false
        },
        {
          id: '2',
          event_type: 'suspicious_activity',
          user_id: 'user-123',
          ip_address: '10.0.0.50',
          user_agent: 'Bot/1.0',
          severity: 'high',
          description: 'Activité suspecte détectée - trop de requêtes par minute',
          metadata: { requests_per_minute: 150 },
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          resolved: false
        },
        {
          id: '3',
          event_type: 'data_access',
          user_id: 'admin-456',
          ip_address: '172.16.0.10',
          user_agent: 'Chrome/91.0',
          severity: 'low',
          description: 'Accès aux données utilisateur par un administrateur',
          metadata: { table: 'user_preferences', action: 'SELECT' },
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          resolved: true
        }
      ];

      setSecurityEvents(mockEvents);
      
      setMetrics({
        totalEvents: mockEvents.length,
        criticalEvents: mockEvents.filter(e => e.severity === 'critical').length,
        failedLogins: mockEvents.filter(e => e.event_type === 'failed_login').length,
        suspiciousActivity: mockEvents.filter(e => e.event_type === 'suspicious_activity').length,
        lastScan: new Date(),
        vulnerabilities: 2
      });
      
    } catch (error) {
      console.error('Erreur lors du chargement des données de sécurité:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveEvent = async (eventId: string) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, resolved: true } : event
      )
    );
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Eye className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit de Sécurité</h1>
          <p className="text-gray-600">Surveillance temps réel des événements de sécurité</p>
        </div>
        <Button onClick={loadSecurityData}>
          <Activity className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Métriques de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Événements Total</p>
                <p className="text-2xl font-bold">{metrics.totalEvents}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{metrics.criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connexions Échouées</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.failedLogins}</p>
              </div>
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vulnérabilités</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.vulnerabilities}</p>
              </div>
              <Key className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes critiques */}
      {metrics.criticalEvents > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Attention:</strong> {metrics.criticalEvents} événement(s) critique(s) détecté(s). 
            Intervention immédiate recommandée.
          </AlertDescription>
        </Alert>
      )}

      {/* Journal des événements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Journal des Événements de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div 
                key={event.id} 
                className={`p-4 rounded-lg border ${event.resolved ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Badge className={getSeverityColor(event.severity)}>
                      {getSeverityIcon(event.severity)}
                      <span className="ml-1 capitalize">{event.severity}</span>
                    </Badge>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {event.event_type.replace('_', ' ').toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                        {event.ip_address && (
                          <span>IP: {event.ip_address}</span>
                        )}
                        {event.user_id && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.user_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {event.resolved ? (
                      <Badge variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Résolu
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveEvent(event.id)}
                      >
                        Résoudre
                      </Button>
                    )}
                  </div>
                </div>
                
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <strong>Métadonnées:</strong> {JSON.stringify(event.metadata)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations de Sécurité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Chiffrement SSL/TLS</h4>
                <p className="text-sm text-gray-600">Toutes les communications sont chiffrées</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Authentification 2FA</h4>
                <p className="text-sm text-gray-600">Recommandé pour tous les administrateurs</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Rate Limiting</h4>
                <p className="text-sm text-gray-600">Protection active contre les attaques DDoS</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

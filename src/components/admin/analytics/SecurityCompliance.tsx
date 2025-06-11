
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Key, 
  FileText, 
  Eye, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Users,
  Clock,
  Database
} from 'lucide-react';

export const SecurityCompliance: React.FC = () => {
  const [securitySettings, setSecuritySettings] = React.useState({
    encryptPrompts: true,
    auditTrail: true,
    dataRetention: true,
    rateLimit: true,
    geoBlocking: false,
    anonymization: true
  });

  const [complianceStatus, setComplianceStatus] = React.useState({
    gdpr: 95,
    dataProtection: 90,
    auditCompliance: 98,
    encryptionCompliance: 100
  });

  const [auditLogs] = React.useState([
    {
      id: '1',
      timestamp: new Date(),
      action: 'LLM_REQUEST',
      user: 'user@example.com',
      provider: 'deepseek',
      encrypted: true,
      country: 'CI'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000),
      action: 'DATA_EXPORT',
      user: 'admin@company.com',
      provider: 'system',
      encrypted: true,
      country: 'SN'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000),
      action: 'RATE_LIMIT_TRIGGERED',
      user: 'suspicious@domain.com',
      provider: 'blocked',
      encrypted: false,
      country: 'UNKNOWN'
    }
  ]);

  const toggleSetting = (key: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sécurité Globale</p>
                <p className="text-lg font-bold text-green-600">Élevée</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chiffrement</p>
                <p className="text-lg font-bold text-green-600">AES-256</p>
              </div>
              <Lock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Audit Trail</p>
                <p className="text-lg font-bold text-blue-600">Actif</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-lg font-bold text-green-600">GDPR Ready</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configuration Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chiffrement des Prompts</p>
                  <p className="text-sm text-gray-600">Chiffrer tous les prompts utilisateur</p>
                </div>
                <Switch 
                  checked={securitySettings.encryptPrompts}
                  onCheckedChange={() => toggleSetting('encryptPrompts')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Audit Trail Complet</p>
                  <p className="text-sm text-gray-600">Enregistrer toutes les interactions</p>
                </div>
                <Switch 
                  checked={securitySettings.auditTrail}
                  onCheckedChange={() => toggleSetting('auditTrail')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rétention des Données</p>
                  <p className="text-sm text-gray-600">Politique de rétention GDPR</p>
                </div>
                <Switch 
                  checked={securitySettings.dataRetention}
                  onCheckedChange={() => toggleSetting('dataRetention')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rate Limiting</p>
                  <p className="text-sm text-gray-600">Protection anti-abus</p>
                </div>
                <Switch 
                  checked={securitySettings.rateLimit}
                  onCheckedChange={() => toggleSetting('rateLimit')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Géo-blocage</p>
                  <p className="text-sm text-gray-600">Bloquer les pays à risque</p>
                </div>
                <Switch 
                  checked={securitySettings.geoBlocking}
                  onCheckedChange={() => toggleSetting('geoBlocking')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Anonymisation</p>
                  <p className="text-sm text-gray-600">Anonymiser les données sensibles</p>
                </div>
                <Switch 
                  checked={securitySettings.anonymization}
                  onCheckedChange={() => toggleSetting('anonymization')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Statut Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>GDPR Compliance</span>
                  <span className={getComplianceColor(complianceStatus.gdpr)}>
                    {complianceStatus.gdpr}%
                  </span>
                </div>
                <Progress value={complianceStatus.gdpr} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protection des Données</span>
                  <span className={getComplianceColor(complianceStatus.dataProtection)}>
                    {complianceStatus.dataProtection}%
                  </span>
                </div>
                <Progress value={complianceStatus.dataProtection} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Audit Compliance</span>
                  <span className={getComplianceColor(complianceStatus.auditCompliance)}>
                    {complianceStatus.auditCompliance}%
                  </span>
                </div>
                <Progress value={complianceStatus.auditCompliance} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Chiffrement</span>
                  <span className={getComplianceColor(complianceStatus.encryptionCompliance)}>
                    {complianceStatus.encryptionCompliance}%
                  </span>
                </div>
                <Progress value={complianceStatus.encryptionCompliance} className="h-2" />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Système conforme aux réglementations africaines</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Toutes les exigences GDPR et de protection des données locales sont respectées
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Journal d'Audit (Dernières Actions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${log.encrypted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Utilisateur: {log.user}</span>
                      <span>Provider: {log.provider}</span>
                      <span>Pays: {log.country}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={log.encrypted ? "default" : "destructive"}>
                    {log.encrypted ? 'Chiffré' : 'Non chiffré'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {log.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Exporter Audit
            </Button>
            <Button variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Gérer Clés
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Politiques de Rétention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Données Utilisateur</h4>
              <p className="text-2xl font-bold text-blue-600">24 mois</p>
              <p className="text-sm text-gray-600">Conformité GDPR</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Logs LLM</h4>
              <p className="text-2xl font-bold text-green-600">12 mois</p>
              <p className="text-sm text-gray-600">Optimisation & debug</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Audit Trail</h4>
              <p className="text-2xl font-bold text-purple-600">7 ans</p>
              <p className="text-sm text-gray-600">Exigences légales</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

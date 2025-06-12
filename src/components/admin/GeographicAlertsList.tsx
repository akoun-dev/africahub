
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useGeographicAlerts, useResolveAlert } from '@/hooks/useGeographicManagement';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SEVERITY_ICONS = {
  low: <AlertTriangle className="h-4 w-4 text-blue-500" />,
  medium: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  high: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  critical: <AlertTriangle className="h-4 w-4 text-red-500" />
};

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const ALERT_TYPE_LABELS = {
  performance_drop: 'Chute de performance',
  volume_spike: 'Pic de volume',
  conversion_low: 'Faible conversion',
  error_rate_high: 'Taux d\'erreur élevé'
};

export const GeographicAlertsList: React.FC = () => {
  const { data: alerts, isLoading } = useGeographicAlerts();
  const resolveAlert = useResolveAlert();

  if (isLoading) {
    return <div className="p-6">Chargement des alertes...</div>;
  }

  const criticalAlerts = alerts?.filter(a => a.severity === 'critical') || [];
  const highAlerts = alerts?.filter(a => a.severity === 'high') || [];
  const mediumAlerts = alerts?.filter(a => a.severity === 'medium') || [];
  const lowAlerts = alerts?.filter(a => a.severity === 'low') || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Élevées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highAlerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Moyennes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mediumAlerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Faibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{lowAlerts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertes actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!alerts || alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Aucune alerte active</h3>
              <p className="text-gray-500">Toutes les régions fonctionnent normalement</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pays</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sévérité</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Valeurs</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map(alert => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <Badge variant="outline">{alert.country_code}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {SEVERITY_ICONS[alert.severity as keyof typeof SEVERITY_ICONS]}
                        <span className="text-sm">
                          {ALERT_TYPE_LABELS[alert.alert_type as keyof typeof ALERT_TYPE_LABELS] || alert.alert_type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={SEVERITY_COLORS[alert.severity as keyof typeof SEVERITY_COLORS]}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-gray-500">{alert.message}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {alert.threshold_value && alert.current_value && (
                        <div className="text-sm">
                          <div>Seuil: {alert.threshold_value}</div>
                          <div>Actuel: {alert.current_value}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert.mutate(alert.id)}
                      >
                        Résoudre
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

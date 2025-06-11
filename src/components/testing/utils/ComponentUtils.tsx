
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Activity, Database, Zap, Shield, Clock } from 'lucide-react';
import { SystemComponent, SystemMetric } from '../types/SystemValidationTypes';

export const getStatusIcon = (status: SystemComponent['status']) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'degraded':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'down':
      return <XCircle className="h-5 w-5 text-red-500" />;
  }
};

export const getMetricStatusColor = (status: SystemMetric['status']) => {
  switch (status) {
    case 'excellent':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'good':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
  }
};

export const getComponentIcon = (name: string) => {
  switch (name) {
    case 'Cache Multi-Niveaux':
      return <Database className="h-5 w-5" />;
    case 'Système de Résilience':
      return <Shield className="h-5 w-5" />;
    case 'Gestion des Timeouts':
      return <Clock className="h-5 w-5" />;
    case 'Base de Données':
      return <Activity className="h-5 w-5" />;
    default:
      return <Zap className="h-5 w-5" />;
  }
};


import { useState, useEffect } from 'react';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  latency: number;
  lastCheck: Date;
}

interface SystemHealthData {
  overallStatus: 'healthy' | 'warning' | 'critical';
  uptime: number;
  services: ServiceHealth[];
  alerts: any[];
  lastUpdated: Date;
}

export const useSystemHealth = () => {
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSystemHealth = async () => {
    try {
      // Simulation d'appels aux health checks des microservices
      const services: ServiceHealth[] = [
        {
          name: 'Product Catalog',
          status: 'healthy',
          uptime: 99.98,
          latency: 120,
          lastCheck: new Date()
        },
        {
          name: 'Comparison Engine',
          status: 'healthy',
          uptime: 99.95,
          latency: 340,
          lastCheck: new Date()
        },
        {
          name: 'AI Recommendations',
          status: Math.random() > 0.7 ? 'warning' : 'healthy',
          uptime: 99.2,
          latency: Math.floor(Math.random() * 1000) + 500,
          lastCheck: new Date()
        },
        {
          name: 'User Management',
          status: 'healthy',
          uptime: 99.99,
          latency: 80,
          lastCheck: new Date()
        },
        {
          name: 'Analytics Service',
          status: 'healthy',
          uptime: 99.8,
          latency: 200,
          lastCheck: new Date()
        },
        {
          name: 'Notification Service',
          status: 'healthy',
          uptime: 99.95,
          latency: 150,
          lastCheck: new Date()
        }
      ];

      // Calculer le statut global
      const hasWarning = services.some(s => s.status === 'warning');
      const hasCritical = services.some(s => s.status === 'critical');
      
      let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (hasCritical) overallStatus = 'critical';
      else if (hasWarning) overallStatus = 'warning';

      // Calculer l'uptime global
      const averageUptime = services.reduce((sum, service) => sum + service.uptime, 0) / services.length;

      setHealthData({
        overallStatus,
        uptime: averageUptime,
        services,
        alerts: [],
        lastUpdated: new Date()
      });

      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error checking system health:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
    
    // Vérifier la santé toutes les 30 secondes
    const interval = setInterval(checkSystemHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshHealth = () => {
    setIsLoading(true);
    checkSystemHealth();
  };

  return {
    healthData,
    isLoading,
    error,
    refreshHealth
  };
};

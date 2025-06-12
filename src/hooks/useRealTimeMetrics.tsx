
import { useState, useEffect, useRef } from 'react';

interface RealTimeMetrics {
  activeUsers: number;
  comparisonsPerMinute: number;
  quoteRequests: number;
  conversionRate: number;
  averageLatency: number;
  errorRate: number;
  revenue: number;
  topCountries: Array<{ country: string; users: number }>;
  topSectors: Array<{ sector: string; requests: number }>;
}

export const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 1247,
    comparisonsPerMinute: 23,
    quoteRequests: 156,
    conversionRate: 8.4,
    averageLatency: 245,
    errorRate: 0.2,
    revenue: 0,
    topCountries: [
      { country: 'Sénégal', users: 423 },
      { country: 'Cameroun', users: 312 },
      { country: 'Nigeria', users: 298 },
      { country: 'Kenya', users: 267 },
      { country: 'Ghana', users: 189 }
    ],
    topSectors: [
      { sector: 'Assurance Auto', requests: 45 },
      { sector: 'Assurance Santé', requests: 32 },
      { sector: 'Assurance Habitation', requests: 28 },
      { sector: 'Micro-assurance', requests: 19 }
    ]
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    try {
      // En développement, on simule une connexion WebSocket
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://api.votre-domaine.com/metrics-ws'
        : 'ws://localhost:3001/metrics';

      console.log('Tentative de connexion WebSocket au monitoring...');
      
      // Simulation d'une connexion réussie après 2 secondes
      setTimeout(() => {
        setIsConnected(true);
        console.log('WebSocket de monitoring connecté (simulation)');
      }, 2000);

      // Simuler des données en temps réel
      const interval = setInterval(() => {
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          activeUsers: prevMetrics.activeUsers + Math.floor(Math.random() * 21) - 10,
          comparisonsPerMinute: Math.floor(Math.random() * 50) + 10,
          quoteRequests: prevMetrics.quoteRequests + Math.floor(Math.random() * 5),
          conversionRate: Math.max(0, Math.min(15, prevMetrics.conversionRate + (Math.random() - 0.5) * 2)),
          averageLatency: Math.floor(Math.random() * 300) + 150,
          errorRate: Math.max(0, Math.min(5, prevMetrics.errorRate + (Math.random() - 0.5) * 0.5))
        }));
      }, 5000);

      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Erreur de connexion WebSocket:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    const cleanup = connectWebSocket();
    
    return cleanup;
  }, []);

  const sendMetricEvent = (event: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
    }
  };

  return {
    metrics,
    isConnected,
    sendMetricEvent
  };
};

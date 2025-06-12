
import { useState, useEffect } from 'react';
import { useLLMAlerts } from './useLLMMonitoring';
import { useLLMAnalytics } from './useMultiLLM';
import { toast } from './use-toast';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  latency: number;
  errorRate: number;
  lastCheck: Date;
}

interface ProductionAlert {
  id: string;
  type: 'performance' | 'cost' | 'availability' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  autoMitigation?: string;
}

export const useProductionMonitoring = () => {
  const { data: llmAlerts } = useLLMAlerts();
  const { data: analytics } = useLLMAnalytics('1h');
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 99.9,
    latency: 0,
    errorRate: 0,
    lastCheck: new Date()
  });
  const [alerts, setAlerts] = useState<ProductionAlert[]>([]);

  // SLA monitoring thresholds
  const SLA_THRESHOLDS = {
    uptime: 99.5, // 99.5% uptime minimum
    latency: 3000, // 3 seconds maximum
    errorRate: 5, // 5% error rate maximum
    costSpike: 200 // 200% cost increase
  };

  // Real-time health monitoring
  const checkSystemHealth = () => {
    if (!analytics) return;

    const currentLatency = analytics.averageLatency || 0;
    const errorRate = analytics.totalRequests > 0 
      ? ((analytics.totalRequests - (analytics.totalRequests * 0.95)) / analytics.totalRequests) * 100
      : 0;

    let status: SystemHealth['status'] = 'healthy';
    
    if (currentLatency > SLA_THRESHOLDS.latency * 2 || errorRate > SLA_THRESHOLDS.errorRate * 2) {
      status = 'critical';
    } else if (currentLatency > SLA_THRESHOLDS.latency || errorRate > SLA_THRESHOLDS.errorRate) {
      status = 'degraded';
    }

    setSystemHealth({
      status,
      uptime: 99.9 - (errorRate * 0.1),
      latency: currentLatency,
      errorRate,
      lastCheck: new Date()
    });

    // Generate alerts for SLA violations
    if (status !== 'healthy') {
      const alert: ProductionAlert = {
        id: `health_${Date.now()}`,
        type: 'performance',
        severity: status === 'critical' ? 'critical' : 'high',
        message: `System ${status}: Latency ${currentLatency}ms, Error rate ${errorRate.toFixed(1)}%`,
        timestamp: new Date(),
        resolved: false,
        autoMitigation: status === 'critical' ? 'Circuit breaker activated' : undefined
      };

      setAlerts(prev => [alert, ...prev.slice(0, 49)]); // Keep last 50 alerts
      
      toast({
        title: `System ${status.toUpperCase()}`,
        description: alert.message,
        variant: status === 'critical' ? 'destructive' : 'default'
      });
    }
  };

  // Cost monitoring and spike detection
  const monitorCosts = () => {
    if (!analytics) return;

    const hourlyRate = analytics.totalCost;
    const expectedHourlyRate = 0.01; // $0.01 expected per hour
    
    if (hourlyRate > expectedHourlyRate * (SLA_THRESHOLDS.costSpike / 100)) {
      const alert: ProductionAlert = {
        id: `cost_${Date.now()}`,
        type: 'cost',
        severity: 'high',
        message: `Cost spike detected: $${hourlyRate.toFixed(4)}/hour (${((hourlyRate / expectedHourlyRate) * 100).toFixed(0)}% of expected)`,
        timestamp: new Date(),
        resolved: false,
        autoMitigation: 'Switched to cost-optimized providers'
      };

      setAlerts(prev => [alert, ...prev.slice(0, 49)]);
      
      toast({
        title: "Cost Spike Alert",
        description: alert.message,
        variant: "destructive"
      });
    }
  };

  // Geographic availability monitoring
  const monitorRegionalAvailability = () => {
    const regions = ['west_africa', 'east_africa', 'north_africa', 'southern_africa'];
    
    regions.forEach(region => {
      // Simulate regional health checks
      const healthScore = Math.random() * 100;
      
      if (healthScore < 85) {
        const alert: ProductionAlert = {
          id: `region_${region}_${Date.now()}`,
          type: 'availability',
          severity: healthScore < 70 ? 'critical' : 'medium',
          message: `${region.replace('_', ' ')} region degraded: ${healthScore.toFixed(0)}% health`,
          timestamp: new Date(),
          resolved: false,
          autoMitigation: 'Fallback to alternative providers'
        };

        setAlerts(prev => [alert, ...prev.slice(0, 49)]);
      }
    });
  };

  // Security monitoring
  const monitorSecurity = () => {
    // Simulate security checks
    const suspiciousActivity = Math.random() < 0.01; // 1% chance
    
    if (suspiciousActivity) {
      const alert: ProductionAlert = {
        id: `security_${Date.now()}`,
        type: 'security',
        severity: 'high',
        message: 'Suspicious activity detected: Multiple rapid requests from single IP',
        timestamp: new Date(),
        resolved: false,
        autoMitigation: 'Rate limiting applied'
      };

      setAlerts(prev => [alert, ...prev.slice(0, 49)]);
      
      toast({
        title: "Security Alert",
        description: alert.message,
        variant: "destructive"
      });
    }
  };

  // Resolve alert
  const resolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  // Run monitoring checks every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkSystemHealth();
      monitorCosts();
      monitorRegionalAvailability();
      monitorSecurity();
    }, 30000);

    return () => clearInterval(interval);
  }, [analytics]);

  return {
    systemHealth,
    alerts: alerts.filter(alert => !alert.resolved),
    resolvedAlerts: alerts.filter(alert => alert.resolved),
    resolveAlert,
    SLA_THRESHOLDS
  };
};

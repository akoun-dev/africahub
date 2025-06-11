
export interface SystemMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
}

export interface SystemComponent {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  metrics: SystemMetric[];
  lastCheck: Date;
}

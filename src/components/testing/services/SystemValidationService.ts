
import { SystemComponent, SystemMetric } from '../types/SystemValidationTypes';

export class SystemValidationService {
  static async validateComponent(component: SystemComponent, index: number): Promise<SystemComponent> {
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate realistic fluctuations
    const updatedMetrics: SystemMetric[] = component.metrics.map(metric => {
      const newValue = Math.max(0, metric.value + (Math.random() - 0.5) * 10);
      const newStatus: SystemMetric['status'] = 
        newValue >= metric.target ? 'excellent' : 
        newValue >= metric.target * 0.8 ? 'good' : 
        newValue >= metric.target * 0.6 ? 'warning' : 'critical';
      
      return {
        ...metric,
        value: newValue,
        status: newStatus
      };
    });
    
    return {
      ...component,
      metrics: updatedMetrics,
      lastCheck: new Date(),
      status: updatedMetrics.every(m => m.status !== 'critical') ? 'healthy' : 'degraded'
    };
  }
}

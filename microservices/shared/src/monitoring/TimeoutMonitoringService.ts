
import { EnhancedTimeoutManager } from '../resilience/TimeoutManager';
import { logger } from '../utils/logger';

export interface GlobalTimeoutMetrics {
  services: {
    aiRecommendations: any;
    cms: any;
    analytics: any;
  };
  global: {
    totalOperations: number;
    totalTimeouts: number;
    globalTimeoutRate: number;
    averageExecutionTime: number;
    adaptiveAdjustments: number;
  };
  alerts: string[];
  recommendations: string[];
}

export class TimeoutMonitoringService {
  private static instance: TimeoutMonitoringService;
  private serviceManagers: Map<string, EnhancedTimeoutManager> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alerts: string[] = [];

  private constructor() {
    // Monitoring toutes les 60 secondes pour les timeouts
    this.monitoringInterval = setInterval(() => this.collectMetrics(), 60000);
  }

  static getInstance(): TimeoutMonitoringService {
    if (!TimeoutMonitoringService.instance) {
      TimeoutMonitoringService.instance = new TimeoutMonitoringService();
    }
    return TimeoutMonitoringService.instance;
  }

  registerService(serviceName: string, timeoutManager: EnhancedTimeoutManager): void {
    this.serviceManagers.set(serviceName, timeoutManager);
    logger.info(`Timeout monitoring registered for service: ${serviceName}`);
  }

  async collectMetrics(): Promise<GlobalTimeoutMetrics> {
    this.alerts = [];
    const recommendations: string[] = [];

    try {
      const serviceMetrics: any = {};
      let totalOperations = 0;
      let totalTimeouts = 0;
      let totalExecutionTime = 0;
      let totalAdaptiveAdjustments = 0;

      // Collecter les métriques de chaque service
      for (const [serviceName, manager] of this.serviceManagers) {
        const metrics = manager.getMetrics();
        serviceMetrics[serviceName] = {
          ...metrics,
          health: manager.getHealthStatus(),
          adaptiveTimeouts: manager.getAdaptiveTimeouts()
        };

        totalOperations += metrics.totalOperations;
        totalTimeouts += metrics.timeoutOperations;
        totalExecutionTime += metrics.averageExecutionTime;
        totalAdaptiveAdjustments += metrics.adaptiveAdjustments;

        // Analyser la santé de chaque service
        this.analyzeServiceHealth(serviceName, metrics, manager, recommendations);
      }

      const globalMetrics: GlobalTimeoutMetrics = {
        services: serviceMetrics,
        global: {
          totalOperations,
          totalTimeouts,
          globalTimeoutRate: totalOperations > 0 ? totalTimeouts / totalOperations : 0,
          averageExecutionTime: this.serviceManagers.size > 0 ? totalExecutionTime / this.serviceManagers.size : 0,
          adaptiveAdjustments: totalAdaptiveAdjustments
        },
        alerts: this.alerts,
        recommendations
      };

      // Vérifications globales
      this.checkGlobalHealth(globalMetrics);

      // Log des métriques importantes
      if (globalMetrics.global.globalTimeoutRate > 0.05) {
        logger.warn(`Global timeout rate above threshold: ${(globalMetrics.global.globalTimeoutRate * 100).toFixed(1)}%`);
      }

      return globalMetrics;
    } catch (error) {
      logger.error('Error collecting timeout metrics:', error);
      throw error;
    }
  }

  private analyzeServiceHealth(
    serviceName: string, 
    metrics: any, 
    manager: EnhancedTimeoutManager,
    recommendations: string[]
  ): void {
    const health = manager.getHealthStatus();
    
    // Vérifier le taux de timeout
    const timeoutRate = metrics.totalOperations > 0 ? metrics.timeoutOperations / metrics.totalOperations : 0;
    
    if (timeoutRate > 0.1) { // 10% threshold
      this.alerts.push(`${serviceName}: High timeout rate (${(timeoutRate * 100).toFixed(1)}%)`);
      recommendations.push(`Consider increasing timeouts for ${serviceName} or optimizing operations`);
    }

    // Vérifier les ajustements adaptatifs
    if (metrics.adaptiveAdjustments > 5) {
      recommendations.push(`${serviceName}: Multiple adaptive adjustments detected - review operation performance`);
    }

    // Vérifier les timeouts gracieux
    if (metrics.gracefulTimeouts > 0) {
      logger.info(`${serviceName}: ${metrics.gracefulTimeouts} graceful timeouts handled successfully`);
    }

    // Analyser les opérations les plus problématiques
    const problematicOps = Object.entries(metrics.timeoutsByOperation)
      .filter(([_, count]: [string, any]) => count > 3)
      .sort((a, b) => (b[1] as number) - (a[1] as number));

    if (problematicOps.length > 0) {
      this.alerts.push(`${serviceName}: Operations with frequent timeouts: ${problematicOps.map(([op]) => op).join(', ')}`);
    }
  }

  private checkGlobalHealth(metrics: GlobalTimeoutMetrics): void {
    // Vérifier le taux de timeout global
    if (metrics.global.globalTimeoutRate > 0.05) { // 5% global threshold
      this.alerts.push(`Global timeout rate critical: ${(metrics.global.globalTimeoutRate * 100).toFixed(1)}%`);
    }

    // Vérifier le temps d'exécution moyen
    if (metrics.global.averageExecutionTime > 10000) { // 10s threshold
      this.alerts.push(`Global average execution time high: ${(metrics.global.averageExecutionTime / 1000).toFixed(1)}s`);
    }

    // Recommandations basées sur les ajustements adaptatifs
    if (metrics.global.adaptiveAdjustments > 20) {
      metrics.recommendations.push('Consider reviewing global timeout configuration - many adaptive adjustments detected');
    }
  }

  getRealtimeStatus(): { healthy: boolean; issues: string[]; adaptiveStatus: string } {
    const issues: string[] = [];

    if (this.alerts.length > 0) {
      issues.push(...this.alerts);
    }

    // Calculer le statut adaptatif
    let totalAdaptive = 0;
    for (const manager of this.serviceManagers.values()) {
      totalAdaptive += manager.getMetrics().adaptiveAdjustments;
    }

    return {
      healthy: issues.length === 0,
      issues,
      adaptiveStatus: `${totalAdaptive} adaptive adjustments across all services`
    };
  }

  async optimizeTimeouts(): Promise<void> {
    try {
      for (const [serviceName, manager] of this.serviceManagers) {
        const metrics = manager.getMetrics();
        const adaptiveTimeouts = manager.getAdaptiveTimeouts();
        
        // Log des optimisations possibles
        if (Object.keys(adaptiveTimeouts).length > 0) {
          logger.info(`Timeout optimizations for ${serviceName}:`, adaptiveTimeouts);
        }
      }
    } catch (error) {
      logger.error('Error optimizing timeouts:', error);
    }
  }

  destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.serviceManagers.clear();
  }
}

export const timeoutMonitoringService = TimeoutMonitoringService.getInstance();

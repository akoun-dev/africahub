
import { SystemComponent } from '../types/SystemValidationTypes';

export const initializeSystemComponents = (): SystemComponent[] => {
  return [
    {
      name: 'Cache Multi-Niveaux',
      status: 'healthy',
      lastCheck: new Date(),
      metrics: [
        {
          name: 'Taux de Hit Global',
          value: 87,
          target: 80,
          unit: '%',
          status: 'excellent',
          description: 'Performance globale du cache'
        },
        {
          name: 'Latence Moyenne',
          value: 15,
          target: 50,
          unit: 'ms',
          status: 'excellent',
          description: 'Temps de réponse du cache'
        },
        {
          name: 'Utilisation Mémoire',
          value: 65,
          target: 80,
          unit: '%',
          status: 'good',
          description: 'Consommation mémoire'
        }
      ]
    },
    {
      name: 'Système de Résilience',
      status: 'healthy',
      lastCheck: new Date(),
      metrics: [
        {
          name: 'Taux de Succès',
          value: 99.2,
          target: 95,
          unit: '%',
          status: 'excellent',
          description: 'Requêtes réussies'
        },
        {
          name: 'Circuit Breakers',
          value: 3,
          target: 3,
          unit: 'actifs',
          status: 'excellent',
          description: 'Protections activées'
        },
        {
          name: 'Tentatives de Retry',
          value: 12,
          target: 50,
          unit: '/h',
          status: 'good',
          description: 'Tentatives automatiques'
        }
      ]
    },
    {
      name: 'Gestion des Timeouts',
      status: 'healthy',
      lastCheck: new Date(),
      metrics: [
        {
          name: 'Timeouts Adaptatifs',
          value: 8,
          target: 10,
          unit: 'ajustements',
          status: 'good',
          description: 'Optimisations automatiques'
        },
        {
          name: 'Timeouts Gracieux',
          value: 3,
          target: 5,
          unit: 'gérés',
          status: 'good',
          description: 'Arrêts en douceur'
        },
        {
          name: 'Temps Moyen Opération',
          value: 2.8,
          target: 5.0,
          unit: 's',
          status: 'excellent',
          description: 'Performance globale'
        }
      ]
    },
    {
      name: 'Base de Données',
      status: 'healthy',
      lastCheck: new Date(),
      metrics: [
        {
          name: 'Connexions Actives',
          value: 45,
          target: 100,
          unit: 'conn',
          status: 'good',
          description: 'Pool de connexions'
        },
        {
          name: 'Temps de Requête',
          value: 85,
          target: 200,
          unit: 'ms',
          status: 'good',
          description: 'Performance requêtes'
        },
        {
          name: 'Disponibilité',
          value: 100,
          target: 99,
          unit: '%',
          status: 'excellent',
          description: 'Uptime système'
        }
      ]
    }
  ];
};

export const calculateGlobalScore = (components: SystemComponent[]): number => {
  const allMetrics = components.flatMap(c => c.metrics);
  const scores = allMetrics.map(metric => {
    const achievement = Math.min(metric.value / metric.target, 1.5);
    return achievement * 100;
  });
  
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(avgScore);
};

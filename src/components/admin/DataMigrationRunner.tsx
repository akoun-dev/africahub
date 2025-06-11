
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Database, Play, CheckCircle, Clock } from 'lucide-react';

export const DataMigrationRunner: React.FC = () => {
  const [runningMigration, setRunningMigration] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const migrations = [
    {
      id: 'init-countries',
      name: 'Initialisation des pays africains',
      description: 'Création des configurations de base pour les pays supportés',
      status: 'completed',
      lastRun: '2024-01-15'
    },
    {
      id: 'init-sectors',
      name: 'Initialisation des secteurs',
      description: 'Création des secteurs par défaut (assurance, télécom, banque...)',
      status: 'completed',
      lastRun: '2024-01-15'
    },
    {
      id: 'sample-companies',
      name: 'Données d\'exemple des entreprises',
      description: 'Ajout d\'entreprises partenaires de démonstration',
      status: 'pending',
      lastRun: null
    },
    {
      id: 'sample-products',
      name: 'Produits de démonstration',
      description: 'Ajout de produits d\'assurance et services pour les tests',
      status: 'pending',
      lastRun: null
    },
    {
      id: 'update-pricing',
      name: 'Mise à jour des tarifs',
      description: 'Synchronisation des tarifs avec les partenaires',
      status: 'available',
      lastRun: '2024-01-10'
    }
  ];

  const runMigration = async (migrationId: string) => {
    setRunningMigration(migrationId);
    setProgress(0);

    // Simulation de progression
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunningMigration(null);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'available':
        return <Badge variant="secondary">Disponible</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'available':
        return <Play className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Migrations de données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {migrations.map((migration) => (
              <div key={migration.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(migration.status)}
                    <h3 className="font-medium">{migration.name}</h3>
                    {getStatusBadge(migration.status)}
                  </div>
                  
                  {migration.status === 'available' && (
                    <Button
                      onClick={() => runMigration(migration.id)}
                      disabled={runningMigration === migration.id}
                      size="sm"
                    >
                      {runningMigration === migration.id ? 'En cours...' : 'Exécuter'}
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{migration.description}</p>
                
                {migration.lastRun && (
                  <p className="text-xs text-gray-500">
                    Dernière exécution: {new Date(migration.lastRun).toLocaleDateString()}
                  </p>
                )}
                
                {runningMigration === migration.id && (
                  <div className="mt-3">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Progression: {progress}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900">Attention</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Les migrations modifient la base de données. Assurez-vous d'avoir une sauvegarde 
                  avant d'exécuter des migrations en production.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

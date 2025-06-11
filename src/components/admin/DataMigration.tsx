
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { populateCriteriaValues } from '@/scripts/populateCriteriaValues';

export const DataMigration = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRunMigration = async () => {
    setIsRunning(true);
    try {
      await populateCriteriaValues();
      setIsCompleted(true);
      toast.success('Migration des données terminée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
      toast.error('Erreur lors de la migration des données');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Migration des données - Phase 1A
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          Cette migration va peupler la base de données avec les valeurs de critères 
          pour tous les produits d'assurance migrés depuis les données mockées.
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 border rounded">
            <span>Types de produits créés</span>
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Terminé
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded">
            <span>Critères de comparaison créés</span>
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Terminé
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded">
            <span>Produits migrés (12 produits)</span>
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Terminé
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded">
            <span>Valeurs de critères</span>
            <Badge 
              variant={isCompleted ? "default" : "secondary"}
              className={isCompleted ? "bg-green-100 text-green-800" : ""}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Terminé
                </>
              ) : (
                "En attente"
              )}
            </Badge>
          </div>
        </div>
        
        <Button 
          onClick={handleRunMigration}
          disabled={isRunning || isCompleted}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Play className="h-4 w-4 mr-2 animate-spin" />
              Migration en cours...
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Migration terminée
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Exécuter la migration des valeurs
            </>
          )}
        </Button>
        
        {isCompleted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-800 font-medium">Migration réussie!</div>
            <div className="text-green-700 text-sm mt-1">
              Toutes les valeurs de critères ont été migrées. 
              Le système de comparaison dynamique est maintenant opérationnel 
              avec les données réelles depuis Supabase.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

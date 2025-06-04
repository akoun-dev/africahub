
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataMigrationRunner } from '@/components/admin/DataMigrationRunner';
import { ComparisonTester } from './ComparisonTester';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Phase1BTesting = () => {
  const navigate = useNavigate();

  const testSteps = [
    {
      title: "1. Migration des données",
      description: "Populer toutes les valeurs de critères",
      component: <DataMigrationRunner />
    },
    {
      title: "2. Tests automatisés",
      description: "Valider le chargement des données et critères",
      component: <ComparisonTester />
    },
    {
      title: "3. Tests manuels",
      description: "Tester l'interface utilisateur de comparaison",
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Tests manuels de l'interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Testez manuellement les fonctionnalités suivantes:
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 border rounded">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Page d'accueil - section comparaison</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Tester
                </Button>
              </div>
              
              <div className="flex items-center gap-2 p-2 border rounded">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Page de comparaison complète</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/compare')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Tester
                </Button>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="text-blue-800 font-medium text-sm mb-1">Points à vérifier:</div>
                <ul className="text-blue-700 text-xs space-y-1">
                  <li>• Affichage correct des 4 types d'assurance</li>
                  <li>• Fonctionnement des filtres par pays</li>
                  <li>• Affichage des critères (notes, franchises, etc.)</li>
                  <li>• Fonctionnement de la sélection/comparaison</li>
                  <li>• Navigation vers la page de comparaison détaillée</li>
                  <li>• Responsivité mobile</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Phase 1B - Tests et Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Cette phase valide le fonctionnement complet du système de comparaison 
            avec des données réelles. Suivez les étapes dans l'ordre.
          </div>
        </CardContent>
      </Card>

      {testSteps.map((step, index) => (
        <div key={index}>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {step.description}
          </p>
          {step.component}
        </div>
      ))}
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Play,
  Settings,
  BarChart3,
  Globe,
  Building,
  FileCheck,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ValidationStep {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'high' | 'medium' | 'low';
  url?: string;
  actions: Array<{
    label: string;
    url: string;
    external?: boolean;
  }>;
}

export const ValidationPlan: React.FC = () => {
  const navigate = useNavigate();
  const [validationSteps, setValidationSteps] = useState<ValidationStep[]>([
    // Phase 1: Tests d'Infrastructure
    {
      id: 'admin-access',
      title: 'Accès Interface Admin',
      description: 'Vérifier l\'accès au tableau de bord administrateur',
      category: 'Infrastructure',
      status: 'pending',
      priority: 'high',
      url: '/admin',
      actions: [
        { label: 'Ouvrir Admin', url: '/admin' }
      ]
    },
    {
      id: 'quick-tests',
      title: 'Tests Rapides',
      description: 'Exécuter les tests rapides depuis l\'interface admin',
      category: 'Infrastructure',
      status: 'pending',
      priority: 'high',
      url: '/admin#systematic-testing',
      actions: [
        { label: 'Lancer Tests Rapides', url: '/admin#systematic-testing' }
      ]
    },
    {
      id: 'systematic-tests',
      title: 'Tests Systématiques',
      description: 'Diagnostic complet de toutes les fonctionnalités',
      category: 'Infrastructure',
      status: 'pending',
      priority: 'high',
      url: '/admin#systematic-testing',
      actions: [
        { label: 'Tests Systématiques', url: '/admin#systematic-testing' }
      ]
    },
    
    // Phase 2: Fonctionnalités Principales
    {
      id: 'comparison-standard',
      title: 'Comparaison Standard',
      description: 'Tester la page de comparaison de base',
      category: 'Fonctionnalités',
      status: 'pending',
      priority: 'high',
      url: '/compare',
      actions: [
        { label: 'Tester Comparaison', url: '/compare' }
      ]
    },
    {
      id: 'comparison-advanced',
      title: 'Comparaison Avancée',
      description: 'Valider les fonctionnalités avancées avec IA',
      category: 'Fonctionnalités',
      status: 'pending',
      priority: 'medium',
      url: '/advanced-compare',
      actions: [
        { label: 'Comparaison Avancée', url: '/advanced-compare' }
      ]
    },
    {
      id: 'country-selection',
      title: 'Sélection de Pays',
      description: 'Vérifier le fonctionnement du sélecteur de pays',
      category: 'Fonctionnalités',
      status: 'pending',
      priority: 'medium',
      url: '/',
      actions: [
        { label: 'Tester Sélecteur', url: '/' }
      ]
    },
    
    // Phase 3: Navigation et Secteurs
    {
      id: 'sector-auto',
      title: 'Secteur Assurance Auto',
      description: 'Valider la page secteur assurance automobile',
      category: 'Secteurs',
      status: 'pending',
      priority: 'medium',
      url: '/secteur/assurance-auto',
      actions: [
        { label: 'Assurance Auto', url: '/secteur/assurance-auto' }
      ]
    },
    {
      id: 'sector-health',
      title: 'Secteur Assurance Santé',
      description: 'Tester les fonctionnalités santé',
      category: 'Secteurs',
      status: 'pending',
      priority: 'medium',
      url: '/secteur/assurance-sante',
      actions: [
        { label: 'Assurance Santé', url: '/secteur/assurance-sante' }
      ]
    },
    {
      id: 'sector-micro',
      title: 'Micro-assurance',
      description: 'Valider les micro-assurances',
      category: 'Secteurs',
      status: 'pending',
      priority: 'low',
      url: '/secteur/micro-assurance',
      actions: [
        { label: 'Micro-assurance', url: '/secteur/micro-assurance' }
      ]
    },
    
    // Phase 4: Intégration
    {
      id: 'auth-flow',
      title: 'Flux d\'Authentification',
      description: 'Tester connexion/déconnexion utilisateur',
      category: 'Intégration',
      status: 'pending',
      priority: 'medium',
      url: '/auth',
      actions: [
        { label: 'Page Auth', url: '/auth' }
      ]
    },
    {
      id: 'responsive-design',
      title: 'Design Responsive',
      description: 'Vérifier l\'affichage mobile et desktop',
      category: 'Intégration',
      status: 'pending',
      priority: 'medium',
      url: '/',
      actions: [
        { label: 'Tester Responsive', url: '/' }
      ]
    },
    {
      id: 'data-consistency',
      title: 'Cohérence des Données',
      description: 'Valider la cohérence entre les pages',
      category: 'Intégration',
      status: 'pending',
      priority: 'high',
      url: '/admin#data-migration',
      actions: [
        { label: 'Migration Données', url: '/admin#data-migration' }
      ]
    }
  ]);

  const updateStepStatus = (stepId: string, newStatus: ValidationStep['status']) => {
    setValidationSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status: newStatus } : step
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Infrastructure': return <Settings className="h-4 w-4" />;
      case 'Fonctionnalités': return <BarChart3 className="h-4 w-4" />;
      case 'Secteurs': return <Building className="h-4 w-4" />;
      case 'Intégration': return <Globe className="h-4 w-4" />;
      default: return <FileCheck className="h-4 w-4" />;
    }
  };

  const categories = ['Infrastructure', 'Fonctionnalités', 'Secteurs', 'Intégration'];
  
  const getProgressByCategory = (category: string) => {
    const categorySteps = validationSteps.filter(step => step.category === category);
    const completedSteps = categorySteps.filter(step => step.status === 'completed');
    return categorySteps.length > 0 ? (completedSteps.length / categorySteps.length) * 100 : 0;
  };

  const overallProgress = validationSteps.length > 0 
    ? (validationSteps.filter(step => step.status === 'completed').length / validationSteps.length) * 100 
    : 0;

  const handleStepAction = (step: ValidationStep) => {
    updateStepStatus(step.id, 'in-progress');
    if (step.url) {
      navigate(step.url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec progression globale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="h-6 w-6 text-afroGreen" />
            Plan de Validation Complète - Phase 1
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression globale</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Progression par catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const progress = getProgressByCategory(category);
          const categorySteps = validationSteps.filter(step => step.category === category);
          const completedCount = categorySteps.filter(step => step.status === 'completed').length;
          
          return (
            <Card key={category}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getCategoryIcon(category)}
                  <h3 className="font-medium text-sm">{category}</h3>
                </div>
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-gray-600">
                    {completedCount}/{categorySteps.length} terminés
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Liste des étapes par catégorie */}
      {categories.map((category) => {
        const categorySteps = validationSteps.filter(step => step.category === category);
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {getCategoryIcon(category)}
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categorySteps.map((step) => (
                  <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(step.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{step.title}</h4>
                          <Badge className={getPriorityColor(step.priority)}>
                            {step.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(step.status)}>
                        {step.status === 'pending' ? 'En attente' :
                         step.status === 'in-progress' ? 'En cours' :
                         step.status === 'completed' ? 'Terminé' : 'Échec'}
                      </Badge>
                      
                      <div className="flex gap-1">
                        {step.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            onClick={() => handleStepAction(step)}
                            className="text-xs"
                          >
                            {action.external ? (
                              <ExternalLink className="h-3 w-3 mr-1" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            {action.label}
                          </Button>
                        ))}
                        
                        {step.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStepStatus(step.id, 'completed')}
                            className="text-xs text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              onClick={() => navigate('/admin')}
              className="bg-afroGreen hover:bg-afroGreen/90"
            >
              <Settings className="h-4 w-4 mr-2" />
              Interface Admin
            </Button>
            
            <Button 
              onClick={() => navigate('/compare')}
              variant="outline"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparaison
            </Button>
            
            <Button 
              onClick={() => navigate('/advanced-compare')}
              variant="outline"
            >
              <Target className="h-4 w-4 mr-2" />
              Avancée
            </Button>
            
            <Button 
              onClick={() => {
                validationSteps.forEach(step => {
                  if (step.status === 'pending') {
                    updateStepStatus(step.id, 'in-progress');
                  }
                });
              }}
              variant="outline"
            >
              <Play className="h-4 w-4 mr-2" />
              Démarrer Tous
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

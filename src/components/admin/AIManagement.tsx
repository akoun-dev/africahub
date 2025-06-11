
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Users, BarChart3, Zap, Settings } from 'lucide-react';

export const AIManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Intelligence Artificielle</h2>
          <p className="text-muted-foreground">
            Gérez et surveillez les fonctionnalités IA de votre plateforme
          </p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          <Brain className="w-4 h-4 mr-1" />
          IA Active
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          <TabsTrigger value="assistant">Assistant Virtuel</TabsTrigger>
          <TabsTrigger value="analytics">Analytics IA</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recommandations générées</CardTitle>
                <Brain className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+12% cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de conversion IA</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5%</div>
                <p className="text-xs text-muted-foreground">+3.2% vs recommandations manuelles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs assistés</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">conversations actives</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Précision des prédictions</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground">sur les prédictions de prix</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance des recommandations IA</CardTitle>
                <CardDescription>Taux de clics et conversions par type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Recommandations comportementales</span>
                    <Badge variant="outline">23.4% CTR</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Recommandations collaboratives</span>
                    <Badge variant="outline">19.8% CTR</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Recommandations hybrides</span>
                    <Badge variant="outline">31.2% CTR</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assistant virtuel</CardTitle>
                <CardDescription>Statistiques des conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conversations résolues</span>
                    <Badge variant="outline">89.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Temps de réponse moyen</span>
                    <Badge variant="outline">0.8s</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Satisfaction utilisateur</span>
                    <Badge variant="outline">4.7/5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des recommandations IA</CardTitle>
              <CardDescription>
                Surveillez et optimisez les algorithmes de recommandation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col">
                  <Zap className="h-6 w-6 mb-2" />
                  Régénérer toutes les recommandations
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  Ajuster les paramètres
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Voir les métriques détaillées
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prédictions de prix</CardTitle>
              <CardDescription>
                Gérez les modèles de prédiction et leur précision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Fonctionnalité de gestion des prédictions en cours de développement...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'assistant virtuel</CardTitle>
              <CardDescription>
                Personnalisez le comportement et les réponses de l'assistant IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Interface de configuration de l'assistant en cours de développement...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics IA avancées</CardTitle>
              <CardDescription>
                Insights détaillés sur les performances des systèmes IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dashboard d'analytics IA en cours de développement...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres IA globaux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux des fonctionnalités IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Interface de paramètres globaux en cours de développement...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

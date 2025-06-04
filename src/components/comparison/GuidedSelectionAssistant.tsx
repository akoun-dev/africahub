
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, ChevronRight, ChevronLeft, Target, Lightbulb } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  criteria: Record<string, any>;
}

interface GuidedSelectionAssistantProps {
  products: Product[];
  onClose: () => void;
  onCriteriaWeightsChange: (weights: Record<string, number>) => void;
  onProductSelect?: (productId: string) => void;
}

const questions = [
  {
    id: 'budget',
    title: 'Quel est votre budget prioritaire?',
    description: 'Définissez l\'importance du prix dans votre décision',
    criteria: 'price_importance',
    options: [
      { label: 'Budget très serré', value: 90, description: 'Le prix est le facteur principal' },
      { label: 'Budget modéré', value: 60, description: 'Équilibre prix/qualité' },
      { label: 'Budget flexible', value: 30, description: 'La qualité prime sur le prix' },
      { label: 'Budget illimité', value: 10, description: 'Seule la qualité compte' }
    ]
  },
  {
    id: 'coverage',
    title: 'Quelle couverture recherchez-vous?',
    description: 'Niveau de protection souhaité',
    criteria: 'coverage_importance',
    options: [
      { label: 'Protection de base', value: 30, description: 'Couverture minimale requise' },
      { label: 'Protection standard', value: 60, description: 'Couverture équilibrée' },
      { label: 'Protection complète', value: 80, description: 'Couverture étendue' },
      { label: 'Protection maximale', value: 100, description: 'Toutes les garanties possibles' }
    ]
  },
  {
    id: 'service',
    title: 'Quelle qualité de service attendez-vous?',
    description: 'Support client et réactivité',
    criteria: 'service_importance',
    options: [
      { label: 'Service basique', value: 20, description: 'Contact minimal' },
      { label: 'Service standard', value: 50, description: 'Support disponible' },
      { label: 'Service premium', value: 80, description: 'Support prioritaire' },
      { label: 'Service VIP', value: 100, description: 'Conseiller dédié' }
    ]
  },
  {
    id: 'flexibility',
    title: 'Quelle flexibilité souhaitez-vous?',
    description: 'Possibilités de modification et d\'adaptation',
    criteria: 'flexibility_importance',
    options: [
      { label: 'Contrat fixe', value: 20, description: 'Pas de modifications' },
      { label: 'Flexibilité limitée', value: 40, description: 'Quelques ajustements' },
      { label: 'Bonne flexibilité', value: 70, description: 'Modifications faciles' },
      { label: 'Flexibilité maximale', value: 100, description: 'Adaptable à tout moment' }
    ]
  }
];

export const GuidedSelectionAssistant: React.FC<GuidedSelectionAssistantProps> = ({
  products,
  onClose,
  onCriteriaWeightsChange,
  onProductSelect
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.criteria]: value };
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière question - calculer les recommandations
      calculateRecommendations(newAnswers);
    }
  };

  const calculateRecommendations = (finalAnswers: Record<string, number>) => {
    // Convertir les réponses en poids de critères
    const criteriaWeights: Record<string, number> = {};
    
    // Mapper les réponses aux critères réels des produits
    Object.entries(finalAnswers).forEach(([key, value]) => {
      switch (key) {
        case 'price_importance':
          criteriaWeights['price'] = 100 - value; // Inverser car prix faible = bon
          break;
        case 'coverage_importance':
          criteriaWeights['coverage'] = value;
          criteriaWeights['guarantees'] = value;
          break;
        case 'service_importance':
          criteriaWeights['customer_service'] = value;
          criteriaWeights['support_24_7'] = value;
          break;
        case 'flexibility_importance':
          criteriaWeights['contract_flexibility'] = value;
          criteriaWeights['modification_allowed'] = value;
          break;
      }
    });

    onCriteriaWeightsChange(criteriaWeights);

    // Calculer le score pour chaque produit
    const scoredProducts = products.map(product => {
      let totalScore = 0;
      let totalWeight = 0;

      Object.entries(criteriaWeights).forEach(([criteria, weight]) => {
        const value = product.criteria[criteria];
        if (value !== undefined) {
          let normalizedValue = 0;
          if (typeof value === 'boolean') {
            normalizedValue = value ? 100 : 0;
          } else if (typeof value === 'number') {
            normalizedValue = Math.min(100, value);
          }
          
          totalScore += normalizedValue * weight;
          totalWeight += weight;
        }
      });

      return {
        ...product,
        recommendationScore: totalWeight > 0 ? totalScore / totalWeight : 0
      };
    }).sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0));

    setRecommendations(scoredProducts.slice(0, 3));
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations([]);
  };

  const finish = () => {
    if (recommendations.length > 0 && onProductSelect) {
      onProductSelect(recommendations[0].id);
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-afroGreen" />
            Assistant de sélection guidée
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Étape {currentStep + 1} sur {questions.length}</span>
              <span>{Math.round(progress)}% terminé</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {recommendations.length === 0 ? (
            /* Questions */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-afroGold" />
                  {currentQuestion.title}
                </CardTitle>
                <p className="text-gray-600">{currentQuestion.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer transition-all hover:shadow-md hover:bg-gray-50"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{option.label}</h4>
                          <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ) : (
            /* Résultats */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-afroGold" />
                    Vos recommandations personnalisées
                  </CardTitle>
                  <p className="text-gray-600">
                    Basées sur vos réponses, voici les produits les mieux adaptés à vos besoins
                  </p>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((product, index) => (
                  <Card key={product.id} className={index === 0 ? 'ring-2 ring-afroGreen' : ''}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          {index === 0 ? 'Recommandé #1' : `Option #${index + 1}`}
                        </Badge>
                        <span className="text-lg font-bold text-afroGreen">
                          {((product as any).recommendationScore || 0).toFixed(0)}%
                        </span>
                      </div>
                      <CardTitle className="text-base">{product.name}</CardTitle>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-2xl font-bold text-afroGreen">
                            {product.price} {product.currency}
                          </span>
                        </div>
                        
                        <Progress 
                          value={(product as any).recommendationScore || 0} 
                          className="h-2" 
                        />
                        
                        <Button
                          size="sm"
                          className="w-full"
                          variant={index === 0 ? 'default' : 'outline'}
                          onClick={() => {
                            if (onProductSelect) {
                              onProductSelect(product.id);
                            }
                          }}
                        >
                          {index === 0 ? 'Choisir ce produit' : 'Sélectionner'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={recommendations.length > 0 ? restart : goBack}
              disabled={currentStep === 0 && recommendations.length === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {recommendations.length > 0 ? 'Recommencer' : 'Précédent'}
            </Button>
            
            <Button onClick={recommendations.length > 0 ? finish : onClose}>
              {recommendations.length > 0 ? 'Appliquer la sélection' : 'Fermer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

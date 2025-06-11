
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, X, RefreshCw } from 'lucide-react';

interface SmartSuggestion {
  id: string;
  type: 'search' | 'category' | 'filter' | 'tip';
  title: string;
  description: string;
  action?: string;
  confidence: number;
}

interface SmartSuggestionsProps {
  currentQuery?: string;
  onSuggestionClick: (suggestion: SmartSuggestion) => void;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  currentQuery,
  onSuggestionClick
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateSuggestions();
  }, [currentQuery]);

  const generateSuggestions = () => {
    const baseSuggestions: SmartSuggestion[] = [
      {
        id: 'compare-prices',
        type: 'tip',
        title: 'Comparez les prix',
        description: 'Utilisez notre comparateur pour économiser jusqu\'à 30%',
        confidence: 0.9
      },
      {
        id: 'local-providers',
        type: 'filter',
        title: 'Fournisseurs locaux',
        description: 'Découvrez les options disponibles dans votre région',
        action: 'filter:location',
        confidence: 0.8
      },
      {
        id: 'seasonal-offers',
        type: 'category',
        title: 'Offres saisonnières',
        description: 'Profitez des promotions en cours ce mois-ci',
        confidence: 0.7
      }
    ];

    // Suggestions contextuelles basées sur la requête
    if (currentQuery) {
      const contextual: SmartSuggestion[] = [
        {
          id: 'related-search',
          type: 'search',
          title: `Recherches similaires à "${currentQuery}"`,
          description: 'Explorez des produits complémentaires',
          action: `search:${currentQuery} accessoires`,
          confidence: 0.85
        }
      ];
      
      setSuggestions([...contextual, ...baseSuggestions].filter(s => !dismissed.has(s.id)));
    } else {
      setSuggestions(baseSuggestions.filter(s => !dismissed.has(s.id)));
    }
  };

  const handleDismiss = (suggestionId: string) => {
    const newDismissed = new Set(dismissed);
    newDismissed.add(suggestionId);
    setDismissed(newDismissed);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'search': return 'bg-blue-100 text-blue-800';
      case 'category': return 'bg-green-100 text-green-800';
      case 'filter': return 'bg-purple-100 text-purple-800';
      case 'tip': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Suggestions intelligentes</span>
          </div>
          <Button variant="ghost" size="sm" onClick={generateSuggestions}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id}
              className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className={getTypeColor(suggestion.type)}>
                    {suggestion.type}
                  </Badge>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full mx-px ${
                          i < suggestion.confidence * 5 ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="font-medium text-sm">{suggestion.title}</h4>
                <p className="text-xs text-gray-600">{suggestion.description}</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(suggestion.id)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 Ces suggestions s'améliorent avec votre utilisation
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

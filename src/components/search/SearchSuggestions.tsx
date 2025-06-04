
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Clock, Package, Tag, Star } from 'lucide-react';
import { IntelligentSuggestionsService, SmartSuggestion } from '@/services/IntelligentSuggestionsService';
import { useAuth } from '@/contexts/AuthContext';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  sector?: string;
  isVisible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionClick,
  sector,
  isVisible
}) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const smartSuggestions = await IntelligentSuggestionsService.generateSmartSuggestions(
          query,
          user?.id,
          sector,
          8
        );
        setSuggestions(smartSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce pour éviter trop de requêtes
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, user?.id, sector, isVisible]);

  if (!isVisible || (!loading && suggestions.length === 0)) {
    return null;
  }

  const getIcon = (type: SmartSuggestion['type']) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'brand':
        return <Tag className="h-4 w-4" />;
      case 'category':
        return <Search className="h-4 w-4" />;
      case 'recent':
        return <Clock className="h-4 w-4" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: SmartSuggestion['type']) => {
    switch (type) {
      case 'product':
        return 'Produit';
      case 'brand':
        return 'Marque';
      case 'category':
        return 'Catégorie';
      case 'recent':
        return 'Récent';
      case 'trending':
        return 'Tendance';
      default:
        return '';
    }
  };

  const getTypeColor = (type: SmartSuggestion['type']) => {
    switch (type) {
      case 'product':
        return 'bg-blue-100 text-blue-800';
      case 'brand':
        return 'bg-green-100 text-green-800';
      case 'category':
        return 'bg-purple-100 text-purple-800';
      case 'recent':
        return 'bg-gray-100 text-gray-800';
      case 'trending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Grouper les suggestions par type
  const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
    const type = suggestion.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(suggestion);
    return groups;
  }, {} as Record<string, SmartSuggestion[]>);

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-2 bg-white/95 backdrop-blur-sm border-white/20 shadow-lg max-h-96 overflow-y-auto">
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="w-12 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
              <div key={type}>
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(type as SmartSuggestion['type'])}
                  <span className="text-sm font-medium text-gray-700">
                    {getTypeLabel(type as SmartSuggestion['type'])}
                  </span>
                </div>
                <div className="space-y-1">
                  {typeSuggestions.map((suggestion, index) => (
                    <div
                      key={`${type}-${index}`}
                      className="flex items-center justify-between group"
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left hover:bg-brandBlue/10 group-hover:bg-brandBlue/10"
                        onClick={() => onSuggestionClick(suggestion.text)}
                      >
                        <span className="truncate">{suggestion.text}</span>
                      </Button>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getTypeColor(suggestion.type)}`}
                        >
                          {getTypeLabel(suggestion.type)}
                        </Badge>
                        {suggestion.confidence > 0.8 && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

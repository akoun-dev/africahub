
import React, { useState } from 'react';
import { Clock, Search, Trash2, RotateCcw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { useSearchHistory, SearchHistoryItem } from '@/hooks/useSearchHistory';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const History = () => {
  const { user } = useAuth();
  const { history, isLoading, clearHistory, deleteHistoryItem } = useSearchHistory();
  const [searchFilter, setSearchFilter] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Accédez à votre historique</h1>
            <p className="text-gray-600 mb-6">
              Connectez-vous pour voir vos recherches précédentes
            </p>
            <Button asChild>
              <a href="/auth">Se connecter</a>
            </Button>
          </div>
        </main>
        <UnifiedFooter />
      </div>
    );
  }

  const filteredHistory = history.filter(item =>
    item.search_query.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.sector.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleRepeatSearch = (item: SearchHistoryItem) => {
    const params = new URLSearchParams({
      q: item.search_query,
      sector: item.sector,
      ...item.filters
    });
    window.location.href = `/search?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afroGreen mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de votre historique...</p>
          </div>
        </main>
        <UnifiedFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Historique des recherches
                </h1>
                <p className="text-gray-600">
                  {history.length} recherche{history.length !== 1 ? 's' : ''} effectuée{history.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {history.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={() => clearHistory.mutate()}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider l'historique
                </Button>
              )}
            </div>

            {history.length > 0 && (
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Filtrer les recherches..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {history.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun historique</h3>
                  <p className="text-gray-600 mb-6">
                    Vos recherches apparaîtront ici pour un accès rapide
                  </p>
                  <Button asChild>
                    <a href="/search">Commencer une recherche</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Search className="h-5 w-5 text-afroGreen" />
                            {item.search_query}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDistanceToNow(new Date(item.created_at), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRepeatSearch(item)}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Relancer
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteHistoryItem.mutate(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {item.sector}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {item.results_count} résultat{item.results_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {Object.keys(item.filters).length > 0 && (
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(item.filters).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {key}: {String(value)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <UnifiedFooter />
    </div>
  );
};

export default History;

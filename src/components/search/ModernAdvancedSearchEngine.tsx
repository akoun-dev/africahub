
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Mic, 
  MicOff, 
  Filter, 
  X, 
  Sparkles, 
  Clock, 
  TrendingUp,
  MapPin,
  Star,
  SlidersHorizontal
} from 'lucide-react';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { SearchSuggestions } from './SearchSuggestions';
import { VoiceSearchService } from '@/services/search/VoiceSearchService';
import { SearchAnalytics } from '@/services/search/SearchAnalytics';
import { ModernSearchResults } from './ModernSearchResults';
import { SmartFiltersPanel } from './SmartFiltersPanel';
import { useSearchGeo } from '@/hooks/search/useSearchGeo';
import { toast } from 'sonner';

export const ModernAdvancedSearchEngine: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const voiceService = useRef(new VoiceSearchService());
  
  const {
    criteria,
    searchResults,
    loading,
    currentPage,
    totalPages,
    totalCount,
    searchTime,
    suggestions,
    updateCriteria,
    updateFilters,
    clearFilters,
    goToPage,
    activeFiltersCount
  } = useAdvancedSearch();

  const { location } = useSearchGeo();

  // Recherche en temps réel avec debounce
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (searchQuery.trim()) {
            updateCriteria({ query: searchQuery });
          }
        }, 300);
      };
    })(),
    [updateCriteria]
  );

  // Gestion de la saisie
  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(value.length > 1);
    debouncedSearch(value);
  };

  // Recherche vocale
  const toggleVoiceSearch = async () => {
    if (!voiceService.current.isVoiceSearchSupported()) {
      toast.error('La recherche vocale n\'est pas supportée sur ce navigateur');
      return;
    }

    if (isVoiceActive) {
      voiceService.current.stopListening();
      setIsVoiceActive(false);
      return;
    }

    setIsVoiceActive(true);
    
    await voiceService.current.startListening(
      {
        language: location?.country === 'FR' ? 'fr-FR' : 'fr-FR',
        continuous: false,
        interimResults: true
      },
      (result) => {
        if (result.isFinal) {
          const normalizedText = VoiceSearchService.normalizeVoiceInput(result.transcript);
          setQuery(normalizedText);
          handleInputChange(normalizedText);
          setIsVoiceActive(false);
          toast.success(`Recherche vocale: "${normalizedText}"`);
        }
      },
      (error) => {
        setIsVoiceActive(false);
        toast.error(`Erreur vocale: ${error}`);
      }
    );
  };

  // Sélection de suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    updateCriteria({ query: suggestion });
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K pour focus sur la recherche
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Ctrl/Cmd + / pour activer les filtres
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowFilters(!showFilters);
      }

      // Échap pour fermer suggestions et filtres
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showFilters]);

  // Recherches récentes et populaires
  const recentSearches = SearchAnalytics.getRecentSearches(5);
  const popularSearches = SearchAnalytics.getPopularSearches(5);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Hero Section avec recherche principale */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brandBlue/10 to-purple-600/10" />
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-brandBlue to-purple-600 bg-clip-text text-transparent">
              Recherche Intelligente
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trouvez les meilleurs produits et services avec notre IA avancée
            </p>
          </div>

          {/* Barre de recherche principale */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        ref={searchInputRef}
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Rechercher des produits, services, marques... (Ctrl+K)"
                        className="pl-12 pr-16 h-14 text-lg border-0 bg-white/50 backdrop-blur-sm focus:bg-white/80 transition-all"
                        onFocus={() => setShowSuggestions(query.length > 1)}
                      />
                      
                      {/* Bouton recherche vocale */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleVoiceSearch}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${
                          isVoiceActive ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-brandBlue'
                        }`}
                      >
                        {isVoiceActive ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                    </div>

                    {/* Bouton filtres */}
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="h-14 px-6 bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/80"
                    >
                      <SlidersHorizontal className="h-5 w-5 mr-2" />
                      Filtres
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-brandBlue text-white">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>

                    {/* Toggle dark mode */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="h-14 px-4"
                    >
                      {isDarkMode ? '☀️' : '🌙'}
                    </Button>
                  </div>

                  {/* Suggestions intelligentes */}
                  {showSuggestions && (
                    <SearchSuggestions
                      query={query}
                      onSuggestionClick={handleSuggestionClick}
                      sector={criteria.category}
                      isVisible={showSuggestions}
                    />
                  )}
                </div>

                {/* Recherches rapides */}
                {!query && (
                  <div className="mt-6 space-y-4">
                    {/* Recherches récentes */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">Récemment recherché</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(search)}
                              className="bg-white/50 border-white/20 hover:bg-white/80"
                            >
                              {search}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recherches populaires */}
                    {popularSearches.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">Tendances</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((search, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(search.query)}
                              className="bg-white/50 border-white/20 hover:bg-white/80"
                            >
                              {search.query}
                              <Badge variant="secondary" className="ml-1 text-xs">
                                {search.count}
                              </Badge>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Informations contextuelles */}
                {location && (
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{location.city}, {location.country}</span>
                    </div>
                    {searchTime > 0 && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        <span>Recherche en {searchTime}ms</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Panneau de filtres intelligent */}
      {showFilters && (
        <SmartFiltersPanel
          criteria={criteria}
          onUpdateFilters={updateFilters}
          onClearFilters={clearFilters}
          onClose={() => setShowFilters(false)}
          userLocation={location}
        />
      )}

      {/* Résultats de recherche modernes */}
      {(query || searchResults.length > 0) && (
        <div className="container mx-auto px-4 py-8">
          <ModernSearchResults
            results={searchResults}
            loading={loading}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            searchTime={searchTime}
            query={query}
          />
        </div>
      )}
    </div>
  );
};

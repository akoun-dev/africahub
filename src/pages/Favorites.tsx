
import React, { useState } from 'react';
import { Heart, Trash2, BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { useFavorites, Favorite } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

const Favorites = () => {
  const { user } = useAuth();
  const { favorites, isLoading, removeFromFavorites } = useFavorites();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Accédez à vos favoris</h1>
            <p className="text-gray-600 mb-6">
              Connectez-vous pour voir vos produits favoris
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

  const groupedFavorites = favorites.reduce((acc, favorite) => {
    const category = favorite.category || 'Autres';
    if (!acc[category]) acc[category] = [];
    acc[category].push(favorite);
    return acc;
  }, {} as Record<string, Favorite[]>);

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCompareSelected = () => {
    // Navigation vers la page de comparaison avec les produits sélectionnés
    const productIds = selectedProducts.join(',');
    window.location.href = `/compare?products=${productIds}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afroGreen mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de vos favoris...</p>
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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Mes Favoris
                </h1>
                <p className="text-gray-600">
                  {favorites.length} produit{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    {selectedProducts.length} sélectionné{selectedProducts.length !== 1 ? 's' : ''}
                  </Badge>
                  <Button 
                    onClick={handleCompareSelected}
                    disabled={selectedProducts.length < 2}
                    className="bg-afroGreen hover:bg-afroGreen/90"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Comparer
                  </Button>
                </div>
              )}
            </div>

            {favorites.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun favori</h3>
                  <p className="text-gray-600 mb-6">
                    Commencez à explorer nos produits et ajoutez vos préférés ici
                  </p>
                  <Button asChild>
                    <a href="/search">Explorer les produits</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="all">
                    Tous ({favorites.length})
                  </TabsTrigger>
                  {Object.entries(groupedFavorites).map(([category, items]) => (
                    <TabsTrigger key={category} value={category}>
                      {category} ({items.length})
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((favorite) => (
                      <FavoriteCard
                        key={favorite.id}
                        favorite={favorite}
                        isSelected={selectedProducts.includes(favorite.product_id)}
                        onSelect={() => handleProductSelect(favorite.product_id)}
                        onRemove={() => removeFromFavorites.mutate(favorite.id)}
                      />
                    ))}
                  </div>
                </TabsContent>

                {Object.entries(groupedFavorites).map(([category, items]) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {items.map((favorite) => (
                        <FavoriteCard
                          key={favorite.id}
                          favorite={favorite}
                          isSelected={selectedProducts.includes(favorite.product_id)}
                          onSelect={() => handleProductSelect(favorite.product_id)}
                          onRemove={() => removeFromFavorites.mutate(favorite.id)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </main>
      <UnifiedFooter />
    </div>
  );
};

interface FavoriteCardProps {
  favorite: Favorite;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  isSelected,
  onSelect,
  onRemove,
}) => {
  const product = favorite.product;
  
  if (!product) return null;

  return (
    <Card className={`transition-all duration-200 ${
      isSelected ? 'ring-2 ring-afroGreen bg-afroGreen/5' : 'hover:shadow-lg'
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
            <p className="text-xl font-bold text-afroGreen mt-2">
              {product.price} {product.currency}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelect}
              className={isSelected ? 'bg-afroGreen/10' : ''}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{product.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <Badge variant="outline">
            {product.companies?.name}
          </Badge>
          <Badge variant="secondary">
            {favorite.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default Favorites;

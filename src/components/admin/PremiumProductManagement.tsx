
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useProducts } from '@/hooks/useProducts';
import { useCompanies } from '@/hooks/useCompanies';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const PremiumProductManagement = () => {
  const [isCreatingMockData, setIsCreatingMockData] = useState(false);
  const { data: products, refetch } = useProducts();
  const { data: companies } = useCompanies();

  const createMockProducts = async () => {
    setIsCreatingMockData(true);
    try {
      // Get first company for reference
      const firstCompany = companies?.[0];
      if (!firstCompany) {
        toast.error('Aucune entreprise trouvée. Créez d\'abord une entreprise.');
        return;
      }

      const mockProducts = [
        {
          name: 'Assurance Auto Premium',
          description: 'Couverture complète pour véhicules particuliers',
          brand: 'Allianz',
          price: 850000,
          currency: 'XOF',
          image_url: '/placeholder.svg',
          purchase_link: 'https://allianz.sn/auto',
          product_type_id: null,
          company_id: firstCompany.id,
          country: 'SN',
          country_availability: ['SN', 'CI', 'ML'],
          category: 'auto' as const,
          coverage_amount: 50000000,
          premium_amount: 850000,
          deductible: 100000,
          benefits: ['Dommages collision', 'Vol', 'Incendie', 'Assistance 24h/24'],
          exclusions: ['Conduite en état d\'ivresse', 'Usage commercial'],
          min_age: 18,
          max_age: 75
        },
        {
          name: 'Assurance Santé Famille',
          description: 'Protection santé complète pour toute la famille',
          brand: 'AXA',
          price: 1200000,
          currency: 'XOF',
          image_url: '/placeholder.svg',
          purchase_link: 'https://axa.ci/sante',
          product_type_id: null,
          company_id: firstCompany.id,
          country: 'CI',
          country_availability: ['CI', 'BF', 'NE'],
          category: 'health' as const,
          coverage_amount: 10000000,
          premium_amount: 1200000,
          deductible: 50000,
          benefits: ['Hospitalisation', 'Consultations', 'Médicaments', 'Dentaire'],
          exclusions: ['Maladies préexistantes', 'Chirurgie esthétique'],
          min_age: 0,
          max_age: 65
        },
        {
          name: 'Assurance Habitation',
          description: 'Protection complète de votre domicile',
          brand: 'Sanlam',
          price: 450000,
          currency: 'XOF',
          image_url: '/placeholder.svg',
          purchase_link: 'https://sanlam.ma/habitation',
          product_type_id: null,
          company_id: firstCompany.id,
          country: 'MA',
          country_availability: ['MA', 'TN', 'DZ'],
          category: 'property' as const,
          coverage_amount: 100000000,
          premium_amount: 450000,
          deductible: 25000,
          benefits: ['Incendie', 'Dégâts des eaux', 'Vol', 'Responsabilité civile'],
          exclusions: ['Catastrophes naturelles', 'Guerre']
        }
      ];

      const { error } = await supabase
        .from('products')
        .insert(mockProducts);

      if (error) throw error;

      toast.success('Produits de test créés avec succès');
      refetch();
    } catch (error) {
      console.error('Error creating mock data:', error);
      toast.error('Erreur lors de la création des produits de test');
    } finally {
      setIsCreatingMockData(false);
    }
  };

  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter(p => p.is_active).length || 0;
  const autoProducts = products?.filter(p => p.category === 'auto').length || 0;
  const healthProducts = products?.filter(p => p.category === 'health').length || 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion des Produits Premium</h2>
          <Button onClick={createMockProducts} disabled={isCreatingMockData}>
            {isCreatingMockData ? 'Création...' : 'Créer des Produits de Test'}
          </Button>
        </div>
        <p className="text-gray-600">
          Suivez et gérez les produits premium, leurs catégories et leurs performances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
            <p className="text-gray-600">Nombre total de produits disponibles.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeProducts}</div>
            <p className="text-gray-600">Produits actuellement commercialisés.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assurances Auto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{autoProducts}</div>
            <p className="text-gray-600">Produits d'assurance automobile.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assurances Santé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{healthProducts}</div>
            <p className="text-gray-600">Produits d'assurance santé.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <Badge variant={product.is_active ? 'outline' : 'destructive'}>
                  {product.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              
              <p className="text-gray-700 mb-4 text-sm line-clamp-2">{product.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Prix:</span>
                  <span className="font-medium">{product.price?.toLocaleString()} {product.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pays:</span>
                  <span className="font-medium">{product.country}</span>
                </div>
                {product.coverage_amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Couverture:</span>
                    <span className="font-medium">{product.coverage_amount.toLocaleString()} {product.currency}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.benefits?.slice(0, 3).map((benefit, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
                {product.benefits && product.benefits.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{product.benefits.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center">
                {product.purchase_link && (
                  <a 
                    href={product.purchase_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Voir l'offre
                  </a>
                )}
                <Button variant="secondary" size="sm">
                  Gérer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Avancée</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commissionRate">Taux de Commission Global</Label>
            <Slider
              id="commissionRate"
              defaultValue={[15]}
              max={30}
              step={1}
              onValueChange={(value) => console.log('New commission rate:', value[0])}
            />
            <p className="text-sm text-gray-500">
              Ajustez le taux de commission global pour tous les produits.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="featureToggle">Activer les Fonctionnalités Premium</Label>
            <Switch id="featureToggle" onCheckedChange={(checked) => console.log('Premium features:', checked)} />
            <p className="text-sm text-gray-500">
              Activez ou désactivez les fonctionnalités premium pour tous les produits.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcement">Annonce Globale</Label>
            <Textarea
              id="announcement"
              placeholder="Entrez une annonce à afficher pour tous les produits..."
              rows={3}
            />
            <Button size="sm">Envoyer l'Annonce</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

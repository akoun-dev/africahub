
import React, { useState } from 'react';
import { PremiumCard, PremiumCardHeader, PremiumCardTitle, PremiumCardDescription, PremiumCardContent } from '@/components/ui/premium-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { PremiumTabNavigation } from '@/components/dashboard/PremiumTabNavigation';
import { useCompanies } from '@/hooks/useCompanies';
import { useProducts } from '@/hooks/useProducts';
import { useSectors } from '@/hooks/useSectors';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Globe, Building2, Package, Activity, CheckCircle, XCircle } from 'lucide-react';
import { ActivationStats } from './ActivationStats';

const AFRICAN_COUNTRIES = [
  { code: 'SN', name: 'Sénégal' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'MA', name: 'Maroc' },
  { code: 'EG', name: 'Égypte' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'ET', name: 'Éthiopie' }
];

export const ActivationManagement = () => {
  const { data: companies, refetch: refetchCompanies } = useCompanies();
  const { data: products, refetch: refetchProducts } = useProducts();
  const { data: sectors, refetch: refetchSectors } = useSectors();
  const [activeTab, setActiveTab] = useState('overview');

  const handleCompanyActivation = async (companyId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: isActive })
        .eq('id', companyId);
      
      if (error) throw error;
      toast.success(`Société ${isActive ? 'activée' : 'désactivée'} avec succès`);
      refetchCompanies();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error('Error:', error);
    }
  };

  const handleProductActivation = async (productId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', productId);
      
      if (error) throw error;
      toast.success(`Produit ${isActive ? 'activé' : 'désactivé'} avec succès`);
      refetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error('Error:', error);
    }
  };

  const handleSectorActivation = async (sectorId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('sectors')
        .update({ is_active: isActive })
        .eq('id', sectorId);
      
      if (error) throw error;
      toast.success(`Secteur ${isActive ? 'activé' : 'désactivé'} avec succès`);
      refetchSectors();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error('Error:', error);
    }
  };

  const handleCountryAvailability = async (
    table: 'companies' | 'products',
    itemId: string, 
    countryCode: string, 
    isAvailable: boolean
  ) => {
    try {
      // Get current availability
      const { data: currentData } = await supabase
        .from(table)
        .select('country_availability')
        .eq('id', itemId)
        .single();
      
      if (!currentData) return;
      
      let updatedCountries = currentData.country_availability || [];
      
      if (isAvailable) {
        // Add country if not present
        if (!updatedCountries.includes(countryCode)) {
          updatedCountries.push(countryCode);
        }
      } else {
        // Remove country
        updatedCountries = updatedCountries.filter((c: string) => c !== countryCode);
      }
      
      const { error } = await supabase
        .from(table)
        .update({ country_availability: updatedCountries })
        .eq('id', itemId);
      
      if (error) throw error;
      toast.success('Disponibilité pays mise à jour');
      
      if (table === 'companies') refetchCompanies();
      if (table === 'products') refetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error('Error:', error);
    }
  };

  const tabs = [
    { 
      id: 'overview', 
      label: 'Vue d\'ensemble', 
      icon: <Activity className="h-4 w-4" />,
    },
    { 
      id: 'companies', 
      label: 'Sociétés', 
      icon: <Building2 className="h-4 w-4" />
    },
    { 
      id: 'products', 
      label: 'Produits', 
      icon: <Package className="h-4 w-4" />
    },
    { 
      id: 'sectors', 
      label: 'Secteurs', 
      icon: <Globe className="h-4 w-4" />
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ActivationStats />;

      case 'companies':
        return (
          <PremiumCard variant="elevated" size="lg">
            <PremiumCardHeader>
              <PremiumCardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                Activation des sociétés
              </PremiumCardTitle>
              <PremiumCardDescription>
                Gérez l'activation des sociétés partenaires et leur disponibilité géographique
              </PremiumCardDescription>
            </PremiumCardHeader>
            <PremiumCardContent className="pt-6">
              <div className="space-y-6">
                {companies?.map(company => (
                  <div key={company.id} className="p-6 border border-gray-100 rounded-xl hover:border-gray-200 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={company.is_active}
                            onCheckedChange={(checked) => handleCompanyActivation(company.id, checked)}
                          />
                          {company.is_active ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{company.name}</h3>
                          <p className="text-sm text-gray-500">{company.slug}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Disponibilité par pays:</p>
                      <div className="flex flex-wrap gap-2">
                        {AFRICAN_COUNTRIES.map(country => {
                          const isAvailable = company.country_availability?.includes(country.code);
                          return (
                            <Badge
                              key={country.code}
                              variant={isAvailable ? "default" : "outline"}
                              className="cursor-pointer text-xs transition-all hover:scale-105"
                              onClick={() => handleCountryAvailability('companies', company.id, country.code, !isAvailable)}
                            >
                              {country.code}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCardContent>
          </PremiumCard>
        );

      case 'products':
        return (
          <PremiumCard variant="elevated" size="lg">
            <PremiumCardHeader>
              <PremiumCardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                Activation des produits
              </PremiumCardTitle>
              <PremiumCardDescription>
                Gérez l'activation des produits et leur disponibilité géographique
              </PremiumCardDescription>
            </PremiumCardHeader>
            <PremiumCardContent className="pt-6">
              <div className="space-y-6">
                {products?.map(product => (
                  <div key={product.id} className="p-6 border border-gray-100 rounded-xl hover:border-gray-200 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={product.is_active}
                            onCheckedChange={(checked) => handleProductActivation(product.id, checked)}
                          />
                          {product.is_active ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.brand} - {product.price} {product.currency}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Disponibilité par pays:</p>
                      <div className="flex flex-wrap gap-2">
                        {AFRICAN_COUNTRIES.map(country => {
                          const isAvailable = product.country_availability?.includes(country.code);
                          return (
                            <Badge
                              key={country.code}
                              variant={isAvailable ? "default" : "outline"}
                              className="cursor-pointer text-xs transition-all hover:scale-105"
                              onClick={() => handleCountryAvailability('products', product.id, country.code, !isAvailable)}
                            >
                              {country.code}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCardContent>
          </PremiumCard>
        );

      case 'sectors':
        return (
          <PremiumCard variant="elevated" size="lg">
            <PremiumCardHeader>
              <PremiumCardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                Activation des secteurs
              </PremiumCardTitle>
              <PremiumCardDescription>
                Gérez l'activation des secteurs d'activité de la plateforme
              </PremiumCardDescription>
            </PremiumCardHeader>
            <PremiumCardContent className="pt-6">
              <div className="space-y-4">
                {sectors?.map(sector => (
                  <div key={sector.id} className="flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:border-gray-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={sector.is_active}
                          onCheckedChange={(checked) => handleSectorActivation(sector.id, checked)}
                        />
                        {sector.is_active ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: sector.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{sector.name}</h3>
                          <p className="text-sm text-gray-500">{sector.slug}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant={sector.is_active ? "default" : "secondary"}>
                      {sector.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                ))}
              </div>
            </PremiumCardContent>
          </PremiumCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <PremiumCard variant="elevated" size="lg">
        <PremiumCardHeader>
          <PremiumCardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-afroGreen/10">
              <Activity className="h-5 w-5 text-afroGreen" />
            </div>
            Gestion des activations
          </PremiumCardTitle>
          <PremiumCardDescription>
            Contrôlez l'activation des sociétés, produits et secteurs selon vos accords commerciaux
          </PremiumCardDescription>
        </PremiumCardHeader>
      </PremiumCard>

      <PremiumTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderTabContent()}
    </div>
  );
};

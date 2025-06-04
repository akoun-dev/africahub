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
import { useCompanies } from '@/hooks/useCompanies';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const PremiumCompanyManagement = () => {
  const [isCreatingMockData, setIsCreatingMockData] = useState(false);
  const { data: companies, refetch } = useCompanies();

  const createMockCompanies = async () => {
    try {
      const mockCompanies = [
        {
          name: 'Allianz Sénégal',
          slug: 'allianz-senegal',
          country: 'SN',
          description: 'Leader de l\'assurance en Afrique de l\'Ouest',
          logo_url: '/placeholder.svg',
          website_url: 'https://allianz.sn',
          contact_email: 'contact@allianz.sn',
          contact_phone: '+221 33 123 45 67',
          is_active: true,
          is_partner: true,
          commission_rate: 5.5,
          sectors: ['auto', 'health', 'home'],
          country_availability: ['SN', 'CI', 'ML']
        },
        {
          name: 'AXA Côte d\'Ivoire',
          slug: 'axa-cote-divoire',
          country: 'CI',
          description: 'Solutions d\'assurance innovantes',
          logo_url: '/placeholder.svg',
          website_url: 'https://axa.ci',
          contact_email: 'contact@axa.ci',
          contact_phone: '+225 22 22 22 22',
          is_active: true,
          is_partner: true,
          commission_rate: 6.0,
          sectors: ['auto', 'life', 'savings'],
          country_availability: ['CI', 'BF', 'NE']
        },
        {
          name: 'Sanlam Maroc',
          slug: 'sanlam-maroc',
          country: 'MA',
          description: 'Expert en assurance et gestion de patrimoine',
          logo_url: '/placeholder.svg',
          website_url: 'https://sanlam.ma',
          contact_email: 'contact@sanlam.ma',
          contact_phone: '+212 5 22 33 44 55',
          is_active: true,
          is_partner: true,
          commission_rate: 7.0,
          sectors: ['health', 'retirement', 'investments'],
          country_availability: ['MA', 'TN', 'DZ']
        }
      ];

      const { error } = await supabase
        .from('companies')
        .insert(mockCompanies);

      if (error) throw error;

      toast.success('Données de test créées avec succès');
      refetch();
    } catch (error) {
      console.error('Error creating mock data:', error);
      toast.error('Erreur lors de la création des données de test');
    }
  };

  const totalCompanies = companies?.length || 0;
  const activeCompanies = companies?.filter(c => c.is_active).length || 0;
  const partnerCompanies = companies?.filter(c => c.is_partner).length || 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion des Entreprises Premium</h2>
          <Button onClick={createMockCompanies} disabled={isCreatingMockData}>
            {isCreatingMockData ? 'Création...' : 'Créer des Données de Test'}
          </Button>
        </div>
        <p className="text-gray-600">
          Suivez et gérez les entreprises premium, leurs statuts et leurs performances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Entreprises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCompanies}</div>
            <p className="text-gray-600">Nombre total d'entreprises enregistrées.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entreprises Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCompanies}</div>
            <p className="text-gray-600">Nombre d'entreprises actuellement actives.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partenaires Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{partnerCompanies}</div>
            <p className="text-gray-600">Nombre d'entreprises partenaires premium.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies?.map((company) => (
          <Card key={company.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {company.logo_url ? (
                      <img 
                        src={company.logo_url} 
                        alt={company.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      company.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    <p className="text-sm text-gray-600">{company.country}</p>
                  </div>
                </div>
                <Badge variant={company.is_active ? 'outline' : 'destructive'}>
                  {company.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-gray-700 mb-4">{company.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {company.sectors?.map(sector => (
                  <Badge key={sector}>{sector}</Badge>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Visiter le site
                </a>
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
              Ajustez le taux de commission global pour tous les partenaires.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="featureToggle">Activer les Fonctionnalités Premium</Label>
            <Switch id="featureToggle" onCheckedChange={(checked) => console.log('Premium features:', checked)} />
            <p className="text-sm text-gray-500">
              Activez ou désactivez les fonctionnalités premium pour tous les partenaires.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcement">Annonce Globale</Label>
            <Textarea
              id="announcement"
              placeholder="Entrez une annonce à afficher à tous les partenaires..."
              rows={3}
            />
            <Button size="sm">Envoyer l'Annonce</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CountryGroupCard } from './country-groups/CountryGroupCard';
import { GroupConfiguration } from './country-groups/GroupConfiguration';
import { CountriesManagement } from './country-groups/CountriesManagement';
import { CountryGroup } from './country-groups/types';

export const CountryGroupManager: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState('cedeao');

  const countryGroups: CountryGroup[] = [
    {
      id: 'cedeao',
      name: 'CEDEAO',
      description: 'Communauté Économique des États de l\'Afrique de l\'Ouest',
      countries: ['SN', 'CI', 'GH', 'NG', 'BF', 'ML', 'NE', 'GN', 'SL', 'LR', 'TG', 'BJ', 'CV', 'GM', 'GW'],
      currency: 'XOF',
      activeCountries: 12,
      totalUsers: 28450,
      avgRevenue: 156000,
      isActive: true,
      color: '#10B981'
    },
    {
      id: 'cemac',
      name: 'CEMAC',
      description: 'Communauté Économique et Monétaire de l\'Afrique Centrale',
      countries: ['CM', 'CF', 'TD', 'CG', 'GA', 'GQ'],
      currency: 'XAF',
      activeCountries: 4,
      totalUsers: 8920,
      avgRevenue: 98000,
      isActive: true,
      color: '#3B82F6'
    },
    {
      id: 'maghreb',
      name: 'Maghreb',
      description: 'Union du Maghreb Arabe',
      countries: ['MA', 'DZ', 'TN', 'LY', 'MR'],
      currency: 'MAD',
      activeCountries: 3,
      totalUsers: 15670,
      avgRevenue: 245000,
      isActive: true,
      color: '#8B5CF6'
    },
    {
      id: 'custom_premium',
      name: 'Zone Premium Personnalisée',
      description: 'Pays à fort potentiel économique',
      countries: ['ZA', 'NG', 'KE', 'EG', 'GH'],
      currency: 'USD',
      activeCountries: 5,
      totalUsers: 42100,
      avgRevenue: 520000,
      isActive: true,
      color: '#F59E0B'
    }
  ];

  const selectedGroupData = countryGroups.find(g => g.id === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Groupes de Pays</h3>
          <p className="text-gray-600">Gestion des zones économiques et groupes personnalisés</p>
        </div>
        
        <Button size="sm" className="bg-afroGreen hover:bg-afroGreen/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Groupe
        </Button>
      </div>

      {/* Groups Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {countryGroups.map((group) => (
          <CountryGroupCard
            key={group.id}
            group={group}
            isSelected={selectedGroup === group.id}
            onClick={() => setSelectedGroup(group.id)}
          />
        ))}
      </div>

      {/* Selected Group Details */}
      {selectedGroupData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GroupConfiguration group={selectedGroupData} />
          <CountriesManagement group={selectedGroupData} />
        </div>
      )}
    </div>
  );
};

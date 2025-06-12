
import React, { useState } from 'react';
import { ProductStatsCards } from './product-management/ProductStatsCards';
import { ProductManagementHeader } from './product-management/ProductManagementHeader';
import { ProductManagementTabs } from './product-management/ProductManagementTabs';

export const ProductManagementEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');

  return (
    <div className="space-y-6">
      <ProductManagementHeader />
      
      <ProductStatsCards />

      <ProductManagementTabs
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
      />
    </div>
  );
};

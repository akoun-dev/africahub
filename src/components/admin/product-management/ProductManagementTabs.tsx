
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductPriceZoneManager } from '../ProductPriceZoneManager';
import { ProductAvailabilityRules } from '../ProductAvailabilityRules';
import { ProductBulkImporter } from '../ProductBulkImporter';
import { ProductVersionHistory } from '../ProductVersionHistory';
import { ProductOverviewTab } from './ProductOverviewTab';

interface ProductManagementTabsProps {
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (value: string) => void;
}

export const ProductManagementTabs: React.FC<ProductManagementTabsProps> = ({
  activeTab,
  onActiveTabChange,
  searchTerm,
  onSearchChange,
  selectedSector,
  onSectorChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onActiveTabChange} className="space-y-4">
      <TabsList className="grid grid-cols-5 w-full max-w-2xl">
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="pricing">Zones Tarifaires</TabsTrigger>
        <TabsTrigger value="availability">Disponibilité</TabsTrigger>
        <TabsTrigger value="import">Import/Export</TabsTrigger>
        <TabsTrigger value="history">Historique</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ProductOverviewTab
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          selectedSector={selectedSector}
          onSectorChange={onSectorChange}
        />
      </TabsContent>

      <TabsContent value="pricing">
        <ProductPriceZoneManager />
      </TabsContent>

      <TabsContent value="availability">
        <ProductAvailabilityRules />
      </TabsContent>

      <TabsContent value="import">
        <ProductBulkImporter />
      </TabsContent>

      <TabsContent value="history">
        <ProductVersionHistory />
      </TabsContent>
    </Tabs>
  );
};


import React, { useState } from 'react';
import { EnhancedCountryHeader } from './enhanced-country-management/EnhancedCountryHeader';
import { CountryStatsCards } from './enhanced-country-management/CountryStatsCards';
import { EnhancedCountryTabs } from './enhanced-country-management/EnhancedCountryTabs';

export const EnhancedCountryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <EnhancedCountryHeader />
      
      <CountryStatsCards />

      <EnhancedCountryTabs
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />
    </div>
  );
};

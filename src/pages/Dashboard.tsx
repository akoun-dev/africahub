
import React from 'react';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { AdvancedAnalyticsDashboard } from '@/components/dashboard/AdvancedAnalyticsDashboard';
import { useTranslation } from '@/hooks/useTranslation';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      <main className="container mx-auto px-4 py-8">
        <AdvancedAnalyticsDashboard />
      </main>
      
      <UnifiedFooter />
    </div>
  );
};

export default Dashboard;

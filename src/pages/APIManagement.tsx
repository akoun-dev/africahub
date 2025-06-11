
import React from 'react';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { APIManagementDashboard } from '@/components/api/APIManagementDashboard';

export default function APIManagement() {
  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <APIManagementDashboard />
        </div>
      </main>
      <UnifiedFooter />
    </div>
  );
}

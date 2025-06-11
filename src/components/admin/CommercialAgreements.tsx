
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { usePartnerAgreements } from '@/hooks/usePartnerAgreements';
import { ExpiringAgreementsAlert } from './ExpiringAgreementsAlert';
import { CommercialAgreementsTabs } from './CommercialAgreementsTabs';

export const CommercialAgreements = () => {
  const { data: agreements, isLoading } = usePartnerAgreements();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestion des accords commerciaux
          </CardTitle>
          <p className="text-gray-600">
            Gérez les accords partenaires et suivez les activations automatiques
          </p>
        </CardHeader>
      </Card>

      <ExpiringAgreementsAlert agreements={agreements || []} />

      <CommercialAgreementsTabs
        agreements={agreements || []}
        showForm={showForm}
        setShowForm={setShowForm}
      />
    </div>
  );
};

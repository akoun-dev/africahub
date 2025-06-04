
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, Building2 } from 'lucide-react';
import { PartnerAgreement } from '@/hooks/usePartnerAgreements';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExpiringAgreementsAlertProps {
  agreements: PartnerAgreement[];
}

export const ExpiringAgreementsAlert: React.FC<ExpiringAgreementsAlertProps> = ({ agreements }) => {
  const getExpiringAgreements = () => {
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    
    return agreements.filter(agreement => 
      agreement.end_date && 
      new Date(agreement.end_date) <= oneMonthFromNow &&
      agreement.status === 'active'
    );
  };

  const expiringAgreements = getExpiringAgreements();

  if (expiringAgreements.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Accords arrivant à expiration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expiringAgreements.map(agreement => (
            <div key={agreement.id} className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center gap-4">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{agreement.companies?.name}</span>
                <Badge variant="outline">{agreement.country_code}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-700">
                  Expire le {format(new Date(agreement.end_date!), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

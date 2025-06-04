
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { PartnerAgreement } from '@/hooks/usePartnerAgreements';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AgreementCalendarProps {
  agreements: PartnerAgreement[];
}

export const AgreementCalendar: React.FC<AgreementCalendarProps> = ({ agreements }) => {
  const now = new Date();
  const thirtyDaysFromNow = addDays(now, 30);

  const getAgreementsByTimeframe = () => {
    const upcoming = agreements.filter(agreement => 
      agreement.start_date && 
      isAfter(new Date(agreement.start_date), now) &&
      isBefore(new Date(agreement.start_date), thirtyDaysFromNow)
    );

    const expiring = agreements.filter(agreement => 
      agreement.end_date && 
      isAfter(new Date(agreement.end_date), now) &&
      isBefore(new Date(agreement.end_date), thirtyDaysFromNow) &&
      agreement.status === 'active'
    );

    const recent = agreements.filter(agreement =>
      agreement.signature_date &&
      isAfter(new Date(agreement.signature_date), addDays(now, -30))
    );

    return { upcoming, expiring, recent };
  };

  const { upcoming, expiring, recent } = getAgreementsByTimeframe();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Calendar className="h-5 w-5" />
            Accords à venir
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun accord à venir</p>
          ) : (
            upcoming.map(agreement => (
              <div key={agreement.id} className="p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{agreement.companies?.name}</h4>
                  <Badge variant="outline">{agreement.country_code}</Badge>
                </div>
                <p className="text-sm text-blue-700">
                  Début: {format(new Date(agreement.start_date), 'dd MMMM yyyy', { locale: fr })}
                </p>
                <Badge className="mt-2" variant="outline">
                  {agreement.agreement_type}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            Expirations prochaines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {expiring.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune expiration prochaine</p>
          ) : (
            expiring.map(agreement => (
              <div key={agreement.id} className="p-3 border rounded-lg bg-orange-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{agreement.companies?.name}</h4>
                  <Badge variant="outline">{agreement.country_code}</Badge>
                </div>
                <p className="text-sm text-orange-700">
                  Expire: {format(new Date(agreement.end_date!), 'dd MMMM yyyy', { locale: fr })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{agreement.agreement_type}</Badge>
                  <span className="text-xs text-orange-600">
                    Commission: {agreement.commission_rate}%
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Récemment signés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recent.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun accord récent</p>
          ) : (
            recent.map(agreement => (
              <div key={agreement.id} className="p-3 border rounded-lg bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{agreement.companies?.name}</h4>
                  <Badge variant="outline">{agreement.country_code}</Badge>
                </div>
                <p className="text-sm text-green-700">
                  Signé: {format(new Date(agreement.signature_date), 'dd MMMM yyyy', { locale: fr })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={agreement.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {agreement.status}
                  </Badge>
                  {agreement.auto_activate && (
                    <span className="text-xs text-green-600">Auto-activation</span>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

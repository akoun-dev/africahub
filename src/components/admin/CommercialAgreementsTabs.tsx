
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, TrendingUp, Globe } from 'lucide-react';
import { PartnerAgreement } from '@/hooks/usePartnerAgreements';
import { AgreementsList } from './AgreementsList';
import { AgreementCalendar } from './AgreementCalendar';
import { CommercialDashboard } from './CommercialDashboard';

interface CommercialAgreementsTabsProps {
  agreements: PartnerAgreement[];
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

export const CommercialAgreementsTabs: React.FC<CommercialAgreementsTabsProps> = ({
  agreements,
  showForm,
  setShowForm
}) => {
  return (
    <Tabs defaultValue="agreements" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="agreements" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Accords
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Calendrier
        </TabsTrigger>
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Dashboard Commercial
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="agreements">
        <AgreementsList 
          agreements={agreements}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      </TabsContent>

      <TabsContent value="calendar">
        <AgreementCalendar agreements={agreements} />
      </TabsContent>

      <TabsContent value="dashboard">
        <CommercialDashboard agreements={agreements} />
      </TabsContent>

      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics des accords</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Fonctionnalité à venir : analytics détaillées des performances commerciales
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

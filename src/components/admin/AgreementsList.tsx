
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PartnerAgreement, useUpdateAgreement } from '@/hooks/usePartnerAgreements';
import { AgreementForm } from './AgreementForm';
import { format } from 'date-fns';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  expired: 'bg-red-100 text-red-800',
  terminated: 'bg-red-100 text-red-800'
};

const AGREEMENT_TYPE_COLORS = {
  standard: 'bg-blue-100 text-blue-800',
  premium: 'bg-purple-100 text-purple-800',
  exclusive: 'bg-orange-100 text-orange-800'
};

interface AgreementsListProps {
  agreements: PartnerAgreement[];
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

export const AgreementsList: React.FC<AgreementsListProps> = ({ 
  agreements, 
  showForm, 
  setShowForm 
}) => {
  const updateAgreement = useUpdateAgreement();

  const handleStatusChange = async (agreementId: string, newStatus: 'draft' | 'active' | 'expired' | 'terminated') => {
    try {
      await updateAgreement.mutateAsync({ id: agreementId, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des accords</CardTitle>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>Nouvel accord</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Créer un nouvel accord</DialogTitle>
            </DialogHeader>
            <AgreementForm onSuccess={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Société</TableHead>
              <TableHead>Pays</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date signature</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agreements?.map(agreement => (
              <TableRow key={agreement.id}>
                <TableCell className="font-medium">
                  {agreement.companies?.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{agreement.country_code}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={AGREEMENT_TYPE_COLORS[agreement.agreement_type]}>
                    {agreement.agreement_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_COLORS[agreement.status]}>
                    {agreement.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(agreement.signature_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {agreement.end_date ? 
                    format(new Date(agreement.end_date), 'dd/MM/yyyy') : 
                    'Indéterminée'
                  }
                </TableCell>
                <TableCell>{agreement.commission_rate}%</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {agreement.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(agreement.id, 'active')}
                      >
                        Activer
                      </Button>
                    )}
                    {agreement.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(agreement.id, 'terminated')}
                      >
                        Terminer
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

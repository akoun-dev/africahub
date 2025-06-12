
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';
import { Loader2, Calendar, Mail, Phone, MapPin, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const QuoteRequestsList: React.FC = () => {
  const { data: quoteRequests, isLoading, error } = useQuoteRequests();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-afroGreen" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur lors du chargement des demandes de devis</p>
      </div>
    );
  }

  if (!quoteRequests || quoteRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune demande de devis trouvée</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getInsuranceTypeText = (type: string) => {
    switch (type) {
      case 'auto':
        return 'Assurance Auto';
      case 'home':
        return 'Assurance Habitation';
      case 'health':
        return 'Assurance Santé';
      case 'micro':
        return 'Micro-assurance';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-afroBlack mb-6">Mes demandes de devis</h2>
      
      {quoteRequests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {getInsuranceTypeText(request.insurance_type)}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  Demandé le {format(new Date(request.created_at), 'dd MMMM yyyy', { locale: fr })}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(request.status)}>
                {getStatusText(request.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{request.email}</span>
                </div>
                {request.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{request.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{request.country}{request.city && `, ${request.city}`}</span>
                </div>
              </div>
              
              {request.quote_amount && (
                <div className="bg-afroGreen/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-afroGreen mb-1">Devis reçu</h4>
                  <p className="text-2xl font-bold text-afroBlack">
                    ${request.quote_amount}
                    <span className="text-sm font-normal text-gray-500">/an</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir les détails
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

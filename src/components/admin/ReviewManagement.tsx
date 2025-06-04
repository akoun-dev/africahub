
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Flag, CheckCircle, X, Eye } from 'lucide-react';

export const ReviewManagement: React.FC = () => {
  const [reviews] = useState([
    {
      id: '1',
      productName: 'Assurance Auto Premium',
      userName: 'Marie Kouassi',
      rating: 5,
      comment: 'Excellent service, très rapide pour les remboursements.',
      date: '2024-01-20',
      status: 'pending',
      flagged: false
    },
    {
      id: '2',
      productName: 'Forfait Internet 50MB',
      userName: 'Jean Traore',
      rating: 2,
      comment: 'Service client décevant, connexion instable.',
      date: '2024-01-19',
      status: 'flagged',
      flagged: true,
      flagReason: 'Langage inapproprié'
    },
    {
      id: '3',
      productName: 'Compte Épargne Plus',
      userName: 'Fatou Diallo',
      rating: 4,
      comment: 'Bon taux d\'intérêt, mais frais un peu élevés.',
      date: '2024-01-18',
      status: 'approved',
      flagged: false
    }
  ]);

  const approveReview = (reviewId: string) => {
    console.log('Approving review:', reviewId);
  };

  const rejectReview = (reviewId: string) => {
    console.log('Rejecting review:', reviewId);
  };

  const getStatusBadge = (status: string, flagged: boolean) => {
    if (flagged) {
      return <Badge variant="destructive">Signalé</Badge>;
    }
    
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'rejected':
        return <Badge variant="secondary">Rejeté</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const flaggedReviews = reviews.filter(r => r.flagged);
  const allReviews = reviews;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des avis utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                En attente ({pendingReviews.length})
              </TabsTrigger>
              <TabsTrigger value="flagged">
                Signalés ({flaggedReviews.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                Tous les avis ({allReviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{review.productName}</h3>
                        <p className="text-sm text-gray-600">Par {review.userName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(review.status, review.flagged)}
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 ml-2">{review.rating}/5</span>
                    </div>
                    
                    <p className="text-sm mb-4">{review.comment}</p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => approveReview(review.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => rejectReview(review.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir le produit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {pendingReviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun avis en attente de modération
                </div>
              )}
            </TabsContent>

            <TabsContent value="flagged" className="space-y-4">
              {flaggedReviews.map((review) => (
                <Card key={review.id} className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{review.productName}</h3>
                        <p className="text-sm text-gray-600">Par {review.userName}</p>
                        {review.flagReason && (
                          <div className="flex items-center gap-1 mt-1">
                            <Flag className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-600">{review.flagReason}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(review.status, review.flagged)}
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 ml-2">{review.rating}/5</span>
                    </div>
                    
                    <p className="text-sm mb-4">{review.comment}</p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => approveReview(review.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => rejectReview(review.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {flaggedReviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun avis signalé
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {allReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{review.productName}</h3>
                        <p className="text-sm text-gray-600">Par {review.userName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(review.status, review.flagged)}
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 ml-2">{review.rating}/5</span>
                    </div>
                    
                    <p className="text-sm">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

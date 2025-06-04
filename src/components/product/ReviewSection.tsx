
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductReviews, useProductReviewStats, useHasUserReviewedProduct } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewForm } from './ReviewForm';
import { ReviewCard } from './ReviewCard';
import { Review } from '@/types/core/Review';

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'most_helpful'>('newest');
  const [filterRating, setFilterRating] = useState<number | undefined>();

  const { data: reviews, isLoading: reviewsLoading } = useProductReviews(productId, {
    sortBy,
    filterRating
  });

  const { data: stats, isLoading: statsLoading } = useProductReviewStats(productId);
  const { data: hasReviewed } = useHasUserReviewedProduct(productId);

  const handleReviewSuccess = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const canWriteReview = user && !hasReviewed && !showForm;

  return (
    <div className="space-y-6">
      {/* Résumé des avis */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Avis clients</span>
              <Badge variant="secondary">{stats.total_reviews} avis</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Note moyenne */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stats.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(stats.average_rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Basé sur {stats.total_reviews} avis
                </p>
              </div>

              {/* Distribution des notes */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.rating_distribution[rating as keyof typeof stats.rating_distribution];
                  const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-3">{rating}</span>
                      <Star className="h-3 w-3 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bouton pour ajouter un avis */}
      {canWriteReview && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Avez-vous utilisé ce produit ? Partagez votre expérience !
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Écrire un avis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire d'avis */}
      {showForm && (
        <ReviewForm
          productId={productId}
          onSuccess={handleReviewSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingReview(null);
          }}
        />
      )}

      {/* Filtres et tri */}
      {stats && stats.total_reviews > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={sortBy} onValueChange={setSortBy as any}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récents</SelectItem>
                    <SelectItem value="oldest">Plus anciens</SelectItem>
                    <SelectItem value="rating_high">Meilleures notes</SelectItem>
                    <SelectItem value="rating_low">Notes les plus basses</SelectItem>
                    <SelectItem value="most_helpful">Plus utiles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select 
                  value={filterRating?.toString() || 'all'} 
                  onValueChange={(value) => setFilterRating(value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les notes</SelectItem>
                    <SelectItem value="5">5 étoiles</SelectItem>
                    <SelectItem value="4">4 étoiles</SelectItem>
                    <SelectItem value="3">3 étoiles</SelectItem>
                    <SelectItem value="2">2 étoiles</SelectItem>
                    <SelectItem value="1">1 étoile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des avis */}
      {reviewsLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-16 bg-gray-200 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditReview}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              Aucun avis pour ce produit pour le moment.
              {canWriteReview && ' Soyez le premier à laisser un avis !'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

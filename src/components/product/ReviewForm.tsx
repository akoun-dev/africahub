
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useCreateReview, useUpdateReview } from '@/hooks/useReviews';
import { CreateReviewData, Review } from '@/types/core/Review';
import { PhotoUploader } from './PhotoUploader';

interface ReviewFormProps {
  productId: string;
  editingReview?: Review | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  editingReview,
  onSuccess,
  onCancel
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();

  // Initialiser le formulaire avec les données d'édition
  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setTitle(editingReview.title);
      setComment(editingReview.comment || '');
      setPhotos(editingReview.photos || []);
    }
  }, [editingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !title.trim()) {
      return;
    }

    const reviewData: CreateReviewData = {
      product_id: productId,
      rating,
      title: title.trim(),
      comment: comment.trim() || undefined,
      photos
    };

    try {
      if (editingReview) {
        // Mise à jour d'un avis existant
        await updateReviewMutation.mutateAsync({
          reviewId: editingReview.id,
          updates: reviewData
        });
      } else {
        // Création d'un nouvel avis
        await createReviewMutation.mutateAsync(reviewData);
      }
      
      // Reset form (seulement pour la création)
      if (!editingReview) {
        setRating(0);
        setTitle('');
        setComment('');
        setPhotos([]);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const isSubmitting = createReviewMutation.isPending || updateReviewMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingReview ? 'Modifier l\'avis' : 'Laisser un avis'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Votre note *
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-colors p-1"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="review-title" className="text-sm font-medium mb-2 block">
              Titre de votre avis *
            </Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Résumez votre expérience en quelques mots"
              required
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100 caractères
            </p>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="review-comment" className="text-sm font-medium mb-2 block">
              Votre commentaire
            </Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience détaillée avec ce produit..."
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/1000 caractères
            </p>
          </div>

          {/* Photo Upload */}
          <PhotoUploader
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={3}
            maxSizeKB={5120}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!rating || !title.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting 
                ? (editingReview ? 'Mise à jour...' : 'Publication...') 
                : (editingReview ? 'Mettre à jour' : 'Publier l\'avis')
              }
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

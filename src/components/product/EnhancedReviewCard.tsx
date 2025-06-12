import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Star,
    ThumbsUp,
    ThumbsDown,
    Flag,
    MoreHorizontal,
    Edit,
    Trash,
    Maximize2,
    Shield,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    useVoteOnReview,
    useReportReview,
    useDeleteReview,
} from "@/hooks/useReviews"
import { useAuth } from "@/contexts/AuthContext"
import { Review } from "@/types/core/Review"
import { AdvancedPhotoGallery } from "./AdvancedPhotoGallery"
import { toast } from "sonner"

interface EnhancedReviewCardProps {
    review: Review
    onEdit?: (review: Review) => void
}

export const EnhancedReviewCard: React.FC<EnhancedReviewCardProps> = ({
    review,
    onEdit,
}) => {
    const { user } = useAuth()
    const [showGallery, setShowGallery] = useState(false)
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

    const voteOnReviewMutation = useVoteOnReview()
    const reportReviewMutation = useReportReview()
    const deleteReviewMutation = useDeleteReview()

    const isOwnReview = user?.id === review.user_id

    const handleVote = async (voteType: "helpful" | "unhelpful") => {
        if (!user) {
            toast.error("Vous devez être connecté pour voter")
            return
        }

        try {
            await voteOnReviewMutation.mutateAsync({
                reviewId: review.id,
                voteType,
            })
        } catch (error) {
            console.error("Error voting:", error)
        }
    }

    const handleReport = async () => {
        if (!user) {
            toast.error("Vous devez être connecté pour signaler")
            return
        }

        try {
            await reportReviewMutation.mutateAsync({
                reviewId: review.id,
                reason: "inappropriate",
                description: "Signalement depuis l'interface utilisateur",
            })
        } catch (error) {
            console.error("Error reporting:", error)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
            return
        }

        try {
            await deleteReviewMutation.mutateAsync(review.id)
        } catch (error) {
            console.error("Error deleting review:", error)
        }
    }

    const handlePhotoClick = (index: number) => {
        setSelectedPhotoIndex(index)
        setShowGallery(true)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    return (
        <>
            <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="ring-2 ring-gray-100">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {user?.email?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        Utilisateur vérifié
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < review.rating
                                                            ? "text-yellow-400 fill-current"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {formatDate(review.created_at)}
                                        </span>
                                        {review.is_verified_purchase && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs bg-green-100 text-green-800"
                                            >
                                                <Shield className="h-3 w-3 mr-1" />
                                                Achat vérifié
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {isOwnReview && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => onEdit?.(review)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={handleDelete}
                                                className="text-red-600"
                                            >
                                                <Trash className="h-4 w-4 mr-2" />
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>

                            <h5 className="font-semibold mb-2 text-gray-900">
                                {review.title}
                            </h5>

                            {review.comment && (
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    {review.comment}
                                </p>
                            )}

                            {/* Photos avec galerie améliorée */}
                            {review.photos && review.photos.length > 0 && (
                                <div className="mb-4">
                                    <div className="grid grid-cols-3 gap-2 max-w-md">
                                        {review.photos
                                            .slice(0, 3)
                                            .map((photo, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group"
                                                >
                                                    <button
                                                        onClick={() =>
                                                            handlePhotoClick(
                                                                index
                                                            )
                                                        }
                                                        className="relative w-full h-20 rounded-lg overflow-hidden border hover:shadow-md transition-all"
                                                    >
                                                        <img
                                                            src={photo}
                                                            alt={`Photo ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                                            <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </button>
                                                    {index === 2 &&
                                                        review.photos.length >
                                                            3 && (
                                                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                                                                +
                                                                {review.photos
                                                                    .length - 3}
                                                            </div>
                                                        )}
                                                </div>
                                            ))}
                                    </div>
                                    {review.photos.length > 3 && (
                                        <button
                                            onClick={() => handlePhotoClick(0)}
                                            className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                                        >
                                            Voir toutes les photos (
                                            {review.photos.length})
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-6 text-sm border-t pt-4">
                                <button
                                    onClick={() => handleVote("helpful")}
                                    disabled={
                                        !user || voteOnReviewMutation.isPending
                                    }
                                    className="flex items-center gap-1 text-gray-600 hover:text-green-600 disabled:opacity-50 transition-colors"
                                >
                                    <ThumbsUp className="h-4 w-4" />
                                    Utile ({review.helpful_count})
                                </button>

                                <button
                                    onClick={() => handleVote("unhelpful")}
                                    disabled={
                                        !user || voteOnReviewMutation.isPending
                                    }
                                    className="flex items-center gap-1 text-gray-600 hover:text-red-600 disabled:opacity-50 transition-colors"
                                >
                                    <ThumbsDown className="h-4 w-4" />
                                    Pas utile ({review.unhelpful_count})
                                </button>

                                {!isOwnReview && (
                                    <button
                                        onClick={handleReport}
                                        disabled={
                                            !user ||
                                            reportReviewMutation.isPending
                                        }
                                        className="flex items-center gap-1 text-gray-600 hover:text-orange-600 disabled:opacity-50 transition-colors"
                                    >
                                        <Flag className="h-4 w-4" />
                                        Signaler
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Galerie photo avancée */}
            {review.photos && review.photos.length > 0 && (
                <AdvancedPhotoGallery
                    photos={review.photos}
                    initialIndex={selectedPhotoIndex}
                    open={showGallery}
                    onClose={() => setShowGallery(false)}
                />
            )}
        </>
    )
}

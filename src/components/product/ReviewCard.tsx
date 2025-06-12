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
    X,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
    useVoteOnReview,
    useReportReview,
    useDeleteReview,
} from "@/hooks/useReviews"
import { useAuth } from "@/contexts/AuthContext"
import { Review } from "@/types/core/Review"
import { toast } from "sonner"

interface ReviewCardProps {
    review: Review
    onEdit?: (review: Review) => void
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit }) => {
    const { user } = useAuth()
    const [showReportDialog, setShowReportDialog] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

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
            setShowReportDialog(false)
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

    return (
        <>
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="font-medium">Utilisateur</h4>
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
                                            {new Date(
                                                review.created_at
                                            ).toLocaleDateString("fr-FR")}
                                        </span>
                                        {review.is_verified_purchase && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
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

                            <h5 className="font-semibold mb-2">
                                {review.title}
                            </h5>

                            {review.comment && (
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    {review.comment}
                                </p>
                            )}

                            {/* Photos */}
                            {review.photos && review.photos.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {review.photos.map((photo, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setSelectedPhoto(photo)
                                                }
                                                className="relative group cursor-pointer"
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Photo ${index + 1}`}
                                                    className="w-20 h-20 rounded-lg object-cover border hover:brightness-75 transition-all"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                                    <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 text-sm">
                                <button
                                    onClick={() => handleVote("helpful")}
                                    disabled={
                                        !user || voteOnReviewMutation.isPending
                                    }
                                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                >
                                    <ThumbsUp className="h-4 w-4" />
                                    Utile ({review.helpful_count})
                                </button>

                                <button
                                    onClick={() => handleVote("unhelpful")}
                                    disabled={
                                        !user || voteOnReviewMutation.isPending
                                    }
                                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
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
                                        className="flex items-center gap-1 text-gray-600 hover:text-red-600 disabled:opacity-50"
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

            {/* Modal pour agrandir les photos */}
            <Dialog
                open={!!selectedPhoto}
                onOpenChange={() => setSelectedPhoto(null)}
            >
                <DialogContent className="max-w-4xl p-0">
                    <DialogTitle className="sr-only">
                        Photo de l'avis
                    </DialogTitle>
                    {selectedPhoto && (
                        <div className="relative">
                            <img
                                src={selectedPhoto}
                                alt="Photo agrandie"
                                className="w-full h-auto max-h-[80vh] object-contain"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                                onClick={() => setSelectedPhoto(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

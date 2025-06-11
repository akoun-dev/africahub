import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Plus, Filter, SortAsc } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    useProductReviews,
    useProductReviewStats,
    useHasUserReviewedProduct,
} from "@/hooks/useReviews"
import { useAuth } from "@/contexts/AuthContext"
import { ReviewForm } from "./ReviewForm"
import { EnhancedReviewCard } from "./EnhancedReviewCard"
import { OptimizedPhotoUploader } from "./OptimizedPhotoUploader"
import { Review } from "@/types/core/Review"

interface EnhancedReviewSectionProps {
    productId: string
}

export const EnhancedReviewSection: React.FC<EnhancedReviewSectionProps> = ({
    productId,
}) => {
    const { user } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [editingReview, setEditingReview] = useState<Review | null>(null)
    const [sortBy, setSortBy] = useState<
        "newest" | "oldest" | "rating_high" | "rating_low" | "most_helpful"
    >("newest")
    const [filterRating, setFilterRating] = useState<number | undefined>()
    const [activeTab, setActiveTab] = useState("all")

    const { data: reviews, isLoading: reviewsLoading } = useProductReviews(
        productId,
        {
            sortBy,
            filterRating,
        }
    )

    const { data: stats, isLoading: statsLoading } =
        useProductReviewStats(productId)
    const { data: hasReviewed } = useHasUserReviewedProduct(productId)

    const handleReviewSuccess = () => {
        setShowForm(false)
        setEditingReview(null)
    }

    const handleEditReview = (review: Review) => {
        setEditingReview(review)
        setShowForm(true)
    }

    const filteredReviews = React.useMemo(() => {
        if (!reviews) return []

        switch (activeTab) {
            case "with-photos":
                return reviews.filter(
                    review => review.photos && review.photos.length > 0
                )
            case "verified":
                return reviews.filter(review => review.is_verified_purchase)
            case "recent":
                return reviews.filter(review => {
                    const daysSinceCreation =
                        (Date.now() - new Date(review.created_at).getTime()) /
                        (1000 * 60 * 60 * 24)
                    return daysSinceCreation <= 30
                })
            default:
                return reviews
        }
    }, [reviews, activeTab])

    if (statsLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
                    <div className="h-32 bg-gray-200 rounded" />
                </div>
            </div>
        )
    }

    const canWriteReview = user && !hasReviewed && !showForm

    return (
        <div className="space-y-6">
            {/* Résumé des avis amélioré */}
            {stats && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                Avis clients
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800"
                                >
                                    {stats.total_reviews} avis
                                </Badge>
                            </span>
                            {stats.total_reviews > 0 && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span className="font-medium">
                                        {stats.average_rating.toFixed(1)}/5
                                    </span>
                                </div>
                            )}
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
                                                i <
                                                Math.round(stats.average_rating)
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
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
                                {[5, 4, 3, 2, 1].map(rating => {
                                    const count =
                                        stats.rating_distribution[
                                            rating as keyof typeof stats.rating_distribution
                                        ]
                                    const percentage =
                                        stats.total_reviews > 0
                                            ? (count / stats.total_reviews) *
                                              100
                                            : 0

                                    return (
                                        <div
                                            key={rating}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <button
                                                onClick={() =>
                                                    setFilterRating(
                                                        filterRating === rating
                                                            ? undefined
                                                            : rating
                                                    )
                                                }
                                                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                                                    filterRating === rating
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "hover:bg-gray-100"
                                                }`}
                                            >
                                                <span className="w-3">
                                                    {rating}
                                                </span>
                                                <Star className="h-3 w-3 text-yellow-400" />
                                            </button>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="w-8 text-gray-600">
                                                {count}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bouton pour ajouter un avis */}
            {canWriteReview && (
                <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <div className="mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Star className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Partagez votre expérience
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Avez-vous utilisé ce produit ? Aidez les
                                    autres utilisateurs avec votre avis détaillé
                                    !
                                </p>
                            </div>
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
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
                    editingReview={editingReview}
                    onSuccess={handleReviewSuccess}
                    onCancel={() => {
                        setShowForm(false)
                        setEditingReview(null)
                    }}
                />
            )}

            {/* Onglets et filtres */}
            {stats && stats.total_reviews > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="space-y-4"
                        >
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4">
                                    <TabsTrigger value="all">
                                        Tous ({reviews?.length || 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="with-photos">
                                        Avec photos (
                                        {reviews?.filter(r => r.photos?.length)
                                            .length || 0}
                                        )
                                    </TabsTrigger>
                                    <TabsTrigger value="verified">
                                        Vérifiés (
                                        {reviews?.filter(
                                            r => r.is_verified_purchase
                                        ).length || 0}
                                        )
                                    </TabsTrigger>
                                    <TabsTrigger value="recent">
                                        Récents
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex gap-2 w-full lg:w-auto">
                                    <Select
                                        value={sortBy}
                                        onValueChange={setSortBy as any}
                                    >
                                        <SelectTrigger className="w-full lg:w-48">
                                            <SortAsc className="h-4 w-4 mr-2" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">
                                                Plus récents
                                            </SelectItem>
                                            <SelectItem value="oldest">
                                                Plus anciens
                                            </SelectItem>
                                            <SelectItem value="rating_high">
                                                Meilleures notes
                                            </SelectItem>
                                            <SelectItem value="rating_low">
                                                Notes les plus basses
                                            </SelectItem>
                                            <SelectItem value="most_helpful">
                                                Plus utiles
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {filterRating && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setFilterRating(undefined)
                                            }
                                            className="whitespace-nowrap"
                                        >
                                            <Filter className="h-4 w-4 mr-1" />
                                            {filterRating} étoiles ✕
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <TabsContent
                                value={activeTab}
                                className="space-y-4"
                            >
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map(review => (
                                        <EnhancedReviewCard
                                            key={review.id}
                                            review={review}
                                            onEdit={handleEditReview}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Star className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Aucun avis dans cette catégorie
                                        </h3>
                                        <p className="text-gray-600">
                                            {activeTab === "with-photos" &&
                                                "Aucun avis avec photos pour le moment."}
                                            {activeTab === "verified" &&
                                                "Aucun avis d'achat vérifié pour le moment."}
                                            {activeTab === "recent" &&
                                                "Aucun avis récent pour le moment."}
                                            {activeTab === "all" &&
                                                "Aucun avis pour le moment."}
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Star,
    Edit,
    Trash,
    ThumbsUp,
    Eye,
    TrendingUp,
    MessageSquare,
    Calendar,
} from "lucide-react"
import {
    useUserReviews,
    useDeleteReview,
    useUpdateReview,
} from "@/hooks/useReviews"
import { useAuth } from "@/contexts/AuthContext"
import { ReviewForm } from "@/components/product/ReviewForm"
import { Review } from "@/types/core/Review"
import { toast } from "sonner"

export const MyReviews: React.FC = () => {
    const { user } = useAuth()
    const { data: userReviews, isLoading } = useUserReviews()
    const deleteReviewMutation = useDeleteReview()
    const [editingReview, setEditingReview] = useState<Review | null>(null)

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-600">
                            Vous devez être connecté pour voir vos avis.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
            return
        }

        try {
            await deleteReviewMutation.mutateAsync(reviewId)
            toast.success("Avis supprimé avec succès")
        } catch (error) {
            console.error("Error deleting review:", error)
            toast.error("Erreur lors de la suppression")
        }
    }

    const handleEditReview = (review: Review) => {
        setEditingReview(review)
    }

    const handleEditSuccess = () => {
        setEditingReview(null)
        toast.success("Avis mis à jour avec succès")
    }

    const calculateStats = () => {
        if (!userReviews || userReviews.length === 0) {
            return {
                totalReviews: 0,
                averageRating: 0,
                totalHelpfulVotes: 0,
                totalViews: 0,
            }
        }

        const totalReviews = userReviews.length
        const averageRating =
            userReviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
        const totalHelpfulVotes = userReviews.reduce(
            (sum, review) => sum + (review.helpful_count || 0),
            0
        )
        const totalViews = userReviews.length * 50 // Estimation

        return {
            totalReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            totalHelpfulVotes,
            totalViews,
        }
    }

    const stats = calculateStats()

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded" />
                        ))}
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Mes Avis
                </h1>
                <p className="text-gray-600">
                    Gérez vos avis et consultez vos statistiques
                </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.totalReviews}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Avis publiés
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.averageRating}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Note moyenne
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <ThumbsUp className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.totalHelpfulVotes}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Votes utiles
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.totalViews}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Vues estimées
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Formulaire d'édition */}
            {editingReview && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Modifier l'avis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReviewForm
                            productId={editingReview.product_id}
                            editingReview={editingReview}
                            onSuccess={handleEditSuccess}
                            onCancel={() => setEditingReview(null)}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Liste des avis */}
            <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all">
                        Tous mes avis ({userReviews?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="recent">Récents</TabsTrigger>
                    <TabsTrigger value="popular">Les plus utiles</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {userReviews && userReviews.length > 0 ? (
                        userReviews.map(review => {
                            // Type assertion pour s'assurer que le status est du bon type
                            const typedReview: Review = {
                                ...review,
                                status:
                                    (review.status as
                                        | "active"
                                        | "pending"
                                        | "hidden"
                                        | "deleted") || "active",
                            }

                            return (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-4">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {user.email
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium">
                                                            {review.products
                                                                ?.name ||
                                                                "Produit"}
                                                        </h4>
                                                        {review.products
                                                            ?.companies && (
                                                            <Badge variant="outline">
                                                                {
                                                                    review
                                                                        .products
                                                                        .companies
                                                                        .name
                                                                }
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex">
                                                            {[...Array(5)].map(
                                                                (_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${
                                                                            i <
                                                                            review.rating
                                                                                ? "text-yellow-400 fill-current"
                                                                                : "text-gray-300"
                                                                        }`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            {new Date(
                                                                review.created_at
                                                            ).toLocaleDateString(
                                                                "fr-FR"
                                                            )}
                                                        </span>
                                                    </div>

                                                    <h5 className="font-semibold mb-2">
                                                        {review.title}
                                                    </h5>
                                                    {review.comment && (
                                                        <p className="text-gray-700 mb-3">
                                                            {review.comment}
                                                        </p>
                                                    )}

                                                    {/* Photos */}
                                                    {review.photos &&
                                                        review.photos.length >
                                                            0 && (
                                                            <div className="flex gap-2 mb-3">
                                                                {review.photos.map(
                                                                    (
                                                                        photo,
                                                                        index
                                                                    ) => (
                                                                        <img
                                                                            key={
                                                                                index
                                                                            }
                                                                            src={
                                                                                photo
                                                                            }
                                                                            alt={`Photo ${
                                                                                index +
                                                                                1
                                                                            }`}
                                                                            className="w-16 h-16 rounded-lg object-cover border"
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        )}

                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <ThumbsUp className="h-4 w-4" />
                                                            {
                                                                review.helpful_count
                                                            }{" "}
                                                            utiles
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(
                                                                review.created_at
                                                            ).toLocaleDateString(
                                                                "fr-FR"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditReview(
                                                            typedReview
                                                        )
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteReview(
                                                            review.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <Card>
                            <CardContent className="p-6 text-center">
                                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Aucun avis pour le moment
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Vous n'avez pas encore publié d'avis.
                                    Commencez par noter et commenter vos
                                    produits préférés !
                                </p>
                                <Button>Découvrir des produits</Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="recent" className="space-y-4">
                    {userReviews
                        ?.sort(
                            (a, b) =>
                                new Date(b.created_at).getTime() -
                                new Date(a.created_at).getTime()
                        )
                        .slice(0, 5)
                        .map(review => (
                            <Card key={review.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">
                                                {review.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {review.products?.name} •{" "}
                                                {new Date(
                                                    review.created_at
                                                ).toLocaleDateString("fr-FR")}
                                            </p>
                                        </div>
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
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </TabsContent>

                <TabsContent value="popular" className="space-y-4">
                    {userReviews
                        ?.sort(
                            (a, b) =>
                                (b.helpful_count || 0) - (a.helpful_count || 0)
                        )
                        .slice(0, 5)
                        .map(review => (
                            <Card key={review.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">
                                                {review.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {review.products?.name} •{" "}
                                                {review.helpful_count} votes
                                                utiles
                                            </p>
                                        </div>
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
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Ajouter l'export par défaut
export default MyReviews

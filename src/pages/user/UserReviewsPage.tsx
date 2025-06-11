/**
 * Page des avis utilisateur
 * Permet à l'utilisateur de voir et gérer ses avis
 */

import React, { useState } from "react"
import {
    Star,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    Edit,
    Trash2,
    Plus,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"

interface UserReview {
    id: string
    product_name: string
    product_brand: string
    rating: number
    title: string
    content: string
    created_at: string
    updated_at: string
    status: "published" | "pending" | "rejected"
    likes: number
    dislikes: number
    helpful_count: number
}

export const UserReviewsPage: React.FC = () => {
    const { user } = useAuth()
    const [reviews] = useState<UserReview[]>([
        // Données de démonstration
        {
            id: "1",
            product_name: "Assurance Auto Premium",
            product_brand: "NSIA Assurances",
            rating: 4,
            title: "Très bon service client",
            content:
                "J'ai été très satisfait du service client. La prise en charge a été rapide et efficace. Je recommande cette assurance.",
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z",
            status: "published",
            likes: 12,
            dislikes: 2,
            helpful_count: 8,
        },
        {
            id: "2",
            product_name: "Crédit Immobilier",
            product_brand: "Ecobank",
            rating: 5,
            title: "Excellent taux et accompagnement",
            content:
                "Processus de demande simple et taux très compétitif. L'équipe m'a accompagné tout au long du processus.",
            created_at: "2024-01-10T14:20:00Z",
            updated_at: "2024-01-10T14:20:00Z",
            status: "published",
            likes: 25,
            dislikes: 1,
            helpful_count: 18,
        },
        {
            id: "3",
            product_name: "Assurance Vie",
            product_brand: "Allianz",
            rating: 3,
            title: "Correct mais peut mieux faire",
            content:
                "Le produit est correct mais les frais sont un peu élevés. Le service client pourrait être amélioré.",
            created_at: "2024-01-05T09:15:00Z",
            updated_at: "2024-01-05T09:15:00Z",
            status: "pending",
            likes: 5,
            dislikes: 3,
            helpful_count: 2,
        },
    ])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge variant="default">Publié</Badge>
            case "pending":
                return <Badge variant="secondary">En attente</Badge>
            case "rejected":
                return <Badge variant="destructive">Rejeté</Badge>
            default:
                return <Badge variant="outline">Inconnu</Badge>
        }
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ))
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const publishedReviews = reviews.filter(r => r.status === "published")
    const pendingReviews = reviews.filter(r => r.status === "pending")
    const rejectedReviews = reviews.filter(r => r.status === "rejected")

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="py-16 text-center">
                        <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            Connexion requise
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Connectez-vous pour voir vos avis
                        </p>
                        <Button asChild>
                            <Link to="/auth">Se connecter</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <UserLayout>
            <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 via-white to-brandSky/5">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* En-tête avec gradient bleu */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-500 p-8 text-white">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                    <div>
                                        <h1 className="text-3xl font-bold">
                                            Mes Avis
                                        </h1>
                                        <p className="text-marineBlue-100 mt-2">
                                            Gérez vos avis et commentaires sur
                                            les produits
                                        </p>
                                    </div>
                                    <Button
                                        asChild
                                        className="bg-white text-marineBlue-600 hover:bg-marineBlue-50"
                                    >
                                        <Link to="/produits">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Écrire un avis
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            {/* Motif décoratif */}
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
                            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-brandSky/20 rounded-full"></div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-marineBlue-200 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-marineBlue-600">
                                        {reviews.length}
                                    </div>
                                    <div className="text-sm text-marineBlue-600">
                                        Total avis
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-marineBlue-200 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {publishedReviews.length}
                                    </div>
                                    <div className="text-sm text-marineBlue-600">
                                        Publiés
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-marineBlue-200 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {pendingReviews.length}
                                    </div>
                                    <div className="text-sm text-marineBlue-600">
                                        En attente
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-marineBlue-200 shadow-lg">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {reviews.reduce(
                                            (sum, r) => sum + r.helpful_count,
                                            0
                                        )}
                                    </div>
                                    <div className="text-sm text-marineBlue-600">
                                        Votes utiles
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Liste des avis */}
                        <Tabs defaultValue="all" className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-marineBlue-100 p-2">
                                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 bg-marineBlue-50">
                                    <TabsTrigger
                                        value="all"
                                        className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                    >
                                        Tous ({reviews.length})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="published"
                                        className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                    >
                                        Publiés ({publishedReviews.length})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="pending"
                                        className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                    >
                                        En attente ({pendingReviews.length})
                                    </TabsTrigger>
                                    {rejectedReviews.length > 0 && (
                                        <TabsTrigger
                                            value="rejected"
                                            className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                        >
                                            Rejetés ({rejectedReviews.length})
                                        </TabsTrigger>
                                    )}
                                </TabsList>
                            </div>

                            <TabsContent value="all">
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                        />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="published">
                                <div className="space-y-4">
                                    {publishedReviews.map(review => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                        />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="pending">
                                <div className="space-y-4">
                                    {pendingReviews.map(review => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                        />
                                    ))}
                                </div>
                            </TabsContent>

                            {rejectedReviews.length > 0 && (
                                <TabsContent value="rejected">
                                    <div className="space-y-4">
                                        {rejectedReviews.map(review => (
                                            <ReviewCard
                                                key={review.id}
                                                review={review}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

interface ReviewCardProps {
    review: UserReview
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge variant="default">Publié</Badge>
            case "pending":
                return <Badge variant="secondary">En attente</Badge>
            case "rejected":
                return <Badge variant="destructive">Rejeté</Badge>
            default:
                return <Badge variant="outline">Inconnu</Badge>
        }
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ))
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <Card className="border-marineBlue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-marineBlue-50 to-brandSky/10">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-marineBlue-700">
                                {review.product_name}
                            </h3>
                            {getStatusBadge(review.status)}
                        </div>
                        <p className="text-sm text-marineBlue-600">
                            {review.product_brand}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex">
                                {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-marineBlue-600">
                                {formatDate(review.created_at)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-marineBlue-600 hover:bg-marineBlue-50"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-4">{review.content}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{review.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ThumbsDown className="h-4 w-4" />
                            <span>{review.dislikes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{review.helpful_count} votes utiles</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserReviewsPage

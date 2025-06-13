/**
 * Page de gestion des avis clients pour les marchands - Version moderne
 * Permet de consulter, répondre et gérer les avis sur les produits
 */

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    MessageSquare,
    Star,
    Search,
    Filter,
    MoreVertical,
    Reply,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    User,
    Package,
    Calendar,
    ThumbsUp,
    Flag,
} from "lucide-react"

import useMerchantReviews from "@/hooks/useMerchantReviews"
import { toast } from "sonner"

export const MerchantReviewsPage: React.FC = () => {
    const {
        reviews,
        stats,
        isLoading,
        respondToReview,
        updateReviewStatus,
        deleteResponse,
        filterReviews,
        getReviewsNeedingResponse,
        isResponding,
        isUpdatingStatus,
        isDeletingResponse,
    } = useMerchantReviews()

    const [searchTerm, setSearchTerm] = useState("")
    const [ratingFilter, setRatingFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [hasResponseFilter, setHasResponseFilter] = useState<string>("all")
    const [responseText, setResponseText] = useState("")
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(
        null
    )
    const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)

    // Filtrer les avis
    const filteredReviews = React.useMemo(() => {
        if (!reviews) return []

        return filterReviews({
            search: searchTerm,
            rating: ratingFilter === "all" ? undefined : parseInt(ratingFilter),
            status: statusFilter === "all" ? undefined : (statusFilter as any),
            has_response:
                hasResponseFilter === "all"
                    ? undefined
                    : hasResponseFilter === "yes",
        })
    }, [
        reviews,
        searchTerm,
        ratingFilter,
        statusFilter,
        hasResponseFilter,
        filterReviews,
    ])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approuvé
                    </Badge>
                )
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        En attente
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejeté
                    </Badge>
                )
            case "flagged":
                return (
                    <Badge className="bg-orange-100 text-orange-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Signalé
                    </Badge>
                )
            default:
                return null
        }
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ))
    }

    const handleOpenResponseDialog = (
        reviewId: string,
        existingResponse?: string
    ) => {
        setSelectedReviewId(reviewId)
        setResponseText(existingResponse || "")
        setIsResponseDialogOpen(true)
    }

    const handleSubmitResponse = async () => {
        if (!selectedReviewId || !responseText.trim()) return

        try {
            await respondToReview(selectedReviewId, responseText.trim())
            setIsResponseDialogOpen(false)
            setSelectedReviewId(null)
            setResponseText("")
        } catch (error) {
            console.error("Erreur lors de la réponse:", error)
        }
    }

    const handleStatusChange = async (
        reviewId: string,
        newStatus: "pending" | "approved" | "rejected" | "flagged"
    ) => {
        try {
            await updateReviewStatus(reviewId, newStatus)
        } catch (error) {
            console.error("Erreur lors du changement de statut:", error)
        }
    }

    const handleDeleteResponse = async (reviewId: string) => {
        if (
            window.confirm("Êtes-vous sûr de vouloir supprimer cette réponse ?")
        ) {
            try {
                await deleteResponse(reviewId)
            } catch (error) {
                console.error("Erreur lors de la suppression:", error)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-emerald-600 animate-pulse" />
                        </div>
                        <p className="text-gray-600 text-lg">
                            Chargement des avis...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="p-6 space-y-6">
                {/* En-tête avec design moderne */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Motifs décoratifs */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-emerald-400/20 rounded-full"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    Avis Clients
                                </h1>
                                <p className="text-emerald-100 text-lg">
                                    Gérez les avis et commentaires sur vos
                                    produits
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistiques rapides avec design moderne */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="text-2xl font-bold text-emerald-600 mb-1">
                                    {stats.total}
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    Total
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                    {stats.approved}
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    Approuvés
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="text-2xl font-bold text-yellow-600 mb-1">
                                    {stats.pending}
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    En attente
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Reply className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {stats.withResponse}
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    Avec réponse
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="text-2xl font-bold text-orange-600 mb-1">
                                    {stats.needingResponse}
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    À répondre
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="text-2xl font-bold text-yellow-600 mb-1">
                                    {stats.averageRating.toFixed(1)}
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    Note moyenne
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filtres et recherche avec design moderne */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Rechercher dans les avis..."
                                        value={searchTerm}
                                        onChange={e =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10 border-emerald-200 focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <Select
                                value={ratingFilter}
                                onValueChange={setRatingFilter}
                            >
                                <SelectTrigger className="w-full lg:w-48 border-emerald-200">
                                    <SelectValue placeholder="Note" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Toutes les notes
                                    </SelectItem>
                                    <SelectItem value="5">5 étoiles</SelectItem>
                                    <SelectItem value="4">4 étoiles</SelectItem>
                                    <SelectItem value="3">3 étoiles</SelectItem>
                                    <SelectItem value="2">2 étoiles</SelectItem>
                                    <SelectItem value="1">1 étoile</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full lg:w-48 border-emerald-200">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tous les statuts
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Approuvé
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        En attente
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejeté
                                    </SelectItem>
                                    <SelectItem value="flagged">
                                        Signalé
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={hasResponseFilter}
                                onValueChange={setHasResponseFilter}
                            >
                                <SelectTrigger className="w-full lg:w-48 border-emerald-200">
                                    <SelectValue placeholder="Réponse" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="yes">
                                        Avec réponse
                                    </SelectItem>
                                    <SelectItem value="no">
                                        Sans réponse
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des avis avec design moderne */}
                <div className="space-y-6">
                    {filteredReviews.length === 0 ? (
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-12">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageSquare className="w-12 h-12 text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Aucun avis trouvé
                                    </h3>
                                    <p className="text-gray-600 text-lg">
                                        {searchTerm ||
                                        ratingFilter !== "all" ||
                                        statusFilter !== "all" ||
                                        hasResponseFilter !== "all"
                                            ? "Aucun avis ne correspond à vos critères de recherche."
                                            : "Vous n'avez pas encore reçu d'avis sur vos produits."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredReviews.map(review => (
                            <Card
                                key={review.id}
                                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                            >
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {/* En-tête de l'avis */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-semibold text-gray-900">
                                                            {
                                                                review.user
                                                                    ?.first_name
                                                            }{" "}
                                                            {
                                                                review.user
                                                                    ?.last_name
                                                            }
                                                        </span>
                                                        {review.is_verified_purchase && (
                                                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Achat vérifié
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="flex items-center space-x-1">
                                                            {renderStars(
                                                                review.rating
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(
                                                                review.created_at
                                                            ).toLocaleDateString(
                                                                "fr-FR"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                                                        <Package className="w-4 h-4" />
                                                        <span className="font-medium">
                                                            {
                                                                review.product
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusBadge(review.status)}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="hover:bg-emerald-50"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleOpenResponseDialog(
                                                                    review.id,
                                                                    review.merchant_response
                                                                )
                                                            }
                                                        >
                                                            <Reply className="w-4 h-4 mr-2" />
                                                            {review.merchant_response
                                                                ? "Modifier la réponse"
                                                                : "Répondre"}
                                                        </DropdownMenuItem>
                                                        {review.merchant_response && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDeleteResponse(
                                                                        review.id
                                                                    )
                                                                }
                                                                className="text-red-600"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Supprimer la
                                                                réponse
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    review.id,
                                                                    "approved"
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Approuver
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    review.id,
                                                                    "rejected"
                                                                )
                                                            }
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Rejeter
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    review.id,
                                                                    "flagged"
                                                                )
                                                            }
                                                        >
                                                            <Flag className="w-4 h-4 mr-2" />
                                                            Signaler
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        {/* Contenu de l'avis */}
                                        <div className="ml-16">
                                            {review.title && (
                                                <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                                                    {review.title}
                                                </h4>
                                            )}
                                            <p className="text-gray-700 mb-4 leading-relaxed">
                                                {review.comment}
                                            </p>

                                            {/* Réponse du marchand */}
                                            {review.merchant_response && (
                                                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">
                                                                M
                                                            </span>
                                                        </div>
                                                        <span className="font-semibold text-emerald-900">
                                                            Réponse du marchand
                                                        </span>
                                                        <span className="text-sm text-emerald-600">
                                                            {review.merchant_response_date &&
                                                                new Date(
                                                                    review.merchant_response_date
                                                                ).toLocaleDateString(
                                                                    "fr-FR"
                                                                )}
                                                        </span>
                                                    </div>
                                                    <p className="text-emerald-800 leading-relaxed">
                                                        {
                                                            review.merchant_response
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* Actions rapides */}
                                            {!review.merchant_response && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleOpenResponseDialog(
                                                            review.id
                                                        )
                                                    }
                                                    className="mt-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                                >
                                                    <Reply className="w-4 h-4 mr-2" />
                                                    Répondre à cet avis
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Dialog de réponse avec design moderne */}
                <Dialog
                    open={isResponseDialogOpen}
                    onOpenChange={setIsResponseDialogOpen}
                >
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                            <DialogTitle className="text-emerald-800">
                                {selectedReviewId &&
                                reviews?.find(r => r.id === selectedReviewId)
                                    ?.merchant_response
                                    ? "Modifier votre réponse"
                                    : "Répondre à l'avis"}
                            </DialogTitle>
                            <DialogDescription>
                                Votre réponse sera visible publiquement sous
                                l'avis du client.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Écrivez votre réponse..."
                                value={responseText}
                                onChange={e => setResponseText(e.target.value)}
                                className="min-h-[120px] border-emerald-200 focus:border-emerald-500"
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsResponseDialogOpen(false)}
                                disabled={isResponding}
                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleSubmitResponse}
                                disabled={isResponding || !responseText.trim()}
                                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                            >
                                {isResponding
                                    ? "Envoi..."
                                    : "Publier la réponse"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default MerchantReviewsPage

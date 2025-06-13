/**
 * Page de gestion des avis clients pour les marchands
 * Permet de consulter, répondre et gérer les avis sur les produits
 */

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { 
    ArrowLeft, 
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
    Flag
} from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
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
        isDeletingResponse
    } = useMerchantReviews()

    const [searchTerm, setSearchTerm] = useState("")
    const [ratingFilter, setRatingFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [hasResponseFilter, setHasResponseFilter] = useState<string>("all")
    const [responseText, setResponseText] = useState("")
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
    const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)

    // Filtrer les avis
    const filteredReviews = React.useMemo(() => {
        if (!reviews) return []

        return filterReviews({
            search: searchTerm,
            rating: ratingFilter === "all" ? undefined : parseInt(ratingFilter),
            status: statusFilter === "all" ? undefined : statusFilter as any,
            has_response: hasResponseFilter === "all" ? undefined : hasResponseFilter === "yes",
        })
    }, [reviews, searchTerm, ratingFilter, statusFilter, hasResponseFilter, filterReviews])

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
                    i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
            />
        ))
    }

    const handleOpenResponseDialog = (reviewId: string, existingResponse?: string) => {
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

    const handleStatusChange = async (reviewId: string, newStatus: "pending" | "approved" | "rejected" | "flagged") => {
        try {
            await updateReviewStatus(reviewId, newStatus)
        } catch (error) {
            console.error("Erreur lors du changement de statut:", error)
        }
    }

    const handleDeleteResponse = async (reviewId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réponse ?")) {
            try {
                await deleteResponse(reviewId)
            } catch (error) {
                console.error("Erreur lors de la suppression:", error)
            }
        }
    }

    if (isLoading) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                                <p className="text-gray-600">Chargement des avis...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        )
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* En-tête */}
                    <div className="flex items-center space-x-4">
                        <Link to="/merchant/dashboard">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold" style={{ color: "#2D4A6B" }}>
                                Avis Clients
                            </h1>
                            <p className="text-slate-600">
                                Gérez les avis et commentaires sur vos produits
                            </p>
                        </div>
                    </div>

                    {/* Statistiques rapides */}
                    {stats && (
                        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                        {stats.total}
                                    </div>
                                    <p className="text-sm text-slate-600">Total</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-green-600">
                                        {stats.approved}
                                    </div>
                                    <p className="text-sm text-slate-600">Approuvés</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {stats.pending}
                                    </div>
                                    <p className="text-sm text-slate-600">En attente</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {stats.withResponse}
                                    </div>
                                    <p className="text-sm text-slate-600">Avec réponse</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {stats.needingResponse}
                                    </div>
                                    <p className="text-sm text-slate-600">À répondre</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                            {stats.averageRating.toFixed(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">Note moyenne</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Filtres et recherche */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Rechercher dans les avis..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                                    <SelectTrigger className="w-full lg:w-48">
                                        <SelectValue placeholder="Note" />
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
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full lg:w-48">
                                        <SelectValue placeholder="Statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="approved">Approuvé</SelectItem>
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="rejected">Rejeté</SelectItem>
                                        <SelectItem value="flagged">Signalé</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={hasResponseFilter} onValueChange={setHasResponseFilter}>
                                    <SelectTrigger className="w-full lg:w-48">
                                        <SelectValue placeholder="Réponse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
                                        <SelectItem value="yes">Avec réponse</SelectItem>
                                        <SelectItem value="no">Sans réponse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Liste des avis */}
                    <div className="space-y-6">
                        {filteredReviews.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center py-12">
                                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Aucun avis trouvé
                                        </h3>
                                        <p className="text-gray-600">
                                            {searchTerm || ratingFilter !== "all" || statusFilter !== "all" || hasResponseFilter !== "all"
                                                ? "Aucun avis ne correspond à vos critères de recherche."
                                                : "Vous n'avez pas encore reçu d'avis sur vos produits."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredReviews.map((review) => (
                                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            {/* En-tête de l'avis */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="font-medium text-gray-900">
                                                                {review.user?.first_name} {review.user?.last_name}
                                                            </span>
                                                            {review.is_verified_purchase && (
                                                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                                    Achat vérifié
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <div className="flex items-center space-x-1">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(review.created_at).toLocaleDateString("fr-FR")}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <Package className="w-4 h-4" />
                                                            <span>{review.product?.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusBadge(review.status)}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenResponseDialog(review.id, review.merchant_response)}
                                                            >
                                                                <Reply className="w-4 h-4 mr-2" />
                                                                {review.merchant_response ? "Modifier la réponse" : "Répondre"}
                                                            </DropdownMenuItem>
                                                            {review.merchant_response && (
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDeleteResponse(review.id)}
                                                                    className="text-red-600"
                                                                >
                                                                    <XCircle className="w-4 h-4 mr-2" />
                                                                    Supprimer la réponse
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(review.id, "approved")}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Approuver
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(review.id, "rejected")}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Rejeter
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(review.id, "flagged")}
                                                            >
                                                                <Flag className="w-4 h-4 mr-2" />
                                                                Signaler
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>

                                            {/* Contenu de l'avis */}
                                            <div className="ml-14">
                                                {review.title && (
                                                    <h4 className="font-medium text-gray-900 mb-2">
                                                        {review.title}
                                                    </h4>
                                                )}
                                                <p className="text-gray-700 mb-4">
                                                    {review.comment}
                                                </p>

                                                {/* Réponse du marchand */}
                                                {review.merchant_response && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">M</span>
                                                            </div>
                                                            <span className="font-medium text-blue-900">
                                                                Réponse du marchand
                                                            </span>
                                                            <span className="text-sm text-blue-600">
                                                                {review.merchant_response_date && 
                                                                    new Date(review.merchant_response_date).toLocaleDateString("fr-FR")}
                                                            </span>
                                                        </div>
                                                        <p className="text-blue-800">
                                                            {review.merchant_response}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Actions rapides */}
                                                {!review.merchant_response && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenResponseDialog(review.id)}
                                                        className="mt-2"
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

                    {/* Dialog de réponse */}
                    <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedReviewId && reviews?.find(r => r.id === selectedReviewId)?.merchant_response
                                        ? "Modifier votre réponse"
                                        : "Répondre à l'avis"}
                                </DialogTitle>
                                <DialogDescription>
                                    Votre réponse sera visible publiquement sous l'avis du client.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Écrivez votre réponse..."
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    className="min-h-[120px]"
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsResponseDialogOpen(false)}
                                    disabled={isResponding}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleSubmitResponse}
                                    disabled={isResponding || !responseText.trim()}
                                    style={{ backgroundColor: "#2D4A6B" }}
                                    className="text-white"
                                >
                                    {isResponding ? "Envoi..." : "Publier la réponse"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AuthGuard>
    )
}

export default MerchantReviewsPage

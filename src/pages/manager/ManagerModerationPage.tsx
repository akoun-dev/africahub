/**
 * Page de modération des contenus pour les gestionnaires
 * Modération des avis, commentaires et contenus signalés
 */

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
    ArrowLeft, 
    Search, 
    Filter, 
    CheckCircle, 
    XCircle, 
    Flag, 
    Clock,
    AlertTriangle,
    MessageSquare,
    Eye,
    MoreHorizontal,
    Calendar,
    User,
    RefreshCw
} from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import useManagerModeration from "@/hooks/useManagerModeration"
import { toast } from "sonner"

export const ManagerModerationPage: React.FC = () => {
    const {
        moderationItems,
        moderationStats,
        filters,
        isLoading,
        isApproving,
        isRejecting,
        isFlagging,
        approveItem,
        rejectItem,
        flagItem,
        changePriority,
        updateFilters,
        resetFilters,
        refetch
    } = useManagerModeration()

    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [actionReason, setActionReason] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const handleApprove = (id: string, reason?: string) => {
        approveItem(id, reason)
        setSelectedItem(null)
        setActionReason("")
    }

    const handleReject = (id: string, reason: string) => {
        if (!reason.trim()) {
            toast.error("Veuillez fournir une raison pour le rejet")
            return
        }
        rejectItem(id, reason)
        setSelectedItem(null)
        setActionReason("")
    }

    const handleFlag = (id: string, reason: string) => {
        if (!reason.trim()) {
            toast.error("Veuillez fournir une raison pour le signalement")
            return
        }
        flagItem(id, reason)
        setSelectedItem(null)
        setActionReason("")
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "approved": return "bg-green-100 text-green-800"
            case "rejected": return "bg-red-100 text-red-800"
            case "flagged": return "bg-orange-100 text-orange-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgent": return "bg-red-100 text-red-800"
            case "high": return "bg-orange-100 text-orange-800"
            case "medium": return "bg-yellow-100 text-yellow-800"
            case "low": return "bg-green-100 text-green-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "review": return <MessageSquare className="w-4 h-4" />
            case "comment": return <MessageSquare className="w-4 h-4" />
            case "product": return <Eye className="w-4 h-4" />
            case "report": return <Flag className="w-4 h-4" />
            default: return <AlertTriangle className="w-4 h-4" />
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const filteredItems = moderationItems.filter(item =>
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* En-tête */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/manager/dashboard">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold" style={{ color: "#2D4A6B" }}>
                                    Modération des Contenus
                                </h1>
                                <p className="text-slate-600">
                                    Gérez les avis, commentaires et contenus signalés
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                            <Button variant="outline" onClick={() => refetch()}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualiser
                            </Button>
                            <Button 
                                onClick={resetFilters}
                                variant="outline"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Réinitialiser filtres
                            </Button>
                        </div>
                    </div>

                    {/* Statistiques rapides */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">En attente</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {moderationStats?.total_pending || 0}
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Approuvés</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {moderationStats?.total_approved || 0}
                                        </p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Rejetés</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {moderationStats?.total_rejected || 0}
                                        </p>
                                    </div>
                                    <XCircle className="w-8 h-8 text-red-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Urgents</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {moderationStats?.urgent_count || 0}
                                        </p>
                                    </div>
                                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filtres et recherche */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Rechercher..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Select
                                    value={filters.type || "all"}
                                    onValueChange={(value) => updateFilters({ type: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les types</SelectItem>
                                        <SelectItem value="review">Avis</SelectItem>
                                        <SelectItem value="comment">Commentaires</SelectItem>
                                        <SelectItem value="product">Produits</SelectItem>
                                        <SelectItem value="report">Signalements</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.status || "all"}
                                    onValueChange={(value) => updateFilters({ status: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="approved">Approuvés</SelectItem>
                                        <SelectItem value="rejected">Rejetés</SelectItem>
                                        <SelectItem value="flagged">Signalés</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.priority || "all"}
                                    onValueChange={(value) => updateFilters({ priority: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Priorité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes priorités</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                        <SelectItem value="high">Haute</SelectItem>
                                        <SelectItem value="medium">Moyenne</SelectItem>
                                        <SelectItem value="low">Faible</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Liste des éléments de modération */}
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: "#2D4A6B" }}>
                                Éléments à modérer ({filteredItems.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-2">Chargement...</p>
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Aucun élément à modérer</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center space-x-3">
                                                        {getTypeIcon(item.type)}
                                                        <Badge className={getStatusColor(item.status)}>
                                                            {item.status}
                                                        </Badge>
                                                        <Badge className={getPriorityColor(item.priority)}>
                                                            {item.priority}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500">
                                                            {item.category}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <User className="w-4 h-4" />
                                                        <span>{item.author_name}</span>
                                                        <span>•</span>
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{formatDate(item.created_at)}</span>
                                                    </div>

                                                    <p className="text-gray-900 line-clamp-3">
                                                        {item.content}
                                                    </p>

                                                    {item.target_name && (
                                                        <p className="text-sm text-blue-600">
                                                            Concernant: {item.target_name}
                                                        </p>
                                                    )}

                                                    {item.reason && (
                                                        <p className="text-sm text-orange-600">
                                                            Raison: {item.reason}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-2 ml-4">
                                                    {item.status === "pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-green-600 border-green-300"
                                                                onClick={() => handleApprove(item.id)}
                                                                disabled={isApproving}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Approuver
                                                            </Button>

                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-red-600 border-red-300"
                                                                        onClick={() => setSelectedItem(item)}
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-1" />
                                                                        Rejeter
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Rejeter l'élément</DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="space-y-4">
                                                                        <Textarea
                                                                            placeholder="Raison du rejet..."
                                                                            value={actionReason}
                                                                            onChange={(e) => setActionReason(e.target.value)}
                                                                        />
                                                                        <div className="flex justify-end space-x-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() => {
                                                                                    setSelectedItem(null)
                                                                                    setActionReason("")
                                                                                }}
                                                                            >
                                                                                Annuler
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => handleReject(item.id, actionReason)}
                                                                                disabled={isRejecting}
                                                                                className="bg-red-600 text-white"
                                                                            >
                                                                                Rejeter
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    )
}

export default ManagerModerationPage

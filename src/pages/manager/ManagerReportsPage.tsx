/**
 * Page de gestion des signalements pour les gestionnaires
 * Traitement des demandes de retrait et signalements de contenu inapproprié
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
    AlertTriangle,
    Clock,
    TrendingUp,
    User,
    Calendar,
    RefreshCw,
    UserCheck,
    MessageSquare,
    Package,
    Eye,
    MoreHorizontal
} from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import useManagerReports from "@/hooks/useManagerReports"
import { toast } from "sonner"

export const ManagerReportsPage: React.FC = () => {
    const {
        reports,
        reportStats,
        filters,
        isLoading,
        isAssigning,
        isResolving,
        isDismissing,
        isEscalating,
        assignReport,
        resolveReport,
        dismissReport,
        escalateReport,
        updateFilters,
        resetFilters,
        refetch
    } = useManagerReports()

    const [selectedReport, setSelectedReport] = useState<any>(null)
    const [actionReason, setActionReason] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const handleResolve = (id: string, resolution: string, action?: string) => {
        if (!resolution.trim()) {
            toast.error("Veuillez fournir une résolution")
            return
        }
        resolveReport(id, resolution, action)
        setSelectedReport(null)
        setActionReason("")
    }

    const handleDismiss = (id: string, reason: string) => {
        if (!reason.trim()) {
            toast.error("Veuillez fournir une raison pour le rejet")
            return
        }
        dismissReport(id, reason)
        setSelectedReport(null)
        setActionReason("")
    }

    const handleEscalate = (id: string, reason: string) => {
        if (!reason.trim()) {
            toast.error("Veuillez fournir une raison pour l'escalade")
            return
        }
        escalateReport(id, reason)
        setSelectedReport(null)
        setActionReason("")
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "investigating": return "bg-blue-100 text-blue-800"
            case "resolved": return "bg-green-100 text-green-800"
            case "dismissed": return "bg-gray-100 text-gray-800"
            case "escalated": return "bg-red-100 text-red-800"
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

    const getTargetTypeIcon = (type: string) => {
        switch (type) {
            case "product": return <Package className="w-4 h-4" />
            case "review": return <MessageSquare className="w-4 h-4" />
            case "comment": return <MessageSquare className="w-4 h-4" />
            case "user": return <User className="w-4 h-4" />
            case "merchant": return <UserCheck className="w-4 h-4" />
            default: return <Flag className="w-4 h-4" />
        }
    }

    const getReasonLabel = (reason: string) => {
        const labels = {
            inappropriate_content: "Contenu inapproprié",
            spam: "Spam",
            fake_info: "Fausses informations",
            copyright: "Violation de droits d'auteur",
            harassment: "Harcèlement",
            fraud: "Fraude",
            other: "Autre"
        }
        return labels[reason as keyof typeof labels] || reason
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

    const filteredReports = reports.filter(report =>
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.target_name && report.target_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                    Gestion des Signalements
                                </h1>
                                <p className="text-slate-600">
                                    Traitez les demandes de retrait et signalements de contenu
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">En attente</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {reportStats?.pending_reports || 0}
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
                                        <p className="text-sm font-medium text-gray-600">En cours</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {reportStats?.investigating_reports || 0}
                                        </p>
                                    </div>
                                    <Eye className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Résolus</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {reportStats?.resolved_reports || 0}
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
                                        <p className="text-sm font-medium text-gray-600">Urgents</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {reportStats?.urgent_count || 0}
                                        </p>
                                    </div>
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Taux résolution</p>
                                        <p className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                            {((reportStats?.resolution_rate || 0) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    <TrendingUp className="w-8 h-8" style={{ color: "#2D4A6B" }} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filtres et recherche */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Rechercher signalements..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

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
                                        <SelectItem value="investigating">En cours</SelectItem>
                                        <SelectItem value="resolved">Résolus</SelectItem>
                                        <SelectItem value="dismissed">Rejetés</SelectItem>
                                        <SelectItem value="escalated">Escaladés</SelectItem>
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

                                <Select
                                    value={filters.target_type || "all"}
                                    onValueChange={(value) => updateFilters({ target_type: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type de cible" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les types</SelectItem>
                                        <SelectItem value="product">Produits</SelectItem>
                                        <SelectItem value="review">Avis</SelectItem>
                                        <SelectItem value="comment">Commentaires</SelectItem>
                                        <SelectItem value="user">Utilisateurs</SelectItem>
                                        <SelectItem value="merchant">Marchands</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.reason || "all"}
                                    onValueChange={(value) => updateFilters({ reason: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Raison" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes raisons</SelectItem>
                                        <SelectItem value="inappropriate_content">Contenu inapproprié</SelectItem>
                                        <SelectItem value="spam">Spam</SelectItem>
                                        <SelectItem value="fake_info">Fausses infos</SelectItem>
                                        <SelectItem value="copyright">Droits d'auteur</SelectItem>
                                        <SelectItem value="harassment">Harcèlement</SelectItem>
                                        <SelectItem value="fraud">Fraude</SelectItem>
                                        <SelectItem value="other">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Liste des signalements */}
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: "#2D4A6B" }}>
                                Signalements ({filteredReports.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-2">Chargement...</p>
                                </div>
                            ) : filteredReports.length === 0 ? (
                                <div className="text-center py-8">
                                    <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Aucun signalement trouvé</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredReports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-3">
                                                    {/* En-tête du signalement */}
                                                    <div className="flex items-center space-x-3">
                                                        {getTargetTypeIcon(report.target_type)}
                                                        <Badge className={getStatusColor(report.status)}>
                                                            {report.status}
                                                        </Badge>
                                                        <Badge className={getPriorityColor(report.priority)}>
                                                            {report.priority}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500">
                                                            {getReasonLabel(report.reason)}
                                                        </span>
                                                    </div>

                                                    {/* Informations du signalement */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                            <div className="flex items-center space-x-1">
                                                                <User className="w-4 h-4" />
                                                                <span>Signalé par: {report.reporter_name}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{formatDate(report.created_at)}</span>
                                                            </div>
                                                        </div>

                                                        {report.target_name && (
                                                            <p className="text-sm">
                                                                <span className="font-medium">Cible:</span> {report.target_name}
                                                            </p>
                                                        )}

                                                        <p className="text-gray-900">
                                                            <span className="font-medium">Description:</span> {report.description}
                                                        </p>

                                                        {report.target_content && (
                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                <p className="text-sm font-medium text-gray-700 mb-1">
                                                                    Contenu signalé:
                                                                </p>
                                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                                    {report.target_content}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {report.resolution && (
                                                            <div className="bg-green-50 p-3 rounded-lg">
                                                                <p className="text-sm font-medium text-green-800 mb-1">
                                                                    Résolution:
                                                                </p>
                                                                <p className="text-sm text-green-700">
                                                                    {report.resolution}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col space-y-2 ml-4">
                                                    {report.status === "pending" && (
                                                        <>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-green-600 border-green-300"
                                                                        onClick={() => setSelectedReport(report)}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                                        Résoudre
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Résoudre le signalement</DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="space-y-4">
                                                                        <Textarea
                                                                            placeholder="Description de la résolution..."
                                                                            value={actionReason}
                                                                            onChange={(e) => setActionReason(e.target.value)}
                                                                        />
                                                                        <div className="flex justify-end space-x-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() => {
                                                                                    setSelectedReport(null)
                                                                                    setActionReason("")
                                                                                }}
                                                                            >
                                                                                Annuler
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => handleResolve(report.id, actionReason)}
                                                                                disabled={isResolving}
                                                                                className="bg-green-600 text-white"
                                                                            >
                                                                                Résoudre
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>

                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-gray-600 border-gray-300"
                                                                        onClick={() => setSelectedReport(report)}
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-1" />
                                                                        Rejeter
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Rejeter le signalement</DialogTitle>
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
                                                                                    setSelectedReport(null)
                                                                                    setActionReason("")
                                                                                }}
                                                                            >
                                                                                Annuler
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => handleDismiss(report.id, actionReason)}
                                                                                disabled={isDismissing}
                                                                                className="bg-gray-600 text-white"
                                                                            >
                                                                                Rejeter
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>

                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-red-600 border-red-300"
                                                                        onClick={() => setSelectedReport(report)}
                                                                    >
                                                                        <TrendingUp className="w-4 h-4 mr-1" />
                                                                        Escalader
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Escalader le signalement</DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="space-y-4">
                                                                        <Textarea
                                                                            placeholder="Raison de l'escalade..."
                                                                            value={actionReason}
                                                                            onChange={(e) => setActionReason(e.target.value)}
                                                                        />
                                                                        <div className="flex justify-end space-x-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() => {
                                                                                    setSelectedReport(null)
                                                                                    setActionReason("")
                                                                                }}
                                                                            >
                                                                                Annuler
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => handleEscalate(report.id, actionReason)}
                                                                                disabled={isEscalating}
                                                                                className="bg-red-600 text-white"
                                                                            >
                                                                                Escalader
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

export default ManagerReportsPage

/**
 * Page de gestion des produits pour les gestionnaires
 * Vérification de conformité et modération des fiches produits
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
import { Checkbox } from "@/components/ui/checkbox"
import { 
    ArrowLeft, 
    Search, 
    Filter, 
    CheckCircle, 
    XCircle, 
    AlertTriangle, 
    Package,
    Eye,
    Edit,
    Calendar,
    User,
    RefreshCw,
    ShieldCheck,
    DollarSign,
    Image as ImageIcon
} from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import useManagerProducts from "@/hooks/useManagerProducts"
import { toast } from "sonner"

export const ManagerProductsPage: React.FC = () => {
    const {
        products,
        productStats,
        complianceRules,
        filters,
        isLoading,
        isApproving,
        isRejecting,
        isRequestingRevision,
        approveProduct,
        rejectProduct,
        requestRevision,
        checkCompliance,
        updateFilters,
        resetFilters,
        refetch
    } = useManagerProducts()

    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [actionReason, setActionReason] = useState("")
    const [selectedIssues, setSelectedIssues] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const handleApprove = (id: string, notes?: string) => {
        approveProduct(id, notes)
        setSelectedProduct(null)
        setActionReason("")
    }

    const handleReject = (id: string, reason: string, issues: string[]) => {
        if (!reason.trim()) {
            toast.error("Veuillez fournir une raison pour le rejet")
            return
        }
        rejectProduct(id, reason, issues)
        setSelectedProduct(null)
        setActionReason("")
        setSelectedIssues([])
    }

    const handleRequestRevision = (id: string, notes: string, issues: string[]) => {
        if (!notes.trim()) {
            toast.error("Veuillez fournir des notes pour la révision")
            return
        }
        requestRevision(id, notes, issues)
        setSelectedProduct(null)
        setActionReason("")
        setSelectedIssues([])
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "active": return "bg-green-100 text-green-800"
            case "rejected": return "bg-red-100 text-red-800"
            case "draft": return "bg-gray-100 text-gray-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getComplianceColor = (status: string) => {
        switch (status) {
            case "compliant": return "bg-green-100 text-green-800"
            case "non_compliant": return "bg-red-100 text-red-800"
            case "needs_review": return "bg-yellow-100 text-yellow-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: currency || "XOF"
        }).format(price)
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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
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
                                    Gestion des Produits
                                </h1>
                                <p className="text-slate-600">
                                    Vérifiez la conformité et modérez les fiches produits
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
                                        <p className="text-sm font-medium text-gray-600">En révision</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {productStats?.pending_review || 0}
                                        </p>
                                    </div>
                                    <Package className="w-8 h-8 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Approuvés</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {productStats?.approved || 0}
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
                                            {productStats?.rejected || 0}
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
                                        <p className="text-sm font-medium text-gray-600">Conformité</p>
                                        <p className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                            {((productStats?.compliance_rate || 0) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    <ShieldCheck className="w-8 h-8" style={{ color: "#2D4A6B" }} />
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
                                        placeholder="Rechercher produits..."
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
                                        <SelectItem value="pending">En révision</SelectItem>
                                        <SelectItem value="approved">Approuvés</SelectItem>
                                        <SelectItem value="rejected">Rejetés</SelectItem>
                                        <SelectItem value="revision_needed">Révision demandée</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.compliance_status || "all"}
                                    onValueChange={(value) => updateFilters({ compliance_status: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Conformité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes conformités</SelectItem>
                                        <SelectItem value="compliant">Conforme</SelectItem>
                                        <SelectItem value="non_compliant">Non conforme</SelectItem>
                                        <SelectItem value="needs_review">À vérifier</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.category || ""}
                                    onValueChange={(value) => updateFilters({ category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Toutes catégories</SelectItem>
                                        <SelectItem value="Électronique">Électronique</SelectItem>
                                        <SelectItem value="Mode">Mode</SelectItem>
                                        <SelectItem value="Maison">Maison</SelectItem>
                                        <SelectItem value="Sport">Sport</SelectItem>
                                        <SelectItem value="Beauté">Beauté</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Liste des produits */}
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: "#2D4A6B" }}>
                                Produits à réviser ({filteredProducts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-2">Chargement...</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Aucun produit à réviser</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start space-x-4">
                                                {/* Image du produit */}
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    {product.main_image ? (
                                                        <img
                                                            src={product.main_image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>

                                                {/* Informations du produit */}
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-lg text-gray-900">
                                                                {product.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {product.category} • {product.merchant_name}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <DollarSign className="w-4 h-4 text-green-600" />
                                                            <span className="font-semibold text-green-600">
                                                                {formatPrice(product.price, product.currency)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <Badge className={getStatusColor(product.status)}>
                                                            {product.status}
                                                        </Badge>
                                                        <Badge className={getComplianceColor(product.compliance_status)}>
                                                            {product.compliance_status}
                                                        </Badge>
                                                        {product.business_sector && (
                                                            <span className="text-sm text-gray-500">
                                                                {product.business_sector}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-gray-700 line-clamp-2">
                                                        {product.description}
                                                    </p>

                                                    {product.compliance_issues && product.compliance_issues.length > 0 && (
                                                        <div className="bg-red-50 p-3 rounded-lg">
                                                            <p className="text-sm font-medium text-red-800 mb-1">
                                                                Problèmes de conformité:
                                                            </p>
                                                            <ul className="text-sm text-red-700 space-y-1">
                                                                {product.compliance_issues.map((issue, index) => (
                                                                    <li key={index}>• {issue}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{formatDate(product.created_at)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <User className="w-4 h-4" />
                                                            <span>{product.merchant_email}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col space-y-2 flex-shrink-0">
                                                    {product.status === "pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-green-600 border-green-300"
                                                                onClick={() => handleApprove(product.id)}
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
                                                                        className="text-orange-600 border-orange-300"
                                                                        onClick={() => setSelectedProduct(product)}
                                                                    >
                                                                        <Edit className="w-4 h-4 mr-1" />
                                                                        Révision
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-2xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Demander une révision</DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <label className="text-sm font-medium mb-2 block">
                                                                                Problèmes identifiés:
                                                                            </label>
                                                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                                                {complianceRules.map((rule) => (
                                                                                    <div key={rule.id} className="flex items-center space-x-2">
                                                                                        <Checkbox
                                                                                            id={rule.id}
                                                                                            checked={selectedIssues.includes(rule.rule_name)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                if (checked) {
                                                                                                    setSelectedIssues([...selectedIssues, rule.rule_name])
                                                                                                } else {
                                                                                                    setSelectedIssues(selectedIssues.filter(i => i !== rule.rule_name))
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                        <label htmlFor={rule.id} className="text-sm">
                                                                                            {rule.rule_name}
                                                                                        </label>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        <Textarea
                                                                            placeholder="Notes pour le marchand..."
                                                                            value={actionReason}
                                                                            onChange={(e) => setActionReason(e.target.value)}
                                                                        />
                                                                        <div className="flex justify-end space-x-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() => {
                                                                                    setSelectedProduct(null)
                                                                                    setActionReason("")
                                                                                    setSelectedIssues([])
                                                                                }}
                                                                            >
                                                                                Annuler
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => handleRequestRevision(product.id, actionReason, selectedIssues)}
                                                                                disabled={isRequestingRevision}
                                                                                className="bg-orange-600 text-white"
                                                                            >
                                                                                Demander révision
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
                                                                        onClick={() => setSelectedProduct(product)}
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-1" />
                                                                        Rejeter
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Rejeter le produit</DialogTitle>
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
                                                                                    setSelectedProduct(null)
                                                                                    setActionReason("")
                                                                                }}
                                                                            >
                                                                                Annuler
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => handleReject(product.id, actionReason, [])}
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
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Détails
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

export default ManagerProductsPage

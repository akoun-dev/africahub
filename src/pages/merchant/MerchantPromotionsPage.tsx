/**
 * Page de gestion des promotions pour les marchands
 * Création et gestion des offres promotionnelles
 */

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Tag, 
    Percent, 
    Calendar, 
    TrendingUp, 
    Users,
    Eye,
    Edit,
    Trash2,
    Plus,
    Search,
    Filter,
    Gift
} from "lucide-react"

const MerchantPromotionsPage: React.FC = () => {
    // Données d'exemple pour les promotions
    const promotions = [
        {
            id: "PROMO-001",
            name: "Soldes d'Hiver",
            discount: 25,
            type: "percentage",
            startDate: "2024-01-01",
            endDate: "2024-01-31",
            status: "active",
            uses: 45,
            maxUses: 100
        },
        {
            id: "PROMO-002",
            name: "Livraison Gratuite",
            discount: 0,
            type: "shipping",
            startDate: "2024-01-15",
            endDate: "2024-02-15",
            status: "active",
            uses: 23,
            maxUses: 50
        },
        {
            id: "PROMO-003",
            name: "Réduction Fidélité",
            discount: 15,
            type: "percentage",
            startDate: "2023-12-01",
            endDate: "2024-01-10",
            status: "expired",
            uses: 78,
            maxUses: 100
        }
    ]

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-800">Active</Badge>
            case "expired":
                return <Badge className="bg-red-100 text-red-800">Expirée</Badge>
            case "scheduled":
                return <Badge className="bg-blue-100 text-blue-800">Programmée</Badge>
            case "paused":
                return <Badge className="bg-yellow-100 text-yellow-800">En pause</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "percentage":
                return <Percent className="h-4 w-4" />
            case "shipping":
                return <Gift className="h-4 w-4" />
            case "fixed":
                return <Tag className="h-4 w-4" />
            default:
                return <Tag className="h-4 w-4" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="p-6 space-y-6">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Motifs décoratifs */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-emerald-400/20 rounded-full"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-3">Gestion des Promotions</h1>
                            <p className="text-emerald-100 text-lg">
                                Créez et gérez vos offres promotionnelles pour booster vos ventes
                            </p>
                        </div>
                        <Tag className="h-16 w-16 text-emerald-200" />
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">3</div>
                            <div className="text-sm font-medium text-gray-700">Promotions actives</div>
                            <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                <div className="bg-emerald-600 h-2 rounded-full w-3/4"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">146</div>
                            <div className="text-sm font-medium text-gray-700">Utilisations</div>
                            <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                                <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">18%</div>
                            <div className="text-sm font-medium text-gray-700">Taux de conversion</div>
                            <div className="w-full bg-green-100 rounded-full h-2 mt-3">
                                <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-800 mb-2">285K</div>
                            <div className="text-sm font-medium text-gray-700">Économies clients</div>
                            <div className="text-xs text-gray-500 mt-1">FCFA ce mois</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions et filtres */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher une promotion..."
                                        className="pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>
                                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtrer
                                </Button>
                            </div>
                            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                                <Plus className="h-4 w-4 mr-2" />
                                Créer une promotion
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des promotions */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-emerald-800">Mes Promotions</CardTitle>
                        <CardDescription>Gérez vos offres promotionnelles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {promotions.map((promo) => (
                                <div key={promo.id} className="flex items-center justify-between p-4 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            {getTypeIcon(promo.type)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{promo.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {promo.type === 'percentage' ? `${promo.discount}% de réduction` : 
                                                 promo.type === 'shipping' ? 'Livraison gratuite' : 
                                                 `${promo.discount} FCFA de réduction`}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {promo.startDate} - {promo.endDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{promo.uses}/{promo.maxUses}</p>
                                            <p className="text-sm text-gray-600">utilisations</p>
                                            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                                <div 
                                                    className="bg-emerald-600 h-2 rounded-full" 
                                                    style={{ width: `${(promo.uses / promo.maxUses) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        {getStatusBadge(promo.status)}
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default MerchantPromotionsPage

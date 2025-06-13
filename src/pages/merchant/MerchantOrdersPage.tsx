/**
 * Page de gestion des commandes pour les marchands
 * Affiche et gère toutes les commandes reçues
 */

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    ShoppingCart, 
    Package, 
    Truck, 
    CheckCircle, 
    XCircle, 
    Clock,
    Search,
    Filter,
    Download,
    Eye,
    Plus
} from "lucide-react"

const MerchantOrdersPage: React.FC = () => {
    // Données d'exemple pour les commandes
    const orders = [
        {
            id: "CMD-001",
            customer: "Marie Kouassi",
            date: "2024-01-15",
            total: 45000,
            status: "pending",
            items: 3
        },
        {
            id: "CMD-002", 
            customer: "Jean Diabaté",
            date: "2024-01-14",
            total: 28500,
            status: "shipped",
            items: 2
        },
        {
            id: "CMD-003",
            customer: "Fatou Traoré",
            date: "2024-01-13", 
            total: 67200,
            status: "delivered",
            items: 5
        }
    ]

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />En attente</Badge>
            case "shipped":
                return <Badge className="bg-blue-100 text-blue-800"><Truck className="h-3 w-3 mr-1" />Expédiée</Badge>
            case "delivered":
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Livrée</Badge>
            case "cancelled":
                return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Annulée</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
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
                            <h1 className="text-3xl font-bold mb-3">Gestion des Commandes</h1>
                            <p className="text-emerald-100 text-lg">
                                Suivez et gérez toutes vos commandes en temps réel
                            </p>
                        </div>
                        <ShoppingCart className="h-16 w-16 text-emerald-200" />
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">12</div>
                            <div className="text-sm font-medium text-gray-700">Nouvelles commandes</div>
                            <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                <div className="bg-emerald-600 h-2 rounded-full w-3/4"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                            <div className="text-sm font-medium text-gray-700">En cours</div>
                            <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                                <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">45</div>
                            <div className="text-sm font-medium text-gray-700">Livrées</div>
                            <div className="w-full bg-green-100 rounded-full h-2 mt-3">
                                <div className="bg-green-600 h-2 rounded-full w-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-800 mb-2">1.2M</div>
                            <div className="text-sm font-medium text-gray-700">Chiffre d'affaires</div>
                            <div className="text-xs text-gray-500 mt-1">FCFA ce mois</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtres et actions */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher une commande..."
                                        className="pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>
                                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtrer
                                </Button>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                    <Download className="h-4 w-4 mr-2" />
                                    Exporter
                                </Button>
                                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nouvelle commande
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des commandes */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-emerald-800">Commandes Récentes</CardTitle>
                        <CardDescription>Gérez vos commandes et leur statut</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <Package className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{order.id}</p>
                                            <p className="text-sm text-gray-600">{order.customer}</p>
                                            <p className="text-xs text-gray-500">{order.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{order.total.toLocaleString()} FCFA</p>
                                            <p className="text-sm text-gray-600">{order.items} article{order.items > 1 ? 's' : ''}</p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                        <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                            <Eye className="h-4 w-4" />
                                        </Button>
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

export default MerchantOrdersPage

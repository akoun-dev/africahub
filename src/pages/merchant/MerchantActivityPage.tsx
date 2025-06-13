/**
 * Page d'activité pour les marchands
 * Historique et journal des activités du compte marchand
 */

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Activity, 
    Clock, 
    User, 
    Package, 
    ShoppingCart,
    Star,
    Settings,
    Eye,
    Download,
    Filter,
    Calendar,
    TrendingUp
} from "lucide-react"

const MerchantActivityPage: React.FC = () => {
    // Données d'exemple pour l'activité
    const activities = [
        {
            id: 1,
            type: "product",
            action: "Produit ajouté",
            description: "Nouveau produit 'Sac en cuir artisanal' ajouté au catalogue",
            timestamp: "2024-01-15 14:30",
            icon: Package,
            color: "emerald"
        },
        {
            id: 2,
            type: "order",
            action: "Commande reçue",
            description: "Nouvelle commande #CMD-001 de Marie Kouassi",
            timestamp: "2024-01-15 12:15",
            icon: ShoppingCart,
            color: "blue"
        },
        {
            id: 3,
            type: "review",
            action: "Nouvel avis",
            description: "Avis 5 étoiles reçu sur 'Bijoux traditionnels'",
            timestamp: "2024-01-15 10:45",
            icon: Star,
            color: "yellow"
        },
        {
            id: 4,
            type: "profile",
            action: "Profil mis à jour",
            description: "Informations de contact modifiées",
            timestamp: "2024-01-14 16:20",
            icon: User,
            color: "purple"
        },
        {
            id: 5,
            type: "settings",
            action: "Paramètres modifiés",
            description: "Notifications par email activées",
            timestamp: "2024-01-14 09:30",
            icon: Settings,
            color: "gray"
        }
    ]

    const getColorClasses = (color: string) => {
        switch (color) {
            case "emerald":
                return "bg-emerald-100 text-emerald-600"
            case "blue":
                return "bg-blue-100 text-blue-600"
            case "yellow":
                return "bg-yellow-100 text-yellow-600"
            case "purple":
                return "bg-purple-100 text-purple-600"
            case "gray":
                return "bg-gray-100 text-gray-600"
            default:
                return "bg-gray-100 text-gray-600"
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
                            <h1 className="text-3xl font-bold mb-3">Activité du Compte</h1>
                            <p className="text-emerald-100 text-lg">
                                Suivez l'historique et les activités de votre compte marchand
                            </p>
                        </div>
                        <Activity className="h-16 w-16 text-emerald-200" />
                    </div>
                </div>

                {/* Statistiques d'activité */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">24</div>
                            <div className="text-sm font-medium text-gray-700">Actions aujourd'hui</div>
                            <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                <div className="bg-emerald-600 h-2 rounded-full w-4/5"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
                            <div className="text-sm font-medium text-gray-700">Cette semaine</div>
                            <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                                <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                            <div className="text-sm font-medium text-gray-700">Produits ajoutés</div>
                            <div className="w-full bg-green-100 rounded-full h-2 mt-3">
                                <div className="bg-green-600 h-2 rounded-full w-2/3"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-800 mb-2">89%</div>
                            <div className="text-sm font-medium text-gray-700">Taux d'activité</div>
                            <div className="text-xs text-gray-500 mt-1">vs mois dernier</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtres et actions */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex gap-3">
                                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Aujourd'hui
                                </Button>
                                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtrer par type
                                </Button>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                    <Download className="h-4 w-4 mr-2" />
                                    Exporter
                                </Button>
                                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Rapport détaillé
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Journal d'activité */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-emerald-800">Journal d'Activité</CardTitle>
                        <CardDescription>Historique chronologique de vos actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activities.map((activity) => {
                                const IconComponent = activity.icon
                                return (
                                    <div key={activity.id} className="flex items-start space-x-4 p-4 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(activity.color)}`}>
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {activity.timestamp}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mt-1">{activity.description}</p>
                                            <div className="flex items-center mt-2 space-x-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {activity.type}
                                                </Badge>
                                                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Détails
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                        {/* Bouton pour charger plus */}
                        <div className="text-center mt-6">
                            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                Charger plus d'activités
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Résumé rapide */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-emerald-800">Actions Fréquentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Ajout de produits</span>
                                    <Badge className="bg-emerald-100 text-emerald-800">45%</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Gestion commandes</span>
                                    <Badge className="bg-blue-100 text-blue-800">30%</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Mise à jour profil</span>
                                    <Badge className="bg-purple-100 text-purple-800">15%</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Autres</span>
                                    <Badge className="bg-gray-100 text-gray-800">10%</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-emerald-800">Tendances</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Activité en hausse</span>
                                    <div className="flex items-center text-green-600">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        +23%
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Votre activité a augmenté de 23% par rapport au mois dernier. 
                                    Continuez sur cette lancée !
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default MerchantActivityPage

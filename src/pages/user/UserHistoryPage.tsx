/**
 * Page d'historique utilisateur
 * Affiche l'historique des recherches, consultations et actions de l'utilisateur
 */

import React, { useState } from "react"
import {
    Clock,
    Search,
    Eye,
    Heart,
    BarChart3,
    Trash2,
    Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"

interface HistoryItem {
    id: string
    type: "search" | "view" | "favorite" | "compare"
    title: string
    description: string
    timestamp: string
    metadata?: {
        query?: string
        product_id?: string
        product_name?: string
        category?: string
        sector?: string
    }
}

export const UserHistoryPage: React.FC = () => {
    const { user } = useAuth()
    const [searchFilter, setSearchFilter] = useState("")

    // Données de démonstration
    const [history] = useState<HistoryItem[]>([
        {
            id: "1",
            type: "search",
            title: 'Recherche: "assurance auto"',
            description: "Recherche dans la catégorie Assurance",
            timestamp: "2024-01-15T14:30:00Z",
            metadata: {
                query: "assurance auto",
                category: "Assurance",
                sector: "Assurance",
            },
        },
        {
            id: "2",
            type: "view",
            title: "Consultation: Assurance Auto Premium",
            description: "NSIA Assurances - Détails du produit consultés",
            timestamp: "2024-01-15T14:32:00Z",
            metadata: {
                product_id: "prod-123",
                product_name: "Assurance Auto Premium",
                category: "Assurance",
            },
        },
        {
            id: "3",
            type: "favorite",
            title: "Ajouté aux favoris: Crédit Immobilier",
            description: "Ecobank - Produit ajouté à vos favoris",
            timestamp: "2024-01-15T10:15:00Z",
            metadata: {
                product_id: "prod-456",
                product_name: "Crédit Immobilier",
                category: "Crédit",
            },
        },
        {
            id: "4",
            type: "compare",
            title: "Comparaison: 3 assurances auto",
            description: "Comparaison entre NSIA, Allianz et Saham",
            timestamp: "2024-01-14T16:45:00Z",
            metadata: {
                category: "Assurance",
            },
        },
        {
            id: "5",
            type: "search",
            title: 'Recherche: "crédit personnel"',
            description: "Recherche dans la catégorie Banque",
            timestamp: "2024-01-14T11:20:00Z",
            metadata: {
                query: "crédit personnel",
                category: "Crédit",
                sector: "Banque",
            },
        },
        {
            id: "6",
            type: "view",
            title: "Consultation: Compte Épargne Plus",
            description: "BOA - Détails du produit consultés",
            timestamp: "2024-01-13T09:30:00Z",
            metadata: {
                product_id: "prod-789",
                product_name: "Compte Épargne Plus",
                category: "Épargne",
            },
        },
    ])

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "search":
                return <Search className="h-4 w-4" />
            case "view":
                return <Eye className="h-4 w-4" />
            case "favorite":
                return <Heart className="h-4 w-4" />
            case "compare":
                return <BarChart3 className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "search":
                return <Badge variant="outline">Recherche</Badge>
            case "view":
                return <Badge variant="secondary">Consultation</Badge>
            case "favorite":
                return <Badge variant="default">Favori</Badge>
            case "compare":
                return <Badge variant="destructive">Comparaison</Badge>
            default:
                return <Badge variant="outline">Autre</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60)
        )

        if (diffInHours < 1) {
            return "Il y a moins d'une heure"
        } else if (diffInHours < 24) {
            return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            if (diffInDays < 7) {
                return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
            } else {
                return date.toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            }
        }
    }

    const filteredHistory = history.filter(
        item =>
            item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.description.toLowerCase().includes(searchFilter.toLowerCase())
    )

    const searchHistory = filteredHistory.filter(item => item.type === "search")
    const viewHistory = filteredHistory.filter(item => item.type === "view")
    const favoriteHistory = filteredHistory.filter(
        item => item.type === "favorite"
    )
    const compareHistory = filteredHistory.filter(
        item => item.type === "compare"
    )

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="py-16 text-center">
                        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            Connexion requise
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Connectez-vous pour voir votre historique
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
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* En-tête */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Mon Historique
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Retrouvez toutes vos activités sur AfricaHub
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Effacer l'historique
                        </Button>
                    </div>

                    {/* Barre de recherche */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Rechercher dans l'historique..."
                                        value={searchFilter}
                                        onChange={e =>
                                            setSearchFilter(e.target.value)
                                        }
                                        className="w-full"
                                    />
                                </div>
                                <Button variant="outline">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtres
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {searchHistory.length}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Recherches
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {viewHistory.length}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Consultations
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {favoriteHistory.length}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Favoris
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {compareHistory.length}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Comparaisons
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Historique par onglets */}
                    <Tabs defaultValue="all" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="all">
                                Tout ({filteredHistory.length})
                            </TabsTrigger>
                            <TabsTrigger value="search">
                                Recherches ({searchHistory.length})
                            </TabsTrigger>
                            <TabsTrigger value="view">
                                Consultations ({viewHistory.length})
                            </TabsTrigger>
                            <TabsTrigger value="favorite">
                                Favoris ({favoriteHistory.length})
                            </TabsTrigger>
                            <TabsTrigger value="compare">
                                Comparaisons ({compareHistory.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <div className="space-y-4">
                                {filteredHistory.map(item => (
                                    <HistoryCard key={item.id} item={item} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="search">
                            <div className="space-y-4">
                                {searchHistory.map(item => (
                                    <HistoryCard key={item.id} item={item} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="view">
                            <div className="space-y-4">
                                {viewHistory.map(item => (
                                    <HistoryCard key={item.id} item={item} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="favorite">
                            <div className="space-y-4">
                                {favoriteHistory.map(item => (
                                    <HistoryCard key={item.id} item={item} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="compare">
                            <div className="space-y-4">
                                {compareHistory.map(item => (
                                    <HistoryCard key={item.id} item={item} />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </UserLayout>
    )
}

interface HistoryCardProps {
    item: HistoryItem
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item }) => {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case "search":
                return <Search className="h-4 w-4" />
            case "view":
                return <Eye className="h-4 w-4" />
            case "favorite":
                return <Heart className="h-4 w-4" />
            case "compare":
                return <BarChart3 className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "search":
                return <Badge variant="outline">Recherche</Badge>
            case "view":
                return <Badge variant="secondary">Consultation</Badge>
            case "favorite":
                return <Badge variant="default">Favori</Badge>
            case "compare":
                return <Badge variant="destructive">Comparaison</Badge>
            default:
                return <Badge variant="outline">Autre</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60)
        )

        if (diffInHours < 1) {
            return "Il y a moins d'une heure"
        } else if (diffInHours < 24) {
            return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            if (diffInDays < 7) {
                return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
            } else {
                return date.toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            }
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">{getTypeIcon(item.type)}</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{item.title}</h3>
                                {getTypeBadge(item.type)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                {item.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{formatDate(item.timestamp)}</span>
                                {item.metadata?.category && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {item.metadata.category}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserHistoryPage

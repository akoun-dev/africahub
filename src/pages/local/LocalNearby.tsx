import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    MapPin,
    Star,
    Phone,
    Clock,
    Navigation,
    Search,
    Filter,
    Store,
} from "lucide-react"

const LocalNearby: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    // Données simulées des commerces à proximité
    const nearbyBusinesses = [
        {
            id: 1,
            name: "Pharmacie du Centre",
            category: "Santé",
            address: "123 Avenue de la République, Abidjan",
            distance: "0.2 km",
            rating: 4.5,
            reviews: 89,
            phone: "+225 01 23 45 67",
            hours: "8h00 - 20h00",
            isOpen: true,
            services: ["Médicaments", "Conseil", "Livraison"],
        },
        {
            id: 2,
            name: "Supermarché Prosuma",
            category: "Commerce",
            address: "456 Boulevard Lagunaire, Abidjan",
            distance: "0.5 km",
            rating: 4.2,
            reviews: 156,
            phone: "+225 01 23 45 68",
            hours: "7h00 - 22h00",
            isOpen: true,
            services: ["Alimentation", "Électronique", "Vêtements"],
        },
        {
            id: 3,
            name: "Garage Auto Plus",
            category: "Automobile",
            address: "789 Rue des Mécaniciens, Abidjan",
            distance: "0.8 km",
            rating: 4.7,
            reviews: 234,
            phone: "+225 01 23 45 69",
            hours: "8h00 - 18h00",
            isOpen: true,
            services: ["Réparation", "Entretien", "Pièces détachées"],
        },
        {
            id: 4,
            name: "Restaurant Le Palmier",
            category: "Restauration",
            address: "321 Avenue du Général, Abidjan",
            distance: "1.2 km",
            rating: 4.3,
            reviews: 78,
            phone: "+225 01 23 45 70",
            hours: "11h00 - 23h00",
            isOpen: false,
            services: ["Cuisine locale", "Livraison", "Terrasse"],
        },
        {
            id: 5,
            name: "Banque Atlantique",
            category: "Banque",
            address: "654 Place de la Paix, Abidjan",
            distance: "1.5 km",
            rating: 4.1,
            reviews: 45,
            phone: "+225 01 23 45 71",
            hours: "8h00 - 16h00",
            isOpen: true,
            services: ["Comptes", "Crédits", "Change"],
        },
        {
            id: 6,
            name: "Salon de Coiffure Élégance",
            category: "Beauté",
            address: "987 Rue de la Mode, Abidjan",
            distance: "2.0 km",
            rating: 4.6,
            reviews: 112,
            phone: "+225 01 23 45 72",
            hours: "9h00 - 19h00",
            isOpen: true,
            services: ["Coiffure", "Manucure", "Soins"],
        },
    ]

    const categories = [
        { id: "all", name: "Tous", count: nearbyBusinesses.length },
        { id: "sante", name: "Santé", count: 1 },
        { id: "commerce", name: "Commerce", count: 1 },
        { id: "automobile", name: "Automobile", count: 1 },
        { id: "restauration", name: "Restauration", count: 1 },
        { id: "banque", name: "Banque", count: 1 },
        { id: "beaute", name: "Beauté", count: 1 },
    ]

    const filteredBusinesses = nearbyBusinesses.filter(business => {
        const matchesSearch =
            business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory =
            selectedCategory === "all" ||
            business.category.toLowerCase() === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section avec couleur bleue */}
            <div className="bg-gradient-to-r from-[#2D4A6B] to-[#3A5A7A] text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center mb-4">
                            <MapPin className="w-12 h-12 text-white mr-4" />
                            <h1 className="text-4xl font-bold">
                                Commerces à Proximité
                            </h1>
                        </div>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Trouvez les commerces et services près de chez vous
                        </p>
                    </div>
                </div>
            </div>

            <main className="py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Barre de recherche et filtres */}
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Rechercher un commerce ou service..."
                                            value={searchQuery}
                                            onChange={e =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button variant="outline">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filtres
                                    </Button>
                                    <Button variant="outline">
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Ma position
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Catégories */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {categories.map(category => (
                                <Button
                                    key={category.id}
                                    variant={
                                        selectedCategory === category.id
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        setSelectedCategory(category.id)
                                    }
                                    className="flex items-center gap-2"
                                >
                                    {category.name}
                                    <Badge variant="secondary" className="ml-1">
                                        {category.count}
                                    </Badge>
                                </Button>
                            ))}
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Store className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        {filteredBusinesses.length}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Commerces trouvés
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <MapPin className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        2.5km
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Rayon de recherche
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Clock className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        {
                                            filteredBusinesses.filter(
                                                b => b.isOpen
                                            ).length
                                        }
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Ouverts maintenant
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Star className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        4.4
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Note moyenne
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Liste des commerces */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredBusinesses.map(business => (
                                <Card
                                    key={business.id}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {business.name}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline">
                                                        {business.category}
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            business.isOpen
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className={
                                                            business.isOpen
                                                                ? "bg-[#2D4A6B] text-white"
                                                                : "bg-gray-500"
                                                        }
                                                    >
                                                        {business.isOpen
                                                            ? "Ouvert"
                                                            : "Fermé"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="font-medium">
                                                        {business.rating}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    ({business.reviews} avis)
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    {business.address}
                                                </p>
                                                <p className="text-sm font-medium text-[#2D4A6B]">
                                                    {business.distance}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm text-gray-700">
                                                {business.phone}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm text-gray-700">
                                                {business.hours}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-2">
                                                Services :
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {business.services.map(
                                                    (service, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {service}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                className="flex-1 bg-[#2D4A6B] hover:bg-[#1F3A5F] text-white"
                                                size="sm"
                                            >
                                                Voir les détails
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white group"
                                            >
                                                <Navigation className="w-4 h-4 text-[#2D4A6B] group-hover:text-white" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white group"
                                            >
                                                <Phone className="w-4 h-4 text-[#2D4A6B] group-hover:text-white" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Message si aucun résultat */}
                        {filteredBusinesses.length === 0 && (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        Aucun commerce trouvé
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Essayez de modifier vos critères de
                                        recherche ou d'élargir la zone
                                    </p>
                                    <Button
                                        className="bg-[#2D4A6B] hover:bg-[#1F3A5F] text-white"
                                        onClick={() => {
                                            setSearchQuery("")
                                            setSelectedCategory("all")
                                        }}
                                    >
                                        Réinitialiser les filtres
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LocalNearby

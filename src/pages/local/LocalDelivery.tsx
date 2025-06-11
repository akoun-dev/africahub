import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Truck,
    Star,
    Clock,
    MapPin,
    Package,
    DollarSign,
    Phone,
} from "lucide-react"

const LocalDelivery: React.FC = () => {
    const [selectedService, setSelectedService] = useState("all")

    // Données simulées des services de livraison
    const deliveryServices = [
        {
            id: 1,
            name: "Jumia Express",
            category: "E-commerce",
            rating: 4.5,
            reviews: 2847,
            deliveryTime: "30-60 min",
            minOrder: "10 USD",
            deliveryFee: "2 USD",
            coverage: "Toute la ville",
            phone: "+225 01 23 45 67",
            services: [
                "Livraison rapide",
                "Suivi en temps réel",
                "Paiement à la livraison",
            ],
            isAvailable: true,
        },
        {
            id: 2,
            name: "Glovo Côte d'Ivoire",
            category: "Multi-services",
            rating: 4.3,
            reviews: 1523,
            deliveryTime: "20-45 min",
            minOrder: "5 USD",
            deliveryFee: "1.5 USD",
            coverage: "Centre-ville",
            phone: "+225 01 23 45 68",
            services: ["Restaurants", "Pharmacies", "Supermarchés", "Courses"],
            isAvailable: true,
        },
        {
            id: 3,
            name: "Uber Eats",
            category: "Restauration",
            rating: 4.2,
            reviews: 3156,
            deliveryTime: "25-50 min",
            minOrder: "8 USD",
            deliveryFee: "2.5 USD",
            coverage: "Zones principales",
            phone: "+225 01 23 45 69",
            services: [
                "Restaurants partenaires",
                "Livraison rapide",
                "Promotions",
            ],
            isAvailable: true,
        },
        {
            id: 4,
            name: "DHL Express",
            category: "Colis",
            rating: 4.7,
            reviews: 892,
            deliveryTime: "24-48h",
            minOrder: "0 USD",
            deliveryFee: "15 USD",
            coverage: "International",
            phone: "+225 01 23 45 70",
            services: ["Livraison internationale", "Suivi", "Assurance"],
            isAvailable: true,
        },
        {
            id: 5,
            name: "Pharmacie Express",
            category: "Santé",
            rating: 4.6,
            reviews: 567,
            deliveryTime: "15-30 min",
            minOrder: "0 USD",
            deliveryFee: "1 USD",
            coverage: "Abidjan",
            phone: "+225 01 23 45 71",
            services: ["Médicaments", "Urgences", "Conseil pharmaceutique"],
            isAvailable: true,
        },
        {
            id: 6,
            name: "Fresh Market",
            category: "Alimentation",
            rating: 4.4,
            reviews: 1234,
            deliveryTime: "45-90 min",
            minOrder: "15 USD",
            deliveryFee: "3 USD",
            coverage: "Grand Abidjan",
            phone: "+225 01 23 45 72",
            services: ["Produits frais", "Épicerie", "Livraison programmée"],
            isAvailable: false,
        },
    ]

    const categories = [
        { id: "all", name: "Tous", count: deliveryServices.length },
        { id: "e-commerce", name: "E-commerce", count: 1 },
        { id: "multi-services", name: "Multi-services", count: 1 },
        { id: "restauration", name: "Restauration", count: 1 },
        { id: "colis", name: "Colis", count: 1 },
        { id: "sante", name: "Santé", count: 1 },
        { id: "alimentation", name: "Alimentation", count: 1 },
    ]

    const filteredServices = deliveryServices.filter(service => {
        return (
            selectedService === "all" ||
            service.category.toLowerCase().replace(/[^a-z]/g, "") ===
                selectedService.replace("-", "")
        )
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section avec couleur bleue */}
            <div className="bg-gradient-to-r from-[#2D4A6B] to-[#3A5A7A] text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Truck className="w-12 h-12 text-white mr-4" />
                            <h1 className="text-4xl font-bold">
                                Services de Livraison
                            </h1>
                        </div>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Trouvez le service de livraison qui vous convient
                        </p>
                    </div>
                </div>
            </div>

            <main className="py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Statistiques */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Truck className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        {filteredServices.length}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Services disponibles
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Clock className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        35min
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Temps moyen
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <DollarSign className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        2.1 USD
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Frais moyens
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

                        {/* Catégories */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {categories.map(category => (
                                <Button
                                    key={category.id}
                                    variant={
                                        selectedService === category.id
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        setSelectedService(category.id)
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

                        {/* Services de livraison */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredServices.map(service => (
                                <Card
                                    key={service.id}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {service.name}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline">
                                                        {service.category}
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            service.isAvailable
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className={
                                                            service.isAvailable
                                                                ? "bg-[#2D4A6B] text-white"
                                                                : "bg-gray-500"
                                                        }
                                                    >
                                                        {service.isAvailable
                                                            ? "Disponible"
                                                            : "Indisponible"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="font-medium">
                                                        {service.rating}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    ({service.reviews} avis)
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    {service.deliveryTime}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    {service.deliveryFee}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    Min: {service.minOrder}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="text-xs">
                                                    {service.coverage}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm text-gray-700">
                                                {service.phone}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-2">
                                                Services :
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {service.services.map(
                                                    (serviceItem, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {serviceItem}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                className="flex-1 bg-[#2D4A6B] hover:bg-[#1F3A5F] text-white disabled:bg-gray-400"
                                                size="sm"
                                                disabled={!service.isAvailable}
                                            >
                                                {service.isAvailable
                                                    ? "Commander"
                                                    : "Indisponible"}
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

                        {/* Conseils */}
                        <Card className="mt-12">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Package className="w-5 h-5 mr-2 text-[#2D4A6B]" />
                                    Conseils pour vos livraisons
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <Clock className="w-8 h-8 text-[#2D4A6B] mx-auto mb-3" />
                                        <h3 className="font-semibold mb-2">
                                            Commandez aux bonnes heures
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Évitez les heures de pointe
                                            (12h-14h, 19h-21h) pour des
                                            livraisons plus rapides
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <MapPin className="w-8 h-8 text-[#2D4A6B] mx-auto mb-3" />
                                        <h3 className="font-semibold mb-2">
                                            Vérifiez la zone de livraison
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Assurez-vous que votre adresse est
                                            dans la zone de couverture du
                                            service
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <DollarSign className="w-8 h-8 text-[#2D4A6B] mx-auto mb-3" />
                                        <h3 className="font-semibold mb-2">
                                            Comparez les tarifs
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Les frais de livraison varient selon
                                            le service et la distance
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LocalDelivery

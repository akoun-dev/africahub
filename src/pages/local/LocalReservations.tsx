import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Calendar,
    Star,
    Clock,
    MapPin,
    Users,
    Phone,
    CheckCircle,
} from "lucide-react"

const LocalReservations: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedDate, setSelectedDate] = useState("")

    // Données simulées des services avec réservation
    const reservationServices = [
        {
            id: 1,
            name: "Restaurant Le Palmier",
            category: "Restauration",
            rating: 4.5,
            reviews: 234,
            address: "123 Avenue de la République, Abidjan",
            phone: "+225 01 23 45 67",
            openHours: "11h00 - 23h00",
            capacity: 80,
            priceRange: "15-45 USD",
            features: ["Terrasse", "Climatisé", "Parking", "WiFi"],
            availableSlots: ["12:00", "13:30", "19:00", "20:30"],
            isOpen: true,
            acceptsReservations: true,
        },
        {
            id: 2,
            name: "Salon de Coiffure Élégance",
            category: "Beauté",
            rating: 4.7,
            reviews: 156,
            address: "456 Rue de la Mode, Abidjan",
            phone: "+225 01 23 45 68",
            openHours: "9h00 - 19h00",
            capacity: 6,
            priceRange: "10-50 USD",
            features: ["Coiffure", "Manucure", "Soins", "Maquillage"],
            availableSlots: ["09:00", "11:00", "14:00", "16:00"],
            isOpen: true,
            acceptsReservations: true,
        },
        {
            id: 3,
            name: "Clinique Santé Plus",
            category: "Santé",
            rating: 4.3,
            reviews: 89,
            address: "789 Boulevard de la Santé, Abidjan",
            phone: "+225 01 23 45 69",
            openHours: "8h00 - 18h00",
            capacity: 20,
            priceRange: "25-100 USD",
            features: ["Consultation", "Analyses", "Radiologie", "Urgences"],
            availableSlots: ["08:30", "10:00", "14:00", "16:30"],
            isOpen: true,
            acceptsReservations: true,
        },
        {
            id: 4,
            name: "Garage Auto Expert",
            category: "Automobile",
            rating: 4.6,
            reviews: 178,
            address: "321 Zone Industrielle, Abidjan",
            phone: "+225 01 23 45 70",
            openHours: "8h00 - 17h00",
            capacity: 4,
            priceRange: "30-200 USD",
            features: ["Réparation", "Entretien", "Diagnostic", "Pièces"],
            availableSlots: ["08:00", "10:00", "13:00", "15:00"],
            isOpen: true,
            acceptsReservations: true,
        },
        {
            id: 5,
            name: "Centre de Fitness Pro",
            category: "Sport",
            rating: 4.4,
            reviews: 267,
            address: "654 Avenue du Sport, Abidjan",
            phone: "+225 01 23 45 71",
            openHours: "6h00 - 22h00",
            capacity: 50,
            priceRange: "5-25 USD",
            features: ["Musculation", "Cardio", "Cours collectifs", "Piscine"],
            availableSlots: ["07:00", "12:00", "17:00", "19:00"],
            isOpen: true,
            acceptsReservations: true,
        },
        {
            id: 6,
            name: "Hôtel Ivoire Business",
            category: "Hôtellerie",
            rating: 4.2,
            reviews: 445,
            address: "987 Plateau, Abidjan",
            phone: "+225 01 23 45 72",
            openHours: "24h/24",
            capacity: 120,
            priceRange: "80-300 USD",
            features: [
                "Chambres",
                "Restaurant",
                "Piscine",
                "Spa",
                "Salle de conférence",
            ],
            availableSlots: ["Flexible"],
            isOpen: true,
            acceptsReservations: true,
        },
    ]

    const categories = [
        { id: "all", name: "Tous", count: reservationServices.length },
        { id: "restauration", name: "Restaurants", count: 1 },
        { id: "beaute", name: "Beauté", count: 1 },
        { id: "sante", name: "Santé", count: 1 },
        { id: "automobile", name: "Automobile", count: 1 },
        { id: "sport", name: "Sport", count: 1 },
        { id: "hotellerie", name: "Hôtels", count: 1 },
    ]

    const filteredServices = reservationServices.filter(service => {
        return (
            selectedCategory === "all" ||
            service.category.toLowerCase() === selectedCategory
        )
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section avec couleur bleue */}
            <div className="bg-gradient-to-r from-[#2D4A6B] to-[#3A5A7A] text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Calendar className="w-12 h-12 text-white mr-4" />
                            <h1 className="text-4xl font-bold">Réservations</h1>
                        </div>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Réservez facilement vos services préférés
                        </p>
                    </div>
                </div>
            </div>

            <main className="py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Filtre par date */}
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sélectionner une date
                                        </label>
                                        <Input
                                            type="date"
                                            value={selectedDate}
                                            onChange={e =>
                                                setSelectedDate(e.target.value)
                                            }
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-[#2D4A6B]" />
                                        <span className="text-sm text-gray-600">
                                            Réservation instantanée disponible
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistiques */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Calendar className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
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
                                        24
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Créneaux aujourd'hui
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Users className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        280
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Places disponibles
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Star className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        4.5
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

                        {/* Services avec réservation */}
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
                                                            service.acceptsReservations
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className={
                                                            service.acceptsReservations
                                                                ? "bg-[#2D4A6B] text-white"
                                                                : "bg-gray-500"
                                                        }
                                                    >
                                                        {service.acceptsReservations
                                                            ? "Réservable"
                                                            : "Non réservable"}
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
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                            <p className="text-sm text-gray-700">
                                                {service.address}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>{service.openHours}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    {service.capacity} places
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
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                                Prix : {service.priceRange}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-2">
                                                Créneaux disponibles :
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {service.availableSlots.map(
                                                    (slot, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {slot}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-2">
                                                Services :
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {service.features
                                                    .slice(0, 3)
                                                    .map((feature, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                {service.features.length >
                                                    3 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {service.features
                                                            .length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                className="flex-1 bg-[#2D4A6B] hover:bg-[#1F3A5F] text-white disabled:bg-gray-400"
                                                size="sm"
                                                disabled={
                                                    !service.acceptsReservations
                                                }
                                            >
                                                {service.acceptsReservations
                                                    ? "Réserver"
                                                    : "Indisponible"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white"
                                            >
                                                <Phone className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Conseils pour les réservations */}
                        <Card className="mt-12">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-[#2D4A6B]" />
                                    Conseils pour vos réservations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <Clock className="w-8 h-8 text-[#2D4A6B] mx-auto mb-3" />
                                        <h3 className="font-semibold mb-2">
                                            Réservez à l'avance
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Pour les services populaires,
                                            réservez 24-48h à l'avance
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Phone className="w-8 h-8 text-[#2D4A6B] mx-auto mb-3" />
                                        <h3 className="font-semibold mb-2">
                                            Confirmez par téléphone
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Appelez pour confirmer votre
                                            réservation et éviter les
                                            malentendus
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <CheckCircle className="w-8 h-8 text-[#2D4A6B] mx-auto mb-3" />
                                        <h3 className="font-semibold mb-2">
                                            Respectez les horaires
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Arrivez à l'heure pour respecter le
                                            planning du service
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

export default LocalReservations

// 🧪 Test du composant de vue détaillée unifiée
// Fichier de test pour vérifier l'affichage adaptatif selon les secteurs

import React from "react"
import ProductComparisonView from "./ProductComparisonView"

// Données de test pour différents secteurs
const testData = {
    // Test pour une banque
    bank: {
        id: 1,
        name: "Ecobank Transnational",
        sector: "banks" as const,
        description: "Plus grande banque panafricaine présente dans 33 pays africains",
        country: "Togo",
        countryCode: "TG",
        type: "commercial",
        established: 1985,
        headquarters: "Lomé",
        assets: "23.7B USD",
        branches: 1200,
        services: [
            "Comptes courants et épargne",
            "Crédits personnels et immobiliers",
            "Banque d'investissement",
            "Services aux entreprises",
            "Transferts internationaux",
            "Banque mobile",
        ],
        digitalBanking: true,
        mobileMoney: true,
        logo: "/images/banks/ecobank.png",
        website: "https://ecobank.com",
        rating: 4.2,
    },

    // Test pour un fournisseur d'énergie
    energy: {
        id: 2,
        name: "Compagnie Ivoirienne d'Électricité (CIE)",
        sector: "energy" as const,
        description: "Concessionnaire exclusif de la distribution d'électricité en Côte d'Ivoire",
        country: "Côte d'Ivoire",
        countryCode: "CI",
        type: "electricity",
        established: 1990,
        headquarters: "Abidjan",
        capacity: "2,200 MW",
        coverage: "85%",
        services: [
            "Distribution électricité",
            "Raccordement clients",
            "Maintenance réseau",
            "Services digitaux",
            "Éclairage public",
            "Conseil énergétique",
        ],
        renewable: false,
        logo: "/images/energy/cie.png",
        website: "https://cie.ci",
        rating: 4.1,
        pricePerKWh: 85,
        currency: "XOF",
        connectionFee: 25000,
        monthlyFee: 2500,
    },

    // Test pour un service télécom
    telecom: {
        id: 3,
        name: "Orange Côte d'Ivoire",
        sector: "telecom" as const,
        description: "Opérateur télécom leader en Côte d'Ivoire",
        country: "Côte d'Ivoire",
        countryCode: "CI",
        type: "postpaid",
        operatorName: "Orange",
        networkType: "4G/5G",
        speed: "100 Mbps",
        data: "50 GB",
        price: 15000,
        currency: "XOF",
        subscribers: 12,
        services: [
            "Appels illimités",
            "SMS illimités",
            "Internet 4G/5G",
            "Roaming international",
            "Services digitaux",
            "Orange Money",
        ],
        availableCountries: ["CI", "SN", "ML", "BF"],
        digitalOnly: false,
        logo: "/images/telecom/orange.png",
        website: "https://orange.ci",
        rating: 4.3,
    },

    // Test pour un produit classique
    product: {
        id: 4,
        name: "iPhone 15 Pro",
        sector: "products" as const,
        description: "Smartphone haut de gamme d'Apple avec puce A17 Pro",
        category: "Smartphones",
        image: "/images/products/iphone15pro.jpg",
        price: 650000,
        currency: "XOF",
        rating: 4.8,
        reviews: 1250,
        features: [
            "Écran Super Retina XDR 6.1 pouces",
            "Puce A17 Pro",
            "Système photo Pro 48 Mpx",
            "Autonomie jusqu'à 23h de vidéo",
            "Résistant à l'eau IP68",
            "Face ID",
        ],
        specifications: {
            "Écran": "6.1 pouces Super Retina XDR",
            "Processeur": "Puce A17 Pro",
            "Stockage": "128 GB",
            "Appareil photo": "48 Mpx + 12 Mpx + 12 Mpx",
            "Batterie": "Jusqu'à 23h de vidéo",
            "Système": "iOS 17",
        },
        offers: [
            {
                merchant: "Orange Store",
                price: 650000,
                currency: "XOF",
                shipping: 0,
                delivery: "Livraison gratuite en 24h",
                stock: "En stock",
                rating: 4.5,
                logo: "/images/merchants/orange-store.png",
                payment_methods: ["Orange Money", "Carte bancaire", "Espèces"],
                warranty: "Garantie 1 an",
            },
            {
                merchant: "Jumia CI",
                price: 675000,
                currency: "XOF",
                shipping: 5000,
                delivery: "Livraison en 2-3 jours",
                stock: "En stock",
                rating: 4.2,
                logo: "/images/merchants/jumia.png",
                payment_methods: ["Carte bancaire", "Mobile Money", "Paiement à la livraison"],
                warranty: "Garantie 1 an",
            },
        ],
        country_availability: ["CI", "SN", "MA", "TN"],
    },
}

// Composant de test
const UnifiedDetailViewTest: React.FC = () => {
    const [selectedSector, setSelectedSector] = React.useState<keyof typeof testData>("bank")
    const [favorites, setFavorites] = React.useState<string[]>([])
    const [comparing, setComparing] = React.useState<string[]>([])

    const handleToggleFavorite = (id: string) => {
        setFavorites(prev => 
            prev.includes(id) 
                ? prev.filter(fav => fav !== id)
                : [...prev, id]
        )
    }

    const handleToggleCompare = (id: string) => {
        setComparing(prev => 
            prev.includes(id) 
                ? prev.filter(comp => comp !== id)
                : [...prev, id]
        )
    }

    const currentData = testData[selectedSector]

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    🧪 Test de la Vue Détaillée Unifiée
                </h1>
                
                {/* Sélecteur de secteur */}
                <div className="mb-8 flex gap-4">
                    {Object.keys(testData).map((sector) => (
                        <button
                            key={sector}
                            onClick={() => setSelectedSector(sector as keyof typeof testData)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                selectedSector === sector
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {sector === "bank" ? "🏦 Banque" :
                             sector === "energy" ? "⚡ Énergie" :
                             sector === "telecom" ? "📱 Télécom" :
                             "📱 Produit"}
                        </button>
                    ))}
                </div>

                {/* Affichage du composant */}
                <ProductComparisonView
                    product={currentData}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleCompare={handleToggleCompare}
                    isFavorite={favorites.includes(currentData.id.toString())}
                    isComparing={comparing.includes(currentData.id.toString())}
                />
            </div>
        </div>
    )
}

export default UnifiedDetailViewTest

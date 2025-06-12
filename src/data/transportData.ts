// 🚌 Données des services de transport africains - AfricaHub
// Informations sur les compagnies de transport, airlines, et services de mobilité

// Interface pour définir une compagnie de transport
export interface TransportCompany {
    id: number
    name: string
    country: string
    countryCode: string
    type: "airline" | "bus" | "train" | "taxi" | "rideshare" | "logistics"
    established: number
    headquarters: string
    fleet: string // Nombre de véhicules/avions
    routes: string[] // Destinations principales
    services: string[]
    digitalBooking: boolean
    mobilePay: boolean
    logo: string
    website: string
    rating: number // Sur 5
    description: string
}

// Interface pour les routes de transport
export interface TransportRoute {
    id: number
    company: string
    type: "domestic" | "international" | "regional"
    origin: string
    destination: string
    duration: string
    price: number
    currency: string
    frequency: string // Par jour/semaine
    features: string[]
    bookingMethods: string[]
    availableDays: string[]
}

// Interface pour les services de livraison
export interface DeliveryService {
    id: number
    name: string
    type: "express" | "standard" | "economy" | "international"
    coverage: string[]
    maxWeight: string
    price: number
    currency: string
    deliveryTime: string
    tracking: boolean
    insurance: boolean
    features: string[]
}

// Données des principales compagnies de transport africaines
export const africanTransportCompanies: TransportCompany[] = [
    {
        id: 1,
        name: "Ethiopian Airlines",
        country: "Éthiopie",
        countryCode: "ET",
        type: "airline",
        established: 1945,
        headquarters: "Addis-Abeba",
        fleet: "140 avions",
        routes: [
            "Addis-Abeba - Lagos",
            "Addis-Abeba - Nairobi",
            "Addis-Abeba - Casablanca",
            "Addis-Abeba - Le Caire",
            "Addis-Abeba - Johannesburg",
        ],
        services: [
            "Vols domestiques et internationaux",
            "Cargo aérien",
            "Formation aéronautique",
            "Maintenance aéronautique",
            "Services VIP",
            "Programme de fidélité",
        ],
        digitalBooking: true,
        mobilePay: true,
        logo: "/images/transport/ethiopian-airlines.png",
        website: "https://ethiopianairlines.com",
        rating: 4.5,
        description:
            "Plus grande compagnie aérienne d'Afrique, hub continental majeur",
    },
    {
        id: 2,
        name: "Royal Air Maroc",
        country: "Maroc",
        countryCode: "MA",
        type: "airline",
        established: 1953,
        headquarters: "Casablanca",
        fleet: "60 avions",
        routes: [
            "Casablanca - Paris",
            "Casablanca - Madrid",
            "Casablanca - Dakar",
            "Casablanca - Abidjan",
            "Casablanca - New York",
        ],
        services: [
            "Vols internationaux",
            "Vols domestiques",
            "Cargo",
            "Maintenance",
            "Safar Flyer (fidélité)",
            "Services premium",
        ],
        digitalBooking: true,
        mobilePay: true,
        logo: "/images/transport/royal-air-maroc.png",
        website: "https://royalairmaroc.com",
        rating: 4.2,
        description:
            "Compagnie nationale du Maroc, porte d'entrée vers l'Afrique",
    },
    {
        id: 3,
        name: "SOTRA (Abidjan)",
        country: "Côte d'Ivoire",
        countryCode: "CI",
        type: "bus",
        established: 1960,
        headquarters: "Abidjan",
        fleet: "450 bus",
        routes: [
            "Plateau - Yopougon",
            "Cocody - Adjamé",
            "Treichville - Abobo",
            "Port-Bouët - Marcory",
        ],
        services: [
            "Transport urbain",
            "Bus climatisés",
            "Cartes de transport",
            "Applications mobiles",
            "Transport scolaire",
            "Lignes express",
        ],
        digitalBooking: false,
        mobilePay: true,
        logo: "/images/transport/sotra.png",
        website: "https://sotra.ci",
        rating: 3.8,
        description:
            "Société de transport public d'Abidjan, réseau principal de la ville",
    },
    {
        id: 4,
        name: "Uber Africa",
        country: "Multi-pays",
        countryCode: "ZA",
        type: "rideshare",
        established: 2013,
        headquarters: "Le Cap",
        fleet: "50,000+ chauffeurs",
        routes: [
            "Services urbains",
            "Aéroports",
            "Livraisons",
            "Transport inter-villes",
        ],
        services: [
            "UberX",
            "Uber Black",
            "Uber Eats",
            "Uber Intercity",
            "Uber Business",
            "Paiement mobile",
        ],
        digitalBooking: true,
        mobilePay: true,
        logo: "/images/transport/uber.png",
        website: "https://uber.com",
        rating: 4.3,
        description:
            "Service de VTC présent dans les principales villes africaines",
    },
    {
        id: 5,
        name: "DHL Express Africa",
        country: "Multi-pays",
        countryCode: "ZA",
        type: "logistics",
        established: 1969,
        headquarters: "Johannesburg",
        fleet: "500+ véhicules",
        routes: [
            "Express international",
            "Livraisons domestiques",
            "Solutions e-commerce",
            "Transport médical",
        ],
        services: [
            "Express international",
            "Livraison le jour même",
            "Solutions e-commerce",
            "Transport médical",
            "Douane et formalités",
            "Suivi en temps réel",
        ],
        digitalBooking: true,
        mobilePay: true,
        logo: "/images/transport/dhl.png",
        website: "https://dhl.com",
        rating: 4.4,
        description: "Leader mondial de la logistique express en Afrique",
    },
]

// Routes de transport populaires
export const transportRoutes: TransportRoute[] = [
    {
        id: 1,
        company: "Ethiopian Airlines",
        type: "international",
        origin: "Addis-Abeba",
        destination: "Lagos",
        duration: "4h 30min",
        price: 450,
        currency: "USD",
        frequency: "2 vols/jour",
        features: ["Repas inclus", "Bagages 23kg", "Divertissement", "WiFi"],
        bookingMethods: ["Site web", "Application", "Agences"],
        availableDays: ["Lundi", "Mercredi", "Vendredi", "Dimanche"],
    },
    {
        id: 2,
        company: "Royal Air Maroc",
        type: "international",
        origin: "Casablanca",
        destination: "Dakar",
        duration: "2h 45min",
        price: 280,
        currency: "USD",
        frequency: "1 vol/jour",
        features: ["Repas léger", "Bagages 20kg", "Programme fidélité"],
        bookingMethods: ["Site web", "Application", "Agences"],
        availableDays: ["Tous les jours"],
    },
    {
        id: 3,
        company: "SOTRA",
        type: "domestic",
        origin: "Plateau",
        destination: "Yopougon",
        duration: "45min",
        price: 200,
        currency: "XOF",
        frequency: "Toutes les 10min",
        features: ["Climatisation", "Carte de transport", "Accessibilité PMR"],
        bookingMethods: ["Guichets", "Cartes prépayées"],
        availableDays: ["Lundi au Dimanche"],
    },
]

// Services de livraison disponibles
export const deliveryServices: DeliveryService[] = [
    {
        id: 1,
        name: "DHL Express",
        type: "express",
        coverage: ["CI", "SN", "MA", "NG", "KE", "ZA"],
        maxWeight: "70 kg",
        price: 25000,
        currency: "XOF",
        deliveryTime: "24-48h",
        tracking: true,
        insurance: true,
        features: [
            "Suivi en temps réel",
            "Assurance incluse",
            "Signature électronique",
            "Service client 24/7",
            "Livraison le samedi",
        ],
    },
    {
        id: 2,
        name: "Jumia Express",
        type: "standard",
        coverage: ["CI", "SN", "NG", "KE", "MA", "EG"],
        maxWeight: "30 kg",
        price: 2500,
        currency: "XOF",
        deliveryTime: "2-5 jours",
        tracking: true,
        insurance: false,
        features: [
            "Livraison à domicile",
            "Points de retrait",
            "Paiement à la livraison",
            "Application mobile",
            "Service client",
        ],
    },
    {
        id: 3,
        name: "Gozem Delivery",
        type: "express",
        coverage: ["CI", "SN", "TG", "BJ"],
        maxWeight: "20 kg",
        price: 1500,
        currency: "XOF",
        deliveryTime: "2-4h",
        tracking: true,
        insurance: false,
        features: [
            "Livraison le jour même",
            "Suivi GPS",
            "Paiement mobile",
            "Service local",
            "Tarifs compétitifs",
        ],
    },
    {
        id: 4,
        name: "Aramex Africa",
        type: "international",
        coverage: ["MA", "EG", "ZA", "KE", "NG"],
        maxWeight: "50 kg",
        price: 15000,
        currency: "XOF",
        deliveryTime: "3-7 jours",
        tracking: true,
        insurance: true,
        features: [
            "Express international",
            "Dédouanement inclus",
            "Assurance complète",
            "Réseau mondial",
            "Solutions e-commerce",
        ],
    },
]

// Fonctions utilitaires
export const getCompaniesByCountry = (
    countryCode: string
): TransportCompany[] => {
    return africanTransportCompanies.filter(
        company =>
            company.countryCode === countryCode ||
            company.country.includes("Multi-pays")
    )
}

export const getCompaniesByType = (
    type: TransportCompany["type"]
): TransportCompany[] => {
    return africanTransportCompanies.filter(company => company.type === type)
}

export const getCompaniesWithDigitalBooking = (): TransportCompany[] => {
    return africanTransportCompanies.filter(company => company.digitalBooking)
}

export const getRoutesByCompany = (companyName: string): TransportRoute[] => {
    return transportRoutes.filter(route =>
        route.company.toLowerCase().includes(companyName.toLowerCase())
    )
}

export const getRoutesByType = (
    type: TransportRoute["type"]
): TransportRoute[] => {
    return transportRoutes.filter(route => route.type === type)
}

export const getDeliveryServicesByType = (
    type: DeliveryService["type"]
): DeliveryService[] => {
    return deliveryServices.filter(service => service.type === type)
}

export const getDeliveryServicesByCoverage = (
    countryCode: string
): DeliveryService[] => {
    return deliveryServices.filter(service =>
        service.coverage.includes(countryCode)
    )
}

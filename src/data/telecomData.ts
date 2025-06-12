// 📱 Données des opérateurs télécoms africains - AfricaHub
// Informations sur les opérateurs mobiles, internet et services télécoms

// Interface pour définir un opérateur télécom
export interface TelecomOperator {
    id: number
    name: string
    country: string
    countryCode: string
    type: "mobile" | "fixed" | "internet" | "satellite" | "mixed"
    established: number
    headquarters: string
    subscribers: string // En millions
    marketShare: number // En pourcentage
    coverage: string // Pourcentage de couverture
    services: string[]
    technologies: string[] // 2G, 3G, 4G, 5G, Fiber
    mobileMoney: boolean
    logo: string
    website: string
    rating: number // Sur 5
    description: string
}

// Interface pour les forfaits mobiles
export interface MobilePlan {
    id: number
    operatorName: string
    name: string
    type: "prepaid" | "postpaid"
    price: number
    currency: string
    validity: number // En jours
    data: string // En GB ou illimité
    voice: string // Minutes ou illimité
    sms: string // Nombre ou illimité
    features: string[]
    roaming: boolean
    availableCountries: string[]
}

// Interface pour les services internet
export interface InternetService {
    id: number
    provider: string
    name: string
    type: "fiber" | "adsl" | "4g" | "5g" | "satellite"
    speed: string // En Mbps
    price: number
    currency: string
    installationFee: number
    monthlyFee: number
    dataLimit?: string
    features: string[]
    availableRegions: string[]
}

// Données des principaux opérateurs télécoms africains
export const africanTelecomOperators: TelecomOperator[] = [
    {
        id: 1,
        name: "MTN Group",
        country: "Afrique du Sud",
        countryCode: "ZA",
        type: "mobile",
        established: 1994,
        headquarters: "Johannesburg",
        subscribers: "280M",
        marketShare: 35,
        coverage: "95%",
        services: [
            "Téléphonie mobile",
            "Internet mobile",
            "Mobile Money",
            "Services aux entreprises",
            "Roaming international",
            "Services digitaux",
        ],
        technologies: ["2G", "3G", "4G", "5G"],
        mobileMoney: true,
        logo: "/images/telecom/mtn.png",
        website: "https://mtn.com",
        rating: 4.2,
        description:
            "Plus grand opérateur mobile d'Afrique, présent dans 21 pays",
    },
    {
        id: 2,
        name: "Orange Africa & Middle East",
        country: "France/Afrique",
        countryCode: "FR",
        type: "mixed",
        established: 1988,
        headquarters: "Paris/Casablanca",
        subscribers: "130M",
        marketShare: 25,
        coverage: "90%",
        services: [
            "Téléphonie mobile et fixe",
            "Internet haut débit",
            "Orange Money",
            "Services cloud",
            "Télévision numérique",
            "Solutions entreprises",
        ],
        technologies: ["2G", "3G", "4G", "5G", "Fiber"],
        mobileMoney: true,
        logo: "/images/telecom/orange.png",
        website: "https://orange.com",
        rating: 4.4,
        description: "Opérateur historique présent dans 18 pays africains",
    },
    {
        id: 3,
        name: "Airtel Africa",
        country: "Inde/Afrique",
        countryCode: "IN",
        type: "mobile",
        established: 2010,
        headquarters: "Londres/Lagos",
        subscribers: "140M",
        marketShare: 20,
        coverage: "85%",
        services: [
            "Téléphonie mobile",
            "Internet 4G",
            "Airtel Money",
            "Services aux entreprises",
            "Roaming",
            "Solutions IoT",
        ],
        technologies: ["2G", "3G", "4G"],
        mobileMoney: true,
        logo: "/images/telecom/airtel.png",
        website: "https://airtel.africa",
        rating: 4.0,
        description:
            "Troisième opérateur mobile d'Afrique, présent dans 14 pays",
    },
    {
        id: 4,
        name: "Maroc Telecom",
        country: "Maroc",
        countryCode: "MA",
        type: "mixed",
        established: 1998,
        headquarters: "Rabat",
        subscribers: "70M",
        marketShare: 45,
        coverage: "99%",
        services: [
            "Téléphonie mobile et fixe",
            "Internet ADSL/Fiber",
            "Télévision IPTV",
            "Services cloud",
            "Solutions entreprises",
            "Roaming international",
        ],
        technologies: ["2G", "3G", "4G", "5G", "Fiber", "ADSL"],
        mobileMoney: false,
        logo: "/images/telecom/maroc-telecom.png",
        website: "https://iam.ma",
        rating: 4.1,
        description:
            "Opérateur historique du Maroc, leader des télécoms au Maghreb",
    },
    {
        id: 5,
        name: "Safaricom",
        country: "Kenya",
        countryCode: "KE",
        type: "mobile",
        established: 1997,
        headquarters: "Nairobi",
        subscribers: "42M",
        marketShare: 65,
        coverage: "96%",
        services: [
            "Téléphonie mobile",
            "Internet 4G/5G",
            "M-Pesa (Mobile Money)",
            "Services financiers",
            "IoT et solutions entreprises",
            "Services cloud",
        ],
        technologies: ["2G", "3G", "4G", "5G"],
        mobileMoney: true,
        logo: "/images/telecom/safaricom.png",
        website: "https://safaricom.co.ke",
        rating: 4.6,
        description:
            "Leader kenyan des télécoms, pionnier du mobile money avec M-Pesa",
    },
]

// Forfaits mobiles populaires
export const mobilePlans: MobilePlan[] = [
    {
        id: 1,
        operatorName: "MTN",
        name: "MTN Smart 5GB",
        type: "prepaid",
        price: 5000,
        currency: "XOF",
        validity: 30,
        data: "5 GB",
        voice: "100 min",
        sms: "100 SMS",
        features: [
            "Réseaux sociaux gratuits",
            "Bonus week-end",
            "Roaming CEDEAO",
        ],
        roaming: true,
        availableCountries: ["CI", "SN", "ML", "BF", "GH"],
    },
    {
        id: 2,
        operatorName: "Orange",
        name: "Orange Maxi 10GB",
        type: "postpaid",
        price: 15000,
        currency: "XOF",
        validity: 30,
        data: "10 GB",
        voice: "Illimité",
        sms: "Illimité",
        features: [
            "4G+",
            "Orange Money inclus",
            "Roaming international",
            "Hotspot WiFi",
        ],
        roaming: true,
        availableCountries: ["CI", "SN", "ML", "BF", "CM"],
    },
    {
        id: 3,
        operatorName: "Airtel",
        name: "Airtel Data Plus",
        type: "prepaid",
        price: 3000,
        currency: "XOF",
        validity: 7,
        data: "2 GB",
        voice: "50 min",
        sms: "50 SMS",
        features: ["Bonus nuit", "Réseaux sociaux", "Airtel Money"],
        roaming: false,
        availableCountries: ["CI", "NG", "KE", "TZ"],
    },
]

// Services internet disponibles
export const internetServices: InternetService[] = [
    {
        id: 1,
        provider: "Orange",
        name: "Orange Fiber 100Mbps",
        type: "fiber",
        speed: "100 Mbps",
        price: 35000,
        currency: "XOF",
        installationFee: 50000,
        monthlyFee: 35000,
        features: [
            "Débit symétrique",
            "TV Orange incluse",
            "WiFi 6 inclus",
            "Support technique 24/7",
            "Installation gratuite",
        ],
        availableRegions: ["CI-Abidjan", "SN-Dakar", "CM-Douala"],
    },
    {
        id: 2,
        provider: "MTN",
        name: "MTN 4G Home 50GB",
        type: "4g",
        speed: "25 Mbps",
        price: 25000,
        currency: "XOF",
        installationFee: 15000,
        monthlyFee: 25000,
        dataLimit: "50 GB",
        features: [
            "Routeur 4G inclus",
            "Connexion jusqu'à 32 appareils",
            "Bonus nuit illimité",
            "Installation rapide",
        ],
        availableRegions: ["CI", "SN", "ML", "BF", "GH"],
    },
    {
        id: 3,
        provider: "Maroc Telecom",
        name: "ADSL 20 Mega",
        type: "adsl",
        speed: "20 Mbps",
        price: 299,
        currency: "MAD",
        installationFee: 200,
        monthlyFee: 299,
        features: [
            "Ligne téléphonique incluse",
            "Modem WiFi gratuit",
            "Appels nationaux illimités",
            "Support technique",
        ],
        availableRegions: ["MA"],
    },
    {
        id: 4,
        provider: "Safaricom",
        name: "Safaricom Home Fiber",
        type: "fiber",
        speed: "40 Mbps",
        price: 4999,
        currency: "KES",
        installationFee: 2500,
        monthlyFee: 4999,
        features: [
            "Données illimitées",
            "WiFi router inclus",
            "Installation gratuite",
            "Support 24/7",
        ],
        availableRegions: ["KE-Nairobi", "KE-Mombasa"],
    },
]

// Fonctions utilitaires
export const getOperatorsByCountry = (
    countryCode: string
): TelecomOperator[] => {
    return africanTelecomOperators.filter(
        operator =>
            operator.countryCode === countryCode ||
            operator.services.some(service => service.includes(countryCode))
    )
}

export const getOperatorsByType = (
    type: TelecomOperator["type"]
): TelecomOperator[] => {
    return africanTelecomOperators.filter(operator => operator.type === type)
}

export const getOperatorsWithMobileMoney = (): TelecomOperator[] => {
    return africanTelecomOperators.filter(operator => operator.mobileMoney)
}

export const getPlansByOperator = (operatorName: string): MobilePlan[] => {
    return mobilePlans.filter(plan =>
        plan.operatorName.toLowerCase().includes(operatorName.toLowerCase())
    )
}

export const getPlansByType = (type: MobilePlan["type"]): MobilePlan[] => {
    return mobilePlans.filter(plan => plan.type === type)
}

export const getInternetServicesByType = (
    type: InternetService["type"]
): InternetService[] => {
    return internetServices.filter(service => service.type === type)
}

export const getInternetServicesByProvider = (
    provider: string
): InternetService[] => {
    return internetServices.filter(service =>
        service.provider.toLowerCase().includes(provider.toLowerCase())
    )
}

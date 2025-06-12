// ⚡ Données des fournisseurs d'énergie africains - AfricaHub
// Informations sur les compagnies d'électricité, gaz et énergies renouvelables

// Interface pour définir un fournisseur d'énergie
export interface EnergyProvider {
    id: number
    name: string
    country: string
    countryCode: string
    type: "electricity" | "gas" | "solar" | "wind" | "hydro" | "mixed"
    established: number
    headquarters: string
    capacity: string // En MW ou GW
    coverage: string // Pourcentage de couverture nationale
    services: string[]
    renewable: boolean
    tariffs: EnergyTariff[]
    logo: string
    website: string
    rating: number // Sur 5
    description: string
}

// Interface pour les tarifs énergétiques
export interface EnergyTariff {
    id: number
    name: string
    type: "residential" | "commercial" | "industrial"
    pricePerKWh: number
    currency: string
    minimumConsumption: number
    connectionFee: number
    monthlyFee: number
    peakHours?: string
    offPeakDiscount?: number
    availableRegions: string[]
}

// Interface pour les solutions solaires
export interface SolarSolution {
    id: number
    name: string
    provider: string
    type: "residential" | "commercial" | "industrial"
    capacity: string // En kW
    price: number
    currency: string
    installation: boolean
    warranty: number // En années
    financing: boolean
    payback: number // En années
    features: string[]
    availableCountries: string[]
}

// Données des principaux fournisseurs d'énergie africains
export const africanEnergyProviders: EnergyProvider[] = [
    {
        id: 1,
        name: "Eskom Holdings",
        country: "Afrique du Sud",
        countryCode: "ZA",
        type: "mixed",
        established: 1923,
        headquarters: "Johannesburg",
        capacity: "44,000 MW",
        coverage: "95%",
        services: [
            "Production d'électricité",
            "Transport d'énergie",
            "Distribution",
            "Maintenance réseau",
            "Énergies renouvelables",
            "Services aux entreprises",
        ],
        renewable: true,
        tariffs: [],
        logo: "/images/energy/eskom.png",
        website: "https://eskom.co.za",
        rating: 3.8,
        description:
            "Plus grande compagnie d'électricité d'Afrique, fournit 95% de l'électricité sud-africaine",
    },
    {
        id: 2,
        name: "Compagnie Ivoirienne d'Électricité (CIE)",
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
        tariffs: [],
        logo: "/images/energy/cie.png",
        website: "https://cie.ci",
        rating: 4.1,
        description:
            "Concessionnaire exclusif de la distribution d'électricité en Côte d'Ivoire",
    },
    {
        id: 3,
        name: "Senelec",
        country: "Sénégal",
        countryCode: "SN",
        type: "electricity",
        established: 1983,
        headquarters: "Dakar",
        capacity: "1,300 MW",
        coverage: "78%",
        services: [
            "Production électricité",
            "Transport et distribution",
            "Raccordement réseau",
            "Maintenance",
            "Énergie solaire",
            "Services clients",
        ],
        renewable: true,
        tariffs: [],
        logo: "/images/energy/senelec.png",
        website: "https://senelec.sn",
        rating: 3.9,
        description:
            "Société nationale d'électricité du Sénégal, leader des énergies renouvelables",
    },
    {
        id: 4,
        name: "Office National de l'Électricité et de l'Eau Potable (ONEE)",
        country: "Maroc",
        countryCode: "MA",
        type: "mixed",
        established: 1963,
        headquarters: "Rabat",
        capacity: "10,500 MW",
        coverage: "99.5%",
        services: [
            "Production électricité",
            "Distribution eau et électricité",
            "Énergies renouvelables",
            "Dessalement eau de mer",
            "Services industriels",
            "Éclairage public",
        ],
        renewable: true,
        tariffs: [],
        logo: "/images/energy/onee.png",
        website: "https://onee.ma",
        rating: 4.3,
        description:
            "Opérateur national marocain, leader africain des énergies renouvelables",
    },
    {
        id: 5,
        name: "Kenya Power and Lighting Company (KPLC)",
        country: "Kenya",
        countryCode: "KE",
        type: "electricity",
        established: 1922,
        headquarters: "Nairobi",
        capacity: "2,800 MW",
        coverage: "75%",
        services: [
            "Distribution électricité",
            "Raccordement clients",
            "Maintenance réseau",
            "Énergie géothermique",
            "Services mobiles",
            "Prépaiement électricité",
        ],
        renewable: true,
        tariffs: [],
        logo: "/images/energy/kplc.png",
        website: "https://kplc.co.ke",
        rating: 4.0,
        description:
            "Distributeur national d'électricité, pionnier de l'énergie géothermique",
    },
]

// Tarifs énergétiques par pays
export const energyTariffs: EnergyTariff[] = [
    {
        id: 1,
        name: "Tarif Résidentiel Standard",
        type: "residential",
        pricePerKWh: 85,
        currency: "XOF",
        minimumConsumption: 0,
        connectionFee: 25000,
        monthlyFee: 2500,
        availableRegions: ["CI", "SN", "ML", "BF"],
    },
    {
        id: 2,
        name: "Tarif Commercial",
        type: "commercial",
        pricePerKWh: 95,
        currency: "XOF",
        minimumConsumption: 100,
        connectionFee: 75000,
        monthlyFee: 8500,
        peakHours: "18h-22h",
        offPeakDiscount: 15,
        availableRegions: ["CI", "SN"],
    },
    {
        id: 3,
        name: "Tarif Industriel",
        type: "industrial",
        pricePerKWh: 75,
        currency: "XOF",
        minimumConsumption: 1000,
        connectionFee: 150000,
        monthlyFee: 25000,
        peakHours: "18h-22h",
        offPeakDiscount: 25,
        availableRegions: ["CI", "SN", "MA"],
    },
    {
        id: 4,
        name: "Tarif Résidentiel Maroc",
        type: "residential",
        pricePerKWh: 1.2,
        currency: "MAD",
        minimumConsumption: 0,
        connectionFee: 500,
        monthlyFee: 45,
        availableRegions: ["MA"],
    },
]

// Solutions solaires disponibles
export const solarSolutions: SolarSolution[] = [
    {
        id: 1,
        name: "Kit Solaire Résidentiel 3kW",
        provider: "SolarAfrica",
        type: "residential",
        capacity: "3 kW",
        price: 1500000,
        currency: "XOF",
        installation: true,
        warranty: 25,
        financing: true,
        payback: 6,
        features: [
            "12 panneaux solaires 250W",
            "Onduleur hybride 3kW",
            "Batteries lithium 10kWh",
            "Monitoring en temps réel",
            "Installation clé en main",
        ],
        availableCountries: ["CI", "SN", "ML", "BF"],
    },
    {
        id: 2,
        name: "Solution Commerciale 10kW",
        provider: "EnergiePro",
        type: "commercial",
        capacity: "10 kW",
        price: 4500000,
        currency: "XOF",
        installation: true,
        warranty: 20,
        financing: true,
        payback: 4,
        features: [
            "40 panneaux solaires 250W",
            "Onduleur triphasé 10kW",
            "Système de monitoring",
            "Maintenance 5 ans incluse",
            "Raccordement réseau",
        ],
        availableCountries: ["CI", "SN", "MA"],
    },
    {
        id: 3,
        name: "Mini-Grid Solaire Communautaire",
        provider: "AfricaSolar",
        type: "industrial",
        capacity: "50 kW",
        price: 18000000,
        currency: "XOF",
        installation: true,
        warranty: 25,
        financing: true,
        payback: 8,
        features: [
            "200 panneaux solaires 250W",
            "Système de stockage 100kWh",
            "Réseau de distribution",
            "Compteurs intelligents",
            "Formation opérateurs",
        ],
        availableCountries: ["CI", "SN", "ML", "BF", "NE"],
    },
]

// Fonctions utilitaires
export const getProvidersByCountry = (
    countryCode: string
): EnergyProvider[] => {
    return africanEnergyProviders.filter(
        provider => provider.countryCode === countryCode
    )
}

export const getProvidersByType = (
    type: EnergyProvider["type"]
): EnergyProvider[] => {
    return africanEnergyProviders.filter(provider => provider.type === type)
}

export const getRenewableProviders = (): EnergyProvider[] => {
    return africanEnergyProviders.filter(provider => provider.renewable)
}

export const getTariffsByType = (
    type: EnergyTariff["type"]
): EnergyTariff[] => {
    return energyTariffs.filter(tariff => tariff.type === type)
}

export const getSolarSolutionsByType = (
    type: SolarSolution["type"]
): SolarSolution[] => {
    return solarSolutions.filter(solution => solution.type === type)
}

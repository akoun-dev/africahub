// 🏭 Données des secteurs d'activité africains - AfricaHub
// Informations sur les principaux secteurs économiques et entreprises

// Interface pour définir un secteur d'activité
export interface EconomicSector {
    id: number
    name: string
    slug: string
    icon: string
    description: string
    gdpContribution: number // En pourcentage du PIB
    employment: number // En millions d'emplois
    growth: number // Taux de croissance annuel en %
    keyCountries: string[]
    majorCompanies: string[]
    challenges: string[]
    opportunities: string[]
    trends: string[]
}

// Interface pour les entreprises par secteur
export interface SectorCompany {
    id: number
    name: string
    sector: string
    country: string
    countryCode: string
    established: number
    headquarters: string
    revenue: string // En milliards USD
    employees: number
    marketCap?: string
    services: string[]
    markets: string[]
    logo: string
    website: string
    rating: number
    description: string
}

// Interface pour les statistiques sectorielles
export interface SectorStats {
    sectorName: string
    totalCompanies: number
    totalRevenue: string
    averageGrowth: number
    topCountries: Array<{
        country: string
        countryCode: string
        companies: number
        contribution: number
    }>
}

// Données des principaux secteurs économiques africains
export const africanEconomicSectors: EconomicSector[] = [
    {
        id: 1,
        name: "Agriculture et Agroalimentaire",
        slug: "agriculture",
        icon: "🌾",
        description:
            "Secteur vital employant 60% de la population active africaine",
        gdpContribution: 23,
        employment: 240,
        growth: 4.2,
        keyCountries: ["NG", "ET", "KE", "CI", "GH", "SN"],
        majorCompanies: [
            "Dangote Group",
            "Olam International",
            "Nestlé Africa",
            "Unilever Africa",
            "SIFCA Group",
        ],
        challenges: [
            "Changement climatique",
            "Accès au financement",
            "Technologies modernes",
            "Chaînes de valeur",
            "Infrastructure de stockage",
        ],
        opportunities: [
            "Transformation digitale",
            "Agriculture de précision",
            "Marchés d'exportation",
            "Valeur ajoutée",
            "Agriculture biologique",
        ],
        trends: [
            "Fintech agricole",
            "Agriculture verticale",
            "Blockchain traçabilité",
            "IoT et capteurs",
            "E-commerce agricole",
        ],
    },
    {
        id: 2,
        name: "Services Financiers",
        slug: "finance",
        icon: "🏦",
        description:
            "Secteur en forte croissance avec l'inclusion financière digitale",
        gdpContribution: 8,
        employment: 12,
        growth: 8.5,
        keyCountries: ["ZA", "NG", "KE", "MA", "EG"],
        majorCompanies: [
            "Standard Bank",
            "Ecobank",
            "Equity Bank",
            "Safaricom (M-Pesa)",
            "Attijariwafa Bank",
        ],
        challenges: [
            "Inclusion financière",
            "Réglementation",
            "Cybersécurité",
            "Infrastructure technologique",
            "Éducation financière",
        ],
        opportunities: [
            "Mobile money",
            "Fintech innovation",
            "Microfinance",
            "Assurance digitale",
            "Blockchain",
        ],
        trends: [
            "Néobanques",
            "API Banking",
            "Intelligence artificielle",
            "Biométrie",
            "Cryptomonnaies",
        ],
    },
    {
        id: 3,
        name: "Télécommunications",
        slug: "telecom",
        icon: "📱",
        description: "Moteur de la transformation digitale africaine",
        gdpContribution: 7,
        employment: 8,
        growth: 12.3,
        keyCountries: ["NG", "ZA", "KE", "MA", "EG"],
        majorCompanies: [
            "MTN Group",
            "Orange Africa",
            "Airtel Africa",
            "Safaricom",
            "Maroc Telecom",
        ],
        challenges: [
            "Infrastructure réseau",
            "Couverture rurale",
            "Coût des équipements",
            "Réglementation",
            "Cybersécurité",
        ],
        opportunities: [
            "5G déploiement",
            "IoT applications",
            "Fintech mobile",
            "E-gouvernement",
            "Télémédecine",
        ],
        trends: [
            "Edge computing",
            "IA conversationnelle",
            "Réseaux satellites",
            "Blockchain",
            "Cloud computing",
        ],
    },
    {
        id: 4,
        name: "Énergie et Mines",
        slug: "energy-mining",
        icon: "⚡",
        description:
            "Secteur stratégique avec focus sur les énergies renouvelables",
        gdpContribution: 15,
        employment: 25,
        growth: 6.8,
        keyCountries: ["ZA", "NG", "DZ", "LY", "AO", "GH"],
        majorCompanies: [
            "Eskom",
            "Nigerian National Petroleum",
            "Sonatrach",
            "Sasol",
            "AngloGold Ashanti",
        ],
        challenges: [
            "Transition énergétique",
            "Investissements massifs",
            "Impact environnemental",
            "Volatilité des prix",
            "Gouvernance",
        ],
        opportunities: [
            "Énergies renouvelables",
            "Stockage d'énergie",
            "Mini-grids",
            "Hydrogène vert",
            "Efficacité énergétique",
        ],
        trends: [
            "Solaire décentralisé",
            "Batteries lithium",
            "Smart grids",
            "Carbon trading",
            "ESG investing",
        ],
    },
    {
        id: 5,
        name: "Transport et Logistique",
        slug: "transport",
        icon: "🚛",
        description: "Infrastructure critique pour l'intégration économique",
        gdpContribution: 6,
        employment: 18,
        growth: 5.4,
        keyCountries: ["ZA", "KE", "MA", "NG", "ET"],
        majorCompanies: [
            "Ethiopian Airlines",
            "Royal Air Maroc",
            "DHL Africa",
            "Uber Africa",
            "Transnet",
        ],
        challenges: [
            "Infrastructure routière",
            "Coûts logistiques",
            "Douanes et frontières",
            "Sécurité",
            "Financement",
        ],
        opportunities: [
            "E-commerce croissance",
            "Corridors commerciaux",
            "Transport multimodal",
            "Digitalisation",
            "Véhicules électriques",
        ],
        trends: [
            "Livraison par drones",
            "Tracking IoT",
            "Plateformes digitales",
            "Mobilité partagée",
            "Logistique verte",
        ],
    },
]

// Entreprises leaders par secteur
export const sectorCompanies: SectorCompany[] = [
    {
        id: 1,
        name: "Dangote Group",
        sector: "Agriculture et Agroalimentaire",
        country: "Nigeria",
        countryCode: "NG",
        established: 1981,
        headquarters: "Lagos",
        revenue: "4.1B USD",
        employees: 30000,
        marketCap: "15.2B USD",
        services: [
            "Ciment",
            "Sucre",
            "Farine",
            "Pâtes alimentaires",
            "Sel",
            "Pétrole et gaz",
        ],
        markets: ["NG", "GH", "ZA", "ZM", "CM", "SN"],
        logo: "/images/companies/dangote.png",
        website: "https://dangote.com",
        rating: 4.3,
        description:
            "Plus grand conglomérat industriel d'Afrique, leader du ciment",
    },
    {
        id: 2,
        name: "MTN Group",
        sector: "Télécommunications",
        country: "Afrique du Sud",
        countryCode: "ZA",
        established: 1994,
        headquarters: "Johannesburg",
        revenue: "15.8B USD",
        employees: 17000,
        marketCap: "28.5B USD",
        services: [
            "Téléphonie mobile",
            "Internet",
            "Services financiers",
            "Solutions entreprises",
            "Fintech",
        ],
        markets: ["ZA", "NG", "GH", "CI", "CM", "UG", "RW"],
        logo: "/images/companies/mtn.png",
        website: "https://mtn.com",
        rating: 4.2,
        description:
            "Plus grand opérateur mobile d'Afrique avec 280M d'abonnés",
    },
    {
        id: 3,
        name: "Standard Bank Group",
        sector: "Services Financiers",
        country: "Afrique du Sud",
        countryCode: "ZA",
        established: 1862,
        headquarters: "Johannesburg",
        revenue: "6.2B USD",
        employees: 54000,
        marketCap: "18.9B USD",
        services: [
            "Banque de détail",
            "Banque d'entreprise",
            "Banque d'investissement",
            "Assurance",
            "Gestion de patrimoine",
        ],
        markets: ["ZA", "NG", "KE", "GH", "UG", "TZ", "MZ"],
        logo: "/images/companies/standard-bank.png",
        website: "https://standardbank.com",
        rating: 4.5,
        description:
            "Plus grande banque d'Afrique par actifs et capitalisation",
    },
    {
        id: 4,
        name: "Eskom Holdings",
        sector: "Énergie et Mines",
        country: "Afrique du Sud",
        countryCode: "ZA",
        established: 1923,
        headquarters: "Johannesburg",
        revenue: "13.1B USD",
        employees: 46000,
        services: [
            "Production électricité",
            "Transport énergie",
            "Distribution",
            "Énergies renouvelables",
            "Services techniques",
        ],
        markets: ["ZA", "MW", "MZ", "BW", "ZM"],
        logo: "/images/companies/eskom.png",
        website: "https://eskom.co.za",
        rating: 3.8,
        description: "Plus grande compagnie d'électricité d'Afrique",
    },
]

// Statistiques sectorielles
export const sectorStats: SectorStats[] = [
    {
        sectorName: "Agriculture et Agroalimentaire",
        totalCompanies: 1250,
        totalRevenue: "180B USD",
        averageGrowth: 4.2,
        topCountries: [
            {
                country: "Nigeria",
                countryCode: "NG",
                companies: 320,
                contribution: 25.6,
            },
            {
                country: "Kenya",
                countryCode: "KE",
                companies: 180,
                contribution: 14.4,
            },
            {
                country: "Côte d'Ivoire",
                countryCode: "CI",
                companies: 150,
                contribution: 12.0,
            },
            {
                country: "Ghana",
                countryCode: "GH",
                companies: 140,
                contribution: 11.2,
            },
            {
                country: "Sénégal",
                countryCode: "SN",
                companies: 120,
                contribution: 9.6,
            },
        ],
    },
    {
        sectorName: "Services Financiers",
        totalCompanies: 850,
        totalRevenue: "95B USD",
        averageGrowth: 8.5,
        topCountries: [
            {
                country: "Afrique du Sud",
                countryCode: "ZA",
                companies: 180,
                contribution: 21.2,
            },
            {
                country: "Nigeria",
                countryCode: "NG",
                companies: 160,
                contribution: 18.8,
            },
            {
                country: "Kenya",
                countryCode: "KE",
                companies: 120,
                contribution: 14.1,
            },
            {
                country: "Maroc",
                countryCode: "MA",
                companies: 100,
                contribution: 11.8,
            },
            {
                country: "Égypte",
                countryCode: "EG",
                companies: 90,
                contribution: 10.6,
            },
        ],
    },
    {
        sectorName: "Télécommunications",
        totalCompanies: 420,
        totalRevenue: "65B USD",
        averageGrowth: 12.3,
        topCountries: [
            {
                country: "Nigeria",
                countryCode: "NG",
                companies: 85,
                contribution: 20.2,
            },
            {
                country: "Afrique du Sud",
                countryCode: "ZA",
                companies: 75,
                contribution: 17.9,
            },
            {
                country: "Kenya",
                countryCode: "KE",
                companies: 60,
                contribution: 14.3,
            },
            {
                country: "Maroc",
                countryCode: "MA",
                companies: 50,
                contribution: 11.9,
            },
            {
                country: "Égypte",
                countryCode: "EG",
                companies: 45,
                contribution: 10.7,
            },
        ],
    },
]

// Fonctions utilitaires
export const getSectorBySlug = (slug: string): EconomicSector | undefined => {
    return africanEconomicSectors.find(sector => sector.slug === slug)
}

export const getSectorsByGrowth = (minGrowth: number = 0): EconomicSector[] => {
    return africanEconomicSectors
        .filter(sector => sector.growth >= minGrowth)
        .sort((a, b) => b.growth - a.growth)
}

export const getCompaniesBySector = (sectorName: string): SectorCompany[] => {
    return sectorCompanies.filter(company =>
        company.sector.toLowerCase().includes(sectorName.toLowerCase())
    )
}

export const getCompaniesByCountry = (countryCode: string): SectorCompany[] => {
    return sectorCompanies.filter(
        company => company.countryCode === countryCode
    )
}

export const getTopCompaniesByRevenue = (
    limit: number = 10
): SectorCompany[] => {
    return sectorCompanies
        .sort((a, b) => {
            const revenueA = parseFloat(a.revenue.replace(/[^\d.]/g, ""))
            const revenueB = parseFloat(b.revenue.replace(/[^\d.]/g, ""))
            return revenueB - revenueA
        })
        .slice(0, limit)
}

export const getSectorStatsByName = (
    sectorName: string
): SectorStats | undefined => {
    return sectorStats.find(stat =>
        stat.sectorName.toLowerCase().includes(sectorName.toLowerCase())
    )
}

export const getAllSectorNames = (): string[] => {
    return africanEconomicSectors.map(sector => sector.name)
}

export const getSectorTrends = (sectorSlug: string): string[] => {
    const sector = getSectorBySlug(sectorSlug)
    return sector ? sector.trends : []
}

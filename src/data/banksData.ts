// 🏦 Données des banques africaines - AfricaHub
// Informations sur les principales banques et institutions financières d'Afrique

// Interface pour définir une banque
export interface Bank {
    id: number
    name: string
    country: string
    countryCode: string
    type: "commercial" | "islamic" | "development" | "microfinance"
    established: number
    headquarters: string
    assets: string // En milliards USD
    branches: number
    services: string[]
    digitalBanking: boolean
    mobileMoney: boolean
    logo: string
    website: string
    rating: number // Sur 5
    description: string
}

// Interface pour les services bancaires
export interface BankingService {
    id: number
    name: string
    type: "account" | "loan" | "investment" | "insurance" | "transfer"
    description: string
    minAmount: number
    currency: string
    interestRate?: number
    fees: number
    requirements: string[]
    availableCountries: string[]
    digitalOnly: boolean
}

// Données des principales banques africaines
export const africanBanks: Bank[] = [
    {
        id: 1,
        name: "Ecobank Transnational",
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
        description:
            "Plus grande banque panafricaine présente dans 33 pays africains",
    },
    {
        id: 2,
        name: "Standard Bank Group",
        country: "Afrique du Sud",
        countryCode: "ZA",
        type: "commercial",
        established: 1862,
        headquarters: "Johannesburg",
        assets: "168.2B USD",
        branches: 1100,
        services: [
            "Banque de détail",
            "Banque d'entreprise",
            "Banque d'investissement",
            "Assurance",
            "Gestion de patrimoine",
            "Services numériques",
        ],
        digitalBanking: true,
        mobileMoney: true,
        logo: "/images/banks/standard-bank.png",
        website: "https://standardbank.com",
        rating: 4.5,
        description:
            "Plus grande banque d'Afrique par actifs, leader en Afrique australe",
    },
    {
        id: 3,
        name: "Attijariwafa Bank",
        country: "Maroc",
        countryCode: "MA",
        type: "commercial",
        established: 1904,
        headquarters: "Casablanca",
        assets: "65.8B USD",
        branches: 5200,
        services: [
            "Banque de détail",
            "Banque d'entreprise",
            "Banque d'investissement",
            "Assurance",
            "Immobilier",
            "Leasing",
        ],
        digitalBanking: true,
        mobileMoney: false,
        logo: "/images/banks/attijariwafa.png",
        website: "https://attijariwafabank.com",
        rating: 4.3,
        description: "Première banque du Maghreb et leader bancaire au Maroc",
    },
    {
        id: 4,
        name: "FirstBank Nigeria",
        country: "Nigeria",
        countryCode: "NG",
        type: "commercial",
        established: 1894,
        headquarters: "Lagos",
        assets: "20.1B USD",
        branches: 750,
        services: [
            "Comptes personnels",
            "Crédits et prêts",
            "Banque d'entreprise",
            "Services digitaux",
            "Transferts d'argent",
            "Cartes de paiement",
        ],
        digitalBanking: true,
        mobileMoney: true,
        logo: "/images/banks/firstbank.png",
        website: "https://firstbanknigeria.com",
        rating: 4.1,
        description:
            "Plus ancienne banque du Nigeria, leader des services financiers",
    },
    {
        id: 5,
        name: "Equity Bank Group",
        country: "Kenya",
        countryCode: "KE",
        type: "commercial",
        established: 1984,
        headquarters: "Nairobi",
        assets: "7.2B USD",
        branches: 340,
        services: [
            "Microfinance",
            "Banque de détail",
            "Banque d'entreprise",
            "Banque mobile",
            "Assurance",
            "Services agricoles",
        ],
        digitalBanking: true,
        mobileMoney: true,
        logo: "/images/banks/equity-bank.png",
        website: "https://equitybankgroup.com",
        rating: 4.4,
        description:
            "Banque leader en inclusion financière en Afrique de l'Est",
    },
    {
        id: 6,
        name: "Banque Centrale Populaire (BCP)",
        country: "Maroc",
        countryCode: "MA",
        type: "commercial",
        established: 1961,
        headquarters: "Casablanca",
        assets: "45.3B USD",
        branches: 1800,
        services: [
            "Banque de détail",
            "Banque participative",
            "Banque d'entreprise",
            "Leasing",
            "Assurance",
            "Banque en ligne",
        ],
        digitalBanking: true,
        mobileMoney: false,
        logo: "/images/banks/bcp.png",
        website: "https://gbp.ma",
        rating: 4.0,
        description:
            "Deuxième groupe bancaire au Maroc, forte présence en Afrique",
    },
    {
        id: 7,
        name: "Société Générale Côte d'Ivoire",
        country: "Côte d'Ivoire",
        countryCode: "CI",
        type: "commercial",
        established: 1962,
        headquarters: "Abidjan",
        assets: "3.8B USD",
        branches: 180,
        services: [
            "Comptes particuliers",
            "Crédits immobiliers",
            "Banque d'entreprise",
            "Services digitaux",
            "Transferts internationaux",
            "Cartes bancaires",
        ],
        digitalBanking: true,
        mobileMoney: true,
        logo: "/images/banks/sgci.png",
        website: "https://societegenerale.ci",
        rating: 4.2,
        description:
            "Filiale du groupe Société Générale, leader en Côte d'Ivoire",
    },
    {
        id: 8,
        name: "Bank of Africa (BMCE Group)",
        country: "Maroc",
        countryCode: "MA",
        type: "commercial",
        established: 1959,
        headquarters: "Casablanca",
        assets: "32.1B USD",
        branches: 2100,
        services: [
            "Banque de détail",
            "Banque d'investissement",
            "Banque participative",
            "Assurance",
            "Immobilier",
            "Services numériques",
        ],
        digitalBanking: true,
        mobileMoney: false,
        logo: "/images/banks/boa.png",
        website: "https://bankofafrica.ma",
        rating: 4.1,
        description: "Groupe bancaire panafricain présent dans 20 pays",
    },
]

// Services bancaires populaires en Afrique
export const bankingServices: BankingService[] = [
    {
        id: 1,
        name: "Compte Épargne Standard",
        type: "account",
        description: "Compte d'épargne avec intérêts compétitifs",
        minAmount: 10000,
        currency: "XOF",
        interestRate: 3.5,
        fees: 1000,
        requirements: ["Pièce d'identité", "Justificatif de domicile"],
        availableCountries: ["CI", "SN", "ML", "BF"],
        digitalOnly: false,
    },
    {
        id: 2,
        name: "Crédit Personnel Express",
        type: "loan",
        description: "Prêt personnel rapide jusqu'à 5 millions XOF",
        minAmount: 100000,
        currency: "XOF",
        interestRate: 12.5,
        fees: 25000,
        requirements: [
            "Justificatif de revenus",
            "Domiciliation salaire",
            "Garantie",
        ],
        availableCountries: ["CI", "SN", "TG"],
        digitalOnly: false,
    },
    {
        id: 3,
        name: "Mobile Money Premium",
        type: "transfer",
        description: "Transferts d'argent mobile sans limites",
        minAmount: 500,
        currency: "XOF",
        fees: 50,
        requirements: ["Téléphone mobile", "Pièce d'identité"],
        availableCountries: ["CI", "SN", "ML", "BF", "TG", "NG", "KE"],
        digitalOnly: true,
    },
    {
        id: 4,
        name: "Assurance Vie Épargne",
        type: "insurance",
        description: "Assurance vie avec épargne et protection",
        minAmount: 50000,
        currency: "XOF",
        interestRate: 4.2,
        fees: 5000,
        requirements: ["Examen médical", "Justificatif de revenus"],
        availableCountries: ["CI", "SN", "MA", "TN"],
        digitalOnly: false,
    },
]

// Fonctions utilitaires
export const getBanksByCountry = (countryCode: string): Bank[] => {
    return africanBanks.filter(bank => bank.countryCode === countryCode)
}

export const getBanksByType = (type: Bank["type"]): Bank[] => {
    return africanBanks.filter(bank => bank.type === type)
}

export const getTopRatedBanks = (limit: number = 5): Bank[] => {
    return africanBanks.sort((a, b) => b.rating - a.rating).slice(0, limit)
}

export const getBanksWithMobileMoney = (): Bank[] => {
    return africanBanks.filter(bank => bank.mobileMoney)
}

export const getServicesByType = (
    type: BankingService["type"]
): BankingService[] => {
    return bankingServices.filter(service => service.type === type)
}

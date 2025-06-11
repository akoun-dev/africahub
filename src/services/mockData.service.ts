/**
 * Service de données fictives pour AfricaHub
 * Remplace temporairement les appels Supabase avec des données réalistes
 */

export interface MockSector {
    id: string
    name: string
    slug: string
    description: string
    icon: string
    color: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface MockProduct {
    id: string
    name: string
    description: string
    price: number
    currency: string
    sector_id: string
    provider: string
    rating: number
    reviews_count: number
    features: string[]
    image_url?: string
    is_featured: boolean
    created_at: string
}

/**
 * Données fictives des secteurs AfricaHub
 */
export const mockSectors: MockSector[] = [
    // Secteurs d'assurance
    {
        id: "1",
        name: "Assurance Auto",
        slug: "assurance-auto",
        description: "Assurance automobile et véhicules en Afrique",
        icon: "Car",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "2",
        name: "Assurance Habitation",
        slug: "assurance-habitation",
        description: "Protection du logement et biens immobiliers",
        icon: "Home",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "3",
        name: "Assurance Santé",
        slug: "assurance-sante",
        description: "Couverture médicale et santé",
        icon: "Shield",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "4",
        name: "Micro-assurance",
        slug: "micro-assurance",
        description: "Solutions d'assurance accessibles",
        icon: "Smartphone",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },

    // Secteurs principaux
    {
        id: "5",
        name: "Banque",
        slug: "banque",
        description: "Services bancaires et financiers",
        icon: "Sprout",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "6",
        name: "Énergie",
        slug: "energie",
        description: "Fournisseurs d'énergie et solutions renouvelables",
        icon: "Zap",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "7",
        name: "Télécoms",
        slug: "telecom",
        description: "Services de télécommunications",
        icon: "Smartphone",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "8",
        name: "Immobilier",
        slug: "immobilier",
        description: "Marché immobilier et investissement",
        icon: "Home",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "9",
        name: "Transport",
        slug: "transport",
        description: "Solutions de transport et logistique",
        icon: "Plane",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "10",
        name: "Éducation",
        slug: "education",
        description: "Formations et opportunités éducatives",
        icon: "Building",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "11",
        name: "Santé",
        slug: "sante",
        description: "Services de santé et soins médicaux",
        icon: "Shield",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "12",
        name: "Commerce",
        slug: "commerce",
        description: "E-commerce et solutions commerciales",
        icon: "Package",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },

    // Secteurs additionnels pour la page d'accueil
    {
        id: "13",
        name: "Retail",
        slug: "retail",
        description: "Commerce de détail et distribution",
        icon: "Store",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "14",
        name: "Travel",
        slug: "travel",
        description: "Voyages et tourisme en Afrique",
        icon: "MapPin",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "15",
        name: "Business",
        slug: "business",
        description: "Solutions d'entreprise et services B2B",
        icon: "Building",
        color: "#1e3a5f",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
]

/**
 * Données fictives des produits par secteur
 */
export const mockProducts: MockProduct[] = [
    // Produits Assurance Auto
    {
        id: "p1",
        name: "Assurance Auto Complète",
        description: "Couverture complète pour votre véhicule",
        price: 850,
        currency: "USD",
        sector_id: "1",
        provider: "NSIA Assurances",
        rating: 4.5,
        reviews_count: 1250,
        features: [
            "Tous risques",
            "Assistance 24/7",
            "Véhicule de remplacement",
        ],
        is_featured: true,
        created_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "p2",
        name: "Assurance Auto Tiers",
        description: "Protection responsabilité civile",
        price: 320,
        currency: "USD",
        sector_id: "1",
        provider: "Saham Assurance",
        rating: 4.2,
        reviews_count: 890,
        features: [
            "Responsabilité civile",
            "Défense recours",
            "Protection juridique",
        ],
        is_featured: false,
        created_at: "2024-01-01T00:00:00Z",
    },

    // Produits Banque
    {
        id: "p3",
        name: "Compte Épargne Plus",
        description: "Compte d'épargne avec taux préférentiel",
        price: 0,
        currency: "USD",
        sector_id: "5",
        provider: "Ecobank",
        rating: 4.3,
        reviews_count: 2100,
        features: ["Taux 3.5%", "Pas de frais", "Mobile banking"],
        is_featured: true,
        created_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "p4",
        name: "Crédit Auto",
        description: "Financement véhicule jusqu'à 7 ans",
        price: 15000,
        currency: "USD",
        sector_id: "5",
        provider: "UBA",
        rating: 4.1,
        reviews_count: 750,
        features: ["Taux 8.5%", "Jusqu'à 7 ans", "Assurance incluse"],
        is_featured: false,
        created_at: "2024-01-01T00:00:00Z",
    },

    // Produits Télécoms
    {
        id: "p5",
        name: "Forfait Illimité Pro",
        description: "Appels et data illimités",
        price: 45,
        currency: "USD",
        sector_id: "7",
        provider: "MTN",
        rating: 4.4,
        reviews_count: 3200,
        features: ["Appels illimités", "50GB data", "Roaming Afrique"],
        is_featured: true,
        created_at: "2024-01-01T00:00:00Z",
    },

    // Produits Retail
    {
        id: "p6",
        name: "Plateforme E-commerce",
        description: "Solution complète de vente en ligne",
        price: 299,
        currency: "USD",
        sector_id: "13",
        provider: "Jumia Business",
        rating: 4.6,
        reviews_count: 1850,
        features: [
            "Boutique en ligne",
            "Paiement mobile",
            "Livraison intégrée",
        ],
        is_featured: true,
        created_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "p7",
        name: "Système de Caisse",
        description: "Caisse enregistreuse digitale",
        price: 150,
        currency: "USD",
        sector_id: "13",
        provider: "POS Africa",
        rating: 4.3,
        reviews_count: 920,
        features: ["Gestion stock", "Rapports ventes", "Multi-devises"],
        is_featured: false,
        created_at: "2024-01-01T00:00:00Z",
    },

    // Produits Travel
    {
        id: "p8",
        name: "Assurance Voyage",
        description: "Protection complète pour vos voyages",
        price: 85,
        currency: "USD",
        sector_id: "14",
        provider: "Travel Guard Africa",
        rating: 4.7,
        reviews_count: 2400,
        features: ["Annulation voyage", "Frais médicaux", "Rapatriement"],
        is_featured: true,
        created_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "p9",
        name: "Réservation Hôtel",
        description: "Booking d'hôtels en Afrique",
        price: 120,
        currency: "USD",
        sector_id: "14",
        provider: "AfricaStay",
        rating: 4.4,
        reviews_count: 3100,
        features: ["Meilleurs prix", "Annulation gratuite", "Support 24/7"],
        is_featured: false,
        created_at: "2024-01-01T00:00:00Z",
    },

    // Produits Santé
    {
        id: "p10",
        name: "Consultation Télémédecine",
        description: "Consultations médicales à distance",
        price: 25,
        currency: "USD",
        sector_id: "11",
        provider: "HealthTech Africa",
        rating: 4.8,
        reviews_count: 5200,
        features: [
            "Médecins certifiés",
            "Ordonnances digitales",
            "Suivi patient",
        ],
        is_featured: true,
        created_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "p11",
        name: "Pharmacie en Ligne",
        description: "Livraison de médicaments à domicile",
        price: 15,
        currency: "USD",
        sector_id: "11",
        provider: "PharmaCare",
        rating: 4.5,
        reviews_count: 1800,
        features: [
            "Livraison rapide",
            "Médicaments authentiques",
            "Conseil pharmacien",
        ],
        is_featured: false,
        created_at: "2024-01-01T00:00:00Z",
    },

    // Produits Business
    {
        id: "p12",
        name: "Suite Comptabilité",
        description: "Logiciel de gestion comptable",
        price: 199,
        currency: "USD",
        sector_id: "15",
        provider: "AfricaBooks",
        rating: 4.6,
        reviews_count: 1200,
        features: ["Facturation", "Déclarations fiscales", "Tableaux de bord"],
        is_featured: true,
        created_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "p13",
        name: "CRM Entreprise",
        description: "Gestion de la relation client",
        price: 89,
        currency: "USD",
        sector_id: "15",
        provider: "SalesForce Africa",
        rating: 4.4,
        reviews_count: 890,
        features: ["Suivi prospects", "Automatisation", "Rapports avancés"],
        is_featured: false,
        created_at: "2024-01-01T00:00:00Z",
    },
]

/**
 * Service de données fictives
 */
export class MockDataService {
    /**
     * Récupère tous les secteurs actifs
     */
    static async getAllSectors(): Promise<MockSector[]> {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 100))
        return mockSectors.filter(sector => sector.is_active)
    }

    /**
     * Récupère un secteur par slug
     */
    static async getSectorBySlug(slug: string): Promise<MockSector> {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 100))

        const sector = mockSectors.find(s => s.slug === slug && s.is_active)
        if (!sector) {
            throw new Error(`Secteur avec slug "${slug}" non trouvé`)
        }
        return sector
    }

    /**
     * Récupère les produits d'un secteur
     */
    static async getProductsBySector(sectorId: string): Promise<MockProduct[]> {
        await new Promise(resolve => setTimeout(resolve, 150))
        return mockProducts.filter(product => product.sector_id === sectorId)
    }

    /**
     * Récupère les produits vedettes
     */
    static async getFeaturedProducts(): Promise<MockProduct[]> {
        await new Promise(resolve => setTimeout(resolve, 100))
        return mockProducts.filter(product => product.is_featured)
    }

    /**
     * Recherche de produits
     */
    static async searchProducts(
        query: string,
        sectorId?: string
    ): Promise<MockProduct[]> {
        await new Promise(resolve => setTimeout(resolve, 200))

        let results = mockProducts

        if (sectorId) {
            results = results.filter(product => product.sector_id === sectorId)
        }

        if (query) {
            const searchTerm = query.toLowerCase()
            results = results.filter(
                product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.provider.toLowerCase().includes(searchTerm)
            )
        }

        return results
    }
}

// 🛒 Données de démonstration AfricaHub - Organisées par secteurs
// Couvre tous les secteurs majeurs du comparateur africain

export const demoProducts = [
    // ===== 📱 ÉLECTRONIQUE & HIGH-TECH =====
    {
        id: "demo-airpods-pro",
        name: "Apple AirPods Pro (2ème génération)",
        description:
            "Écouteurs sans fil avec réduction de bruit active et audio spatial",
        price: 189000,
        currency: "XOF",
        image_url: "/images/products/airpods-pro.jpg",
        features: [
            "Réduction de bruit active",
            "Audio spatial personnalisé",
            "Autonomie 6h + 24h avec boîtier",
            "Résistant à l'eau IPX4",
            "Puce H2 pour un son premium",
        ],
        offers: [
            {
                merchant: "Orange Côte d'Ivoire",
                price: 189000,
                currency: "XOF",
                shipping: 0,
                delivery: "Retrait gratuit en magasin",
                stock: "En stock",
                rating: 4.5,
                logo: "/images/merchants/orange-ci.png",
                payment_methods: ["Visa", "Mastercard", "Orange Money"],
                warranty: "12 mois Apple",
            },
            {
                merchant: "MTN Store",
                price: 195000,
                currency: "XOF",
                shipping: 2500,
                delivery: "Livraison 24h",
                stock: "En stock",
                rating: 4.3,
                logo: "/images/merchants/mtn-ci.png",
                payment_methods: ["Visa", "Mastercard", "MTN Money"],
                warranty: "12 mois Apple",
            },
            {
                merchant: "Electroplanet",
                price: 192000,
                currency: "XOF",
                shipping: 0,
                delivery: "Retrait gratuit",
                stock: "Stock limité",
                rating: 4.2,
                logo: "/images/merchants/electroplanet.png",
                payment_methods: ["Visa", "Mastercard", "Espèces"],
                warranty: "12 mois Apple",
            },
        ],
        country_availability: ["CI", "SN", "ML", "BF"],
        is_active: true,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-22T14:45:00Z",
        companies: {
            name: "Orange Côte d'Ivoire",
            logo_url: "/images/merchants/orange-ci.png",
        },
        product_types: {
            name: "Électronique",
            slug: "electronique",
        },
    },
    {
        id: "demo-iphone-15-pro",
        name: "iPhone 15 Pro 128GB Titane Naturel",
        description:
            "Smartphone premium avec puce A17 Pro et appareil photo 48MP",
        price: 899000,
        currency: "XOF",
        image_url: "/images/products/iphone-15-pro.jpg",
        features: [
            "Puce A17 Pro 3nm",
            "Écran Super Retina XDR 6.1 pouces",
            "Appareil photo 48MP Pro",
            "Châssis en titane",
            "USB-C avec Thunderbolt",
        ],
        offers: [
            {
                merchant: "MTN Côte d'Ivoire",
                price: 899000,
                currency: "XOF",
                shipping: 0,
                delivery: "Livraison gratuite",
                stock: "En stock",
                rating: 4.6,
                logo: "/images/merchants/mtn-ci.png",
                payment_methods: ["Visa", "Mastercard", "MTN Money"],
                warranty: "12 mois Apple",
            },
            {
                merchant: "Orange Store",
                price: 915000,
                currency: "XOF",
                shipping: 0,
                delivery: "Retrait en magasin",
                stock: "En stock",
                rating: 4.4,
                logo: "/images/merchants/orange-ci.png",
                payment_methods: ["Visa", "Mastercard", "Orange Money"],
                warranty: "12 mois Apple",
            },
            {
                merchant: "Apple Store Maroc",
                price: 925000,
                currency: "XOF",
                shipping: 5000,
                delivery: "Livraison 48h",
                stock: "Stock limité",
                rating: 4.8,
                logo: "/images/merchants/apple-ma.png",
                payment_methods: ["Visa", "Mastercard", "Apple Pay"],
                warranty: "12 mois Apple",
            },
        ],
        country_availability: ["CI", "SN", "MA", "TN"],
        is_active: true,
        created_at: "2024-01-16T12:00:00Z",
        updated_at: "2024-01-23T10:15:00Z",
        companies: {
            name: "MTN Côte d'Ivoire",
            logo_url: "/images/merchants/mtn-ci.png",
        },
        product_types: {
            name: "Électronique",
            slug: "electronique",
        },
    },
    {
        id: "demo-macbook-air-m3",
        name: "MacBook Air 13 pouces M3 256GB",
        description:
            "Ordinateur portable ultra-fin avec puce M3 et autonomie 18h",
        price: 1299000,
        currency: "XOF",
        image_url: "/images/products/macbook-air-m3.jpg",
        features: [
            "Puce Apple M3 8-core CPU",
            "Écran Liquid Retina 13.6 pouces",
            "8GB RAM unifiée",
            "256GB SSD",
            "Autonomie jusqu'à 18h",
            "Caméra FaceTime HD 1080p",
        ],
        country_availability: ["CI", "SN", "MA", "TN"],
        is_active: true,
        created_at: "2024-01-17T14:30:00Z",
        updated_at: "2024-01-24T09:20:00Z",
        companies: {
            name: "Apple Store Maroc",
            logo_url: "/images/merchants/apple-ma.png",
        },
        product_types: {
            name: "Électronique",
            slug: "electronique",
        },
    },
    {
        id: "demo-samsung-galaxy-s24",
        name: "Samsung Galaxy S24 Ultra 256GB",
        description:
            "Smartphone Android premium avec S Pen et appareil photo 200MP",
        price: 950000,
        currency: "XOF",
        image_url: "/images/products/galaxy-s24.jpg",
        features: [
            "Snapdragon 8 Gen 3",
            "Écran Dynamic AMOLED 6.8 pouces",
            "Appareil photo 200MP",
            "S Pen intégré",
            "Batterie 5000mAh",
        ],
        country_availability: ["CI", "SN", "NG", "KE"],
        is_active: true,
        created_at: "2024-01-29T10:00:00Z",
        updated_at: "2024-02-05T14:30:00Z",
        companies: {
            name: "Samsung Afrique",
            logo_url: "/images/merchants/samsung.png",
        },
        product_types: {
            name: "Électronique",
            slug: "electronique",
        },
    },
    {
        id: "demo-sony-wh1000xm5",
        name: "Sony WH-1000XM5 Casque Sans Fil",
        description: "Casque premium avec réduction de bruit leader du marché",
        price: 245000,
        currency: "XOF",
        image_url: "/images/products/sony-wh1000xm5.jpg",
        features: [
            "Réduction de bruit industrie leader",
            "Autonomie 30h",
            "Audio haute résolution",
            "Charge rapide 3min = 3h",
            "Multipoint Bluetooth",
        ],
        country_availability: ["CI", "SN", "MA", "TN"],
        is_active: true,
        created_at: "2024-01-30T15:20:00Z",
        updated_at: "2024-02-06T11:45:00Z",
        companies: {
            name: "Sony Maroc",
            logo_url: "/images/merchants/sony.png",
        },
        product_types: {
            name: "Électronique",
            slug: "electronique",
        },
    },

    // ===== ⚽ SPORT & OUTDOOR =====
    {
        id: "demo-nike-air-max",
        name: "Nike Air Max 270 React",
        description:
            "Chaussures de running avec technologie Air Max et semelle React",
        price: 85000,
        currency: "XOF",
        image_url: "/images/products/nike-air-max.jpg",
        features: [
            "Technologie Air Max 270",
            "Semelle React ultra-légère",
            "Mesh respirant",
            "Design moderne",
            "Confort toute la journée",
        ],
        country_availability: ["CI", "SN", "NG", "GH"],
        is_active: true,
        created_at: "2024-01-18T09:00:00Z",
        updated_at: "2024-01-25T16:30:00Z",
        companies: {
            name: "Decathlon Afrique",
            logo_url: "/images/merchants/decathlon.png",
        },
        product_types: {
            name: "Sport & Outdoor",
            slug: "sport-outdoor",
        },
    },
    {
        id: "demo-velo-electrique",
        name: "Vélo électrique urbain E-City 500W",
        description:
            "Vélo électrique pour la ville avec autonomie 80km et moteur 500W",
        price: 450000,
        currency: "XOF",
        image_url: "/images/products/velo-electrique.jpg",
        features: [
            "Moteur 500W brushless",
            "Batterie lithium 48V 13Ah",
            "Autonomie jusqu'à 80km",
            "Écran LCD multifonction",
            "Freins à disque hydrauliques",
        ],
        country_availability: ["CI", "SN", "MA", "TN"],
        is_active: true,
        created_at: "2024-01-19T11:15:00Z",
        updated_at: "2024-01-26T14:00:00Z",
        companies: {
            name: "EcoBike Maroc",
            logo_url: "/images/merchants/ecobike.png",
        },
        product_types: {
            name: "Sport & Outdoor",
            slug: "sport-outdoor",
        },
    },

    // ===== 👶 PUÉRICULTURE =====
    {
        id: "demo-poussette-premium",
        name: "Poussette 3-en-1 Premium Travel System",
        description:
            "Système de voyage complet : poussette, siège auto et nacelle",
        price: 320000,
        currency: "XOF",
        image_url: "/images/products/poussette-premium.jpg",
        features: [
            "Système 3-en-1 complet",
            "Siège auto groupe 0+",
            "Nacelle pour nouveau-né",
            "Châssis aluminium léger",
            "Roues tout-terrain",
        ],
        country_availability: ["CI", "SN", "ML", "BF"],
        is_active: true,
        created_at: "2024-01-20T08:30:00Z",
        updated_at: "2024-01-27T12:45:00Z",
        companies: {
            name: "Baby Store Dakar",
            logo_url: "/images/merchants/baby-store.png",
        },
        product_types: {
            name: "Puériculture",
            slug: "puericulture",
        },
    },

    // ===== 🏠 MAISON & JARDIN =====
    {
        id: "demo-climatiseur-inverter",
        name: "Climatiseur Inverter 12000 BTU A++",
        description:
            "Climatiseur split inverter économique avec télécommande WiFi",
        price: 285000,
        currency: "XOF",
        image_url: "/images/products/climatiseur.jpg",
        features: [
            "Technologie Inverter économique",
            "12000 BTU/h",
            "Classe énergétique A++",
            "Contrôle WiFi smartphone",
            "Mode nuit silencieux",
        ],
        country_availability: ["CI", "SN", "ML", "BF"],
        is_active: true,
        created_at: "2024-01-21T10:00:00Z",
        updated_at: "2024-01-28T15:20:00Z",
        companies: {
            name: "Electroménager Plus",
            logo_url: "/images/merchants/electromenager.png",
        },
        product_types: {
            name: "Maison & Jardin",
            slug: "maison-jardin",
        },
    },

    // ===== 🛒 ÉPICERIE =====
    {
        id: "demo-riz-parfume",
        name: "Riz Parfumé Premium 25kg",
        description:
            "Riz parfumé de qualité supérieure, grain long, origine Thaïlande",
        price: 18500,
        currency: "XOF",
        image_url: "/images/products/riz-parfume.jpg",
        features: [
            "Grain long parfumé",
            "Qualité premium",
            "Origine Thaïlande",
            "Sac de 25kg",
            "Livraison à domicile",
        ],
        country_availability: ["CI", "SN", "ML", "BF"],
        is_active: true,
        created_at: "2024-01-22T07:00:00Z",
        updated_at: "2024-01-29T11:30:00Z",
        companies: {
            name: "Prosuma Côte d'Ivoire",
            logo_url: "/images/merchants/prosuma.png",
        },
        product_types: {
            name: "Épicerie",
            slug: "epicerie",
        },
    },

    // ===== 🎮 JEUX VIDÉO & JOUETS =====
    {
        id: "demo-ps5-console",
        name: "PlayStation 5 Console Standard",
        description:
            "Console de jeu nouvelle génération avec lecteur Blu-ray 4K",
        price: 450000,
        currency: "XOF",
        image_url: "/images/products/ps5.jpg",
        features: [
            "Processeur AMD Zen 2",
            "GPU AMD RDNA 2",
            "SSD ultra-rapide 825GB",
            "Lecteur Blu-ray 4K",
            "Manette DualSense incluse",
        ],
        country_availability: ["CI", "SN", "MA", "NG"],
        is_active: true,
        created_at: "2024-01-23T16:00:00Z",
        updated_at: "2024-01-30T09:45:00Z",
        companies: {
            name: "Gaming Zone Casablanca",
            logo_url: "/images/merchants/gaming-zone.png",
        },
        product_types: {
            name: "Jeux vidéo & Jouets",
            slug: "jeux-video-jouets",
        },
    },

    // ===== 💄 BEAUTÉ & SANTÉ =====
    {
        id: "demo-creme-visage-bio",
        name: "Crème Visage Bio Karité & Argan 50ml",
        description:
            "Crème hydratante naturelle aux huiles africaines, peaux sensibles",
        price: 15500,
        currency: "XOF",
        image_url: "/images/products/creme-bio.jpg",
        features: [
            "100% naturel et bio",
            "Beurre de karité du Burkina",
            "Huile d'argan du Maroc",
            "Sans parabènes ni sulfates",
            "Convient aux peaux sensibles",
        ],
        country_availability: ["CI", "SN", "ML", "BF", "MA"],
        is_active: true,
        created_at: "2024-01-24T11:00:00Z",
        updated_at: "2024-01-31T14:20:00Z",
        companies: {
            name: "Cosmétiques Africains",
            logo_url: "/images/merchants/cosmetiques-africains.png",
        },
        product_types: {
            name: "Beauté & Santé",
            slug: "beaute-sante",
        },
    },

    // ===== 🚗 AUTO & MOTO =====
    {
        id: "demo-pneus-michelin",
        name: "Pneus Michelin Energy Saver 195/65 R15",
        description: "Pneus économiques longue durée pour véhicules urbains",
        price: 85000,
        currency: "XOF",
        image_url: "/images/products/pneus-michelin.jpg",
        features: [
            "Technologie Energy Saver",
            "Économie de carburant 4%",
            "Durée de vie prolongée",
            "Adhérence optimale",
            "Garantie 5 ans",
        ],
        country_availability: ["CI", "SN", "MA", "TN"],
        is_active: true,
        created_at: "2024-01-25T09:30:00Z",
        updated_at: "2024-02-01T16:45:00Z",
        companies: {
            name: "Michelin Afrique",
            logo_url: "/images/merchants/michelin.png",
        },
        product_types: {
            name: "Auto & Moto",
            slug: "auto-moto",
        },
    },

    // ===== 👗 MODE & ACCESSOIRES =====
    {
        id: "demo-boubou-wax",
        name: "Boubou Homme Wax Premium Kente",
        description:
            "Boubou traditionnel en tissu wax authentique, coupe moderne",
        price: 45000,
        currency: "XOF",
        image_url: "/images/products/boubou-wax.jpg",
        features: [
            "Tissu wax 100% coton",
            "Motifs Kente traditionnels",
            "Coupe moderne ajustée",
            "Broderies artisanales",
            "Tailles S à XXL",
        ],
        country_availability: ["CI", "SN", "ML", "BF", "GH"],
        is_active: true,
        created_at: "2024-01-26T13:15:00Z",
        updated_at: "2024-02-02T10:30:00Z",
        companies: {
            name: "Mode Africaine Dakar",
            logo_url: "/images/merchants/mode-africaine.png",
        },
        product_types: {
            name: "Mode & Accessoires",
            slug: "mode-accessoires",
        },
    },

    // ===== 🐕 ANIMALERIE =====
    {
        id: "demo-croquettes-chien",
        name: "Croquettes Premium Chien Adulte 15kg",
        description:
            "Alimentation complète pour chiens adultes, riche en protéines",
        price: 28500,
        currency: "XOF",
        image_url: "/images/products/croquettes-chien.jpg",
        features: [
            "Protéines de haute qualité",
            "Vitamines et minéraux",
            "Digestion facile",
            "Pelage brillant",
            "Sac de 15kg",
        ],
        country_availability: ["CI", "SN", "MA", "TN"],
        is_active: true,
        created_at: "2024-01-27T08:45:00Z",
        updated_at: "2024-02-03T12:15:00Z",
        companies: {
            name: "Animalerie du Sahel",
            logo_url: "/images/merchants/animalerie-sahel.png",
        },
        product_types: {
            name: "Animalerie",
            slug: "animalerie",
        },
    },

    // ===== ✈️ VOYAGES & SERVICES =====
    {
        id: "demo-assurance-voyage",
        name: "Assurance Voyage Afrique Complète",
        description:
            "Couverture voyage complète pour l'Afrique : santé, bagages, annulation",
        price: 25000,
        currency: "XOF",
        image_url: "/images/services/assurance-voyage.jpg",
        features: [
            "Couverture médicale 50 000€",
            "Rapatriement inclus",
            "Bagages jusqu'à 2 000€",
            "Annulation voyage",
            "Assistance 24h/7j",
        ],
        country_availability: ["CI", "SN", "ML", "BF", "MA", "TN"],
        is_active: true,
        created_at: "2024-01-28T14:20:00Z",
        updated_at: "2024-02-04T09:40:00Z",
        companies: {
            name: "Assurances Africaines",
            logo_url: "/images/merchants/assurances-africaines.png",
        },
        product_types: {
            name: "Voyages & Services",
            slug: "voyages-services",
        },
    },
]


// Fonction pour générer des offres par défaut pour un produit
const generateDefaultOffers = (product: any) => {
    const basePrice = product.price || 100000
    const merchantName = product.companies?.name || "Marchand Principal"
    const merchantLogo =
        product.companies?.logo_url || "/images/merchants/default.png"

    return [
        {
            merchant: merchantName,
            price: basePrice,
            currency: product.currency || "XOF",
            shipping: 0,
            delivery: "Retrait gratuit en magasin",
            stock: "En stock",
            rating: 4.2 + Math.random() * 0.6, // Entre 4.2 et 4.8
            logo: merchantLogo,
            payment_methods: ["Visa", "Mastercard", "Mobile Money"],
            warranty: "12 mois constructeur",
        },
        {
            merchant: "Marketplace AfricaHub",
            price: Math.round(basePrice * 1.05), // +5%
            currency: product.currency || "XOF",
            shipping: 2500,
            delivery: "Livraison 24-48h",
            stock: "En stock",
            rating: 4.0 + Math.random() * 0.5,
            logo: "/images/merchants/africahub.png",
            payment_methods: [
                "Visa",
                "Mastercard",
                "Orange Money",
                "MTN Money",
            ],
            warranty: "12 mois constructeur",
        },
        {
            merchant: "Partenaire Local",
            price: Math.round(basePrice * 0.95), // -5%
            currency: product.currency || "XOF",
            shipping: 0,
            delivery: "Retrait en point relais",
            stock: "Stock limité",
            rating: 3.8 + Math.random() * 0.4,
            logo: "/images/merchants/partenaire.png",
            payment_methods: ["Visa", "Mastercard", "Espèces"],
            warranty: "6 mois",
        },
    ]
}

// Fonction pour obtenir les produits avec fallback et offres automatiques
export const getProductsWithFallback = (supabaseProducts: any[]) => {
    let products = []

    // Si Supabase retourne des données, les utiliser
    if (supabaseProducts && supabaseProducts.length > 0) {
        products = supabaseProducts
    } else {
        // Sinon, utiliser les données de démonstration
        console.log(
            "🔄 Utilisation des données de démonstration pour les produits"
        )
        products = demoProducts
    }

    // Ajouter des offres par défaut aux produits qui n'en ont pas
    return products.map(product => ({
        ...product,
        offers: product.offers || generateDefaultOffers(product),
    }))
}

// Fonction pour adapter les données au format ProductComparisonView
export const getProductForComparison = (productId: string) => {
    const product = demoProducts.find(p => p.id === productId)
    if (!product) return null

    // Générer des offres multiples pour la comparaison
    const generateOffers = (baseProduct: any) => {
        const offers = [
            {
                merchant: baseProduct.companies.name,
                price: baseProduct.price,
                currency: baseProduct.currency,
                shipping: 0,
                delivery: "Retrait gratuit",
                stock: "En stock",
                rating: 4.8,
                logo: baseProduct.companies.logo_url,
                payment_methods: ["Visa", "Mastercard", "Mobile Money"],
                warranty: "12 mois officiel",
            },
        ]

        // Ajouter des offres concurrentes avec des prix différents
        if (baseProduct.currency === "XOF") {
            offers.push(
                {
                    merchant: "Jumia Côte d'Ivoire",
                    price: baseProduct.price + 15000,
                    currency: baseProduct.currency,
                    shipping: 3000,
                    delivery: "3-5 jours",
                    stock: "Stock limité",
                    rating: 4.0,
                    logo: "/images/merchants/jumia.png",
                    payment_methods: [
                        "Visa",
                        "Mastercard",
                        "Paiement à la livraison",
                    ],
                    warranty: "6 mois",
                },
                {
                    merchant: "MTN Store",
                    price: baseProduct.price - 5000,
                    currency: baseProduct.currency,
                    shipping: 0,
                    delivery: "Retrait en magasin",
                    stock: "En stock",
                    rating: 4.5,
                    logo: "/images/merchants/mtn-ci.png",
                    payment_methods: ["MTN Money", "Visa", "Espèces"],
                    warranty: "12 mois",
                }
            )
        } else if (baseProduct.currency === "MAD") {
            offers.push({
                merchant: "Marjane Maroc",
                price: baseProduct.price + 500,
                currency: baseProduct.currency,
                shipping: 99,
                delivery: "2-3 jours",
                stock: "Stock limité",
                rating: 4.2,
                logo: "/images/merchants/marjane.png",
                payment_methods: ["Visa", "Mastercard", "Carte Marjane"],
                warranty: "12 mois",
            })
        }

        return offers
    }

    // Générer des spécifications détaillées
    const generateSpecifications = (product: any) => {
        const baseSpecs: Record<string, string> = {
            Marque: product.companies.name.split(" ")[0],
            Catégorie: product.product_types.name,
            Prix: `${product.price.toLocaleString()} ${product.currency}`,
            Disponibilité: product.country_availability.join(", "),
        }

        // Spécifications spécifiques par catégorie
        if (product.product_types.slug === "electronique") {
            if (product.name.includes("AirPods")) {
                return {
                    ...baseSpecs,
                    Connectivité: "Bluetooth 5.3",
                    Autonomie: "6h + 24h avec boîtier",
                    Résistance: "IPX4",
                    Poids: "5.3g par écouteur",
                }
            } else if (product.name.includes("iPhone")) {
                return {
                    ...baseSpecs,
                    Écran: "6.1 pouces Super Retina XDR",
                    Stockage: "128GB/256GB/512GB",
                    "Appareil photo": "48MP + 12MP + 12MP",
                    Batterie: "Jusqu'à 23h de vidéo",
                }
            } else if (product.name.includes("MacBook")) {
                return {
                    ...baseSpecs,
                    Processeur: "Apple M3 8-core CPU",
                    Mémoire: "8GB/16GB/24GB",
                    Stockage: "256GB/512GB/1TB SSD",
                    Écran: '13.6" Liquid Retina',
                }
            }
        }

        return baseSpecs
    }

    return {
        id: product.id,
        name: product.name,
        category: product.product_types.name,
        description: product.description,
        image: product.image_url,
        rating: 4.5, // Note moyenne simulée
        reviews: Math.floor(Math.random() * 2000) + 500, // Nombre d'avis simulé
        features: product.features,
        specifications: generateSpecifications(product),
        offers: generateOffers(product),
        country_availability: product.country_availability,
    }
}

// Fonction pour obtenir les statistiques par secteur
export const getSectorStats = () => {
    const sectorCounts: Record<string, number> = {}

    demoProducts.forEach(product => {
        const sector = product.product_types.name
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1
    })

    return Object.entries(sectorCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
}

// Fonction pour obtenir les produits tendances (les plus récents)
export const getTrendingProducts = (limit: number = 6) => {
    return demoProducts
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        )
        .slice(0, limit)
}

// Fonction pour obtenir les top catégories avec leurs icônes
export const getTopCategories = () => {
    return [
        {
            name: "Électronique",
            slug: "electronique",
            icon: "📱",
            count: demoProducts.filter(
                p => p.product_types.slug === "electronique"
            ).length,
            description: "Smartphones, ordinateurs, audio",
        },
        {
            name: "Sport & Outdoor",
            slug: "sport-outdoor",
            icon: "⚽",
            count: demoProducts.filter(
                p => p.product_types.slug === "sport-outdoor"
            ).length,
            description: "Équipements sportifs, vélos",
        },
        {
            name: "Puériculture",
            slug: "puericulture",
            icon: "👶",
            count: demoProducts.filter(
                p => p.product_types.slug === "puericulture"
            ).length,
            description: "Bébé et enfants",
        },
        {
            name: "Maison & Jardin",
            slug: "maison-jardin",
            icon: "🏠",
            count: demoProducts.filter(
                p => p.product_types.slug === "maison-jardin"
            ).length,
            description: "Électroménager, décoration",
        },
        {
            name: "Épicerie",
            slug: "epicerie",
            icon: "🛒",
            count: demoProducts.filter(p => p.product_types.slug === "epicerie")
                .length,
            description: "Alimentation, produits frais",
        },
        {
            name: "Jeux vidéo & Jouets",
            slug: "jeux-video-jouets",
            icon: "🎮",
            count: demoProducts.filter(
                p => p.product_types.slug === "jeux-video-jouets"
            ).length,
            description: "Consoles, jeux, jouets",
        },
        {
            name: "Beauté & Santé",
            slug: "beaute-sante",
            icon: "💄",
            count: demoProducts.filter(
                p => p.product_types.slug === "beaute-sante"
            ).length,
            description: "Cosmétiques, soins",
        },
        {
            name: "Auto & Moto",
            slug: "auto-moto",
            icon: "🚗",
            count: demoProducts.filter(
                p => p.product_types.slug === "auto-moto"
            ).length,
            description: "Pièces auto, accessoires",
        },
        {
            name: "Mode & Accessoires",
            slug: "mode-accessoires",
            icon: "👗",
            count: demoProducts.filter(
                p => p.product_types.slug === "mode-accessoires"
            ).length,
            description: "Vêtements, chaussures",
        },
        {
            name: "Animalerie",
            slug: "animalerie",
            icon: "🐕",
            count: demoProducts.filter(
                p => p.product_types.slug === "animalerie"
            ).length,
            description: "Animaux de compagnie",
        },
        {
            name: "Voyages & Services",
            slug: "voyages-services",
            icon: "✈️",
            count: demoProducts.filter(
                p => p.product_types.slug === "voyages-services"
            ).length,
            description: "Assurances, voyages",
        },
    ].filter(category => category.count > 0)
}

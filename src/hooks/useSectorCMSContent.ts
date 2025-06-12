import { useQuery } from "@tanstack/react-query"

export interface SectorCMSContent {
    hero: {
        title: string
        subtitle: string
        description: string
        cta_text: string
        background_image?: string
    }
    features: Array<{
        id: string
        title: string
        description: string
        icon: string
        benefits: string[]
    }>
    benefits: Array<{
        id: string
        title: string
        description: string
        icon: string
    }>
    stats: {
        providers: number
        products: number
        savings: string
        users: number
    }
    testimonials: Array<{
        id: string
        name: string
        company: string
        content: string
        rating: number
        avatar?: string
    }>
}

// Données CMS enrichies par secteur
const sectorCMSData: Record<string, SectorCMSContent> = {
    retail: {
        hero: {
            title: "Solutions Retail & E-commerce",
            subtitle:
                "Transformez votre commerce avec les meilleures solutions digitales",
            description:
                "Découvrez les plateformes e-commerce, systèmes de caisse et outils de gestion qui révolutionnent le commerce de détail en Afrique.",
            cta_text: "Explorer les solutions",
        },
        features: [
            {
                id: "f1",
                title: "Plateformes E-commerce",
                description:
                    "Solutions complètes pour créer et gérer votre boutique en ligne",
                icon: "Store",
                benefits: [
                    "Boutique personnalisable",
                    "Paiements sécurisés",
                    "Gestion des stocks",
                    "Analytics avancés",
                ],
            },
            {
                id: "f2",
                title: "Systèmes de Caisse",
                description: "Caisses enregistreuses modernes et connectées",
                icon: "CreditCard",
                benefits: [
                    "Interface intuitive",
                    "Multi-devises",
                    "Rapports en temps réel",
                    "Intégration comptable",
                ],
            },
            {
                id: "f3",
                title: "Gestion Inventory",
                description:
                    "Optimisez votre gestion des stocks et approvisionnements",
                icon: "Package",
                benefits: [
                    "Suivi en temps réel",
                    "Alertes automatiques",
                    "Prévisions de demande",
                    "Multi-entrepôts",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Augmentez vos ventes",
                description:
                    "Boostez votre chiffre d'affaires avec des outils performants",
                icon: "TrendingUp",
            },
            {
                id: "b2",
                title: "Réduisez vos coûts",
                description: "Optimisez vos opérations et diminuez vos charges",
                icon: "DollarSign",
            },
            {
                id: "b3",
                title: "Fidélisez vos clients",
                description: "Offrez une expérience client exceptionnelle",
                icon: "Heart",
            },
        ],
        stats: {
            providers: 45,
            products: 120,
            savings: "35%",
            users: 15000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Aminata Diallo",
                company: "Boutique Mode Dakar",
                content:
                    "Grâce à la plateforme e-commerce, j'ai triplé mes ventes en 6 mois !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Jean-Claude Kouassi",
                company: "Supermarché Abidjan",
                content:
                    "Le système de caisse a révolutionné notre gestion quotidienne.",
                rating: 5,
            },
        ],
    },
    "assurance-auto": {
        hero: {
            title: "Assurance Automobile",
            subtitle: "Protégez votre véhicule avec les meilleures assurances",
            description:
                "Comparez et choisissez parmi les meilleures offres d'assurance auto en Afrique. Protection complète, tarifs compétitifs.",
            cta_text: "Comparer les assurances",
        },
        features: [
            {
                id: "f1",
                title: "Tous Risques",
                description: "Protection complète pour votre véhicule",
                icon: "Shield",
                benefits: [
                    "Dommages tous accidents",
                    "Vol et incendie",
                    "Bris de glace",
                    "Assistance 24/7",
                ],
            },
            {
                id: "f2",
                title: "Responsabilité Civile",
                description: "Couverture obligatoire optimisée",
                icon: "Users",
                benefits: [
                    "Dommages corporels",
                    "Dommages matériels",
                    "Défense recours",
                    "Protection juridique",
                ],
            },
            {
                id: "f3",
                title: "Services Plus",
                description: "Services additionnels pour votre tranquillité",
                icon: "Plus",
                benefits: [
                    "Véhicule de remplacement",
                    "Remorquage",
                    "Dépannage",
                    "Constat amiable digital",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Économisez jusqu'à 40%",
                description: "Trouvez les meilleurs tarifs du marché",
                icon: "Percent",
            },
            {
                id: "b2",
                title: "Souscription rapide",
                description: "Obtenez votre attestation en quelques minutes",
                icon: "Clock",
            },
            {
                id: "b3",
                title: "Support expert",
                description: "Accompagnement personnalisé par nos conseillers",
                icon: "Headphones",
            },
        ],
        stats: {
            providers: 25,
            products: 85,
            savings: "40%",
            users: 50000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Mamadou Traoré",
                company: "Chauffeur Taxi",
                content:
                    "J'ai économisé 300€ par an en changeant d'assurance !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Sarah Mensah",
                company: "Entreprise Transport",
                content:
                    "Service client exceptionnel et tarifs très compétitifs.",
                rating: 5,
            },
        ],
    },
    travel: {
        hero: {
            title: "Voyages & Tourisme",
            subtitle: "Explorez l'Afrique en toute sérénité",
            description:
                "Découvrez les meilleures offres de voyage, assurances et services touristiques pour explorer le continent africain.",
            cta_text: "Planifier mon voyage",
        },
        features: [
            {
                id: "f1",
                title: "Assurance Voyage",
                description: "Protection complète pour vos déplacements",
                icon: "Shield",
                benefits: [
                    "Frais médicaux",
                    "Annulation voyage",
                    "Rapatriement",
                    "Bagages perdus",
                ],
            },
            {
                id: "f2",
                title: "Réservations Hôtels",
                description: "Les meilleurs hébergements au meilleur prix",
                icon: "Building",
                benefits: [
                    "Meilleurs tarifs garantis",
                    "Annulation gratuite",
                    "Support 24/7",
                    "Avis vérifiés",
                ],
            },
            {
                id: "f3",
                title: "Guides & Excursions",
                description: "Découvrez l'Afrique avec des experts locaux",
                icon: "Map",
                benefits: [
                    "Guides certifiés",
                    "Circuits personnalisés",
                    "Culture locale",
                    "Sécurité garantie",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Voyagez en sécurité",
                description: "Protection complète pour tous vos voyages",
                icon: "Shield",
            },
            {
                id: "b2",
                title: "Meilleurs prix",
                description: "Tarifs négociés avec nos partenaires",
                icon: "DollarSign",
            },
            {
                id: "b3",
                title: "Expérience authentique",
                description: "Découvrez la vraie culture africaine",
                icon: "Heart",
            },
        ],
        stats: {
            providers: 35,
            products: 150,
            savings: "25%",
            users: 25000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Marie Dubois",
                company: "Voyageuse",
                content:
                    "Un voyage inoubliable au Kenya, tout était parfaitement organisé !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Ahmed Hassan",
                company: "Guide Touristique",
                content:
                    "Excellente plateforme pour promouvoir nos services locaux.",
                rating: 5,
            },
        ],
    },
    sante: {
        hero: {
            title: "Services de Santé",
            subtitle: "Votre santé, notre priorité",
            description:
                "Accédez aux meilleurs services de santé en Afrique : télémédecine, pharmacies en ligne, assurances santé.",
            cta_text: "Consulter maintenant",
        },
        features: [
            {
                id: "f1",
                title: "Télémédecine",
                description: "Consultations médicales à distance",
                icon: "Video",
                benefits: [
                    "Médecins certifiés",
                    "Consultations 24/7",
                    "Ordonnances digitales",
                    "Suivi patient",
                ],
            },
            {
                id: "f2",
                title: "Pharmacie en Ligne",
                description: "Médicaments livrés à domicile",
                icon: "Pill",
                benefits: [
                    "Médicaments authentiques",
                    "Livraison rapide",
                    "Conseil pharmacien",
                    "Prix transparents",
                ],
            },
            {
                id: "f3",
                title: "Assurance Santé",
                description: "Protection santé pour toute la famille",
                icon: "Heart",
                benefits: [
                    "Couverture étendue",
                    "Réseau de soins",
                    "Remboursements rapides",
                    "Prévention incluse",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Accès facilité",
                description: "Soins de santé accessibles partout en Afrique",
                icon: "MapPin",
            },
            {
                id: "b2",
                title: "Qualité garantie",
                description:
                    "Professionnels de santé certifiés et expérimentés",
                icon: "Award",
            },
            {
                id: "b3",
                title: "Prix abordables",
                description: "Soins de qualité à des tarifs accessibles",
                icon: "DollarSign",
            },
        ],
        stats: {
            providers: 60,
            products: 200,
            savings: "30%",
            users: 75000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Dr. Fatima Kone",
                company: "Médecin Généraliste",
                content:
                    "La télémédecine révolutionne l'accès aux soins en zone rurale.",
                rating: 5,
            },
            {
                id: "t2",
                name: "Ibrahim Sow",
                company: "Patient",
                content:
                    "Service exceptionnel, j'ai pu consulter depuis mon village !",
                rating: 5,
            },
        ],
    },
    business: {
        hero: {
            title: "Solutions Entreprise",
            subtitle: "Développez votre business avec les bons outils",
            description:
                "Découvrez les meilleures solutions B2B pour optimiser votre gestion, comptabilité, CRM et développement commercial.",
            cta_text: "Booster mon entreprise",
        },
        features: [
            {
                id: "f1",
                title: "Gestion Comptable",
                description: "Logiciels de comptabilité adaptés à l'Afrique",
                icon: "Calculator",
                benefits: [
                    "Facturation automatisée",
                    "Déclarations fiscales",
                    "Tableaux de bord",
                    "Multi-devises",
                ],
            },
            {
                id: "f2",
                title: "CRM & Ventes",
                description: "Optimisez votre relation client et vos ventes",
                icon: "Users",
                benefits: [
                    "Suivi prospects",
                    "Automatisation marketing",
                    "Rapports avancés",
                    "Intégrations",
                ],
            },
            {
                id: "f3",
                title: "Outils Collaboration",
                description: "Solutions pour le travail en équipe",
                icon: "MessageSquare",
                benefits: [
                    "Communication unifiée",
                    "Gestion projets",
                    "Partage documents",
                    "Visioconférence",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Productivité +50%",
                description: "Automatisez vos processus et gagnez du temps",
                icon: "Zap",
            },
            {
                id: "b2",
                title: "Croissance accélérée",
                description: "Outils pour développer rapidement votre business",
                icon: "TrendingUp",
            },
            {
                id: "b3",
                title: "Conformité garantie",
                description: "Respectez les réglementations locales",
                icon: "CheckCircle",
            },
        ],
        stats: {
            providers: 40,
            products: 95,
            savings: "45%",
            users: 12000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Kwame Asante",
                company: "CEO TechStart Ghana",
                content:
                    "Ces outils ont transformé notre façon de travailler !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Aisha Mwangi",
                company: "Directrice Financière",
                content: "La gestion comptable n'a jamais été aussi simple.",
                rating: 5,
            },
        ],
    },
    banque: {
        hero: {
            title: "Services Bancaires",
            subtitle: "Votre partenaire financier de confiance",
            description:
                "Découvrez les meilleures solutions bancaires en Afrique : comptes, crédits, épargne et services digitaux adaptés à vos besoins.",
            cta_text: "Comparer les banques",
        },
        features: [
            {
                id: "f1",
                title: "Comptes Bancaires",
                description:
                    "Comptes courants et d'épargne adaptés à l'Afrique",
                icon: "CreditCard",
                benefits: [
                    "Frais réduits",
                    "Mobile Banking",
                    "Cartes internationales",
                    "Virements gratuits",
                ],
            },
            {
                id: "f2",
                title: "Crédits & Prêts",
                description: "Solutions de financement pour tous vos projets",
                icon: "DollarSign",
                benefits: [
                    "Taux compétitifs",
                    "Procédure simplifiée",
                    "Réponse rapide",
                    "Accompagnement personnalisé",
                ],
            },
            {
                id: "f3",
                title: "Services Digitaux",
                description: "Banking digital et mobile money",
                icon: "Smartphone",
                benefits: [
                    "App mobile intuitive",
                    "Paiements sans contact",
                    "Transferts instantanés",
                    "Sécurité renforcée",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Frais bancaires réduits",
                description: "Économisez sur vos frais bancaires mensuels",
                icon: "Percent",
            },
            {
                id: "b2",
                title: "Accès facilité",
                description: "Réseau d'agences et services digitaux étendus",
                icon: "MapPin",
            },
            {
                id: "b3",
                title: "Support multilingue",
                description: "Service client dans votre langue locale",
                icon: "MessageCircle",
            },
        ],
        stats: {
            providers: 35,
            products: 75,
            savings: "30%",
            users: 85000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Fatou Diop",
                company: "Entrepreneure",
                content:
                    "Grâce à mon crédit business, j'ai pu développer mon entreprise !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Kofi Asante",
                company: "Commerçant",
                content:
                    "Le mobile banking a révolutionné ma gestion quotidienne.",
                rating: 5,
            },
        ],
    },
    energie: {
        hero: {
            title: "Solutions Énergétiques",
            subtitle: "L'énergie durable pour l'Afrique",
            description:
                "Explorez les solutions énergétiques innovantes : solaire, éolien, biomasse et réseaux intelligents pour un avenir durable.",
            cta_text: "Découvrir les solutions",
        },
        features: [
            {
                id: "f1",
                title: "Énergie Solaire",
                description: "Systèmes photovoltaïques et thermiques",
                icon: "Sun",
                benefits: [
                    "Panneaux haute performance",
                    "Installation clé en main",
                    "Maintenance incluse",
                    "ROI garanti",
                ],
            },
            {
                id: "f2",
                title: "Réseaux Intelligents",
                description: "Smart grids et gestion énergétique",
                icon: "Zap",
                benefits: [
                    "Optimisation automatique",
                    "Monitoring temps réel",
                    "Réduction des pertes",
                    "Intégration renouvelables",
                ],
            },
            {
                id: "f3",
                title: "Solutions Hybrides",
                description: "Combinaison de sources énergétiques",
                icon: "Battery",
                benefits: [
                    "Autonomie maximale",
                    "Stockage intelligent",
                    "Backup automatique",
                    "Évolutivité",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Économies d'énergie",
                description: "Réduisez vos factures énergétiques jusqu'à 70%",
                icon: "TrendingDown",
            },
            {
                id: "b2",
                title: "Impact environnemental",
                description: "Contribuez à un avenir plus vert et durable",
                icon: "Leaf",
            },
            {
                id: "b3",
                title: "Indépendance énergétique",
                description: "Libérez-vous des coupures et fluctuations",
                icon: "Shield",
            },
        ],
        stats: {
            providers: 28,
            products: 65,
            savings: "60%",
            users: 32000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Dr. Amina Kone",
                company: "Hôpital Rural",
                content:
                    "L'énergie solaire assure le fonctionnement continu de notre hôpital.",
                rating: 5,
            },
            {
                id: "t2",
                name: "Pierre Ngozi",
                company: "Usine Textile",
                content:
                    "Nos coûts énergétiques ont chuté de 65% avec le système hybride.",
                rating: 5,
            },
        ],
    },
    telecom: {
        hero: {
            title: "Télécommunications",
            subtitle: "Connectez l'Afrique au monde",
            description:
                "Découvrez les meilleures offres télécoms : mobile, internet, data et solutions entreprises pour rester connecté partout en Afrique.",
            cta_text: "Comparer les offres",
        },
        features: [
            {
                id: "f1",
                title: "Forfaits Mobile",
                description: "Appels, SMS et data illimités",
                icon: "Smartphone",
                benefits: [
                    "Couverture nationale",
                    "Roaming Afrique",
                    "Data haute vitesse",
                    "Tarifs préférentiels",
                ],
            },
            {
                id: "f2",
                title: "Internet Fibre",
                description: "Connexion haut débit ultra-rapide",
                icon: "Wifi",
                benefits: [
                    "Débit symétrique",
                    "Installation gratuite",
                    "Support technique 24/7",
                    "IP fixe incluse",
                ],
            },
            {
                id: "f3",
                title: "Solutions Entreprise",
                description: "Télécoms professionnelles sur mesure",
                icon: "Building",
                benefits: [
                    "Réseau privé",
                    "Sécurité renforcée",
                    "SLA garantie",
                    "Support dédié",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Couverture étendue",
                description: "Réseau disponible dans toute l'Afrique",
                icon: "Globe",
            },
            {
                id: "b2",
                title: "Tarifs compétitifs",
                description: "Les meilleurs prix du marché africain",
                icon: "DollarSign",
            },
            {
                id: "b3",
                title: "Innovation continue",
                description: "Technologies de pointe et 5G",
                icon: "Zap",
            },
        ],
        stats: {
            providers: 42,
            products: 95,
            savings: "35%",
            users: 120000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Moussa Camara",
                company: "Startup Tech",
                content:
                    "La fibre nous a permis de développer nos services cloud !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Grace Okafor",
                company: "Consultante",
                content: "Excellent réseau mobile, je reste connectée partout.",
                rating: 5,
            },
        ],
    },
    immobilier: {
        hero: {
            title: "Immobilier",
            subtitle: "Votre projet immobilier en Afrique",
            description:
                "Trouvez les meilleures opportunités immobilières : achat, vente, location et investissement dans toute l'Afrique.",
            cta_text: "Explorer les biens",
        },
        features: [
            {
                id: "f1",
                title: "Achat & Vente",
                description: "Transactions immobilières sécurisées",
                icon: "Home",
                benefits: [
                    "Expertise juridique",
                    "Évaluation gratuite",
                    "Négociation assistée",
                    "Financement facilité",
                ],
            },
            {
                id: "f2",
                title: "Location & Gestion",
                description: "Services locatifs complets",
                icon: "Key",
                benefits: [
                    "Gestion locative",
                    "Maintenance incluse",
                    "Assurance propriétaire",
                    "Revenus garantis",
                ],
            },
            {
                id: "f3",
                title: "Investissement",
                description: "Opportunités d'investissement rentables",
                icon: "TrendingUp",
                benefits: [
                    "ROI attractif",
                    "Marchés émergents",
                    "Diversification",
                    "Accompagnement expert",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Marché en croissance",
                description: "Profitez du boom immobilier africain",
                icon: "BarChart3",
            },
            {
                id: "b2",
                title: "Sécurité juridique",
                description: "Transactions protégées et conformes",
                icon: "Shield",
            },
            {
                id: "b3",
                title: "Accompagnement local",
                description: "Experts locaux dans chaque pays",
                icon: "Users",
            },
        ],
        stats: {
            providers: 38,
            products: 180,
            savings: "25%",
            users: 45000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Adjoa Mensah",
                company: "Investisseuse",
                content:
                    "J'ai trouvé l'appartement parfait à Accra grâce à la plateforme !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Omar Benali",
                company: "Entrepreneur",
                content:
                    "Excellent accompagnement pour mon investissement locatif.",
                rating: 5,
            },
        ],
    },
    transport: {
        hero: {
            title: "Transport & Logistique",
            subtitle: "Mobilité et logistique intelligentes",
            description:
                "Solutions de transport modernes : VTC, livraison, logistique et mobilité urbaine pour une Afrique connectée.",
            cta_text: "Découvrir les services",
        },
        features: [
            {
                id: "f1",
                title: "Transport de Personnes",
                description: "VTC et transport urbain",
                icon: "Car",
                benefits: [
                    "Réservation instantanée",
                    "Tarifs transparents",
                    "Conducteurs vérifiés",
                    "Paiement sécurisé",
                ],
            },
            {
                id: "f2",
                title: "Livraison Express",
                description: "Livraison rapide et fiable",
                icon: "Truck",
                benefits: [
                    "Livraison same-day",
                    "Suivi temps réel",
                    "Assurance colis",
                    "Réseau étendu",
                ],
            },
            {
                id: "f3",
                title: "Logistique B2B",
                description: "Solutions logistiques professionnelles",
                icon: "Package",
                benefits: [
                    "Chaîne du froid",
                    "Entreposage",
                    "Distribution",
                    "Optimisation routes",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Efficacité optimisée",
                description: "Réduisez vos temps et coûts de transport",
                icon: "Clock",
            },
            {
                id: "b2",
                title: "Réseau panafricain",
                description: "Couverture dans toute l'Afrique",
                icon: "MapPin",
            },
            {
                id: "b3",
                title: "Technologie avancée",
                description: "IA et optimisation des trajets",
                icon: "Cpu",
            },
        ],
        stats: {
            providers: 32,
            products: 85,
            savings: "40%",
            users: 95000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Kemi Adebayo",
                company: "E-commerce",
                content:
                    "La livraison express a boosté notre satisfaction client !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Jean-Paul Mukendi",
                company: "Importateur",
                content: "Logistique impeccable pour nos marchandises.",
                rating: 5,
            },
        ],
    },
    education: {
        hero: {
            title: "Éducation & Formation",
            subtitle: "Investissez dans votre avenir",
            description:
                "Accédez aux meilleures formations en ligne, universités et programmes éducatifs pour développer vos compétences en Afrique.",
            cta_text: "Explorer les formations",
        },
        features: [
            {
                id: "f1",
                title: "Formations en Ligne",
                description: "Cours et certifications digitales",
                icon: "Monitor",
                benefits: [
                    "Accès 24/7",
                    "Certificats reconnus",
                    "Mentoring inclus",
                    "Contenu actualisé",
                ],
            },
            {
                id: "f2",
                title: "Universités Partenaires",
                description: "Diplômes et programmes universitaires",
                icon: "GraduationCap",
                benefits: [
                    "Diplômes accrédités",
                    "Campus modernes",
                    "Bourses disponibles",
                    "Réseau alumni",
                ],
            },
            {
                id: "f3",
                title: "Formation Professionnelle",
                description: "Compétences métiers et techniques",
                icon: "Briefcase",
                benefits: [
                    "Formation pratique",
                    "Stages garantis",
                    "Placement emploi",
                    "Suivi carrière",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Accessibilité maximale",
                description: "Formation accessible partout en Afrique",
                icon: "Globe",
            },
            {
                id: "b2",
                title: "Qualité reconnue",
                description: "Programmes certifiés et accrédités",
                icon: "Award",
            },
            {
                id: "b3",
                title: "Employabilité renforcée",
                description: "Compétences recherchées par les employeurs",
                icon: "Target",
            },
        ],
        stats: {
            providers: 55,
            products: 220,
            savings: "50%",
            users: 180000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Aïcha Touré",
                company: "Développeuse Web",
                content:
                    "La formation en ligne m'a permis de changer de carrière !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Samuel Osei",
                company: "Étudiant MBA",
                content:
                    "Excellent programme universitaire avec un réseau international.",
                rating: 5,
            },
        ],
    },
    commerce: {
        hero: {
            title: "Commerce & Distribution",
            subtitle: "Développez votre activité commerciale",
            description:
                "Solutions complètes pour le commerce : gestion des ventes, distribution, marketing et développement commercial en Afrique.",
            cta_text: "Booster mes ventes",
        },
        features: [
            {
                id: "f1",
                title: "Gestion des Ventes",
                description: "Outils de vente et CRM intégrés",
                icon: "ShoppingCart",
                benefits: [
                    "Suivi prospects",
                    "Automatisation ventes",
                    "Rapports détaillés",
                    "Mobile first",
                ],
            },
            {
                id: "f2",
                title: "Distribution & Logistique",
                description: "Réseau de distribution optimisé",
                icon: "Truck",
                benefits: [
                    "Réseau étendu",
                    "Livraison rapide",
                    "Gestion stocks",
                    "Traçabilité complète",
                ],
            },
            {
                id: "f3",
                title: "Marketing Digital",
                description: "Stratégies marketing personnalisées",
                icon: "Megaphone",
                benefits: [
                    "Campagnes ciblées",
                    "Réseaux sociaux",
                    "Analytics avancés",
                    "ROI optimisé",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Croissance accélérée",
                description: "Développez rapidement votre chiffre d'affaires",
                icon: "TrendingUp",
            },
            {
                id: "b2",
                title: "Efficacité opérationnelle",
                description: "Optimisez vos processus commerciaux",
                icon: "Zap",
            },
            {
                id: "b3",
                title: "Présence digitale",
                description: "Renforcez votre visibilité en ligne",
                icon: "Eye",
            },
        ],
        stats: {
            providers: 48,
            products: 135,
            savings: "45%",
            users: 65000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Fatima Al-Zahra",
                company: "Boutique Mode",
                content:
                    "Mes ventes ont doublé grâce aux outils de marketing digital !",
                rating: 5,
            },
            {
                id: "t2",
                name: "Kweku Antwi",
                company: "Distributeur",
                content:
                    "La logistique intégrée a révolutionné notre distribution.",
                rating: 5,
            },
        ],
    },
    health: {
        hero: {
            title: "Services de Santé",
            subtitle: "Votre santé, notre priorité absolue",
            description:
                "Accédez aux meilleurs services de santé en Afrique : télémédecine, pharmacies en ligne, assurances santé et soins médicaux de qualité.",
            cta_text: "Consulter maintenant",
        },
        features: [
            {
                id: "f1",
                title: "Télémédecine",
                description:
                    "Consultations médicales à distance avec des professionnels certifiés",
                icon: "Video",
                benefits: [
                    "Médecins certifiés",
                    "Consultations 24/7",
                    "Ordonnances digitales",
                    "Suivi patient personnalisé",
                ],
            },
            {
                id: "f2",
                title: "Pharmacie en Ligne",
                description: "Médicaments authentiques livrés à domicile",
                icon: "Pill",
                benefits: [
                    "Médicaments authentiques",
                    "Livraison rapide",
                    "Conseil pharmacien",
                    "Prix transparents",
                ],
            },
            {
                id: "f3",
                title: "Assurance Santé",
                description: "Protection santé complète pour toute la famille",
                icon: "Heart",
                benefits: [
                    "Couverture étendue",
                    "Réseau de soins",
                    "Remboursements rapides",
                    "Prévention incluse",
                ],
            },
            {
                id: "f4",
                title: "Soins Hospitaliers",
                description: "Hôpitaux et cliniques de référence",
                icon: "Building2",
                benefits: [
                    "Équipements modernes",
                    "Spécialistes qualifiés",
                    "Urgences 24/7",
                    "Soins de qualité",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Accès facilité aux soins",
                description: "Soins de santé accessibles partout en Afrique",
                icon: "MapPin",
            },
            {
                id: "b2",
                title: "Qualité garantie",
                description:
                    "Professionnels de santé certifiés et expérimentés",
                icon: "Award",
            },
            {
                id: "b3",
                title: "Prix abordables",
                description: "Soins de qualité à des tarifs accessibles",
                icon: "DollarSign",
            },
            {
                id: "b4",
                title: "Innovation médicale",
                description: "Technologies de pointe au service de votre santé",
                icon: "Zap",
            },
        ],
        stats: {
            providers: 85,
            products: 320,
            savings: "40%",
            users: 250000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Dr. Fatima Kone",
                company: "Médecin Généraliste",
                content:
                    "La télémédecine révolutionne l'accès aux soins en zone rurale. Nos patients peuvent maintenant consulter depuis leur village.",
                rating: 5,
            },
            {
                id: "t2",
                name: "Ibrahim Sow",
                company: "Patient",
                content:
                    "Service exceptionnel ! J'ai pu consulter un spécialiste depuis mon village et recevoir mes médicaments rapidement.",
                rating: 5,
            },
            {
                id: "t3",
                name: "Dr. Amina Hassan",
                company: "Cardiologue",
                content:
                    "La plateforme facilite grandement le suivi de mes patients chroniques. Un vrai plus pour la continuité des soins.",
                rating: 5,
            },
        ],
    },
    health: {
        hero: {
            title: "Services de Santé",
            subtitle: "Votre santé, notre priorité absolue",
            description:
                "Accédez aux meilleurs services de santé en Afrique : télémédecine, pharmacies en ligne, assurances santé et soins médicaux de qualité.",
            cta_text: "Consulter maintenant",
        },
        features: [
            {
                id: "f1",
                title: "Télémédecine",
                description:
                    "Consultations médicales à distance avec des professionnels certifiés",
                icon: "Video",
                benefits: [
                    "Médecins certifiés",
                    "Consultations 24/7",
                    "Ordonnances digitales",
                    "Suivi patient personnalisé",
                ],
            },
            {
                id: "f2",
                title: "Pharmacie en Ligne",
                description: "Médicaments authentiques livrés à domicile",
                icon: "Pill",
                benefits: [
                    "Médicaments authentiques",
                    "Livraison rapide",
                    "Conseil pharmacien",
                    "Prix transparents",
                ],
            },
            {
                id: "f3",
                title: "Assurance Santé",
                description: "Protection santé complète pour toute la famille",
                icon: "Heart",
                benefits: [
                    "Couverture étendue",
                    "Réseau de soins",
                    "Remboursements rapides",
                    "Prévention incluse",
                ],
            },
            {
                id: "f4",
                title: "Soins Hospitaliers",
                description: "Hôpitaux et cliniques de référence",
                icon: "Building2",
                benefits: [
                    "Équipements modernes",
                    "Spécialistes qualifiés",
                    "Urgences 24/7",
                    "Soins de qualité",
                ],
            },
        ],
        benefits: [
            {
                id: "b1",
                title: "Accès facilité aux soins",
                description: "Soins de santé accessibles partout en Afrique",
                icon: "MapPin",
            },
            {
                id: "b2",
                title: "Qualité garantie",
                description:
                    "Professionnels de santé certifiés et expérimentés",
                icon: "Award",
            },
            {
                id: "b3",
                title: "Prix abordables",
                description: "Soins de qualité à des tarifs accessibles",
                icon: "DollarSign",
            },
            {
                id: "b4",
                title: "Innovation médicale",
                description: "Technologies de pointe au service de votre santé",
                icon: "Zap",
            },
        ],
        stats: {
            providers: 85,
            products: 320,
            savings: "40%",
            users: 250000,
        },
        testimonials: [
            {
                id: "t1",
                name: "Dr. Fatima Kone",
                company: "Médecin Généraliste",
                content:
                    "La télémédecine révolutionne l'accès aux soins en zone rurale. Nos patients peuvent maintenant consulter depuis leur village.",
                rating: 5,
            },
            {
                id: "t2",
                name: "Ibrahim Sow",
                company: "Patient",
                content:
                    "Service exceptionnel ! J'ai pu consulter un spécialiste depuis mon village et recevoir mes médicaments rapidement.",
                rating: 5,
            },
            {
                id: "t3",
                name: "Dr. Amina Hassan",
                company: "Cardiologue",
                content:
                    "La plateforme facilite grandement le suivi de mes patients chroniques. Un vrai plus pour la continuité des soins.",
                rating: 5,
            },
        ],
    },
}

export const useSectorCMSContent = (sectorSlug: string) => {
    return useQuery({
        queryKey: ["sector-cms-content", sectorSlug],
        queryFn: async (): Promise<SectorCMSContent> => {
            // Simulation d'un délai réseau
            await new Promise(resolve => setTimeout(resolve, 100))

            const content = sectorCMSData[sectorSlug]
            if (!content) {
                throw new Error(
                    `Contenu CMS non trouvé pour le secteur: ${sectorSlug}`
                )
            }

            return content
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    })
}

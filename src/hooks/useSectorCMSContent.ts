import { useQuery } from '@tanstack/react-query'

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
  'retail': {
    hero: {
      title: 'Solutions Retail & E-commerce',
      subtitle: 'Transformez votre commerce avec les meilleures solutions digitales',
      description: 'Découvrez les plateformes e-commerce, systèmes de caisse et outils de gestion qui révolutionnent le commerce de détail en Afrique.',
      cta_text: 'Explorer les solutions'
    },
    features: [
      {
        id: 'f1',
        title: 'Plateformes E-commerce',
        description: 'Solutions complètes pour créer et gérer votre boutique en ligne',
        icon: 'Store',
        benefits: ['Boutique personnalisable', 'Paiements sécurisés', 'Gestion des stocks', 'Analytics avancés']
      },
      {
        id: 'f2',
        title: 'Systèmes de Caisse',
        description: 'Caisses enregistreuses modernes et connectées',
        icon: 'CreditCard',
        benefits: ['Interface intuitive', 'Multi-devises', 'Rapports en temps réel', 'Intégration comptable']
      },
      {
        id: 'f3',
        title: 'Gestion Inventory',
        description: 'Optimisez votre gestion des stocks et approvisionnements',
        icon: 'Package',
        benefits: ['Suivi en temps réel', 'Alertes automatiques', 'Prévisions de demande', 'Multi-entrepôts']
      }
    ],
    benefits: [
      {
        id: 'b1',
        title: 'Augmentez vos ventes',
        description: 'Boostez votre chiffre d\'affaires avec des outils performants',
        icon: 'TrendingUp'
      },
      {
        id: 'b2',
        title: 'Réduisez vos coûts',
        description: 'Optimisez vos opérations et diminuez vos charges',
        icon: 'DollarSign'
      },
      {
        id: 'b3',
        title: 'Fidélisez vos clients',
        description: 'Offrez une expérience client exceptionnelle',
        icon: 'Heart'
      }
    ],
    stats: {
      providers: 45,
      products: 120,
      savings: '35%',
      users: 15000
    },
    testimonials: [
      {
        id: 't1',
        name: 'Aminata Diallo',
        company: 'Boutique Mode Dakar',
        content: 'Grâce à la plateforme e-commerce, j\'ai triplé mes ventes en 6 mois !',
        rating: 5
      },
      {
        id: 't2',
        name: 'Jean-Claude Kouassi',
        company: 'Supermarché Abidjan',
        content: 'Le système de caisse a révolutionné notre gestion quotidienne.',
        rating: 5
      }
    ]
  },
  'assurance-auto': {
    hero: {
      title: 'Assurance Automobile',
      subtitle: 'Protégez votre véhicule avec les meilleures assurances',
      description: 'Comparez et choisissez parmi les meilleures offres d\'assurance auto en Afrique. Protection complète, tarifs compétitifs.',
      cta_text: 'Comparer les assurances'
    },
    features: [
      {
        id: 'f1',
        title: 'Tous Risques',
        description: 'Protection complète pour votre véhicule',
        icon: 'Shield',
        benefits: ['Dommages tous accidents', 'Vol et incendie', 'Bris de glace', 'Assistance 24/7']
      },
      {
        id: 'f2',
        title: 'Responsabilité Civile',
        description: 'Couverture obligatoire optimisée',
        icon: 'Users',
        benefits: ['Dommages corporels', 'Dommages matériels', 'Défense recours', 'Protection juridique']
      },
      {
        id: 'f3',
        title: 'Services Plus',
        description: 'Services additionnels pour votre tranquillité',
        icon: 'Plus',
        benefits: ['Véhicule de remplacement', 'Remorquage', 'Dépannage', 'Constat amiable digital']
      }
    ],
    benefits: [
      {
        id: 'b1',
        title: 'Économisez jusqu\'à 40%',
        description: 'Trouvez les meilleurs tarifs du marché',
        icon: 'Percent'
      },
      {
        id: 'b2',
        title: 'Souscription rapide',
        description: 'Obtenez votre attestation en quelques minutes',
        icon: 'Clock'
      },
      {
        id: 'b3',
        title: 'Support expert',
        description: 'Accompagnement personnalisé par nos conseillers',
        icon: 'Headphones'
      }
    ],
    stats: {
      providers: 25,
      products: 85,
      savings: '40%',
      users: 50000
    },
    testimonials: [
      {
        id: 't1',
        name: 'Mamadou Traoré',
        company: 'Chauffeur Taxi',
        content: 'J\'ai économisé 300€ par an en changeant d\'assurance !',
        rating: 5
      },
      {
        id: 't2',
        name: 'Sarah Mensah',
        company: 'Entreprise Transport',
        content: 'Service client exceptionnel et tarifs très compétitifs.',
        rating: 5
      }
    ]
  },
  'travel': {
    hero: {
      title: 'Voyages & Tourisme',
      subtitle: 'Explorez l\'Afrique en toute sérénité',
      description: 'Découvrez les meilleures offres de voyage, assurances et services touristiques pour explorer le continent africain.',
      cta_text: 'Planifier mon voyage'
    },
    features: [
      {
        id: 'f1',
        title: 'Assurance Voyage',
        description: 'Protection complète pour vos déplacements',
        icon: 'Shield',
        benefits: ['Frais médicaux', 'Annulation voyage', 'Rapatriement', 'Bagages perdus']
      },
      {
        id: 'f2',
        title: 'Réservations Hôtels',
        description: 'Les meilleurs hébergements au meilleur prix',
        icon: 'Building',
        benefits: ['Meilleurs tarifs garantis', 'Annulation gratuite', 'Support 24/7', 'Avis vérifiés']
      },
      {
        id: 'f3',
        title: 'Guides & Excursions',
        description: 'Découvrez l\'Afrique avec des experts locaux',
        icon: 'Map',
        benefits: ['Guides certifiés', 'Circuits personnalisés', 'Culture locale', 'Sécurité garantie']
      }
    ],
    benefits: [
      {
        id: 'b1',
        title: 'Voyagez en sécurité',
        description: 'Protection complète pour tous vos voyages',
        icon: 'Shield'
      },
      {
        id: 'b2',
        title: 'Meilleurs prix',
        description: 'Tarifs négociés avec nos partenaires',
        icon: 'DollarSign'
      },
      {
        id: 'b3',
        title: 'Expérience authentique',
        description: 'Découvrez la vraie culture africaine',
        icon: 'Heart'
      }
    ],
    stats: {
      providers: 35,
      products: 150,
      savings: '25%',
      users: 25000
    },
    testimonials: [
      {
        id: 't1',
        name: 'Marie Dubois',
        company: 'Voyageuse',
        content: 'Un voyage inoubliable au Kenya, tout était parfaitement organisé !',
        rating: 5
      },
      {
        id: 't2',
        name: 'Ahmed Hassan',
        company: 'Guide Touristique',
        content: 'Excellente plateforme pour promouvoir nos services locaux.',
        rating: 5
      }
    ]
  },
  'sante': {
    hero: {
      title: 'Services de Santé',
      subtitle: 'Votre santé, notre priorité',
      description: 'Accédez aux meilleurs services de santé en Afrique : télémédecine, pharmacies en ligne, assurances santé.',
      cta_text: 'Consulter maintenant'
    },
    features: [
      {
        id: 'f1',
        title: 'Télémédecine',
        description: 'Consultations médicales à distance',
        icon: 'Video',
        benefits: ['Médecins certifiés', 'Consultations 24/7', 'Ordonnances digitales', 'Suivi patient']
      },
      {
        id: 'f2',
        title: 'Pharmacie en Ligne',
        description: 'Médicaments livrés à domicile',
        icon: 'Pill',
        benefits: ['Médicaments authentiques', 'Livraison rapide', 'Conseil pharmacien', 'Prix transparents']
      },
      {
        id: 'f3',
        title: 'Assurance Santé',
        description: 'Protection santé pour toute la famille',
        icon: 'Heart',
        benefits: ['Couverture étendue', 'Réseau de soins', 'Remboursements rapides', 'Prévention incluse']
      }
    ],
    benefits: [
      {
        id: 'b1',
        title: 'Accès facilité',
        description: 'Soins de santé accessibles partout en Afrique',
        icon: 'MapPin'
      },
      {
        id: 'b2',
        title: 'Qualité garantie',
        description: 'Professionnels de santé certifiés et expérimentés',
        icon: 'Award'
      },
      {
        id: 'b3',
        title: 'Prix abordables',
        description: 'Soins de qualité à des tarifs accessibles',
        icon: 'DollarSign'
      }
    ],
    stats: {
      providers: 60,
      products: 200,
      savings: '30%',
      users: 75000
    },
    testimonials: [
      {
        id: 't1',
        name: 'Dr. Fatima Kone',
        company: 'Médecin Généraliste',
        content: 'La télémédecine révolutionne l\'accès aux soins en zone rurale.',
        rating: 5
      },
      {
        id: 't2',
        name: 'Ibrahim Sow',
        company: 'Patient',
        content: 'Service exceptionnel, j\'ai pu consulter depuis mon village !',
        rating: 5
      }
    ]
  },
  'business': {
    hero: {
      title: 'Solutions Entreprise',
      subtitle: 'Développez votre business avec les bons outils',
      description: 'Découvrez les meilleures solutions B2B pour optimiser votre gestion, comptabilité, CRM et développement commercial.',
      cta_text: 'Booster mon entreprise'
    },
    features: [
      {
        id: 'f1',
        title: 'Gestion Comptable',
        description: 'Logiciels de comptabilité adaptés à l\'Afrique',
        icon: 'Calculator',
        benefits: ['Facturation automatisée', 'Déclarations fiscales', 'Tableaux de bord', 'Multi-devises']
      },
      {
        id: 'f2',
        title: 'CRM & Ventes',
        description: 'Optimisez votre relation client et vos ventes',
        icon: 'Users',
        benefits: ['Suivi prospects', 'Automatisation marketing', 'Rapports avancés', 'Intégrations']
      },
      {
        id: 'f3',
        title: 'Outils Collaboration',
        description: 'Solutions pour le travail en équipe',
        icon: 'MessageSquare',
        benefits: ['Communication unifiée', 'Gestion projets', 'Partage documents', 'Visioconférence']
      }
    ],
    benefits: [
      {
        id: 'b1',
        title: 'Productivité +50%',
        description: 'Automatisez vos processus et gagnez du temps',
        icon: 'Zap'
      },
      {
        id: 'b2',
        title: 'Croissance accélérée',
        description: 'Outils pour développer rapidement votre business',
        icon: 'TrendingUp'
      },
      {
        id: 'b3',
        title: 'Conformité garantie',
        description: 'Respectez les réglementations locales',
        icon: 'CheckCircle'
      }
    ],
    stats: {
      providers: 40,
      products: 95,
      savings: '45%',
      users: 12000
    },
    testimonials: [
      {
        id: 't1',
        name: 'Kwame Asante',
        company: 'CEO TechStart Ghana',
        content: 'Ces outils ont transformé notre façon de travailler !',
        rating: 5
      },
      {
        id: 't2',
        name: 'Aisha Mwangi',
        company: 'Directrice Financière',
        content: 'La gestion comptable n\'a jamais été aussi simple.',
        rating: 5
      }
    ]
  }
}

export const useSectorCMSContent = (sectorSlug: string) => {
  return useQuery({
    queryKey: ['sector-cms-content', sectorSlug],
    queryFn: async (): Promise<SectorCMSContent> => {
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const content = sectorCMSData[sectorSlug]
      if (!content) {
        throw new Error(`Contenu CMS non trouvé pour le secteur: ${sectorSlug}`)
      }
      
      return content
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

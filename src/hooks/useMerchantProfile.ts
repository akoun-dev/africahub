/**
 * Hook pour la gestion du profil marchand
 * Récupère les informations business du marchand depuis son profil
 */

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export interface MerchantProfile {
    id: string
    user_id: string
    first_name: string
    last_name: string
    email: string
    role: string
    
    // Informations business
    business_name?: string
    business_sector?: string
    business_type?: string
    business_description?: string
    business_address?: string
    business_phone?: string
    business_email?: string
    
    // Statut
    status: string
    
    // Dates
    created_at: string
    updated_at: string
}

// Secteurs d'activité disponibles (synchronisé avec Auth.tsx)
export const BUSINESS_SECTORS = [
    {
        name: "Transport",
        types: [
            "Transport Public",
            "Taxi/VTC",
            "Livraison",
            "Location de Véhicules",
            "Transport de Marchandises",
            "Transport Scolaire",
        ],
    },
    {
        name: "Banque & Finance",
        types: [
            "Banque Commerciale",
            "Banque d'Investissement",
            "Microfinance",
            "Assurance",
            "Bureau de Change",
            "Services de Paiement Mobile",
        ],
    },
    {
        name: "Santé",
        types: [
            "Clinique/Hôpital",
            "Pharmacie",
            "Laboratoire d'Analyses",
            "Cabinet Médical",
            "Cabinet Dentaire",
            "Optique",
            "Kinésithérapie",
        ],
    },
    {
        name: "Énergie",
        types: [
            "Fourniture d'Électricité",
            "Énergie Solaire",
            "Fourniture de Gaz",
            "Énergie Éolienne",
            "Installation Électrique",
            "Maintenance Énergétique",
        ],
    },
    {
        name: "Télécommunications",
        types: [
            "Opérateur Mobile",
            "Fournisseur Internet",
            "Réparation Mobile",
            "Vente d'Équipements Télécoms",
            "Services Cloud",
            "Cybersécurité",
        ],
    },
    {
        name: "Immobilier",
        types: [
            "Agence Immobilière",
            "Promotion Immobilière",
            "Construction",
            "Architecture",
            "Gestion Locative",
            "Expertise Immobilière",
        ],
    },
    {
        name: "Éducation",
        types: [
            "École Primaire",
            "École Secondaire",
            "Université/Institut",
            "Centre de Formation",
            "Cours Particuliers",
            "Formation Professionnelle",
        ],
    },
    {
        name: "Commerce",
        types: [
            "Électronique & High-Tech",
            "Mode & Vêtements",
            "Alimentation & Boissons",
            "Pharmacie & Parapharmacie",
            "Librairie & Fournitures",
            "Automobile",
            "Ameublement & Décoration",
            "Cosmétiques & Beauté",
        ],
    },
]

export const useMerchantProfile = () => {
    const { user } = useAuth()
    const merchantId = user?.id

    // Query pour récupérer le profil marchand
    const {
        data: merchantProfile,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["merchant-profile", merchantId],
        queryFn: async (): Promise<MerchantProfile | null> => {
            if (!merchantId) return null

            console.log("👤 Chargement du profil marchand:", merchantId)

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", merchantId)
                .eq("role", "merchant")
                .single()

            if (error) {
                console.error("❌ Erreur lors du chargement du profil marchand:", error)
                throw error
            }

            console.log("✅ Profil marchand chargé:", data)
            return data
        },
        enabled: !!merchantId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    })

    // Fonction pour obtenir les types d'activité d'un secteur
    const getBusinessTypes = (sectorName: string) => {
        const sector = BUSINESS_SECTORS.find(s => s.name === sectorName)
        return sector ? sector.types : []
    }

    // Fonction pour obtenir le secteur complet
    const getBusinessSector = (sectorName: string) => {
        return BUSINESS_SECTORS.find(s => s.name === sectorName)
    }

    // Vérifier si le marchand a complété son profil business
    const isBusinessProfileComplete = () => {
        if (!merchantProfile) return false
        
        return !!(
            merchantProfile.business_name &&
            merchantProfile.business_sector &&
            merchantProfile.business_type
        )
    }

    // Obtenir les catégories de produits recommandées selon le secteur
    const getRecommendedProductCategories = () => {
        if (!merchantProfile?.business_sector) return []

        const categoryMapping: Record<string, string[]> = {
            "Transport": [
                "Véhicules",
                "Pièces Auto",
                "Carburant",
                "Assurance Auto",
                "Services de Transport"
            ],
            "Banque & Finance": [
                "Services Financiers",
                "Assurance",
                "Investissement",
                "Crédit",
                "Change"
            ],
            "Santé": [
                "Médicaments",
                "Équipements Médicaux",
                "Consultations",
                "Analyses",
                "Soins"
            ],
            "Énergie": [
                "Électricité",
                "Gaz",
                "Énergie Solaire",
                "Équipements Énergétiques",
                "Installation"
            ],
            "Télécommunications": [
                "Téléphones",
                "Internet",
                "Réparation",
                "Accessoires",
                "Services Cloud"
            ],
            "Immobilier": [
                "Vente Immobilière",
                "Location",
                "Construction",
                "Rénovation",
                "Expertise"
            ],
            "Éducation": [
                "Cours",
                "Formation",
                "Livres",
                "Fournitures Scolaires",
                "Certification"
            ],
            "Commerce": [
                "Électronique",
                "Mode",
                "Alimentation",
                "Cosmétiques",
                "Ameublement",
                "Automobile"
            ]
        }

        return categoryMapping[merchantProfile.business_sector] || []
    }

    // Obtenir les informations business formatées
    const getBusinessInfo = () => {
        if (!merchantProfile) return null

        return {
            name: merchantProfile.business_name,
            sector: merchantProfile.business_sector,
            type: merchantProfile.business_type,
            description: merchantProfile.business_description,
            address: merchantProfile.business_address,
            phone: merchantProfile.business_phone,
            email: merchantProfile.business_email,
            isComplete: isBusinessProfileComplete(),
            recommendedCategories: getRecommendedProductCategories(),
        }
    }

    // Obtenir le nom d'affichage du marchand
    const getDisplayName = () => {
        if (!merchantProfile) return "Marchand"
        
        if (merchantProfile.business_name) {
            return merchantProfile.business_name
        }
        
        return `${merchantProfile.first_name} ${merchantProfile.last_name}`.trim() || "Marchand"
    }

    // Obtenir la description du secteur d'activité
    const getSectorDescription = () => {
        if (!merchantProfile?.business_sector || !merchantProfile?.business_type) {
            return "Secteur d'activité non défini"
        }
        
        return `${merchantProfile.business_type} - ${merchantProfile.business_sector}`
    }

    return {
        merchantProfile,
        businessInfo: getBusinessInfo(),
        displayName: getDisplayName(),
        sectorDescription: getSectorDescription(),
        isLoading,
        error: error?.message || null,
        refetch,
        
        // Fonctions utilitaires
        getBusinessTypes,
        getBusinessSector,
        isBusinessProfileComplete: isBusinessProfileComplete(),
        recommendedCategories: getRecommendedProductCategories(),
        
        // Constantes
        BUSINESS_SECTORS,
    }
}

export default useMerchantProfile

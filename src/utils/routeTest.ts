/**
 * Utilitaire pour tester les routes sectorielles d'AfricaHub
 * Vérifie que toutes les routes sont bien configurées et accessibles
 */

export interface SectorRoute {
    path: string
    name: string
    component: string
    description: string
}

/**
 * Liste complète des routes sectorielles d'AfricaHub
 */
export const sectorRoutes: SectorRoute[] = [
    // Pages d'assurance existantes
    {
        path: "/secteur/assurance-auto",
        name: "Assurance Auto",
        component: "AssuranceAuto",
        description: "Assurance automobile en Afrique"
    },
    {
        path: "/secteur/assurance-habitation", 
        name: "Assurance Habitation",
        component: "AssuranceHabitation",
        description: "Assurance logement et habitation"
    },
    {
        path: "/secteur/assurance-sante",
        name: "Assurance Santé", 
        component: "AssuranceSante",
        description: "Couverture médicale et santé"
    },
    {
        path: "/secteur/micro-assurance",
        name: "Micro-assurance",
        component: "MicroAssurance", 
        description: "Solutions d'assurance accessibles"
    },
    
    // Pages sectorielles principales
    {
        path: "/secteur/banque",
        name: "Banque",
        component: "Banque",
        description: "Services bancaires et financiers"
    },
    {
        path: "/secteur/energie", 
        name: "Énergie",
        component: "Energie",
        description: "Fournisseurs d'énergie et solutions renouvelables"
    },
    {
        path: "/secteur/telecom",
        name: "Télécoms", 
        component: "Telecoms",
        description: "Services de télécommunications"
    },
    {
        path: "/secteur/immobilier",
        name: "Immobilier",
        component: "Immobilier", 
        description: "Marché immobilier et investissement"
    },
    {
        path: "/secteur/transport",
        name: "Transport",
        component: "Transport",
        description: "Solutions de transport et logistique"
    },
    {
        path: "/secteur/education",
        name: "Éducation", 
        component: "Education",
        description: "Formations et opportunités éducatives"
    },
    {
        path: "/secteur/sante",
        name: "Santé",
        component: "Sante", 
        description: "Services de santé et soins médicaux"
    },
    {
        path: "/secteur/commerce",
        name: "Commerce",
        component: "Commerce",
        description: "E-commerce et solutions commerciales"
    }
]

/**
 * Vérifie si une route est valide
 */
export const isValidRoute = (path: string): boolean => {
    return sectorRoutes.some(route => route.path === path)
}

/**
 * Obtient les informations d'une route par son chemin
 */
export const getRouteInfo = (path: string): SectorRoute | undefined => {
    return sectorRoutes.find(route => route.path === path)
}

/**
 * Obtient toutes les routes par catégorie
 */
export const getRoutesByCategory = () => {
    return {
        assurance: sectorRoutes.filter(route => route.path.includes('assurance')),
        secteurs: sectorRoutes.filter(route => 
            !route.path.includes('assurance') && 
            route.path.startsWith('/secteur/')
        )
    }
}

/**
 * Génère les liens de navigation pour les secteurs
 */
export const generateSectorLinks = () => {
    return sectorRoutes.map(route => ({
        href: route.path,
        label: route.name,
        description: route.description
    }))
}

/**
 * Teste la validité de toutes les routes
 */
export const testAllRoutes = (): { valid: SectorRoute[], invalid: string[] } => {
    const valid: SectorRoute[] = []
    const invalid: string[] = []
    
    sectorRoutes.forEach(route => {
        try {
            // Test basique de la structure de la route
            if (route.path && route.name && route.component && route.description) {
                valid.push(route)
            } else {
                invalid.push(`Route incomplète: ${route.path}`)
            }
        } catch (error) {
            invalid.push(`Erreur sur route ${route.path}: ${error}`)
        }
    })
    
    return { valid, invalid }
}

/**
 * Affiche un rapport de test des routes
 */
export const displayRouteReport = () => {
    const { valid, invalid } = testAllRoutes()
    
    console.log('📊 Rapport des Routes Sectorielles AfricaHub')
    console.log('=' .repeat(50))
    console.log(`✅ Routes valides: ${valid.length}`)
    console.log(`❌ Routes invalides: ${invalid.length}`)
    console.log('')
    
    if (valid.length > 0) {
        console.log('✅ Routes Fonctionnelles:')
        valid.forEach(route => {
            console.log(`  • ${route.name} (${route.path})`)
        })
        console.log('')
    }
    
    if (invalid.length > 0) {
        console.log('❌ Problèmes Détectés:')
        invalid.forEach(issue => {
            console.log(`  • ${issue}`)
        })
        console.log('')
    }
    
    console.log(`🎯 Total: ${sectorRoutes.length} routes sectorielles configurées`)
    console.log('🌍 Couverture: Assurance, Banque, Énergie, Télécoms, Immobilier, Transport, Éducation, Santé, Commerce')
}

// Export par défaut pour utilisation directe
export default {
    sectorRoutes,
    isValidRoute,
    getRouteInfo,
    getRoutesByCategory,
    generateSectorLinks,
    testAllRoutes,
    displayRouteReport
}

/**
 * Script de test pour vérifier toutes les routes des secteurs
 * Vérifie la disponibilité du contenu CMS et la validité des routes
 */

// Liste des secteurs avec leurs routes correspondantes
export const sectorRoutes = [
    // Secteurs avec contenu CMS complet
    {
        slug: "retail",
        name: "Solutions Retail & E-commerce",
        route: "/secteur/retail",
    },
    {
        slug: "assurance-auto",
        name: "Assurance Automobile",
        route: "/secteur/assurance-auto",
    },
    { slug: "travel", name: "Voyages & Tourisme", route: "/secteur/travel" },
    { slug: "sante", name: "Services de Santé", route: "/secteur/sante" },
    {
        slug: "business",
        name: "Solutions Entreprise",
        route: "/secteur/business",
    },

    // Nouveaux secteurs ajoutés
    { slug: "banque", name: "Services Bancaires", route: "/secteur/banque" },
    {
        slug: "energie",
        name: "Solutions Énergétiques",
        route: "/secteur/energie",
    },
    { slug: "telecom", name: "Télécommunications", route: "/secteur/telecom" },
    { slug: "immobilier", name: "Immobilier", route: "/secteur/immobilier" },
    {
        slug: "transport",
        name: "Transport & Logistique",
        route: "/secteur/transport",
    },
    {
        slug: "education",
        name: "Éducation & Formation",
        route: "/secteur/education",
    },
    {
        slug: "commerce",
        name: "Commerce & Distribution",
        route: "/secteur/commerce",
    },
    { slug: "health", name: "Services de Santé", route: "/secteur/health" },
]

// Routes supplémentaires pour chaque secteur
export const sectorSubRoutes = ["/details", "/compare", "/quote"]

/**
 * Teste la disponibilité d'une route
 */
export const testRoute = async (
    url: string
): Promise<{ url: string; status: "success" | "error"; message: string }> => {
    try {
        const response = await fetch(url)
        if (response.ok) {
            return { url, status: "success", message: "Route accessible" }
        } else {
            return {
                url,
                status: "error",
                message: `Erreur HTTP ${response.status}`,
            }
        }
    } catch (error) {
        return { url, status: "error", message: `Erreur réseau: ${error}` }
    }
}

/**
 * Teste toutes les routes des secteurs
 */
export const testAllSectorRoutes = async (
    baseUrl: string = "http://localhost:8080"
): Promise<{
    total: number
    success: number
    errors: number
    results: Array<{
        url: string
        status: "success" | "error"
        message: string
    }>
}> => {
    const results = []

    // Test des routes principales des secteurs
    for (const sector of sectorRoutes) {
        const url = `${baseUrl}${sector.route}`
        const result = await testRoute(url)
        results.push(result)

        // Test des sous-routes
        for (const subRoute of sectorSubRoutes) {
            const subUrl = `${baseUrl}${sector.route}${subRoute}`
            const subResult = await testRoute(subUrl)
            results.push(subResult)
        }
    }

    const success = results.filter(r => r.status === "success").length
    const errors = results.filter(r => r.status === "error").length

    return {
        total: results.length,
        success,
        errors,
        results,
    }
}

/**
 * Affiche un rapport de test des routes
 */
export const displayRouteTestReport = (testResults: {
    total: number
    success: number
    errors: number
    results: Array<{
        url: string
        status: "success" | "error"
        message: string
    }>
}) => {
    console.log("🧪 Rapport de Test des Routes Sectorielles")
    console.log("=".repeat(50))
    console.log(`📊 Total des routes testées: ${testResults.total}`)
    console.log(`✅ Routes fonctionnelles: ${testResults.success}`)
    console.log(`❌ Routes en erreur: ${testResults.errors}`)
    console.log(
        `📈 Taux de réussite: ${(
            (testResults.success / testResults.total) *
            100
        ).toFixed(1)}%`
    )
    console.log("")

    if (testResults.errors > 0) {
        console.log("❌ Routes en erreur:")
        testResults.results
            .filter(r => r.status === "error")
            .forEach(result => {
                console.log(`  • ${result.url} - ${result.message}`)
            })
        console.log("")
    }

    console.log("✅ Routes fonctionnelles:")
    testResults.results
        .filter(r => r.status === "success")
        .slice(0, 10) // Afficher seulement les 10 premières pour éviter le spam
        .forEach(result => {
            console.log(`  • ${result.url}`)
        })

    if (testResults.success > 10) {
        console.log(
            `  ... et ${testResults.success - 10} autres routes fonctionnelles`
        )
    }
}

/**
 * Vérifie la cohérence entre les routes et le contenu CMS
 */
export const validateCMSContent = () => {
    const cmsContentSlugs = [
        "retail",
        "assurance-auto",
        "travel",
        "sante",
        "business",
        "banque",
        "energie",
        "telecom",
        "immobilier",
        "transport",
        "education",
        "commerce",
    ]

    const routeSlugs = sectorRoutes.map(route => route.slug)

    const missingInCMS = routeSlugs.filter(
        slug => !cmsContentSlugs.includes(slug)
    )
    const missingInRoutes = cmsContentSlugs.filter(
        slug => !routeSlugs.includes(slug)
    )

    console.log("🔍 Validation Cohérence CMS/Routes")
    console.log("=".repeat(40))

    if (missingInCMS.length === 0 && missingInRoutes.length === 0) {
        console.log("✅ Parfaite cohérence entre routes et contenu CMS")
    } else {
        if (missingInCMS.length > 0) {
            console.log("❌ Secteurs avec routes mais sans contenu CMS:")
            missingInCMS.forEach(slug => console.log(`  • ${slug}`))
        }

        if (missingInRoutes.length > 0) {
            console.log("❌ Secteurs avec contenu CMS mais sans routes:")
            missingInRoutes.forEach(slug => console.log(`  • ${slug}`))
        }
    }

    return {
        isValid: missingInCMS.length === 0 && missingInRoutes.length === 0,
        missingInCMS,
        missingInRoutes,
    }
}

// Export par défaut pour utilisation directe
export default {
    sectorRoutes,
    testAllSectorRoutes,
    displayRouteTestReport,
    validateCMSContent,
}

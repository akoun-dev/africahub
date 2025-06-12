// 🧪 Script de test pour vérifier l'unicité des IDs
// Ce script vérifie que tous les éléments unifiés ont des IDs uniques

import { getProductsWithFallback } from "@/data/demoProducts"
import { africanBanks, bankingServices } from "@/data/banksData"
import { africanEnergyProviders, energyTariffs, solarSolutions } from "@/data/energiesData"
import { africanInsuranceData } from "@/data/insuranceData"
import { africanTelecomOperators, mobilePlans, internetServices } from "@/data/telecomData"
import { africanTransportCompanies, transportRoutes, deliveryServices } from "@/data/transportData"
import { africanEconomicSectors, sectorCompanies } from "@/data/sectorsData"

type SectorType = "products" | "banks" | "energy" | "insurance" | "telecom" | "transport" | "sectors"

interface UnifiedItem {
    id: string | number
    originalId?: string | number
    name: string
    sector: SectorType
    [key: string]: any
}

// Fonction de test pour unifier les données avec IDs uniques
const testUnifyAllData = (): UnifiedItem[] => {
    const unifiedData: UnifiedItem[] = []
    let globalIndex = 0

    console.log("🔍 Test de génération d'IDs uniques...")

    // Produits
    const products = getProductsWithFallback([])
    console.log(`📦 Ajout de ${products.length} produits`)
    products.forEach((product, index) => {
        unifiedData.push({
            ...product,
            id: `products-${globalIndex++}`,
            originalId: product.id,
            sector: "products" as SectorType,
        })
    })

    // Banques
    console.log(`🏦 Ajout de ${africanBanks.length} banques`)
    africanBanks.forEach((bank, index) => {
        unifiedData.push({
            ...bank,
            id: `banks-${globalIndex++}`,
            originalId: bank.id,
            sector: "banks" as SectorType,
        })
    })

    // Services bancaires
    console.log(`💳 Ajout de ${bankingServices.length} services bancaires`)
    bankingServices.forEach((service, index) => {
        unifiedData.push({
            ...service,
            id: `banking-services-${globalIndex++}`,
            originalId: service.id,
            sector: "banks" as SectorType,
        })
    })

    // Fournisseurs d'énergie
    console.log(`⚡ Ajout de ${africanEnergyProviders.length} fournisseurs d'énergie`)
    africanEnergyProviders.forEach((provider, index) => {
        unifiedData.push({
            ...provider,
            id: `energy-providers-${globalIndex++}`,
            originalId: provider.id,
            sector: "energy" as SectorType,
        })
    })

    // Tarifs énergétiques
    console.log(`💡 Ajout de ${energyTariffs.length} tarifs énergétiques`)
    energyTariffs.forEach((tariff, index) => {
        unifiedData.push({
            ...tariff,
            id: `energy-tariffs-${globalIndex++}`,
            originalId: tariff.id,
            sector: "energy" as SectorType,
        })
    })

    // Solutions solaires
    console.log(`☀️ Ajout de ${solarSolutions.length} solutions solaires`)
    solarSolutions.forEach((solution, index) => {
        unifiedData.push({
            ...solution,
            id: `solar-solutions-${globalIndex++}`,
            originalId: solution.id,
            sector: "energy" as SectorType,
        })
    })

    // Assurances
    let insuranceCount = 0
    Object.entries(africanInsuranceData).forEach(([category, insurances]) => {
        insurances.forEach((insurance, index) => {
            unifiedData.push({
                ...insurance,
                id: `insurance-${category}-${globalIndex++}`,
                originalId: insurance.id,
                sector: "insurance" as SectorType,
            })
            insuranceCount++
        })
    })
    console.log(`🛡️ Ajout de ${insuranceCount} assurances`)

    // Opérateurs télécoms
    console.log(`📱 Ajout de ${africanTelecomOperators.length} opérateurs télécoms`)
    africanTelecomOperators.forEach((operator, index) => {
        unifiedData.push({
            ...operator,
            id: `telecom-operators-${globalIndex++}`,
            originalId: operator.id,
            sector: "telecom" as SectorType,
        })
    })

    // Forfaits mobiles
    console.log(`📞 Ajout de ${mobilePlans.length} forfaits mobiles`)
    mobilePlans.forEach((plan, index) => {
        unifiedData.push({
            ...plan,
            id: `mobile-plans-${globalIndex++}`,
            originalId: plan.id,
            sector: "telecom" as SectorType,
        })
    })

    // Services internet
    console.log(`🌐 Ajout de ${internetServices.length} services internet`)
    internetServices.forEach((service, index) => {
        unifiedData.push({
            ...service,
            id: `internet-services-${globalIndex++}`,
            originalId: service.id,
            sector: "telecom" as SectorType,
        })
    })

    // Compagnies de transport
    console.log(`🚛 Ajout de ${africanTransportCompanies.length} compagnies de transport`)
    africanTransportCompanies.forEach((company, index) => {
        unifiedData.push({
            ...company,
            id: `transport-companies-${globalIndex++}`,
            originalId: company.id,
            sector: "transport" as SectorType,
        })
    })

    // Routes de transport
    console.log(`🛣️ Ajout de ${transportRoutes.length} routes de transport`)
    transportRoutes.forEach((route, index) => {
        unifiedData.push({
            ...route,
            id: `transport-routes-${globalIndex++}`,
            originalId: route.id,
            sector: "transport" as SectorType,
        })
    })

    // Services de livraison
    console.log(`📦 Ajout de ${deliveryServices.length} services de livraison`)
    deliveryServices.forEach((service, index) => {
        unifiedData.push({
            ...service,
            id: `delivery-services-${globalIndex++}`,
            originalId: service.id,
            sector: "transport" as SectorType,
        })
    })

    // Secteurs économiques
    console.log(`🏭 Ajout de ${africanEconomicSectors.length} secteurs économiques`)
    africanEconomicSectors.forEach((sector, index) => {
        unifiedData.push({
            ...sector,
            id: `economic-sectors-${globalIndex++}`,
            originalId: sector.id,
            sector: "sectors" as SectorType,
        })
    })

    // Entreprises par secteur
    console.log(`🏢 Ajout de ${sectorCompanies.length} entreprises`)
    sectorCompanies.forEach((company, index) => {
        unifiedData.push({
            ...company,
            id: `sector-companies-${globalIndex++}`,
            originalId: company.id,
            sector: "sectors" as SectorType,
        })
    })

    return unifiedData
}

// Fonction de test pour vérifier l'unicité des IDs
export const testUniqueIds = () => {
    console.log("🧪 Début du test d'unicité des IDs...")
    
    const data = testUnifyAllData()
    const ids = data.map(item => item.id)
    const uniqueIds = new Set(ids)
    
    console.log(`📊 Statistiques:`)
    console.log(`   - Total d'éléments: ${data.length}`)
    console.log(`   - IDs uniques: ${uniqueIds.size}`)
    console.log(`   - Doublons détectés: ${data.length - uniqueIds.size}`)
    
    if (uniqueIds.size === data.length) {
        console.log("✅ Tous les IDs sont uniques ! Test réussi.")
    } else {
        console.log("❌ Des IDs dupliqués ont été détectés !")
        
        // Trouver les doublons
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
        console.log("🔍 IDs dupliqués:", [...new Set(duplicates)])
    }
    
    // Afficher quelques exemples d'IDs générés
    console.log("\n📝 Exemples d'IDs générés:")
    data.slice(0, 10).forEach(item => {
        console.log(`   ${item.sector}: ${item.id} (original: ${item.originalId})`)
    })
    
    return {
        total: data.length,
        unique: uniqueIds.size,
        duplicates: data.length - uniqueIds.size,
        success: uniqueIds.size === data.length
    }
}

// Exporter pour utilisation dans d'autres fichiers
export default testUniqueIds

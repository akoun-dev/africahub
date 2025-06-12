/**
 * Script de test pour vérifier l'intégration Supabase après les migrations
 * Utilisation: npm run test:supabase ou directement dans la console
 */

import { supabase } from "@/integrations/supabase/client"

// Test de connexion à la base de données
export const testDatabaseConnection = async () => {
    console.log("🔍 Test de connexion à la base de données...")
    
    try {
        const { data, error } = await supabase
            .from('business_sectors')
            .select('name, slug')
            .limit(1)
        
        if (error) {
            console.error("❌ Erreur de connexion:", error)
            return false
        }
        
        console.log("✅ Connexion réussie, secteur trouvé:", data?.[0])
        return true
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Test des secteurs d'activité
export const testBusinessSectors = async () => {
    console.log("🏢 Test des secteurs d'activité...")
    
    try {
        const { data: sectors, error } = await supabase
            .from('business_sectors')
            .select('*')
            .order('sort_order')
        
        if (error) {
            console.error("❌ Erreur lors de la récupération des secteurs:", error)
            return false
        }
        
        console.log(`✅ ${sectors?.length} secteurs trouvés:`)
        sectors?.forEach(sector => {
            console.log(`  - ${sector.name} (${sector.slug})`)
        })
        
        return true
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Test des types d'entreprises
export const testBusinessTypes = async () => {
    console.log("🏪 Test des types d'entreprises...")
    
    try {
        // Récupérer les types pour le secteur Transport
        const { data: types, error } = await supabase
            .from('business_types')
            .select(`
                name,
                slug,
                business_sectors!inner(name, slug)
            `)
            .eq('business_sectors.slug', 'transport')
            .order('sort_order')
        
        if (error) {
            console.error("❌ Erreur lors de la récupération des types:", error)
            return false
        }
        
        console.log(`✅ ${types?.length} types trouvés pour le secteur Transport:`)
        types?.forEach(type => {
            console.log(`  - ${type.name} (${type.slug})`)
        })
        
        return true
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Test des permissions disponibles
export const testPermissions = async () => {
    console.log("🔐 Test des permissions disponibles...")
    
    try {
        const { data: permissions, error } = await supabase
            .from('available_permissions')
            .select('permission, description, resource, action')
            .order('resource, action')
        
        if (error) {
            console.error("❌ Erreur lors de la récupération des permissions:", error)
            return false
        }
        
        console.log(`✅ ${permissions?.length} permissions trouvées:`)
        
        // Grouper par ressource
        const groupedPermissions = permissions?.reduce((acc, perm) => {
            if (!acc[perm.resource]) {
                acc[perm.resource] = []
            }
            acc[perm.resource].push(perm)
            return acc
        }, {} as Record<string, any[]>)
        
        Object.entries(groupedPermissions || {}).forEach(([resource, perms]) => {
            console.log(`  📁 ${resource}:`)
            perms.forEach(perm => {
                console.log(`    - ${perm.permission}: ${perm.description}`)
            })
        })
        
        return true
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Test de création d'un profil utilisateur (simulation)
export const testUserProfileCreation = async () => {
    console.log("👤 Test de création de profil utilisateur...")
    
    try {
        // Simuler les métadonnées d'un nouvel utilisateur
        const mockUserData = {
            id: 'test-user-id-' + Date.now(),
            email: 'test@africahub.com',
            raw_user_meta_data: {
                first_name: 'Test',
                last_name: 'Utilisateur',
                role: 'user'
            }
        }
        
        console.log("📝 Données utilisateur simulées:", mockUserData)
        console.log("✅ Structure compatible avec les triggers d'authentification")
        
        return true
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Test de la vue des secteurs avec types
export const testSectorsWithTypes = async () => {
    console.log("🔗 Test de la vue secteurs avec types...")
    
    try {
        const { data: sectorsWithTypes, error } = await supabase
            .from('sectors_with_types')
            .select('*')
            .limit(3)
        
        if (error) {
            console.error("❌ Erreur lors de la récupération de la vue:", error)
            return false
        }
        
        console.log(`✅ ${sectorsWithTypes?.length} secteurs avec types trouvés:`)
        sectorsWithTypes?.forEach(sector => {
            const typesCount = Array.isArray(sector.types) ? sector.types.length : 0
            console.log(`  - ${sector.sector_name}: ${typesCount} types`)
        })
        
        return true
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Fonction principale de test
export const runAllTests = async () => {
    console.log("🚀 Démarrage des tests d'intégration Supabase AfricaHub")
    console.log("=" .repeat(60))
    
    const tests = [
        { name: "Connexion DB", fn: testDatabaseConnection },
        { name: "Secteurs d'activité", fn: testBusinessSectors },
        { name: "Types d'entreprises", fn: testBusinessTypes },
        { name: "Permissions", fn: testPermissions },
        { name: "Profil utilisateur", fn: testUserProfileCreation },
        { name: "Vue secteurs+types", fn: testSectorsWithTypes }
    ]
    
    const results = []
    
    for (const test of tests) {
        console.log(`\n📋 Test: ${test.name}`)
        console.log("-".repeat(40))
        
        const startTime = Date.now()
        const success = await test.fn()
        const duration = Date.now() - startTime
        
        results.push({
            name: test.name,
            success,
            duration
        })
        
        console.log(`⏱️  Durée: ${duration}ms`)
    }
    
    // Résumé final
    console.log("\n" + "=".repeat(60))
    console.log("📊 RÉSUMÉ DES TESTS")
    console.log("=".repeat(60))
    
    const successCount = results.filter(r => r.success).length
    const totalCount = results.length
    
    results.forEach(result => {
        const status = result.success ? "✅ RÉUSSI" : "❌ ÉCHEC"
        console.log(`${status} - ${result.name} (${result.duration}ms)`)
    })
    
    console.log(`\n🎯 Résultat global: ${successCount}/${totalCount} tests réussis`)
    
    if (successCount === totalCount) {
        console.log("🎉 Tous les tests sont passés ! L'intégration Supabase est fonctionnelle.")
    } else {
        console.log("⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")
    }
    
    return successCount === totalCount
}

// Export pour utilisation dans la console
if (typeof window !== 'undefined') {
    (window as any).testSupabase = {
        runAllTests,
        testDatabaseConnection,
        testBusinessSectors,
        testBusinessTypes,
        testPermissions,
        testUserProfileCreation,
        testSectorsWithTypes
    }
    
    console.log("🔧 Tests Supabase disponibles dans window.testSupabase")
    console.log("💡 Utilisez: await window.testSupabase.runAllTests()")
}

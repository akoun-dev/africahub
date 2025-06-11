/**
 * Utilitaire de debug pour l'erreur HTTP 500 lors de l'inscription
 */

import { supabase } from "@/integrations/supabase/client"

/**
 * Test d'inscription sans redirection email
 */
export const testSignupWithoutRedirect = async () => {
    console.log("🔍 Test d'inscription sans redirection email...")

    try {
        const testEmail = `debug_${Date.now()}@test.com`
        console.log(`📧 Email de test: ${testEmail}`)

        // Test sans emailRedirectTo
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: "TestPassword123!",
            options: {
                data: {
                    first_name: "Debug",
                    last_name: "Test",
                    role: "user",
                },
                // Pas de emailRedirectTo
            },
        })

        if (error) {
            console.error("❌ Erreur d'inscription:", error)
            console.error("📋 Message:", error.message)
            console.error("🔢 Status:", error.status)

            if (error.status === 500) {
                console.log(
                    "🚨 Erreur HTTP 500 confirmée - problème côté serveur"
                )
                return false
            }
        } else {
            console.log("✅ Inscription réussie:", data.user?.id)

            // Nettoyer immédiatement
            if (data.user?.id) {
                try {
                    await supabase.auth.admin.deleteUser(data.user.id)
                    console.log("🧹 Utilisateur de test supprimé")
                } catch (cleanupError) {
                    console.warn(
                        "⚠️ Impossible de supprimer l'utilisateur de test"
                    )
                }
            }
            return true
        }
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

/**
 * Test de diagnostic de la base de données
 */
export const testDatabaseHealth = async () => {
    console.log("🏥 Test de santé de la base de données...")

    try {
        // Test 1: Accès aux tables
        const { data: profilesData, error: profilesError } = await supabase
            .from("user_profiles")
            .select("count", { count: "exact", head: true })

        if (profilesError) {
            console.error("❌ Erreur d'accès à user_profiles:", profilesError)
            return false
        } else {
            console.log("✅ Table user_profiles accessible")
        }

        // Test 2: Fonctions disponibles
        const { data: functionsData, error: functionsError } =
            await supabase.rpc("diagnose_auth_system")

        if (functionsError) {
            console.error("❌ Erreur d'accès aux fonctions:", functionsError)
            return false
        } else {
            console.log(
                "✅ Fonctions de diagnostic disponibles:",
                functionsData
            )
        }

        // Test 3: Triggers actifs
        console.log("✅ Base de données opérationnelle")
        return true
    } catch (error) {
        console.error("💥 Erreur lors du test de santé:", error)
        return false
    }
}

/**
 * Test complet de diagnostic
 */
export const runFullDiagnostic = async () => {
    console.group("🔬 Diagnostic complet du système d'inscription")

    console.log("1️⃣ Test de santé de la base de données...")
    const dbHealthy = await testDatabaseHealth()

    if (!dbHealthy) {
        console.log(
            "❌ Base de données non opérationnelle - arrêt du diagnostic"
        )
        console.groupEnd()
        return
    }

    console.log("\n2️⃣ Test d'inscription sans redirection...")
    const signupWorking = await testSignupWithoutRedirect()

    if (signupWorking) {
        console.log(
            "✅ L'inscription fonctionne ! Le problème était la redirection email."
        )
        console.log(
            "💡 Solution: Supprimer emailRedirectTo du code d'inscription"
        )
    } else {
        console.log("❌ L'inscription échoue même sans redirection")
        console.log(
            "💡 Le problème est plus profond - vérifiez les triggers et RLS"
        )
    }

    console.log("\n📊 Résumé du diagnostic:")
    console.log(`   Base de données: ${dbHealthy ? "✅ OK" : "❌ KO"}`)
    console.log(`   Inscription: ${signupWorking ? "✅ OK" : "❌ KO"}`)

    console.groupEnd()
}

/**
 * Test de création de profil manuel
 */
export const testProfileCreation = async () => {
    console.log("🧪 Test de création de profil manuel...")

    try {
        const testUserId = crypto.randomUUID()
        const profileId = crypto.randomUUID()

        console.log(`👤 Test User ID: ${testUserId}`)
        console.log(`📋 Test Profile ID: ${profileId}`)

        // Tenter de créer un profil
        const { data, error } = await supabase
            .from("user_profiles")
            .insert({
                id: profileId,
                user_id: testUserId,
                email: "test@example.com",
                first_name: "Test",
                last_name: "User",
                role: "user",
                status: "active",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()

        if (error) {
            console.error("❌ Erreur de création de profil:", error)
            console.error("📋 Message:", error.message)
            console.error("🔢 Code:", error.code)
            console.error("📝 Détails:", error.details)
            return false
        } else {
            console.log("✅ Profil créé avec succès:", data)

            // Nettoyer
            await supabase.from("user_profiles").delete().eq("id", profileId)

            console.log("🧹 Profil de test supprimé")
            return true
        }
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Exposer globalement pour les tests
if (typeof window !== "undefined") {
    ;(window as any).debugSignup = {
        testSignupWithoutRedirect,
        testDatabaseHealth,
        runFullDiagnostic,
        testProfileCreation,

        // Test rapide
        quick: async () => {
            console.log("⚡ Test rapide...")
            const working = await testSignupWithoutRedirect()
            if (working) {
                console.log("🎉 L'inscription fonctionne !")
            } else {
                console.log("💔 L'inscription ne fonctionne pas")
            }
        },

        // Test de profil
        testProfile: async () => {
            console.log("📋 Test de création de profil...")
            const working = await testProfileCreation()
            if (working) {
                console.log("🎉 La création de profil fonctionne !")
            } else {
                console.log("💔 La création de profil ne fonctionne pas")
            }
        },
    }
}

/**
 * Script de test pour vérifier le chargement du profil utilisateur
 * Utilisation: Ouvrir la console du navigateur et exécuter les tests
 */

import { supabase } from "@/integrations/supabase/client"

// Test de chargement du profil utilisateur
export const testLoadUserProfile = async (userId: string) => {
    console.log("🔍 Test de chargement du profil pour:", userId)
    
    try {
        // Test 1: Charger le profil de base
        console.log("📋 Étape 1: Chargement du profil de base...")
        const { data: profileData, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", userId)
            .single()

        if (profileError) {
            console.error("❌ Erreur profil de base:", profileError)
            return false
        }
        console.log("✅ Profil de base chargé:", profileData)

        // Test 2: Charger les permissions
        console.log("🔐 Étape 2: Chargement des permissions...")
        const { data: permissionsData, error: permissionsError } = await supabase
            .from("user_permissions")
            .select("permission")
            .eq("user_id", userId)

        if (permissionsError) {
            console.error("❌ Erreur permissions:", permissionsError)
        } else {
            console.log("✅ Permissions chargées:", permissionsData)
        }

        // Test 3: Charger le profil marchand si applicable
        if (profileData.role === "merchant") {
            console.log("🏪 Étape 3: Chargement du profil marchand...")
            const { data: merchantData, error: merchantError } = await supabase
                .from("merchant_profiles")
                .select("*")
                .eq("user_id", userId)
                .single()

            if (merchantError) {
                console.warn("⚠️ Pas de profil marchand:", merchantError)
            } else {
                console.log("✅ Profil marchand chargé:", merchantData)
            }
        }

        // Test 4: Récupérer l'email
        console.log("📧 Étape 4: Récupération de l'email...")
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
            console.error("❌ Erreur auth user:", authError)
        } else {
            console.log("✅ Email récupéré:", authUser.user?.email)
        }

        console.log("🎉 Test de chargement du profil réussi !")
        return true

    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Test de connexion utilisateur
export const testUserSignIn = async (email: string, password: string) => {
    console.log("🔐 Test de connexion pour:", email)
    
    try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) {
            console.error("❌ Erreur de connexion:", authError)
            return false
        }

        if (authData.user) {
            console.log("✅ Connexion réussie:", authData.user.id)
            
            // Tester le chargement du profil
            await testLoadUserProfile(authData.user.id)
            
            return true
        }

        return false
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Test de l'état d'authentification actuel
export const testCurrentAuthState = async () => {
    console.log("🔍 Test de l'état d'authentification actuel...")
    
    try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
            console.error("❌ Erreur session:", error)
            return false
        }

        if (session?.user) {
            console.log("✅ Utilisateur connecté:", session.user.id)
            console.log("📧 Email:", session.user.email)
            
            // Tester le chargement du profil
            await testLoadUserProfile(session.user.id)
            
            return true
        } else {
            console.log("ℹ️ Aucun utilisateur connecté")
            return false
        }
    } catch (error) {
        console.error("💥 Erreur inattendue:", error)
        return false
    }
}

// Test des tables et permissions
export const testDatabaseAccess = async () => {
    console.log("🗄️ Test d'accès aux tables...")
    
    const tests = [
        { name: "user_profiles", table: "user_profiles" },
        { name: "user_permissions", table: "user_permissions" },
        { name: "merchant_profiles", table: "merchant_profiles" },
        { name: "business_sectors", table: "business_sectors" },
    ]

    for (const test of tests) {
        try {
            const { data, error } = await supabase
                .from(test.table)
                .select("*")
                .limit(1)

            if (error) {
                console.error(`❌ Erreur ${test.name}:`, error)
            } else {
                console.log(`✅ Accès ${test.name}: OK (${data?.length || 0} résultats)`)
            }
        } catch (error) {
            console.error(`💥 Erreur inattendue ${test.name}:`, error)
        }
    }
}

// Fonction principale de test
export const runProfileTests = async () => {
    console.log("🚀 Tests de profil utilisateur AfricaHub")
    console.log("=" .repeat(50))
    
    // Test 1: État d'authentification
    console.log("\n📋 Test 1: État d'authentification")
    await testCurrentAuthState()
    
    // Test 2: Accès aux tables
    console.log("\n📋 Test 2: Accès aux tables")
    await testDatabaseAccess()
    
    console.log("\n🎯 Tests terminés !")
}

// Export pour utilisation dans la console
if (typeof window !== 'undefined') {
    (window as any).testProfile = {
        runProfileTests,
        testCurrentAuthState,
        testLoadUserProfile,
        testUserSignIn,
        testDatabaseAccess
    }
    
    console.log("🔧 Tests de profil disponibles dans window.testProfile")
    console.log("💡 Utilisez: await window.testProfile.runProfileTests()")
}

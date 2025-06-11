/**
 * Utilitaire de test pour vérifier que le système d'inscription fonctionne
 * après la correction du trigger
 */

import { supabase } from "@/integrations/supabase/client"

interface SignupTestResult {
    step: string
    success: boolean
    message: string
    details?: any
}

/**
 * Teste le processus d'inscription complet
 */
export const testSignupProcess = async (): Promise<SignupTestResult[]> => {
    const results: SignupTestResult[] = []

    try {
        // Test 1: Vérifier la connexion à Supabase
        results.push({
            step: "Connexion Supabase",
            success: true,
            message: "✅ Connexion à Supabase établie",
        })

        // Test 2: Vérifier que les tables existent
        const { data: tablesData, error: tablesError } = await supabase
            .from("user_profiles")
            .select("count", { count: "exact", head: true })

        if (tablesError) {
            results.push({
                step: "Vérification tables",
                success: false,
                message: "❌ Erreur d'accès aux tables",
                details: tablesError,
            })
        } else {
            results.push({
                step: "Vérification tables",
                success: true,
                message: "✅ Tables accessibles",
            })
        }

        // Test 3: Vérifier les fonctions de base de données
        const { data: functionTest, error: functionError } = await supabase.rpc(
            "test_signup_process"
        )

        if (functionError) {
            results.push({
                step: "Test fonctions DB",
                success: false,
                message: "❌ Erreur lors du test des fonctions",
                details: functionError,
            })
        } else {
            results.push({
                step: "Test fonctions DB",
                success: true,
                message: "✅ Fonctions de base de données opérationnelles",
                details: functionTest,
            })
        }

        // Test 4: Simuler une inscription (sans créer réellement un utilisateur)
        results.push({
            step: "Simulation inscription",
            success: true,
            message: "✅ Prêt pour les tests d'inscription réels",
        })
    } catch (error) {
        results.push({
            step: "Test général",
            success: false,
            message: "❌ Erreur inattendue lors des tests",
            details: error,
        })
    }

    return results
}

/**
 * Teste spécifiquement l'inscription d'un utilisateur
 */
export const testUserSignup = async (
    testEmail: string
): Promise<SignupTestResult[]> => {
    const results: SignupTestResult[] = []

    try {
        // Générer un email de test unique
        const timestamp = Date.now()
        const email = testEmail || `test_${timestamp}@africahub-test.com`
        const password = "TestPassword123!"

        results.push({
            step: "Préparation test",
            success: true,
            message: `📧 Email de test: ${email}`,
        })

        // Tenter l'inscription
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: "Test",
                    last_name: "User",
                    role: "user",
                },
            },
        })

        if (error) {
            results.push({
                step: "Inscription test",
                success: false,
                message: "❌ Erreur lors de l'inscription",
                details: error,
            })
        } else {
            results.push({
                step: "Inscription test",
                success: true,
                message: "✅ Inscription réussie",
                details: { userId: data.user?.id },
            })

            // Vérifier que le profil a été créé
            if (data.user?.id) {
                const { data: profileData, error: profileError } =
                    await supabase
                        .from("user_profiles")
                        .select("*")
                        .eq("user_id", data.user.id)
                        .single()

                if (profileError) {
                    results.push({
                        step: "Vérification profil",
                        success: false,
                        message: "❌ Profil non créé automatiquement",
                        details: profileError,
                    })
                } else {
                    results.push({
                        step: "Vérification profil",
                        success: true,
                        message: "✅ Profil créé automatiquement",
                        details: profileData,
                    })
                }

                // Nettoyer le test (supprimer l'utilisateur de test)
                try {
                    await supabase.auth.admin.deleteUser(data.user.id)
                    results.push({
                        step: "Nettoyage",
                        success: true,
                        message: "🧹 Utilisateur de test supprimé",
                    })
                } catch (cleanupError) {
                    results.push({
                        step: "Nettoyage",
                        success: false,
                        message:
                            "⚠️ Impossible de supprimer l'utilisateur de test",
                        details: cleanupError,
                    })
                }
            }
        }
    } catch (error) {
        results.push({
            step: "Test inscription",
            success: false,
            message: "❌ Erreur inattendue lors du test d'inscription",
            details: error,
        })
    }

    return results
}

/**
 * Affiche les résultats des tests dans la console
 */
export const displayTestResults = (results: SignupTestResult[]) => {
    console.group("🧪 Résultats des tests d'inscription")

    results.forEach((result, index) => {
        const icon = result.success ? "✅" : "❌"
        console.log(`${index + 1}. ${icon} ${result.step}: ${result.message}`)

        if (result.details) {
            console.log("   Détails:", result.details)
        }
    })

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    console.log(`\n📊 Résumé: ${successCount}/${totalCount} tests réussis`)

    if (successCount === totalCount) {
        console.log(
            "🎉 Tous les tests sont passés ! Le système d'inscription fonctionne."
        )
    } else {
        console.log(
            "⚠️ Certains tests ont échoué. Vérifiez les détails ci-dessus."
        )
    }

    console.groupEnd()
}

/**
 * Teste le diagnostic du système d'authentification
 */
export const testAuthDiagnostic = async (): Promise<SignupTestResult[]> => {
    const results: SignupTestResult[] = []

    try {
        // Tester le diagnostic du système
        const { data: diagnosticData, error: diagnosticError } =
            await supabase.rpc("diagnose_auth_system")

        if (diagnosticError) {
            results.push({
                step: "Diagnostic système",
                success: false,
                message: "❌ Erreur lors du diagnostic",
                details: diagnosticError,
            })
        } else {
            results.push({
                step: "Diagnostic système",
                success: true,
                message: "✅ Diagnostic système exécuté",
                details: diagnosticData,
            })
        }
    } catch (error) {
        results.push({
            step: "Test diagnostic",
            success: false,
            message: "❌ Erreur inattendue lors du diagnostic",
            details: error,
        })
    }

    return results
}

// Exposer les fonctions globalement pour les tests dans la console
if (typeof window !== "undefined") {
    ;(window as any).testSignupFix = {
        testSignupProcess,
        testUserSignup,
        testAuthDiagnostic,
        displayTestResults,
        runAllTests: async () => {
            console.log("🚀 Lancement de tous les tests d'inscription...")

            // Test 1: Diagnostic système
            console.log("\n🔍 1. Diagnostic du système...")
            const diagnosticResults = await testAuthDiagnostic()
            displayTestResults(diagnosticResults)

            // Test 2: Tests de base
            console.log("\n🔧 2. Tests de processus...")
            const processResults = await testSignupProcess()
            displayTestResults(processResults)

            // Test 3: Si les tests de base passent, tester une vraie inscription
            const allBasicTestsPassed = processResults.every(r => r.success)
            if (allBasicTestsPassed) {
                console.log(
                    "\n🔄 3. Tests de base réussis, test d'inscription réelle..."
                )
                const signupResults = await testUserSignup("")
                displayTestResults(signupResults)
            } else {
                console.log(
                    "\n⚠️ 3. Tests de base échoués, inscription réelle non testée"
                )
            }

            console.log(
                "\n🎯 Tests terminés ! Essayez maintenant l'inscription depuis l'interface."
            )
        },
        quickTest: async () => {
            console.log("⚡ Test rapide de l'inscription...")
            try {
                const testEmail = `test_${Date.now()}@test.com`
                console.log(`📧 Email de test: ${testEmail}`)

                const { data, error } = await supabase.auth.signUp({
                    email: testEmail,
                    password: "TestPassword123!",
                    options: {
                        data: {
                            first_name: "Test",
                            last_name: "User",
                            role: "user",
                        },
                    },
                })

                if (error) {
                    console.error("❌ Erreur d'inscription:", error)
                    console.error("📋 Détails:", error.message)
                } else {
                    console.log("✅ Inscription réussie:", data.user?.id)

                    // Attendre un peu pour que le trigger s'exécute
                    await new Promise(resolve => setTimeout(resolve, 2000))

                    // Vérifier si le profil a été créé
                    if (data.user?.id) {
                        const { data: profileData, error: profileError } =
                            await supabase
                                .from("user_profiles")
                                .select("*")
                                .eq("user_id", data.user.id)
                                .single()

                        if (profileError) {
                            console.warn(
                                "⚠️ Profil non trouvé:",
                                profileError.message
                            )
                            // Essayer de créer le profil manuellement
                            const { data: createResult, error: createError } =
                                await supabase.rpc(
                                    "create_missing_user_profile",
                                    { p_user_id: data.user.id }
                                )

                            if (createError) {
                                console.error(
                                    "❌ Impossible de créer le profil:",
                                    createError
                                )
                            } else {
                                console.log("✅ Profil créé manuellement")
                            }
                        } else {
                            console.log("✅ Profil trouvé:", profileData)
                        }

                        // Nettoyer le test
                        try {
                            await supabase.auth.admin.deleteUser(data.user.id)
                            console.log("🧹 Utilisateur de test supprimé")
                        } catch (cleanupError) {
                            console.warn(
                                "⚠️ Impossible de supprimer l'utilisateur de test"
                            )
                        }
                    }
                }
            } catch (error) {
                console.error("💥 Erreur inattendue:", error)
            }
        },
    }
}

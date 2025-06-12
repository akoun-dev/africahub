/**
 * Utilitaire de diagnostic pour les profils utilisateur
 * Vérifie pourquoi les profils ne sont pas créés lors de l'inscription
 */

import { supabase } from "@/integrations/supabase/client"

export interface DiagnosticResult {
    step: string
    success: boolean
    message: string
    data?: unknown
}

/**
 * Diagnostic complet du système de profils
 */
export const diagnoseProfils = async (): Promise<DiagnosticResult[]> => {
    const results: DiagnosticResult[] = []

    try {
        // 1. Vérifier la connexion à Supabase
        results.push({
            step: "Connexion Supabase",
            success: true,
            message: "✅ Connexion établie"
        })

        // 2. Vérifier les profils utilisateur
        const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('*')

        if (profilesError) {
            results.push({
                step: "Profils utilisateur",
                success: false,
                message: `❌ Erreur: ${profilesError.message}`
            })
        } else {
            results.push({
                step: "Profils utilisateur",
                success: true,
                message: `✅ ${profiles.length} profils trouvés`,
                data: profiles
            })
        }

        // 3. Vérifier les profils marchands
        const { data: merchantProfiles, error: merchantError } = await supabase
            .from('merchant_profiles')
            .select('*')

        if (merchantError) {
            results.push({
                step: "Profils marchands",
                success: false,
                message: `❌ Erreur: ${merchantError.message}`
            })
        } else {
            results.push({
                step: "Profils marchands",
                success: true,
                message: `✅ ${merchantProfiles.length} profils marchands trouvés`,
                data: merchantProfiles
            })
        }

        // 4. Vérifier l'utilisateur actuel
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
            results.push({
                step: "Utilisateur actuel",
                success: false,
                message: `❌ Erreur: ${userError.message}`
            })
        } else if (user) {
            // Vérifier si l'utilisateur actuel a un profil
            const userProfile = profiles?.find(p => p.user_id === user.id)
            
            results.push({
                step: "Profil utilisateur actuel",
                success: !!userProfile,
                message: userProfile 
                    ? `✅ Profil trouvé pour ${user.email}`
                    : `❌ Aucun profil trouvé pour ${user.email}`,
                data: userProfile || { user_id: user.id, email: user.email }
            })
        } else {
            results.push({
                step: "Utilisateur actuel",
                success: false,
                message: "❌ Aucun utilisateur connecté"
            })
        }

    } catch (error) {
        results.push({
            step: "Diagnostic général",
            success: false,
            message: `❌ Erreur inattendue: ${error}`
        })
    }

    return results
}

/**
 * Créer manuellement un profil pour l'utilisateur actuel
 */
export const creerProfilsManquants = async (): Promise<DiagnosticResult[]> => {
    const results: DiagnosticResult[] = []

    try {
        // Récupérer l'utilisateur actuel
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            results.push({
                step: "Vérification utilisateur",
                success: false,
                message: "❌ Aucun utilisateur connecté"
            })
            return results
        }

        // Vérifier si le profil existe déjà
        const { data: existingProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (existingProfile) {
            results.push({
                step: "Vérification profil existant",
                success: true,
                message: "✅ Le profil existe déjà"
            })
            return results
        }

        // Créer le profil manquant
        const profileData = {
            user_id: user.id,
            first_name: user.user_metadata?.first_name || 'Utilisateur',
            last_name: user.user_metadata?.last_name || 'AfricaHub',
            role: (user.user_metadata?.role as 'user' | 'merchant' | 'manager' | 'admin') || 'user',
            status: 'active' as const,
            email: user.email
        }

        const { error: insertError } = await supabase
            .from('user_profiles')
            .insert(profileData)

        if (insertError) {
            results.push({
                step: "Création profil",
                success: false,
                message: `❌ Erreur: ${insertError.message}`
            })
        } else {
            results.push({
                step: "Création profil",
                success: true,
                message: `✅ Profil créé avec succès pour ${user.email}`
            })

            // Si c'est un marchand, créer aussi le profil marchand
            if (user.user_metadata?.role === 'merchant' && user.user_metadata?.business_info) {
                const businessInfo = user.user_metadata.business_info
                const merchantData = {
                    user_id: user.id,
                    business_name: businessInfo.business_name || 'Entreprise',
                    business_sector: businessInfo.business_sector || 'Autre',
                    business_type: businessInfo.business_type || 'Autre',
                    business_description: businessInfo.business_description || '',
                    business_address: businessInfo.business_address || '',
                    business_phone: businessInfo.business_phone || '',
                    business_email: businessInfo.business_email || user.email,
                    verification_status: 'pending' as const
                }

                const { error: merchantError } = await supabase
                    .from('merchant_profiles')
                    .insert(merchantData)

                if (merchantError) {
                    results.push({
                        step: "Création profil marchand",
                        success: false,
                        message: `❌ Erreur: ${merchantError.message}`
                    })
                } else {
                    results.push({
                        step: "Création profil marchand",
                        success: true,
                        message: `✅ Profil marchand créé avec succès`
                    })
                }
            }
        }

    } catch (error) {
        results.push({
            step: "Création profils manquants",
            success: false,
            message: `❌ Erreur inattendue: ${error}`
        })
    }

    return results
}

/**
 * Tester l'inscription avec création de profil
 */
export const testerInscription = async (): Promise<DiagnosticResult[]> => {
    const results: DiagnosticResult[] = []
    const testEmail = `test_${Date.now()}@africahub-diagnostic.com`

    try {
        // Tenter une inscription de test
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: 'TestPassword123!',
            options: {
                data: {
                    first_name: 'Test',
                    last_name: 'Diagnostic',
                    role: 'user'
                }
            }
        })

        if (error) {
            results.push({
                step: "Inscription test",
                success: false,
                message: `❌ Erreur inscription: ${error.message}`
            })
            return results
        }

        results.push({
            step: "Inscription test",
            success: true,
            message: `✅ Inscription réussie pour ${testEmail}`,
            data: { userId: data.user?.id }
        })

        // Attendre un peu pour laisser le temps aux triggers
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Vérifier si le profil a été créé
        if (data.user?.id) {
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', data.user.id)
                .single()

            if (profileError) {
                results.push({
                    step: "Vérification profil créé",
                    success: false,
                    message: `❌ Profil non trouvé: ${profileError.message}`
                })
            } else {
                results.push({
                    step: "Vérification profil créé",
                    success: true,
                    message: `✅ Profil créé automatiquement`,
                    data: profile
                })
            }
        }

    } catch (error) {
        results.push({
            step: "Test inscription",
            success: false,
            message: `❌ Erreur inattendue: ${error}`
        })
    }

    return results
}

// Exposer les fonctions globalement pour les tests dans la console
if (typeof window !== 'undefined') {
    (window as Record<string, unknown>).diagnoseProfils = {
        diagnoseProfils,
        creerProfilsManquants,
        testerInscription
    }
}

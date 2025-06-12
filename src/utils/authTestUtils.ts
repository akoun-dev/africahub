/**
 * Utilitaires de test pour l'authentification
 * Utilisation: Ouvrir la console du navigateur et exécuter testAuthFix()
 */

import { supabase } from '@/integrations/supabase/client'

// Test simple des fonctions d'authentification
export const testAuthFix = async () => {
    console.log('🧪 Test des corrections d\'authentification...')
    
    const results = []
    
    // Test 1: Fonction get_user_roles
    try {
        console.log('🔍 Test de get_user_roles...')
        const { data, error } = await supabase.rpc('get_user_roles', {
            _user_id: '00000000-0000-0000-0000-000000000000'
        })
        
        if (error) {
            console.log('❌ get_user_roles échoué:', error.message)
            results.push({ test: 'get_user_roles', success: false, error: error.message })
        } else {
            console.log('✅ get_user_roles fonctionne:', data)
            results.push({ test: 'get_user_roles', success: true, data })
        }
    } catch (error) {
        console.log('💥 Exception get_user_roles:', error)
        results.push({ test: 'get_user_roles', success: false, error: String(error) })
    }
    
    // Test 2: Fonction get_user_profile_complete
    try {
        console.log('🔍 Test de get_user_profile_complete...')
        const { data, error } = await supabase.rpc('get_user_profile_complete', {
            _user_id: '00000000-0000-0000-0000-000000000000'
        })
        
        if (error) {
            if (error.message.includes('Access denied')) {
                console.log('✅ get_user_profile_complete fonctionne (accès refusé comme attendu)')
                results.push({ test: 'get_user_profile_complete', success: true, message: 'Access denied as expected' })
            } else {
                console.log('❌ get_user_profile_complete échoué:', error.message)
                results.push({ test: 'get_user_profile_complete', success: false, error: error.message })
            }
        } else {
            console.log('✅ get_user_profile_complete fonctionne:', data)
            results.push({ test: 'get_user_profile_complete', success: true, data })
        }
    } catch (error) {
        console.log('💥 Exception get_user_profile_complete:', error)
        results.push({ test: 'get_user_profile_complete', success: false, error: String(error) })
    }
    
    // Test 3: Accès à user_profiles (devrait échouer sans auth)
    try {
        console.log('🔍 Test d\'accès à user_profiles...')
        const { data, error } = await supabase
            .from('user_profiles')
            .select('id, role')
            .limit(1)
        
        if (error) {
            console.log('✅ RLS fonctionne (accès refusé):', error.message)
            results.push({ test: 'user_profiles_access', success: true, message: 'RLS working' })
        } else {
            console.log('⚠️ PROBLÈME DE SÉCURITÉ: Accès autorisé sans auth:', data)
            results.push({ test: 'user_profiles_access', success: false, message: 'Security issue: unauthorized access' })
        }
    } catch (error) {
        console.log('💥 Exception user_profiles:', error)
        results.push({ test: 'user_profiles_access', success: false, error: String(error) })
    }
    
    // Résumé
    const successCount = results.filter(r => r.success).length
    const totalCount = results.length
    
    console.log('\n📊 RÉSUMÉ DES TESTS')
    console.log('=' .repeat(40))
    console.log(`✅ Tests réussis: ${successCount}/${totalCount}`)
    
    if (successCount === totalCount) {
        console.log('🎉 Tous les tests sont passés !')
    } else {
        console.log('⚠️ Certains tests ont échoué')
    }
    
    console.log('\nDétails:', results)
    return results
}

// Test de connexion utilisateur
export const testUserLogin = async (email: string, password: string) => {
    console.log('🔐 Test de connexion utilisateur...')
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) {
            console.log('❌ Connexion échouée:', error.message)
            return { success: false, error: error.message }
        }
        
        console.log('✅ Connexion réussie:', data.user?.email)
        
        // Test de récupération du profil après connexion
        if (data.user) {
            try {
                const { data: profileData, error: profileError } = await supabase.rpc('get_user_profile_complete', {
                    _user_id: data.user.id
                })
                
                if (profileError) {
                    console.log('❌ Récupération du profil échouée:', profileError.message)
                } else {
                    console.log('✅ Profil récupéré:', profileData)
                }
                
                // Test de get_user_roles avec l'utilisateur connecté
                const { data: rolesData, error: rolesError } = await supabase.rpc('get_user_roles', {
                    _user_id: data.user.id
                })
                
                if (rolesError) {
                    console.log('❌ Récupération des rôles échouée:', rolesError.message)
                } else {
                    console.log('✅ Rôles récupérés:', rolesData)
                }
                
            } catch (error) {
                console.log('💥 Exception profil:', error)
            }
        }
        
        return { success: true, user: data.user }
    } catch (error) {
        console.log('💥 Exception connexion:', error)
        return { success: false, error: String(error) }
    }
}

// Export pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
    (window as any).testAuthFix = testAuthFix
    (window as any).testUserLogin = testUserLogin
    
    console.log('🔧 Fonctions de test disponibles:')
    console.log('- testAuthFix() : Teste les fonctions d\'authentification')
    console.log('- testUserLogin(email, password) : Teste la connexion utilisateur')
}

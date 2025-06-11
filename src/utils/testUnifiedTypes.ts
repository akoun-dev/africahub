/**
 * Script de test pour vérifier la cohérence des types unifiés
 * Ce script teste les nouveaux types et fonctions utilitaires
 */

import { supabase } from '@/integrations/supabase/client'
import {
    UserWithProfile,
    hasPermission,
    hasRole,
    canAccess,
    getFullName,
    getInitials,
    formatUserStatus,
    formatUserRole,
    formatVerificationStatus,
    isUserRole,
    isUserStatus,
    isVerificationStatus,
    DEFAULT_PERMISSIONS,
    USER_ROLES,
    USER_STATUSES,
    VERIFICATION_STATUSES,
} from '@/integrations/supabase/helpers'

// Test des types et fonctions utilitaires
export const testUnifiedTypes = async () => {
    console.log('🧪 Test des types unifiés AfricaHub')
    console.log('=====================================')

    // Test 1: Vérification des constantes
    console.log('📋 Test 1: Constantes')
    console.log('USER_ROLES:', USER_ROLES)
    console.log('USER_STATUSES:', USER_STATUSES)
    console.log('VERIFICATION_STATUSES:', VERIFICATION_STATUSES)
    console.log('DEFAULT_PERMISSIONS:', DEFAULT_PERMISSIONS)

    // Test 2: Fonctions de validation des types
    console.log('\n🔍 Test 2: Validation des types')
    console.log('isUserRole("admin"):', isUserRole('admin'))
    console.log('isUserRole("invalid"):', isUserRole('invalid'))
    console.log('isUserStatus("active"):', isUserStatus('active'))
    console.log('isUserStatus("invalid"):', isUserStatus('invalid'))
    console.log('isVerificationStatus("verified"):', isVerificationStatus('verified'))
    console.log('isVerificationStatus("invalid"):', isVerificationStatus('invalid'))

    // Test 3: Fonctions de formatage
    console.log('\n🎨 Test 3: Formatage')
    console.log('formatUserRole("admin"):', formatUserRole('admin'))
    console.log('formatUserStatus("active"):', formatUserStatus('active'))
    console.log('formatVerificationStatus("verified"):', formatVerificationStatus('verified'))

    // Test 4: Profil utilisateur de test
    console.log('\n👤 Test 4: Profil utilisateur de test')
    const testProfile: UserWithProfile = {
        id: 'test-id',
        user_id: 'test-user-id',
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean.dupont@example.com',
        avatar_url: null,
        phone: '+225 01 02 03 04 05',
        country: 'Côte d\'Ivoire',
        city: 'Abidjan',
        role: 'user',
        status: 'active',
        preferences: {
            language: 'fr',
            currency: 'XOF',
            notifications: {
                email: true,
                push: true,
                sms: false
            }
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        permissions: ['view_products', 'create_reviews', 'manage_favorites']
    }

    console.log('Nom complet:', getFullName(testProfile))
    console.log('Initiales:', getInitials(testProfile))

    // Test 5: Fonctions de permissions
    console.log('\n🔐 Test 5: Permissions')
    console.log('hasPermission(view_products):', hasPermission(testProfile, 'view_products'))
    console.log('hasPermission(admin_access):', hasPermission(testProfile, 'admin_access'))
    console.log('hasRole(user):', hasRole(testProfile, 'user'))
    console.log('hasRole(admin):', hasRole(testProfile, 'admin'))
    console.log('canAccess(products, view):', canAccess(testProfile, 'products', 'view'))
    console.log('canAccess(admin, manage):', canAccess(testProfile, 'admin', 'manage'))

    // Test 6: Profil admin de test
    console.log('\n👑 Test 6: Profil admin de test')
    const adminProfile: UserWithProfile = {
        ...testProfile,
        role: 'admin',
        permissions: ['*']
    }

    console.log('Admin hasPermission(any_permission):', hasPermission(adminProfile, 'any_permission'))
    console.log('Admin hasRole(admin):', hasRole(adminProfile, 'admin'))
    console.log('Admin canAccess(system, config):', canAccess(adminProfile, 'system', 'config'))

    // Test 7: Test de connexion à la base de données
    console.log('\n🗄️ Test 7: Connexion base de données')
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('id, role, status')
            .limit(1)

        if (error) {
            console.error('❌ Erreur de connexion:', error.message)
        } else {
            console.log('✅ Connexion réussie, exemple de profil:', data?.[0])
        }
    } catch (error) {
        console.error('💥 Erreur inattendue:', error)
    }

    // Test 8: Test des types TypeScript (compilation)
    console.log('\n📝 Test 8: Types TypeScript')
    
    // Test de typage strict
    const roleTest: typeof testProfile.role = 'user' // Doit être valide
    const statusTest: typeof testProfile.status = 'active' // Doit être valide
    
    console.log('✅ Types TypeScript validés')
    console.log('Role test:', roleTest)
    console.log('Status test:', statusTest)

    console.log('\n🎉 Tests terminés avec succès!')
    return {
        success: true,
        testProfile,
        adminProfile,
        constants: {
            USER_ROLES,
            USER_STATUSES,
            VERIFICATION_STATUSES,
            DEFAULT_PERMISSIONS
        }
    }
}

// Fonction pour tester en mode développement
export const runTestsInDev = () => {
    if (import.meta.env.DEV) {
        console.log('🚀 Lancement des tests en mode développement')
        testUnifiedTypes().then(result => {
            console.log('📊 Résultats des tests:', result)
            // Exposer les résultats dans la console du navigateur
            ;(window as any).testUnifiedTypes = {
                runTests: testUnifiedTypes,
                lastResult: result
            }
        }).catch(error => {
            console.error('❌ Erreur lors des tests:', error)
        })
    }
}

// Auto-exécution en mode développement
runTestsInDev()

// Export pour utilisation manuelle
export default testUnifiedTypes

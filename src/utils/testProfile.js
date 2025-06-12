// Test direct du profil utilisateur
import { supabase } from '@/integrations/supabase/client'

export const testUserProfile = async () => {
    console.log('🔍 Test du profil utilisateur...')
    
    try {
        // 1. Vérifier l'utilisateur connecté
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
            console.error('❌ Erreur auth:', userError)
            return
        }
        
        if (!user) {
            console.log('❌ Aucun utilisateur connecté')
            return
        }
        
        console.log('✅ Utilisateur connecté:', {
            id: user.id,
            email: user.email,
            metadata: user.user_metadata
        })
        
        // 2. Chercher le profil directement
        const { data: profiles, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
        
        console.log('📋 Résultat requête profils:', {
            profiles,
            error: profileError,
            count: profiles?.length || 0
        })
        
        if (profileError) {
            console.error('❌ Erreur profil:', profileError)
            return
        }
        
        if (!profiles || profiles.length === 0) {
            console.log('⚠️ Aucun profil trouvé pour cet utilisateur')
            
            // 3. Créer le profil manquant
            console.log('🔧 Création du profil...')
            
            const newProfile = {
                id: `profile_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                user_id: user.id,
                email: user.email,
                first_name: user.user_metadata?.first_name || 'Utilisateur',
                last_name: user.user_metadata?.last_name || 'AfricaHub',
                role: 'user',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            
            const { data: createdProfile, error: createError } = await supabase
                .from('user_profiles')
                .insert(newProfile)
                .select()
                .single()
            
            if (createError) {
                console.error('❌ Erreur création profil:', createError)
                return
            }
            
            console.log('✅ Profil créé avec succès:', createdProfile)
            return createdProfile
        }
        
        console.log('✅ Profil trouvé:', profiles[0])
        return profiles[0]
        
    } catch (error) {
        console.error('💥 Erreur inattendue:', error)
    }
}

// Fonction pour forcer le rechargement du profil dans AuthContext
export const forceProfileReload = async () => {
    console.log('🔄 Forçage du rechargement du profil...')
    
    // Déclencher un événement personnalisé pour forcer le rechargement
    window.dispatchEvent(new CustomEvent('forceProfileReload'))
    
    // Attendre un peu puis recharger la page si nécessaire
    setTimeout(() => {
        console.log('🔄 Rechargement de la page...')
        window.location.reload()
    }, 2000)
}

// Rendre les fonctions disponibles globalement pour les tests
window.testUserProfile = testUserProfile
window.forceProfileReload = forceProfileReload

console.log('🧪 Fonctions de test de profil disponibles:')
console.log('- await testUserProfile() : Teste et crée le profil si nécessaire')
console.log('- await forceProfileReload() : Force le rechargement du profil')

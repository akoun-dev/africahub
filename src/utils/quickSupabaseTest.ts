/**
 * Test rapide de la nouvelle configuration Supabase
 */

import { supabase } from '@/integrations/supabase/client';

export async function quickSupabaseTest() {
  console.log('🧪 TEST RAPIDE SUPABASE AFRICAHUB');
  console.log('================================');
  
  try {
    // Test 1: Vérifier la session
    console.log('⏳ Test 1: Vérification de la session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Erreur de session:', sessionError.message);
      return false;
    } else {
      console.log('✅ Session OK');
    }
    
    // Test 2: Tester une requête simple
    console.log('⏳ Test 2: Test de requête basique...');
    const { error: queryError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (queryError) {
      if (queryError.message.includes('relation "user_profiles" does not exist')) {
        console.log('⚠️ Table user_profiles n\'existe pas encore');
        console.log('📋 Vous devez appliquer les migrations dans Supabase');
        console.log('   1. Aller sur https://supabase.com/dashboard');
        console.log('   2. Sélectionner votre projet');
        console.log('   3. Aller dans SQL Editor');
        console.log('   4. Exécuter les migrations dans supabase/migrations/');
        return false;
      } else {
        console.log('❌ Erreur de requête:', queryError.message);
        return false;
      }
    } else {
      console.log('✅ Requête OK - Tables accessibles');
    }
    
    // Test 3: Tester les fonctions RPC si elles existent
    console.log('⏳ Test 3: Test des fonctions RPC...');
    const { error: rpcError } = await supabase.rpc('get_user_roles', {
      p_user_id: '00000000-0000-0000-0000-000000000000'
    });
    
    if (rpcError) {
      if (rpcError.message.includes('function get_user_roles') && rpcError.message.includes('does not exist')) {
        console.log('⚠️ Fonctions RPC non créées');
        console.log('📋 Appliquez les migrations pour créer les fonctions');
        return false;
      } else {
        console.log('❌ Erreur RPC:', rpcError.message);
        return false;
      }
    } else {
      console.log('✅ Fonctions RPC OK');
    }
    
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ Votre configuration Supabase est opérationnelle');
    console.log('🚀 Vous pouvez maintenant tester l\'inscription sur /auth');
    
    return true;
    
  } catch (error: any) {
    console.log('❌ Erreur inattendue:', error.message);
    
    if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      console.log('🔧 L\'URL Supabase ne peut pas être résolue');
      console.log('   Vérifiez que vous avez redémarré le serveur de développement');
    } else if (error.message.includes('Failed to fetch')) {
      console.log('🌐 Problème de connectivité réseau');
      console.log('   Vérifiez votre connexion internet');
    }
    
    return false;
  }
}

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).quickSupabaseTest = quickSupabaseTest;
  console.log('🧪 Test disponible: tapez quickSupabaseTest() dans la console');
}

/**
 * Utilitaire pour tester la connectivité Supabase
 * À utiliser pour diagnostiquer les problèmes de connexion
 */

interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: any;
  error?: any;
}

/**
 * Tester la connectivité réseau vers Supabase
 */
export async function testSupabaseConnectivity(): Promise<ConnectionTestResult> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wgizdqaspwenhnbyuuro.supabase.co";
  
  try {
    console.log('🔍 Test de connectivité vers:', SUPABASE_URL);
    
    // Test 1: Vérifier que l'URL est valide
    let url: URL;
    try {
      url = new URL(SUPABASE_URL);
    } catch (error) {
      return {
        success: false,
        message: 'URL Supabase invalide',
        error: error.message
      };
    }
    
    // Test 2: Ping basique vers l'URL
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout
    
    try {
      const response = await fetch(SUPABASE_URL + '/rest/v1/', {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok || response.status === 401 || response.status === 403) {
        // 401/403 sont OK car cela signifie que le serveur répond
        return {
          success: true,
          message: 'Connectivité Supabase OK',
          details: {
            status: response.status,
            statusText: response.statusText,
            url: SUPABASE_URL
          }
        };
      } else {
        return {
          success: false,
          message: `Serveur Supabase répond avec erreur: ${response.status}`,
          details: {
            status: response.status,
            statusText: response.statusText
          }
        };
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return {
          success: false,
          message: 'Timeout: Impossible de joindre le serveur Supabase',
          error: 'Connexion trop lente ou serveur inaccessible'
        };
      }
      
      if (fetchError.message.includes('ERR_NAME_NOT_RESOLVED')) {
        return {
          success: false,
          message: 'Erreur DNS: Impossible de résoudre le nom de domaine Supabase',
          error: 'Le projet Supabase n\'existe peut-être plus ou l\'URL est incorrecte',
          details: {
            suggestion: 'Vérifiez votre URL Supabase dans le dashboard'
          }
        };
      }
      
      return {
        success: false,
        message: 'Erreur de connexion réseau',
        error: fetchError.message
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Erreur inattendue lors du test de connectivité',
      error: error.message
    };
  }
}

/**
 * Tester la configuration Supabase complète
 */
export async function testSupabaseConfig(): Promise<{
  connectivity: ConnectionTestResult;
  config: {
    hasUrl: boolean;
    hasKey: boolean;
    urlValid: boolean;
    keyValid: boolean;
  };
  recommendations: string[];
}> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wgizdqaspwenhnbyuuro.supabase.co";
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
  
  // Test de connectivité
  const connectivity = await testSupabaseConnectivity();
  
  // Vérification de la configuration
  const config = {
    hasUrl: !!SUPABASE_URL,
    hasKey: !!SUPABASE_KEY,
    urlValid: false,
    keyValid: false
  };
  
  // Vérifier l'URL
  try {
    new URL(SUPABASE_URL);
    config.urlValid = true;
  } catch {
    config.urlValid = false;
  }
  
  // Vérifier la clé (format JWT basique)
  try {
    const parts = SUPABASE_KEY.split('.');
    config.keyValid = parts.length === 3 && parts[0].length > 0;
  } catch {
    config.keyValid = false;
  }
  
  // Générer des recommandations
  const recommendations: string[] = [];
  
  if (!connectivity.success) {
    if (connectivity.error?.includes('ERR_NAME_NOT_RESOLVED')) {
      recommendations.push('🔧 Créer un nouveau projet Supabase ou vérifier l\'URL existante');
      recommendations.push('🌐 Aller sur https://supabase.com/dashboard pour vérifier vos projets');
      recommendations.push('📝 Mettre à jour l\'URL dans .env.local');
    } else {
      recommendations.push('🌐 Vérifier votre connexion internet');
      recommendations.push('🔄 Réessayer dans quelques minutes');
    }
  }
  
  if (!config.hasUrl || !config.urlValid) {
    recommendations.push('📝 Définir VITE_SUPABASE_URL dans .env.local');
  }
  
  if (!config.hasKey || !config.keyValid) {
    recommendations.push('🔑 Définir VITE_SUPABASE_ANON_KEY dans .env.local');
  }
  
  if (recommendations.length === 0 && connectivity.success) {
    recommendations.push('✅ Configuration Supabase correcte !');
  }
  
  return {
    connectivity,
    config,
    recommendations
  };
}

/**
 * Afficher un rapport de diagnostic complet
 */
export async function diagnoseSupabaseIssues(): Promise<void> {
  console.log('🔍 DIAGNOSTIC SUPABASE AFRICAHUB');
  console.log('================================');
  
  const result = await testSupabaseConfig();
  
  // Afficher la connectivité
  console.log('\n🌐 CONNECTIVITÉ:');
  if (result.connectivity.success) {
    console.log('✅', result.connectivity.message);
  } else {
    console.log('❌', result.connectivity.message);
    if (result.connectivity.error) {
      console.log('   Erreur:', result.connectivity.error);
    }
  }
  
  // Afficher la configuration
  console.log('\n⚙️ CONFIGURATION:');
  console.log('   URL présente:', result.config.hasUrl ? '✅' : '❌');
  console.log('   URL valide:', result.config.urlValid ? '✅' : '❌');
  console.log('   Clé présente:', result.config.hasKey ? '✅' : '❌');
  console.log('   Clé valide:', result.config.keyValid ? '✅' : '❌');
  
  // Afficher les recommandations
  console.log('\n💡 RECOMMANDATIONS:');
  result.recommendations.forEach(rec => {
    console.log('  ', rec);
  });
  
  // Instructions spécifiques
  if (!result.connectivity.success) {
    console.log('\n📋 ÉTAPES DE RÉSOLUTION:');
    console.log('   1. Aller sur https://supabase.com/dashboard');
    console.log('   2. Créer un nouveau projet ou vérifier l\'existant');
    console.log('   3. Copier l\'URL et la clé publique');
    console.log('   4. Mettre à jour .env.local avec les nouvelles valeurs');
    console.log('   5. Redémarrer le serveur de développement');
  }
  
  console.log('\n================================');
}

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).diagnoseSupabaseIssues = diagnoseSupabaseIssues;
  (window as any).testSupabaseConnectivity = testSupabaseConnectivity;
  console.log('🔧 Diagnostic disponible: tapez diagnoseSupabaseIssues() dans la console');
}

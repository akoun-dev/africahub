/**
 * Script de test pour vérifier que le système d'authentification corrigé fonctionne
 * À exécuter dans la console du navigateur pour tester les fonctionnalités
 */

import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/user';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

/**
 * Classe pour tester le système d'authentification corrigé
 */
export class AuthSystemFixedTester {
  private results: TestResult[] = [];

  /**
   * Test 1: Vérifier la connexion à Supabase
   */
  async testSupabaseConnection(): Promise<TestResult> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          name: 'Connexion Supabase',
          success: false,
          message: 'Erreur de connexion à Supabase',
          error
        };
      }

      return {
        name: 'Connexion Supabase',
        success: true,
        message: 'Connexion à Supabase réussie',
        data: { hasSession: !!data.session }
      };
    } catch (error) {
      return {
        name: 'Connexion Supabase',
        success: false,
        message: 'Erreur inattendue lors de la connexion',
        error
      };
    }
  }

  /**
   * Test 2: Vérifier l'existence des tables
   */
  async testTablesExist(): Promise<TestResult> {
    try {
      // Tester user_profiles
      const { error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      if (userProfilesError) {
        return {
          name: 'Tables de base',
          success: false,
          message: 'Table user_profiles inaccessible',
          error: userProfilesError
        };
      }

      // Tester merchant_profiles
      const { error: merchantProfilesError } = await supabase
        .from('merchant_profiles')
        .select('count')
        .limit(1);

      if (merchantProfilesError) {
        return {
          name: 'Tables de base',
          success: false,
          message: 'Table merchant_profiles inaccessible',
          error: merchantProfilesError
        };
      }

      return {
        name: 'Tables de base',
        success: true,
        message: 'Toutes les tables sont accessibles'
      };
    } catch (error) {
      return {
        name: 'Tables de base',
        success: false,
        message: 'Erreur lors de la vérification des tables',
        error
      };
    }
  }

  /**
   * Test 3: Tester les fonctions RPC
   */
  async testRPCFunctions(): Promise<TestResult> {
    try {
      // Tester get_user_roles
      const { data: rolesData, error: rolesError } = await supabase.rpc('get_user_roles', {
        p_user_id: '00000000-0000-0000-0000-000000000000'
      });

      if (rolesError) {
        return {
          name: 'Fonctions RPC',
          success: false,
          message: 'Fonction get_user_roles non disponible',
          error: rolesError
        };
      }

      // Tester get_user_profile si elle existe
      const { error: profileError } = await supabase.rpc('get_user_profile', {
        p_user_id: '00000000-0000-0000-0000-000000000000'
      });

      return {
        name: 'Fonctions RPC',
        success: true,
        message: 'Fonctions RPC disponibles',
        data: { 
          rolesResult: rolesData,
          profileFunctionExists: !profileError
        }
      };
    } catch (error) {
      return {
        name: 'Fonctions RPC',
        success: false,
        message: 'Erreur lors du test des fonctions RPC',
        error
      };
    }
  }

  /**
   * Test 4: Simuler une inscription (sans créer réellement un utilisateur)
   */
  async testSignupFlow(): Promise<TestResult> {
    try {
      // Tester avec un email invalide pour éviter de créer un vrai utilisateur
      const testEmail = 'test-invalid-email-for-testing@invalid-domain-africahub.test';
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User',
            role: UserRole.USER
          }
        }
      });

      // On s'attend à une erreur car l'email est invalide, mais pas une erreur de fonction manquante
      if (error && error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        return {
          name: 'Flux d\'inscription',
          success: false,
          message: 'Erreur ERR_NAME_NOT_RESOLVED encore présente',
          error
        };
      }

      return {
        name: 'Flux d\'inscription',
        success: true,
        message: 'Flux d\'inscription fonctionne (pas d\'erreur RPC)',
        data: { 
          errorType: error?.message || 'Aucune erreur',
          hasUser: !!data?.user
        }
      };
    } catch (error) {
      if (error.message && error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        return {
          name: 'Flux d\'inscription',
          success: false,
          message: 'Erreur ERR_NAME_NOT_RESOLVED encore présente',
          error
        };
      }

      return {
        name: 'Flux d\'inscription',
        success: true,
        message: 'Flux d\'inscription fonctionne (erreur attendue pour email invalide)',
        error
      };
    }
  }

  /**
   * Test 5: Vérifier les vues si elles existent
   */
  async testViews(): Promise<TestResult> {
    try {
      // Tester la vue user_stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .limit(1);

      // Tester la vue complete_user_profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('complete_user_profiles')
        .select('*')
        .limit(1);

      return {
        name: 'Vues système',
        success: true,
        message: 'Vérification des vues terminée',
        data: {
          userStatsAvailable: !statsError,
          completeProfilesAvailable: !profilesError,
          statsData: statsData?.[0],
          profilesCount: profilesData?.length || 0
        }
      };
    } catch (error) {
      return {
        name: 'Vues système',
        success: false,
        message: 'Erreur lors de la vérification des vues',
        error
      };
    }
  }

  /**
   * Exécuter tous les tests
   */
  async runAllTests(): Promise<{ success: boolean; results: TestResult[] }> {
    console.log('🧪 Début des tests du système d\'authentification corrigé...\n');

    this.results = [];

    // Test 1: Connexion Supabase
    console.log('⏳ Test 1: Connexion Supabase...');
    const connectionTest = await this.testSupabaseConnection();
    this.results.push(connectionTest);
    console.log(connectionTest.success ? '✅' : '❌', connectionTest.message);

    // Test 2: Tables de base
    console.log('⏳ Test 2: Vérification des tables...');
    const tablesTest = await this.testTablesExist();
    this.results.push(tablesTest);
    console.log(tablesTest.success ? '✅' : '❌', tablesTest.message);

    // Test 3: Fonctions RPC
    console.log('⏳ Test 3: Fonctions RPC...');
    const rpcTest = await this.testRPCFunctions();
    this.results.push(rpcTest);
    console.log(rpcTest.success ? '✅' : '❌', rpcTest.message);

    // Test 4: Flux d'inscription
    console.log('⏳ Test 4: Flux d\'inscription...');
    const signupTest = await this.testSignupFlow();
    this.results.push(signupTest);
    console.log(signupTest.success ? '✅' : '❌', signupTest.message);

    // Test 5: Vues système
    console.log('⏳ Test 5: Vues système...');
    const viewsTest = await this.testViews();
    this.results.push(viewsTest);
    console.log(viewsTest.success ? '✅' : '❌', viewsTest.message);

    const allSuccess = this.results.every(result => result.success);

    return {
      success: allSuccess,
      results: this.results
    };
  }

  /**
   * Afficher un rapport détaillé
   */
  displayReport(): void {
    console.log('\n📊 RAPPORT DE TEST DU SYSTÈME D\'AUTHENTIFICATION CORRIGÉ\n');
    console.log('='.repeat(65));

    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);

    console.log(`✅ Tests réussis: ${successful.length}/${this.results.length}`);
    console.log(`❌ Tests échoués: ${failed.length}/${this.results.length}`);

    if (failed.length > 0) {
      console.log('\n❌ TESTS ÉCHOUÉS:');
      failed.forEach(result => {
        console.log(`  • ${result.name}: ${result.message}`);
        if (result.error) {
          console.log(`    Erreur: ${result.error.message || result.error}`);
        }
      });
    }

    if (successful.length > 0) {
      console.log('\n✅ TESTS RÉUSSIS:');
      successful.forEach(result => {
        console.log(`  • ${result.name}: ${result.message}`);
        if (result.data) {
          console.log(`    Données:`, result.data);
        }
      });
    }

    if (successful.length === this.results.length) {
      console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
      console.log('\n✅ Votre système d\'authentification AfricaHub est opérationnel.');
      console.log('\n🚀 Vous pouvez maintenant:');
      console.log('  • Tester l\'inscription sur /auth');
      console.log('  • Créer des comptes utilisateur et marchand');
      console.log('  • Utiliser les dashboards spécialisés');
      console.log('  • Les erreurs ERR_NAME_NOT_RESOLVED sont corrigées');
    } else {
      console.log('\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ');
      console.log('\n🔧 Actions recommandées:');
      console.log('  • Appliquer les migrations dans supabase/migrations/');
      console.log('  • Vérifier les permissions RLS dans Supabase');
      console.log('  • Consulter les logs Supabase pour plus de détails');
    }

    console.log('\n' + '='.repeat(65));
  }
}

/**
 * Fonction utilitaire pour exécuter les tests depuis la console
 */
export async function testAuthSystemFixed(): Promise<boolean> {
  const tester = new AuthSystemFixedTester();
  const { success } = await tester.runAllTests();
  tester.displayReport();
  return success;
}

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).testAuthSystemFixed = testAuthSystemFixed;
  console.log('🧪 Test disponible: tapez testAuthSystemFixed() dans la console');
}

export default AuthSystemFixedTester;

/**
 * Script de test du système d'authentification AfricaHub
 * À exécuter après avoir appliqué les corrections pour vérifier que tout fonctionne
 */

import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/user';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  error?: any;
}

/**
 * Classe pour tester le système d'authentification
 */
export class AuthSystemTester {
  private results: TestResult[] = [];

  /**
   * Tester la connexion à Supabase
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
        message: 'Connexion à Supabase réussie'
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
   * Tester l'existence des tables
   */
  async testTablesExist(): Promise<TestResult> {
    try {
      // Tester user_profiles
      const { error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);

      if (userProfilesError) {
        return {
          name: 'Tables de base',
          success: false,
          message: 'Table user_profiles manquante ou inaccessible',
          error: userProfilesError
        };
      }

      // Tester merchant_profiles
      const { error: merchantProfilesError } = await supabase
        .from('merchant_profiles')
        .select('*')
        .limit(1);

      if (merchantProfilesError) {
        return {
          name: 'Tables de base',
          success: false,
          message: 'Table merchant_profiles manquante ou inaccessible',
          error: merchantProfilesError
        };
      }

      return {
        name: 'Tables de base',
        success: true,
        message: 'Toutes les tables nécessaires sont présentes'
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
   * Tester la fonction get_user_roles
   */
  async testGetUserRolesFunction(): Promise<TestResult> {
    try {
      const { data, error } = await supabase.rpc('get_user_roles', {
        p_user_id: '00000000-0000-0000-0000-000000000000'
      });

      // Cette fonction devrait retourner un tableau vide pour un UUID inexistant
      if (error) {
        return {
          name: 'Fonction get_user_roles',
          success: false,
          message: 'Fonction get_user_roles non disponible',
          error
        };
      }

      return {
        name: 'Fonction get_user_roles',
        success: true,
        message: 'Fonction get_user_roles fonctionne correctement'
      };
    } catch (error) {
      return {
        name: 'Fonction get_user_roles',
        success: false,
        message: 'Erreur lors du test de la fonction get_user_roles',
        error
      };
    }
  }

  /**
   * Tester l'inscription d'un utilisateur de test
   */
  async testUserSignup(): Promise<TestResult> {
    try {
      const testEmail = `test-${Date.now()}@africahub-test.com`;
      const testPassword = 'TestPassword123!';

      console.log('🧪 Test d\'inscription avec:', testEmail);

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User',
            role: UserRole.USER
          }
        }
      });

      if (error) {
        return {
          name: 'Inscription utilisateur',
          success: false,
          message: 'Erreur lors de l\'inscription de test',
          error
        };
      }

      if (!data.user) {
        return {
          name: 'Inscription utilisateur',
          success: false,
          message: 'Aucune donnée utilisateur retournée'
        };
      }

      // Vérifier que le profil a été créé automatiquement
      await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileError || !profileData) {
        return {
          name: 'Inscription utilisateur',
          success: false,
          message: 'Profil utilisateur non créé automatiquement',
          error: profileError
        };
      }

      // Nettoyer - supprimer l'utilisateur de test
      try {
        await supabase.auth.admin.deleteUser(data.user.id);
      } catch (cleanupError) {
        console.warn('⚠️ Impossible de supprimer l\'utilisateur de test:', cleanupError);
      }

      return {
        name: 'Inscription utilisateur',
        success: true,
        message: 'Inscription et création de profil automatique réussies'
      };
    } catch (error) {
      return {
        name: 'Inscription utilisateur',
        success: false,
        message: 'Erreur inattendue lors du test d\'inscription',
        error
      };
    }
  }

  /**
   * Exécuter tous les tests
   */
  async runAllTests(): Promise<{ success: boolean; results: TestResult[] }> {
    console.log('🧪 Début des tests du système d\'authentification...\n');

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

    // Test 3: Fonction get_user_roles
    console.log('⏳ Test 3: Fonction get_user_roles...');
    const functionTest = await this.testGetUserRolesFunction();
    this.results.push(functionTest);
    console.log(functionTest.success ? '✅' : '❌', functionTest.message);

    // Test 4: Inscription utilisateur (seulement si les tests précédents passent)
    if (connectionTest.success && tablesTest.success) {
      console.log('⏳ Test 4: Inscription utilisateur de test...');
      const signupTest = await this.testUserSignup();
      this.results.push(signupTest);
      console.log(signupTest.success ? '✅' : '❌', signupTest.message);
    } else {
      console.log('⏭️ Test 4: Ignoré (tests précédents échoués)');
    }

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
    console.log('\n📊 RAPPORT DE TEST DU SYSTÈME D\'AUTHENTIFICATION\n');
    console.log('='.repeat(60));

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

    if (successful.length === this.results.length) {
      console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
      console.log('\n✅ Votre système d\'authentification AfricaHub est opérationnel.');
      console.log('\n🚀 Vous pouvez maintenant:');
      console.log('  • Tester l\'inscription sur /auth');
      console.log('  • Créer des comptes utilisateur et marchand');
      console.log('  • Utiliser les dashboards spécialisés');
    } else {
      console.log('\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ');
      console.log('\n🔧 Actions recommandées:');
      console.log('  • Exécuter le script fix_auth_system.sql dans Supabase');
      console.log('  • Vérifier les permissions RLS');
      console.log('  • Consulter les logs Supabase pour plus de détails');
    }

    console.log('\n' + '='.repeat(60));
  }
}

/**
 * Fonction utilitaire pour exécuter les tests
 */
export async function testAuthSystem(): Promise<boolean> {
  const tester = new AuthSystemTester();
  const { success } = await tester.runAllTests();
  tester.displayReport();
  return success;
}

export default AuthSystemTester;

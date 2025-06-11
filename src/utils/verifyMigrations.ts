/**
 * Script de vérification des migrations pour le système utilisateur AfricaHub
 * À exécuter après l'application des migrations pour s'assurer que tout fonctionne
 */

import { supabase } from '@/integrations/supabase/client';

interface MigrationCheck {
  name: string;
  check: () => Promise<boolean>;
  description: string;
}

/**
 * Vérifications des migrations
 */
export class MigrationVerifier {
  
  private checks: MigrationCheck[] = [
    {
      name: 'Tables de base',
      description: 'Vérifier que toutes les tables principales existent',
      check: async () => {
        const tables = [
          'user_profiles',
          'merchant_profiles', 
          'user_permissions',
          'user_activity_logs',
          'user_sessions'
        ];
        
        for (const table of tables) {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (error) {
            console.error(`❌ Table ${table} manquante:`, error);
            return false;
          }
        }
        return true;
      }
    },
    
    {
      name: 'Tables de configuration',
      description: 'Vérifier les tables de configuration et données',
      check: async () => {
        const tables = [
          'permission_definitions',
          'system_settings',
          'business_types'
        ];
        
        for (const table of tables) {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (error) {
            console.error(`❌ Table ${table} manquante:`, error);
            return false;
          }
        }
        return true;
      }
    },
    
    {
      name: 'Vues système',
      description: 'Vérifier que les vues sont créées',
      check: async () => {
        const views = [
          'user_stats',
          'complete_user_profiles',
          'recent_user_activity'
        ];
        
        for (const view of views) {
          const { error } = await supabase.from(view).select('*').limit(1);
          if (error) {
            console.error(`❌ Vue ${view} manquante:`, error);
            return false;
          }
        }
        return true;
      }
    },
    
    {
      name: 'Fonctions RPC',
      description: 'Vérifier que les fonctions RPC fonctionnent',
      check: async () => {
        try {
          // Test de la fonction get_user_roles
          const { error: rolesError } = await supabase.rpc('get_user_roles', {
            p_user_id: '00000000-0000-0000-0000-000000000000'
          });
          
          if (rolesError && !rolesError.message.includes('null')) {
            console.error('❌ Fonction get_user_roles:', rolesError);
            return false;
          }
          
          // Test de la fonction check_user_permission
          const { error: permError } = await supabase.rpc('check_user_permission', {
            p_user_id: '00000000-0000-0000-0000-000000000000',
            p_permission: 'view_products'
          });
          
          if (permError && !permError.message.includes('null')) {
            console.error('❌ Fonction check_user_permission:', permError);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error('❌ Erreur lors du test des fonctions RPC:', error);
          return false;
        }
      }
    },
    
    {
      name: 'Données initiales',
      description: 'Vérifier que les données de base sont insérées',
      check: async () => {
        // Vérifier les permissions de base
        const { data: permissions, error: permError } = await supabase
          .from('permission_definitions')
          .select('*')
          .limit(5);
          
        if (permError || !permissions || permissions.length === 0) {
          console.error('❌ Permissions de base manquantes:', permError);
          return false;
        }
        
        // Vérifier les paramètres système
        const { data: settings, error: settingsError } = await supabase
          .from('system_settings')
          .select('*')
          .limit(5);
          
        if (settingsError || !settings || settings.length === 0) {
          console.error('❌ Paramètres système manquants:', settingsError);
          return false;
        }
        
        // Vérifier les types de business
        const { data: businessTypes, error: businessError } = await supabase
          .from('business_types')
          .select('*')
          .limit(5);
          
        if (businessError || !businessTypes || businessTypes.length === 0) {
          console.error('❌ Types de business manquants:', businessError);
          return false;
        }
        
        return true;
      }
    },
    
    {
      name: 'Authentification Supabase',
      description: 'Vérifier la connexion à Supabase Auth',
      check: async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('❌ Erreur auth session:', error);
            return false;
          }
          return true;
        } catch (error) {
          console.error('❌ Erreur connexion Supabase Auth:', error);
          return false;
        }
      }
    }
  ];

  /**
   * Exécuter toutes les vérifications
   */
  async runAllChecks(): Promise<{ success: boolean; results: Array<{ name: string; success: boolean; description: string }> }> {
    console.log('🔍 Début de la vérification des migrations...\n');
    
    const results = [];
    let allSuccess = true;
    
    for (const check of this.checks) {
      console.log(`⏳ Vérification: ${check.name}...`);
      
      try {
        const success = await check.check();
        results.push({
          name: check.name,
          success,
          description: check.description
        });
        
        if (success) {
          console.log(`✅ ${check.name}: OK`);
        } else {
          console.log(`❌ ${check.name}: ÉCHEC`);
          allSuccess = false;
        }
      } catch (error) {
        console.error(`💥 ${check.name}: ERREUR -`, error);
        results.push({
          name: check.name,
          success: false,
          description: check.description
        });
        allSuccess = false;
      }
      
      console.log(''); // Ligne vide pour la lisibilité
    }
    
    return { success: allSuccess, results };
  }

  /**
   * Afficher un rapport détaillé
   */
  displayReport(results: Array<{ name: string; success: boolean; description: string }>): void {
    console.log('\n📊 RAPPORT DE VÉRIFICATION DES MIGRATIONS\n');
    console.log('='.repeat(50));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Réussies: ${successful.length}/${results.length}`);
    console.log(`❌ Échouées: ${failed.length}/${results.length}`);
    
    if (failed.length > 0) {
      console.log('\n❌ VÉRIFICATIONS ÉCHOUÉES:');
      failed.forEach(result => {
        console.log(`  • ${result.name}: ${result.description}`);
      });
    }
    
    if (successful.length === results.length) {
      console.log('\n🎉 TOUTES LES MIGRATIONS SONT APPLIQUÉES AVEC SUCCÈS !');
      console.log('\n✅ Votre système de gestion des utilisateurs AfricaHub est opérationnel.');
      console.log('\n🚀 Vous pouvez maintenant:');
      console.log('  • Tester l\'authentification sur /auth');
      console.log('  • Créer des comptes utilisateur et marchand');
      console.log('  • Accéder aux dashboards spécialisés');
      console.log('  • Gérer les permissions et rôles');
    } else {
      console.log('\n⚠️  CERTAINES MIGRATIONS ONT ÉCHOUÉ');
      console.log('\n🔧 Actions recommandées:');
      console.log('  • Vérifier les logs Supabase');
      console.log('  • Réappliquer les migrations manuellement');
      console.log('  • Consulter la documentation APPLY_MIGRATIONS_MANUAL.md');
    }
    
    console.log('\n' + '='.repeat(50));
  }

  /**
   * Créer un utilisateur de test
   */
  async createTestUser(): Promise<boolean> {
    try {
      console.log('👤 Création d\'un utilisateur de test...');
      
      const { data, error } = await supabase.auth.signUp({
        email: 'test@africahub.com',
        password: 'test123456',
        options: {
          data: {
            first_name: 'Test',
            last_name: 'AfricaHub',
            role: 'user'
          }
        }
      });
      
      if (error) {
        console.error('❌ Erreur création utilisateur test:', error);
        return false;
      }
      
      console.log('✅ Utilisateur de test créé avec succès');
      return true;
    } catch (error) {
      console.error('💥 Erreur inattendue lors de la création de l\'utilisateur test:', error);
      return false;
    }
  }
}

/**
 * Fonction utilitaire pour exécuter la vérification
 */
export async function verifyMigrations(): Promise<boolean> {
  const verifier = new MigrationVerifier();
  const { success, results } = await verifier.runAllChecks();
  verifier.displayReport(results);
  return success;
}

/**
 * Fonction pour exécuter la vérification avec création d'utilisateur test
 */
export async function verifyMigrationsWithTestUser(): Promise<boolean> {
  const verifier = new MigrationVerifier();
  
  // Vérifications principales
  const { success, results } = await verifier.runAllChecks();
  
  // Création d'utilisateur test si les migrations sont OK
  if (success) {
    await verifier.createTestUser();
  }
  
  verifier.displayReport(results);
  return success;
}

export default MigrationVerifier;

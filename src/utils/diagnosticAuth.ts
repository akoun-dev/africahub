/**
 * Script de diagnostic pour le système d'authentification AfricaHub
 * Vérifie que tous les composants fonctionnent correctement
 */

import { supabase } from '@/integrations/supabase/client';

export interface DiagnosticResult {
  component: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export class AuthDiagnostic {
  
  private results: DiagnosticResult[] = [];

  /**
   * Exécuter tous les diagnostics
   */
  async runAllDiagnostics(): Promise<DiagnosticResult[]> {
    this.results = [];
    
    console.log('🔍 Début du diagnostic du système d\'authentification...\n');
    
    await this.checkSupabaseConnection();
    await this.checkDatabaseTables();
    await this.checkAuthFunctions();
    await this.checkBusinessTypes();
    await this.checkUserCreation();
    
    this.displayResults();
    return this.results;
  }

  /**
   * Vérifier la connexion Supabase
   */
  private async checkSupabaseConnection(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        this.addResult('Connexion Supabase', 'error', `Erreur de connexion: ${error.message}`);
      } else {
        this.addResult('Connexion Supabase', 'success', 'Connexion établie avec succès');
      }
    } catch (error) {
      this.addResult('Connexion Supabase', 'error', `Erreur inattendue: ${error}`);
    }
  }

  /**
   * Vérifier les tables de la base de données
   */
  private async checkDatabaseTables(): Promise<void> {
    const requiredTables = [
      'user_profiles',
      'merchant_profiles', 
      'user_permissions',
      'business_types',
      'permission_definitions'
    ];

    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        
        if (error) {
          this.addResult(`Table ${table}`, 'error', `Table manquante ou inaccessible: ${error.message}`);
        } else {
          this.addResult(`Table ${table}`, 'success', 'Table accessible');
        }
      } catch (error) {
        this.addResult(`Table ${table}`, 'error', `Erreur lors de la vérification: ${error}`);
      }
    }
  }

  /**
   * Vérifier les fonctions d'authentification
   */
  private async checkAuthFunctions(): Promise<void> {
    // Test de la fonction get_user_roles
    try {
      const { error } = await supabase.rpc('get_user_roles', {
        p_user_id: '00000000-0000-0000-0000-000000000000'
      });
      
      if (error && !error.message.includes('null')) {
        this.addResult('Fonction get_user_roles', 'error', `Fonction non disponible: ${error.message}`);
      } else {
        this.addResult('Fonction get_user_roles', 'success', 'Fonction disponible');
      }
    } catch (error) {
      this.addResult('Fonction get_user_roles', 'error', `Erreur lors du test: ${error}`);
    }

    // Test de la fonction check_user_permission
    try {
      const { error } = await supabase.rpc('check_user_permission', {
        p_user_id: '00000000-0000-0000-0000-000000000000',
        p_permission: 'view_products'
      });
      
      if (error && !error.message.includes('null')) {
        this.addResult('Fonction check_user_permission', 'error', `Fonction non disponible: ${error.message}`);
      } else {
        this.addResult('Fonction check_user_permission', 'success', 'Fonction disponible');
      }
    } catch (error) {
      this.addResult('Fonction check_user_permission', 'error', `Erreur lors du test: ${error}`);
    }
  }

  /**
   * Vérifier les types de business
   */
  private async checkBusinessTypes(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('business_types')
        .select('category, count(*)')
        .group('category');

      if (error) {
        this.addResult('Types de Business', 'error', `Erreur lors de la récupération: ${error.message}`);
      } else if (!data || data.length === 0) {
        this.addResult('Types de Business', 'warning', 'Aucun type de business trouvé');
      } else {
        const sectorsCount = data.length;
        this.addResult('Types de Business', 'success', `${sectorsCount} secteurs d'activité disponibles`, data);
      }
    } catch (error) {
      this.addResult('Types de Business', 'error', `Erreur inattendue: ${error}`);
    }
  }

  /**
   * Tester la création d'utilisateur
   */
  private async checkUserCreation(): Promise<void> {
    try {
      // Test avec un email fictif pour vérifier la validation
      const testEmail = 'diagnostic-test@africahub.com';
      
      const { error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          data: {
            first_name: 'Test',
            last_name: 'Diagnostic',
            role: 'user'
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          this.addResult('Création Utilisateur', 'success', 'Système de création fonctionnel (utilisateur existe déjà)');
        } else if (error.message.includes('Email rate limit exceeded')) {
          this.addResult('Création Utilisateur', 'warning', 'Limite de taux atteinte (normal en test)');
        } else {
          this.addResult('Création Utilisateur', 'error', `Erreur lors de la création: ${error.message}`);
        }
      } else {
        this.addResult('Création Utilisateur', 'success', 'Système de création fonctionnel');
        
        // Nettoyer l'utilisateur de test
        try {
          await supabase.auth.signOut();
        } catch (cleanupError) {
          console.warn('Erreur lors du nettoyage:', cleanupError);
        }
      }
    } catch (error) {
      this.addResult('Création Utilisateur', 'error', `Erreur inattendue: ${error}`);
    }
  }

  /**
   * Ajouter un résultat de diagnostic
   */
  private addResult(component: string, status: 'success' | 'error' | 'warning', message: string, details?: any): void {
    this.results.push({ component, status, message, details });
    
    const emoji = status === 'success' ? '✅' : status === 'error' ? '❌' : '⚠️';
    console.log(`${emoji} ${component}: ${message}`);
    
    if (details) {
      console.log('   Détails:', details);
    }
  }

  /**
   * Afficher les résultats du diagnostic
   */
  private displayResults(): void {
    console.log('\n📊 RÉSUMÉ DU DIAGNOSTIC\n');
    console.log('='.repeat(50));
    
    const successful = this.results.filter(r => r.status === 'success');
    const warnings = this.results.filter(r => r.status === 'warning');
    const errors = this.results.filter(r => r.status === 'error');
    
    console.log(`✅ Réussis: ${successful.length}/${this.results.length}`);
    console.log(`⚠️  Avertissements: ${warnings.length}/${this.results.length}`);
    console.log(`❌ Erreurs: ${errors.length}/${this.results.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ ERREURS À CORRIGER:');
      errors.forEach(result => {
        console.log(`  • ${result.component}: ${result.message}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  AVERTISSEMENTS:');
      warnings.forEach(result => {
        console.log(`  • ${result.component}: ${result.message}`);
      });
    }
    
    if (errors.length === 0) {
      console.log('\n🎉 SYSTÈME D\'AUTHENTIFICATION OPÉRATIONNEL !');
      console.log('\n✅ Vous pouvez maintenant:');
      console.log('  • Tester le formulaire d\'inscription');
      console.log('  • Créer des comptes utilisateur et marchand');
      console.log('  • Utiliser tous les secteurs d\'activité');
    } else {
      console.log('\n🔧 ACTIONS RECOMMANDÉES:');
      console.log('  • Appliquer les migrations manquantes');
      console.log('  • Vérifier la configuration Supabase');
      console.log('  • Consulter les guides de dépannage');
    }
    
    console.log('\n' + '='.repeat(50));
  }

  /**
   * Obtenir un résumé rapide
   */
  getQuickSummary(): { healthy: boolean; issues: number; message: string } {
    const errors = this.results.filter(r => r.status === 'error').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    
    if (errors === 0 && warnings === 0) {
      return {
        healthy: true,
        issues: 0,
        message: 'Système entièrement fonctionnel'
      };
    } else if (errors === 0) {
      return {
        healthy: true,
        issues: warnings,
        message: `Système fonctionnel avec ${warnings} avertissement(s)`
      };
    } else {
      return {
        healthy: false,
        issues: errors + warnings,
        message: `${errors} erreur(s) et ${warnings} avertissement(s) détectés`
      };
    }
  }
}

/**
 * Fonction utilitaire pour exécuter le diagnostic
 */
export async function runAuthDiagnostic(): Promise<DiagnosticResult[]> {
  const diagnostic = new AuthDiagnostic();
  return await diagnostic.runAllDiagnostics();
}

export default AuthDiagnostic;

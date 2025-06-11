
import { supabase } from '@/integrations/supabase/client';
import type { PricingCalculationRequest, PricingCalculationResponse, PriceCalculation } from '@/types/pricing';

export class PricingCalculationService {
  /**
   * Calcule le prix d'un produit basé sur les critères utilisateur
   */
  static async calculatePrice(request: PricingCalculationRequest): Promise<PricingCalculationResponse> {
    try {
      // 1. Vérifier d'abord le cache
      const cachedResult = await this.getCachedCalculation(request.productId, request.userCriteria);
      if (cachedResult) {
        return {
          success: true,
          price: cachedResult.calculated_price || undefined,
          currency: cachedResult.currency || 'XOF',
          details: cachedResult.calculation_details || {},
          calculationId: cachedResult.id
        };
      }

      // 2. Appeler l'edge function pour le calcul
      const { data, error } = await supabase.functions.invoke('calculate-insurance-price', {
        body: request
      });

      if (error) {
        console.error('Error calculating price:', error);
        return {
          success: false,
          error: error.message || 'Erreur lors du calcul du prix'
        };
      }

      // 3. Mettre en cache le résultat
      if (data.success && data.price) {
        await this.cacheCalculation(request.productId, request.userCriteria, data);
      }

      return data;
    } catch (error) {
      console.error('Pricing calculation error:', error);
      return {
        success: false,
        error: 'Erreur technique lors du calcul'
      };
    }
  }

  /**
   * Récupère un calcul en cache s'il existe et n'est pas expiré
   */
  private static async getCachedCalculation(
    productId: string, 
    userCriteria: Record<string, any>
  ): Promise<PriceCalculation | null> {
    try {
      const { data, error } = await supabase
        .from('price_calculations')
        .select('*')
        .eq('product_id', productId)
        .contains('user_criteria', userCriteria)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching cached calculation:', error);
        return null;
      }

      if (data) {
        return {
          ...data,
          user_criteria: data.user_criteria as Record<string, any>,
          calculation_details: data.calculation_details as Record<string, any>
        };
      }

      return null;
    } catch (error) {
      console.error('Cache lookup error:', error);
      return null;
    }
  }

  /**
   * Met en cache un résultat de calcul
   */
  private static async cacheCalculation(
    productId: string,
    userCriteria: Record<string, any>,
    result: PricingCalculationResponse
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('price_calculations')
        .insert({
          product_id: productId,
          user_criteria: userCriteria,
          calculated_price: result.price,
          currency: result.currency || 'XOF',
          calculation_details: result.details || {},
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 heure
        });

      if (error) {
        console.error('Error caching calculation:', error);
      }
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  }

  /**
   * Nettoie les calculs expirés
   */
  static async cleanupExpiredCalculations(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('cleanup_expired_calculations');
      
      if (error) {
        console.error('Error cleaning up calculations:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Cleanup error:', error);
      return 0;
    }
  }
}

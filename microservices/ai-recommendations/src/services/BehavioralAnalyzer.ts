
import { executeQuery } from '../config/database';
import { logger } from '../utils/logger';
import { setCache, getCache } from '../config/redis';

export interface BehavioralPattern {
  userId: string;
  insuranceType: string;
  interactionPatterns: {
    preferredTime: string;
    sessionDuration: number;
    clickThroughRate: number;
    conversionRate: number;
  };
  preferences: {
    priceRange: string;
    riskTolerance: string;
    companyPreferences: string[];
  };
  confidence: number;
}

export class BehavioralAnalyzer {
  static async analyzeUserBehavior(userId: string): Promise<BehavioralPattern | null> {
    try {
      const cacheKey = `behavior:${userId}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      // Analyze user interactions
      const interactionQuery = `
        SELECT 
          insurance_type,
          interaction_type,
          COUNT(*) as count,
          AVG(duration_seconds) as avg_duration,
          DATE_PART('hour', created_at) as hour_of_day
        FROM user_interactions 
        WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY insurance_type, interaction_type, hour_of_day
        ORDER BY count DESC
      `;
      
      const interactionResult = await executeQuery(interactionQuery, [userId]);
      
      if (!interactionResult.rows.length) {
        return null;
      }

      // Get user preferences
      const preferencesQuery = `
        SELECT insurance_type, budget_range, risk_tolerance, coverage_priorities
        FROM user_preferences 
        WHERE user_id = $1
      `;
      
      const preferencesResult = await executeQuery(preferencesQuery, [userId]);
      
      // Calculate behavioral patterns
      const patterns = this.calculatePatterns(interactionResult.rows, preferencesResult.rows);
      
      // Cache for 1 hour
      await setCache(cacheKey, patterns, 3600);
      
      return patterns;
    } catch (error) {
      logger.error('Error analyzing user behavior:', error);
      return null;
    }
  }

  private static calculatePatterns(interactions: any[], preferences: any[]): BehavioralPattern {
    const totalInteractions = interactions.reduce((sum, i) => sum + parseInt(i.count), 0);
    const avgDuration = interactions.reduce((sum, i) => sum + parseFloat(i.avg_duration || 0), 0) / interactions.length;
    
    // Determine preferred time (most active hour)
    const hourCounts = interactions.reduce((acc, i) => {
      const hour = parseInt(i.hour_of_day);
      acc[hour] = (acc[hour] || 0) + parseInt(i.count);
      return acc;
    }, {});
    
    const preferredHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b
    );
    
    // Calculate engagement metrics
    const clickThroughRate = this.calculateCTR(interactions);
    const conversionRate = this.calculateConversionRate(interactions);
    
    const primaryInsuranceType = interactions[0]?.insurance_type || 'auto';
    const userPrefs = preferences.find(p => p.insurance_type === primaryInsuranceType) || {};
    
    return {
      userId: interactions[0]?.user_id,
      insuranceType: primaryInsuranceType,
      interactionPatterns: {
        preferredTime: this.getTimeSlot(parseInt(preferredHour)),
        sessionDuration: avgDuration,
        clickThroughRate,
        conversionRate
      },
      preferences: {
        priceRange: userPrefs.budget_range || 'medium',
        riskTolerance: userPrefs.risk_tolerance || 'moderate',
        companyPreferences: userPrefs.coverage_priorities || []
      },
      confidence: Math.min(totalInteractions / 10, 1) // Max confidence at 10+ interactions
    };
  }

  private static calculateCTR(interactions: any[]): number {
    const views = interactions.filter(i => i.interaction_type === 'view').reduce((sum, i) => sum + parseInt(i.count), 0);
    const clicks = interactions.filter(i => i.interaction_type === 'click').reduce((sum, i) => sum + parseInt(i.count), 0);
    return views > 0 ? clicks / views : 0;
  }

  private static calculateConversionRate(interactions: any[]): number {
    const clicks = interactions.filter(i => i.interaction_type === 'click').reduce((sum, i) => sum + parseInt(i.count), 0);
    const conversions = interactions.filter(i => i.interaction_type === 'quote_request').reduce((sum, i) => sum + parseInt(i.count), 0);
    return clicks > 0 ? conversions / clicks : 0;
  }

  private static getTimeSlot(hour: number): string {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }
}

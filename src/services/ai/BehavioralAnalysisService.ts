
import { BehavioralPattern, ContextualFactors } from '@/types/AdvancedAI';

export class BehavioralAnalysisService {
  private static instance: BehavioralAnalysisService;

  static getInstance(): BehavioralAnalysisService {
    if (!BehavioralAnalysisService.instance) {
      BehavioralAnalysisService.instance = new BehavioralAnalysisService();
    }
    return BehavioralAnalysisService.instance;
  }

  async analyzeUserBehavior(userId: string, interactions: any[]): Promise<BehavioralPattern> {
    const sequences = this.extractInteractionSequences(interactions);
    const userSegment = this.determineUserSegment(interactions);
    const conversionProb = this.calculateConversionProbability(interactions);
    const preferences = this.extractBehavioralPreferences(interactions);
    const timingPatterns = this.analyzeTimingPatterns(interactions);

    return {
      pattern_id: `${userId}_${Date.now()}`,
      user_segment: userSegment,
      interaction_sequence: sequences,
      conversion_probability: conversionProb,
      preferred_features: preferences,
      timing_patterns: timingPatterns
    };
  }

  async getContextualFactors(userId: string, userProfile: any): Promise<ContextualFactors> {
    const geographic = await this.getGeographicContext(userProfile.country);
    const temporal = this.getTemporalContext();
    const economic = this.getEconomicContext(userProfile);

    return {
      geographic,
      temporal,
      economic
    };
  }

  async predictUserIntent(interactions: any[]): Promise<string[]> {
    const recentInteractions = interactions.slice(0, 10);
    const intents: string[] = [];

    // Analyser les patterns de navigation
    const navigationPattern = this.analyzeNavigationPattern(recentInteractions);
    intents.push(navigationPattern);

    // Analyser la vitesse d'interaction
    const engagementLevel = this.analyzeEngagementLevel(recentInteractions);
    intents.push(engagementLevel);

    // Analyser les types de produits consultés
    const productInterests = this.analyzeProductInterests(recentInteractions);
    intents.push(...productInterests);

    return intents;
  }

  private extractInteractionSequences(interactions: any[]): string[] {
    return interactions
      .slice(0, 20)
      .map(i => `${i.interaction_type}_${i.product_type || 'unknown'}`)
      .filter(Boolean);
  }

  private determineUserSegment(interactions: any[]): string {
    const viewCount = interactions.filter(i => i.interaction_type === 'view').length;
    const compareCount = interactions.filter(i => i.interaction_type === 'compare').length;
    const clickCount = interactions.filter(i => i.interaction_type === 'click').length;

    if (compareCount > 5) return 'analytical_buyer';
    if (viewCount > 20 && clickCount < 2) return 'browser';
    if (clickCount > viewCount * 0.3) return 'quick_decision_maker';
    return 'standard_user';
  }

  private calculateConversionProbability(interactions: any[]): number {
    const totalInteractions = interactions.length;
    if (totalInteractions === 0) return 0.1;

    const engagementScore = this.calculateEngagementScore(interactions);
    const recencyScore = this.calculateRecencyScore(interactions);
    const diversityScore = this.calculateDiversityScore(interactions);

    return Math.min(0.95, (engagementScore * 0.5 + recencyScore * 0.3 + diversityScore * 0.2));
  }

  private calculateEngagementScore(interactions: any[]): number {
    const avgDuration = interactions
      .filter(i => i.duration_seconds)
      .reduce((sum, i) => sum + i.duration_seconds, 0) / interactions.length;
    
    return Math.min(1, avgDuration / 300); // Normaliser à 5 minutes max
  }

  private calculateRecencyScore(interactions: any[]): number {
    if (interactions.length === 0) return 0;

    const lastInteraction = new Date(interactions[0].created_at);
    const hoursSinceLastInteraction = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60);
    
    return Math.max(0, 1 - hoursSinceLastInteraction / 168); // Décroissance sur 7 jours
  }

  private calculateDiversityScore(interactions: any[]): number {
    const uniqueProducts = new Set(interactions.map(i => i.product_id)).size;
    const uniqueTypes = new Set(interactions.map(i => i.interaction_type)).size;
    
    return Math.min(1, (uniqueProducts * 0.1 + uniqueTypes * 0.2));
  }

  private extractBehavioralPreferences(interactions: any[]): string[] {
    const featureFrequency = new Map<string, number>();
    
    interactions.forEach(interaction => {
      if (interaction.metadata?.features_viewed) {
        // Convertir en array si nécessaire et vérifier que c'est bien un array
        const featuresViewed = Array.isArray(interaction.metadata.features_viewed) 
          ? interaction.metadata.features_viewed 
          : [interaction.metadata.features_viewed];
        
        featuresViewed.forEach((feature: string) => {
          featureFrequency.set(feature, (featureFrequency.get(feature) || 0) + 1);
        });
      }
    });

    return Array.from(featureFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feature]) => feature);
  }

  private analyzeTimingPatterns(interactions: any[]): any {
    const hours = interactions.map(i => new Date(i.created_at).getHours());
    const days = interactions.map(i => new Date(i.created_at).getDay());
    
    const peakHours = this.findPeakHours(hours);
    const seasonalTrends = this.analyzeSeasonalTrends(interactions);

    return {
      peak_hours: peakHours,
      seasonal_trends: seasonalTrends
    };
  }

  private findPeakHours(hours: number[]): number[] {
    const hourFrequency = new Array(24).fill(0);
    hours.forEach(hour => hourFrequency[hour]++);
    
    const avgFrequency = hourFrequency.reduce((sum, freq) => sum + freq, 0) / 24;
    
    return hourFrequency
      .map((freq, hour) => ({ hour, freq }))
      .filter(({ freq }) => freq > avgFrequency)
      .map(({ hour }) => hour);
  }

  private analyzeSeasonalTrends(interactions: any[]): string[] {
    const months = interactions.map(i => new Date(i.created_at).getMonth());
    const seasonCounts = { winter: 0, spring: 0, summer: 0, autumn: 0 };
    
    months.forEach(month => {
      if (month < 3 || month === 11) seasonCounts.winter++;
      else if (month < 6) seasonCounts.spring++;
      else if (month < 9) seasonCounts.summer++;
      else seasonCounts.autumn++;
    });

    return Object.entries(seasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([season]) => season);
  }

  private analyzeNavigationPattern(interactions: any[]): string {
    const pageSequence = interactions.map(i => i.page_type || 'unknown').slice(0, 5);
    
    if (pageSequence.includes('comparison') && pageSequence.includes('product_detail')) {
      return 'research_focused';
    }
    if (pageSequence.filter(p => p === 'product_list').length > 2) {
      return 'browsing_heavy';
    }
    return 'goal_oriented';
  }

  private analyzeEngagementLevel(interactions: any[]): string {
    const avgDuration = interactions
      .filter(i => i.duration_seconds)
      .reduce((sum, i) => sum + i.duration_seconds, 0) / interactions.length;
    
    if (avgDuration > 180) return 'high_engagement';
    if (avgDuration > 60) return 'medium_engagement';
    return 'low_engagement';
  }

  private analyzeProductInterests(interactions: any[]): string[] {
    const productTypes = interactions
      .map(i => i.product_type)
      .filter(Boolean);
    
    const typeFrequency = new Map<string, number>();
    productTypes.forEach(type => {
      typeFrequency.set(type, (typeFrequency.get(type) || 0) + 1);
    });
    
    return Array.from(typeFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => `interested_in_${type}`);
  }

  private async getGeographicContext(country: string): Promise<any> {
    // Simulation de contexte géographique
    const marketData = {
      'france': { market_maturity: 0.9, local_preferences: ['premium_brands', 'eco_friendly'] },
      'senegal': { market_maturity: 0.6, local_preferences: ['affordable', 'local_support'] },
      'cote_divoire': { market_maturity: 0.5, local_preferences: ['mobile_friendly', 'simple_process'] }
    };
    
    return {
      country,
      region: 'africa', // Simplification
      ...marketData[country as keyof typeof marketData] || { market_maturity: 0.5, local_preferences: [] }
    };
  }

  private getTemporalContext(): any {
    const now = new Date();
    const seasons = ['winter', 'spring', 'summer', 'autumn'];
    const season = seasons[Math.floor((now.getMonth() + 1) / 3) % 4];
    
    return {
      time_of_day: now.getHours(),
      day_of_week: now.getDay(),
      season,
      market_events: this.getCurrentMarketEvents()
    };
  }

  private getCurrentMarketEvents(): string[] {
    // Simulation d'événements de marché
    const events = ['end_of_year_promotions', 'new_regulations', 'economic_recovery'];
    return events.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private getEconomicContext(userProfile: any): any {
    return {
      price_sensitivity: this.calculatePriceSensitivity(userProfile),
      budget_category: userProfile.budget_range || 'medium',
      market_conditions: 'stable' // Simplification
    };
  }

  private calculatePriceSensitivity(userProfile: any): number {
    const budgetMap = { 'low': 0.9, 'medium': 0.5, 'high': 0.2 };
    return budgetMap[userProfile.budget_range as keyof typeof budgetMap] || 0.5;
  }
}


export class EmbeddingService {
  private static instance: EmbeddingService;
  private embeddingCache = new Map<string, number[]>();

  static getInstance(): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
    }
    return EmbeddingService.instance;
  }

  async generateProductEmbedding(product: any): Promise<number[]> {
    const cacheKey = `product_${product.id}`;
    
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey)!;
    }

    // Créer une représentation textuelle du produit
    const productText = this.createProductDescription(product);
    
    // Simulation d'embeddings (en production, utiliser un service comme OpenAI ou Hugging Face)
    const embedding = await this.computeEmbedding(productText);
    
    this.embeddingCache.set(cacheKey, embedding);
    return embedding;
  }

  async generateUserEmbedding(userProfile: any, interactions: any[]): Promise<number[]> {
    const preferences = this.extractUserPreferences(userProfile, interactions);
    const userText = this.createUserDescription(preferences);
    
    return await this.computeEmbedding(userText);
  }

  async calculateSimilarity(embedding1: number[], embedding2: number[]): Promise<number> {
    // Calcul de similarité cosinus
    const dotProduct = embedding1.reduce((sum, a, i) => sum + a * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, a) => sum + a * a, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, a) => sum + a * a, 0));
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  private createProductDescription(product: any): string {
    return [
      product.name,
      product.brand,
      product.description,
      product.category,
      `Prix: ${product.price} ${product.currency}`,
      ...(product.features || [])
    ].filter(Boolean).join(' ');
  }

  private createUserDescription(preferences: any): string {
    return [
      `Budget: ${preferences.budget_range}`,
      `Tolérance au risque: ${preferences.risk_tolerance}`,
      `Type d'assurance: ${preferences.insurance_type}`,
      ...(preferences.preferred_features || []),
      ...(preferences.interaction_patterns || [])
    ].filter(Boolean).join(' ');
  }

  private extractUserPreferences(userProfile: any, interactions: any[]): any {
    const recentInteractions = interactions.slice(0, 50);
    const interactionPatterns = this.analyzeInteractionPatterns(recentInteractions);
    
    return {
      budget_range: userProfile.budget_range,
      risk_tolerance: userProfile.risk_tolerance,
      insurance_type: userProfile.insurance_type,
      preferred_features: this.extractPreferredFeatures(recentInteractions),
      interaction_patterns: interactionPatterns
    };
  }

  private analyzeInteractionPatterns(interactions: any[]): string[] {
    const patterns = [];
    
    // Analyser les patterns temporels
    const timePatterns = this.analyzeTimePatterns(interactions);
    patterns.push(...timePatterns);
    
    // Analyser les patterns de prix
    const pricePatterns = this.analyzePricePatterns(interactions);
    patterns.push(...pricePatterns);
    
    return patterns;
  }

  private analyzeTimePatterns(interactions: any[]): string[] {
    // Simulation d'analyse des patterns temporels
    const hours = interactions.map(i => new Date(i.created_at).getHours());
    const avgHour = hours.reduce((sum, h) => sum + h, 0) / hours.length;
    
    if (avgHour < 12) return ['morning_user'];
    if (avgHour < 18) return ['afternoon_user'];
    return ['evening_user'];
  }

  private analyzePricePatterns(interactions: any[]): string[] {
    // Simulation d'analyse des patterns de prix
    const prices = interactions
      .filter(i => i.product?.price)
      .map(i => i.product.price);
    
    if (prices.length === 0) return [];
    
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    
    if (avgPrice < 500) return ['budget_conscious'];
    if (avgPrice > 2000) return ['premium_seeker'];
    return ['mid_range_buyer'];
  }

  private extractPreferredFeatures(interactions: any[]): string[] {
    // Extraire les caractéristiques des produits avec lesquels l'utilisateur a interagi
    const features = new Set<string>();
    
    interactions.forEach(interaction => {
      if (interaction.product?.features) {
        interaction.product.features.forEach((feature: string) => features.add(feature));
      }
    });
    
    return Array.from(features);
  }

  private async computeEmbedding(text: string): Promise<number[]> {
    // Simulation d'un embedding (384 dimensions comme sentence-transformers)
    // En production, utiliser un vrai service d'embeddings
    const hash = this.simpleHash(text);
    const embedding = [];
    
    for (let i = 0; i < 384; i++) {
      embedding.push(Math.sin(hash + i) * 0.5);
    }
    
    // Normaliser le vecteur
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}

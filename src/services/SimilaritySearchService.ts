
import { supabase } from '@/integrations/supabase/client';
import { SearchResult } from './SearchService';

export interface SimilarityScore {
  productId: string;
  score: number;
  reasons: string[];
}

export interface ProductEmbedding {
  id: string;
  product_id: string;
  features_vector: number[];
  price_category: string;
  sector: string;
  metadata: Record<string, any>;
}

export class SimilaritySearchService {
  // Calculer la similarité entre produits basée sur leurs caractéristiques
  static calculateSimilarity(product1: any, product2: any): number {
    let score = 0;
    let factors = 0;

    // Similarité de prix (30%)
    if (product1.price && product2.price) {
      const priceDiff = Math.abs(product1.price - product2.price);
      const avgPrice = (product1.price + product2.price) / 2;
      const priceScore = Math.max(0, 1 - (priceDiff / avgPrice));
      score += priceScore * 0.3;
      factors += 0.3;
    }

    // Similarité de secteur (25%)
    if (product1.sector === product2.sector) {
      score += 0.25;
    }
    factors += 0.25;

    // Similarité de marque (20%)
    if (product1.brand && product2.brand && product1.brand === product2.brand) {
      score += 0.2;
    }
    factors += 0.2;

    // Similarité de pays (15%)
    if (product1.country === product2.country) {
      score += 0.15;
    }
    factors += 0.15;

    // Similarité de type (10%)
    if (product1.product_type_id === product2.product_type_id) {
      score += 0.1;
    }
    factors += 0.1;

    return factors > 0 ? score / factors : 0;
  }

  // Trouver des produits similaires à un produit donné
  static async findSimilarProducts(
    productId: string, 
    limit: number = 5,
    sector?: string
  ): Promise<SearchResult[]> {
    try {
      // Récupérer le produit de référence
      const { data: referenceProduct, error: refError } = await supabase
        .from('products')
        .select(`
          *,
          companies (name, logo_url, is_partner),
          product_types (name, sectors (name, slug)),
          reviews (rating)
        `)
        .eq('id', productId)
        .single();

      if (refError || !referenceProduct) {
        console.error('Reference product not found:', refError);
        return [];
      }

      // Construire la requête pour des produits similaires
      let query = supabase
        .from('products')
        .select(`
          *,
          companies (name, logo_url, is_partner),
          product_types (name, sectors (name, slug)),
          reviews (rating)
        `)
        .neq('id', productId)
        .eq('is_active', true);

      // Filtrer par secteur si spécifié
      if (sector) {
        query = query.eq('product_types.sectors.slug', sector);
      } else if (referenceProduct.product_types?.sectors?.slug) {
        query = query.eq('product_types.sectors.slug', referenceProduct.product_types.sectors.slug);
      }

      // Filtrer par fourchette de prix (±50%)
      if (referenceProduct.price) {
        const minPrice = referenceProduct.price * 0.5;
        const maxPrice = referenceProduct.price * 1.5;
        query = query.gte('price', minPrice).lte('price', maxPrice);
      }

      const { data: candidateProducts, error } = await query.limit(limit * 3); // Plus de candidats pour filtrer

      if (error) {
        console.error('Error fetching candidate products:', error);
        return [];
      }

      if (!candidateProducts) return [];

      // Calculer les scores de similarité
      const scoredProducts = candidateProducts
        .map(product => ({
          product,
          score: this.calculateSimilarity(referenceProduct, product)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // Transformer en SearchResult
      return scoredProducts.map(({ product }) => this.transformToSearchResult(product));

    } catch (error) {
      console.error('Similarity search error:', error);
      return [];
    }
  }

  // Recommandations basées sur l'historique utilisateur
  static async getPersonalizedRecommendations(
    userId: string,
    limit: number = 10,
    sector?: string
  ): Promise<SearchResult[]> {
    try {
      // Récupérer l'historique d'interactions de l'utilisateur
      const { data: interactions } = await supabase
        .from('user_interactions')
        .select('product_id, interaction_type, metadata')
        .eq('user_id', userId)
        .in('interaction_type', ['view', 'compare', 'favorite'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (!interactions || interactions.length === 0) {
        // Fallback: recommandations populaires
        return this.getPopularRecommendations(limit, sector);
      }

      // Analyser les préférences utilisateur
      const viewedProducts = interactions
        .filter(i => i.product_id)
        .map(i => i.product_id);

      if (viewedProducts.length === 0) {
        return this.getPopularRecommendations(limit, sector);
      }

      // Trouver des produits similaires aux produits vus
      const recommendations = new Map<string, SearchResult>();
      
      for (const productId of viewedProducts.slice(0, 5)) { // Top 5 produits vus
        const similar = await this.findSimilarProducts(productId, 3, sector);
        similar.forEach(product => {
          if (!recommendations.has(product.id)) {
            recommendations.set(product.id, product);
          }
        });
      }

      return Array.from(recommendations.values()).slice(0, limit);

    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return this.getPopularRecommendations(limit, sector);
    }
  }

  // Recommandations populaires (fallback)
  static async getPopularRecommendations(
    limit: number = 10,
    sector?: string
  ): Promise<SearchResult[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          companies (name, logo_url, is_partner),
          product_types (name, sectors (name, slug)),
          reviews (rating)
        `)
        .eq('is_active', true);

      if (sector) {
        query = query.eq('product_types.sectors.slug', sector);
      }

      const { data: products } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      return (products || []).map(product => this.transformToSearchResult(product));

    } catch (error) {
      console.error('Popular recommendations error:', error);
      return [];
    }
  }

  // Transformer un produit en SearchResult
  private static transformToSearchResult(product: any): SearchResult {
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
      : 0;

    return {
      id: product.id,
      name: product.name,
      category: product.product_types?.name || 'N/A',
      price: product.price || 0,
      currency: product.currency || 'XOF',
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
      availability: 'available' as const,
      location: product.country,
      brand: product.brand || 'N/A',
      image: product.image_url,
      features: [],
      deliveryTime: '2-3 jours',
      warranty: '1 an',
      provider: {
        name: product.companies?.name || 'N/A',
        logo: product.companies?.logo_url,
        verified: product.companies?.is_partner || false
      },
      sector: product.product_types?.sectors?.name,
      country: product.country
    };
  }
}

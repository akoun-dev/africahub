
import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  priceRange: [number, number];
  rating: number;
  location: string;
  availability: string;
  brands: string[];
  features: string[];
  warranty: string;
  deliveryTime: string;
  sectors: string[];
  countries: string[];
}

export interface SearchCriteria {
  query: string;
  category: string;
  sortBy: 'price' | 'rating' | 'popularity' | 'newest';
  sortOrder: 'asc' | 'desc';
  filters: SearchFilters;
  [key: string]: any; // Add index signature for Json compatibility
}

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  availability: 'available' | 'limited' | 'out_of_stock' | 'pre-order';
  location: string;
  brand: string;
  image?: string;
  features: string[];
  deliveryTime?: string;
  warranty?: string;
  provider: {
    name: string;
    logo?: string;
    verified: boolean;
  };
  sector?: string;
  country: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  searchTime: number;
  suggestions: string[];
  facets: {
    brands: { name: string; count: number }[];
    sectors: { name: string; count: number }[];
    priceRanges: { range: string; count: number }[];
    locations: { name: string; count: number }[];
  };
}

export class SearchService {
  private static readonly RESULTS_PER_PAGE = 10;

  // Recherche principale avec full-text search
  static async search(
    criteria: SearchCriteria,
    page: number = 1,
    limit: number = this.RESULTS_PER_PAGE
  ): Promise<SearchResponse> {
    const startTime = Date.now();
    const offset = (page - 1) * limit;

    try {
      // Construction de la requête de base
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          currency,
          image_url,
          brand,
          country,
          country_availability,
          is_active,
          created_at,
          companies (
            id,
            name,
            logo_url,
            is_partner
          ),
          product_types (
            id,
            name,
            sectors (
              id,
              name,
              slug
            )
          ),
          reviews (
            rating
          )
        `)
        .eq('is_active', true);

      // Recherche textuelle
      if (criteria.query) {
        query = query.or(`name.ilike.%${criteria.query}%, description.ilike.%${criteria.query}%`);
      }

      // Filtres par secteur/catégorie
      if (criteria.category) {
        query = query.eq('product_types.sectors.slug', criteria.category);
      }

      // Filtres de prix
      if (criteria.filters.priceRange[0] > 0) {
        query = query.gte('price', criteria.filters.priceRange[0]);
      }
      if (criteria.filters.priceRange[1] < 2000000) {
        query = query.lte('price', criteria.filters.priceRange[1]);
      }

      // Filtres par pays
      if (criteria.filters.countries.length > 0) {
        query = query.in('country', criteria.filters.countries);
      }

      // Filtres par marques
      if (criteria.filters.brands.length > 0) {
        query = query.in('brand', criteria.filters.brands);
      }

      // Filtres par localisation
      if (criteria.filters.location) {
        query = query.eq('country', criteria.filters.location);
      }

      // Tri
      switch (criteria.sortBy) {
        case 'price':
          query = query.order('price', { ascending: criteria.sortOrder === 'asc' });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      query = query.range(offset, offset + limit - 1);

      const { data: products, error, count } = await query;
      if (error) throw error;

      // Transformation des données
      const results = this.transformProducts(products || []);

      // Calcul des statistiques
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const searchTime = Date.now() - startTime;

      // Génération des suggestions et facettes
      const suggestions = await this.generateSuggestions(criteria.query);
      const facets = await this.generateFacets(criteria);

      return {
        results,
        totalCount,
        totalPages,
        currentPage: page,
        searchTime,
        suggestions,
        facets
      };

    } catch (error) {
      console.error('Search error:', error);
      return {
        results: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
        searchTime: Date.now() - startTime,
        suggestions: [],
        facets: {
          brands: [],
          sectors: [],
          priceRanges: [],
          locations: []
        }
      };
    }
  }

  // Recherche par similarité
  static async findSimilarProducts(productId: string, limit: number = 5): Promise<SearchResult[]> {
    try {
      // Récupérer le produit de référence
      const { data: referenceProduct } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!referenceProduct) return [];

      // Trouver des produits similaires basés sur la catégorie et le prix
      const { data: similarProducts } = await supabase
        .from('products')
        .select(`
          *,
          companies (name, logo_url, is_partner),
          product_types (name, sectors (name, slug)),
          reviews (rating)
        `)
        .eq('product_type_id', referenceProduct.product_type_id)
        .neq('id', productId)
        .gte('price', referenceProduct.price * 0.7)
        .lte('price', referenceProduct.price * 1.3)
        .eq('is_active', true)
        .limit(limit);

      return this.transformProducts(similarProducts || []);
    } catch (error) {
      console.error('Similar products search error:', error);
      return [];
    }
  }

  // Suggestions de recherche
  static async generateSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];

    try {
      const { data: products } = await supabase
        .from('products')
        .select('name')
        .ilike('name', `%${query}%`)
        .limit(5);

      const { data: companies } = await supabase
        .from('companies')
        .select('name')
        .ilike('name', `%${query}%`)
        .limit(3);

      const suggestions = [
        ...(products || []).map(p => p.name),
        ...(companies || []).map(c => c.name)
      ];

      return [...new Set(suggestions)].slice(0, 8);
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }

  // Génération des facettes pour les filtres
  static async generateFacets(criteria: SearchCriteria) {
    try {
      // Marques populaires
      const { data: brandsData } = await supabase
        .from('products')
        .select('brand')
        .eq('is_active', true)
        .not('brand', 'is', null);

      const brandCounts = this.countOccurrences(brandsData?.map(p => p.brand) || []);
      const brands = Object.entries(brandCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Secteurs
      const { data: sectorsData } = await supabase
        .from('sectors')
        .select('name, slug')
        .eq('is_active', true);

      const sectors = (sectorsData || []).map(s => ({ name: s.name, count: 0 }));

      // Localisations
      const { data: locationsData } = await supabase
        .from('products')
        .select('country')
        .eq('is_active', true);

      const locationCounts = this.countOccurrences(locationsData?.map(p => p.country) || []);
      const locations = Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Gammes de prix
      const priceRanges = [
        { range: '0-50000', count: 0 },
        { range: '50000-100000', count: 0 },
        { range: '100000-200000', count: 0 },
        { range: '200000-500000', count: 0 },
        { range: '500000+', count: 0 }
      ];

      return {
        brands,
        sectors,
        priceRanges,
        locations
      };
    } catch (error) {
      console.error('Facets generation error:', error);
      return {
        brands: [],
        sectors: [],
        priceRanges: [],
        locations: []
      };
    }
  }

  // Sauvegarde d'une recherche
  static async saveSearch(userId: string, criteria: SearchCriteria, name: string) {
    try {
      // Convert SearchCriteria to a plain object for JSON compatibility
      const criteriaJson = JSON.parse(JSON.stringify(criteria));
      
      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: userId,
          name,
          criteria: criteriaJson,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save search error:', error);
      throw error;
    }
  }

  // Récupération des recherches sauvegardées
  static async getSavedSearches(userId: string) {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get saved searches error:', error);
      return [];
    }
  }

  // Utilitaires privées
  private static transformProducts(products: any[]): SearchResult[] {
    return products.map(product => {
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
    });
  }

  private static countOccurrences(array: string[]): Record<string, number> {
    return array.reduce((acc, item) => {
      if (item) {
        acc[item] = (acc[item] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }
}

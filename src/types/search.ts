
export interface SearchCriteria {
  query: string;
  category: string;
  sortBy: 'popularity' | 'price' | 'rating' | 'newest';
  sortOrder: 'asc' | 'desc';
  filters: SearchFilters;
}

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

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  availability: 'available' | 'out_of_stock' | 'limited' | 'pre-order';
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
  facets: SearchFacets;
}

export interface SearchFacets {
  brands: Array<{ name: string; count: number }>;
  sectors: Array<{ name: string; count: number }>;
  priceRanges: Array<{ min: number; max: number; count: number }>;
  locations: Array<{ name: string; count: number }>;
}

export interface SearchState {
  loading: boolean;
  results: SearchResult[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  searchTime: number;
  error: string | null;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalQueries: number;
  averageResponseTime: number;
}

export interface AnalyticsData {
  searchIntent: any;
  cacheMetrics: CacheMetrics;
  performanceScore: 'excellent' | 'good' | 'average' | 'poor';
}

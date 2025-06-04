
import { SearchResult } from './search';

export interface AIRecommendation {
  id: string;
  user_id: string;
  product_id: string;
  recommendation_score: number;
  reasoning?: string;
  insurance_type: string;
  created_at: string;
  products?: {
    name: string;
    brand: string;
    price: number;
    currency: string;
    description: string;
  };
  product: SearchResult;
  score: number;
  confidence: number;
  type: 'similar' | 'complementary' | 'popular' | 'personalized';
}

export interface RecommendationRequest {
  userId: string;
  insuranceType: string;
  preferences: any;
}

export interface PersonalizedInsights {
  top_categories: string[];
  preferred_price_range: { min: number; max: number };
  favorite_brands: string[];
  activity_score: number;
}

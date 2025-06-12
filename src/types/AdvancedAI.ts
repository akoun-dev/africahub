
export interface EmbeddingVector {
  id: string;
  vector: number[];
  metadata: {
    product_id: string;
    product_type: string;
    features: string[];
    semantic_tags: string[];
  };
}

export interface BehavioralPattern {
  pattern_id: string;
  user_segment: string;
  interaction_sequence: string[];
  conversion_probability: number;
  preferred_features: string[];
  timing_patterns: {
    peak_hours: number[];
    seasonal_trends: string[];
  };
}

export interface ContextualFactors {
  geographic: {
    country: string;
    region: string;
    market_maturity: number;
    local_preferences: string[];
  };
  temporal: {
    time_of_day: number;
    day_of_week: number;
    season: string;
    market_events: string[];
  };
  economic: {
    price_sensitivity: number;
    budget_category: string;
    market_conditions: string;
  };
}

export interface AdvancedRecommendationScore {
  overall_score: number;
  confidence_level: number;
  explanation: {
    primary_factors: string[];
    secondary_factors: string[];
    risk_factors: string[];
  };
  breakdown: {
    semantic_similarity: number;
    behavioral_match: number;
    contextual_relevance: number;
    market_trends: number;
  };
}

export interface RecommendationStream {
  id: string;
  recommendations: any[];
  metadata: {
    processing_time: number;
    algorithm_version: string;
    data_freshness: number;
  };
}

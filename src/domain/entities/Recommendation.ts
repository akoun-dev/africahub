
export interface Product {
  id: string;
  name: string;
  brand?: string;
  price?: number;
  currency?: string;
  description?: string;
}

export interface ReasoningDetails {
  mainFactors: string[];
  scoreBreakdown: {
    overall: number;
    [key: string]: number;
  };
}

export interface ContextFactors {
  locationMatch: boolean;
  behaviorSimilarity: number;
  contentRelevance: number;
}

export interface Recommendation {
  id: string;
  userId: string;
  productId: string;
  recommendationType: 'behavioral' | 'collaborative' | 'content' | 'hybrid';
  confidenceScore: number;
  reasoning: ReasoningDetails;
  contextFactors: ContextFactors;
  insuranceType: string;
  isViewed: boolean;
  isClicked: boolean;
  isPurchased: boolean;
  expiresAt: Date;
  createdAt: Date;
  product?: Product;
}

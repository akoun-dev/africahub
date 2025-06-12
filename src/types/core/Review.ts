
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string;
  comment?: string;
  photos: string[];
  helpful_count: number;
  unhelpful_count: number;
  is_reported: boolean;
  is_verified_purchase: boolean;
  status: 'active' | 'pending' | 'hidden' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface ReviewVote {
  id: string;
  user_id: string;
  review_id: string;
  vote_type: 'helpful' | 'unhelpful';
  created_at: string;
}

export interface ReviewReport {
  id: string;
  user_id: string;
  review_id: string;
  reason: 'spam' | 'inappropriate' | 'fake' | 'offensive' | 'other';
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface CreateReviewData {
  product_id: string;
  rating: number;
  title: string;
  comment?: string;
  photos?: string[];
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

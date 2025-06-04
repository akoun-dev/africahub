
export interface DailyStats {
  date: string;
  total_requests: number;
  unique_users: number;
  countries_served: number;
  avg_quote_amount: number;
}

export interface GeographicStats {
  country: string;
  total_requests: number;
  cities_served: number;
  completed_requests: number;
  avg_quote_amount: number;
}

export interface InsuranceTypeStats {
  insurance_type: string;
  total_requests: number;
  completed_requests: number;
  completion_rate: number;
  avg_quote_amount: number;
  total_value: number;
}

export interface QuoteAnalytics {
  date: string;
  insurance_type: string;
  country: string;
  status: string;
  total_requests: number;
  completed_requests: number;
  pending_requests: number;
  in_progress_requests: number;
  cancelled_requests: number;
  avg_quote_amount: number;
  total_quote_value: number;
}

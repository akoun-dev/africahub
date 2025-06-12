
export interface CountryMetric {
  country: string;
  code: string;
  flag: string;
  performance: number;
  users: number;
  revenue: number;
  growthRate: number;
  conversionRate: number;
  status: 'excellent' | 'good' | 'average' | 'critical';
  alerts: number;
}

export interface TotalStats {
  totalUsers: number;
  totalRevenue: number;
  avgPerformance: number;
  totalAlerts: number;
}

export interface CountryAnalyticsDashboardProps {
  selectedTimeframe?: string;
  selectedMetric?: string;
}


import { CountryMetric } from './types';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
    case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'average': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getPerformanceColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export const calculateTotalStats = (countryMetrics: CountryMetric[]) => {
  return {
    totalUsers: countryMetrics.reduce((sum, country) => sum + country.users, 0),
    totalRevenue: countryMetrics.reduce((sum, country) => sum + country.revenue, 0),
    avgPerformance: Math.round(countryMetrics.reduce((sum, country) => sum + country.performance, 0) / countryMetrics.length),
    totalAlerts: countryMetrics.reduce((sum, country) => sum + country.alerts, 0)
  };
};

export const mockCountryMetrics: CountryMetric[] = [
  {
    country: 'Nigeria',
    code: 'NG',
    flag: '🇳🇬',
    performance: 95,
    users: 15420,
    revenue: 45300,
    growthRate: 12.5,
    conversionRate: 3.2,
    status: 'excellent',
    alerts: 0
  },
  {
    country: 'Afrique du Sud',
    code: 'ZA',
    flag: '🇿🇦',
    performance: 92,
    users: 12100,
    revenue: 38200,
    growthRate: 8.7,
    conversionRate: 2.9,
    status: 'good',
    alerts: 1
  },
  {
    country: 'Kenya',
    code: 'KE',
    flag: '🇰🇪',
    performance: 88,
    users: 8930,
    revenue: 28900,
    growthRate: 15.2,
    conversionRate: 3.5,
    status: 'good',
    alerts: 0
  },
  {
    country: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    performance: 85,
    users: 6700,
    revenue: 19800,
    growthRate: 6.3,
    conversionRate: 2.1,
    status: 'average',
    alerts: 2
  },
  {
    country: 'Ghana',
    code: 'GH',
    flag: '🇬🇭',
    performance: 82,
    users: 5450,
    revenue: 16200,
    growthRate: 4.1,
    conversionRate: 1.8,
    status: 'average',
    alerts: 1
  },
  {
    country: 'Égypte',
    code: 'EG',
    flag: '🇪🇬',
    performance: 45,
    users: 9800,
    revenue: 15200,
    growthRate: -2.3,
    conversionRate: 1.2,
    status: 'critical',
    alerts: 5
  }
];

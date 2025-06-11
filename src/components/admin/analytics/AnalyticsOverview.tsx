
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyStats, useInsuranceTypeStats } from '@/hooks/useAnalytics';
import { TrendingUp, TrendingDown, Users, Globe, FileText, CheckCircle } from 'lucide-react';

interface AnalyticsOverviewProps {
  timeRange: number;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ timeRange }) => {
  const { data: dailyStats, isLoading: dailyLoading } = useDailyStats(timeRange);
  const { data: insuranceStats, isLoading: insuranceLoading } = useInsuranceTypeStats();

  if (dailyLoading || insuranceLoading) {
    return <div className="p-6">Chargement des statistiques...</div>;
  }

  // Calculate totals and trends
  const totalRequests = dailyStats?.reduce((sum, day) => sum + day.total_requests, 0) || 0;
  const totalUsers = dailyStats?.reduce((sum, day) => Math.max(sum, day.unique_users), 0) || 0;
  const avgQuoteAmount = dailyStats?.reduce((sum, day) => sum + (day.avg_quote_amount || 0), 0) / (dailyStats?.length || 1);
  const totalCompleted = insuranceStats?.reduce((sum, type) => sum + type.completed_requests, 0) || 0;
  const completionRate = totalRequests > 0 ? (totalCompleted / totalRequests) * 100 : 0;

  // Calculate trends (compare first half vs second half of period)
  const midPoint = Math.floor((dailyStats?.length || 0) / 2);
  const firstHalf = dailyStats?.slice(0, midPoint) || [];
  const secondHalf = dailyStats?.slice(midPoint) || [];
  
  const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.total_requests, 0) / (firstHalf.length || 1);
  const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.total_requests, 0) / (secondHalf.length || 1);
  const trend = secondHalfAvg > firstHalfAvg ? 'up' : 'down';
  const trendPercentage = firstHalfAvg > 0 ? Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0;

  const stats = [
    {
      title: "Total des demandes",
      value: totalRequests.toLocaleString(),
      description: `${timeRange} derniers jours`,
      icon: FileText,
      trend: trend,
      trendValue: `${trendPercentage.toFixed(1)}%`
    },
    {
      title: "Utilisateurs uniques",
      value: totalUsers.toLocaleString(),
      description: "Utilisateurs actifs",
      icon: Users,
      trend: 'up',
      trendValue: '+12%'
    },
    {
      title: "Montant moyen des devis",
      value: `€${avgQuoteAmount.toFixed(0)}`,
      description: "Par demande",
      icon: TrendingUp,
      trend: 'up',
      trendValue: '+8%'
    },
    {
      title: "Taux de conversion",
      value: `${completionRate.toFixed(1)}%`,
      description: "Devis complétés",
      icon: CheckCircle,
      trend: completionRate > 50 ? 'up' : 'down',
      trendValue: `${completionRate.toFixed(1)}%`
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendIcon className={`h-3 w-3 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.trendValue}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

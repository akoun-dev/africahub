
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useDailyStats, useQuoteAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsChartsProps {
  timeRange: number;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ timeRange }) => {
  const { data: dailyStats, isLoading: dailyLoading } = useDailyStats(timeRange);
  const { data: quoteAnalytics, isLoading: analyticsLoading } = useQuoteAnalytics(timeRange);

  if (dailyLoading || analyticsLoading) {
    return <div className="p-6">Chargement des graphiques...</div>;
  }

  // Prepare data for charts
  const dailyChartData = dailyStats?.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    requests: stat.total_requests,
    users: stat.unique_users,
    avgAmount: stat.avg_quote_amount || 0
  })) || [];

  // Aggregate status data by date
  const statusData = quoteAnalytics?.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = { date, pending: 0, in_progress: 0, completed: 0, cancelled: 0 };
    }
    acc[date].pending += item.pending_requests;
    acc[date].in_progress += item.in_progress_requests;
    acc[date].completed += item.completed_requests;
    acc[date].cancelled += item.cancelled_requests;
    return acc;
  }, {} as Record<string, any>) || {};

  const statusChartData = Object.values(statusData);

  const chartConfig = {
    requests: {
      label: "Demandes",
      color: "hsl(var(--chart-1))",
    },
    users: {
      label: "Utilisateurs",
      color: "hsl(var(--chart-2))",
    },
    pending: {
      label: "En attente",
      color: "hsl(var(--chart-3))",
    },
    in_progress: {
      label: "En cours",
      color: "hsl(var(--chart-4))",
    },
    completed: {
      label: "Terminé",
      color: "hsl(var(--chart-5))",
    },
    cancelled: {
      label: "Annulé",
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Évolution des demandes</CardTitle>
          <CardDescription>
            Nombre de demandes et d'utilisateurs par jour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={dailyChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="var(--color-requests)" 
                strokeWidth={2}
                name="Demandes"
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="var(--color-users)" 
                strokeWidth={2}
                name="Utilisateurs"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statuts des demandes</CardTitle>
          <CardDescription>
            Répartition des statuts par jour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={statusChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" name="En attente" />
              <Bar dataKey="in_progress" stackId="a" fill="var(--color-in_progress)" name="En cours" />
              <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" name="Terminé" />
              <Bar dataKey="cancelled" stackId="a" fill="var(--color-cancelled)" name="Annulé" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

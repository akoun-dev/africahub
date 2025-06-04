
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useInsuranceTypeStats } from '@/hooks/useAnalytics';
import { Car, Home, Heart, Shield } from 'lucide-react';

export const AnalyticsInsuranceTypes: React.FC = () => {
  const { data: insuranceStats, isLoading } = useInsuranceTypeStats();

  if (isLoading) {
    return <div className="p-6">Chargement des statistiques d'assurance...</div>;
  }

  const getInsuranceIcon = (type: string) => {
    switch (type) {
      case 'auto': return Car;
      case 'home': return Home;
      case 'health': return Heart;
      case 'micro': return Shield;
      default: return Shield;
    }
  };

  const getInsuranceLabel = (type: string) => {
    switch (type) {
      case 'auto': return 'Auto';
      case 'home': return 'Habitation';
      case 'health': return 'Santé';
      case 'micro': return 'Micro-assurance';
      default: return type;
    }
  };

  // Data for pie chart
  const pieData = insuranceStats?.map((stat, index) => ({
    name: getInsuranceLabel(stat.insurance_type),
    value: stat.total_requests,
    fill: `hsl(var(--chart-${index + 1}))`
  })) || [];

  // Data for completion rate chart
  const completionData = insuranceStats?.map(stat => ({
    type: getInsuranceLabel(stat.insurance_type),
    completion_rate: stat.completion_rate,
    total_requests: stat.total_requests
  })) || [];

  const chartConfig = {
    auto: { label: "Auto", color: "hsl(var(--chart-1))" },
    home: { label: "Habitation", color: "hsl(var(--chart-2))" },
    health: { label: "Santé", color: "hsl(var(--chart-3))" },
    micro: { label: "Micro-assurance", color: "hsl(var(--chart-4))" },
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des demandes</CardTitle>
            <CardDescription>
              Par type d'assurance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux de conversion</CardTitle>
            <CardDescription>
              Par type d'assurance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={completionData}>
                <XAxis dataKey="type" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completion_rate" fill="hsl(var(--chart-1))" name="Taux de conversion %" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {insuranceStats?.map((stat) => {
          const Icon = getInsuranceIcon(stat.insurance_type);
          
          return (
            <Card key={stat.insurance_type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {getInsuranceLabel(stat.insurance_type)}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.total_requests}</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Terminées:</span>
                    <Badge variant="secondary">{stat.completed_requests}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Taux:</span>
                    <Badge variant={stat.completion_rate > 50 ? "default" : "outline"}>
                      {stat.completion_rate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Valeur totale:</span>
                    <span>€{stat.total_value?.toFixed(0) || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Montant moyen:</span>
                    <span>€{stat.avg_quote_amount?.toFixed(0) || '0'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

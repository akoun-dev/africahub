
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useGeographicPerformance, useCountryConfigurations } from '@/hooks/useGeographicManagement';
import { TrendingUp, TrendingDown, MapPin, Users } from 'lucide-react';

export const GeographicDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const { data: performance, isLoading } = useGeographicPerformance(timeRange);
  const { data: countries } = useCountryConfigurations();

  if (isLoading) {
    return <div className="p-6">Chargement des données de performance...</div>;
  }

  // Agrégation des données par pays
  const performanceByCountry = performance?.reduce((acc, item) => {
    if (!acc[item.country_code]) {
      acc[item.country_code] = {
        country_code: item.country_code,
        total_requests: 0,
        completed_requests: 0,
        total_quote_amount: 0,
        conversion_rates: [],
        satisfaction_scores: []
      };
    }
    
    acc[item.country_code].total_requests += item.total_requests || 0;
    acc[item.country_code].completed_requests += item.completed_requests || 0;
    acc[item.country_code].total_quote_amount += item.average_quote_amount || 0;
    
    if (item.conversion_rate) {
      acc[item.country_code].conversion_rates.push(item.conversion_rate);
    }
    if (item.user_satisfaction_score) {
      acc[item.country_code].satisfaction_scores.push(item.user_satisfaction_score);
    }
    
    return acc;
  }, {} as any) || {};

  const chartData = Object.values(performanceByCountry).map((country: any) => ({
    country: country.country_code,
    requests: country.total_requests,
    completed: country.completed_requests,
    conversion_rate: country.conversion_rates.length > 0 
      ? country.conversion_rates.reduce((a: number, b: number) => a + b, 0) / country.conversion_rates.length
      : 0,
    satisfaction: country.satisfaction_scores.length > 0
      ? country.satisfaction_scores.reduce((a: number, b: number) => a + b, 0) / country.satisfaction_scores.length
      : 0
  }));

  const totalRequests = chartData.reduce((sum, item) => sum + item.requests, 0);
  const totalCompleted = chartData.reduce((sum, item) => sum + item.completed, 0);
  const avgConversion = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.conversion_rate, 0) / chartData.length 
    : 0;

  const chartConfig = {
    requests: {
      label: "Demandes totales",
      color: "hsl(var(--chart-1))",
    },
    completed: {
      label: "Demandes complétées",
      color: "hsl(var(--chart-2))",
    },
    conversion_rate: {
      label: "Taux de conversion",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Performance géographique</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 derniers jours</SelectItem>
            <SelectItem value="30">30 derniers jours</SelectItem>
            <SelectItem value="90">90 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Demandes totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Demandes complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +8% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taux de conversion moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversion.toFixed(1)}%</div>
            <div className="flex items-center gap-1 text-sm text-red-600">
              <TrendingDown className="h-3 w-3" />
              -3% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pays actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countries?.filter(c => c.is_active).length || 0}</div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              sur {countries?.length || 0} configurés
            </div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Demandes par pays</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                  <XAxis dataKey="country" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="requests" fill="var(--color-requests)" name="Demandes totales" />
                  <Bar dataKey="completed" fill="var(--color-completed)" name="Complétées" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Taux de conversion par pays</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                  <XAxis dataKey="country" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="conversion_rate" fill="var(--color-conversion_rate)" name="Taux de conversion %" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Détails par pays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((country) => {
              const countryConfig = countries?.find(c => c.country_code === country.country);
              return (
                <div key={country.country} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{countryConfig?.country_name || country.country}</span>
                      <Badge variant="outline">{country.country}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{country.requests}</div>
                      <div className="text-gray-500">Demandes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{country.completed}</div>
                      <div className="text-gray-500">Complétées</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{country.conversion_rate.toFixed(1)}%</div>
                      <div className="text-gray-500">Conversion</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{country.satisfaction.toFixed(1)}/5</div>
                      <div className="text-gray-500">Satisfaction</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

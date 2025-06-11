
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useGeographicStats } from '@/hooks/useAnalytics';
import { MapPin } from 'lucide-react';

export const AnalyticsGeography: React.FC = () => {
  const { data: geoStats, isLoading } = useGeographicStats();

  if (isLoading) {
    return <div className="p-6">Chargement des données géographiques...</div>;
  }

  const chartData = geoStats?.map(stat => ({
    country: stat.country,
    requests: stat.total_requests,
    completion_rate: (stat.completed_requests / stat.total_requests) * 100
  })) || [];

  const chartConfig = {
    requests: {
      label: "Demandes",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Répartition par pays</CardTitle>
          <CardDescription>
            Top 10 des pays par nombre de demandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} layout="horizontal">
              <XAxis type="number" />
              <YAxis dataKey="country" type="category" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="requests" fill="var(--color-requests)" name="Demandes" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Détails par pays</CardTitle>
          <CardDescription>
            Statistiques détaillées pour chaque pays
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pays</TableHead>
                <TableHead>Demandes</TableHead>
                <TableHead>Villes</TableHead>
                <TableHead>Taux réussite</TableHead>
                <TableHead>Montant moyen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {geoStats?.map((stat) => (
                <TableRow key={stat.country}>
                  <TableCell className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {stat.country}
                  </TableCell>
                  <TableCell>{stat.total_requests}</TableCell>
                  <TableCell>{stat.cities_served}</TableCell>
                  <TableCell>
                    <Badge variant={stat.completed_requests / stat.total_requests > 0.5 ? "default" : "secondary"}>
                      {((stat.completed_requests / stat.total_requests) * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    €{stat.avg_quote_amount?.toFixed(0) || '0'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSectors } from '@/hooks/useSectors';
import { useSectorQuoteStats, useSectorProductStats } from '@/hooks/useSectorStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, Users, DollarSign, FileText, Building2 } from 'lucide-react';

export const SectorAnalytics = () => {
  const { data: sectors } = useSectors();
  const [selectedSector, setSelectedSector] = useState<string>('all');
  
  const { data: quoteStats } = useSectorQuoteStats(selectedSector === 'all' ? undefined : selectedSector);
  const { data: productStats } = useSectorProductStats(selectedSector === 'all' ? undefined : selectedSector);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Prepare chart data
  const quoteStatsArray = Array.isArray(quoteStats) ? quoteStats : (quoteStats ? [quoteStats] : []);
  const productStatsArray = Array.isArray(productStats) ? productStats : (productStats ? [productStats] : []);

  const chartData = sectors?.map((sector, index) => {
    const sectorQuoteStats = quoteStatsArray.find(s => s.sector_slug === sector.slug);
    const sectorProductStats = productStatsArray.find(s => s.sector_slug === sector.slug);
    
    return {
      name: sector.name,
      quotes: sectorQuoteStats?.total_quotes || 0,
      revenue: sectorQuoteStats?.total_revenue || 0,
      products: sectorProductStats?.total_products || 0,
      companies: sectorProductStats?.companies_count || 0,
      color: COLORS[index % COLORS.length],
    };
  }) || [];

  const pieData = chartData.map(item => ({
    name: item.name,
    value: item.quotes,
    fill: item.color,
  }));

  const renderMetricCard = (title: string, value: number | string, icon: React.ReactNode, color: string) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full text-white`} style={{ backgroundColor: color }}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  // Calculate totals for selected sector or all sectors
  const totalQuotes = selectedSector === 'all' 
    ? quoteStatsArray.reduce((sum, s) => sum + s.total_quotes, 0)
    : (quoteStats as any)?.total_quotes || 0;

  const totalRevenue = selectedSector === 'all' 
    ? quoteStatsArray.reduce((sum, s) => sum + s.total_revenue, 0)
    : (quoteStats as any)?.total_revenue || 0;

  const totalProducts = selectedSector === 'all' 
    ? productStatsArray.reduce((sum, s) => sum + s.total_products, 0)
    : (productStats as any)?.total_products || 0;

  const totalCompanies = selectedSector === 'all' 
    ? productStatsArray.reduce((sum, s) => sum + s.companies_count, 0)
    : (productStats as any)?.companies_count || 0;

  const selectedSectorData = sectors?.find(s => s.slug === selectedSector);
  const themeColor = selectedSectorData?.color || '#3B82F6';

  return (
    <div className="space-y-6">
      {/* Sector Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord sectoriel</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Sélectionner un secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les secteurs</SelectItem>
              {sectors?.map(sector => (
                <SelectItem key={sector.id} value={sector.slug}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard(
          "Total Devis",
          totalQuotes,
          <FileText className="h-4 w-4" />,
          themeColor
        )}
        {renderMetricCard(
          "Revenus Totaux",
          `${totalRevenue.toLocaleString()} USD`,
          <DollarSign className="h-4 w-4" />,
          themeColor
        )}
        {renderMetricCard(
          "Produits",
          totalProducts,
          <Package className="h-4 w-4" />,
          themeColor
        )}
        {renderMetricCard(
          "Partenaires",
          totalCompanies,
          <Building2 className="h-4 w-4" />,
          themeColor
        )}
      </div>

      {/* Charts */}
      {selectedSector === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Quotes by Sector */}
          <Card>
            <CardHeader>
              <CardTitle>Devis par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quotes" fill={themeColor} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Quote Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des devis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Sector Stats */}
      {selectedSector !== 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des devis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Devis en attente</span>
                <Badge variant="secondary">
                  {(quoteStats as any)?.pending_quotes || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Devis complétés</span>
                <Badge variant="default" style={{ backgroundColor: themeColor }}>
                  {(quoteStats as any)?.completed_quotes || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Montant moyen</span>
                <Badge variant="outline">
                  {((quoteStats as any)?.avg_quote_amount || 0).toLocaleString()} USD
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques des produits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Produits actifs</span>
                <Badge variant="default" style={{ backgroundColor: themeColor }}>
                  {(productStats as any)?.active_products || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Produits total</span>
                <Badge variant="secondary">
                  {(productStats as any)?.total_products || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Partenaires uniques</span>
                <Badge variant="outline">
                  {(productStats as any)?.companies_count || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

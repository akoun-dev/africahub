
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSectorLLMAnalytics, useSectorProviderStatus } from '@/hooks/useMultiSectorLLM';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Zap, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Shield,
  Banknote,
  Home,
  Smartphone,
  Car
} from 'lucide-react';

type SectorType = 'assurance' | 'banque' | 'energie' | 'immobilier' | 'telecommunications' | 'transport';

const SECTOR_COLORS = {
  'assurance': '#3B82F6',
  'banque': '#10B981',
  'energie': '#F59E0B',
  'immobilier': '#8B5CF6',
  'telecommunications': '#EF4444',
  'transport': '#06B6D4'
};

const SECTOR_ICONS = {
  'assurance': Shield,
  'banque': Banknote,
  'energie': Zap,
  'immobilier': Home,
  'telecommunications': Smartphone,
  'transport': Car
};

const SECTOR_NAMES = {
  'assurance': 'Assurance',
  'banque': 'Banque',
  'energie': 'Énergie',
  'immobilier': 'Immobilier',
  'telecommunications': 'Télécoms',
  'transport': 'Transport'
};

export const SectorLLMDashboard: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<SectorType | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  
  const { data: sectorMetrics, isLoading } = useSectorLLMAnalytics(timeRange);
  const { data: providerStatus } = useSectorProviderStatus();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sectors = Object.keys(sectorMetrics || {}) as SectorType[];
  const selectedMetrics = selectedSector === 'all' ? sectorMetrics : 
    { [selectedSector]: sectorMetrics?.[selectedSector] };

  // Données pour les graphiques
  const chartData = sectors.map(sector => ({
    name: SECTOR_NAMES[sector],
    requests: sectorMetrics?.[sector]?.requests || 0,
    cost: sectorMetrics?.[sector]?.cost || 0,
    latency: sectorMetrics?.[sector]?.avgLatency || 0,
    successRate: sectorMetrics?.[sector]?.successRate || 0,
    color: SECTOR_COLORS[sector]
  }));

  const pieData = chartData.map(item => ({
    name: item.name,
    value: item.requests,
    fill: item.color
  }));

  // Calculs totaux
  const totalMetrics = sectors.reduce((acc, sector) => {
    const metrics = sectorMetrics?.[sector];
    if (metrics) {
      acc.requests += metrics.requests;
      acc.cost += metrics.cost;
      acc.tokens += metrics.tokens;
      acc.successRate += metrics.successRate * metrics.requests;
    }
    return acc;
  }, { requests: 0, cost: 0, tokens: 0, successRate: 0 });

  if (totalMetrics.requests > 0) {
    totalMetrics.successRate = totalMetrics.successRate / totalMetrics.requests;
  }

  const renderSectorCard = (sector: SectorType, metrics: any) => {
    const IconComponent = SECTOR_ICONS[sector];
    return (
      <Card key={sector}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <IconComponent className="h-4 w-4" style={{ color: SECTOR_COLORS[sector] }} />
            {SECTOR_NAMES[sector]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Requêtes</span>
            <Badge variant="outline">{metrics.requests}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Coût</span>
            <Badge variant="secondary">${metrics.cost.toFixed(4)}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Latence moy.</span>
            <Badge variant="outline">{Math.round(metrics.avgLatency)}ms</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Succès</span>
            <Badge 
              variant={metrics.successRate > 95 ? "default" : "destructive"}
              style={{ 
                backgroundColor: metrics.successRate > 95 ? SECTOR_COLORS[sector] : undefined 
              }}
            >
              {metrics.successRate.toFixed(1)}%
            </Badge>
          </div>
          <div className="text-xs text-gray-500">
            Providers: {metrics.providersUsed?.join(', ') || 'N/A'}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4">
        <Select value={selectedSector} onValueChange={(value) => setSelectedSector(value as SectorType | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sélectionner un secteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les secteurs</SelectItem>
            {sectors.map(sector => (
              <SelectItem key={sector} value={sector}>
                {SECTOR_NAMES[sector]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as '1h' | '24h' | '7d')}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 heure</SelectItem>
            <SelectItem value="24h">24 heures</SelectItem>
            <SelectItem value="7d">7 jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Global Metrics */}
      {selectedSector === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requêtes</p>
                  <p className="text-2xl font-bold">{totalMetrics.requests}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Coût Total</p>
                  <p className="text-2xl font-bold">${totalMetrics.cost.toFixed(4)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tokens Totaux</p>
                  <p className="text-2xl font-bold">{totalMetrics.tokens.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de Succès</p>
                  <p className="text-2xl font-bold">{totalMetrics.successRate.toFixed(1)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sector Cards */}
      {selectedSector === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map(sector => 
            sectorMetrics?.[sector] ? renderSectorCard(sector, sectorMetrics[sector]) : null
          )}
        </div>
      ) : (
        selectedMetrics?.[selectedSector] && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSectorCard(selectedSector, selectedMetrics[selectedSector])}
          </div>
        )
      )}

      {/* Charts */}
      {selectedSector === 'all' && chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Requêtes par Secteur</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribution par Secteur</CardTitle>
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

      {/* Provider Status */}
      {providerStatus?.providers && (
        <Card>
          <CardHeader>
            <CardTitle>Status des Providers LLM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(providerStatus.providers).map(([name, status]: [string, any]) => (
                <div key={name} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{name}</span>
                    <Badge variant={status.available ? "default" : "destructive"}>
                      {status.available ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Latence: {status.latency || 'N/A'}ms</div>
                    <div>Coût: ${status.cost_per_1m || 'N/A'}/1M tokens</div>
                    <div>Modèle: {status.model || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

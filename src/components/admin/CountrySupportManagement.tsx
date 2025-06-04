
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Settings, 
  Globe,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Eye
} from 'lucide-react';
import { CountryConfigurationForm } from './CountryConfigurationForm';
import { AFRICA_COUNTRIES } from '@/hooks/geolocation/countryData';
import { useCountryConfigurations } from '@/hooks/useGeographicManagement';

interface CountryStatus {
  status: 'active' | 'inactive' | 'preparation' | 'beta' | 'maintenance';
  performance_score?: number;
  user_count?: number;
  revenue?: number;
  last_updated?: string;
}

const mockCountryStatuses: Record<string, CountryStatus> = {
  'NG': { status: 'active', performance_score: 95, user_count: 15420, revenue: 45300, last_updated: '2025-01-26' },
  'KE': { status: 'active', performance_score: 88, user_count: 8930, revenue: 28900, last_updated: '2025-01-25' },
  'ZA': { status: 'active', performance_score: 92, user_count: 12100, revenue: 38200, last_updated: '2025-01-26' },
  'SN': { status: 'beta', performance_score: 76, user_count: 3200, revenue: 8500, last_updated: '2025-01-24' },
  'CI': { status: 'preparation', performance_score: 0, user_count: 0, revenue: 0, last_updated: '2025-01-20' },
  'GH': { status: 'active', performance_score: 85, user_count: 6700, revenue: 19800, last_updated: '2025-01-25' },
  'EG': { status: 'maintenance', performance_score: 45, user_count: 9800, revenue: 15200, last_updated: '2025-01-23' }
};

export const CountrySupportManagement: React.FC = () => {
  const { data: countryConfigs } = useCountryConfigurations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      inactive: { variant: 'secondary', icon: AlertTriangle, color: 'text-gray-500' },
      preparation: { variant: 'outline', icon: Clock, color: 'text-yellow-600' },
      beta: { variant: 'secondary', icon: Settings, color: 'text-blue-600' },
      maintenance: { variant: 'destructive', icon: Wrench, color: 'text-red-600' }
    } as const;

    const config = variants[status as keyof typeof variants] || variants.inactive;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRegionBadge = (region: string) => {
    const colors = {
      west: 'bg-blue-100 text-blue-800',
      east: 'bg-green-100 text-green-800',
      north: 'bg-yellow-100 text-yellow-800',
      south: 'bg-purple-100 text-purple-800',
      central: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[region as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {region.charAt(0).toUpperCase() + region.slice(1)}
      </Badge>
    );
  };

  const countries = Object.values(AFRICA_COUNTRIES);
  
  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.country_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const countryStatus = mockCountryStatuses[country.country_code]?.status || 'inactive';
    const matchesStatus = statusFilter === 'all' || countryStatus === statusFilter;
    const matchesRegion = regionFilter === 'all' || country.region === regionFilter;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const handleBulkStatusChange = (newStatus: string) => {
    console.log(`Changing status of ${selectedCountries.length} countries to ${newStatus}`);
    // Implementation would update country configurations
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountries(prev => 
      prev.includes(countryCode) 
        ? prev.filter(c => c !== countryCode)
        : [...prev, countryCode]
    );
  };

  const handleConfigureCountry = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setShowConfigForm(true);
  };

  if (showConfigForm) {
    const selectedCountryConfig = countryConfigs?.find(c => c.country_code === selectedCountryCode);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Configuration du pays</h2>
            <p className="text-gray-600">
              {selectedCountryCode && AFRICA_COUNTRIES[selectedCountryCode]?.country}
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowConfigForm(false)}>
            Retour à la liste
          </Button>
        </div>
        
        <CountryConfigurationForm
          country={selectedCountryConfig}
          onSuccess={() => setShowConfigForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
            Pays Supportés
          </h2>
          <p className="text-gray-600">Gestion complète des 54 pays africains</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" className="bg-afroGreen hover:bg-afroGreen/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Pays
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pays Actifs</p>
                <p className="text-2xl font-bold text-afroGreen">
                  {countries.filter(c => mockCountryStatuses[c.country_code]?.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-afroGreen" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Préparation</p>
                <p className="text-2xl font-bold text-afroGold">
                  {countries.filter(c => mockCountryStatuses[c.country_code]?.status === 'preparation').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-afroGold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Version Bêta</p>
                <p className="text-2xl font-bold text-blue-600">
                  {countries.filter(c => mockCountryStatuses[c.country_code]?.status === 'beta').length}
                </p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pays</p>
                <p className="text-2xl font-bold text-gray-800">54</p>
              </div>
              <Globe className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="regions">Par région</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un pays..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="preparation">Préparation</SelectItem>
                    <SelectItem value="beta">Bêta</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    <SelectItem value="west">Afrique de l'Ouest</SelectItem>
                    <SelectItem value="east">Afrique de l'Est</SelectItem>
                    <SelectItem value="north">Afrique du Nord</SelectItem>
                    <SelectItem value="south">Afrique du Sud</SelectItem>
                    <SelectItem value="central">Afrique Centrale</SelectItem>
                  </SelectContent>
                </Select>

                {selectedCountries.length > 0 && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleBulkStatusChange('active')}
                    >
                      Activer ({selectedCountries.length})
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleBulkStatusChange('inactive')}
                    >
                      Désactiver ({selectedCountries.length})
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Countries Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCountries(filteredCountries.map(c => c.country_code));
                          } else {
                            setSelectedCountries([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Pays</TableHead>
                    <TableHead>Région</TableHead>
                    <TableHead>Devise</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Utilisateurs</TableHead>
                    <TableHead>Revenus</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCountries.map((country) => {
                    const status = mockCountryStatuses[country.country_code] || { status: 'inactive' };
                    const isSelected = selectedCountries.includes(country.country_code);
                    
                    return (
                      <TableRow key={country.country_code} className={isSelected ? 'bg-blue-50' : ''}>
                        <TableCell>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleCountrySelect(country.country_code)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{country.country_code === 'NG' ? '🇳🇬' : country.country_code === 'KE' ? '🇰🇪' : '🌍'}</span>
                            <div>
                              <div className="font-medium">{country.country}</div>
                              <div className="text-sm text-gray-500">{country.country_code}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRegionBadge(country.region)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-mono">{country.currency}</span>
                            <span className="text-gray-500">{country.currency_symbol}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(status.status)}</TableCell>
                        <TableCell>
                          {status.performance_score ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-afroGreen h-2 rounded-full" 
                                  style={{ width: `${status.performance_score}%` }}
                                />
                              </div>
                              <span className="text-sm">{status.performance_score}%</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {status.user_count ? (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{status.user_count.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {status.revenue ? (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span>${status.revenue.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleConfigureCountry(country.country_code)}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['west', 'east', 'north', 'south', 'central'].map(region => {
              const regionCountries = countries.filter(c => c.region === region);
              const activeCount = regionCountries.filter(c => mockCountryStatuses[c.country_code]?.status === 'active').length;
              
              return (
                <Card key={region}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {getRegionBadge(region)}
                      <span className="text-sm font-normal text-gray-500">
                        {activeCount}/{regionCountries.length} actifs
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {regionCountries.slice(0, 5).map(country => (
                        <div key={country.country_code} className="flex items-center justify-between">
                          <span className="text-sm">{country.country}</span>
                          {getStatusBadge(mockCountryStatuses[country.country_code]?.status || 'inactive')}
                        </div>
                      ))}
                      {regionCountries.length > 5 && (
                        <div className="text-sm text-gray-500">
                          +{regionCountries.length - 5} autres pays...
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance par pays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockCountryStatuses)
                  .filter(([_, status]) => status.status === 'active')
                  .sort(([_, a], [__, b]) => (b.performance_score || 0) - (a.performance_score || 0))
                  .map(([countryCode, status]) => {
                    const country = AFRICA_COUNTRIES[countryCode];
                    return (
                      <div key={countryCode} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🌍</span>
                          <div>
                            <div className="font-medium">{country?.country}</div>
                            <div className="text-sm text-gray-500">{status.user_count?.toLocaleString()} utilisateurs</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">${status.revenue?.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Revenus</div>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-afroGreen h-2 rounded-full" 
                              style={{ width: `${status.performance_score}%` }}
                            />
                          </div>
                          <span className="font-medium">{status.performance_score}%</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration globale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-activation des pays</div>
                    <div className="text-sm text-gray-500">Active automatiquement les pays lors des accords</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notifications de performance</div>
                    <div className="text-sm text-gray-500">Alertes pour les baisses de performance</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Synchronisation automatique</div>
                    <div className="text-sm text-gray-500">Mise à jour automatique des données pays</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions en masse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer configurations pays
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter toutes les configurations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Appliquer template par région
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Générer rapport de performance
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

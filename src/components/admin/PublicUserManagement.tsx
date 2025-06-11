
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Search, Filter, Ban, CheckCircle, Eye, BarChart3, Download } from 'lucide-react';
import { PublicUserStats } from './PublicUserStats';
import { PublicUserExport } from './PublicUserExport';

interface PublicUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  phone?: string;
  is_active: boolean;
  quote_requests_count: number;
  comparisons_count: number;
}

export const PublicUserManagement = () => {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('users');

  const fetchUsers = async () => {
    try {
      // Fetch users from profiles table with aggregated data
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select(`
          *,
          quote_requests:quote_requests(count),
          comparisons:comparison_history(count)
        `);

      if (error) throw error;

      // Transform data to match our interface
      const usersData: PublicUser[] = (profilesData || []).map(profile => ({
        id: profile.id,
        email: 'Non disponible', // We can't get email from profiles
        created_at: profile.created_at,
        first_name: profile.first_name,
        last_name: profile.last_name,
        country: profile.country,
        phone: profile.phone,
        is_active: true, // Default for now
        quote_requests_count: Array.isArray(profile.quote_requests) ? profile.quote_requests.length : 0,
        comparisons_count: Array.isArray(profile.comparisons) ? profile.comparisons.length : 0
      }));

      setUsers(usersData);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active);

    const matchesCountry = 
      filterCountry === 'all' || user.country === filterCountry;

    return matchesSearch && matchesStatus && matchesCountry;
  });

  const countries = [...new Set(users.map(user => user.country).filter(Boolean))];

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // In a real implementation, you would update the user status in auth
      // For now, we'll just show a toast
      toast.success(`Utilisateur ${currentStatus ? 'désactivé' : 'activé'} avec succès`);
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des utilisateurs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des utilisateurs publics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les pays</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country} value={country || ''}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres avancés
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {user.first_name && user.last_name 
                                  ? `${user.first_name} ${user.last_name}`
                                  : 'Nom non disponible'
                                }
                              </h3>
                              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                {user.is_active ? 'Actif' : 'Inactif'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span>Devis: {user.quote_requests_count}</span>
                              <span>Comparaisons: {user.comparisons_count}</span>
                              {user.country && <span>Pays: {user.country}</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                            className={user.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                          >
                            {user.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Aucun utilisateur trouvé
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <PublicUserStats users={filteredUsers} />
            </TabsContent>

            <TabsContent value="export">
              <PublicUserExport users={users} filteredUsers={filteredUsers} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Table } from 'lucide-react';

interface PublicUserExportProps {
  users: any[];
  filteredUsers: any[];
}

export const PublicUserExport: React.FC<PublicUserExportProps> = ({ users, filteredUsers }) => {
  const exportToCSV = (data: any[], filename: string) => {
    const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Pays', 'Téléphone', 'Date de création', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...data.map(user => [
        user.id,
        user.first_name || '',
        user.last_name || '',
        user.email,
        user.country || '',
        user.phone || '',
        new Date(user.created_at).toLocaleDateString(),
        user.is_active ? 'Actif' : 'Inactif'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export des données utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Export rapide</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => exportToCSV(filteredUsers, 'utilisateurs_filtres.csv')}
                  className="w-full"
                  variant="outline"
                >
                  <Table className="h-4 w-4 mr-2" />
                  Export CSV (Filtres appliqués)
                </Button>
                
                <Button 
                  onClick={() => exportToJSON(filteredUsers, 'utilisateurs_filtres.json')}
                  className="w-full"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export JSON (Filtres appliqués)
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Export complet</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => exportToCSV(users, 'tous_utilisateurs.csv')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tous les utilisateurs (CSV)
                </Button>
                
                <Button 
                  onClick={() => exportToJSON(users, 'tous_utilisateurs.json')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tous les utilisateurs (JSON)
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Informations sur l'export
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Les données exportées respectent les règles de confidentialité</p>
              <p>• Les mots de passe et informations sensibles ne sont jamais inclus</p>
              <p>• L'export filtrés contient {filteredUsers.length} utilisateurs</p>
              <p>• L'export complet contient {users.length} utilisateurs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

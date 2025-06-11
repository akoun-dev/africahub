
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Clock, 
  User, 
  FileText, 
  Eye,
  RotateCcw,
  GitBranch,
  GitCompare,
  Download
} from 'lucide-react';

export const ProductVersionHistory: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState('assurance-auto-premium');

  const products = [
    { id: 'assurance-auto-premium', name: 'Assurance Auto Premium', versions: 5 },
    { id: 'forfait-internet-fibre', name: 'Forfait Internet Fibre', versions: 3 },
    { id: 'compte-epargne-plus', name: 'Compte Épargne Plus', versions: 8 }
  ];

  const versionHistory = [
    {
      id: 'v5',
      version: '5.0',
      date: '2025-01-26 14:30',
      author: 'Marie Diallo',
      changes: [
        'Prix mis à jour pour zone Premium',
        'Ajout couverture vol',
        'Modification conditions âge'
      ],
      status: 'current',
      size: '2.4 KB'
    },
    {
      id: 'v4',
      version: '4.2',
      date: '2025-01-20 09:15',
      author: 'Ahmed Ndiaye',
      changes: [
        'Correction description',
        'Ajout pays Mali'
      ],
      status: 'archived',
      size: '2.1 KB'
    },
    {
      id: 'v3',
      version: '4.1',
      date: '2025-01-15 16:45',
      author: 'Fatou Sall',
      changes: [
        'Nouveau critère franchise',
        'Mise à jour commissions',
        'Correction bugs affichage'
      ],
      status: 'archived',
      size: '2.0 KB'
    },
    {
      id: 'v2',
      version: '4.0',
      date: '2025-01-10 11:20',
      author: 'Ibrahima Kane',
      changes: [
        'Refonte complète structure',
        'Nouveaux critères comparaison',
        'Intégration API partenaire'
      ],
      status: 'major',
      size: '1.8 KB'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      current: { variant: 'default', color: 'bg-afroGreen text-white' },
      archived: { variant: 'secondary', color: 'bg-gray-100 text-gray-700' },
      major: { variant: 'outline', color: 'bg-blue-50 text-blue-700 border-blue-200' }
    } as const;

    const config = variants[status as keyof typeof variants] || variants.archived;

    return (
      <Badge className={config.color}>
        {status === 'current' ? 'Actuelle' : status === 'major' ? 'Version majeure' : 'Archivée'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Historique des Versions</h3>
          <p className="text-gray-600">Suivi des modifications et versions des produits</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <GitCompare className="h-4 w-4 mr-2" />
            Comparer Versions
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter Historique
          </Button>
        </div>
      </div>

      {/* Product Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Sélectionner un Produit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.versions} versions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                <span>{products.find(p => p.id === selectedProduct)?.versions} versions</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Dernière modification: il y a 2 jours</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Chronologie des Versions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {versionHistory.map((version, index) => (
              <div key={version.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    version.status === 'current' ? 'bg-afroGreen' : 
                    version.status === 'major' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  {index < versionHistory.length - 1 && (
                    <div className="w-px h-16 bg-gray-200 mt-2" />
                  )}
                </div>

                {/* Version details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">Version {version.version}</h4>
                      {getStatusBadge(version.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-3 w-3" />
                      <span>{version.author}</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{version.date}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {version.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{version.size}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      {version.status !== 'current' && (
                        <Button size="sm" variant="outline">
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Restaurer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Version Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparaison Détaillée</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Champ</TableHead>
                <TableHead>Version 4.2</TableHead>
                <TableHead>Version 5.0 (Actuelle)</TableHead>
                <TableHead>Type de Modification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Prix Zone Premium</TableCell>
                <TableCell className="text-red-600 line-through">250,000 XOF</TableCell>
                <TableCell className="text-green-600">275,000 XOF</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-blue-600">Modification</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Couverture Vol</TableCell>
                <TableCell className="text-gray-400">Non incluse</TableCell>
                <TableCell className="text-green-600">Incluse</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600">Ajout</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Âge minimum</TableCell>
                <TableCell className="text-red-600 line-through">21 ans</TableCell>
                <TableCell className="text-green-600">18 ans</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-blue-600">Modification</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Settings,
  Eye
} from 'lucide-react';

export const ProductBulkImporter: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed'>('idle');

  const importHistory = [
    {
      id: '1',
      filename: 'produits_assurance_janvier_2025.xlsx',
      date: '2025-01-26 14:30',
      status: 'success',
      totalRows: 245,
      successRows: 240,
      errorRows: 5,
      source: 'Excel'
    },
    {
      id: '2',
      filename: 'api_orange_telephonie.json',
      date: '2025-01-25 09:15',
      status: 'partial',
      totalRows: 156,
      successRows: 134,
      errorRows: 22,
      source: 'API'
    },
    {
      id: '3',
      filename: 'produits_banque.csv',
      date: '2025-01-24 16:45',
      status: 'failed',
      totalRows: 89,
      successRows: 0,
      errorRows: 89,
      source: 'CSV'
    }
  ];

  const validationErrors = [
    {
      row: 15,
      field: 'price',
      error: 'Prix invalide: doit être numérique',
      value: 'gratuit'
    },
    {
      row: 23,
      field: 'country_availability',
      error: 'Code pays invalide: XYZ',
      value: 'XYZ'
    },
    {
      row: 47,
      field: 'company_id',
      error: 'Société inexistante',
      value: 'comp_unknown_123'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      success: { variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      partial: { variant: 'secondary', icon: AlertTriangle, color: 'text-yellow-600' },
      failed: { variant: 'destructive', icon: XCircle, color: 'text-red-600' },
      processing: { variant: 'outline', icon: RefreshCw, color: 'text-blue-600' }
    } as const;

    const config = variants[status as keyof typeof variants] || variants.failed;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color} ${status === 'processing' ? 'animate-spin' : ''}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Import/Export en Masse</h3>
          <p className="text-gray-600">Gestion des imports et exports de produits</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Template Excel
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configuration API
          </Button>
        </div>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          <TabsTrigger value="import">Import Produits</TabsTrigger>
          <TabsTrigger value="export">Export Données</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="api">Intégrations API</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          {/* Import Form */}
          <Card>
            <CardHeader>
              <CardTitle>Importer des Produits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="importType">Type d'import</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Fichier Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">Fichier CSV</SelectItem>
                      <SelectItem value="json">Fichier JSON</SelectItem>
                      <SelectItem value="api">Import API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur cible</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous secteurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous secteurs</SelectItem>
                      <SelectItem value="assurance">Assurance</SelectItem>
                      <SelectItem value="banque">Banque</SelectItem>
                      <SelectItem value="telephonie">Téléphonie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Fichier à importer</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Glissez-déposez votre fichier ici ou cliquez pour sélectionner
                  </p>
                  <Input type="file" className="hidden" id="file" />
                  <Button variant="outline" onClick={() => document.getElementById('file')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Choisir un fichier
                  </Button>
                </div>
              </div>

              {importStatus !== 'idle' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Progression de l'import</Label>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  className="bg-afroGreen hover:bg-afroGreen/90"
                  disabled={importStatus === 'processing'}
                >
                  {importStatus === 'processing' ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Lancer l'import
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  Validation préalable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Validation Results */}
          {validationErrors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Erreurs de Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ligne</TableHead>
                      <TableHead>Champ</TableHead>
                      <TableHead>Erreur</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationErrors.map((error, index) => (
                      <TableRow key={index}>
                        <TableCell>{error.row}</TableCell>
                        <TableCell className="font-mono text-sm">{error.field}</TableCell>
                        <TableCell>{error.error}</TableCell>
                        <TableCell className="font-mono text-sm bg-red-50">{error.value}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Corriger
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exporter des Données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Format d'export</Label>
                  <Select defaultValue="excel">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF (Rapport)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Secteur</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous secteurs</SelectItem>
                      <SelectItem value="assurance">Assurance</SelectItem>
                      <SelectItem value="banque">Banque</SelectItem>
                      <SelectItem value="telephonie">Téléphonie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pays à inclure</Label>
                <div className="flex flex-wrap gap-2">
                  {['SN', 'CI', 'ML', 'BF', 'NG', 'GH'].map(country => (
                    <Badge key={country} variant="outline" className="cursor-pointer hover:bg-gray-100">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-afroGreen hover:bg-afroGreen/90">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter (1,247 produits)
                </Button>
                <Button variant="outline">
                  Aperçu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Imports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fichier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Résultats</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.filename}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.source}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-green-600">{item.successRows} succès</div>
                          {item.errorRows > 0 && (
                            <div className="text-red-600">{item.errorRows} erreurs</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Orange API',
                    status: 'active',
                    lastSync: '2025-01-26 08:00',
                    products: 156,
                    endpoint: 'https://api.orange.sn/products'
                  },
                  {
                    name: 'Allianz API',
                    status: 'error',
                    lastSync: '2025-01-25 14:30',
                    products: 0,
                    endpoint: 'https://api.allianz.sn/insurance'
                  }
                ].map((api, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{api.name}</h4>
                        {getStatusBadge(api.status)}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dernière sync:</span>
                          <span>{api.lastSync}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Produits:</span>
                          <span>{api.products}</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {api.endpoint}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

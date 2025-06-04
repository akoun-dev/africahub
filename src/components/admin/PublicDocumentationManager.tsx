
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Plus, Edit, Eye, Globe } from 'lucide-react';

export const PublicDocumentationManager: React.FC = () => {
  const [documents] = useState([
    {
      id: '1',
      title: 'Guide de l\'assurance auto en Côte d\'Ivoire',
      category: 'guide',
      status: 'published',
      language: 'fr',
      country: 'CI',
      sector: 'assurance',
      viewCount: 1250,
      lastUpdated: '2024-01-20',
      author: 'Admin'
    },
    {
      id: '2',
      title: 'FAQ - Services bancaires mobiles',
      category: 'faq',
      status: 'published',
      language: 'fr',
      country: 'ALL',
      sector: 'banque',
      viewCount: 980,
      lastUpdated: '2024-01-18',
      author: 'Modérateur'
    },
    {
      id: '3',
      title: 'Tutorial: Comment choisir son forfait internet',
      category: 'tutorial',
      status: 'draft',
      language: 'fr',
      country: 'CI',
      sector: 'telecom',
      viewCount: 0,
      lastUpdated: '2024-01-15',
      author: 'Admin'
    },
    {
      id: '4',
      title: 'Conditions générales d\'utilisation',
      category: 'legal',
      status: 'published',
      language: 'fr',
      country: 'ALL',
      sector: 'ALL',
      viewCount: 2340,
      lastUpdated: '2024-01-10',
      author: 'Admin'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-100 text-green-800">Publié</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archivé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      guide: 'bg-blue-100 text-blue-800',
      faq: 'bg-yellow-100 text-yellow-800',
      tutorial: 'bg-purple-100 text-purple-800',
      legal: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="outline" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Documentation publique
            </CardTitle>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <Card className="mb-6 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Créer un nouveau document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Titre du document</Label>
                    <Input id="title" placeholder="Ex: Guide de l'assurance auto" />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                        <SelectItem value="tutorial">Tutoriel</SelectItem>
                        <SelectItem value="legal">Légal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Rédigez le contenu du document..." 
                    className="min-h-[200px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Pays</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Tous les pays</SelectItem>
                        <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                        <SelectItem value="SN">Sénégal</SelectItem>
                        <SelectItem value="BF">Burkina Faso</SelectItem>
                        <SelectItem value="MA">Maroc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="sector">Secteur</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Tous les secteurs</SelectItem>
                        <SelectItem value="assurance">Assurance</SelectItem>
                        <SelectItem value="telecom">Télécoms</SelectItem>
                        <SelectItem value="banque">Banque</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>Enregistrer en brouillon</Button>
                  <Button variant="outline">Publier immédiatement</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{doc.title}</h3>
                        {getStatusBadge(doc.status)}
                        {getCategoryBadge(doc.category)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {doc.language.toUpperCase()}
                        </span>
                        <span>Pays: {doc.country === 'ALL' ? 'Tous' : doc.country}</span>
                        <span>Secteur: {doc.sector === 'ALL' ? 'Tous' : doc.sector}</span>
                        <span>Par {doc.author}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Vues:</span>
                      <p className="font-medium">{doc.viewCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Dernière modification:</span>
                      <p className="font-medium">{new Date(doc.lastUpdated).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Statut:</span>
                      <p className="font-medium">{doc.status === 'published' ? 'En ligne' : 'Hors ligne'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {documents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun document trouvé
              </div>
            )}
          </div>

          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">
              Documentation publique
            </h4>
            <div className="text-xs text-green-700 space-y-1">
              <p>• Créez des guides, FAQ et tutoriels pour vos utilisateurs</p>
              <p>• Gérez le contenu par pays et secteur</p>
              <p>• Suivez les consultations et l'engagement</p>
              <p>• Publiez en plusieurs langues</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

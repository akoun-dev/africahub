
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, Globe, MapPin, Eye } from 'lucide-react';
import { useConfigurableContent } from '@/hooks/useConfigurableContent';
import { toast } from 'sonner';

interface ContentItem {
  key: string;
  label: string;
  description: string;
  type: 'text' | 'textarea';
  supportsVariables?: boolean;
}

const MAP_CONTENT_ITEMS: ContentItem[] = [
  {
    key: 'map.interactive_badge',
    label: 'Badge Carte Interactive',
    description: 'Texte du badge affiché au-dessus du titre',
    type: 'text'
  },
  {
    key: 'map.explore_insurance_title',
    label: 'Titre Assurance',
    description: 'Titre principal pour le secteur assurance',
    type: 'text'
  },
  {
    key: 'map.explore_insurance_description',
    label: 'Description Assurance',
    description: 'Description pour le secteur assurance',
    type: 'textarea'
  },
  {
    key: 'map.explore_sector_title',
    label: 'Titre Secteur Dynamique',
    description: 'Titre pour les autres secteurs (utilise {sector})',
    type: 'text',
    supportsVariables: true
  },
  {
    key: 'map.explore_sector_description',
    label: 'Description Secteur Dynamique',
    description: 'Description pour les autres secteurs (utilise {sector})',
    type: 'textarea',
    supportsVariables: true
  }
];

export const ContentManagement: React.FC = () => {
  const { getContent, updateContent, loading } = useConfigurableContent();
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    title: ''
  });

  const handleEdit = (contentKey: string) => {
    const currentContent = getContent(contentKey);
    setFormData({
      content: currentContent,
      title: ''
    });
    setEditingItem(contentKey);
  };

  const handleSave = async (contentKey: string) => {
    const success = await updateContent(contentKey, formData.content);

    if (success) {
      toast.success('Contenu mis à jour avec succès');
      setEditingItem(null);
    } else {
      toast.error('Erreur lors de la mise à jour du contenu');
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({ content: '', title: '' });
  };

  const renderContentEditor = (item: ContentItem) => {
    const isEditing = editingItem === item.key;
    const currentContent = getContent(item.key);

    return (
      <Card key={item.key} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              {item.supportsVariables && (
                <Badge variant="outline" className="mt-2 text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  Variables: {'{sector}'}
                </Badge>
              )}
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(item.key)}
                className="flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                Modifier
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              {item.type === 'text' ? (
                <Input
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={`Entrez le ${item.label.toLowerCase()}`}
                />
              ) : (
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={`Entrez la ${item.label.toLowerCase()}`}
                  rows={3}
                />
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSave(item.key)}
                  className="flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Sauvegarder
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded border text-sm">
                {currentContent || <span className="text-gray-400 italic">Aucun contenu configuré</span>}
              </div>
              {item.supportsVariables && (
                <p className="text-xs text-blue-600">
                  <Eye className="w-3 h-3 inline mr-1" />
                  Prévisualisation avec variables substituées
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du contenu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion du Contenu Dynamique</h3>
          <p className="text-sm text-gray-600">Configurez les textes affichés sur la carte interactive</p>
        </div>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">🇫🇷 Français</SelectItem>
            <SelectItem value="en">🇬🇧 English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-blue-900">Section Carte Interactive</h4>
          </div>
          <p className="text-sm text-blue-700">
            Ces contenus sont affichés dans la section carte interactive de la page d'accueil. 
            Les modifications sont visibles immédiatement pour tous les utilisateurs.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {MAP_CONTENT_ITEMS.map(renderContentEditor)}
      </div>

      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Informations</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Les variables comme {'{sector}'} sont automatiquement remplacées</li>
            <li>• Le contenu est mis en cache pour de meilleures performances</li>
            <li>• Vous pouvez créer des versions spécifiques par pays ou secteur</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

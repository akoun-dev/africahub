
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, X, Image, Code, Settings } from 'lucide-react';
import { CMSContent } from '@/services/microservices/CMSMicroservice';
import { MediaManager } from './media/MediaManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AdvancedContentEditorProps {
  content?: CMSContent | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  onPreview: (data: any) => void;
}

export const AdvancedContentEditor: React.FC<AdvancedContentEditorProps> = ({
  content,
  onSave,
  onCancel,
  onPreview
}) => {
  const [formData, setFormData] = useState({
    content_key: '',
    content_type: 'text',
    title: '',
    content: '',
    metadata: {},
    country_code: '',
    sector_slug: '',
    language_code: 'fr',
    status: 'draft' as 'draft' | 'published' | 'archived'
  });
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (content) {
      setFormData({
        content_key: content.content_key,
        content_type: content.content_type,
        title: content.title || '',
        content: content.content,
        metadata: content.metadata || {},
        country_code: content.country_code || '',
        sector_slug: content.sector_slug || '',
        language_code: content.language_code,
        status: content.status
      });
    }
  }, [content]);

  const handleSave = () => {
    onSave(formData);
  };

  const handlePreview = () => {
    onPreview(formData);
  };

  const handleMediaSelect = (mediaUrl: string) => {
    // Insert media URL at cursor position in content
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = formData.content.substring(0, cursorPos);
      const textAfter = formData.content.substring(cursorPos);
      const newContent = `${textBefore}![Image](${mediaUrl})${textAfter}`;
      
      setFormData(prev => ({ ...prev, content: newContent }));
    } else {
      // Fallback: append to end
      setFormData(prev => ({ 
        ...prev, 
        content: `${prev.content}\n![Image](${mediaUrl})` 
      }));
    }
    setMediaDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {content ? 'Modifier le contenu' : 'Créer un nouveau contenu'}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
              <TabsTrigger value="metadata">Métadonnées</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre du contenu"
                  />
                </div>
                <div>
                  <Label htmlFor="content_key">Clé de contenu</Label>
                  <Input
                    id="content_key"
                    value={formData.content_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_key: e.target.value }))}
                    placeholder="ex: sector.banque.hero"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content">Contenu</Label>
                  <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Image className="h-4 w-4 mr-2" />
                        Ajouter un média
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl">
                      <DialogHeader>
                        <DialogTitle>Sélectionner un média</DialogTitle>
                      </DialogHeader>
                      <MediaManager
                        onSelectMedia={handleMediaSelect}
                        acceptedTypes={['image/*', 'video/*', 'application/pdf']}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenu en Markdown..."
                  className="min-h-[300px] font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous pouvez utiliser Markdown pour le formatage
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="content_type">Type de contenu</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texte</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="language_code">Langue</Label>
                  <Select
                    value={formData.language_code}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, language_code: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published' | 'archived') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country_code">Code pays (optionnel)</Label>
                  <Input
                    id="country_code"
                    value={formData.country_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, country_code: e.target.value }))}
                    placeholder="ex: FR, SN, MA"
                  />
                </div>
                <div>
                  <Label htmlFor="sector_slug">Secteur (optionnel)</Label>
                  <Input
                    id="sector_slug"
                    value={formData.sector_slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, sector_slug: e.target.value }))}
                    placeholder="ex: banque, assurance"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <div>
                <Label>Métadonnées (JSON)</Label>
                <Textarea
                  value={JSON.stringify(formData.metadata, null, 2)}
                  onChange={(e) => {
                    try {
                      const metadata = JSON.parse(e.target.value);
                      setFormData(prev => ({ ...prev, metadata }));
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  className="min-h-[200px] font-mono"
                  placeholder='{"key": "value"}'
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format JSON valide requis
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

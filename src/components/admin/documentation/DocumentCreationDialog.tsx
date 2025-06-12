
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentCreationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentCreationDialog = ({ isOpen, onOpenChange }: DocumentCreationDialogProps) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('guide');

  const handleCreateDoc = () => {
    toast({
      title: "Document créé",
      description: "Le nouveau document a été créé avec succès.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un document</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc-title">Titre du document</Label>
              <Input id="doc-title" placeholder="Titre du document" />
            </div>
            <div className="space-y-2">
              <Label>Type de document</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guide">Guide utilisateur</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="tutorial">Tutoriel</SelectItem>
                  <SelectItem value="api-doc">Documentation API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Langue</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pays cible</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les pays</SelectItem>
                  <SelectItem value="SN">Sénégal</SelectItem>
                  <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                  <SelectItem value="MA">Maroc</SelectItem>
                  <SelectItem value="NG">Nigeria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Secteur</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les secteurs</SelectItem>
                  <SelectItem value="insurance">Assurance</SelectItem>
                  <SelectItem value="banking">Banque</SelectItem>
                  <SelectItem value="telecom">Télécoms</SelectItem>
                  <SelectItem value="energy">Énergie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-summary">Résumé</Label>
            <Textarea 
              id="doc-summary" 
              placeholder="Résumé du document (affiché dans les résultats de recherche)"
              rows={2}
            />
          </div>

          {selectedType === 'tutorial' && (
            <div className="space-y-2">
              <Label>Vidéo (optionnel)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Glisser-déposer la vidéo ou entrer l'URL YouTube</p>
                <Input className="mt-2" placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="doc-content">Contenu</Label>
            <Textarea 
              id="doc-content" 
              placeholder="Contenu du document (Markdown supporté)"
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-tags">Tags</Label>
            <Input 
              id="doc-tags" 
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-xs text-gray-500">Séparez les tags par des virgules</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCreateDoc} className="flex-1">
              Publier le document
            </Button>
            <Button variant="outline" onClick={handleCreateDoc} className="flex-1">
              Sauvegarder comme brouillon
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

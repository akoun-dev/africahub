
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, FolderPlus, Folder } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MediaSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  folders: string[];
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
  onCreateFolder: (name: string) => void;
}

export const MediaSearch: React.FC<MediaSearchProps> = ({
  searchTerm,
  onSearchChange,
  folders,
  selectedFolder,
  onFolderChange,
  onCreateFolder
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setCreateFolderOpen(false);
    toast({
      title: "Dossier créé",
      description: `Le dossier "${newFolderName}" a été créé avec succès`
    });
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher des médias..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Select value={selectedFolder || "all"} onValueChange={(value) => onFolderChange(value === "all" ? "" : value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Tous les dossiers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les dossiers</SelectItem>
          {folders.map((folder) => (
            <SelectItem key={folder} value={folder}>
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                {folder}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FolderPlus className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau dossier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nom du dossier"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCreateFolderOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleCreateFolder}>
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

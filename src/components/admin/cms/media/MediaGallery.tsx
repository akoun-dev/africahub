
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Trash2, Download, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
  folder?: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  onSelectMedia?: (mediaUrl: string) => void;
  onDeleteMedia: (id: string) => void;
  allowMultiple: boolean;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  media,
  viewMode,
  isLoading,
  onSelectMedia,
  onDeleteMedia,
  allowMultiple
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiée",
      description: "L'URL du média a été copiée dans le presse-papiers"
    });
  };

  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.name;
    link.click();
  };

  const handleDelete = (item: MediaItem) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`)) {
      onDeleteMedia(item.id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Eye className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-600">Aucun média trouvé</p>
        <p className="text-sm text-gray-500">Uploadez vos premiers fichiers pour commencer</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {media.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex-shrink-0">
              {item.type.startsWith('image/') ? (
                <img 
                  src={item.url} 
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs font-mono">{item.type.split('/')[1]?.toUpperCase()}</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formatFileSize(item.size)}</span>
                <Badge variant="outline" className="text-xs">
                  {item.type.split('/')[1]?.toUpperCase()}
                </Badge>
                <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedMedia(item);
                  setPreviewOpen(true);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyUrl(item.url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(item)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {onSelectMedia && (
                <Button
                  size="sm"
                  onClick={() => onSelectMedia(item.url)}
                >
                  Sélectionner
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div key={item.id} className="group relative">
            <div className="aspect-square border rounded-lg overflow-hidden bg-gray-100">
              {item.type.startsWith('image/') ? (
                <img 
                  src={item.url} 
                  alt={item.name}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => {
                    setSelectedMedia(item);
                    setPreviewOpen(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer">
                  <span className="text-sm font-mono text-gray-600">
                    {item.type.split('/')[1]?.toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopyUrl(item.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {onSelectMedia && (
                    <Button
                      size="sm"
                      onClick={() => onSelectMedia(item.url)}
                    >
                      Sélectionner
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm font-medium truncate" title={item.name}>
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(item.size)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.name}</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="space-y-4">
              {selectedMedia.type.startsWith('image/') ? (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.name}
                  className="w-full max-h-96 object-contain"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600">Aperçu non disponible</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Taille:</strong> {formatFileSize(selectedMedia.size)}
                </div>
                <div>
                  <strong>Type:</strong> {selectedMedia.type}
                </div>
                <div>
                  <strong>Créé le:</strong> {new Date(selectedMedia.created_at).toLocaleString('fr-FR')}
                </div>
                <div>
                  <strong>URL:</strong> 
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyUrl(selectedMedia.url)}
                    className="ml-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

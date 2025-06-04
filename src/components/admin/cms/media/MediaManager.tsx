
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, Grid, List, Folder, Image } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { MediaGallery } from './MediaGallery';
import { MediaSearch } from './MediaSearch';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';

interface MediaManagerProps {
  onSelectMedia?: (mediaUrl: string) => void;
  allowMultiple?: boolean;
  acceptedTypes?: string[];
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  onSelectMedia,
  allowMultiple = false,
  acceptedTypes = ['image/*']
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [showUploader, setShowUploader] = useState(false);

  const { 
    media, 
    folders, 
    isLoading, 
    uploadMedia, 
    deleteMedia, 
    createFolder,
    refetch 
  } = useMediaLibrary(selectedFolder);

  const handleUploadSuccess = useCallback(() => {
    setShowUploader(false);
    refetch();
  }, [refetch]);

  const filteredMedia = media?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Bibliothèque de médias
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => setShowUploader(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Ajouter des médias
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <MediaSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            folders={folders}
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
            onCreateFolder={createFolder}
          />

          {showUploader && (
            <MediaUploader
              acceptedTypes={acceptedTypes}
              currentFolder={selectedFolder}
              onUploadSuccess={handleUploadSuccess}
              onCancel={() => setShowUploader(false)}
            />
          )}

          <MediaGallery
            media={filteredMedia}
            viewMode={viewMode}
            isLoading={isLoading}
            onSelectMedia={onSelectMedia}
            onDeleteMedia={deleteMedia}
            allowMultiple={allowMultiple}
          />
        </CardContent>
      </Card>
    </div>
  );
};

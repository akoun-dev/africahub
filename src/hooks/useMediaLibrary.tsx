
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
  folder?: string;
}

export const useMediaLibrary = (folder?: string) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      
      // List files in the cms-media bucket
      const { data: files, error } = await supabase.storage
        .from('cms-media')
        .list(folder || '', {
          limit: 100,
          offset: 0
        });

      if (error) throw error;

      // Transform files to MediaItem format
      const mediaItems: MediaItem[] = [];
      const folderSet = new Set<string>();

      for (const file of files || []) {
        if (file.name) {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('cms-media')
            .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);

          // Extract folder from path if any
          const pathParts = file.name.split('/');
          if (pathParts.length > 1) {
            folderSet.add(pathParts[0]);
          }

          mediaItems.push({
            id: file.id || file.name,
            name: pathParts[pathParts.length - 1],
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'application/octet-stream',
            created_at: file.created_at || new Date().toISOString(),
            folder: pathParts.length > 1 ? pathParts[0] : undefined
          });
        }
      }

      setMedia(mediaItems);
      setFolders(Array.from(folderSet));
    } catch (error) {
      logger.error('Error fetching media:', error);
      setMedia([]);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadMedia = async (files: File[], targetFolder?: string) => {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = targetFolder ? `${targetFolder}/${fileName}` : fileName;

      const { error } = await supabase.storage
        .from('cms-media')
        .upload(filePath, file);

      if (error) throw error;
      return filePath;
    });

    return Promise.all(uploadPromises);
  };

  const deleteMedia = async (id: string) => {
    try {
      // Find the media item to get its path
      const mediaItem = media.find(m => m.id === id);
      if (!mediaItem) return false;

      // Extract path from URL
      const urlParts = mediaItem.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = mediaItem.folder ? `${mediaItem.folder}/${fileName}` : fileName;

      const { error } = await supabase.storage
        .from('cms-media')
        .remove([filePath]);

      if (error) throw error;

      // Refresh media list
      await fetchMedia();
      return true;
    } catch (error) {
      logger.error('Error deleting media:', error);
      return false;
    }
  };

  const createFolder = async (folderName: string) => {
    try {
      // Create a placeholder file in the folder to ensure it exists
      const placeholderPath = `${folderName}/.placeholder`;
      const placeholderFile = new Blob([''], { type: 'text/plain' });

      const { error } = await supabase.storage
        .from('cms-media')
        .upload(placeholderPath, placeholderFile);

      if (error) throw error;

      // Refresh media list
      await fetchMedia();
      return true;
    } catch (error) {
      logger.error('Error creating folder:', error);
      return false;
    }
  };

  const refetch = fetchMedia;

  useEffect(() => {
    fetchMedia();
  }, [folder]);

  return {
    media,
    folders,
    isLoading,
    uploadMedia,
    deleteMedia,
    createFolder,
    refetch
  };
};

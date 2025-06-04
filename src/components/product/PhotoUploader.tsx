
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Upload, ImageIcon, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  maxSizeKB?: number;
}

interface UploadingPhoto {
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 3,
  maxSizeKB = 5120 // 5MB
}) => {
  const { user } = useAuth();
  const [uploadingPhotos, setUploadingPhotos] = useState<UploadingPhoto[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      return 'Format non supporté. Utilisez JPG, PNG ou WebP.';
    }
    if (file.size > maxSizeKB * 1024) {
      return `Fichier trop volumineux. Maximum ${maxSizeKB / 1024}MB.`;
    }
    return null;
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculer les nouvelles dimensions (max 1200px)
        const maxSize = 1200;
        let { width, height } = img;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    const compressedFile = await compressImage(file);
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('review-photos')
      .upload(fileName, compressedFile);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('review-photos')
      .getPublicUrl(data.path);
    
    return publicUrl;
  };

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (photos.length + uploadingPhotos.length >= maxPhotos) {
      return;
    }
    
    const filesToProcess = Array.from(files).slice(0, maxPhotos - photos.length - uploadingPhotos.length);
    
    for (const file of filesToProcess) {
      const validationError = validateFile(file);
      const preview = URL.createObjectURL(file);
      
      if (validationError) {
        setUploadingPhotos(prev => [...prev, {
          file,
          preview,
          progress: 0,
          error: validationError
        }]);
        continue;
      }
      
      // Ajouter à la liste d'upload
      const uploadingPhoto: UploadingPhoto = {
        file,
        preview,
        progress: 0
      };
      
      setUploadingPhotos(prev => [...prev, uploadingPhoto]);
      
      try {
        // Simuler le progrès
        const progressInterval = setInterval(() => {
          setUploadingPhotos(prev => prev.map(p => 
            p.file === file ? { ...p, progress: Math.min(p.progress + 10, 90) } : p
          ));
        }, 100);
        
        const photoUrl = await uploadPhoto(file);
        
        clearInterval(progressInterval);
        
        // Mettre à jour avec le succès
        setUploadingPhotos(prev => prev.map(p => 
          p.file === file ? { ...p, progress: 100 } : p
        ));
        
        // Ajouter à la liste des photos uploadées
        onPhotosChange([...photos, photoUrl]);
        
        // Supprimer de la liste d'upload après un délai
        setTimeout(() => {
          setUploadingPhotos(prev => prev.filter(p => p.file !== file));
          URL.revokeObjectURL(preview);
        }, 1000);
        
      } catch (error) {
        console.error('Erreur upload:', error);
        setUploadingPhotos(prev => prev.map(p => 
          p.file === file ? { 
            ...p, 
            error: error instanceof Error ? error.message : 'Erreur d\'upload'
          } : p
        ));
      }
    }
  }, [photos, uploadingPhotos, maxPhotos, onPhotosChange, user]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const removePhoto = (photoUrl: string) => {
    onPhotosChange(photos.filter(url => url !== photoUrl));
  };

  const removeUploadingPhoto = (file: File) => {
    setUploadingPhotos(prev => {
      const photo = prev.find(p => p.file === file);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.file !== file);
    });
  };

  const canAddMore = photos.length + uploadingPhotos.length < maxPhotos;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        Photos ({photos.length + uploadingPhotos.length}/{maxPhotos})
      </Label>
      
      {/* Zone de drop */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => document.getElementById('photo-input')?.click()}
        >
          <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Glissez vos photos ici ou cliquez pour sélectionner
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG, WebP - Max {maxSizeKB / 1024}MB par photo
          </p>
          <input
            id="photo-input"
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />
        </div>
      )}

      {/* Photos uploadées */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photoUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={photoUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removePhoto(photoUrl)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Photos en cours d'upload */}
      {uploadingPhotos.length > 0 && (
        <div className="space-y-3">
          {uploadingPhotos.map((uploadingPhoto, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
              <img
                src={uploadingPhoto.preview}
                alt="Aperçu"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadingPhoto.file.name}</p>
                {uploadingPhoto.error ? (
                  <Alert className="mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {uploadingPhoto.error}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-1">
                    <Progress value={uploadingPhoto.progress} className="h-2" />
                    <p className="text-xs text-gray-500">
                      {uploadingPhoto.progress === 100 ? 'Terminé' : `${uploadingPhoto.progress}%`}
                    </p>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeUploadingPhoto(uploadingPhoto.file)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {photos.length + uploadingPhotos.length >= maxPhotos && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Vous avez atteint la limite de {maxPhotos} photos par avis.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

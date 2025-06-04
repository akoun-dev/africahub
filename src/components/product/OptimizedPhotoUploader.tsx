
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Upload, ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface OptimizedPhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  maxSizeKB?: number;
}

interface UploadingPhoto {
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'validating' | 'success' | 'error';
  error?: string;
}

export const OptimizedPhotoUploader: React.FC<OptimizedPhotoUploaderProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 3,
  maxSizeKB = 5120
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

  const createOptimizedImage = (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculer les dimensions optimales
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
        
        // Dessiner et compresser
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], `optimized_${file.name}`, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            resolve(file);
          }
        }, 'image/webp', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    const optimizedFile = await createOptimizedImage(file);
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    
    const { data, error } = await supabase.storage
      .from('review-photos')
      .upload(fileName, optimizedFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('review-photos')
      .getPublicUrl(data.path);
    
    return publicUrl;
  };

  const validatePhotoWithAI = async (photoUrl: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('photo-validation', {
        body: { photoUrl, userId: user?.id }
      });
      
      if (error) {
        console.error('Validation error:', error);
        return true; // En cas d'erreur, on accepte la photo
      }
      
      return data?.isValid || true;
    } catch (error) {
      console.error('Validation failed:', error);
      return true; // En cas d'erreur, on accepte la photo
    }
  };

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (photos.length + uploadingPhotos.length >= maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos autorisées`);
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
          status: 'error',
          error: validationError
        }]);
        continue;
      }
      
      const uploadingPhoto: UploadingPhoto = {
        file,
        preview,
        progress: 0,
        status: 'uploading'
      };
      
      setUploadingPhotos(prev => [...prev, uploadingPhoto]);
      
      try {
        // Simulation du progrès d'upload
        const progressInterval = setInterval(() => {
          setUploadingPhotos(prev => prev.map(p => 
            p.file === file && p.status === 'uploading' 
              ? { ...p, progress: Math.min(p.progress + 15, 90) } 
              : p
          ));
        }, 200);
        
        const photoUrl = await uploadPhoto(file);
        clearInterval(progressInterval);
        
        // Phase de validation
        setUploadingPhotos(prev => prev.map(p => 
          p.file === file ? { ...p, status: 'validating', progress: 95 } : p
        ));
        
        const isValid = await validatePhotoWithAI(photoUrl);
        
        if (isValid) {
          setUploadingPhotos(prev => prev.map(p => 
            p.file === file ? { ...p, status: 'success', progress: 100 } : p
          ));
          
          onPhotosChange([...photos, photoUrl]);
          
          // Nettoyer après succès
          setTimeout(() => {
            setUploadingPhotos(prev => prev.filter(p => p.file !== file));
            URL.revokeObjectURL(preview);
          }, 2000);
        } else {
          throw new Error('Photo rejetée par la modération automatique');
        }
        
      } catch (error) {
        console.error('Erreur upload:', error);
        setUploadingPhotos(prev => prev.map(p => 
          p.file === file ? { 
            ...p, 
            status: 'error',
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

  const getStatusIcon = (status: UploadingPhoto['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        Photos ({photos.length + uploadingPhotos.filter(p => p.status === 'success').length}/{maxPhotos})
      </Label>
      
      {/* Zone de drop optimisée */}
      {canAddMore && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50 scale-105' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => document.getElementById('photo-input')?.click()}
        >
          <div className="space-y-2">
            <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">
              Glissez vos photos ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP • Max {maxSizeKB / 1024}MB • Optimisation automatique
            </p>
          </div>
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

      {/* Photos uploadées avec lazy loading */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photoUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={photoUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border shadow-sm"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => removePhoto(photoUrl)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
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
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
              <img
                src={uploadingPhoto.preview}
                alt="Aperçu"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(uploadingPhoto.status)}
                  <p className="text-sm font-medium truncate">{uploadingPhoto.file.name}</p>
                </div>
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
                      {uploadingPhoto.status === 'uploading' && `Upload ${uploadingPhoto.progress}%`}
                      {uploadingPhoto.status === 'validating' && 'Validation...'}
                      {uploadingPhoto.status === 'success' && 'Terminé ✓'}
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
            Limite de {maxPhotos} photos atteinte. Supprimez une photo pour en ajouter une nouvelle.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

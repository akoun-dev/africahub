
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MediaUploaderProps {
  acceptedTypes: string[];
  currentFolder: string;
  onUploadSuccess: () => void;
  onCancel: () => void;
}

interface UploadFile {
  file: File;
  preview: string;
  progress: number;
  error?: string;
  uploaded?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  acceptedTypes,
  currentFolder,
  onUploadSuccess,
  onCancel
}) => {
  const [filesToUpload, setFilesToUpload] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0
    }));
    setFilesToUpload(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (index: number) => {
    setFilesToUpload(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    
    for (let i = 0; i < filesToUpload.length; i++) {
      const uploadFile = filesToUpload[i];
      
      try {
        const fileName = `${Date.now()}-${uploadFile.file.name}`;
        const filePath = currentFolder ? `${currentFolder}/${fileName}` : fileName;

        // Update progress
        setFilesToUpload(prev => {
          const newFiles = [...prev];
          newFiles[i] = { ...newFiles[i], progress: 50 };
          return newFiles;
        });

        const { error } = await supabase.storage
          .from('cms-media')
          .upload(filePath, uploadFile.file);

        if (error) throw error;

        // Update progress to complete
        setFilesToUpload(prev => {
          const newFiles = [...prev];
          newFiles[i] = { ...newFiles[i], progress: 100, uploaded: true };
          return newFiles;
        });

      } catch (error) {
        console.error('Upload error:', error);
        setFilesToUpload(prev => {
          const newFiles = [...prev];
          newFiles[i] = { 
            ...newFiles[i], 
            error: error instanceof Error ? error.message : 'Erreur d\'upload'
          };
          return newFiles;
        });
      }
    }

    setIsUploading(false);
    
    // Check if all uploads succeeded
    const allSucceeded = filesToUpload.every(f => f.uploaded);
    if (allSucceeded) {
      toast({
        title: "Upload réussi",
        description: `${filesToUpload.length} fichier(s) uploadé(s) avec succès`
      });
      onUploadSuccess();
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-blue-600">Déposez les fichiers ici...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-gray-500">
                Types acceptés: {acceptedTypes.join(', ')} - Max 10MB
              </p>
            </div>
          )}
        </div>

        {filesToUpload.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Fichiers à uploader ({filesToUpload.length})</h4>
            {filesToUpload.map((uploadFile, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {uploadFile.file.type.startsWith('image/') ? (
                    <img 
                      src={uploadFile.preview} 
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <FileImage className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {uploadFile.progress > 0 && (
                    <Progress value={uploadFile.progress} className="mt-1" />
                  )}
                  
                  {uploadFile.error && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {uploadFile.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {!isUploading && !uploadFile.uploaded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={filesToUpload.length === 0 || isUploading}
          >
            {isUploading ? 'Upload en cours...' : `Uploader ${filesToUpload.length} fichier(s)`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

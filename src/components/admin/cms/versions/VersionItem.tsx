
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, RotateCcw, Clock } from 'lucide-react';

interface ContentVersion {
  id: string;
  version: number;
  content_data: {
    title: string;
    content: string;
    metadata: any;
  };
  created_at: string;
  created_by: string;
}

interface VersionItemProps {
  version: ContentVersion;
  isCurrent: boolean;
  isSelected: boolean;
  isInCompare: boolean;
  compareMode: boolean;
  onSelect: (version: ContentVersion) => void;
  onRestore?: (version: number) => void;
  formatDate: (dateString: string) => string;
}

export const VersionItem: React.FC<VersionItemProps> = ({
  version,
  isCurrent,
  isSelected,
  isInCompare,
  compareMode,
  onSelect,
  onRestore,
  formatDate
}) => {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected || isInCompare 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(version)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={isCurrent ? "default" : "secondary"}>
              Version {version.version}
            </Badge>
            {isCurrent && (
              <Badge variant="outline" className="text-xs">
                Actuelle
              </Badge>
            )}
            {isInCompare && (
              <Badge variant="outline" className="text-xs bg-blue-100">
                Sélectionnée
              </Badge>
            )}
          </div>
          
          <h4 className="font-medium">{version.content_data.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {version.content_data.content.substring(0, 100)}...
          </p>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(version.created_at)}
            </span>
            <span>Par {version.created_by}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Aperçu - Version {version.version}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Titre</h4>
                  <p>{version.content_data.title}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contenu</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                    {version.content_data.content}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Métadonnées</h4>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(version.content_data.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {!isCurrent && onRestore && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Restaurer la version ${version.version} ?`)) {
                  onRestore(version.version);
                }
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

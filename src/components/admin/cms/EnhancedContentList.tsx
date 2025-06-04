
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Calendar, User, Globe, Tag, FileText } from 'lucide-react';
import { CMSContent } from '@/services/microservices/CMSMicroservice';
import { highlightSearchTerms, getContentExcerpt } from '@/utils/contentExport';

interface EnhancedContentListProps {
  content: CMSContent[];
  searchTerm: string;
  onEdit: (content: CMSContent) => void;
  onDelete: (id: string) => void;
  onPreview?: (content: CMSContent) => void;
}

export const EnhancedContentList: React.FC<EnhancedContentListProps> = ({
  content,
  searchTerm,
  onEdit,
  onDelete,
  onPreview
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  if (content.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Aucun contenu trouvé</p>
            <p className="text-sm">Essayez de modifier vos critères de recherche</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {content.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 
                    className="text-lg font-semibold truncate"
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerms(item.title || item.content_key, searchTerm)
                    }}
                  />
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusText(item.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {item.content_key}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {item.language_code.toUpperCase()}
                  </span>
                  {item.country_code && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {item.country_code}
                    </span>
                  )}
                  {item.sector_slug && (
                    <Badge variant="outline" className="text-xs">
                      {item.sector_slug}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Créé: {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Modifié: {new Date(item.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                  <span>Version {item.version}</span>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {onPreview && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onPreview(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {item.content_type.toUpperCase()}
                </Badge>
                {item.published_at && (
                  <span className="text-xs text-green-600">
                    Publié le {new Date(item.published_at).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>

              <div 
                className="text-gray-600 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightSearchTerms(getContentExcerpt(item.content, 200), searchTerm)
                }}
              />

              {Object.keys(item.metadata || {}).length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 mb-1">Métadonnées:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(item.metadata || {}).slice(0, 3).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {String(value).substring(0, 20)}
                      </Badge>
                    ))}
                    {Object.keys(item.metadata || {}).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{Object.keys(item.metadata || {}).length - 3} plus
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

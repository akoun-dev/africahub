
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { CMSContent } from '@/services/microservices/CMSMicroservice';

interface ContentListProps {
  content: CMSContent[];
  onEdit: (content: CMSContent) => void;
  onDelete: (id: string) => void;
}

export const ContentList: React.FC<ContentListProps> = ({
  content,
  onEdit,
  onDelete
}) => {
  return (
    <div className="grid gap-4">
      {content.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{item.title || item.content_key}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{item.content_type}</Badge>
                  <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                  {item.country_code && (
                    <Badge variant="outline">{item.country_code}</Badge>
                  )}
                  {item.sector_slug && (
                    <Badge variant="outline">{item.sector_slug}</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
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
          <CardContent>
            <p className="text-gray-600 line-clamp-2">{item.content}</p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Modifié le {new Date(item.updated_at).toLocaleDateString('fr-FR')}</span>
              <span>Version {item.version}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

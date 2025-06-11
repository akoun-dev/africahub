
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCMSContentList } from '@/hooks/useCMSContent';
import { BarChart3, FileText, Globe, Users, TrendingUp, Clock } from 'lucide-react';

export const CMSDashboard: React.FC = () => {
  const { data: contentData } = useCMSContentList({ limit: 100 });

  const stats = React.useMemo(() => {
    if (!contentData?.content) return null;

    const total = contentData.content.length;
    const published = contentData.content.filter(c => c.status === 'published').length;
    const draft = contentData.content.filter(c => c.status === 'draft').length;
    const countries = new Set(contentData.content.map(c => c.country_code).filter(Boolean)).size;
    const sectors = new Set(contentData.content.map(c => c.sector_slug).filter(Boolean)).size;

    return { total, published, draft, countries, sectors };
  }, [contentData]);

  const recentContent = React.useMemo(() => {
    if (!contentData?.content) return [];
    return contentData.content
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5);
  }, [contentData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tableau de Bord CMS</h2>
        <p className="text-gray-600">Vue d'ensemble de votre contenu</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Publié
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.published || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Brouillons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.draft || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Pays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.countries || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Secteurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.sectors || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              Langues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">2</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <Card>
        <CardHeader>
          <CardTitle>Contenu récent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{content.title || content.content_key}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {content.content_type}
                    </Badge>
                    {content.country_code && (
                      <Badge variant="secondary" className="text-xs">
                        {content.country_code}
                      </Badge>
                    )}
                    {content.sector_slug && (
                      <Badge variant="default" className="text-xs">
                        {content.sector_slug}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                    {content.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(content.updated_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

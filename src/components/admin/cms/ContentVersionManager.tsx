
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, GitBranch } from 'lucide-react';
import { CMSContent } from '@/services/microservices/CMSMicroservice';
import { VersionsList } from './versions/VersionsList';
import { VersionCompareView } from './versions/VersionCompareView';

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

interface ContentVersionManagerProps {
  contentId: string;
  currentContent: CMSContent;
  onRestoreVersion?: (version: number) => void;
}

export const ContentVersionManager: React.FC<ContentVersionManagerProps> = ({
  contentId,
  currentContent,
  onRestoreVersion
}) => {
  const [versions, setVersions] = useState<ContentVersion[]>([
    // Mock data - sera remplacé par un vrai appel API
    {
      id: '1',
      version: 3,
      content_data: {
        title: currentContent.title || '',
        content: currentContent.content,
        metadata: currentContent.metadata
      },
      created_at: new Date().toISOString(),
      created_by: 'system'
    },
    {
      id: '2',
      version: 2,
      content_data: {
        title: 'Services Bancaires en Afrique (v2)',
        content: 'Version précédente du contenu...',
        metadata: {}
      },
      created_at: new Date(Date.now() - 86400000).toISOString(),
      created_by: 'admin'
    },
    {
      id: '3',
      version: 1,
      content_data: {
        title: 'Services Bancaires (v1)',
        content: 'Première version du contenu...',
        metadata: {}
      },
      created_at: new Date(Date.now() - 172800000).toISOString(),
      created_by: 'editor'
    }
  ]);

  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<[ContentVersion | null, ContentVersion | null]>([null, null]);

  const handleVersionSelect = (version: ContentVersion) => {
    if (compareMode) {
      if (!compareVersions[0]) {
        setCompareVersions([version, null]);
      } else if (!compareVersions[1] && compareVersions[0]?.id !== version.id) {
        setCompareVersions([compareVersions[0], version]);
      } else {
        setCompareVersions([version, null]);
      }
    } else {
      setSelectedVersion(version);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des versions
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={compareMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareVersions([null, null]);
                setSelectedVersion(null);
              }}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              {compareMode ? 'Arrêter' : 'Comparer'}
            </Button>
          </div>
        </div>
        {compareMode && (
          <p className="text-sm text-gray-600">
            Sélectionnez deux versions pour les comparer
          </p>
        )}
      </CardHeader>

      <CardContent>
        <VersionsList
          versions={versions}
          currentVersion={currentContent.version}
          selectedVersion={selectedVersion}
          compareVersions={compareVersions}
          compareMode={compareMode}
          onVersionSelect={handleVersionSelect}
          onRestoreVersion={onRestoreVersion}
        />

        <VersionCompareView compareVersions={compareVersions} />
      </CardContent>
    </Card>
  );
};

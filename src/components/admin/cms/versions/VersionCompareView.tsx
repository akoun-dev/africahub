
import React from 'react';

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

interface VersionCompareViewProps {
  compareVersions: [ContentVersion | null, ContentVersion | null];
}

export const VersionCompareView: React.FC<VersionCompareViewProps> = ({
  compareVersions
}) => {
  const renderContentDiff = (content1: string, content2: string) => {
    // Simple diff visualization - peut être amélioré avec une vraie lib de diff
    const lines1 = content1.split('\n');
    const lines2 = content2.split('\n');
    
    return (
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <h4 className="font-medium text-red-600">Version {compareVersions[0]?.version}</h4>
          <div className="bg-red-50 p-3 rounded border">
            {lines1.map((line, i) => (
              <div key={i} className="font-mono">{line}</div>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="font-medium text-green-600">Version {compareVersions[1]?.version}</h4>
          <div className="bg-green-50 p-3 rounded border">
            {lines2.map((line, i) => (
              <div key={i} className="font-mono">{line}</div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!compareVersions[0] || !compareVersions[1]) {
    return null;
  }

  return (
    <div className="mt-6 p-4 border-t">
      <h3 className="font-medium mb-4">
        Comparaison des versions {compareVersions[0].version} et {compareVersions[1].version}
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Titre</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-red-50 p-2 rounded">
              {compareVersions[0].content_data.title}
            </div>
            <div className="bg-green-50 p-2 rounded">
              {compareVersions[1].content_data.title}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Contenu</h4>
          {renderContentDiff(
            compareVersions[0].content_data.content,
            compareVersions[1].content_data.content
          )}
        </div>
      </div>
    </div>
  );
};

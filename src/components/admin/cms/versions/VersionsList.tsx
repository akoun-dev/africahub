
import React from 'react';
import { VersionItem } from './VersionItem';

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

interface VersionsListProps {
  versions: ContentVersion[];
  currentVersion: number;
  selectedVersion: ContentVersion | null;
  compareVersions: [ContentVersion | null, ContentVersion | null];
  compareMode: boolean;
  onVersionSelect: (version: ContentVersion) => void;
  onRestoreVersion?: (version: number) => void;
}

export const VersionsList: React.FC<VersionsListProps> = ({
  versions,
  currentVersion,
  selectedVersion,
  compareVersions,
  compareMode,
  onVersionSelect,
  onRestoreVersion
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-3">
      {versions.map((version) => {
        const isSelected = selectedVersion?.id === version.id;
        const isInCompare = compareVersions.some(v => v?.id === version.id);
        const isCurrent = version.version === currentVersion;

        return (
          <VersionItem
            key={version.id}
            version={version}
            isCurrent={isCurrent}
            isSelected={isSelected}
            isInCompare={isInCompare}
            compareMode={compareMode}
            onSelect={onVersionSelect}
            onRestore={onRestoreVersion}
            formatDate={formatDate}
          />
        );
      })}
    </div>
  );
};

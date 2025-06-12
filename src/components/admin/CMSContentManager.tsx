
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CMSDashboard } from './cms/CMSDashboard';
import { AdvancedContentEditor } from './cms/AdvancedContentEditor';
import { ContentVersionManager } from './cms/ContentVersionManager';
import { ContentWorkflow } from './cms/ContentWorkflow';
import { AdvancedContentFilters, AdvancedFilters } from './cms/AdvancedContentFilters';
import { EnhancedContentList } from './cms/EnhancedContentList';
import { ContentPagination } from './cms/ContentPagination';
import { EmptyContentState } from './cms/EmptyContentState';
import { CMSActions } from './cms/CMSActions';
import { CMSHeader } from './cms/CMSHeader';
import { useCMSContentList, useCreateCMSContent, useUpdateCMSContent, useDeleteCMSContent } from '@/hooks/useCMSContent';
import { seedBankingSectorContent } from '@/utils/seedCMSContent';
import { exportToCSV, exportToJSON } from '@/utils/contentExport';
import { LayoutDashboard, FileText, Edit, History, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CMSContent } from '@/services/microservices/CMSMicroservice';

export const CMSContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingContent, setEditingContent] = useState<CMSContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<AdvancedFilters>({
    searchTerm: '',
    contentType: '',
    status: '',
    sector: '',
    language: 'fr',
    sortBy: 'updated_at',
    sortOrder: 'desc',
    itemsPerPage: 10
  });

  // Build CMS filters from advanced filters
  const cmsFilters = useMemo(() => ({
    country: '',
    sector: filters.sector,
    language: filters.language,
    status: filters.status,
    page: currentPage,
    limit: filters.itemsPerPage
  }), [filters, currentPage]);

  const { data: contentResponse, refetch } = useCMSContentList(cmsFilters);
  const createContent = useCreateCMSContent();
  const updateContent = useUpdateCMSContent();
  const deleteContent = useDeleteCMSContent();

  // Filter and sort content on the frontend for advanced features
  const filteredAndSortedContent = useMemo(() => {
    if (!contentResponse?.content) return [];

    let filtered = contentResponse.content.filter(item => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          item.title?.toLowerCase().includes(searchLower) ||
          item.content_key.toLowerCase().includes(searchLower) ||
          item.content.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Content type filter
      if (filters.contentType && item.content_type !== filters.contentType) {
        return false;
      }

      // Date filters
      if (filters.createdAfter) {
        const createdDate = new Date(item.created_at);
        if (createdDate < filters.createdAfter) return false;
      }
      if (filters.createdBefore) {
        const createdDate = new Date(item.created_at);
        if (createdDate > filters.createdBefore) return false;
      }
      if (filters.updatedAfter) {
        const updatedDate = new Date(item.updated_at);
        if (updatedDate < filters.updatedAfter) return false;
      }
      if (filters.updatedBefore) {
        const updatedDate = new Date(item.updated_at);
        if (updatedDate > filters.updatedBefore) return false;
      }

      return true;
    });

    // Sort content
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title || a.content_key;
          bValue = b.title || b.content_key;
          break;
        case 'content_key':
          aValue = a.content_key;
          bValue = b.content_key;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'updated_at':
        default:
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [contentResponse?.content, filters]);

  // Pagination for filtered content
  const totalPages = Math.ceil(filteredAndSortedContent.length / filters.itemsPerPage);
  const paginatedContent = filteredAndSortedContent.slice(
    (currentPage - 1) * filters.itemsPerPage,
    currentPage * filters.itemsPerPage
  );

  const handleSeedContent = async () => {
    try {
      await seedBankingSectorContent();
      toast({
        title: "Contenu initialisé",
        description: "Le contenu du secteur bancaire a été créé avec succès"
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser le contenu",
        variant: "destructive"
      });
    }
  };

  const handleSave = async (contentData: any) => {
    try {
      if (editingContent?.id) {
        await updateContent.mutateAsync({
          id: editingContent.id,
          updates: contentData
        });
        toast({
          title: "Contenu mis à jour",
          description: "Le contenu a été modifié avec succès"
        });
      } else {
        await createContent.mutateAsync(contentData);
        toast({
          title: "Contenu créé",
          description: "Le nouveau contenu a été créé avec succès"
        });
      }
      setEditingContent(null);
      setIsCreating(false);
      refetch();
      setActiveTab('content');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le contenu",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      try {
        await deleteContent.mutateAsync(id);
        toast({
          title: "Contenu supprimé",
          description: "Le contenu a été supprimé avec succès"
        });
        refetch();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le contenu",
          variant: "destructive"
        });
      }
    }
  };

  const handleEdit = (content: CMSContent) => {
    setEditingContent(content);
    setActiveTab('editor');
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingContent(null);
    setActiveTab('editor');
  };

  const handleCancel = () => {
    setEditingContent(null);
    setIsCreating(false);
    setActiveTab('content');
  };

  const handleFiltersChange = (newFilters: AdvancedFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setFilters({ ...filters, itemsPerPage });
    setCurrentPage(1);
  };

  const handleExport = (format: 'csv' | 'json') => {
    const exportData = filteredAndSortedContent;
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `cms-content-${timestamp}`;

    if (format === 'csv') {
      exportToCSV(exportData, filename);
      toast({
        title: "Export CSV",
        description: `${exportData.length} contenus exportés en CSV`
      });
    } else {
      exportToJSON(exportData, filename);
      toast({
        title: "Export JSON",
        description: `${exportData.length} contenus exportés en JSON`
      });
    }
  };

  return (
    <div className="space-y-6">
      <CMSHeader
        title="CMS Avancé"
        description="Gestion complète du contenu avec recherche et filtres avancés"
      >
        <CMSActions
          onSeedContent={handleSeedContent}
          onCreateNew={handleCreate}
        />
      </CMSHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Éditeur
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Versions
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Workflow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <CMSDashboard />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <AdvancedContentFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            totalItems={filteredAndSortedContent.length}
            currentPage={currentPage}
          />
          
          <EnhancedContentList
            content={paginatedContent}
            searchTerm={filters.searchTerm}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={(content) => {
              console.log('Preview:', content);
              // Could open a preview modal here
            }}
          />

          {totalPages > 1 && (
            <ContentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedContent.length}
              itemsPerPage={filters.itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </TabsContent>

        <TabsContent value="editor">
          {(editingContent || isCreating) ? (
            <AdvancedContentEditor
              content={editingContent}
              onSave={handleSave}
              onCancel={handleCancel}
              onPreview={(data) => {
                console.log('Preview:', data);
              }}
            />
          ) : (
            <EmptyContentState type="editor" onCreateNew={handleCreate} />
          )}
        </TabsContent>

        <TabsContent value="versions">
          {editingContent ? (
            <ContentVersionManager
              contentId={editingContent.id}
              currentContent={editingContent}
              onRestoreVersion={(version) => {
                console.log('Restore version:', version);
              }}
            />
          ) : (
            <EmptyContentState type="versions" />
          )}
        </TabsContent>

        <TabsContent value="workflow">
          {editingContent ? (
            <ContentWorkflow
              content={editingContent}
              onStatusChange={(newStatus, comment) => {
                console.log('Status change:', newStatus, comment);
              }}
              onSchedulePublication={(date) => {
                console.log('Schedule publication:', date);
              }}
            />
          ) : (
            <EmptyContentState type="workflow" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

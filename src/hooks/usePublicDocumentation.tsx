
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface PublicDocument {
  id: string;
  title: string;
  content: string;
  category: 'guide' | 'faq' | 'tutorial' | 'api';
  sector_slug?: string;
  country_code?: string;
  language_code: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  tags: string[];
  metadata: Record<string, any>;
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export const usePublicDocumentation = () => {
  const [documents, setDocuments] = useState<PublicDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      // Mock data pour la démo jusqu'à création de la table
      const mockDocuments: PublicDocument[] = [
        {
          id: '1',
          title: 'Guide de l\'assurance auto en Côte d\'Ivoire',
          content: 'Guide complet pour choisir son assurance auto...',
          category: 'guide',
          status: 'published',
          language_code: 'fr',
          country_code: 'CI',
          sector_slug: 'assurance',
          view_count: 1250,
          tags: ['assurance', 'auto', 'cote-ivoire'],
          metadata: {},
          created_at: '2024-01-20T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z'
        }
      ];
      
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Impossible de charger la documentation');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (docData: Omit<PublicDocument, 'id' | 'view_count' | 'created_at' | 'updated_at'>) => {
    try {
      const newDoc: PublicDocument = {
        ...docData,
        id: Math.random().toString(36).substr(2, 9),
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setDocuments(prev => [newDoc, ...prev]);
      toast.success('Document créé avec succès');
      return newDoc;
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Impossible de créer le document');
      throw error;
    }
  };

  const updateDocument = async (id: string, updates: Partial<PublicDocument>) => {
    try {
      const updatedDoc = documents.find(doc => doc.id === id);
      if (!updatedDoc) throw new Error('Document not found');

      const newDoc = { ...updatedDoc, ...updates, updated_at: new Date().toISOString() };
      setDocuments(prev => prev.map(doc => doc.id === id ? newDoc : doc));
      toast.success('Document mis à jour');
      return newDoc;
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Impossible de mettre à jour le document');
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document supprimé');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Impossible de supprimer le document');
      throw error;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    createDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments
  };
};

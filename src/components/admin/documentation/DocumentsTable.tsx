
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, FileText, HelpCircle, Video, Languages } from 'lucide-react';

interface DocumentationItem {
  id: string;
  title: string;
  type: 'guide' | 'faq' | 'tutorial' | 'api-doc';
  status: 'published' | 'draft' | 'archived';
  language: string;
  country: string;
  sector: string;
  views: number;
  lastUpdated: string;
  author: string;
}

interface DocumentsTableProps {
  docs: DocumentationItem[];
}

export const DocumentsTable = ({ docs }: DocumentsTableProps) => {
  const getTypeBadge = (type: string) => {
    const variants = {
      'guide': 'bg-blue-100 text-blue-800',
      'faq': 'bg-green-100 text-green-800',
      'tutorial': 'bg-purple-100 text-purple-800',
      'api-doc': 'bg-orange-100 text-orange-800'
    };
    return variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Langue</TableHead>
          <TableHead>Pays/Secteur</TableHead>
          <TableHead>Vues</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {docs.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              <div>
                <div className="font-medium">{doc.title}</div>
                <div className="text-sm text-gray-500">
                  Par {doc.author} • {doc.lastUpdated}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getTypeBadge(doc.type)}>
                {doc.type === 'guide' && <FileText className="h-3 w-3 mr-1" />}
                {doc.type === 'faq' && <HelpCircle className="h-3 w-3 mr-1" />}
                {doc.type === 'tutorial' && <Video className="h-3 w-3 mr-1" />}
                {doc.type}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={getStatusBadge(doc.status)}>
                {doc.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Languages className="h-3 w-3" />
                {doc.language.toUpperCase()}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{doc.country}</div>
                <div className="text-gray-500">{doc.sector}</div>
              </div>
            </TableCell>
            <TableCell>{doc.views.toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface SectorBreadcrumbProps {
  sectorName?: string;
  sectorSlug?: string;
  currentPage?: string;
}

export const SectorBreadcrumb: React.FC<SectorBreadcrumbProps> = ({
  sectorName,
  sectorSlug,
  currentPage
}) => {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {sectorName && sectorSlug && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/secteur/${sectorSlug}`}>
                  {sectorName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        
        {currentPage && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

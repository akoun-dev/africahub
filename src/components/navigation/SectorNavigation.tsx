
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, FileText, Home, ArrowLeft } from 'lucide-react';
import { useSectors } from '@/hooks/useSectors';
import { getSectorIcon } from '@/components/sector/SectorIcons';

interface SectorNavigationProps {
  currentSectorSlug?: string;
}

export const SectorNavigation: React.FC<SectorNavigationProps> = ({ currentSectorSlug }) => {
  const { data: sectors } = useSectors();
  const { slug } = useParams<{ slug: string }>();
  
  const currentSlug = currentSectorSlug || slug;
  const currentSector = sectors?.find(s => s.slug === currentSlug);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Navigation vers d'autres secteurs */}
          {sectors && sectors.length > 1 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Autres secteurs</h3>
              <div className="flex flex-wrap gap-2">
                {sectors
                  .filter(sector => sector.slug !== currentSlug)
                  .slice(0, 4)
                  .map(sector => {
                    const IconComponent = getSectorIcon(sector.icon);
                    return (
                      <Link key={sector.id} to={`/secteur/${sector.slug}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <IconComponent className="h-4 w-4" />
                          {sector.name}
                        </Button>
                      </Link>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Actions du secteur actuel */}
          {currentSector && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Actions pour {currentSector.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link to={`/secteur/${currentSector.slug}`}>
                  <Button variant="outline" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Vue d'ensemble
                  </Button>
                </Link>
                <Link to={`/secteur/${currentSector.slug}/comparer`}>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Comparer
                  </Button>
                </Link>
                <Link to={`/secteur/${currentSector.slug}/devis`}>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Demander un devis
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

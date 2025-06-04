
import React from 'react';
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from '@/components/ui/premium-card';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionBackground } from '@/components/ui/section-background';
import { Badge } from '@/components/ui/badge';
import { Building2, Star, ExternalLink, MapPin } from 'lucide-react';
import { AfricanGradientButton } from '@/components/ui/african-gradient-button';

interface Company {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  is_partner: boolean;
  country_availability: string[];
  website_url?: string;
  rating?: number;
}

interface PremiumSectorCompaniesProps {
  companies: Company[];
  sectorName: string;
  sectorColor: string;
}

export const PremiumSectorCompanies: React.FC<PremiumSectorCompaniesProps> = ({
  companies,
  sectorName,
  sectorColor
}) => {
  if (!companies || companies.length === 0) {
    return null;
  }

  return (
    <SectionBackground variant="muted" withPattern withDecorations>
      <div className="container px-4 md:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 tracking-tight">
            Nos partenaires en {sectorName}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Découvrez les entreprises de confiance avec lesquelles nous collaborons pour vous offrir les meilleurs services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {companies.map((company) => (
            <GlassCard 
              key={company.id} 
              variant="premium" 
              size="default" 
              radius="lg"
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {company.logo_url ? (
                      <img 
                        src={company.logo_url} 
                        alt={company.name}
                        className="w-16 h-16 rounded-xl object-contain border border-gray-100 bg-white p-2 shadow-sm"
                      />
                    ) : (
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow"
                        style={{ backgroundColor: sectorColor }}
                      >
                        <Building2 className="h-8 w-8" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-opacity-80 transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {company.is_partner && (
                          <Badge 
                            className="text-xs font-medium"
                            style={{ 
                              backgroundColor: `${sectorColor}20`,
                              color: sectorColor,
                              border: `1px solid ${sectorColor}30`
                            }}
                          >
                            ✓ Partenaire officiel
                          </Badge>
                        )}
                        {company.rating && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{company.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {company.description || "Découvrez les services proposés par cette entreprise partenaire dans le secteur " + sectorName.toLowerCase()}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>Disponible dans {company.country_availability.length} pays</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {company.country_availability.slice(0, 4).map((country) => (
                      <Badge key={country} variant="outline" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                    {company.country_availability.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{company.country_availability.length - 4} autres
                      </Badge>
                    )}
                  </div>

                  {company.website_url && (
                    <AfricanGradientButton 
                      className="w-full mt-4 group-hover:scale-105 transition-transform"
                      onClick={() => window.open(company.website_url, '_blank')}
                    >
                      Découvrir l'entreprise
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </AfricanGradientButton>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Vous êtes une entreprise et souhaitez devenir partenaire ?
          </p>
          <AfricanGradientButton size="lg">
            Devenir partenaire
            <Building2 className="ml-2 h-5 w-5" />
          </AfricanGradientButton>
        </div>
      </div>
    </SectionBackground>
  );
};

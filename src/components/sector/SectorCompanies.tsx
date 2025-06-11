
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Company {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  is_partner: boolean;
  country_availability: string[];
}

interface SectorCompaniesProps {
  companies: Company[];
  sectorName: string;
}

export const SectorCompanies: React.FC<SectorCompaniesProps> = ({
  companies,
  sectorName
}) => {
  if (!companies || companies.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nos partenaires en {sectorName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {company.logo_url && (
                    <img 
                      src={company.logo_url} 
                      alt={company.name}
                      className="w-12 h-12 rounded-lg object-contain"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    {company.is_partner && (
                      <Badge variant="secondary">Partenaire</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{company.description}</p>
                <div className="flex flex-wrap gap-2">
                  {company.country_availability.slice(0, 3).map((country) => (
                    <Badge key={country} variant="outline">
                      {country}
                    </Badge>
                  ))}
                  {company.country_availability.length > 3 && (
                    <Badge variant="outline">
                      +{company.country_availability.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

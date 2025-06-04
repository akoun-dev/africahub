
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, MapPin, ExternalLink, Heart, Share2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

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

interface InteractiveSectorCompaniesProps {
  companies: Company[];
  sectorName: string;
  sectorColor?: string;
}

export const InteractiveSectorCompanies: React.FC<InteractiveSectorCompaniesProps> = ({
  companies,
  sectorName,
  sectorColor = "#009639"
}) => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterPartner, setFilterPartner] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    companies.forEach(company => {
      company.country_availability.forEach(country => countries.add(country));
    });
    return Array.from(countries).sort();
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = filterCountry === 'all' || company.country_availability.includes(filterCountry);
      const matchesPartner = filterPartner === 'all' || 
                            (filterPartner === 'partner' && company.is_partner) ||
                            (filterPartner === 'non-partner' && !company.is_partner);
      
      return matchesSearch && matchesCountry && matchesPartner;
    });
  }, [companies, searchTerm, filterCountry, filterPartner]);

  const toggleFavorite = (companyId: string) => {
    setFavorites(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleShare = async (company: Company) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${company.name} - ${sectorName}`,
          text: company.description,
          url: company.website_url || window.location.href
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback pour les navigateurs sans support natif
      navigator.clipboard.writeText(company.website_url || window.location.href);
    }
  };

  if (!companies || companies.length === 0) {
    return (
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Aucune entreprise disponible</h2>
            <p className="text-gray-600">Nous travaillons à ajouter plus de partenaires dans ce secteur.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Nos partenaires en {sectorName}
          </h2>
          <p className="text-gray-600 mb-8">
            {filteredCompanies.length} entreprise{filteredCompanies.length > 1 ? 's' : ''} disponible{filteredCompanies.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className={`mb-8 space-y-4 ${isMobile ? 'space-y-4' : 'flex flex-wrap gap-4 items-center'}`}>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              {availableCountries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterPartner} onValueChange={setFilterPartner}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="partner">Partenaires</SelectItem>
              <SelectItem value="non-partner">Non-partenaires</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grille des entreprises */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-60 relative overflow-hidden group">
                  {company.is_partner && (
                    <div 
                      className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-r-0"
                      style={{ borderTopColor: sectorColor }}
                    >
                      <Star className="absolute -top-8 -right-2 h-4 w-4 text-white transform rotate-45" />
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {company.logo_url && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <img 
                              src={company.logo_url} 
                              alt={company.name}
                              className="w-12 h-12 rounded-lg object-contain"
                              loading="lazy"
                            />
                          </motion.div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">{company.name}</CardTitle>
                          {company.is_partner && (
                            <Badge variant="secondary" className="mt-1">Partenaire</Badge>
                          )}
                          {company.rating && (
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 text-sm font-medium">{company.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(company.id)}
                          className="p-2"
                        >
                          <Heart 
                            className={`h-4 w-4 ${favorites.includes(company.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(company)}
                          className="p-2"
                        >
                          <Share2 className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4 line-clamp-3">{company.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>Disponible dans {company.country_availability.length} pays</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {company.country_availability.slice(0, 3).map((country) => (
                          <Badge key={country} variant="outline" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                        {company.country_availability.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{company.country_availability.length - 3}
                          </Badge>
                        )}
                      </div>

                      {company.website_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          onClick={() => window.open(company.website_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visiter le site
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredCompanies.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500">Aucune entreprise ne correspond à vos critères de recherche.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setFilterCountry('all');
                setFilterPartner('all');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

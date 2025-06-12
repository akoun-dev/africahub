
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Globe, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumCompanyCardProps {
  company: {
    id: string;
    name: string;
    logo?: string;
    rating?: number;
    location?: string;
    phone?: string;
    website?: string;
    description?: string;
    verified?: boolean;
    specialties?: string[];
  };
  sectorColor?: string;
  onViewDetails?: (companyId: string) => void;
  onContact?: (companyId: string) => void;
  delay?: number;
}

export const PremiumCompanyCard: React.FC<PremiumCompanyCardProps> = ({
  company,
  sectorColor = '#009639',
  onViewDetails,
  onContact,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white relative">
        {/* African pattern overlay */}
        <div className="absolute inset-0 bg-[url('/patterns/adinkra-pattern.svg')] opacity-3 group-hover:opacity-8 transition-opacity duration-500"></div>
        
        {/* Premium gradient border */}
        <div 
          className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-25 transition-all duration-500"
          style={{ background: `linear-gradient(135deg, ${sectorColor}15, ${sectorColor}05)` }}
        ></div>

        {/* Top accent stripe */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: sectorColor }}
        ></div>

        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between mb-4">
            {/* Company logo/avatar */}
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: sectorColor }}
            >
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                company.name.substring(0, 2).toUpperCase()
              )}
            </div>

            {/* Verification badge */}
            {company.verified && (
              <Badge 
                variant="outline" 
                className="bg-emerald-50 border-emerald-200 text-emerald-700 px-3 py-1"
              >
                <Shield className="w-3 h-3 mr-1" />
                Vérifié
              </Badge>
            )}
          </div>

          {/* Company name and rating */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
              {company.name}
            </h3>
            
            {company.rating && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(company.rating!) 
                          ? 'text-afroGold fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {company.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Description */}
          {company.description && (
            <p className="text-gray-600 leading-relaxed line-clamp-3">
              {company.description}
            </p>
          )}

          {/* Specialties */}
          {company.specialties && company.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {company.specialties.slice(0, 3).map((specialty, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {specialty}
                </Badge>
              ))}
              {company.specialties.length > 3 && (
                <Badge variant="outline" className="text-gray-500">
                  +{company.specialties.length - 3} autres
                </Badge>
              )}
            </div>
          )}

          {/* Contact info */}
          <div className="space-y-2 pt-2">
            {company.location && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                {company.location}
              </div>
            )}
            {company.phone && (
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-2" />
                {company.phone}
              </div>
            )}
            {company.website && (
              <div className="flex items-center text-sm text-gray-500">
                <Globe className="w-4 h-4 mr-2" />
                <span className="truncate">{company.website}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(company.id)}
              className="flex-1 group/btn border-gray-300 hover:border-gray-400 transition-all"
            >
              Voir détails
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="sm"
              onClick={() => onContact?.(company.id)}
              className="flex-1 text-white hover:brightness-110 transition-all"
              style={{ backgroundColor: sectorColor }}
            >
              Contacter
            </Button>
          </div>
        </CardContent>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-afroRed opacity-60"></div>
          <div className="flex-1 bg-afroGold opacity-60"></div>
          <div className="flex-1 bg-afroGreen opacity-60"></div>
        </div>
      </Card>
    </motion.div>
  );
};

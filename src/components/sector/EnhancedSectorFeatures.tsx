import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield, Car, Home, Smartphone, Zap, Building, MapPin, Video, 
  Pill, Calculator, Users, MessageSquare, Store, CreditCard, 
  Package, TrendingUp, DollarSign, Heart, Plus, Percent, Clock, 
  Headphones, CheckCircle, Award
} from 'lucide-react'
import { useSectorCMSContent } from '@/hooks/useSectorCMSContent'

interface EnhancedSectorFeaturesProps {
  sectorSlug: string
  sectorColor?: string
}

// Mapping des icônes
const iconMap = {
  Shield, Car, Home, Smartphone, Zap, Building, MapPin, Video, 
  Pill, Calculator, Users, MessageSquare, Store, CreditCard, 
  Package, TrendingUp, DollarSign, Heart, Plus, Percent, Clock, 
  Headphones, CheckCircle, Award
} as const

type IconName = keyof typeof iconMap

export const EnhancedSectorFeatures: React.FC<EnhancedSectorFeaturesProps> = ({
  sectorSlug,
  sectorColor = '#1e3a5f'
}) => {
  const { data: content, isLoading } = useSectorCMSContent(sectorSlug)

  if (isLoading || !content) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as IconName] || Shield
    return IconComponent
  }

  return (
    <div className="space-y-12">
      {/* En-tête de section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-marineBlue-800">
          Fonctionnalités Principales
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Découvrez les solutions et services qui font la différence dans ce secteur. 
          Chaque fonctionnalité a été pensée pour répondre à vos besoins spécifiques.
        </p>
      </div>

      {/* Grille des fonctionnalités */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {content.features.map((feature, index) => {
          const IconComponent = getIcon(feature.icon)
          
          return (
            <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-marineBlue-50 to-brandSky-50 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8 text-marineBlue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-marineBlue-800 group-hover:text-marineBlue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <div className="text-sm text-gray-600 mt-1">
                      Fonctionnalité {index + 1}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>

                {/* Avantages */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-marineBlue-800 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Avantages inclus :
                  </h4>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-marineBlue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badge de popularité */}
                {index === 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    ⭐ Plus populaire
                  </Badge>
                )}
                {index === 1 && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    🚀 Recommandé
                  </Badge>
                )}
                {index === 2 && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    💎 Premium
                  </Badge>
                )}

                {/* Bouton d'action */}
                <Button 
                  className="w-full bg-marineBlue-600 hover:bg-marineBlue-700 group-hover:bg-marineBlue-700 transition-colors"
                  variant="default"
                >
                  En savoir plus
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Section des bénéfices */}
      <div className="bg-gradient-to-r from-marineBlue-600 to-brandSky-600 rounded-xl p-8 text-white">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">
            Pourquoi choisir nos solutions ?
          </h3>
          <p className="text-marineBlue-100 max-w-2xl mx-auto">
            Nos partenaires offrent des avantages uniques qui transforment votre expérience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.benefits.map((benefit) => {
            const IconComponent = getIcon(benefit.icon)
            
            return (
              <div key={benefit.id} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
                <p className="text-marineBlue-100 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Call-to-action */}
      <div className="bg-white border border-marineBlue-200 rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-marineBlue-800 mb-4">
            Prêt à découvrir ces fonctionnalités ?
          </h3>
          <p className="text-gray-600 mb-6">
            Explorez notre sélection de produits et services pour trouver la solution 
            qui correspond parfaitement à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-marineBlue-600 hover:bg-marineBlue-700">
              Voir tous les produits
            </Button>
            <Button variant="outline" className="border-marineBlue-200 text-marineBlue-600 hover:bg-marineBlue-50">
              Demander une démo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

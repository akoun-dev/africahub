import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote, Users, Package, TrendingUp, Award } from 'lucide-react'
import { useSectorCMSContent } from '@/hooks/useSectorCMSContent'

interface SectorTestimonialsProps {
  sectorSlug: string
  sectorColor?: string
}

export const SectorTestimonials: React.FC<SectorTestimonialsProps> = ({
  sectorSlug,
  sectorColor = '#1e3a5f'
}) => {
  const { data: content, isLoading } = useSectorCMSContent(sectorSlug)

  if (isLoading || !content) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-12">
      {/* Statistiques du secteur */}
      <div className="bg-gradient-to-r from-marineBlue-50 to-brandSky-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-marineBlue-800 mb-4">
            Chiffres Clés du Secteur
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les performances et la portée de notre écosystème dans ce secteur.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Fournisseurs */}
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-marineBlue-100">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-marineBlue-100 rounded-full">
                  <Users className="w-6 h-6 text-marineBlue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-marineBlue-800 mb-1">
                {content.stats.providers}
              </div>
              <div className="text-sm text-gray-600">Fournisseurs</div>
            </div>
          </div>

          {/* Produits */}
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-marineBlue-100">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-brandSky-100 rounded-full">
                  <Package className="w-6 h-6 text-brandSky-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-marineBlue-800 mb-1">
                {content.stats.products}
              </div>
              <div className="text-sm text-gray-600">Produits</div>
            </div>
          </div>

          {/* Économies */}
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-marineBlue-100">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-marineBlue-800 mb-1">
                {content.stats.savings}
              </div>
              <div className="text-sm text-gray-600">Économies moy.</div>
            </div>
          </div>

          {/* Utilisateurs */}
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-marineBlue-100">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-marineBlue-800 mb-1">
                {formatNumber(content.stats.users)}
              </div>
              <div className="text-sm text-gray-600">Utilisateurs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Témoignages */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-marineBlue-800 mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les retours d'expérience de nos utilisateurs satisfaits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden border-l-4 border-l-marineBlue-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Icône de citation */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12 text-marineBlue-600" />
                </div>

                {/* Contenu du témoignage */}
                <div className="relative z-10">
                  {/* Note */}
                  <div className="flex items-center space-x-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Texte du témoignage */}
                  <blockquote className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Informations de l'auteur */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-marineBlue-100 text-marineBlue-600 font-medium">
                        {getInitials(testimonial.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-marineBlue-800">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call-to-action pour ajouter un témoignage */}
      <div className="bg-white border-2 border-dashed border-marineBlue-200 rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="w-16 h-16 bg-marineBlue-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-marineBlue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-marineBlue-800 mb-2">
            Partagez votre expérience
          </h3>
          <p className="text-gray-600 mb-4">
            Vous avez utilisé nos services ? Aidez d'autres utilisateurs en partageant votre avis.
          </p>
          <button className="bg-marineBlue-600 hover:bg-marineBlue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Laisser un avis
          </button>
        </div>
      </div>
    </div>
  )
}

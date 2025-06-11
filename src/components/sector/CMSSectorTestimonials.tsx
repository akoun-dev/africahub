import React from 'react';
import { motion } from 'framer-motion';
import { PremiumCard, PremiumCardContent } from '@/components/ui/premium-card';
import { SectionBackground } from '@/components/ui/section-background';
import { Star, Quote } from 'lucide-react';
import { useSectorCMSContent } from '@/hooks/useSectorCMSContent';

interface CMSSectorTestimonialsProps {
  sectorSlug: string;
  sectorColor: string;
}

export const CMSSectorTestimonials: React.FC<CMSSectorTestimonialsProps> = ({
  sectorSlug,
  sectorColor
}) => {
  const { content, isLoading } = useSectorCMSContent(sectorSlug);

  if (isLoading || !content?.testimonials || content.testimonials.length === 0) {
    return null;
  }

  return (
    <SectionBackground variant="default" withPattern>
      <div className="container px-4 md:px-6 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900 tracking-tight">
              Témoignages Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Découvrez ce que nos clients disent de nos services
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PremiumCard className="h-full hover:shadow-xl transition-all duration-300 group">
                <PremiumCardContent className="p-8">
                  <div className="space-y-6">
                    {/* Citation */}
                    <div className="relative">
                      <Quote 
                        className="absolute -top-2 -left-2 w-8 h-8 opacity-20" 
                        style={{ color: sectorColor }}
                      />
                      <blockquote className="text-gray-700 leading-relaxed italic pl-6">
                        "{testimonial.content}"
                      </blockquote>
                    </div>

                    {/* Étoiles */}
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5 fill-current" 
                          style={{ color: sectorColor }}
                        />
                      ))}
                    </div>

                    {/* Auteur */}
                    <div className="border-t pt-6">
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                          style={{ backgroundColor: sectorColor }}
                        >
                          {testimonial.name.charAt(0)}
                        </div>
                        
                        {/* Informations */}
                        <div>
                          <div className="font-semibold text-gray-900">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PremiumCardContent>
              </PremiumCard>
            </motion.div>
          ))}
        </div>

        {/* Section CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <PremiumCard className="max-w-2xl mx-auto">
            <PremiumCardContent className="p-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Rejoignez nos clients satisfaits
                </h3>
                <p className="text-gray-600">
                  Découvrez pourquoi des milliers de clients nous font confiance
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span>4.8/5 basé sur {content.testimonials.length}+ avis</span>
                </div>
              </div>
            </PremiumCardContent>
          </PremiumCard>
        </motion.div>
      </div>
    </SectionBackground>
  );
};

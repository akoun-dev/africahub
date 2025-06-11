
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  badge?: string;
  onClick?: () => void;
  delay?: number;
}

export const PremiumFeatureCard: React.FC<PremiumFeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  color = '#009639',
  badge,
  onClick,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full"
    >
      <Card 
        className="h-full cursor-pointer group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white relative"
        onClick={onClick}
      >
        {/* African pattern background */}
        <div className="absolute inset-0 bg-[url('/patterns/kente-pattern.svg')] opacity-5 group-hover:opacity-10 transition-opacity"></div>
        
        {/* Gradient border effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)` }}
        ></div>

        <CardHeader className="relative z-10 text-center pb-4">
          {/* Icon with dynamic background */}
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all"
            style={{ backgroundColor: color }}
          >
            <Icon className="h-8 w-8" />
          </div>

          {/* Badge */}
          {badge && (
            <Badge 
              variant="outline" 
              className="mb-3 mx-auto border-gray-200 text-gray-600"
            >
              {badge}
            </Badge>
          )}

          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 text-center">
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>

          {/* Decorative elements */}
          <div className="mt-6 flex justify-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full opacity-60"
              style={{ backgroundColor: color }}
            ></div>
            <div className="w-2 h-2 rounded-full bg-afroGold opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-afroRed opacity-60"></div>
          </div>
        </CardContent>

        {/* Bottom accent line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
          style={{ backgroundColor: color }}
        ></div>
      </Card>
    </motion.div>
  );
};

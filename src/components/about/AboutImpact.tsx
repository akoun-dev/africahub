
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ImpactStat {
  number: string;
  label: string;
  delay: number;
}

const impactStats: ImpactStat[] = [
  { number: '2M+', label: 'Utilisateurs Satisfaits', delay: 0 },
  { number: '€150M', label: 'Économies Générées', delay: 200 },
  { number: '15K+', label: 'Entreprises Partenaires', delay: 400 },
  { number: '54', label: 'Pays Couverts', delay: 600 },
  { number: '25+', label: 'Langues Supportées', delay: 800 },
  { number: '500+', label: 'Emplois Créés', delay: 1000 }
];

export const AboutImpact = () => {
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-brandBlue mb-12 relative">
          Notre Impact
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-brandBlue rounded-full mt-4" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {impactStats.map((stat, index) => (
            <ImpactStatCard 
              key={index} 
              stat={stat} 
              animated={animated}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ImpactStatCardProps {
  stat: ImpactStat;
  animated: boolean;
}

const ImpactStatCard: React.FC<ImpactStatCardProps> = ({ stat, animated }) => {
  const [currentNumber, setCurrentNumber] = useState('0');

  useEffect(() => {
    if (!animated) return;

    const timer = setTimeout(() => {
      if (stat.number.includes('M+') || stat.number.includes('€')) {
        const baseNumber = parseInt(stat.number.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = Math.ceil(baseNumber / 50);
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= baseNumber) {
            setCurrentNumber(stat.number);
            clearInterval(counter);
          } else {
            if (stat.number.includes('€')) {
              setCurrentNumber('€' + current + 'M');
            } else {
              setCurrentNumber(current + 'M+');
            }
          }
        }, 30);
      } else if (stat.number.includes('K+')) {
        const baseNumber = parseInt(stat.number.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = Math.ceil(baseNumber / 50);
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= baseNumber) {
            setCurrentNumber(stat.number);
            clearInterval(counter);
          } else {
            setCurrentNumber(current + 'K+');
          }
        }, 30);
      } else {
        let current = 0;
        const baseNumber = parseInt(stat.number.replace(/[^0-9]/g, ''));
        const increment = Math.ceil(baseNumber / 30);
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= baseNumber) {
            setCurrentNumber(stat.number);
            clearInterval(counter);
          } else {
            setCurrentNumber(current.toString());
          }
        }, 50);
      }
    }, stat.delay);

    return () => clearTimeout(timer);
  }, [animated, stat]);

  return (
    <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-l-brandBlue shadow-lg hover:shadow-xl">
      <CardContent className="p-8 text-center">
        <div className="text-4xl md:text-5xl font-bold text-brandBlue mb-3 group-hover:scale-110 transition-transform duration-300">
          {currentNumber}
        </div>
        <div className="text-gray-600 font-medium text-lg">
          {stat.label}
        </div>
      </CardContent>
    </Card>
  );
};

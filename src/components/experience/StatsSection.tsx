
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatItem {
  number: string;
  label: string;
  delay: number;
}

const stats: StatItem[] = [
  { number: '54', label: 'Pays Africains Couverts', delay: 0 },
  { number: '50M+', label: 'Produits & Services', delay: 200 },
  { number: '15K+', label: 'Marchands Partenaires', delay: 400 },
  { number: '2M+', label: 'Utilisateurs Satisfaits', delay: 600 }
];

export const StatsSection = () => {
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
    <section 
      ref={sectionRef}
      className="relative bg-white -mt-10 pt-20 pb-16 rounded-t-[40px] z-10"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              stat={stat} 
              animated={animated}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  stat: StatItem;
  animated: boolean;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, animated, index }) => {
  const [currentNumber, setCurrentNumber] = useState('0');

  useEffect(() => {
    if (!animated) return;

    const timer = setTimeout(() => {
      if (stat.number.includes('M+')) {
        const baseNumber = parseInt(stat.number);
        let current = 0;
        const increment = Math.ceil(baseNumber / 50);
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= baseNumber) {
            setCurrentNumber(stat.number);
            clearInterval(counter);
          } else {
            setCurrentNumber(current + 'M+');
          }
        }, 30);
      } else if (stat.number.includes('K+')) {
        const baseNumber = parseInt(stat.number);
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
        const baseNumber = parseInt(stat.number);
        const increment = Math.ceil(baseNumber / 50);
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= baseNumber) {
            setCurrentNumber(stat.number);
            clearInterval(counter);
          } else {
            setCurrentNumber(current.toString());
          }
        }, 30);
      }
    }, stat.delay);

    return () => clearTimeout(timer);
  }, [animated, stat]);

  return (
    <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg hover:shadow-xl">
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

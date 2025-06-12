
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const AboutCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-brandBlue via-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold mb-4">
            Rejoignez la Révolution du Commerce Africain
          </h2>
          
          <p className="text-xl opacity-90 leading-relaxed">
            Ensemble, construisons un avenir où chaque consommateur africain 
            a accès aux meilleures opportunités.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-brandBlue hover:bg-gray-100 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Commencer à Comparer
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

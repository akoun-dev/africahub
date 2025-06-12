
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Smartphone, 
  Shield, 
  Building, 
  Plane, 
  Car, 
  GraduationCap, 
  Heart, 
  Home 
} from 'lucide-react';

interface Category {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
}

const categories: Category[] = [
  {
    icon: Smartphone,
    title: 'High-Tech & Électronique',
    description: 'Smartphones, ordinateurs, TV, électroménager. Comparez les prix dans toute l\'Afrique.',
    color: 'text-blue-600'
  },
  {
    icon: Shield,
    title: 'Assurances',
    description: 'Auto, habitation, santé, vie. Trouvez la meilleure couverture au meilleur prix.',
    color: 'text-green-600'
  },
  {
    icon: Building,
    title: 'Services Financiers',
    description: 'Prêts, comptes bancaires, cartes de crédit, épargne. Comparez les offres bancaires.',
    color: 'text-purple-600'
  },
  {
    icon: Plane,
    title: 'Voyages & Tourisme',
    description: 'Vols, hôtels, locations de voiture, circuits. Voyagez moins cher en Afrique.',
    color: 'text-orange-600'
  },
  {
    icon: Car,
    title: 'Automobile',
    description: 'Voitures neuves, occasion, motos, pièces détachées. Le meilleur de l\'auto africain.',
    color: 'text-red-600'
  },
  {
    icon: GraduationCap,
    title: 'Éducation & Formation',
    description: 'Universités, cours en ligne, formations professionnelles. Investissez dans votre avenir.',
    color: 'text-indigo-600'
  },
  {
    icon: Heart,
    title: 'Santé & Bien-être',
    description: 'Cliniques, pharmacies, produits de santé. Prenez soin de votre santé.',
    color: 'text-pink-600'
  },
  {
    icon: Home,
    title: 'Immobilier',
    description: 'Vente, location, terrains, bureaux. Trouvez votre prochain chez-vous.',
    color: 'text-teal-600'
  }
];

export const CategoriesExplorer = () => {
  const handleCategoryClick = (title: string) => {
    alert(`Exploration de la catégorie : ${title}\nFonctionnalité en cours de développement !`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explorez Nos Catégories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les meilleurs services dans chaque secteur d'activité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index} 
              category={category} 
              onClick={() => handleCategoryClick(category.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const Icon = category.icon;

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-brandBlue bg-white"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center space-y-4">
        <div className={`text-5xl ${category.color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="mx-auto h-12 w-12" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brandBlue transition-colors">
          {category.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {category.description}
        </p>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Rating {
  id: number;
  company: string;
  score: number;
  comment: string;
  userName: string;
  date: string;
  country: string;
  countryFlag: string;
}

const ratings: Rating[] = [
  {
    id: 1,
    company: "AssurAfrique",
    score: 4.5,
    comment: "Excellente couverture adaptée aux routes de mon pays. Le processus de réclamation était simple et rapide.",
    userName: "Kofi A.",
    date: "15/04/2025",
    country: "Ghana",
    countryFlag: "🇬🇭"
  },
  {
    id: 2,
    company: "PanAfriInsure",
    score: 5,
    comment: "Le meilleur service client que j'ai jamais rencontré. Les tarifs sont très compétitifs et les conseillers parlent swahili!",
    userName: "Amina K.",
    date: "03/05/2025",
    country: "Kenya",
    countryFlag: "🇰🇪"
  },
  {
    id: 3,
    company: "AfricAssur",
    score: 3.5,
    comment: "Bon rapport qualité-prix mais le temps de réponse pourrait être amélioré. Heureusement qu'ils ont un bureau à Abidjan.",
    userName: "Moussa T.",
    date: "22/04/2025",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮"
  },
  {
    id: 4,
    company: "MediAfrique",
    score: 4,
    comment: "Leur assurance santé couvre vraiment bien les médicaments contre le paludisme et autres maladies tropicales.",
    userName: "Fatou N.",
    date: "10/05/2025",
    country: "Sénégal",
    countryFlag: "🇸🇳"
  },
];

const RatingStars = ({ score }: { score: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(score)
              ? 'text-yellow-500 fill-yellow-500'
              : i < score
              ? 'text-yellow-500 fill-yellow-500 opacity-50'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">{score.toFixed(1)}</span>
    </div>
  );
};

const CommunityRatings = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center">Avis de notre communauté africaine</h2>
        <p className="text-center text-gray-600 mb-8">Découvrez ce que nos clients à travers l'Afrique pensent de nos services</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {ratings.map((rating) => (
            <div key={rating.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{rating.company}</h3>
                  <RatingStars score={rating.score} />
                </div>
                <div className="flex items-center bg-insurPurple-light text-insurPurple px-3 py-1 rounded-full text-sm font-medium">
                  <span className="mr-1">{rating.countryFlag}</span>
                  <span>{rating.country}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{rating.comment}</p>
              
              <div className="flex items-center text-sm text-gray-500">
                <User className="w-4 h-4 mr-1" />
                <span>{rating.userName}</span>
                <span className="mx-2">•</span>
                <span>{rating.date}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/compare">
            <button className="bg-white text-insurPurple border border-insurPurple hover:bg-insurPurple hover:text-white transition-colors px-6 py-2 rounded-md font-medium">
              Voir plus d'avis
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommunityRatings;

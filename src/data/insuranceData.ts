
// Define the insurance provider interface
export interface InsuranceProvider {
  id: number;
  name: string;
  company: string;
  price: number;
  currency: string;
  rating: number;
  features: string[];
  coverageLimit: string;
  deductible: number;
  countryAvailability: string[];
  africanSpecific?: boolean;
}

// Mock data for insurance providers with African countries coverage
export const africanInsuranceData = {
  auto: [
    { 
      id: 1, 
      name: "AfriAuto Premium", 
      company: "AssurAfrique", 
      price: 499, 
      currency: "USD",
      rating: 4.8, 
      features: ["Tous risques", "Assistance 24/7", "Protection juridique", "Couverture transfrontalière"],
      coverageLimit: "Illimité",
      deductible: 150,
      countryAvailability: ["NG", "GH", "KE", "ZA", "SN", "CI"],
      africanSpecific: true
    },
    { 
      id: 2, 
      name: "SafariProtect", 
      company: "PanAfriInsure", 
      price: 389, 
      currency: "USD",
      rating: 4.5, 
      features: ["Tous risques", "Assistance routière", "Protection contre le vol"],
      coverageLimit: "50 000 USD",
      deductible: 250,
      countryAvailability: ["KE", "TZ", "ET", "ZA", "NG"],
      africanSpecific: true
    },
    { 
      id: 3, 
      name: "MobilSécurité Plus", 
      company: "AfricAssur", 
      price: 450, 
      currency: "USD",
      rating: 4.2, 
      features: ["Tous risques", "Assistance 24/7", "Protection contre les intempéries"],
      coverageLimit: "100 000 USD",
      deductible: 200,
      countryAvailability: ["MA", "DZ", "EG", "TZ", "CM"],
      africanSpecific: true
    },
  ],
  home: [
    { 
      id: 1, 
      name: "HabitatAfrique", 
      company: "AssurAfrique", 
      price: 249, 
      currency: "USD",
      rating: 4.7, 
      features: ["Dégâts des eaux", "Vol", "Incendie", "Catastrophes naturelles"],
      coverageLimit: "300 000 USD",
      deductible: 100,
      countryAvailability: ["NG", "GH", "KE", "ZA", "CM", "SN"],
      africanSpecific: true
    },
    { 
      id: 2, 
      name: "FoyerProtect", 
      company: "AfroAssurance", 
      price: 199, 
      currency: "USD",
      rating: 4.4, 
      features: ["Dégâts des eaux", "Vol", "Incendie", "Protection contre les termites"],
      coverageLimit: "200 000 USD",
      deductible: 150,
      countryAvailability: ["MA", "DZ", "EG", "ZA", "TZ"],
      africanSpecific: true
    },
    { 
      id: 3, 
      name: "MaisonSécurisée", 
      company: "PanAfriInsure", 
      price: 229, 
      currency: "USD",
      rating: 4.6, 
      features: ["Dégâts des eaux", "Vol", "Incendie", "Protection contre la sécheresse"],
      coverageLimit: "250 000 USD", 
      deductible: 120,
      countryAvailability: ["SN", "CI", "CM", "ET", "KE"],
      africanSpecific: true
    },
  ],
  health: [
    { 
      id: 1, 
      name: "SantéAfricaine", 
      company: "MediAfrique", 
      price: 89, 
      currency: "USD",
      rating: 4.9, 
      features: ["Hospitalisation", "Soins courants", "Médicaments", "Maladies tropicales"],
      coverageLimit: "Frais réels",
      deductible: 0,
      countryAvailability: ["NG", "KE", "ZA", "GH", "ET", "SN"],
      africanSpecific: true
    },
    { 
      id: 2, 
      name: "AfriSanté", 
      company: "AssurAfrique", 
      price: 69, 
      currency: "USD",
      rating: 4.6, 
      features: ["Hospitalisation", "Soins courants", "Médicaments essentiels"],
      coverageLimit: "200% BRSS",
      deductible: 0,
      countryAvailability: ["DZ", "MA", "EG", "TZ", "CM"],
      africanSpecific: true
    },
    { 
      id: 3, 
      name: "EssentielSanté", 
      company: "PanAfriHealth", 
      price: 49, 
      currency: "USD",
      rating: 4.2, 
      features: ["Hospitalisation", "Soins courants", "Vaccination"],
      coverageLimit: "150% BRSS",
      deductible: 0,
      countryAvailability: ["CI", "SN", "CM", "GH", "NG"],
      africanSpecific: true
    },
  ],
  micro: [
    { 
      id: 1, 
      name: "MicroCrop", 
      company: "AgriAssur", 
      price: 15, 
      currency: "USD",
      rating: 4.7, 
      features: ["Protection des récoltes", "Sécheresse", "Inondations", "Conseils agricoles"],
      coverageLimit: "5 000 USD",
      deductible: 10,
      countryAvailability: ["KE", "ET", "TZ", "NG", "GH"],
      africanSpecific: true
    },
    { 
      id: 2, 
      name: "MobileMoney Protect", 
      company: "DigitAssur", 
      price: 5, 
      currency: "USD",
      rating: 4.8, 
      features: ["Protection transactions", "Vol du téléphone", "Fraude"],
      coverageLimit: "1 000 USD",
      deductible: 5,
      countryAvailability: ["NG", "KE", "GH", "SN", "CI"],
      africanSpecific: true
    },
    { 
      id: 3, 
      name: "MicroSanté", 
      company: "AfricAssur", 
      price: 8, 
      currency: "USD",
      rating: 4.5, 
      features: ["Soins de base", "Médicaments essentiels", "Téléconsultation"],
      coverageLimit: "500 USD", 
      deductible: 2,
      countryAvailability: ["CM", "SN", "CI", "ET", "TZ"],
      africanSpecific: true
    },
  ]
};

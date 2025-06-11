
import { supabase } from '@/integrations/supabase/client';

interface CriteriaMapping {
  [key: string]: {
    [criteriaName: string]: string;
  };
}

const criteriaValues: CriteriaMapping = {
  // Auto insurance products
  'AfriAuto Premium': {
    'Tous risques': 'true',
    'Assistance 24/7': 'true',
    'Protection juridique': 'true',
    'Couverture transfrontalière': 'true',
    'Assistance routière': 'true',
    'Protection contre le vol': 'true',
    'Protection contre les intempéries': 'true',
    'Limite de couverture': '500,000 USD',
    'Franchise': '500',
    'Note': '4.5'
  },
  'SafariProtect': {
    'Tous risques': 'true',
    'Assistance 24/7': 'true',
    'Protection juridique': 'false',
    'Couverture transfrontalière': 'true',
    'Assistance routière': 'true',
    'Protection contre le vol': 'true',
    'Protection contre les intempéries': 'false',
    'Limite de couverture': '300,000 USD',
    'Franchise': '300',
    'Note': '4.2'
  },
  'MobilSécurité Plus': {
    'Tous risques': 'true',
    'Assistance 24/7': 'true',
    'Protection juridique': 'true',
    'Couverture transfrontalière': 'false',
    'Assistance routière': 'true',
    'Protection contre le vol': 'true',
    'Protection contre les intempéries': 'true',
    'Limite de couverture': '400,000 USD',
    'Franchise': '400',
    'Note': '4.3'
  },
  
  // Home insurance products
  'HabitatAfrique': {
    'Dégâts des eaux': 'true',
    'Vol': 'true',
    'Incendie': 'true',
    'Catastrophes naturelles': 'true',
    'Protection contre les termites': 'true',
    'Protection contre la sécheresse': 'true',
    'Limite de couverture': '200,000 USD',
    'Franchise': '200',
    'Note': '4.4'
  },
  'FoyerProtect': {
    'Dégâts des eaux': 'true',
    'Vol': 'true',
    'Incendie': 'true',
    'Catastrophes naturelles': 'false',
    'Protection contre les termites': 'true',
    'Protection contre la sécheresse': 'false',
    'Limite de couverture': '150,000 USD',
    'Franchise': '150',
    'Note': '4.1'
  },
  'MaisonSécurisée': {
    'Dégâts des eaux': 'true',
    'Vol': 'true',
    'Incendie': 'true',
    'Catastrophes naturelles': 'true',
    'Protection contre les termites': 'false',
    'Protection contre la sécheresse': 'true',
    'Limite de couverture': '180,000 USD',
    'Franchise': '180',
    'Note': '4.2'
  },
  
  // Health insurance products
  'SantéAfricaine': {
    'Hospitalisation': 'true',
    'Soins courants': 'true',
    'Médicaments': 'true',
    'Maladies tropicales': 'true',
    'Médicaments essentiels': 'true',
    'Vaccination': 'true',
    'Téléconsultation': 'true',
    'Limite de couverture': '50,000 USD/an',
    'Franchise': '50',
    'Note': '4.6'
  },
  'AfriSanté': {
    'Hospitalisation': 'true',
    'Soins courants': 'true',
    'Médicaments': 'false',
    'Maladies tropicales': 'true',
    'Médicaments essentiels': 'true',
    'Vaccination': 'true',
    'Téléconsultation': 'false',
    'Limite de couverture': '30,000 USD/an',
    'Franchise': '30',
    'Note': '4.0'
  },
  'EssentielSanté': {
    'Hospitalisation': 'false',
    'Soins courants': 'true',
    'Médicaments': 'false',
    'Maladies tropicales': 'false',
    'Médicaments essentiels': 'true',
    'Vaccination': 'true',
    'Téléconsultation': 'false',
    'Limite de couverture': '10,000 USD/an',
    'Franchise': '20',
    'Note': '3.8'
  },
  
  // Micro-insurance products
  'MicroCrop': {
    'Protection des récoltes': 'true',
    'Sécheresse': 'true',
    'Inondations': 'true',
    'Conseils agricoles': 'true',
    'Protection transactions': 'false',
    'Vol du téléphone': 'false',
    'Fraude': 'false',
    'Soins de base': 'false',
    'Limite de couverture': '5,000 USD/saison',
    'Franchise': '10',
    'Note': '4.3'
  },
  'MobileMoney Protect': {
    'Protection des récoltes': 'false',
    'Sécheresse': 'false',
    'Inondations': 'false',
    'Conseils agricoles': 'false',
    'Protection transactions': 'true',
    'Vol du téléphone': 'true',
    'Fraude': 'true',
    'Soins de base': 'false',
    'Limite de couverture': '1,000 USD/mois',
    'Franchise': '5',
    'Note': '4.1'
  },
  'MicroSanté': {
    'Protection des récoltes': 'false',
    'Sécheresse': 'false',
    'Inondations': 'false',
    'Conseils agricoles': 'false',
    'Protection transactions': 'false',
    'Vol du téléphone': 'false',
    'Fraude': 'false',
    'Soins de base': 'true',
    'Limite de couverture': '2,000 USD/an',
    'Franchise': '8',
    'Note': '3.9'
  }
};

export const populateCriteriaValues = async () => {
  try {
    console.log('🚀 Début du peuplement des valeurs de critères...');
    
    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name');
    
    if (productsError) {
      console.error('Erreur lors de la récupération des produits:', productsError);
      return;
    }
    
    // Fetch all criteria
    const { data: criteria, error: criteriaError } = await supabase
      .from('comparison_criteria')
      .select('id, name');
    
    if (criteriaError) {
      console.error('Erreur lors de la récupération des critères:', criteriaError);
      return;
    }
    
    // Create a map for quick lookup
    const criteriaMap = new Map();
    criteria?.forEach(criterion => {
      criteriaMap.set(criterion.name, criterion.id);
    });
    
    const insertData = [];
    
    // For each product, create criteria values
    for (const product of products || []) {
      const productCriteria = criteriaValues[product.name];
      if (!productCriteria) {
        console.warn(`Aucune valeur de critère trouvée pour le produit: ${product.name}`);
        continue;
      }
      
      for (const [criteriaName, value] of Object.entries(productCriteria)) {
        const criteriaId = criteriaMap.get(criteriaName);
        if (criteriaId) {
          insertData.push({
            product_id: product.id,
            criteria_id: criteriaId,
            value: value
          });
        } else {
          console.warn(`Critère non trouvé: ${criteriaName}`);
        }
      }
    }
    
    // Insert all criteria values
    if (insertData.length > 0) {
      const { error: insertError } = await supabase
        .from('product_criteria_values')
        .insert(insertData);
      
      if (insertError) {
        console.error('Erreur lors de l\'insertion des valeurs:', insertError);
        return;
      }
      
      console.log(`✅ ${insertData.length} valeurs de critères insérées avec succès!`);
    }
    
    console.log('🎉 Migration des données terminée avec succès!');
    
  } catch (error) {
    console.error('Erreur lors du peuplement des critères:', error);
  }
};

// Execute the function if this script is run directly
if (typeof window === 'undefined') {
  populateCriteriaValues();
}

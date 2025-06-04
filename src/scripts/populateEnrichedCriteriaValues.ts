
import { supabase } from '@/integrations/supabase/client';

interface EnrichedCriteriaMapping {
  [key: string]: {
    [criteriaName: string]: string;
  };
}

const enrichedCriteriaValues: EnrichedCriteriaMapping = {
  // Produits auto enrichis
  'AutoProtect Sénégal': {
    'Couverture géographique': 'Afrique de l\'Ouest',
    'Assistance dépannage': 'true',
    'Protection conducteur': 'true',
    'Bonus-malus': '20% après 3 ans sans sinistre'
  },
  
  'DriveSecure Ghana': {
    'Couverture géographique': 'Ghana, Nigeria, Liberia',
    'Assistance dépannage': 'true',
    'Protection conducteur': 'false',
    'Bonus-malus': '15% après 2 ans sans sinistre'
  },

  // Produits habitation enrichis
  'HomeGuard Kenya': {
    'Couverture mobilier': '25000',
    'Protection climatique': 'true',
    'Relogement temporaire': 'true',
    'Responsabilité civile vie privée': '10000'
  },
  
  'SafeHome Ethiopia': {
    'Couverture mobilier': '15000',
    'Protection climatique': 'true',
    'Relogement temporaire': 'false',
    'Responsabilité civile vie privée': '5000'
  },

  // Produits santé enrichis
  'SantéPlus Maroc': {
    'Tiers payant': 'true',
    'Réseau de soins': 'Cliniques privées + hôpitaux publics',
    'Plafond annuel': '50000',
    'Délai de carence': '30'
  },
  
  'HealthCare Egypt': {
    'Tiers payant': 'true',
    'Réseau de soins': 'Réseau international',
    'Plafond annuel': '75000',
    'Délai de carence': '60'
  },

  // Produits microassurance enrichis
  'FarmProtect Zambia': {
    'Paiement mobile': 'true',
    'Flexibilité paiement': 'Paiement par récolte',
    'Couverture familiale': 'true',
    'Support local': 'Agents dans les villages'
  },
  
  'MobileCover SA': {
    'Paiement mobile': 'true',
    'Flexibilité paiement': 'Mensuel ou trimestriel',
    'Couverture familiale': 'false',
    'Support local': 'Centre d\'appels multilingue'
  }
};

export const populateEnrichedCriteriaValues = async () => {
  try {
    console.log('🚀 Début du peuplement des valeurs de critères enrichies...');
    
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
    
    // For each product, create enriched criteria values
    for (const product of products || []) {
      const productCriteria = enrichedCriteriaValues[product.name];
      if (!productCriteria) {
        console.log(`Aucune valeur enrichie trouvée pour le produit: ${product.name}`);
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
          console.warn(`Critère enrichi non trouvé: ${criteriaName}`);
        }
      }
    }
    
    // Insert enriched criteria values
    if (insertData.length > 0) {
      const { error: insertError } = await supabase
        .from('product_criteria_values')
        .insert(insertData);
      
      if (insertError) {
        console.error('Erreur lors de l\'insertion des valeurs enrichies:', insertError);
        return;
      }
      
      console.log(`✅ ${insertData.length} valeurs de critères enrichies insérées avec succès!`);
    }
    
    console.log('🎉 Migration des données enrichies terminée avec succès!');
    
  } catch (error) {
    console.error('Erreur lors du peuplement des critères enrichis:', error);
  }
};

// Execute the function if this script is run directly
if (typeof window === 'undefined') {
  populateEnrichedCriteriaValues();
}

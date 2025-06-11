import { supabase } from '@/integrations/supabase/client';

/**
 * Service pour gérer les secteurs d'activité et types de business
 */

export interface BusinessSector {
  name: string;
  types: string[];
}

export interface BusinessType {
  id: string;
  type_name: string;
  description: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Secteurs d'activité disponibles sur AfricaHub
 * Synchronisé avec les données en base
 */
export const BUSINESS_SECTORS: BusinessSector[] = [
  {
    name: 'Transport',
    types: [
      'Transport Public',
      'Taxi/VTC', 
      'Livraison',
      'Location de Véhicules',
      'Transport de Marchandises',
      'Transport Scolaire'
    ]
  },
  {
    name: 'Banque & Finance',
    types: [
      'Banque Commerciale',
      'Banque d\'Investissement',
      'Microfinance',
      'Assurance',
      'Bureau de Change',
      'Services de Paiement Mobile'
    ]
  },
  {
    name: 'Santé',
    types: [
      'Clinique/Hôpital',
      'Pharmacie',
      'Laboratoire d\'Analyses',
      'Cabinet Médical',
      'Cabinet Dentaire',
      'Optique',
      'Kinésithérapie'
    ]
  },
  {
    name: 'Énergie',
    types: [
      'Fourniture d\'Électricité',
      'Énergie Solaire',
      'Fourniture de Gaz',
      'Énergie Éolienne',
      'Installation Électrique',
      'Maintenance Énergétique'
    ]
  },
  {
    name: 'Télécommunications',
    types: [
      'Opérateur Mobile',
      'Fournisseur Internet',
      'Réparation Mobile',
      'Vente d\'Équipements Télécoms',
      'Services Cloud',
      'Cybersécurité'
    ]
  },
  {
    name: 'Immobilier',
    types: [
      'Agence Immobilière',
      'Promotion Immobilière',
      'Construction',
      'Architecture',
      'Gestion Locative',
      'Expertise Immobilière'
    ]
  },
  {
    name: 'Éducation',
    types: [
      'École Primaire',
      'École Secondaire',
      'Université/Institut',
      'Centre de Formation',
      'Cours Particuliers',
      'Formation Professionnelle'
    ]
  },
  {
    name: 'Commerce',
    types: [
      'Électronique & High-Tech',
      'Mode & Vêtements',
      'Alimentation & Boissons',
      'Pharmacie & Parapharmacie',
      'Librairie & Fournitures',
      'Automobile',
      'Ameublement & Décoration',
      'Cosmétiques & Beauté'
    ]
  }
];

export class BusinessSectorService {
  
  /**
   * Récupérer tous les secteurs d'activité
   */
  static getBusinessSectors(): BusinessSector[] {
    return BUSINESS_SECTORS;
  }

  /**
   * Récupérer les types d'activité pour un secteur donné
   */
  static getBusinessTypes(sectorName: string): string[] {
    const sector = BUSINESS_SECTORS.find(s => s.name === sectorName);
    return sector ? sector.types : [];
  }

  /**
   * Récupérer tous les types de business depuis la base de données
   */
  static async getBusinessTypesFromDB(): Promise<BusinessType[]> {
    try {
      const { data, error } = await supabase
        .from('business_types')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('type_name', { ascending: true });

      if (error) {
        console.error('Error fetching business types:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching business types:', error);
      return [];
    }
  }

  /**
   * Récupérer les types de business par catégorie
   */
  static async getBusinessTypesByCategory(): Promise<Record<string, BusinessType[]>> {
    try {
      const businessTypes = await this.getBusinessTypesFromDB();
      
      const grouped = businessTypes.reduce((acc, type) => {
        if (!acc[type.category]) {
          acc[type.category] = [];
        }
        acc[type.category].push(type);
        return acc;
      }, {} as Record<string, BusinessType[]>);

      return grouped;
    } catch (error) {
      console.error('Error grouping business types:', error);
      return {};
    }
  }

  /**
   * Vérifier si un type de business existe
   */
  static async businessTypeExists(typeName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('business_types')
        .select('id')
        .eq('type_name', typeName)
        .eq('is_active', true)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtenir les statistiques par secteur
   */
  static async getSectorStatistics() {
    try {
      const { data, error } = await supabase.rpc('get_sector_statistics');

      if (error) {
        console.error('Error fetching sector statistics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching sector statistics:', error);
      return [];
    }
  }

  /**
   * Rechercher des types de business
   */
  static async searchBusinessTypes(query: string): Promise<BusinessType[]> {
    try {
      const { data, error } = await supabase
        .from('business_types')
        .select('*')
        .or(`type_name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_active', true)
        .order('type_name', { ascending: true })
        .limit(20);

      if (error) {
        console.error('Error searching business types:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error searching business types:', error);
      return [];
    }
  }

  /**
   * Valider un secteur et type de business
   */
  static validateBusinessInfo(sector: string, type: string): boolean {
    const sectorData = BUSINESS_SECTORS.find(s => s.name === sector);
    if (!sectorData) {
      return false;
    }

    return sectorData.types.includes(type);
  }

  /**
   * Obtenir les secteurs les plus populaires
   */
  static async getPopularSectors(limit: number = 5): Promise<Array<{sector: string, merchant_count: number}>> {
    try {
      const { data, error } = await supabase
        .from('merchant_profiles')
        .select('business_sector')
        .eq('verification_status', 'verified');

      if (error) {
        console.error('Error fetching popular sectors:', error);
        return [];
      }

      // Compter les occurrences
      const sectorCounts = data.reduce((acc, profile) => {
        const sector = profile.business_sector;
        acc[sector] = (acc[sector] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Trier et limiter
      return Object.entries(sectorCounts)
        .map(([sector, count]) => ({ sector, merchant_count: count }))
        .sort((a, b) => b.merchant_count - a.merchant_count)
        .slice(0, limit);
    } catch (error) {
      console.error('Unexpected error fetching popular sectors:', error);
      return [];
    }
  }
}

export default BusinessSectorService;

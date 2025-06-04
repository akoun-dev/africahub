
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type SectorRow = Database['public']['Tables']['sectors']['Row'];
export type SectorInsert = Database['public']['Tables']['sectors']['Insert'];
export type SectorUpdate = Database['public']['Tables']['sectors']['Update'];

// Type explicite pour les mises à jour partielles - résout les conflits de typage
export type SectorPartialUpdate = {
  name?: string;
  slug?: string;
  description?: string | null;
  icon?: string;
  color?: string;
  is_active?: boolean;
  updated_at?: string;
};

// Type pour les résultats avec gestion d'erreur
export type SectorCreateResult = {
  data: SectorRow | null;
  error: string | null;
};

// Type guard pour valider les données de création
export const isValidSectorCreateInput = (data: Partial<SectorInsert>): data is SectorInsert => {
  return !!(data.name && data.slug && data.name.trim() && data.slug.trim());
};

export class SectorRepository {
  /**
   * Récupère tous les secteurs actifs
   */
  static async getActiveSectors() {
    const { data, error } = await supabase
      .from('sectors')
      .select('id, name, slug, description, icon, color, is_active, created_at, updated_at')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Récupère un secteur par son slug
   */
  static async getSectorBySlug(slug: string) {
    const { data, error } = await supabase
      .from('sectors')
      .select('id, name, slug, description, icon, color, is_active, created_at, updated_at')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Récupère un secteur par son ID
   */
  static async getSectorById(id: string) {
    const { data, error } = await supabase
      .from('sectors')
      .select('id, name, slug, description, icon, color, is_active, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Crée un nouveau secteur avec validation interne
   */
  static async createSector(sectorInput: Partial<SectorInsert>): Promise<SectorCreateResult> {
    // Validation des champs requis
    if (!sectorInput.name || !sectorInput.name.trim()) {
      return { data: null, error: 'Le nom du secteur est requis' };
    }

    if (!sectorInput.slug || !sectorInput.slug.trim()) {
      return { data: null, error: 'Le slug du secteur est requis' };
    }

    // Validation du format du slug
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(sectorInput.slug)) {
      return { data: null, error: 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets' };
    }

    // Construire l'objet SectorInsert valide
    const sectorData: SectorInsert = {
      name: sectorInput.name,
      slug: sectorInput.slug,
      description: sectorInput.description || null,
      icon: sectorInput.icon || 'Shield',
      color: sectorInput.color || '#3B82F6',
      is_active: sectorInput.is_active !== undefined ? sectorInput.is_active : true
    };

    try {
      const { data, error } = await supabase
        .from('sectors')
        .insert([sectorData])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur lors de la création du secteur' };
    }
  }

  /**
   * Met à jour un secteur
   */
  static async updateSector(id: string, updates: SectorPartialUpdate): Promise<SectorRow> {
    // Convertir vers le type Supabase natif en excluant les undefined
    const supabaseUpdate: Partial<SectorUpdate> = {};
    
    if (updates.name !== undefined) supabaseUpdate.name = updates.name;
    if (updates.slug !== undefined) supabaseUpdate.slug = updates.slug;
    if (updates.description !== undefined) supabaseUpdate.description = updates.description;
    if (updates.icon !== undefined) supabaseUpdate.icon = updates.icon;
    if (updates.color !== undefined) supabaseUpdate.color = updates.color;
    if (updates.is_active !== undefined) supabaseUpdate.is_active = updates.is_active;
    if (updates.updated_at !== undefined) supabaseUpdate.updated_at = updates.updated_at;

    const { data, error } = await supabase
      .from('sectors')
      .update(supabaseUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Supprime un secteur (soft delete - marque comme inactif)
   */
  static async deleteSector(id: string) {
    const { data, error } = await supabase
      .from('sectors')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

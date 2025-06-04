
import { z } from 'zod';
import { SectorRepository, type SectorRow, type SectorCreateResult, type SectorPartialUpdate } from '@/repositories/sector.repository';

// Schémas de validation Zod alignés avec les types du repository
export const SectorCreateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  slug: z.string().min(1, 'Le slug est requis').regex(/^[a-z0-9-]+$/, 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'),
  description: z.string().optional(),
  icon: z.string().optional().default('Shield'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'La couleur doit être un code hexadécimal valide').optional().default('#3B82F6'),
  is_active: z.boolean().optional().default(true)
});

export const SectorUpdateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères').optional(),
  slug: z.string().min(1, 'Le slug est requis').regex(/^[a-z0-9-]+$/, 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets').optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'La couleur doit être un code hexadécimal valide').optional(),
  is_active: z.boolean().optional()
});

export class SectorService {
  /**
   * Récupère tous les secteurs avec gestion du cache
   */
  static async getAllSectors(): Promise<SectorRow[]> {
    try {
      return await SectorRepository.getActiveSectors();
    } catch (error) {
      console.error('Erreur lors de la récupération des secteurs:', error);
      throw new Error('Impossible de charger les secteurs');
    }
  }

  /**
   * Récupère un secteur par slug avec validation
   */
  static async getSectorBySlug(slug: string): Promise<SectorRow> {
    if (!slug || typeof slug !== 'string') {
      throw new Error('Slug de secteur invalide');
    }

    try {
      return await SectorRepository.getSectorBySlug(slug);
    } catch (error) {
      console.error(`Erreur lors de la récupération du secteur ${slug}:`, error);
      throw new Error('Secteur non trouvé');
    }
  }

  /**
   * Crée un nouveau secteur avec validation et gestion d'erreur améliorée
   */
  static async createSector(sectorData: unknown): Promise<SectorRow> {
    // Validation des données d'entrée avec Zod
    const validatedData = SectorCreateSchema.parse(sectorData);

    // Vérification de l'unicité du slug
    try {
      await SectorRepository.getSectorBySlug(validatedData.slug);
      throw new Error('Un secteur avec ce slug existe déjà');
    } catch (error) {
      // Si le secteur n'existe pas, c'est parfait
      if (error instanceof Error && error.message !== 'Secteur non trouvé') {
        throw error;
      }
    }

    // Utiliser la nouvelle méthode createSector qui gère la validation interne
    const result: SectorCreateResult = await SectorRepository.createSector(validatedData);
    
    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.data) {
      throw new Error('Impossible de créer le secteur');
    }

    return result.data;
  }

  /**
   * Met à jour un secteur avec validation
   */
  static async updateSector(id: string, updates: unknown): Promise<SectorRow> {
    if (!id) {
      throw new Error('ID de secteur requis');
    }

    // Validation des données de mise à jour
    const validatedUpdates = SectorUpdateSchema.parse(updates);

    // Si le slug est modifié, vérifier son unicité
    if (validatedUpdates.slug) {
      try {
        const existingSector = await SectorRepository.getSectorBySlug(validatedUpdates.slug);
        if (existingSector.id !== id) {
          throw new Error('Un autre secteur utilise déjà ce slug');
        }
      } catch (error) {
        if (error instanceof Error && error.message !== 'Secteur non trouvé') {
          throw error;
        }
      }
    }

    try {
      // Vérifier qu'il y a au moins un champ à mettre à jour
      if (Object.keys(validatedUpdates).length === 0) {
        throw new Error('Aucune donnée à mettre à jour');
      }

      // Créer l'objet de mise à jour avec le bon typage
      const updateData: SectorPartialUpdate = {
        ...(validatedUpdates.name !== undefined && { name: validatedUpdates.name }),
        ...(validatedUpdates.slug !== undefined && { slug: validatedUpdates.slug }),
        ...(validatedUpdates.description !== undefined && { description: validatedUpdates.description }),
        ...(validatedUpdates.icon !== undefined && { icon: validatedUpdates.icon }),
        ...(validatedUpdates.color !== undefined && { color: validatedUpdates.color }),
        ...(validatedUpdates.is_active !== undefined && { is_active: validatedUpdates.is_active }),
      };

      return await SectorRepository.updateSector(id, updateData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du secteur:', error);
      throw new Error('Impossible de mettre à jour le secteur');
    }
  }

  /**
   * Supprime un secteur (soft delete)
   */
  static async deleteSector(id: string): Promise<SectorRow> {
    if (!id) {
      throw new Error('ID de secteur requis');
    }

    try {
      return await SectorRepository.deleteSector(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du secteur:', error);
      throw new Error('Impossible de supprimer le secteur');
    }
  }

  /**
   * Valide la cohérence des données d'un secteur
   */
  static validateSectorData(sector: SectorRow): boolean {
    return !!(
      sector.name &&
      sector.slug &&
      sector.color &&
      sector.icon
    );
  }

  /**
   * Génère un slug à partir d'un nom
   */
  static generateSlugFromName(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/-+/g, '-') // Supprime les tirets multiples
      .trim()
      .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
  }
}

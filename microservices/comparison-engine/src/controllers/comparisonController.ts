
import { Request, Response } from 'express';
import { ComparisonEngine } from '../services/ComparisonEngine';
import { logger } from '../utils/logger';

export class ComparisonController {
  static async compareProducts(req: Request, res: Response): Promise<void> {
    try {
      const { product_ids, criteria_weights, user_preferences, country_code } = req.body;

      const comparison = await ComparisonEngine.compareProducts({
        productIds: product_ids,
        criteriaWeights: criteria_weights || {},
        userPreferences: user_preferences || {},
        countryCode: country_code
      });

      res.json({
        success: true,
        data: comparison
      });
    } catch (error) {
      logger.error('Error comparing products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to compare products'
      });
    }
  }

  static async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { sector_slug, country_code, user_preferences, limit = 5 } = req.body;

      const recommendations = await ComparisonEngine.getRecommendations({
        sectorSlug: sector_slug,
        countryCode: country_code,
        userPreferences: user_preferences || {},
        limit
      });

      res.json({
        success: true,
        data: recommendations,
        count: recommendations.length
      });
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recommendations'
      });
    }
  }

  static async getComparisonMatrix(req: Request, res: Response): Promise<void> {
    try {
      const { sectorSlug } = req.params;
      const { country_code, limit = 20 } = req.query;

      const matrix = await ComparisonEngine.getComparisonMatrix(
        sectorSlug,
        country_code as string,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: matrix
      });
    } catch (error) {
      logger.error('Error getting comparison matrix:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get comparison matrix'
      });
    }
  }

  static async scoreProducts(req: Request, res: Response): Promise<void> {
    try {
      const { products, criteria_weights, scoring_algorithm = 'weighted_average' } = req.body;

      const scores = await ComparisonEngine.scoreProducts({
        products,
        criteriaWeights: criteria_weights || {},
        algorithm: scoring_algorithm
      });

      res.json({
        success: true,
        data: scores
      });
    } catch (error) {
      logger.error('Error scoring products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to score products'
      });
    }
  }
}


import { Request, Response } from 'express';
import { ContentModel } from '../models/ContentModel';
import { logger } from '../utils/logger';

export class ContentController {
  static async getContent(req: Request, res: Response): Promise<void> {
    try {
      const { contentKey } = req.params;
      const { country, sector, language } = req.query;

      const content = await ContentModel.getContent(contentKey, {
        country: country as string,
        sector: sector as string,
        language: language as string
      });

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found'
        });
        return;
      }

      res.json({
        success: true,
        data: content
      });
    } catch (error) {
      logger.error('Error in getContent controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getAllContent(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        country: req.query.country as string,
        sector: req.query.sector as string,
        language: req.query.language as string,
        status: req.query.status as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
      };

      const result = await ContentModel.getAllContent(filters);

      res.json({
        success: true,
        data: result.content,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logger.error('Error in getAllContent controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async createContent(req: Request, res: Response): Promise<void> {
    try {
      const content = await ContentModel.createContent(req.body);

      if (!content) {
        res.status(400).json({
          success: false,
          error: 'Failed to create content'
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: content
      });
    } catch (error) {
      logger.error('Error in createContent controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async updateContent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const content = await ContentModel.updateContent(id, req.body);

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found'
        });
        return;
      }

      res.json({
        success: true,
        data: content
      });
    } catch (error) {
      logger.error('Error in updateContent controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async deleteContent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await ContentModel.deleteContent(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Content not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Content deleted successfully'
      });
    } catch (error) {
      logger.error('Error in deleteContent controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

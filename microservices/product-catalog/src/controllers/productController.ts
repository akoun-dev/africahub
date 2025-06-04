
import { Request, Response } from 'express';
import { ProductModel } from '../models/ProductModel';
import { logger } from '../utils/logger';

export class ProductController {
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        sector, 
        country, 
        active_only = 'true' 
      } = req.query;

      const filters = {
        search: search as string,
        sector: sector as string,
        country: country as string,
        active_only: active_only === 'true',
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };

      const result = await ProductModel.getAllProducts(filters);

      res.json({
        success: true,
        data: result.products,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logger.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      });
    }
  }

  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductModel.getProductById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch product'
      });
    }
  }

  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductModel.createProduct(req.body);

      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create product'
      });
    }
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductModel.updateProduct(id, req.body);

      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update product'
      });
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await ProductModel.deleteProduct(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete product'
      });
    }
  }

  static async getProductsBySector(req: Request, res: Response): Promise<void> {
    try {
      const { sectorSlug } = req.params;
      const { country, limit = 50 } = req.query;

      const products = await ProductModel.getProductsBySector(
        sectorSlug,
        country as string,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      logger.error('Error fetching products by sector:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      });
    }
  }

  static async getProductsByCountry(req: Request, res: Response): Promise<void> {
    try {
      const { countryCode } = req.params;
      const { sector, limit = 50 } = req.query;

      const products = await ProductModel.getProductsByCountry(
        countryCode,
        sector as string,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      logger.error('Error fetching products by country:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      });
    }
  }

  static async bulkCreateProducts(req: Request, res: Response): Promise<void> {
    try {
      const { products } = req.body;

      if (!Array.isArray(products)) {
        res.status(400).json({
          success: false,
          error: 'Products must be an array'
        });
        return;
      }

      const result = await ProductModel.bulkCreateProducts(products);

      res.status(201).json({
        success: true,
        data: result,
        message: `${result.length} products created successfully`
      });
    } catch (error) {
      logger.error('Error bulk creating products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create products'
      });
    }
  }

  static async duplicateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { target_countries, price_multiplier = 1.0 } = req.body;

      if (!target_countries || !Array.isArray(target_countries)) {
        res.status(400).json({
          success: false,
          error: 'target_countries must be an array'
        });
        return;
      }

      const duplicatedProducts = await ProductModel.duplicateProduct(
        id,
        target_countries,
        parseFloat(price_multiplier)
      );

      res.status(201).json({
        success: true,
        data: duplicatedProducts,
        message: `Product duplicated to ${target_countries.length} countries`
      });
    } catch (error) {
      logger.error('Error duplicating product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to duplicate product'
      });
    }
  }
}

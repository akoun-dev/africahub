
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { standardResponse } from '../middleware/apiStandards';
import { logger } from '../utils/logger';

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
}

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_ISSUER = process.env.JWT_ISSUER || 'africahub-api';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'africahub-services';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// Generate JWT Token
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>): string => {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithm: 'HS256'
    }
  );
};

// Verify JWT Token
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ['HS256']
    }) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// JWT Authentication Middleware
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        standardResponse.error(
          'MISSING_TOKEN',
          'Authorization token is required'
        )
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    (req as AuthenticatedRequest).user = decoded;
    
    logger.debug('JWT Authentication successful', {
      userId: decoded.sub,
      requestId: req.requestId
    });
    
    next();
  } catch (error) {
    logger.warn('JWT Authentication failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId: req.requestId
    });
    
    return res.status(401).json(
      standardResponse.error(
        'INVALID_TOKEN',
        'Invalid or expired authorization token'
      )
    );
  }
};

// Role-based authorization middleware
export const requireRole = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user) {
      return res.status(401).json(
        standardResponse.error(
          'UNAUTHORIZED',
          'Authentication required'
        )
      );
    }

    const hasRole = requiredRoles.some(role => user.roles.includes(role));
    
    if (!hasRole) {
      logger.warn('Access denied - insufficient permissions', {
        userId: user.sub,
        userRoles: user.roles,
        requiredRoles,
        requestId: req.requestId
      });
      
      return res.status(403).json(
        standardResponse.error(
          'INSUFFICIENT_PERMISSIONS',
          'Insufficient permissions to access this resource'
        )
      );
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user) {
      return res.status(401).json(
        standardResponse.error(
          'UNAUTHORIZED',
          'Authentication required'
        )
      );
    }

    const hasPermission = requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    );
    
    if (!hasPermission) {
      logger.warn('Access denied - missing permissions', {
        userId: user.sub,
        userPermissions: user.permissions,
        requiredPermissions,
        requestId: req.requestId
      });
      
      return res.status(403).json(
        standardResponse.error(
          'MISSING_PERMISSIONS',
          'Required permissions not found'
        )
      );
    }

    next();
  };
};

// Optional authentication (user info if available)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      (req as AuthenticatedRequest).user = decoded;
    } catch (error) {
      // Continue without user info if token is invalid
      logger.debug('Optional auth failed, continuing without user', {
        requestId: req.requestId
      });
    }
  }
  
  next();
};

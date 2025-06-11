
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Base OpenAPI configuration
const baseOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AfricaHub Microservices API',
      version: '1.0.0',
      description: 'API documentation for AfricaHub microservices architecture',
      contact: {
        name: 'AfricaHub Development Team',
        email: 'dev@africahub.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server'
      },
      {
        url: 'https://api.africahub.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authorization header using the Bearer scheme'
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for external integrations'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR'
                },
                message: {
                  type: 'string',
                  example: 'Validation failed'
                },
                details: {
                  type: 'object'
                }
              }
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time'
                },
                requestId: {
                  type: 'string'
                }
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object'
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time'
                },
                requestId: {
                  type: 'string'
                }
              }
            }
          }
        },
        PaginatedResponse: {
          allOf: [
            { $ref: '#/components/schemas/SuccessResponse' },
            {
              type: 'object',
              properties: {
                meta: {
                  type: 'object',
                  properties: {
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer', minimum: 1 },
                        limit: { type: 'integer', minimum: 1, maximum: 100 },
                        total: { type: 'integer', minimum: 0 },
                        pages: { type: 'integer', minimum: 0 }
                      }
                    }
                  }
                }
              }
            }
          ]
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'unhealthy', 'degraded']
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            service: {
              type: 'string'
            },
            version: {
              type: 'string'
            },
            uptime: {
              type: 'number'
            },
            checks: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['pass', 'fail', 'warn']
                  },
                  time: {
                    type: 'string'
                  },
                  error: {
                    type: 'string'
                  },
                  metadata: {
                    type: 'object'
                  }
                }
              }
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20
          }
        },
        CountryCodeParam: {
          name: 'countryCode',
          in: 'query',
          description: 'Country code filter (ISO 3166-1 alpha-2)',
          required: false,
          schema: {
            type: 'string',
            pattern: '^[A-Z]{2}$',
            example: 'CM'
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: [] // Will be populated by service-specific configurations
};

// Service-specific API documentation generators
export const createServiceDocs = (
  serviceName: string,
  serviceDescription: string,
  apiPaths: string[],
  additionalSchemas?: any
) => {
  const options = {
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      info: {
        ...baseOptions.definition.info,
        title: `${serviceName} API`,
        description: serviceDescription
      },
      components: {
        ...baseOptions.definition.components,
        schemas: {
          ...baseOptions.definition.components.schemas,
          ...additionalSchemas
        }
      }
    },
    apis: apiPaths
  };

  return swaggerJsdoc(options);
};

// Setup Swagger UI for a service
export const setupSwaggerDocs = (
  app: Express,
  serviceName: string,
  serviceDescription: string,
  apiPaths: string[],
  additionalSchemas?: any
) => {
  const specs = createServiceDocs(serviceName, serviceDescription, apiPaths, additionalSchemas);
  
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: `${serviceName} API Documentation`,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true
    }
  }));

  // Serve OpenAPI JSON
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  return specs;
};

// Common API path annotations for reuse
export const commonAnnotations = {
  healthCheck: `
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get service health status
 *     description: Returns comprehensive health check information
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Service is healthy or degraded
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/HealthCheck'
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/HealthCheck'
 */
`,

  liveness: `
/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     description: Check if service is alive (basic health check)
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
`,

  readiness: `
/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe
 *     description: Check if service is ready to serve requests
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       503:
 *         description: Service is not ready
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
`
};

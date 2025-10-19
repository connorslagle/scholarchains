import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { corsMiddleware } from './middleware/cors.js';
import timestampRoutes from './routes/timestamps.js';
import { swaggerSpec } from './swagger.js';

dotenv.config();

// Validate environment configuration
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Log configuration (helps with debugging)
console.log(`Environment: ${NODE_ENV}`);
console.log(`Port: ${PORT}`);

if (process.env.ALLOWED_ORIGINS) {
  console.log(`CORS Origins: ${process.env.ALLOWED_ORIGINS}`);
} else {
  console.warn('ALLOWED_ORIGINS not set - using defaults');
}

const app = express();

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ScholarChains Backend API Documentation',
}));

// OpenAPI JSON spec
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/timestamp', timestampRoutes);

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Health
 *     summary: Root endpoint
 *     description: Returns API information and available endpoints
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 version:
 *                   type: string
 *                 description:
 *                   type: string
 *                 documentation:
 *                   type: string
 *                 endpoints:
 *                   type: object
 */
app.get('/', (_req, res) => {
  res.json({
    name: 'ScholarChains Backend',
    version: '1.0.0',
    description: 'OpenTimestamps API for ScholarChains',
    documentation: '/api-docs',
    endpoints: {
      health: 'GET /api/timestamp/health',
      create: 'POST /api/timestamp/create',
      verify: 'POST /api/timestamp/verify',
      upgrade: 'POST /api/timestamp/upgrade',
    },
  });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ ScholarChains Backend running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API Root: http://localhost:${PORT}/`);
});

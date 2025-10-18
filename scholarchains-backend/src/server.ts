import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/cors.js';
import timestampRoutes from './routes/timestamps.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use('/api/timestamp', timestampRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'ScholarChains Backend',
    version: '1.0.0',
    description: 'OpenTimestamps API for ScholarChains',
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
  console.log(`ScholarChains Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

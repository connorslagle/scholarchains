import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import router from './timestamps.js';

// Mock the opentimestamps library
vi.mock('../lib/opentimestamps.js', () => ({
  createTimestamp: vi.fn().mockResolvedValue({
    proof: 'mockProofBase64',
    info: {
      timestamp: 1708774162,
      isPending: true,
    },
  }),
  verifyTimestamp: vi.fn().mockResolvedValue({
    timestamp: 1708774162,
    blockHeight: 850000,
    blockHash: '00000000000000000001234567890abcdef',
    isPending: false,
  }),
  upgradeTimestamp: vi.fn().mockResolvedValue('upgradedProofBase64'),
  DEFAULT_CALENDARS: [
    'https://alice.btc.calendar.opentimestamps.org',
    'https://bob.btc.calendar.opentimestamps.org',
  ],
}));

// Mock rate limiters
vi.mock('../middleware/ratelimit.js', () => ({
  createRateLimiter: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
  verifyRateLimiter: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
  upgradeRateLimiter: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

describe('Timestamp Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/timestamp', router);
  });

  describe('GET /api/timestamp/health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/api/timestamp/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
      });
    });
  });

  describe('POST /api/timestamp/create', () => {
    it('should create a timestamp with valid data', async () => {
      const response = await request(app)
        .post('/api/timestamp/create')
        .send({ data: 'test data' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('proof', 'mockProofBase64');
      expect(response.body).toHaveProperty('info');
      expect(response.body.info).toHaveProperty('timestamp');
      expect(response.body.info).toHaveProperty('isPending', true);
    });

    it('should reject request without data', async () => {
      const response = await request(app)
        .post('/api/timestamp/create')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should accept custom calendars', async () => {
      const response = await request(app)
        .post('/api/timestamp/create')
        .send({
          data: 'test data',
          calendars: ['https://custom.calendar.org'],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('proof');
    });
  });

  describe('POST /api/timestamp/verify', () => {
    it('should verify a valid timestamp', async () => {
      const response = await request(app)
        .post('/api/timestamp/verify')
        .send({
          proof: 'mockProofBase64',
          data: 'test data',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('blockHeight', 850000);
      expect(response.body).toHaveProperty('isPending', false);
    });

    it('should reject request without proof', async () => {
      const response = await request(app)
        .post('/api/timestamp/verify')
        .send({ data: 'test data' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject request without data', async () => {
      const response = await request(app)
        .post('/api/timestamp/verify')
        .send({ proof: 'mockProofBase64' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/timestamp/upgrade', () => {
    it('should upgrade a pending timestamp', async () => {
      const response = await request(app)
        .post('/api/timestamp/upgrade')
        .send({ proof: 'mockProofBase64' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('proof', 'upgradedProofBase64');
    });

    it('should reject request without proof', async () => {
      const response = await request(app)
        .post('/api/timestamp/upgrade')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});

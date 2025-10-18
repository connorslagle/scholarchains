import express from 'express';
import {
  createTimestamp,
  verifyTimestamp,
  upgradeTimestamp,
  DEFAULT_CALENDARS,
} from '../lib/opentimestamps.js';
import {
  createRateLimiter,
  verifyRateLimiter,
  upgradeRateLimiter,
} from '../middleware/ratelimit.js';

const router = express.Router();

/**
 * POST /api/timestamp/create
 * Create a new OpenTimestamps proof
 */
router.post('/create', createRateLimiter, async (req, res) => {
  try {
    const { data, calendars } = req.body;

    if (!data) {
      return res.status(400).json({
        error: 'Missing required field: data',
      });
    }

    if (typeof data !== 'string') {
      return res.status(400).json({
        error: 'Field "data" must be a string',
      });
    }

    // Validate calendars if provided
    const calendarServers = calendars || DEFAULT_CALENDARS;
    if (!Array.isArray(calendarServers)) {
      return res.status(400).json({
        error: 'Field "calendars" must be an array of URLs',
      });
    }

    const result = await createTimestamp(data, calendarServers);

    res.json({
      proof: result.proof,
      info: result.info,
    });
  } catch (error) {
    console.error('Create timestamp error:', error);
    res.status(500).json({
      error: 'Failed to create timestamp',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/timestamp/verify
 * Verify an OpenTimestamps proof
 */
router.post('/verify', verifyRateLimiter, async (req, res) => {
  try {
    const { proof, data } = req.body;

    if (!proof || !data) {
      return res.status(400).json({
        error: 'Missing required fields: proof, data',
      });
    }

    if (typeof proof !== 'string' || typeof data !== 'string') {
      return res.status(400).json({
        error: 'Fields "proof" and "data" must be strings',
      });
    }

    const result = await verifyTimestamp(proof, data);

    res.json(result);
  } catch (error) {
    console.error('Verify timestamp error:', error);
    res.status(500).json({
      error: 'Failed to verify timestamp',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/timestamp/upgrade
 * Upgrade a pending OpenTimestamps proof
 */
router.post('/upgrade', upgradeRateLimiter, async (req, res) => {
  try {
    const { proof } = req.body;

    if (!proof) {
      return res.status(400).json({
        error: 'Missing required field: proof',
      });
    }

    if (typeof proof !== 'string') {
      return res.status(400).json({
        error: 'Field "proof" must be a string',
      });
    }

    const upgradedProof = await upgradeTimestamp(proof);

    res.json({
      proof: upgradedProof,
      upgraded: upgradedProof !== proof,
    });
  } catch (error) {
    console.error('Upgrade timestamp error:', error);
    res.status(500).json({
      error: 'Failed to upgrade timestamp',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/timestamp/health
 * Health check endpoint
 */
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;

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
 * @openapi
 * /api/timestamp/create:
 *   post:
 *     tags:
 *       - Timestamps
 *     summary: Create a new OpenTimestamps proof
 *     description: Creates a cryptographic timestamp proof for arbitrary data using OpenTimestamps calendar servers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTimestampRequest'
 *     responses:
 *       200:
 *         description: Timestamp proof created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateTimestampResponse'
 *       400:
 *         description: Bad request - invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests - rate limit exceeded
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @openapi
 * /api/timestamp/verify:
 *   post:
 *     tags:
 *       - Timestamps
 *     summary: Verify an OpenTimestamps proof
 *     description: Verifies a timestamp proof against the original data to check Bitcoin confirmation status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyTimestampRequest'
 *     responses:
 *       200:
 *         description: Verification result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimestampInfo'
 *       400:
 *         description: Bad request - invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests - rate limit exceeded
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @openapi
 * /api/timestamp/upgrade:
 *   post:
 *     tags:
 *       - Timestamps
 *     summary: Upgrade a pending OpenTimestamps proof
 *     description: Checks if a pending timestamp has been confirmed in a Bitcoin block and upgrades the proof if available
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpgradeTimestampRequest'
 *     responses:
 *       200:
 *         description: Upgrade result (may return original proof if still pending)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpgradeTimestampResponse'
 *       400:
 *         description: Bad request - invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests - rate limit exceeded
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @openapi
 * /api/timestamp/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check endpoint
 *     description: Returns the service health status and current timestamp
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;

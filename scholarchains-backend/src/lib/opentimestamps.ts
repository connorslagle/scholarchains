/**
 * OpenTimestamps Library Wrapper
 * Real implementation using opentimestamps npm package (works in Node.js)
 */

import { createHash } from 'crypto';
import { createRequire } from 'module';

// Import opentimestamps (CommonJS library) using createRequire for ESM compat
const require = createRequire(import.meta.url);
const openTimestamps = require('opentimestamps');

// Default OpenTimestamps calendar servers
export const DEFAULT_CALENDARS = [
  'https://alice.btc.calendar.opentimestamps.org',
  'https://bob.btc.calendar.opentimestamps.org',
  'https://finney.calendar.eternitywall.com',
];

export interface TimestampInfo {
  timestamp?: number;
  blockHeight?: number;
  blockHash?: string;
  isPending?: boolean;
}

export interface TimestampResult {
  proof: string; // base64 encoded OTS proof
  info: TimestampInfo;
}

/**
 * Calculate SHA256 hash of data
 */
export function sha256(data: string | Buffer): Buffer {
  const dataBuffer = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
  return createHash('sha256').update(dataBuffer).digest();
}

/**
 * Create an OpenTimestamps proof for data
 * @param data - The data to timestamp (string or bytes)
 * @param calendars - Optional custom calendar servers
 * @returns Base64-encoded OTS proof
 */
export async function createTimestamp(
  data: string | Buffer,
  calendars: string[] = DEFAULT_CALENDARS
): Promise<TimestampResult> {
  try {
    // Calculate hash
    const hash = sha256(data);

    // Create detached timestamp file
    const detached = openTimestamps.DetachedTimestampFile.fromHash(
      new openTimestamps.Ops.OpSHA256(),
      hash
    );

    // Stamp with calendar servers using the low-level stamp function
    await openTimestamps.stamp(detached, calendars);

    // Serialize to bytes
    const otsBytes = detached.serializeToBytes();

    // Convert to base64
    const proof = Buffer.from(otsBytes).toString('base64');

    return {
      proof,
      info: { isPending: true },
    };
  } catch (error) {
    console.error('Failed to create timestamp:', error);
    throw new Error(
      `Failed to create OpenTimestamps proof: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Verify an OpenTimestamps proof
 * @param proofBase64 - Base64-encoded OTS proof
 * @param data - The original data that was timestamped
 * @returns Verification result with timestamp info
 */
export async function verifyTimestamp(
  proofBase64: string,
  data: string | Buffer
): Promise<TimestampInfo> {
  try {
    // Decode base64 proof
    const otsBytes = Buffer.from(proofBase64, 'base64');

    // Deserialize timestamp
    const detached = openTimestamps.DetachedTimestampFile.deserialize(otsBytes);

    // Calculate hash of data
    const hash = sha256(data);

    // Create a file hash object
    const fileHash = openTimestamps.DetachedTimestampFile.fromHash(
      new openTimestamps.Ops.OpSHA256(),
      hash
    );

    // Verify the timestamp using low-level verify
    const result = await openTimestamps.verify(detached, fileHash);

    if (!result || result === 0) {
      return { isPending: true };
    }

    // Result is a timestamp in seconds
    return {
      timestamp: result,
      isPending: false,
    };
  } catch (error) {
    console.error('Failed to verify timestamp:', error);
    // If verification fails, it's likely still pending
    return { isPending: true };
  }
}

/**
 * Get information about a timestamp without full verification
 * @param detached - Detached timestamp file or base64 proof
 * @returns Timestamp information
 */
export async function getTimestampInfo(
  detached: any | string
): Promise<TimestampInfo> {
  try {
    let timestampFile: any;

    if (typeof detached === 'string') {
      const otsBytes = Buffer.from(detached, 'base64');
      timestampFile = openTimestamps.DetachedTimestampFile.deserialize(otsBytes);
    } else {
      timestampFile = detached;
    }

    const infoResult = await openTimestamps.info(timestampFile);

    // Parse the info result to extract details
    const isPending = infoResult.includes('pending') || infoResult.includes('Pending');

    return {
      isPending,
    };
  } catch (error) {
    console.error('Failed to get timestamp info:', error);
    return { isPending: true };
  }
}

/**
 * Upgrade a pending timestamp (check if it's been included in a block)
 * @param proofBase64 - Base64-encoded OTS proof
 * @returns Updated proof if upgraded, original if still pending
 */
export async function upgradeTimestamp(proofBase64: string): Promise<string> {
  try {
    const otsBytes = Buffer.from(proofBase64, 'base64');

    // Use the high-level upgradeTimestamp function
    const upgraded = await openTimestamps.upgradeTimestamp(otsBytes, DEFAULT_CALENDARS);

    return Buffer.from(upgraded).toString('base64');
  } catch (error) {
    console.error('Failed to upgrade timestamp:', error);
    // Return original proof if upgrade fails
    return proofBase64;
  }
}

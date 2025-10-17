/**
 * OpenTimestamps Utility Functions
 * Handles creation and verification of cryptographic timestamps
 *
 * This module wraps the opentimestamps CommonJS library to make it work with Vite/ESM.
 * We use dynamic imports to avoid Vite's static analysis issues with CommonJS modules.
 */

// Type definitions for OpenTimestamps
interface OTSDetachedTimestampFile {
  serializeToBytes(): Uint8Array;
}

interface OTSOps {
  OpSHA256: new () => unknown;
}

interface OTSDetachedTimestampFileConstructor {
  fromHash(op: unknown, hash: Uint8Array): OTSDetachedTimestampFile;
  deserialize(bytes: Uint8Array): OTSDetachedTimestampFile;
}

interface OTSModule {
  DetachedTimestampFile: OTSDetachedTimestampFileConstructor;
  Ops: OTSOps;
  stamp: (detached: OTSDetachedTimestampFile, calendars: string[]) => Promise<OTSDetachedTimestampFile>;
  verify: (detached: OTSDetachedTimestampFile, hash: Uint8Array) => Promise<{ timestamp: number; height: number } | undefined>;
  info: (detached: OTSDetachedTimestampFile) => string;
}

// Lazy-load the OpenTimestamps module
let otsModule: OTSModule | null = null;

async function loadOTS(): Promise<OTSModule> {
  if (otsModule) return otsModule;

  try {
    // Use a string variable to hide the import from Vite's static analysis
    const moduleName = 'opentimestamps';
    const module = await import(/* @vite-ignore */ moduleName);
    otsModule = module.default || module;
    return otsModule;
  } catch (error) {
    console.error('Failed to load OpenTimestamps module:', error);
    throw new Error('OpenTimestamps library not available');
  }
}

// Export wrapper functions that load OTS on demand
const getDetachedTimestampFile = async () => {
  const ots = await loadOTS();
  return ots.DetachedTimestampFile;
};

const getOps = async () => {
  const ots = await loadOTS();
  return ots.Ops;
};

const stamp = async (detached: OTSDetachedTimestampFile, calendars: string[]) => {
  const ots = await loadOTS();
  return ots.stamp(detached, calendars);
};

const verify = async (detached: OTSDetachedTimestampFile, hash: Uint8Array) => {
  const ots = await loadOTS();
  return ots.verify(detached, hash);
};

const info = async (detached: OTSDetachedTimestampFile) => {
  const ots = await loadOTS();
  return ots.info(detached);
};

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
export async function sha256(data: string | Uint8Array): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const dataBytes = typeof data === 'string' ? encoder.encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
  return new Uint8Array(hashBuffer);
}

/**
 * Create an OpenTimestamps proof for data
 * @param data - The data to timestamp (string or bytes)
 * @param calendars - Optional custom calendar servers
 * @returns Base64-encoded OTS proof
 */
export async function createTimestamp(
  data: string | Uint8Array,
  calendars: string[] = DEFAULT_CALENDARS
): Promise<TimestampResult> {
  try {
    // Calculate hash
    const hash = await sha256(data);

    // Get OTS classes
    const DetachedTimestampFile = await getDetachedTimestampFile();
    const Ops = await getOps();

    // Create detached timestamp file
    const detached = DetachedTimestampFile.fromHash(new Ops.OpSHA256(), hash);

    // Stamp with calendar servers
    const stamped = await stamp(detached, calendars);

    // Serialize to bytes
    const otsBytes = stamped.serializeToBytes();

    // Convert to base64
    const proof = Buffer.from(otsBytes).toString('base64');

    // Get info about the timestamp
    const timestampInfo = await getTimestampInfo(stamped);

    return {
      proof,
      info: timestampInfo,
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
  data: string | Uint8Array
): Promise<TimestampInfo> {
  try {
    // Decode base64 proof
    const otsBytes = Buffer.from(proofBase64, 'base64');

    // Get OTS classes
    const DetachedTimestampFile = await getDetachedTimestampFile();

    // Deserialize timestamp
    const detached = DetachedTimestampFile.deserialize(otsBytes);

    // Calculate hash of data
    const hash = await sha256(data);

    // Verify the timestamp
    const result = await verify(detached, hash);

    if (!result) {
      return { isPending: true };
    }

    // Extract timestamp information
    return {
      timestamp: result.timestamp,
      blockHeight: result.height,
      isPending: false,
    };
  } catch (error) {
    console.error('Failed to verify timestamp:', error);
    throw new Error(
      `Failed to verify OpenTimestamps proof: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get information about a timestamp without full verification
 * @param detached - Detached timestamp file or base64 proof
 * @returns Timestamp information
 */
export async function getTimestampInfo(
  detached: OTSDetachedTimestampFile | string
): Promise<TimestampInfo> {
  try {
    let timestampFile: OTSDetachedTimestampFile;

    if (typeof detached === 'string') {
      const otsBytes = Buffer.from(detached, 'base64');
      const DetachedTimestampFile = await getDetachedTimestampFile();
      timestampFile = DetachedTimestampFile.deserialize(otsBytes);
    } else {
      timestampFile = detached;
    }

    const infoResult = await info(timestampFile);

    // Parse the info result to extract details
    // The info function returns a human-readable string
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
 * Serialize OTS proof to base64 (for storage in Nostr events)
 */
export function serializeOtsToBase64(otsBytes: Uint8Array): string {
  return Buffer.from(otsBytes).toString('base64');
}

/**
 * Deserialize OTS proof from base64
 */
export function deserializeOtsFromBase64(base64: string): Uint8Array {
  return Buffer.from(base64, 'base64');
}

/**
 * Download OTS proof file (for offline verification)
 */
export function downloadOtsProof(proofBase64: string, filename: string = 'timestamp.ots'): void {
  try {
    const otsBytes = deserializeOtsFromBase64(proofBase64);
    const blob = new Blob([otsBytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download OTS proof:', error);
    throw new Error('Failed to download timestamp proof file');
  }
}

/**
 * Calculate hash of Nostr event (for timestamping)
 */
export async function calculateEventHash(eventData: {
  kind: number;
  content: string;
  tags: string[][];
  created_at: number;
}): Promise<Uint8Array> {
  // Create canonical JSON representation
  const canonical = JSON.stringify(eventData);
  return sha256(canonical);
}

/**
 * Upgrade a pending timestamp (check if it's been included in a block)
 * @param proofBase64 - Base64-encoded OTS proof
 * @returns Updated proof if upgraded, original if still pending
 */
export async function upgradeTimestamp(proofBase64: string): Promise<string> {
  try {
    const otsBytes = Buffer.from(proofBase64, 'base64');
    const DetachedTimestampFile = await getDetachedTimestampFile();
    const detached = DetachedTimestampFile.deserialize(otsBytes);

    // Upgrade the timestamp
    const upgraded = await stamp(detached, DEFAULT_CALENDARS);

    // Serialize and return
    const upgradedBytes = upgraded.serializeToBytes();
    return Buffer.from(upgradedBytes).toString('base64');
  } catch (error) {
    console.error('Failed to upgrade timestamp:', error);
    // Return original proof if upgrade fails
    return proofBase64;
  }
}

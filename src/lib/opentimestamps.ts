/**
 * OpenTimestamps Client Library
 * Handles communication with the ScholarChains backend API for OpenTimestamps operations
 */

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Validate API URL configuration
if (!API_URL || !API_URL.startsWith('http')) {
  console.warn(
    'VITE_API_URL is not properly configured. Using default: http://localhost:3001'
  );
}

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
    // Convert Uint8Array to string for API transmission
    const dataString = typeof data === 'string' ? data : new TextDecoder().decode(data);

    const response = await fetch(`${API_URL}/api/timestamp/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: dataString,
        calendars,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create timestamp');
    }

    const result = await response.json();
    return result;
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
    // Convert Uint8Array to string for API transmission
    const dataString = typeof data === 'string' ? data : new TextDecoder().decode(data);

    const response = await fetch(`${API_URL}/api/timestamp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proof: proofBase64,
        data: dataString,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify timestamp');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to verify timestamp:', error);
    throw new Error(
      `Failed to verify OpenTimestamps proof: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get information about a timestamp without full verification
 * @param _proofBase64 - Base64-encoded OTS proof (currently unused, always returns pending)
 * @returns Timestamp information
 */
export async function getTimestampInfo(
  _proofBase64: string
): Promise<TimestampInfo> {
  try {
    // For now, just return pending - verification will provide full info
    // This is a lightweight check without full blockchain verification
    return {
      isPending: true,
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
    const response = await fetch(`${API_URL}/api/timestamp/upgrade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proof: proofBase64,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upgrade timestamp');
    }

    const result = await response.json();
    return result.proof;
  } catch (error) {
    console.error('Failed to upgrade timestamp:', error);
    // Return original proof if upgrade fails
    return proofBase64;
  }
}

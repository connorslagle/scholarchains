/**
 * TypeScript declarations for opentimestamps npm package
 * The package doesn't provide its own type definitions
 */

declare module 'opentimestamps' {
  export class DetachedTimestampFile {
    static fromHash(op: Ops.OpSHA256, hash: Buffer): DetachedTimestampFile;
    static deserialize(bytes: Buffer): DetachedTimestampFile;
    serializeToBytes(): Buffer;
  }

  export namespace Ops {
    export class OpSHA256 {}
  }

  export function stamp(
    detached: DetachedTimestampFile,
    calendars: string[]
  ): Promise<DetachedTimestampFile>;

  export function verify(
    detached: DetachedTimestampFile,
    hash: Buffer
  ): Promise<{ timestamp: number; height: number; blockHash: string } | undefined>;

  export function upgrade(
    detached: DetachedTimestampFile,
    calendars: string[]
  ): Promise<void>;

  export function info(detached: DetachedTimestampFile): Promise<string>;
}

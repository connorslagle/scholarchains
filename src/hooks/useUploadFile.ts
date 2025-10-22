import { useMutation } from "@tanstack/react-query";
import { BlossomUploader } from '@nostrify/nostrify/uploaders';

import { useCurrentUser } from "./useCurrentUser";

// Default Blossom servers for redundancy
const DEFAULT_BLOSSOM_SERVERS = [
  'https://blossom.primal.net/',
  'https://blossom.satellite.earth/',
];

/**
 * Get configured Blossom servers from environment or defaults
 */
function getBlossomServers(): string[] {
  const envServers = import.meta.env.VITE_BLOSSOM_SERVERS;

  if (envServers) {
    // Parse comma-separated list from environment
    return envServers
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .map((s: string) => s.endsWith('/') ? s : `${s}/`);
  }

  return DEFAULT_BLOSSOM_SERVERS;
}

export function useUploadFile() {
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) {
        throw new Error('Must be logged in to upload files');
      }

      const servers = getBlossomServers();

      // Try each server in sequence until one succeeds
      let lastError: Error | null = null;

      for (const server of servers) {
        try {
          const uploader = new BlossomUploader({
            servers: [server],
            signer: user.signer,
          });

          const tags = await uploader.upload(file);

          // Add server info to tags for debugging
          console.log(`File uploaded successfully to ${server}`);

          return tags;
        } catch (error) {
          console.warn(`Failed to upload to ${server}:`, error);
          lastError = error as Error;
          // Continue to next server
        }
      }

      // All servers failed
      throw new Error(
        `Failed to upload file to all configured Blossom servers (${servers.length} tried). Last error: ${lastError?.message || 'Unknown error'}`
      );
    },
  });
}

/**
 * Get the list of configured Blossom servers (exported for UI display)
 */
export function getConfiguredBlossomServers(): string[] {
  return getBlossomServers();
}
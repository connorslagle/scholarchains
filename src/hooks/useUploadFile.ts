import { useMutation } from "@tanstack/react-query";
import { BlossomUploader } from '@nostrify/nostrify/uploaders';

import { useCurrentUser } from "./useCurrentUser";
import { useAppContext } from "./useAppContext";

// Default Blossom servers for redundancy
const DEFAULT_BLOSSOM_SERVERS = [
  'https://blossom.primal.net/',
  'https://blossom.satellite.earth/',
];

/**
 * Get configured Blossom servers from context, environment, or defaults
 */
function getBlossomServers(configServers?: string): string[] {
  // Priority: 1. User config from AppContext, 2. Environment variable, 3. Defaults
  const serverSource = configServers || import.meta.env.VITE_BLOSSOM_SERVERS;

  if (serverSource) {
    // Parse comma-separated list
    return serverSource
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .map((s: string) => s.endsWith('/') ? s : `${s}/`);
  }

  return DEFAULT_BLOSSOM_SERVERS;
}

export function useUploadFile() {
  const { user } = useCurrentUser();
  const { config } = useAppContext();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) {
        throw new Error('Must be logged in to upload files');
      }

      const servers = getBlossomServers(config.blossomServers);

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
 * @param configServers - Optional servers from user config
 */
export function getConfiguredBlossomServers(configServers?: string): string[] {
  return getBlossomServers(configServers);
}
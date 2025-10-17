/**
 * React Hook for OpenTimestamps Integration
 * Provides easy-to-use functions for timestamping in React components
 */

import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  createTimestamp,
  verifyTimestamp,
  upgradeTimestamp,
  downloadOtsProof,
  TimestampResult,
  TimestampInfo,
} from '@/lib/opentimestamps';

export interface UseOpenTimestampsReturn {
  // Mutation for creating timestamps
  createMutation: ReturnType<typeof useMutation<TimestampResult, Error, string | Uint8Array>>;

  // Mutation for verifying timestamps
  verifyMutation: ReturnType<
    typeof useMutation<TimestampInfo, Error, { proof: string; data: string | Uint8Array }>
  >;

  // Mutation for upgrading timestamps
  upgradeMutation: ReturnType<typeof useMutation<string, Error, string>>;

  // Helper functions
  download: (proof: string, filename?: string) => void;

  // State
  isCreating: boolean;
  isVerifying: boolean;
  isUpgrading: boolean;
}

/**
 * Hook for OpenTimestamps operations
 */
export function useOpenTimestamps(): UseOpenTimestampsReturn {
  // Create timestamp mutation
  const createMutation = useMutation({
    mutationFn: async (data: string | Uint8Array) => {
      return await createTimestamp(data);
    },
  });

  // Verify timestamp mutation
  const verifyMutation = useMutation({
    mutationFn: async ({ proof, data }: { proof: string; data: string | Uint8Array }) => {
      return await verifyTimestamp(proof, data);
    },
  });

  // Upgrade timestamp mutation
  const upgradeMutation = useMutation({
    mutationFn: async (proof: string) => {
      return await upgradeTimestamp(proof);
    },
  });

  // Download OTS proof file
  const download = useCallback((proof: string, filename?: string) => {
    downloadOtsProof(proof, filename);
  }, []);

  return {
    createMutation,
    verifyMutation,
    upgradeMutation,
    download,
    isCreating: createMutation.isPending,
    isVerifying: verifyMutation.isPending,
    isUpgrading: upgradeMutation.isPending,
  };
}

/**
 * Simplified hook for just creating timestamps
 */
export function useCreateTimestamp() {
  const { createMutation } = useOpenTimestamps();

  return {
    createTimestamp: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    error: createMutation.error,
    data: createMutation.data,
  };
}

/**
 * Simplified hook for just verifying timestamps
 */
export function useVerifyTimestamp() {
  const { verifyMutation } = useOpenTimestamps();

  return {
    verifyTimestamp: verifyMutation.mutateAsync,
    isVerifying: verifyMutation.isPending,
    error: verifyMutation.error,
    data: verifyMutation.data,
  };
}

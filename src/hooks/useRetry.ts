import { useState, useCallback } from 'react';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

export function useRetry() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffMultiplier = 2,
    } = options;

    let lastError: Error;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setAttemptCount(attempt);
        setIsRetrying(attempt > 1);

        const result = await operation();

        setIsRetrying(false);
        setAttemptCount(0);

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on the last attempt
        if (attempt === maxAttempts) {
          break;
        }

        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.min(delay, maxDelay)));
        delay *= backoffMultiplier;
      }
    }

    setIsRetrying(false);
    setAttemptCount(0);
    throw lastError!;
  }, []);

  return {
    retry,
    isRetrying,
    attemptCount,
  };
}

/**
 * Standalone retry function for use outside of React components
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on the last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.min(delay, maxDelay)));
      delay *= backoffMultiplier;
    }
  }

  throw lastError!;
}

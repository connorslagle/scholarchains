import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { retryOperation } from './useRetry';

export interface ReviewEvent extends NostrEvent {
  kind: 4597;
}

/**
 * Validate that a Nostr event is a proper ScholarChains review (kind 4597)
 */
function validateReview(event: NostrEvent): event is ReviewEvent {
  if (event.kind !== 4597) return false;

  // Required tags
  const a = event.tags.find(([name]) => name === 'a')?.[1];
  const p = event.tags.find(([name]) => name === 'p')?.[1];
  const b = event.tags.find(([name]) => name === 'b');

  if (!a || !p || !b) return false;

  // Bitcoin block hash should have height and hash
  if (b.length < 3 || !b[1] || !b[2]) return false;

  return true;
}

/**
 * Extract review metadata from tags
 */
export function getReviewMetadata(event: ReviewEvent) {
  const tags = event.tags;
  
  return {
    paperAddress: tags.find(([name]) => name === 'a')?.[1] || '',
    authorPubkey: tags.find(([name]) => name === 'p')?.[1] || '',
    blockHeight: tags.find(([name]) => name === 'b')?.[1] || '',
    blockHash: tags.find(([name]) => name === 'b')?.[2] || '',
    rating: tags.find(([name]) => name === 'rating')?.[1],
    verdict: tags.find(([name]) => name === 'verdict')?.[1] as 'accept' | 'reject' | 'revise' | 'comment' | undefined,
    aspects: tags.filter(([name]) => name === 'aspect').map(([, value]) => value),
    topics: tags.filter(([name]) => name === 't').map(([, value]) => value),
  };
}

/**
 * Hook to fetch reviews for a specific paper
 */
export function usePaperReviews(paperAddress: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['reviews', paperAddress],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);

      // Use retry logic for network resilience
      const events = await retryOperation(
        () => nostr.query([{
          kinds: [4597],
          '#a': [paperAddress],
        }], { signal }),
        { maxAttempts: 2, initialDelay: 500 }
      );

      // Validate and filter events
      const validReviews = events.filter(validateReview) as ReviewEvent[];
      
      // Sort by created_at descending (newest first)
      return validReviews.sort((a, b) => b.created_at - a.created_at);
    },
    enabled: !!paperAddress,
  });
}

/**
 * Hook to fetch all reviews by a specific reviewer
 */
export function useReviewerReviews(reviewerPubkey: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['reviewer-reviews', reviewerPubkey],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      const events = await nostr.query([{
        kinds: [4597],
        authors: [reviewerPubkey],
        limit: 50,
      }], { signal });

      const validReviews = events.filter(validateReview) as ReviewEvent[];
      
      return validReviews.sort((a, b) => b.created_at - a.created_at);
    },
    enabled: !!reviewerPubkey,
  });
}

/**
 * Calculate aggregate review stats for a paper
 */
export function getReviewStats(reviews: ReviewEvent[]) {
  const total = reviews.length;
  
  if (total === 0) {
    return {
      total: 0,
      averageRating: null,
      verdicts: {
        accept: 0,
        reject: 0,
        revise: 0,
        comment: 0,
      },
    };
  }

  const ratings = reviews
    .map(r => r.tags.find(([name]) => name === 'rating')?.[1])
    .filter((r): r is string => !!r)
    .map(r => parseFloat(r))
    .filter(r => !isNaN(r));

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    : null;

  const verdicts = {
    accept: 0,
    reject: 0,
    revise: 0,
    comment: 0,
  };

  reviews.forEach(review => {
    const verdict = review.tags.find(([name]) => name === 'verdict')?.[1] as keyof typeof verdicts | undefined;
    if (verdict && verdict in verdicts) {
      verdicts[verdict]++;
    }
  });

  return {
    total,
    averageRating,
    verdicts,
  };
}

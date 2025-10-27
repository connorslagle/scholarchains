/**
 * Reputation calculation hook
 *
 * Calculates user reputation based on multiple factors with 5-year decay
 */

import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import {
  type ReputationData,
  type ReputationComponents,
  type PaperContribution,
  type ReviewContribution,
  calculatePaperReputation,
  calculateReviewReputation,
  calculateTotalReputation,
  getTier,
  getMonthsSince,
  REPUTATION_CONSTANTS,
} from '@/types/reputation';
import { getReviewMetadata } from './useReviews';

/**
 * Hook to calculate and retrieve user reputation
 */
export function useReputation(pubkey: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['reputation', pubkey],
    queryFn: async () => {
      if (!pubkey) {
        return null;
      }

      // Fetch user's papers (kind 32623)
      const papers = await nostr.query([{
        kinds: [32623],
        authors: [pubkey],
        limit: 100,
      }]);

      // Fetch user's reviews (kind 4597)
      const reviews = await nostr.query([{
        kinds: [4597],
        authors: [pubkey],
        limit: 100,
      }]);

      // Fetch reviews of user's papers (to calculate paper ratings)
      const paperAddresses = papers.map(p => {
        const d = p.tags.find(([name]) => name === 'd')?.[1];
        return `32623:${p.pubkey}:${d}`;
      });

      const paperReviews: NostrEvent[] = [];
      for (const address of paperAddresses) {
        const revs = await nostr.query([{
          kinds: [4597],
          '#a': [address],
        }]);
        paperReviews.push(...revs);
      }

      // Calculate paper contributions
      const paperContributions: PaperContribution[] = papers.map(paper => {
        const address = `32623:${paper.pubkey}:${paper.tags.find(([n]) => n === 'd')?.[1]}`;
        const paperRevs = paperReviews.filter(r => {
          const metadata = getReviewMetadata(r as NostrEvent & { kind: 4597 });
          return metadata.paperAddress === address;
        });

        // Calculate average rating
        const ratings = paperRevs
          .map(r => r.tags.find(([n, sub]) => n === 'rating' && sub === 'overall')?.[2])
          .filter((r): r is string => !!r)
          .map(r => parseFloat(r))
          .filter(r => !isNaN(r));

        const averageRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 5; // Default to middle rating if no reviews

        // Citation counting not yet implemented
        const citations = 0;

        const ageMonths = getMonthsSince(paper.created_at);

        return {
          paperAddress: address,
          averageRating,
          citations,
          ageMonths,
          reputation: 0, // Calculated below
        };
      });

      // Calculate review contributions
      const reviewContributions: ReviewContribution[] = reviews.map(review => {
        const ageMonths = getMonthsSince(review.created_at);

        // Default quality rating of 3.5/5 (editor ratings not yet implemented)
        const qualityRating = 3.5;

        return {
          reviewEventId: review.id,
          qualityRating,
          ageMonths,
          reputation: 0, // Calculated below
        };
      });

      // Calculate components
      const publicationQuality = calculatePaperReputation(paperContributions);
      const reviewQuality = calculateReviewReputation(reviewContributions);

      // Community trust (placeholder - would come from Web of Trust endorsements)
      const communityTrust = 0;

      // Governance participation (placeholder - would count votes and proposals)
      const governanceParticipation = 0;

      // Economic stake (placeholder - would check staked BTC)
      const economicStake = 0;

      // Statistical consistency (placeholder - would run automated checks)
      const statisticalConsistency = REPUTATION_CONSTANTS.POINTS.STATISTICAL_CONSISTENCY_BONUS;

      // Time investment (account age)
      const firstEvent = [...papers, ...reviews].sort((a, b) => a.created_at - b.created_at)[0];
      const accountAgeMonths = firstEvent ? getMonthsSince(firstEvent.created_at) : 0;
      const timeInvestment = Math.min(
        accountAgeMonths * REPUTATION_CONSTANTS.POINTS.ACCOUNT_AGE_PER_MONTH,
        REPUTATION_CONSTANTS.MAX.TIME_INVESTMENT
      );

      // Penalties (placeholder - would come from fraud investigations)
      const penalties = 0;

      const components: ReputationComponents = {
        publicationQuality,
        reviewQuality,
        communityTrust,
        governanceParticipation,
        economicStake,
        statisticalConsistency,
        timeInvestment,
        penalties,
      };

      const totalReputation = calculateTotalReputation(components);
      const tier = getTier(totalReputation).tier;

      const reputationData: ReputationData = {
        pubkey,
        totalReputation,
        tier,
        components,
        lastCalculated: Date.now() / 1000,
      };

      return reputationData;
    },
    enabled: !!pubkey,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

/**
 * Hook to check user permissions based on reputation
 */
export function useReputationPermissions(pubkey: string) {
  const { data: reputation } = useReputation(pubkey);

  if (!reputation) {
    return {
      canPublish: false,
      canReview: false,
      canComment: false,
      canVoteMinor: false,
      canVoteMajor: false,
      canEdit: false,
      canInvestigate: false,
    };
  }

  const tierConfig = getTier(reputation.totalReputation);

  return {
    canPublish: tierConfig.canPublish,
    canReview: tierConfig.canReview,
    canComment: tierConfig.canComment,
    canVoteMinor: tierConfig.canVoteMinor,
    canVoteMajor: tierConfig.canVoteMajor,
    canEdit: tierConfig.canEdit,
    canInvestigate: tierConfig.canInvestigate,
  };
}

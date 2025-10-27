import { describe, it, expect } from 'vitest';
import {
  type PaperContribution,
  type ReviewContribution,
  type ReputationComponents,
  ReputationTier,
  calculateDecayFactor,
  calculatePaperReputation,
  calculateReviewReputation,
  calculateTotalReputation,
  getTier,
  getMonthsSince,
  REPUTATION_CONSTANTS,
} from './reputation';

describe('Reputation System', () => {
  describe('calculateDecayFactor', () => {
    it('should return 1 for age 0', () => {
      expect(calculateDecayFactor(0)).toBe(1);
    });

    it('should return 0.5 for half-life (60 months)', () => {
      expect(calculateDecayFactor(60)).toBeCloseTo(0.5, 5);
    });

    it('should return 0.25 for double half-life (120 months)', () => {
      expect(calculateDecayFactor(120)).toBeCloseTo(0.25, 5);
    });

    it('should decay exponentially', () => {
      const decay30 = calculateDecayFactor(30);
      const decay60 = calculateDecayFactor(60);
      const decay90 = calculateDecayFactor(90);

      expect(decay30).toBeGreaterThan(decay60);
      expect(decay60).toBeGreaterThan(decay90);
      expect(decay60).toBeCloseTo(0.5, 2);
    });
  });

  describe('calculatePaperReputation', () => {
    it('should calculate reputation for a single paper with no decay', () => {
      const papers: PaperContribution[] = [
        {
          paperAddress: '32623:pubkey:id1',
          averageRating: 8,
          citations: 10,
          ageMonths: 0,
          reputation: 0,
        },
      ];

      const reputation = calculatePaperReputation(papers);

      // Base (50) + rating (8 * 5) + citations (10 * 2) = 50 + 40 + 20 = 110
      expect(reputation).toBe(110);
    });

    it('should apply decay to older papers', () => {
      const recentPaper: PaperContribution[] = [
        {
          paperAddress: '32623:pubkey:id1',
          averageRating: 8,
          citations: 0,
          ageMonths: 0,
          reputation: 0,
        },
      ];

      const oldPaper: PaperContribution[] = [
        {
          paperAddress: '32623:pubkey:id2',
          averageRating: 8,
          citations: 0,
          ageMonths: 60, // 5 years (half-life)
          reputation: 0,
        },
      ];

      const recentRep = calculatePaperReputation(recentPaper);
      const oldRep = calculatePaperReputation(oldPaper);

      // Old paper should have approximately half the reputation
      expect(oldRep).toBeCloseTo(recentRep * 0.5, 1);
    });

    it('should cap reputation at maximum', () => {
      const manyPapers: PaperContribution[] = Array.from({ length: 20 }, (_, i) => ({
        paperAddress: `32623:pubkey:id${i}`,
        averageRating: 10,
        citations: 50,
        ageMonths: 0,
        reputation: 0,
      }));

      const reputation = calculatePaperReputation(manyPapers);

      expect(reputation).toBe(REPUTATION_CONSTANTS.MAX.PUBLICATION);
    });

    it('should handle empty papers array', () => {
      expect(calculatePaperReputation([])).toBe(0);
    });
  });

  describe('calculateReviewReputation', () => {
    it('should calculate reputation for a single review with no decay', () => {
      const reviews: ReviewContribution[] = [
        {
          reviewEventId: 'event1',
          qualityRating: 4,
          ageMonths: 0,
          reputation: 0,
        },
      ];

      const reputation = calculateReviewReputation(reviews);

      // Base (10) + quality (4 * 10) = 10 + 40 = 50
      expect(reputation).toBe(50);
    });

    it('should apply decay to older reviews', () => {
      const recentReview: ReviewContribution[] = [
        {
          reviewEventId: 'event1',
          qualityRating: 4,
          ageMonths: 0,
          reputation: 0,
        },
      ];

      const oldReview: ReviewContribution[] = [
        {
          reviewEventId: 'event2',
          qualityRating: 4,
          ageMonths: 60, // 5 years (half-life)
          reputation: 0,
        },
      ];

      const recentRep = calculateReviewReputation(recentReview);
      const oldRep = calculateReviewReputation(oldReview);

      expect(oldRep).toBeCloseTo(recentRep * 0.5, 1);
    });

    it('should cap reputation at maximum', () => {
      const manyReviews: ReviewContribution[] = Array.from({ length: 100 }, (_, i) => ({
        reviewEventId: `event${i}`,
        qualityRating: 5,
        ageMonths: 0,
        reputation: 0,
      }));

      const reputation = calculateReviewReputation(manyReviews);

      expect(reputation).toBe(REPUTATION_CONSTANTS.MAX.REVIEW);
    });

    it('should handle empty reviews array', () => {
      expect(calculateReviewReputation([])).toBe(0);
    });
  });

  describe('calculateTotalReputation', () => {
    it('should sum all positive components', () => {
      const components: ReputationComponents = {
        publicationQuality: 100,
        reviewQuality: 80,
        communityTrust: 50,
        governanceParticipation: 20,
        economicStake: 10,
        statisticalConsistency: 100,
        timeInvestment: 50,
        penalties: 0,
      };

      const total = calculateTotalReputation(components);

      expect(total).toBe(410);
    });

    it('should subtract penalties', () => {
      const components: ReputationComponents = {
        publicationQuality: 100,
        reviewQuality: 80,
        communityTrust: 0,
        governanceParticipation: 0,
        economicStake: 0,
        statisticalConsistency: 0,
        timeInvestment: 0,
        penalties: 50,
      };

      const total = calculateTotalReputation(components);

      expect(total).toBe(130);
    });

    it('should never return negative reputation', () => {
      const components: ReputationComponents = {
        publicationQuality: 10,
        reviewQuality: 10,
        communityTrust: 0,
        governanceParticipation: 0,
        economicStake: 0,
        statisticalConsistency: 0,
        timeInvestment: 0,
        penalties: 100,
      };

      const total = calculateTotalReputation(components);

      expect(total).toBe(0);
    });
  });

  describe('getTier', () => {
    it('should return NEWCOMER for 0-10 reputation', () => {
      expect(getTier(0).tier).toBe(ReputationTier.NEWCOMER);
      expect(getTier(5).tier).toBe(ReputationTier.NEWCOMER);
      expect(getTier(9.99).tier).toBe(ReputationTier.NEWCOMER);
    });

    it('should return CONTRIBUTOR for 10-100 reputation', () => {
      expect(getTier(10).tier).toBe(ReputationTier.CONTRIBUTOR);
      expect(getTier(50).tier).toBe(ReputationTier.CONTRIBUTOR);
      expect(getTier(99.99).tier).toBe(ReputationTier.CONTRIBUTOR);
    });

    it('should return ESTABLISHED for 100-500 reputation', () => {
      expect(getTier(100).tier).toBe(ReputationTier.ESTABLISHED);
      expect(getTier(300).tier).toBe(ReputationTier.ESTABLISHED);
      expect(getTier(499.99).tier).toBe(ReputationTier.ESTABLISHED);
    });

    it('should return EXPERT for 500-1000 reputation', () => {
      expect(getTier(500).tier).toBe(ReputationTier.EXPERT);
      expect(getTier(750).tier).toBe(ReputationTier.EXPERT);
      expect(getTier(999.99).tier).toBe(ReputationTier.EXPERT);
    });

    it('should return COUNCIL for 1000+ reputation', () => {
      expect(getTier(1000).tier).toBe(ReputationTier.COUNCIL);
      expect(getTier(5000).tier).toBe(ReputationTier.COUNCIL);
      expect(getTier(10000).tier).toBe(ReputationTier.COUNCIL);
    });

    it('should return correct permissions for each tier', () => {
      const newcomer = getTier(5);
      expect(newcomer.canPublish).toBe(true);
      expect(newcomer.canReview).toBe(false);
      expect(newcomer.canVoteMajor).toBe(false);
      expect(newcomer.canInvestigate).toBe(false);

      const contributor = getTier(50);
      expect(contributor.canPublish).toBe(true);
      expect(contributor.canReview).toBe(true);
      expect(contributor.canVoteMajor).toBe(false);
      expect(contributor.canInvestigate).toBe(false);

      const established = getTier(300);
      expect(established.canPublish).toBe(true);
      expect(established.canReview).toBe(true);
      expect(established.canVoteMajor).toBe(true);
      expect(established.canInvestigate).toBe(false);

      const expert = getTier(750);
      expect(expert.canPublish).toBe(true);
      expect(expert.canReview).toBe(true);
      expect(expert.canEdit).toBe(true);
      expect(expert.canInvestigate).toBe(false);

      const council = getTier(2000);
      expect(council.canPublish).toBe(true);
      expect(council.canReview).toBe(true);
      expect(council.canEdit).toBe(true);
      expect(council.canInvestigate).toBe(true);
    });
  });

  describe('getMonthsSince', () => {
    it('should calculate months from timestamp', () => {
      const now = Date.now() / 1000;
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
      const sixtyDaysAgo = now - (60 * 24 * 60 * 60);

      expect(getMonthsSince(thirtyDaysAgo)).toBeCloseTo(1, 1);
      expect(getMonthsSince(sixtyDaysAgo)).toBeCloseTo(2, 1);
    });

    it('should return 0 for current timestamp', () => {
      const now = Date.now() / 1000;
      expect(getMonthsSince(now)).toBeCloseTo(0, 2);
    });
  });

  describe('Reputation weights', () => {
    it('should have defined weights for all components', () => {
      const weights = REPUTATION_CONSTANTS.WEIGHTS;

      expect(weights.PUBLICATION_QUALITY).toBeGreaterThan(0);
      expect(weights.REVIEW_QUALITY).toBeGreaterThan(0);
      expect(weights.COMMUNITY_TRUST).toBeGreaterThan(0);
      expect(weights.GOVERNANCE).toBeGreaterThan(0);
      expect(weights.ECONOMIC_STAKE).toBeGreaterThan(0);
    });
  });

  describe('Integration: Complete reputation calculation', () => {
    it('should calculate realistic reputation for active researcher', () => {
      // Researcher with 3 well-rated papers and 10 quality reviews
      const papers: PaperContribution[] = [
        {
          paperAddress: '32623:pubkey:id1',
          averageRating: 8,
          citations: 15,
          ageMonths: 6,
          reputation: 0,
        },
        {
          paperAddress: '32623:pubkey:id2',
          averageRating: 7,
          citations: 8,
          ageMonths: 18,
          reputation: 0,
        },
        {
          paperAddress: '32623:pubkey:id3',
          averageRating: 9,
          citations: 25,
          ageMonths: 30,
          reputation: 0,
        },
      ];

      const reviews: ReviewContribution[] = Array.from({ length: 10 }, (_, i) => ({
        reviewEventId: `review${i}`,
        qualityRating: 4,
        ageMonths: i * 3,
        reputation: 0,
      }));

      const publicationQuality = calculatePaperReputation(papers);
      const reviewQuality = calculateReviewReputation(reviews);

      const components: ReputationComponents = {
        publicationQuality,
        reviewQuality,
        communityTrust: 50,
        governanceParticipation: 20,
        economicStake: 10,
        statisticalConsistency: 100,
        timeInvestment: 50,
        penalties: 0,
      };

      const total = calculateTotalReputation(components);
      const tier = getTier(total);

      expect(total).toBeGreaterThan(0);
      // Should be at least ESTABLISHED tier, possibly EXPERT
      expect([ReputationTier.ESTABLISHED, ReputationTier.EXPERT]).toContain(tier.tier);
      expect(tier.canReview).toBe(true);
      expect(tier.canVoteMajor).toBe(true);
    });
  });
});

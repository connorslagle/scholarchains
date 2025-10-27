/**
 * Reputation System Types
 *
 * Based on Phase 3 of the implementation plan for multi-factor, decay-based reputation
 */

/**
 * Reputation tier levels
 */
export enum ReputationTier {
  NEWCOMER = 'NEWCOMER', // 0-10
  CONTRIBUTOR = 'CONTRIBUTOR', // 10-100
  ESTABLISHED = 'ESTABLISHED', // 100-500
  EXPERT = 'EXPERT', // 500-1000
  COUNCIL = 'COUNCIL', // 1000+
}

/**
 * Reputation tier configuration
 */
export interface TierConfig {
  tier: ReputationTier;
  minReputation: number;
  maxReputation: number;
  canPublish: boolean;
  canReview: boolean;
  canComment: boolean;
  canVoteMinor: boolean;
  canVoteMajor: boolean;
  canEdit: boolean;
  canInvestigate: boolean;
}

/**
 * Reputation tier configurations
 */
export const REPUTATION_TIERS: TierConfig[] = [
  {
    tier: ReputationTier.NEWCOMER,
    minReputation: 0,
    maxReputation: 10,
    canPublish: true,
    canReview: false,
    canComment: true,
    canVoteMinor: false,
    canVoteMajor: false,
    canEdit: false,
    canInvestigate: false,
  },
  {
    tier: ReputationTier.CONTRIBUTOR,
    minReputation: 10,
    maxReputation: 100,
    canPublish: true,
    canReview: true,
    canComment: true,
    canVoteMinor: true,
    canVoteMajor: false,
    canEdit: false,
    canInvestigate: false,
  },
  {
    tier: ReputationTier.ESTABLISHED,
    minReputation: 100,
    maxReputation: 500,
    canPublish: true,
    canReview: true,
    canComment: true,
    canVoteMinor: true,
    canVoteMajor: true,
    canEdit: false,
    canInvestigate: false,
  },
  {
    tier: ReputationTier.EXPERT,
    minReputation: 500,
    maxReputation: 1000,
    canPublish: true,
    canReview: true,
    canComment: true,
    canVoteMinor: true,
    canVoteMajor: true,
    canEdit: true,
    canInvestigate: false,
  },
  {
    tier: ReputationTier.COUNCIL,
    minReputation: 1000,
    maxReputation: Infinity,
    canPublish: true,
    canReview: true,
    canComment: true,
    canVoteMinor: true,
    canVoteMajor: true,
    canEdit: true,
    canInvestigate: true,
  },
];

/**
 * Get tier configuration for a reputation score
 */
export function getTier(reputation: number): TierConfig {
  for (const tier of REPUTATION_TIERS) {
    if (reputation >= tier.minReputation && reputation < tier.maxReputation) {
      return tier;
    }
  }
  // Fallback to highest tier
  return REPUTATION_TIERS[REPUTATION_TIERS.length - 1];
}

/**
 * Components of reputation score
 */
export interface ReputationComponents {
  // Publication quality (0-40% of total)
  publicationQuality: number;

  // Review quality (0-40% of total)
  reviewQuality: number;

  // Community trust (0-15% of total)
  communityTrust: number;

  // Governance participation (0-10% of total)
  governanceParticipation: number;

  // Economic stake (0-5% of total)
  economicStake: number;

  // Statistical consistency bonus/penalty
  statisticalConsistency: number;

  // Time investment (anti-sybil bonus)
  timeInvestment: number;

  // Penalties (fraud, misconduct)
  penalties: number;
}

/**
 * Full reputation data
 */
export interface ReputationData {
  pubkey: string;
  totalReputation: number;
  tier: ReputationTier;
  components: ReputationComponents;
  lastCalculated: number; // Unix timestamp
}

/**
 * Constants for reputation calculation
 */
export const REPUTATION_CONSTANTS = {
  // 5-year half-life in months
  HALF_LIFE_MONTHS: 60,

  // Weight multipliers for each component
  WEIGHTS: {
    PUBLICATION_QUALITY: 0.40,
    REVIEW_QUALITY: 0.40,
    COMMUNITY_TRUST: 0.15,
    GOVERNANCE: 0.10,
    ECONOMIC_STAKE: 0.05,
  },

  // Points per activity
  POINTS: {
    // Per paper based on average review rating
    PAPER_BASE: 50,
    PAPER_PER_RATING: 5, // Multiply by average rating (1-10)
    PAPER_PER_CITATION: 2,

    // Per review based on quality rating
    REVIEW_BASE: 10,
    REVIEW_PER_QUALITY: 10, // Multiply by quality rating (1-5)

    // Community trust
    ENDORSEMENT_BASE: 0.1, // Per endorsement weighted by endorser reputation

    // Governance
    VOTE: 0.5,
    PROPOSAL: 5,

    // Economic stake (per 0.01 BTC)
    STAKE_MULTIPLIER: 5000,

    // Time investment
    ACCOUNT_AGE_PER_MONTH: 2,

    // Consistency bonus
    STATISTICAL_CONSISTENCY_BONUS: 100,
    STATISTICAL_CONSISTENCY_PENALTY: -50,
  },

  // Maximum values for components
  MAX: {
    PUBLICATION: 400,
    REVIEW: 400,
    COMMUNITY_TRUST: 150,
    GOVERNANCE: 100,
    ECONOMIC_STAKE: 50,
    TIME_INVESTMENT: 100,
  },
};

/**
 * Calculate decay factor based on age (5-year half-life)
 */
export function calculateDecayFactor(ageMonths: number): number {
  // Exponential decay: factor = 2^(-age/halfLife)
  return Math.pow(2, -ageMonths / REPUTATION_CONSTANTS.HALF_LIFE_MONTHS);
}

/**
 * Paper contribution to reputation
 */
export interface PaperContribution {
  paperAddress: string;
  averageRating: number; // 0-10
  citations: number;
  ageMonths: number;
  reputation: number; // Calculated contribution
}

/**
 * Review contribution to reputation
 */
export interface ReviewContribution {
  reviewEventId: string;
  qualityRating: number; // 1-5 (from editors/community)
  ageMonths: number;
  reputation: number; // Calculated contribution
}

/**
 * Calculate reputation from papers
 */
export function calculatePaperReputation(papers: PaperContribution[]): number {
  let total = 0;

  for (const paper of papers) {
    const { averageRating, citations, ageMonths } = paper;

    // Base points + rating multiplier + citations
    const basePoints =
      REPUTATION_CONSTANTS.POINTS.PAPER_BASE +
      averageRating * REPUTATION_CONSTANTS.POINTS.PAPER_PER_RATING +
      citations * REPUTATION_CONSTANTS.POINTS.PAPER_PER_CITATION;

    // Apply decay
    const decayFactor = calculateDecayFactor(ageMonths);
    const points = basePoints * decayFactor;

    total += points;
  }

  // Cap at maximum
  return Math.min(total, REPUTATION_CONSTANTS.MAX.PUBLICATION);
}

/**
 * Calculate reputation from reviews
 */
export function calculateReviewReputation(reviews: ReviewContribution[]): number {
  let total = 0;

  for (const review of reviews) {
    const { qualityRating, ageMonths } = review;

    // Base points + quality multiplier
    const basePoints =
      REPUTATION_CONSTANTS.POINTS.REVIEW_BASE +
      qualityRating * REPUTATION_CONSTANTS.POINTS.REVIEW_PER_QUALITY;

    // Apply decay
    const decayFactor = calculateDecayFactor(ageMonths);
    const points = basePoints * decayFactor;

    total += points;
  }

  // Cap at maximum
  return Math.min(total, REPUTATION_CONSTANTS.MAX.REVIEW);
}

/**
 * Calculate total reputation from all components
 */
export function calculateTotalReputation(components: ReputationComponents): number {
  const {
    publicationQuality,
    reviewQuality,
    communityTrust,
    governanceParticipation,
    economicStake,
    statisticalConsistency,
    timeInvestment,
    penalties,
  } = components;

  const total =
    publicationQuality +
    reviewQuality +
    communityTrust +
    governanceParticipation +
    economicStake +
    statisticalConsistency +
    timeInvestment -
    penalties;

  // Never negative
  return Math.max(0, total);
}

/**
 * Helper to get months since timestamp
 */
export function getMonthsSince(timestamp: number): number {
  const now = Date.now() / 1000;
  const seconds = now - timestamp;
  return seconds / (30 * 24 * 60 * 60); // Approximate month as 30 days
}

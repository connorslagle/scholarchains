import { describe, it, expect } from 'vitest';
import {
  type EnhancedReview,
  enhancedReviewToTags,
  parseEnhancedReview,
  validateEnhancedReview,
} from './enhanced-review';

describe('Enhanced Review System', () => {
  const validReview: EnhancedReview = {
    technical: {
      methodology: {
        rating: 8,
        critique: 'Excellent methodology with clear experimental design and appropriate controls.',
      },
      resultsValidity: {
        rating: 7,
        critique: 'Results are generally valid but some statistical analyses could be stronger.',
      },
      statisticalRigor: {
        rating: 6,
        critique: 'Statistical methods are adequate but could benefit from additional robustness checks.',
      },
    },
    reproducibility: {
      dataAvailable: true,
      codeAvailable: true,
      replicationFeasibility: 8,
      notes: 'All data and code are publicly available. Replication should be straightforward.',
    },
    verdict: 'accept-with-revisions',
    overallRating: 7.5,
    confidence: 4,
    timeSpent: 3.5,
    conflicts: 'none',
    attribution: 'pseudonymous',
    content: 'This is a comprehensive review of the paper. The methodology is sound, results are valid, and the paper makes a meaningful contribution to the field. Some minor revisions are recommended.',
    aspects: ['methodology', 'results', 'novelty'],
  };

  describe('enhancedReviewToTags', () => {
    it('should convert enhanced review to Nostr tags', () => {
      const tags = enhancedReviewToTags(validReview);

      expect(tags).toContainEqual(['verdict', 'accept-with-revisions']);
      expect(tags).toContainEqual(['rating', 'overall', '7.5']);
      expect(tags).toContainEqual(['confidence', '4']);
      expect(tags).toContainEqual(['time-spent', '3.5']);
      expect(tags).toContainEqual(['rating', 'methodology', '8']);
      expect(tags).toContainEqual(['rating', 'results', '7']);
      expect(tags).toContainEqual(['rating', 'statistical-rigor', '6']);
      expect(tags).toContainEqual(['reproducibility', 'data-available', 'true']);
      expect(tags).toContainEqual(['reproducibility', 'code-available', 'true']);
      expect(tags).toContainEqual(['reproducibility', 'feasibility', '8']);
      expect(tags).toContainEqual(['attribution', 'pseudonymous']);
      expect(tags).toContainEqual(['conflicts', 'none']);
      expect(tags).toContainEqual(['aspect', 'methodology']);
      expect(tags).toContainEqual(['aspect', 'results']);
      expect(tags).toContainEqual(['aspect', 'novelty']);
    });

    it('should handle ORCID when provided', () => {
      const reviewWithOrcid: EnhancedReview = {
        ...validReview,
        attribution: 'full-disclosure',
        orcid: '0000-0001-2345-6789',
      };

      const tags = enhancedReviewToTags(reviewWithOrcid);

      expect(tags).toContainEqual(['orcid', '0000-0001-2345-6789']);
      expect(tags).toContainEqual(['attribution', 'full-disclosure']);
    });

    it('should handle empty conflicts', () => {
      const reviewWithoutConflicts: EnhancedReview = {
        ...validReview,
        conflicts: '',
      };

      const tags = enhancedReviewToTags(reviewWithoutConflicts);

      const conflictTags = tags.filter(([name]) => name === 'conflicts');
      expect(conflictTags).toHaveLength(0);
    });
  });

  describe('parseEnhancedReview', () => {
    it('should parse enhanced review from tags', () => {
      const tags = enhancedReviewToTags(validReview);
      const parsed = parseEnhancedReview(tags, validReview.content);

      expect(parsed.verdict).toBe('accept-with-revisions');
      expect(parsed.overallRating).toBe(7.5);
      expect(parsed.confidence).toBe(4);
      expect(parsed.timeSpent).toBe(3.5);
      expect(parsed.technical?.methodology.rating).toBe(8);
      expect(parsed.technical?.resultsValidity.rating).toBe(7);
      expect(parsed.technical?.statisticalRigor.rating).toBe(6);
      expect(parsed.reproducibility?.dataAvailable).toBe(true);
      expect(parsed.reproducibility?.codeAvailable).toBe(true);
      expect(parsed.reproducibility?.replicationFeasibility).toBe(8);
      expect(parsed.attribution).toBe('pseudonymous');
      expect(parsed.conflicts).toBe('none');
      expect(parsed.content).toBe(validReview.content);
      expect(parsed.aspects).toEqual(['methodology', 'results', 'novelty']);
    });

    it('should handle missing optional fields', () => {
      const minimalTags = [
        ['verdict', 'accept'],
        ['rating', 'overall', '8'],
        ['confidence', '3'],
      ];

      const parsed = parseEnhancedReview(minimalTags, 'Test content');

      expect(parsed.verdict).toBe('accept');
      expect(parsed.overallRating).toBe(8);
      expect(parsed.confidence).toBe(3);
      expect(parsed.conflicts).toBe('');
      expect(parsed.attribution).toBe('pseudonymous');
    });
  });

  describe('validateEnhancedReview', () => {
    it('should validate a correct enhanced review', () => {
      const errors = validateEnhancedReview(validReview);
      expect(errors).toHaveLength(0);
    });

    it('should reject review with invalid methodology rating', () => {
      const invalidReview: Partial<EnhancedReview> = {
        ...validReview,
        technical: {
          ...validReview.technical,
          methodology: {
            rating: 11, // Invalid: > 10
            critique: 'Good methodology',
          },
        },
      };

      const errors = validateEnhancedReview(invalidReview);
      expect(errors).toContain('Methodology rating must be between 1 and 10');
    });

    it('should reject review with too short critique', () => {
      const invalidReview: Partial<EnhancedReview> = {
        ...validReview,
        technical: {
          ...validReview.technical,
          methodology: {
            rating: 8,
            critique: 'Too short', // Invalid: < 10 characters
          },
        },
      };

      const errors = validateEnhancedReview(invalidReview);
      expect(errors).toContain('Methodology critique must be at least 10 characters');
    });

    it('should reject review without technical assessment', () => {
      const invalidReview: Partial<EnhancedReview> = {
        ...validReview,
        technical: undefined,
      };

      const errors = validateEnhancedReview(invalidReview);
      expect(errors).toContain('Technical assessment is required');
    });

    it('should reject review without reproducibility assessment', () => {
      const invalidReview: Partial<EnhancedReview> = {
        ...validReview,
        reproducibility: undefined,
      };

      const errors = validateEnhancedReview(invalidReview);
      expect(errors).toContain('Reproducibility assessment is required');
    });

    it('should reject review without verdict', () => {
      const invalidReview: Partial<EnhancedReview> = {
        ...validReview,
        verdict: undefined,
      };

      const errors = validateEnhancedReview(invalidReview);
      expect(errors).toContain('Verdict is required');
    });

    it('should reject review with invalid overall rating', () => {
      const invalidReview: Partial<EnhancedReview> = {
        ...validReview,
        overallRating: 0, // Invalid: < 1
      };

      const errors = validateEnhancedReview(invalidReview);
      expect(errors).toContain('Overall rating must be between 1 and 10');
    });

    it('should reject review with invalid confidence', () => {
      const invalidReview: Partial<EnhancedReview> = {
        ...validReview,
        confidence: 6, // Invalid: > 5
      };

      const errors = validateEnhancedReview(invalidReview);
      expect(errors).toContain('Confidence must be between 1 and 5');
    });

    it('should reject review with zero time spent', () => {
      const invalidReview: Partial<EnhancedReview> = {
        ...validReview,
        timeSpent: 0, // Invalid: <= 0
      };

      const errors = validateEnhancedReview(invalidReview);
      expect(errors).toContain('Time spent must be greater than 0 hours');
    });

    it('should reject review with too short content', () => {
      const invalidReview: Partial<EnhancedReview> = {
        ...validReview,
        content: 'Too short', // Invalid: < 100 characters
      };

      const errors = validateEnhancedReview(invalidReview);
      expect(errors).toContain('Review content must be at least 100 characters');
    });
  });
});

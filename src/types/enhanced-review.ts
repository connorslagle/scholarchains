/**
 * Enhanced Review System Types
 *
 * Based on Phase 1 of the implementation plan for structured, high-quality reviews
 */

/**
 * Structured technical assessment with ratings and detailed critiques
 */
export interface TechnicalAssessment {
  methodology: {
    rating: number; // 1-10
    critique: string; // Detailed written feedback
  };
  resultsValidity: {
    rating: number; // 1-10
    critique: string;
  };
  statisticalRigor: {
    rating: number; // 1-10
    critique: string;
  };
}

/**
 * Reproducibility assessment
 */
export interface ReproducibilityAssessment {
  dataAvailable: boolean;
  codeAvailable: boolean;
  replicationFeasibility: number; // 1-10
  notes: string; // What's needed to replicate
}

/**
 * Review verdict options
 */
export type ReviewVerdict =
  | 'accept'
  | 'accept-with-revisions'
  | 'major-revisions'
  | 'reject';

/**
 * Attribution options for reviews
 */
export type ReviewAttribution =
  | 'pseudonymous'
  | 'zk-proof'
  | 'full-disclosure';

/**
 * Complete enhanced review data structure
 */
export interface EnhancedReview {
  // Technical Assessment
  technical: TechnicalAssessment;

  // Reproducibility
  reproducibility: ReproducibilityAssessment;

  // Overall Assessment
  verdict: ReviewVerdict;
  overallRating: number; // 1-10
  confidence: number; // 1-5 (confidence in own expertise)

  // Metadata
  timeSpent: number; // Hours spent on review
  conflicts: string; // Declared conflicts of interest

  // Attribution
  attribution: ReviewAttribution;
  orcid?: string; // Optional ORCID for full disclosure

  // Legacy compatibility
  content: string; // Markdown review text
  aspects?: string[]; // Optional aspect tags
}

/**
 * Helper to convert enhanced review to Nostr event tags
 */
export function enhancedReviewToTags(review: EnhancedReview): string[][] {
  const tags: string[][] = [
    ['verdict', review.verdict],
    ['rating', 'overall', review.overallRating.toString()],
    ['confidence', review.confidence.toString()],
    ['time-spent', review.timeSpent.toString()],

    // Technical assessment ratings
    ['rating', 'methodology', review.technical.methodology.rating.toString()],
    ['rating', 'results', review.technical.resultsValidity.rating.toString()],
    ['rating', 'statistical-rigor', review.technical.statisticalRigor.rating.toString()],

    // Reproducibility
    ['reproducibility', 'data-available', review.reproducibility.dataAvailable.toString()],
    ['reproducibility', 'code-available', review.reproducibility.codeAvailable.toString()],
    ['reproducibility', 'feasibility', review.reproducibility.replicationFeasibility.toString()],

    // Attribution
    ['attribution', review.attribution],
  ];

  // Add conflicts if declared
  if (review.conflicts) {
    tags.push(['conflicts', review.conflicts]);
  }

  // Add ORCID if provided
  if (review.orcid) {
    tags.push(['orcid', review.orcid]);
  }

  // Add legacy aspect tags if provided
  if (review.aspects) {
    review.aspects.forEach(aspect => {
      tags.push(['aspect', aspect]);
    });
  }

  return tags;
}

/**
 * Parse enhanced review from Nostr event tags
 */
export function parseEnhancedReview(tags: string[][], content: string): Partial<EnhancedReview> {
  const getTag = (name: string, subtype?: string): string | undefined => {
    if (subtype) {
      return tags.find(([n, st]) => n === name && st === subtype)?.[2];
    }
    return tags.find(([n]) => n === name)?.[1];
  };

  const getNumberTag = (name: string, subtype?: string, defaultValue: number = 0): number => {
    const value = getTag(name, subtype);
    return value ? parseFloat(value) : defaultValue;
  };

  const getBooleanTag = (name: string, subtype?: string): boolean => {
    const value = getTag(name, subtype);
    return value === 'true';
  };

  return {
    technical: {
      methodology: {
        rating: getNumberTag('rating', 'methodology'),
        critique: content, // Full content contains all critiques
      },
      resultsValidity: {
        rating: getNumberTag('rating', 'results'),
        critique: content,
      },
      statisticalRigor: {
        rating: getNumberTag('rating', 'statistical-rigor'),
        critique: content,
      },
    },
    reproducibility: {
      dataAvailable: getBooleanTag('reproducibility', 'data-available'),
      codeAvailable: getBooleanTag('reproducibility', 'code-available'),
      replicationFeasibility: getNumberTag('reproducibility', 'feasibility'),
      notes: content,
    },
    verdict: (getTag('verdict') as ReviewVerdict) || 'comment',
    overallRating: getNumberTag('rating', 'overall'),
    confidence: getNumberTag('confidence', undefined, 3),
    timeSpent: getNumberTag('time-spent'),
    conflicts: getTag('conflicts') || '',
    attribution: (getTag('attribution') as ReviewAttribution) || 'pseudonymous',
    orcid: getTag('orcid'),
    content,
    aspects: tags.filter(([n]) => n === 'aspect').map(([, v]) => v),
  };
}

/**
 * Validate enhanced review data
 */
export function validateEnhancedReview(review: Partial<EnhancedReview>): string[] {
  const errors: string[] = [];

  // Check technical assessment ratings
  if (review.technical) {
    const { methodology, resultsValidity, statisticalRigor } = review.technical;

    if (methodology.rating < 1 || methodology.rating > 10) {
      errors.push('Methodology rating must be between 1 and 10');
    }
    if (!methodology.critique || methodology.critique.trim().length < 10) {
      errors.push('Methodology critique must be at least 10 characters');
    }

    if (resultsValidity.rating < 1 || resultsValidity.rating > 10) {
      errors.push('Results validity rating must be between 1 and 10');
    }
    if (!resultsValidity.critique || resultsValidity.critique.trim().length < 10) {
      errors.push('Results critique must be at least 10 characters');
    }

    if (statisticalRigor.rating < 1 || statisticalRigor.rating > 10) {
      errors.push('Statistical rigor rating must be between 1 and 10');
    }
    if (!statisticalRigor.critique || statisticalRigor.critique.trim().length < 10) {
      errors.push('Statistical rigor critique must be at least 10 characters');
    }
  } else {
    errors.push('Technical assessment is required');
  }

  // Check reproducibility
  if (review.reproducibility) {
    const { replicationFeasibility } = review.reproducibility;

    if (replicationFeasibility < 1 || replicationFeasibility > 10) {
      errors.push('Replication feasibility must be between 1 and 10');
    }
  } else {
    errors.push('Reproducibility assessment is required');
  }

  // Check overall
  if (!review.verdict) {
    errors.push('Verdict is required');
  }

  if (!review.overallRating || review.overallRating < 1 || review.overallRating > 10) {
    errors.push('Overall rating must be between 1 and 10');
  }

  if (!review.confidence || review.confidence < 1 || review.confidence > 5) {
    errors.push('Confidence must be between 1 and 5');
  }

  // Check time spent
  if (!review.timeSpent || review.timeSpent <= 0) {
    errors.push('Time spent must be greater than 0 hours');
  }

  // Check content
  if (!review.content || review.content.trim().length < 100) {
    errors.push('Review content must be at least 100 characters');
  }

  return errors;
}

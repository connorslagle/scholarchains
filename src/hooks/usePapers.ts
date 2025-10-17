import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { retryOperation } from './useRetry';

export interface PaperEvent extends NostrEvent {
  kind: 32623;
}

/**
 * Validate that a Nostr event is a proper ScholarChains paper (kind 32623)
 */
function validatePaper(event: NostrEvent): event is PaperEvent {
  if (event.kind !== 32623) return false;

  // Required tags
  const d = event.tags.find(([name]) => name === 'd')?.[1];
  const title = event.tags.find(([name]) => name === 'title')?.[1];
  const publishedAt = event.tags.find(([name]) => name === 'published_at')?.[1];
  const h = event.tags.find(([name]) => name === 'h')?.[1];

  if (!d || !title || !publishedAt || !h) return false;

  // Must have either OpenTimestamps proof OR legacy Bitcoin block hash
  const ots = event.tags.find(([name]) => name === 'ots')?.[1];
  const b = event.tags.find(([name]) => name === 'b');

  // Check for OTS proof (new format)
  if (ots) return true;

  // Check for legacy Bitcoin block hash format
  if (b && b.length >= 3 && b[1] && b[2]) return true;

  return false;
}

/**
 * Extract paper metadata from tags
 */
export function getPaperMetadata(event: PaperEvent) {
  const tags = event.tags;

  return {
    id: event.tags.find(([name]) => name === 'd')?.[1] || '',
    title: tags.find(([name]) => name === 'title')?.[1] || 'Untitled',
    summary: tags.find(([name]) => name === 'summary')?.[1] || event.content,
    publishedAt: parseInt(tags.find(([name]) => name === 'published_at')?.[1] || '0'),
    otsProof: tags.find(([name]) => name === 'ots')?.[1] || '',
    // Legacy support for old block height/hash format
    blockHeight: tags.find(([name]) => name === 'b')?.[1] || '',
    blockHash: tags.find(([name]) => name === 'b')?.[2] || '',
    blobHash: tags.find(([name]) => name === 'h')?.[1] || '',
    url: tags.find(([name]) => name === 'url')?.[1] || '',
    mimeType: tags.find(([name]) => name === 'm')?.[1] || 'application/pdf',
    size: parseInt(tags.find(([name]) => name === 'size')?.[1] || '0'),
    license: tags.find(([name]) => name === 'license')?.[1],
    doi: tags.find(([name]) => name === 'doi')?.[1],
    arxiv: tags.find(([name]) => name === 'arxiv')?.[1],
    subject: tags.find(([name]) => name === 'subject')?.[1],
    version: tags.find(([name]) => name === 'version')?.[1] || 'v1',
    topics: tags.filter(([name]) => name === 't').map(([, value]) => value),
    authors: tags.filter(([name]) => name === 'p').map(([, pubkey]) => pubkey),
    citations: tags.filter(([name]) => name === 'a').map(([, addr]) => addr),
  };
}

/**
 * Hook to fetch recent papers from Nostr
 */
export function usePapers(options?: {
  topic?: string;
  author?: string;
  limit?: number;
}) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['papers', options?.topic, options?.author, options?.limit],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);

      const filters = [{
        kinds: [32623],
        limit: options?.limit || 20,
        ...(options?.topic && { '#t': [options.topic] }),
        ...(options?.author && { authors: [options.author] }),
      }];

      // Use retry logic for network resilience
      const events = await retryOperation(
        () => nostr.query(filters, { signal }),
        { maxAttempts: 2, initialDelay: 500 }
      );
      
      // Validate and filter events
      const validPapers = events.filter(validatePaper) as PaperEvent[];
      
      // Sort by published_at descending (newest first)
      return validPapers.sort((a, b) => {
        const aPublished = parseInt(a.tags.find(([name]) => name === 'published_at')?.[1] || '0');
        const bPublished = parseInt(b.tags.find(([name]) => name === 'published_at')?.[1] || '0');
        return bPublished - aPublished;
      });
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to fetch a single paper by its naddr or d-tag
 */
export function usePaper(author: string, dTag: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['paper', author, dTag],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      const events = await nostr.query([{
        kinds: [32623],
        authors: [author],
        '#d': [dTag],
        limit: 1,
      }], { signal });

      if (events.length === 0) return null;
      
      const paper = events[0];
      return validatePaper(paper) ? (paper as PaperEvent) : null;
    },
    enabled: !!author && !!dTag,
  });
}

/**
 * Hook to search papers by keyword
 */
export function useSearchPapers(searchQuery: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['search-papers', searchQuery],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      // Fetch all recent papers and filter client-side
      // Note: This is not ideal for large datasets, but works for MVP
      // TODO: Use relay search capabilities (NIP-50) when available
      const events = await nostr.query([{
        kinds: [32623],
        limit: 100,
      }], { signal });

      const validPapers = events.filter(validatePaper) as PaperEvent[];
      
      // Filter by search query (title, summary, content, topics)
      const query = searchQuery.toLowerCase();
      const filtered = validPapers.filter(paper => {
        const metadata = getPaperMetadata(paper);
        return (
          metadata.title.toLowerCase().includes(query) ||
          metadata.summary.toLowerCase().includes(query) ||
          paper.content.toLowerCase().includes(query) ||
          metadata.topics.some(t => t.toLowerCase().includes(query)) ||
          metadata.subject?.toLowerCase().includes(query)
        );
      });

      // Sort by published_at descending
      return filtered.sort((a, b) => {
        const aPublished = parseInt(a.tags.find(([name]) => name === 'published_at')?.[1] || '0');
        const bPublished = parseInt(b.tags.find(([name]) => name === 'published_at')?.[1] || '0');
        return bPublished - aPublished;
      });
    },
    enabled: searchQuery.length > 0,
  });
}

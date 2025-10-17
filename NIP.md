# ScholarChains - Decentralized Scholarly Publishing Protocol

## Abstract

ScholarChains is a censorship-resistant scholarly publishing platform built on Nostr, Blossom, and OpenTimestamps. This document defines custom Nostr event kinds for research papers, peer reviews, and cryptographic proofs of existence using Bitcoin timestamps.

## Motivation

Centralized academic repositories (arXiv, institutional repositories) suffer from:
- Single points of failure and censorship
- Opaque gatekeeping and incentive structures  
- Lack of provenance guarantees
- No immutable timestamping
- Limited credit for peer reviewers

ScholarChains solves these problems by combining:
- **Blossom** (content-addressable storage) for immutable file storage
- **Nostr** (relay-based pub/sub) for censorship-resistant metadata
- **OpenTimestamps** (Bitcoin-based timestamping) for cryptographic proof of existence

## Event Kinds

### Kind 32623: Research Paper (Addressable)

An addressable event representing a published research paper. Uses NIP-23 (Long-form Content) patterns with scholarly extensions.

**Tags:**
- `d` (required) - Unique identifier for the paper (e.g., DOI, UUID, or custom ID)
- `title` (required) - Paper title
- `summary` (required) - Abstract or summary
- `published_at` (required) - Unix timestamp of first publication
- `a` (optional) - References to other papers (`32623:<pubkey>:<d-tag>`)
- `p` (optional) - Co-author pubkeys
- `t` (optional) - Topic tags/keywords
- `ots` (required) - OpenTimestamps proof (base64-encoded): `["ots", "<base64-proof>"]`
- `h` (required) - Blossom blob hash(es): `["h", "<sha256-hash>"]`
- `url` (required) - Blossom server URL(s) for the file
- `m` (optional) - MIME type (e.g., `application/pdf`)
- `size` (optional) - File size in bytes
- `license` (optional) - License identifier (e.g., `CC-BY-4.0`, `MIT`)
- `doi` (optional) - Digital Object Identifier
- `arxiv` (optional) - arXiv identifier
- `subject` (optional) - Subject classification (e.g., `cs.CR`, `physics.gen-ph`)
- `version` (optional) - Version number (e.g., `v1`, `v2`)

**Content:**
- Plain text abstract or description of the paper
- MAY include markdown formatting
- SHOULD NOT include the full paper text (use Blossom file instead)

**Example:**
```json
{
  "kind": 32623,
  "created_at": 1708774162,
  "content": "We present a novel approach to decentralized scholarly publishing...",
  "tags": [
    ["d", "decentralized-scholarly-publishing-2024"],
    ["title", "ScholarChains: A Censorship-Resistant Academic Publishing Protocol"],
    ["summary", "Abstract: We present a novel approach to decentralized scholarly publishing using Nostr, Blossom, and OpenTimestamps..."],
    ["published_at", "1708774162"],
    ["ots", "AE9wcGVuc...base64encodedOTSproof...aW1lc3RhbXBz"],
    ["h", "e4bee088334cb5d38cff1616e964369c37b6081be997962ab289d6c671975d71"],
    ["url", "https://blossom.primal.net/e4bee088334cb5d38cff1616e964369c37b6081be997962ab289d6c671975d71.pdf"],
    ["m", "application/pdf"],
    ["size", "2456789"],
    ["license", "CC-BY-4.0"],
    ["subject", "cs.CR"],
    ["t", "cryptography"],
    ["t", "decentralization"],
    ["t", "scholarly-publishing"],
    ["p", "co-author-pubkey-1", "wss://relay.nostr.band"],
    ["p", "co-author-pubkey-2", "wss://relay.damus.io"],
    ["version", "v1"]
  ],
  "pubkey": "author-pubkey",
  "id": "event-id",
  "sig": "signature"
}
```

### Kind 4597: Peer Review (Regular)

A permanent peer review comment on a research paper. Reviews are immutable records of scholarly critique.

**Tags:**
- `a` (required) - Address of the paper being reviewed: `32623:<pubkey>:<d-tag>`
- `A` (optional) - Root paper address (if reviewing a version)
- `p` (required) - Pubkey of the paper author(s)
- `ots` (required) - OpenTimestamps proof (base64-encoded): `["ots", "<base64-proof>"]`
- `rating` (optional) - Numerical rating (e.g., `1-5`, `1-10`)
- `verdict` (optional) - Review verdict (`accept`, `reject`, `revise`, `comment`)
- `aspect` (optional) - Aspect being reviewed (`methodology`, `results`, `clarity`, `novelty`, `reproducibility`)
- `t` (optional) - Topic tags

**Content:**
- Full review text in markdown format
- Constructive feedback, methodology critique, suggestions
- SHOULD be substantive and professional

**Example:**
```json
{
  "kind": 4597,
  "created_at": 1708800000,
  "content": "## Review Summary\n\nThis paper presents an interesting approach to decentralized publishing. However, there are several areas that need improvement:\n\n### Strengths\n- Novel use of Bitcoin block hashes for timestamping\n- Clear protocol specification\n\n### Weaknesses\n- Limited discussion of spam prevention\n- Missing performance benchmarks\n\n### Recommendation\nRevisions needed before acceptance.",
  "tags": [
    ["a", "32623:author-pubkey:decentralized-scholarly-publishing-2024"],
    ["p", "author-pubkey"],
    ["ots", "BE9wcGVuc...base64encodedOTSproof...dGFtcHM="],
    ["verdict", "revise"],
    ["rating", "7"],
    ["aspect", "methodology"],
    ["aspect", "novelty"],
    ["t", "peer-review"]
  ],
  "pubkey": "reviewer-pubkey",
  "id": "event-id",
  "sig": "signature"
}
```

## OpenTimestamps Cryptographic Proof

All scholarly events (papers and reviews) MUST include an `ots` tag with an OpenTimestamps proof:

```json
["ots", "<base64-encoded-proof>"]
```

**Purpose:**
- Provides cryptographic proof that the data existed at a specific point in time
- Uses the Bitcoin blockchain as a timestamp authority
- Industry-standard timestamping protocol ([opentimestamps.org](https://opentimestamps.org))
- No on-chain transaction cost (uses calendar servers and aggregation)
- Verifiable by anyone with access to the Bitcoin blockchain

**How OpenTimestamps Works:**
1. Hash your data (SHA256)
2. Submit hash to OpenTimestamps calendar servers
3. Calendar servers aggregate multiple timestamps and commit to Bitcoin blockchain
4. Proof can be upgraded once confirmed in a Bitcoin block
5. Anyone can verify the proof using the Bitcoin blockchain

**Implementation:**
1. Create a unique data string for the event (e.g., paper ID + title + blob hash + timestamp)
2. Generate OpenTimestamps proof using the `opentimestamps` library
3. Encode the proof as base64
4. Add the `["ots", base64_proof]` tag to the event
5. Sign and publish the event

**Verification:**
1. Extract the OTS proof from the `ots` tag
2. Decode the base64 proof
3. Verify the proof against the original data using OpenTimestamps
4. Check if the timestamp has been confirmed in a Bitcoin block
5. Compare the Bitcoin block timestamp with the event's `created_at` timestamp

## Discovery and Search

Papers SHOULD be tagged with:
- `t` tags for topics/keywords (e.g., `["t", "machine-learning"]`)
- `subject` tags for field classification (e.g., `["subject", "cs.AI"]`)
- Author `p` tags for all co-authors

Clients SHOULD support filtering by:
- Topic tags (`#t`)
- Subject classification
- Author pubkey
- Publication date range
- Bitcoin block height range

## Reputation and Incentives

### Lightning Zaps (NIP-57)

Authors and reviewers can receive Lightning tips using NIP-57 zaps:
- Users can zap papers to show appreciation
- Reviewers can be rewarded for quality reviews
- Zap amounts contribute to reputation scores

### Reputation Scoring

A simple reputation system based on:
- Number of papers published
- Number of citations (references via `a` tags)
- Number of quality reviews written
- Lightning zaps received
- Community engagement

Reputation scores are calculated client-side and can evolve over time.

## File Storage with Blossom

All paper files (PDFs, datasets, supplementary materials) SHOULD be stored on Blossom servers:

1. **Upload:** Upload file to a Blossom server (NIP-B7, BUD-02)
2. **Get hash:** Server returns SHA-256 hash of the file
3. **Tag event:** Add `h` and `url` tags to the kind 32623 event
4. **Discover:** Users can find files on any Blossom server using the hash

**Multiple Blobs:**
A paper can reference multiple files using multiple `h` and `url` tags:
```json
["h", "main-paper-sha256-hash"],
["url", "https://blossom.server1.com/main-paper-sha256-hash.pdf"],
["h", "dataset-sha256-hash"],
["url", "https://blossom.server2.com/dataset-sha256-hash.zip"]
```

## Interoperability

### With NIP-23 Clients

Kind 32623 papers are compatible with NIP-23 (Long-form Content) clients:
- They can be displayed as articles
- `title`, `summary`, `published_at` tags work the same way
- `a` tag references work for citations

### With NIP-94 Clients

The `h`, `url`, `m`, and `size` tags follow NIP-94 (File Metadata) conventions, allowing basic file metadata to be displayed in compatible clients.

### With NIP-22 Comments

Kind 4597 reviews follow similar patterns to NIP-22 comments, making them displayable in clients that support comment threads.

## Examples

### Publishing a Paper

```javascript
// 1. Upload PDF to Blossom
const file = await uploadFile(pdfFile);
const blobHash = file.sha256;
const blobUrl = file.url;

// 2. Create OpenTimestamps proof
import { createTimestamp } from 'opentimestamps';
const paperData = `my-paper-2024:My Research Paper:${blobHash}:${Date.now()}`;
const timestampResult = await createTimestamp(paperData);

// 3. Create paper event
const paperEvent = {
  kind: 32623,
  content: "Abstract of the research paper...",
  tags: [
    ["d", "my-paper-2024"],
    ["title", "My Research Paper"],
    ["summary", "Full abstract here..."],
    ["published_at", Math.floor(Date.now() / 1000).toString()],
    ["ots", timestampResult.proof],
    ["h", blobHash],
    ["url", blobUrl],
    ["m", "application/pdf"],
    ["subject", "cs.CR"],
    ["t", "cryptography"],
    ["license", "CC-BY-4.0"]
  ]
};

// 4. Sign and publish
await nostr.event(paperEvent);
```

### Writing a Review

```javascript
// Create OpenTimestamps proof for the review
const reviewData = `32623:author-pubkey:my-paper-2024:accept:9:${Date.now()}`;
const reviewTimestamp = await createTimestamp(reviewData);

const reviewEvent = {
  kind: 4597,
  content: "## Review\n\nDetailed review content here...",
  tags: [
    ["a", "32623:author-pubkey:my-paper-2024"],
    ["p", "author-pubkey"],
    ["ots", reviewTimestamp.proof],
    ["verdict", "accept"],
    ["rating", "9"],
    ["aspect", "methodology"],
    ["aspect", "novelty"]
  ]
};

await nostr.event(reviewEvent);
```

### Querying Papers

```javascript
// Get all papers by topic
const papers = await nostr.query([{
  kinds: [32623],
  '#t': ['cryptography'],
  limit: 20
}]);

// Get papers by a specific author
const authorPapers = await nostr.query([{
  kinds: [32623],
  authors: ['author-pubkey'],
  limit: 50
}]);

// Get reviews for a specific paper
const reviews = await nostr.query([{
  kinds: [4597],
  '#a': ['32623:author-pubkey:my-paper-2024']
}]);
```

## Security Considerations

### Spam Prevention

- OpenTimestamps proofs make backdating impossible (anchored to Bitcoin blocks)
- Proof-of-work (NIP-13) can be optionally required
- Relays can implement rate limiting on kind 32623 events
- Reputation systems discourage low-quality submissions

### Immutability

- Regular events (kind 4597 reviews) are permanent and cannot be deleted
- Addressable events (kind 32623 papers) can be updated by the author
- Blossom blobs are content-addressable and immutable by design
- OpenTimestamps proofs provide tamper-evident timestamps anchored to Bitcoin

### Privacy

- All events are public by design (scholarly publishing is inherently public)
- Authors publish under their Nostr identity
- Anonymous peer review is NOT supported in this protocol (all reviews are public and signed)

## Future Extensions

Possible future additions to the protocol:
- Data availability proofs for large datasets
- Merkle tree aggregation of daily events into a single Bitcoin OP_RETURN
- Decentralized reputation oracles
- Citation graph analytics
- Integration with ORCID and other scholarly identifiers
- Support for preprints vs. final versions
- Conference and journal organization events

## References

- [NIP-01: Basic Protocol Flow](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-23: Long-form Content](https://github.com/nostr-protocol/nips/blob/master/23.md)
- [NIP-94: File Metadata](https://github.com/nostr-protocol/nips/blob/master/94.md)
- [NIP-B7: Blossom](https://github.com/nostr-protocol/nips/blob/master/B7.md)
- [Blossom BUDs](https://github.com/hzrd149/blossom)
- [OpenTimestamps](https://opentimestamps.org)
- [OpenTimestamps Specification](https://github.com/opentimestamps/opentimestamps-server)
- [Bitcoin Block Explorer APIs](https://blockstream.info/api)

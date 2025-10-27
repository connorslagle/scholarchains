# Academic Paper Review Cycle on ScholarChains

**A comprehensive guide to the decentralized scholarly publishing and peer review protocol**

---

## Table of Contents

1. [Overview](#overview)
2. [Stakeholder Perspectives](#stakeholder-perspectives)
3. [The Complete Lifecycle](#the-complete-lifecycle)
4. [Technical Flow](#technical-flow)
5. [Incentive Structures](#incentive-structures)
6. [Example Scenarios](#example-scenarios)
7. [Comparison to Traditional Publishing](#comparison-to-traditional-publishing)

---

## Overview

ScholarChains is a decentralized scholarly publishing platform built on three core technologies:
- **Nostr** - Censorship-resistant metadata distribution
- **Blossom** - Content-addressable file storage
- **OpenTimestamps** - Bitcoin-based cryptographic timestamping

Unlike traditional academic publishing where gatekeepers control access, ScholarChains creates a permissionless, transparent, and incentive-aligned ecosystem where all participants benefit from open science.

---

## Stakeholder Perspectives

### 1. 👨‍🔬 **Authors** (Paper Publishers)

**Who they are:**
- Researchers, academics, independent scientists
- Anyone with original research to share
- Graduate students, postdocs, professors, industry researchers

**What they want:**
- Permanent, censorship-resistant publication
- Provable timestamps to establish priority
- Recognition and credit for their work
- Fair, transparent peer review
- Direct financial support from the community

**How they interact with the protocol:**

#### Step 1: Prepare the Paper
```
1. Write research paper (PDF format)
2. Prepare metadata:
   - Title and abstract
   - Subject classification (e.g., cs.CR, physics.gen-ph)
   - Keywords/topics
   - License (e.g., CC-BY-4.0)
   - Optional: DOI, arXiv ID
```

#### Step 2: Upload to Blossom
```
1. Log in with Nostr identity (browser extension or key)
2. Select PDF file (max 50MB)
3. File is uploaded to configured Blossom servers
4. Receive content-addressable hash (SHA-256)
```

**Technical detail:** Multiple Blossom servers can be configured for redundancy. If one server fails, the upload automatically tries the next one.

#### Step 3: Create OpenTimestamps Proof
```
1. System generates unique data string:
   paper-id:title:blob-hash:timestamp
2. Backend creates OpenTimestamps proof
3. Proof submitted to Bitcoin calendar servers
4. Proof anchored to Bitcoin blockchain (within 1-24 hours)
```

**Technical detail:** This provides cryptographic proof that the paper existed at a specific time, preventing backdating. No transaction fees required.

#### Step 4: Publish Nostr Event
```
Event Kind: 32623 (addressable event)
Tags:
- d: unique paper ID
- title: paper title
- summary: abstract
- published_at: Unix timestamp
- ots: base64-encoded OpenTimestamps proof
- h: Blossom blob SHA-256 hash
- url: Blossom server URL
- subject: classification code
- t: topic keywords
- license: license identifier
```

**What happens next:**
- Event is broadcast to all connected Nostr relays
- Paper appears in global feed within seconds
- Anyone can discover and read the paper
- Reviews start coming in
- Zaps (tips) can be received

**Benefits for authors:**
- ✅ Instant publication (no waiting for journal acceptance)
- ✅ Permanent record on Bitcoin blockchain
- ✅ Censorship-resistant (no single point of failure)
- ✅ Direct financial support via Lightning zaps
- ✅ Full ownership and control
- ✅ Transparent citation tracking
- ✅ Global reach without institutional barriers

---

### 2. 🧑‍⚖️ **Reviewers** (Peer Reviewers)

**Who they are:**
- Domain experts in specific fields
- Other researchers and academics
- Anyone with expertise to evaluate research quality
- Independent scholars, practitioners, educators

**What they want:**
- Recognition for their review work
- Financial compensation for time and expertise
- Build reputation in their field
- Contribute to scientific quality
- Transparent, attributed reviews (no anonymous reviews)

**How they interact with the protocol:**

#### Step 1: Discover Papers
```
Methods:
1. Browse global feed of papers
2. Search by topic/keyword
3. Filter by subject classification
4. Follow specific authors
5. Subscribe to topic tags
```

#### Step 2: Read and Evaluate
```
1. Download PDF from Blossom server
2. Verify OpenTimestamps proof (optional)
3. Evaluate paper on multiple dimensions:
   - Methodology
   - Results/findings
   - Clarity and presentation
   - Novelty/originality
   - Reproducibility
   - Significance
   - Rigor
```

#### Step 3: Write Review
```
Review Components:
- Verdict: accept | reject | revise | comment
- Rating: 1-10 scale (optional)
- Aspects: methodology, results, clarity, novelty, etc.
- Written feedback: detailed critique in markdown
- Constructive suggestions for improvement
```

#### Step 4: Create OpenTimestamps Proof
```
1. System generates review data string
2. OpenTimestamps proof created
3. Proof anchored to Bitcoin blockchain
```

**Technical detail:** This prevents reviewers from changing their review after the fact, ensuring integrity.

#### Step 5: Publish Review Event
```
Event Kind: 4597 (regular event)
Tags:
- a: address of paper being reviewed (32623:pubkey:paper-id)
- p: author's pubkey(s)
- ots: base64-encoded OpenTimestamps proof
- verdict: accept/reject/revise/comment
- rating: numerical score (optional)
- aspect: dimensions evaluated
Content:
- Full review text in markdown
```

**What happens next:**
- Review appears under the paper immediately
- Author is notified
- Review is permanently recorded
- Reviewer can receive zaps for quality reviews
- Reputation builds over time

**Benefits for reviewers:**
- ✅ Public recognition for review work
- ✅ Financial rewards via Lightning zaps
- ✅ Build verifiable reputation
- ✅ Immutable credit for contributions
- ✅ Direct impact on scientific discourse
- ✅ No gatekeeping (anyone can review)
- ✅ Transparent attribution

---

### 3. 📖 **Readers** (Research Consumers)

**Who they are:**
- Students and educators
- Fellow researchers
- Industry practitioners
- Journalists and science communicators
- General public interested in science
- Policy makers

**What they want:**
- Free, open access to research
- Assess paper quality through reviews
- Verify authenticity and timestamps
- Support authors they appreciate
- Discover relevant research

**How they interact with the protocol:**

#### Step 1: Discover Content
```
Discovery Methods:
1. Browse homepage feed (latest papers)
2. Search by keywords
3. Filter by subject classification
4. Follow specific authors (via Nostr follow lists)
5. Explore topic tags
6. Get recommendations
```

#### Step 2: Evaluate Quality
```
Quality Signals:
1. Read peer reviews
   - Check verdicts (accept/reject)
   - Read detailed critiques
   - See reviewer ratings
2. Check reviewer reputation
   - Number of quality reviews
   - Zaps received
   - Expertise in field
3. Verify timestamps
   - Download .ots proof file
   - Verify against Bitcoin blockchain
   - Confirm publication date
4. Check author reputation
   - Previous publications
   - Citations received
   - Community recognition
```

#### Step 3: Access Content
```
1. Click to view paper details
2. Download PDF from Blossom server
   - Multiple servers available (redundancy)
   - Content-addressable (verify hash)
3. Read abstract and reviews
4. Verify cryptographic proofs (optional)
```

#### Step 4: Support Authors/Reviewers
```
Lightning Zaps (NIP-57):
1. Click zap button on paper or review
2. Choose amount (sats)
3. Add optional comment
4. Pay via:
   - Nostr Wallet Connect (NWC)
   - WebLN browser extension
   - Manual Lightning invoice/QR code
5. Payment settles in <1 second
6. Zap appears publicly on paper/review
```

#### Step 5: Cite and Reference
```
Citation Information:
- Unique paper ID (d tag)
- Author pubkey
- Bitcoin timestamp
- Blossom content hash
- Permanent Nostr event ID

Create Citation Event:
- Reference via 'a' tag (32623:pubkey:paper-id)
- Builds citation graph
- Authors notified of citations
```

**Benefits for readers:**
- ✅ Free, open access to all research
- ✅ Transparent peer review
- ✅ Verify authenticity cryptographically
- ✅ Direct support to creators
- ✅ No paywalls or institutional barriers
- ✅ Global access from any device
- ✅ Content remains available forever

---

### 4. 🖥️ **Relay Operators** (Infrastructure Providers)

**Who they are:**
- Individuals running Nostr relay servers
- Organizations providing relay services
- Communities hosting relays for specific fields

**What they want:**
- Support open science infrastructure
- Potentially monetize relay services
- Curate high-quality content
- Build communities around topics

**How they interact with the protocol:**

#### Infrastructure Role:
```
1. Run Nostr relay server
2. Accept connections from clients
3. Store and forward events (kind 32623, 4597)
4. Filter and query events
5. Optional: implement NIP-50 search
```

#### Event Handling:
```
Receive Events:
- Kind 32623 (papers) - addressable events
- Kind 4597 (reviews) - regular events
- Kind 9735 (zap receipts)
- Other Nostr events (follows, reactions, etc.)

Storage:
- Store events in database
- Index by kind, pubkey, tags
- Enable efficient queries
```

#### Revenue Models:
```
Optional Monetization:
1. Paid relay access (NIP-42 auth)
2. Premium features (search, analytics)
3. Donations from community
4. Institutional sponsorship
```

**Benefits for relay operators:**
- ✅ Support open science mission
- ✅ Build valuable scientific database
- ✅ Potential revenue streams
- ✅ Reputation in Nostr ecosystem
- ✅ Community building

---

### 5. ☁️ **Blossom Server Operators** (File Storage Providers)

**Who they are:**
- Individuals with storage capacity
- CDN providers
- Academic institutions
- Decentralized storage networks

**What they want:**
- Provide reliable file storage
- Earn fees for storage/bandwidth
- Support decentralized infrastructure

**How they interact with the protocol:**

#### Storage Operations:
```
1. Run Blossom server (BUD-02 compliant)
2. Accept file uploads (authenticated via Nostr)
3. Store files with content-addressable names
4. Serve files via HTTPS
5. Optional: charge for storage/bandwidth
```

#### Upload Flow:
```
1. Client requests upload (signed with Nostr key)
2. Server validates signature (NIP-98)
3. Accept file, compute SHA-256 hash
4. Store file as: hash.pdf
5. Return hash and URL to client
```

#### Retrieval Flow:
```
GET /hash.pdf
- Serve file from storage
- Content-addressable (verify hash)
- No authentication required (public)
```

**Benefits for Blossom operators:**
- ✅ Earn fees for storage
- ✅ Support scientific infrastructure
- ✅ Simple protocol (HTTP + Nostr auth)
- ✅ Decentralized (no single point of failure)
- ✅ Can specialize (e.g., academic papers only)

---

### 6. ⚡ **Lightning Node Operators** (Payment Facilitators)

**Who they are:**
- Individuals running Lightning nodes
- Payment processors
- Wallet providers
- Routing node operators

**What they want:**
- Earn routing fees
- Support Bitcoin/Lightning ecosystem
- Enable micro-payments for content

**How they interact with the protocol:**

#### Payment Processing:
```
1. Receive zap request from author/reviewer
2. Generate Lightning invoice
3. Receive payment from sender
4. Route payment through Lightning network
5. Settle to recipient
6. Publish zap receipt (kind 9735) to Nostr
```

#### Zap Flow:
```
Reader → Lightning Wallet → Lightning Network → Recipient Wallet
         ↓
      NWC/WebLN
         ↓
   Zap Receipt Event (9735)
         ↓
     Nostr Relays
```

**Benefits for Lightning operators:**
- ✅ Earn routing fees
- ✅ Support open science payments
- ✅ Increase Lightning adoption
- ✅ Build reputation in ecosystem

---

## The Complete Lifecycle

### Phase 1: Publication

```
┌─────────────┐
│   Author    │
│  Prepares   │
│   Paper     │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Upload    │─────▶│   Blossom    │
│   to        │      │   Servers    │
│  Blossom    │◀─────│  (Storage)   │
└──────┬──────┘      └──────────────┘
       │                    │
       │                    │ SHA-256 hash
       ▼                    ▼
┌─────────────┐      ┌──────────────┐
│  Create     │      │   Backend    │
│OpenTimestamp│─────▶│   Creates    │
│   Proof     │      │   OTS Proof  │
└──────┬──────┘      └──────────────┘
       │                    │
       │                    │ base64 proof
       ▼                    ▼
┌─────────────┐      ┌──────────────┐
│  Publish    │─────▶│    Nostr     │
│   Event     │      │   Relays     │
│  (32623)    │      │ (Broadcast)  │
└─────────────┘      └──────────────┘
       │
       │ Event broadcasted
       ▼
┌─────────────┐
│  Paper is   │
│    Live!    │
│ Discoverable│
└─────────────┘
```

### Phase 2: Review

```
┌─────────────┐
│  Reviewer   │
│ Discovers   │
│   Paper     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Download   │
│   PDF from  │
│  Blossom    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Read &    │
│  Evaluate   │
│   Paper     │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Write     │      │   Backend    │
│   Review    │─────▶│   Creates    │
│   Content   │      │   OTS Proof  │
└──────┬──────┘      └──────────────┘
       │                    │
       │                    │ base64 proof
       ▼                    ▼
┌─────────────┐      ┌──────────────┐
│  Publish    │─────▶│    Nostr     │
│   Review    │      │   Relays     │
│  (4597)     │      │ (Broadcast)  │
└─────────────┘      └──────────────┘
       │
       │ Review broadcasted
       ▼
┌─────────────┐
│  Review     │
│  Appears    │
│ on Paper    │
└─────────────┘
```

### Phase 3: Consumption & Support

```
┌─────────────┐
│   Reader    │
│  Discovers  │
│   Paper     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    View     │
│   Reviews   │
│   & Assess  │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│  Download   │─────▶│   Blossom    │
│     PDF     │      │   Servers    │
└──────┬──────┘      └──────────────┘
       │
       ▼
┌─────────────┐
│   Verify    │
│ Timestamps  │
│  (Optional) │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│    Send     │─────▶│  Lightning   │
│     Zap     │      │   Network    │
│  (Tip)      │      │  (Payment)   │
└──────┬──────┘      └──────┬───────┘
       │                    │
       │                    │ Zap receipt
       ▼                    ▼
┌─────────────┐      ┌──────────────┐
│   Author    │◀─────│    Nostr     │
│  Receives   │      │   Relays     │
│    Zap      │      │ (kind 9735)  │
└─────────────┘      └──────────────┘
```

---

## Technical Flow

### Event Structure: Paper (Kind 32623)

```json
{
  "kind": 32623,
  "pubkey": "author-pubkey-hex",
  "created_at": 1708774162,
  "content": "Abstract or description text",
  "tags": [
    ["d", "unique-paper-id"],
    ["title", "Paper Title"],
    ["summary", "Full abstract..."],
    ["published_at", "1708774162"],
    ["ots", "AE9wcGVuc...base64-encoded-proof..."],
    ["h", "e4bee088334cb5d38cff1616e964369c37b6081be997962ab289d6c671975d71"],
    ["url", "https://blossom.primal.net/e4bee088...d71.pdf"],
    ["m", "application/pdf"],
    ["size", "2456789"],
    ["license", "CC-BY-4.0"],
    ["subject", "cs.CR"],
    ["t", "cryptography"],
    ["t", "peer-review"],
    ["version", "v1"]
  ],
  "id": "event-id",
  "sig": "signature"
}
```

**Tag Explanations:**
- `d` - Unique identifier (makes event addressable)
- `title` - Paper title (searchable)
- `summary` - Abstract text
- `published_at` - Publication timestamp
- `ots` - OpenTimestamps proof (verifiable on Bitcoin)
- `h` - Blossom blob SHA-256 hash
- `url` - Where to download PDF
- `m` - MIME type
- `subject` - Field classification (like arXiv categories)
- `t` - Topic tags (multiple allowed)
- `license` - Open source license

### Event Structure: Review (Kind 4597)

```json
{
  "kind": 4597,
  "pubkey": "reviewer-pubkey-hex",
  "created_at": 1708800000,
  "content": "## Review\n\nDetailed feedback in markdown...",
  "tags": [
    ["a", "32623:author-pubkey:paper-id"],
    ["p", "author-pubkey"],
    ["ots", "BE9wcGVuc...base64-encoded-proof..."],
    ["verdict", "accept"],
    ["rating", "8"],
    ["aspect", "methodology"],
    ["aspect", "novelty"],
    ["t", "peer-review"]
  ],
  "id": "event-id",
  "sig": "signature"
}
```

**Tag Explanations:**
- `a` - Address of paper being reviewed (links review to paper)
- `p` - Author pubkey (notification)
- `ots` - OpenTimestamps proof for review
- `verdict` - Overall recommendation
- `rating` - Numerical score
- `aspect` - Dimensions evaluated
- `t` - Topic tags

### Query Examples

**Get all papers in a field:**
```javascript
const papers = await nostr.query([{
  kinds: [32623],
  '#subject': ['cs.CR'],  // Computer Science - Cryptography
  limit: 50
}]);
```

**Get reviews for a specific paper:**
```javascript
const reviews = await nostr.query([{
  kinds: [4597],
  '#a': ['32623:author-pubkey:paper-id']
}]);
```

**Get all papers by an author:**
```javascript
const authorPapers = await nostr.query([{
  kinds: [32623],
  authors: ['author-pubkey']
}]);
```

**Get papers by topic:**
```javascript
const topicPapers = await nostr.query([{
  kinds: [32623],
  '#t': ['machine-learning']
}]);
```

---

## Incentive Structures

### For Authors

**Financial Incentives:**
- Direct Lightning zaps from readers
- No publication fees
- No subscription paywalls
- Potential institutional funding for open publications

**Reputation Incentives:**
- Public citation tracking
- Verifiable publication history
- Bitcoin-timestamped priority claims
- Community recognition

**Practical Incentives:**
- Instant publication (no waiting)
- No editorial rejection
- Global reach
- Permanent record

### For Reviewers

**Financial Incentives:**
- Lightning zaps for quality reviews
- Potential consulting opportunities
- Grants for review work

**Reputation Incentives:**
- Public recognition for review work
- Build expertise portfolio
- Verifiable contribution history
- Community standing

**Practical Incentives:**
- Choose what to review
- No anonymous work
- Direct author interaction
- Influence scientific discourse

### For Readers

**Access Benefits:**
- Free, open access
- No institutional requirements
- Transparent quality signals
- Direct author support

### For Infrastructure Providers

**Relay Operators:**
- Optional paid access models
- Community support
- Data value (scientific database)
- Reputation in ecosystem

**Blossom Operators:**
- Storage fees
- Bandwidth fees
- Support open science
- Decentralized infrastructure

**Lightning Operators:**
- Routing fees
- Payment processing
- Network growth
- Ecosystem support

---

## Example Scenarios

### Scenario 1: Graduate Student Publishing First Paper

**Context:** Alice is a PhD student who just completed her first major research project. Traditional journals have rejected her work for being "too novel" and "not fitting the journal scope."

**Using ScholarChains:**

1. **Day 1 - Publication:**
   - Alice logs in with her Nostr key
   - Uploads her PDF (23MB)
   - Fills in metadata (title, abstract, keywords: "quantum-computing", "cryptography")
   - Clicks "Publish Paper"
   - Within 30 seconds, her paper is live
   - She shares the link on Twitter, Nostr, and her university mailing list

2. **Day 2 - First Review:**
   - Dr. Bob, a quantum computing expert, sees Alice's paper
   - He downloads and reads it
   - Writes a detailed review: "Excellent methodology, novel approach to quantum key distribution"
   - Gives verdict: "accept", rating: 9/10
   - Review appears publicly

3. **Day 7 - Building Traction:**
   - 5 reviews received (4 positive, 1 suggesting improvements)
   - 127 people have downloaded the paper
   - Alice receives 50,000 sats in zaps (~$15)
   - Paper cited in 2 other ScholarChains papers
   - OpenTimestamps proof confirmed in Bitcoin block

4. **Month 1 - Recognition:**
   - Alice has verifiable proof of publication priority
   - Can cite the work in her thesis defense
   - Reputation growing in the community
   - Traditional journal now interested (sees the reviews)

**Outcome:** Alice's work gets recognized on merit, not journal politics. She has permanent, timestamped proof of her contribution.

---

### Scenario 2: Established Professor Providing Peer Review

**Context:** Dr. Carol is a tenured professor with 20 years of experience. She spends ~10 hours/month on peer review for traditional journals, never gets paid or credited.

**Using ScholarChains:**

1. **Discovery:**
   - Carol follows the "physics.gen-ph" tag on ScholarChains
   - Sees new paper on quantum field theory
   - Topic aligns with her expertise

2. **Review Process:**
   - Downloads paper (3MB PDF)
   - Reads over 2 days
   - Identifies 3 major issues and 5 minor suggestions
   - Writes comprehensive 1,500-word review
   - Publishes review (verdict: "revise", rating: 6/10)

3. **Recognition:**
   - Review appears with her name attached
   - Author responds to her critique publicly
   - Other researchers see her expertise
   - Receives 25,000 sats in zaps from grateful readers
   - Review cited in subsequent papers

4. **Long-term Benefits:**
   - Over 6 months: 15 reviews published
   - Total zaps received: 500,000 sats (~$150)
   - Verifiable review history
   - Consulting opportunities from high-quality reviews
   - Graduate students want to work with her (reputation)

**Outcome:** Carol gets credit and compensation for work she was doing anyway. Her expertise is publicly recognized.

---

### Scenario 3: Independent Researcher Without Institutional Access

**Context:** Dave is a brilliant researcher who left academia but continues research independently. He can't access papers behind paywalls and can't publish in traditional journals without affiliation.

**Using ScholarChains:**

1. **Access:**
   - Dave browses ScholarChains freely
   - Downloads any paper without paywalls
   - Reads 50+ papers in his field
   - Verifies timestamps to ensure legitimacy

2. **Contribution:**
   - Dave writes a paper on a breakthrough he discovered
   - No affiliation required
   - Publishes to ScholarChains
   - Bitcoin timestamp proves priority

3. **Review:**
   - Receives 8 reviews within 2 weeks
   - Mix of positive and constructive criticism
   - Revises paper based on feedback
   - Publishes version 2 (same paper ID, new version)

4. **Recognition:**
   - Paper gets noticed by researchers at major labs
   - Cited in follow-up work
   - Dave receives 1M sats in zaps ($300)
   - Offered consulting opportunities

**Outcome:** Dave contributes to science without institutional barriers. His work is judged on merit alone.

---

### Scenario 4: Reader Evaluating Paper Quality

**Context:** Eve is a grad student researching a specific topic. She finds a paper on ScholarChains and wants to assess if it's credible.

**Evaluation Process:**

1. **Initial Assessment:**
   - Reads title and abstract
   - Checks subject classification
   - Sees publication date

2. **Quality Signals:**
   - Reads 7 peer reviews
   - Notes: 5 "accept", 1 "revise", 1 "comment"
   - Average rating: 7.8/10
   - Reviewers mention strong methodology

3. **Reviewer Credibility:**
   - Checks reviewer profiles
   - Sees they have 20+ quality reviews each
   - Recognized names in the field
   - High zap counts (community trust)

4. **Cryptographic Verification:**
   - Downloads .ots proof file
   - Verifies against Bitcoin blockchain
   - Confirms paper was published when claimed
   - Checks Blossom hash matches PDF

5. **Citation Graph:**
   - Sees paper cited by 12 other papers
   - Follow-up work validates findings
   - Author has 15 other publications

**Decision:** Eve determines the paper is high quality and trustworthy. She cites it in her own work.

---

## Comparison to Traditional Publishing

| Aspect | Traditional Publishing | ScholarChains |
|--------|------------------------|---------------|
| **Publication Speed** | 6-18 months | <1 minute |
| **Cost to Publish** | $0-$5,000+ APCs | $0 (plus optional Blossom fees) |
| **Cost to Read** | $30-$50 per paper or subscription | $0 (free and open) |
| **Peer Review** | Anonymous, unpaid, 2-3 reviewers | Public, optional zaps, unlimited reviewers |
| **Reviewer Credit** | None (anonymous) | Full attribution + zaps |
| **Publication Rights** | Publisher owns copyright | Author retains rights |
| **Censorship Risk** | High (editorial decisions) | Very low (decentralized) |
| **Priority Claims** | Publication date (trusted) | Bitcoin timestamp (cryptographic) |
| **Access Barriers** | Institutional subscription | None |
| **Citation Tracking** | Third-party services | Built into protocol |
| **Discoverability** | Journal reputation | Nostr tags + relays |
| **Revision Process** | Resubmit to journal | Update addressable event |
| **Permanence** | Journal archives (centralized) | Nostr + Blossom (decentralized) |
| **Financial Support** | None for readers | Direct zaps to authors/reviewers |
| **Quality Signals** | Journal impact factor | Multiple reviews + community feedback |

---

## Key Protocol Properties

### Censorship Resistance

**No Single Point of Failure:**
- Papers stored on multiple Blossom servers
- Metadata on multiple Nostr relays
- Bitcoin timestamps immutable
- No central authority can delete papers

### Transparency

**Everything is Public:**
- All reviews are public and signed
- Review history is permanent
- Citation graph is visible
- Timestamps are verifiable

### Incentive Alignment

**All Participants Benefit:**
- Authors: recognition + zaps
- Reviewers: credit + zaps
- Readers: free access
- Infrastructure: fees + reputation

### Cryptographic Integrity

**Verifiable Claims:**
- Bitcoin timestamps prove publication date
- Nostr signatures prove authorship
- Blossom hashes prove file integrity
- OpenTimestamps proofs prevent backdating

### Permissionless

**No Gatekeepers:**
- Anyone can publish
- Anyone can review
- Anyone can read
- No institutional requirements

---

## Conclusion

ScholarChains reimagines academic publishing by removing gatekeepers and aligning incentives. Every stakeholder benefits:

- **Authors** get instant publication and recognition
- **Reviewers** get credit and compensation
- **Readers** get free access and quality signals
- **Infrastructure** providers get revenue and reputation

The protocol combines the best aspects of traditional peer review (expert evaluation, quality control) with modern decentralized technology (Bitcoin, Lightning, Nostr) to create a system that is:

- **Fast:** Publish in seconds
- **Fair:** No editorial bias
- **Free:** Open access for all
- **Permanent:** Stored forever
- **Verifiable:** Cryptographically provable
- **Incentivized:** Everyone gets rewarded

This is not just a technical improvement—it's a fundamental reimagining of how scientific knowledge should be created, evaluated, and shared. ScholarChains puts control back in the hands of researchers and readers, where it belongs.

---

## Next Steps

**For Authors:**
1. Set up a Nostr identity (browser extension or mobile app)
2. Prepare your research paper (PDF)
3. Visit ScholarChains and click "Publish"
4. Share your paper with the community

**For Reviewers:**
1. Browse papers in your field
2. Download and evaluate interesting research
3. Write constructive reviews
4. Build your reputation

**For Readers:**
1. Explore the paper feed
2. Search for topics of interest
3. Support authors with zaps
4. Cite ScholarChains papers in your work

**For Developers:**
1. Run a Nostr relay for scientific papers
2. Operate a Blossom server
3. Build tools on top of the protocol
4. Contribute to the ecosystem

---

*For technical details, see [NIP.md](../NIP.md) for the full protocol specification.*

*For deployment instructions, see [DOCKER.md](./DOCKER.md) for running your own instance.*

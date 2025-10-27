# Academic Paper Review Cycle on ScholarChains
## Enhanced Protocol for MVP Implementation

**A research-backed, decentralized scholarly publishing and peer review protocol**

---

## Table of Contents

1. [Overview](#overview)
2. [Key Research-Backed Enhancements](#key-research-backed-enhancements)
3. [The Enhanced Lifecycle](#the-enhanced-lifecycle)
4. [Stakeholder Perspectives](#stakeholder-perspectives)
5. [Multi-Layer Review Architecture](#multi-layer-review-architecture)
6. [Reputation System Design](#reputation-system-design)
7. [Fraud Detection & Prevention](#fraud-detection--prevention)
8. [Economic Sustainability](#economic-sustainability)
9. [Governance Structure](#governance-structure)
10. [Example Scenarios](#example-scenarios)
11. [Implementation Roadmap for MVP](#implementation-roadmap-for-mvp)

---

## Overview

ScholarChains is a decentralized scholarly publishing platform built on three core technologies:
- **Nostr** - Censorship-resistant metadata distribution with Web of Trust
- **Blossom** - Content-addressable file storage
- **OpenTimestamps** - Bitcoin-based cryptographic timestamping

**Research-backed mission:** Reduce publication time from 6-24 months to 30 days, detect fraud in months instead of years, eliminate prestige bias (2:1 acceptance disparity between top institutions and developing countries), and provide progressive trust building for early-career researchers.

### What Makes This Different

Traditional systems have proven failure modes:
- COVID-19 proved review can happen in **35 days** when motivated
- **70% of eLife submissions** were preprints before formal review
- PubPeer detects fraud but only **21.5% of flagged papers** receive corrections
- Stack Overflow's fraud persisted despite detection, with users gaming numerical reputation
- DAO governance failed through token-weighted voting by non-experts

ScholarChains synthesizes **proven mechanisms** from Linux, Wikipedia, ArXiv, and DeSci protocols while explicitly avoiding documented failure patterns.

---

## Key Research-Backed Enhancements

### 1. Multi-Stage Review Architecture

**Problem:** Binary accept/reject creates gatekeeping; single-stage review misses fraud.

**Solution:** Five-layer progressive validation:
- **Layer 1:** Immediate publishing (0-1 day)
- **Layer 2:** Community parallel review (1-30 days)
- **Layer 3:** Provisional acceptance (30-90 days)
- **Layer 4:** Targeted replication (6-24 months for high-impact)
- **Layer 5:** Continuous monitoring (ongoing)

**Evidence:** eLife's 2023 elimination of accept/reject (80% acceptance through post-publication review), ArXiv's immediate posting with overlay review, bioRxiv's 6-month publication timeline after preprint.

### 2. Hybrid Reputation System

**Problem:** Pure numerical reputation enables gaming (Stack Overflow fraud users averaged 5.47-6.95 suspicious activities); token-weighted governance allows non-experts to override domain knowledge (VitaDAO).

**Solution:** Multi-factor reputation combining:
- Publication quality (reviewed by peers)
- Review accuracy (rated by editors/community)
- Statistical consistency (GRIM, SPRITE checks across work)
- Time investment (years-long track record)
- Community trust (web of trust endorsements)
- Economic stake (small slashable deposits)

**Reputation properties:**
- Non-transferable (prevents buying influence)
- 5-year half-life decay (requires sustained contribution)
- Sublinear voting power (√reputation to prevent whale dominance)
- Progressive thresholds (low barrier to entry, rising with system maturity)

**Evidence:** Wikipedia's 84% fraud detection accuracy using hybrid technical + behavioral signals; Linux's progressive trust (patches → maintainership); GitCoin Passport's multi-factor stamps.

### 3. Automated Statistical Fraud Detection

**Problem:** Traditional fraud detection takes 2-10+ years; manual review misses systematic manipulation.

**Solution:** Automated checks running at publication:
- **GRIM test:** Validates means match possible integer sums
- **SPRITE test:** Checks statistical distributions for impossibilities
- **Image analysis:** Detects duplicated/manipulated figures
- **Cross-paper patterns:** Tracks p-value distributions, effect sizes across author's work
- **Statistical impossibility accumulation:** Flags authors with suspicious patterns

**Flags are public metadata, not blocks.** Papers publish immediately but carry transparency warnings.

**Evidence:** GRIM detected impossibilities in 36% of papers claiming to report means from discrete data; automated detection scales where manual review fails.

### 4. Economic Sustainability Without Speculation

**Problem:** Pure token models create pump-and-dump; DeSci protocols failed through speculative bubbles.

**Solution:** Diversified, sustainable funding:
- **Institutional subscriptions** (universities redirect journal savings: $10,000-20,000/year)
- **Lightning micropayments** (V4V: readers tip $0.10-1.00 after reading valuable papers)
- **Review bounties** (authors optionally attach: $50-200/review)
- **Quadratic funding** (community treasury matches based on community interest)
- **Replication bounties** (funded for high-impact papers: $5,000-50,000)

**No speculation required.** Tokens provide governance but voting power is sublinear + reputation-gated.

**Evidence:** ResearchHub's $RSC token combines with reputation; Lightning Network's production-ready micropayments; Gitcoin's quadratic funding distributes $50M+ fairly.

### 5. Progressive Trust Building for ECRs

**Problem:** Cold start problem hits early-career researchers hardest; they lack reviewer networks and face 6-24 month delays.

**Solution:** Linux/Wikipedia-style progressive onboarding:
1. **Day 1:** Anyone can publish papers (Nostr keypair only)
2. **Week 1:** Low reputation threshold for reviewing (initially: 10 reputation)
3. **Month 1:** Build reputation through quality reviews (earn 10-50 points per review)
4. **Month 3:** Access to governance voting (requires: 100 reputation)
5. **Year 1:** Editorial/curator roles (requires: 1000+ reputation, proven accuracy)

**Pattern:** Small contributions → demonstrated quality → incremental responsibility → eventual influence.

**Evidence:** Wikipedia's autoconfirm at 4 days/10 edits; Stack Overflow's 15 rep for upvoting, 125 for downvoting; Linux's maintainership emerging after consistent quality.

### 6. Transparent Public Review with Privacy Options

**Problem:** Anonymous review enables unchecked bias and unprofessional behavior; fully public review discourages honest criticism.

**Solution:** Flexible attribution model:
- Reviews published as **Nostr events with cryptographic signatures**
- **Default:** Pseudonymous (nyms build reputation over time)
- **Optional:** Zero-knowledge proof of expertise without identity reveal
- **Encouraged:** Voluntary disclosure after review acceptance (reputation bonus)
- **Full transparency:** All review history is public, searchable, permanent

Reviewers build trusted pseudonymous identities without institutional affiliation requirements.

**Evidence:** PubPeer's pseudonymous model enables fraud detection while protecting reporters; Linux mailing lists' full transparency prevents manipulation; zero-knowledge proofs allow credential verification without doxxing (ION, zkSNARKs).

### 7. Fork-Friendly Architecture

**Problem:** Single governance creates capture risk; disagreements force migration.

**Solution:** Nostr's relay model enables **coexisting standards:**
- Multiple relays implement different policies
- Researchers cross-post to preferred communities
- "Rough consensus" not forced unanimity
- Failed governance → users switch relays, not rebuild from scratch

**Evidence:** Nostr's censorship resistance through relay-hopping; Bitcoin's fork resilience; open-source project forks preserving communities.

---

## The Enhanced Lifecycle

### Phase 1: Immediate Publication (Day 0)

**What happens:**
1. Author uploads paper to Blossom (PDF + optional LaTeX source)
2. System generates SHA-256 hash
3. OpenTimestamps proof created and Bitcoin-anchored (1-24 hours)
4. Paper published to Nostr as addressable event (NIP-32623)
5. **NEW:** Automated statistical checks run immediately:
   - GRIM test for means
   - SPRITE test for distributions
   - Image duplication detection
   - Cross-reference with author's prior work
6. **NEW:** Paper receives provisional DOI (partnered with Crossref)
7. **NEW:** Statistical flags become public metadata (non-blocking)

**Result:** Paper is live in <1 minute, discoverable globally, with transparency warnings if applicable.

### Phase 2: Community Parallel Review (Days 1-30)

**What happens:**
1. **NEW:** NIP-90 Data Vending Machine matches papers to qualified reviewers:
   - Expertise tags (ML matching: paper topics ↔ reviewer history)
   - Reputation threshold (initially: 10 rep, rising with maturity)
   - Geographic/institutional diversity (anti-bias algorithm)
   - Review load balancing (prevent overcommitment)

2. **NEW:** Review bounty structure:
   - Author optionally attaches: $50-200/review (Lightning)
   - Protocol treasury matches via quadratic funding
   - Target: 5-10 parallel reviews per paper

3. Reviewers claim slots (first-come but diversity-weighted)

4. **NEW:** Structured review format (new NIP specification):
   ```
   Technical Assessment:
   - Methodology: [1-10 scale + written critique]
   - Results validity: [1-10 scale + written critique]
   - Statistical rigor: [1-10 scale + written critique]
   
   Reproducibility:
   - Data availability: [yes/no/partial]
   - Code availability: [yes/no/partial]
   - Replication feasibility: [1-10 scale]
   
   Overall:
   - Verdict: accept / accept-with-revisions / major-revisions / reject
   - Rating: [1-10 scale]
   - Confidence: [1-5 scale in reviewer's own expertise]
   - Conflicts of interest: [declared]
   ```

5. **NEW:** Review quality rating by editors/high-reputation community:
   - Accuracy (did reviewer catch real issues?)
   - Constructiveness (helpful feedback vs destructive)
   - Timeliness (completed within 2-week window?)
   - Rating affects reviewer reputation + payment bonus (1-5x multiplier)

6. Reviews published as **NIP-58 badges** on paper:
   - Pseudonymous by default
   - Optional identity reveal for reputation bonus (+20% payment)
   - Cryptographic signatures prevent tampering

**Result:** Papers receive 5-10 expert reviews within 30 days, compared to traditional 3-6 months with 2-3 reviews.

### Phase 3: Provisional Acceptance (Days 30-90)

**What happens:**
1. **Acceptance criteria:**
   - 3+ positive reviews (verdict: accept or accept-with-revisions)
   - Average rating ≥ 6.5/10
   - No unaddressed major statistical flags
   - Author has responded to reviewer concerns (public Nostr replies)

2. **NEW:** Confidence levels explicitly stated:
   - "Provisionally Accepted - Community Reviewed"
   - "Review Status: 7 positive, 2 revisions requested, 0 rejections"
   - "Statistical Checks: Passed" or "Flagged: [specific issues]"
   - "Replication Status: Pending" (updated later)

3. **NEW:** DOI activated, paper appears in decentralized search:
   - Indexed by participating institutions
   - Discoverable via Nostr relays
   - Citations allowed but marked as "provisional"

4. **NEW:** Post-publication commenting continues (PubPeer-style):
   - Anyone can add comments as Nostr replies
   - Authors must respond within 30 days or face reputation penalty
   - Low engagement = red flag for readers
   - High-quality comments rewarded with micropayments

**Result:** Papers achieve "published" status in 30-90 days vs traditional 6-18 months, with explicit confidence signaling.

### Phase 4: Targeted Replication (Months 6-24)

**What happens:**
1. **High-impact papers enter replication queue:**
   - Determined by: citations, community funding votes, strategic importance
   - Papers with >50 citations or >$1000 in community backing prioritized

2. **NEW:** Replication bounties funded by:
   - Protocol treasury allocation (40% of revenue)
   - Institutional subscriptions (earmarked for replication)
   - Community crowdfunding (quadratic matching)
   - Grant partnerships (NSF, NIH, private foundations)

3. **Registered reports model:**
   - Independent teams preregister methods before data collection
   - Reduces publication bias, ensures fairness
   - Registered reports published as linked Nostr events

4. **Results published transparently:**
   - Successful replication → paper upgraded to **"Verified"** status (highest badge)
   - Failed replication → confidence downgraded, investigation triggered
   - Ambiguous results → both papers remain accessible with linked metadata

5. **NEW:** Replication results prominently displayed:
   - "Replication Status: Successfully replicated by 2 independent teams"
   - "Replication Status: Failed replication (2/3 attempts), investigation ongoing"
   - Failures don't automatically retract but become prominent warning

**Result:** High-impact papers receive replication attempts within 6-24 months vs traditional 2-10+ years (if ever), with transparent results.

### Phase 5: Continuous Monitoring (Ongoing)

**What happens:**
1. **Automated cross-paper analysis:**
   - Track each author's p-value distributions (detecting p-hacking)
   - Monitor effect size consistency across studies
   - Accumulate statistical impossibilities (GRIM, SPRITE flags)
   - Pattern detection: too-good-to-be-true results, data fabrication signatures

2. **Community fraud reporting:**
   - Weighted thresholds trigger investigations:
     - 5+ reporters with aggregate reputation >1000, OR
     - Single reporter with reputation >5000
   - Legal defense fund protects good-faith reporters
   - Factual observations required (no accusations), safe harbor provisions

3. **Investigation process:**
   - Expert Council (top 10% reputation, elected) reviews evidence
   - Author has 30 days to respond with corrections/rebuttals
   - Public hearings for major cases (transparency requirement)
   - Outcomes: cleared, correction required, retraction, ban (severe fraud)

4. **Micropayment streams enable sustainability:**
   - Readers tip valuable papers (V4V: $0.10-1.00 per read)
   - Lightning Network enables frictionless payments
   - Authors build sustainable funding from quality work

5. **Redundant storage prevents censorship:**
   - Papers on Nostr relays (dozens of independent servers)
   - Files on IPFS and Blossom (content-addressable, multi-server)
   - Bitcoin timestamps immutable
   - No single point of failure or censorship

**Result:** Fraud detected in months vs years, with community oversight and transparent resolution.

---

## Stakeholder Perspectives

### 1. 👨‍🔬 **Authors** (Paper Publishers)

**Enhanced value propositions:**

✅ **30-day provisional acceptance** vs traditional 6-24 months
✅ **No prestige bias** - evaluated on merit, not institution (addresses 2:1 disparity)
✅ **Progressive reputation building** - ECRs start immediately, no cold start problem
✅ **Sustainable income** - Lightning zaps + bounties replace grant dependency
✅ **Transparent review** - see all feedback, respond publicly, build credibility
✅ **Fraud protection** - automated checks catch honest mistakes before publication
✅ **Replication support** - high-impact work gets verification funding
✅ **Censorship resistance** - no single gatekeeper can suppress findings

**New workflow:**

#### Step 1: Prepare Paper with Enhanced Metadata
```
Required:
- Title and abstract
- Subject classification (cs.CR, physics.gen-ph, etc.)
- Keywords/topics
- License (e.g., CC-BY-4.0)
- ORCID (links to reputation)

Optional but recommended:
- LaTeX source (enables better formatting)
- Data availability statement
- Code repository link
- Preregistration (if applicable)
- Conflicts of interest declaration
- Funding sources
```

#### Step 2: Upload to Blossom with Automatic Checks
```
1. Log in with Nostr identity
2. Upload PDF + optional LaTeX source
3. System automatically runs:
   - GRIM test (means validation)
   - SPRITE test (distribution checks)
   - Image duplication detection
   - Cross-reference with your prior work
4. Receive immediate feedback:
   - "✅ All checks passed"
   - "⚠️ Statistical flag: mean X.XX appears impossible for N=50"
   - "⚠️ Image similarity: Figure 2B matches prior paper (coincidence?)"
5. Opportunity to correct before publishing
```

#### Step 3: OpenTimestamps + Publication
```
1. System generates SHA-256 hash
2. OpenTimestamps proof created (Bitcoin-anchored within 24 hours)
3. Provisional DOI minted
4. Published to Nostr (Event Kind 32623)
5. Paper live in <1 minute
```

#### Step 4: Optional Review Bounty
```
1. Attach Lightning bounty (suggested: $50-200 per review)
2. Specify desired number of reviews (default: 5)
3. Protocol treasury matches via quadratic funding
4. Higher bounties attract faster, more thorough reviews
```

#### Step 5: Engage with Reviews (Days 1-30)
```
1. Receive notifications as reviews arrive
2. Read structured feedback (methodology, results, reproducibility)
3. Respond publicly within 30 days:
   - Accept critique: "Thank you, corrected in v2"
   - Provide clarification: "This is addressed in Appendix B"
   - Disagree respectfully: "We believe X because Y"
4. Publish revised version if needed (same ID, new version tag)
```

#### Step 6: Achieve Provisional Acceptance (Days 30-90)
```
Requirements:
- 3+ positive reviews
- Average rating ≥ 6.5/10
- Responses to all major concerns
- No unaddressed statistical flags

Result:
- DOI activated
- "Provisionally Accepted" badge
- Appears in institutional searches
- Citations allowed (marked as provisional)
```

#### Step 7: Build Long-term Reputation
```
Ongoing:
- Respond to post-publication comments
- Track citations and impact
- Receive micropayments from grateful readers
- High-impact papers enter replication queue
- Successful replication → "Verified" badge
- Build reputation through quality work → editorial opportunities
```

**Benefits for early-career researchers:**
- No 6-24 month wait destroying tenure prospects
- No institutional prestige bias (2:1 disparity eliminated)
- Immediate publication builds CV for immigration cases
- Transparent review reveals quality to hiring committees
- Progressive reputation system rewards consistent contribution
- Financial sustainability through micropayments + bounties

---

### 2. 🧑‍⚖️ **Reviewers** (Peer Reviewers)

**Enhanced value propositions:**

✅ **$100-150 base payment** + 2-5x quality bonuses vs traditional $0
✅ **Public reputation building** - verifiable review history, not anonymous labor
✅ **Structured review templates** - clear evaluation criteria, less ambiguity
✅ **Quality ratings** - community evaluates your reviews, builds expertise signal
✅ **Flexible attribution** - pseudonymous by default, reveal identity for bonus
✅ **Progressive responsibility** - start with low threshold (10 rep), earn influence
✅ **No exploitation** - paid for time, credited for work, respected for expertise

**New workflow:**

#### Step 1: Build Initial Reputation
```
Getting started (0 reputation):
1. Create Nostr identity
2. Link ORCID (optional but recommended)
3. Add expertise tags (ML, quantum computing, etc.)
4. Complete GitCoin Passport stamps:
   - Twitter verification
   - GitHub activity (if applicable)
   - Institutional affiliation (optional)
   - Prior publication history

Reach 10 reputation to review:
- Earn 5 rep per quality comment on papers
- Earn 2 rep per helpful answer in community forum
- Earn 10 rep for successful fraud report
- Time investment = anti-sybil (building reputation takes weeks)
```

#### Step 2: Discover Papers via Matching
```
NIP-90 Data Vending Machine matches you to papers:
1. Your expertise tags ↔ paper topics
2. Your availability (committed review load)
3. Diversity optimization (geographic, institutional)
4. Bounty amount (higher = priority notification)

You receive notifications:
- "New paper in [quantum cryptography]"
- "Bounty: $150 + quadratic match"
- "Target reviews: 7, claimed: 2, open: 5"
- "Deadline: 14 days"
```

#### Step 3: Claim Review Slot
```
Review claiming:
1. Click "Claim review"
2. System checks:
   - Reputation ≥ threshold (10 initially, rising with maturity)
   - No conflicts of interest (same institution, coauthors)
   - Not overcommitted (max 5 concurrent reviews)
3. Slot reserved for 14 days
4. Slashable stake: 0.001 BTC (~$50) prevents no-shows
   - Returned on completion
   - Forfeited if abandoned without cause
```

#### Step 4: Complete Structured Review
```
Review template (new NIP specification):

Technical Assessment:
- Methodology [1-10]: ___
  Written: [Detailed critique of methods, sample size, controls, etc.]

- Results Validity [1-10]: ___
  Written: [Analysis of findings, statistical tests, significance claims]

- Statistical Rigor [1-10]: ___
  Written: [Evaluation of analysis correctness, p-hacking concerns, etc.]

Reproducibility:
- Data availability: ☐ Yes ☐ No ☐ Partial
- Code availability: ☐ Yes ☐ No ☐ Partial
- Replication feasibility [1-10]: ___
  Written: [Could independent team replicate? What's needed?]

Overall:
- Verdict: ☐ Accept ☐ Accept with revisions ☐ Major revisions ☐ Reject
- Rating [1-10]: ___
- Confidence in own expertise [1-5]: ___
- Conflicts of interest: [Declare any]
- Time spent: ___ hours (for payment calculation)

Review text (markdown):
[Comprehensive written review, constructive feedback, specific suggestions]
```

#### Step 5: Submit with OpenTimestamps
```
1. Complete review within 14 days
2. System generates OpenTimestamps proof
3. Review published as NIP-4597 event
4. Choose attribution:
   - Pseudonymous (default): Nyms123
   - Zero-knowledge proof: "Verified expert in quantum cryptography"
   - Full disclosure (+ 20% bonus): Dr. Jane Smith, MIT
5. Slashable stake returned
```

#### Step 6: Receive Quality Rating + Payment
```
Within 7 days, editors/high-rep community rates your review:

Quality dimensions:
- Accuracy: Did you catch real issues? [1-5]
- Constructiveness: Helpful vs destructive? [1-5]
- Thoroughness: Addressed all dimensions? [1-5]
- Timeliness: Submitted on time? [1-5]

Payment calculation:
- Base: $100-150 (based on paper length, complexity)
- Quality multiplier: 1-5x (based on ratings)
- Attribution bonus: +20% (if identity revealed)
- Total: $100 to $900 per review

Quality also affects:
- Your reputation (+10-50 points per review)
- Future matching priority (high-quality reviewers get first pick)
- Editorial candidacy (top reviewers become editors)
```

#### Step 7: Build Long-term Reputation
```
Over time:
- Complete 10+ reviews → 200+ reputation
- High quality → 5x payment multipliers
- Build pseudonymous expertise signal
- Receive consulting opportunities (researchers contact you)
- Become eligible for Expert Council (top 10% reputation)
- Editorial roles: curate papers, rate other reviews, investigate fraud

Reputation properties:
- Non-transferable (can't buy or sell)
- 5-year half-life (must sustain contribution)
- Decays without activity (prevents squatting)
- Visible history (all reviews public, searchable)
```

**Benefits vs traditional reviewing:**
- Paid $100-900 per review vs $0
- Public recognition vs anonymity
- 2 weeks vs months of unpaid labor
- Build verifiable expertise vs hidden contribution
- Progressive responsibility vs exploitation of junior faculty
- Choose papers vs assigned by editors

---

### 3. 📖 **Readers** (Research Consumers)

**Enhanced value propositions:**

✅ **Free, open access** - no $30-50 per paper or subscriptions
✅ **Transparent quality signals** - see all reviews, ratings, statistical checks
✅ **Confidence levels** - explicit provisional/verified status
✅ **Fraud transparency** - see flags, community reports, investigation status
✅ **Citation tracking** - built into protocol, see impact
✅ **Micropayment support** - tip valuable papers ($0.10-1.00), support authors directly
✅ **No institutional barriers** - access from anywhere, no university proxy

**New workflow:**

#### Step 1: Discover Papers
```
Discovery methods:
1. Browse global feed (latest papers, all fields)
2. Search by keywords (quantum cryptography, CRISPR, etc.)
3. Filter by:
   - Subject classification (cs.CR, bio.gen, etc.)
   - Confidence level (provisional, verified)
   - Review count (≥5 reviews)
   - Statistical flags (show only passed)
   - Replication status (replicated, pending, failed)
4. Follow authors (Nostr follow lists)
5. Subscribe to topics (notifications for new papers)
6. Recommendations (based on reading history, citations)
```

#### Step 2: Evaluate Quality (Enhanced Signals)
```
Multi-layered quality assessment:

Reviews:
- Read 5-10 peer reviews (vs traditional 2-3)
- Check verdicts: 7 accept, 2 revise, 0 reject
- Average rating: 7.8/10
- Specific critiques: methodology, results, reproducibility

Reviewer credibility:
- Reputation scores (200, 450, 1200, etc.)
- Number of quality reviews (15, 30, 50)
- Expertise match (quantum cryptography specialists)
- Attribution (pseudonymous, verified expert, or full name)

Statistical checks:
- ✅ GRIM: Passed
- ✅ SPRITE: Passed
- ✅ Image analysis: Passed
- ⚠️ Author p-value distribution: Slightly optimistic (not suspicious)

Cryptographic verification:
- Download .ots proof file
- Verify against Bitcoin blockchain
- Confirm publication date: 2025-01-15, block 820,450
- Blossom hash matches PDF: verified

Author reputation:
- 15 prior publications
- Average rating: 7.5/10
- Citations received: 342
- Community trust: 850 reputation
- No fraud flags

Replication status:
- 2 registered reports in progress
- Expected completion: 6-12 months
- Community funding: $15,000 backing replication

Confidence level:
"Provisionally Accepted - Community Reviewed
- Review Status: 7 positive, 2 revisions requested, 0 rejections
- Statistical Checks: Passed
- Replication Status: In progress (2 teams)
- Citations: 23 (15 provisional, 8 verified papers)"
```

#### Step 3: Access Content
```
Reading:
1. Click "Download PDF" (free, instant)
2. Blossom server delivers file (content-addressable)
3. Optional: Download LaTeX source for analysis
4. Optional: Download dataset (if available)
5. Optional: Access code repository

Verification:
1. Verify Blossom hash matches PDF
2. Check OpenTimestamps proof
3. Confirm Bitcoin block height
4. Validate Nostr event signature
```

#### Step 4: Engage with Paper
```
Post-publication interaction:

Comments:
- Add questions (Nostr replies)
- Flag concerns (statistical, methodological)
- Suggest improvements
- Discuss implications

Citations:
- Cite in your own papers (tracked automatically)
- Citation appears in paper's metadata
- Authors notified of citation
- Citation graph built transparently

Support:
- Tip paper if valuable (Lightning: $0.10-1.00)
- Back replication effort (crowdfunding)
- Share on social (Nostr, Twitter, etc.)
- Recommend to colleagues
```

#### Step 5: Monitor Updates
```
Ongoing:
- Author publishes v2 addressing reviews
- Replication results published (successful!)
- Paper upgraded to "Verified" status
- New citations added (now 45 total)
- You receive notifications of updates

Paper evolution visible:
v1 (2025-01-15): Original submission
v2 (2025-02-10): Addressed reviewer concerns
Replication 1 (2025-08-20): Successful (University of Tokyo)
Replication 2 (2025-09-15): Successful (ETH Zurich)
Status upgraded: Provisional → Verified
```

**Benefits vs traditional access:**
- $0 vs $30-50 per paper or $thousands in subscriptions
- Instant access vs weeks waiting for interlibrary loan
- 5-10 reviews vs 2-3 (more perspectives)
- Transparent quality signals vs opaque journal reputation
- See statistical checks vs trust publisher
- Track replication vs assume validity
- Support authors directly vs enrich publishers

---

## Multi-Layer Review Architecture

### Layer 1: Immediate Publishing (Technical Details)

**Publication mechanics:**

```
Nostr Event Structure (Kind 32623):
{
  "id": "<event-id>",
  "pubkey": "<author-pubkey>",
  "created_at": 1705334400,
  "kind": 32623,
  "tags": [
    ["d", "<unique-paper-id>"],
    ["title", "Quantum Key Distribution via Entangled Photons"],
    ["summary", "We demonstrate a novel approach to..."],
    ["published_at", "1705334400"],
    ["ots", "<base64-encoded-ots-proof>"],
    ["h", "<blossom-blob-sha256>"],
    ["url", "https://blossom.example.com/<hash>"],
    ["subject", "cs.CR"],
    ["t", "quantum-computing"],
    ["t", "cryptography"],
    ["license", "CC-BY-4.0"],
    ["doi", "10.xxxxx/scholarchains.12345"],
    
    // NEW: Enhanced metadata
    ["orcid", "0000-0001-2345-6789"],
    ["data-available", "yes"],
    ["data-url", "https://github.com/author/dataset"],
    ["code-available", "yes"],
    ["code-url", "https://github.com/author/code"],
    ["preregistration", "https://osf.io/abc123"],
    ["funding", "NSF Grant 12345"],
    ["conflicts", "none"],
    
    // NEW: Automated check results
    ["grim-check", "passed"],
    ["sprite-check", "passed"],
    ["image-check", "passed"],
    ["statistical-flags", "0"],
    ["version", "1"]
  ],
  "content": "<full-abstract-and-metadata>",
  "sig": "<author-signature>"
}
```

**Automated statistical checks (immediate):**

```python
# GRIM Test (Granularity-Related Inconsistency of Means)
def grim_test(mean, n, items):
    """
    Check if reported mean is possible given sample size.
    Example: Mean 3.51 with N=50 is impossible if items are integers.
    """
    possible_sums = [mean * n + i for i in range(items)]
    if all(abs(s - int(s)) > 0.01 for s in possible_sums):
        return {"status": "FLAGGED", "reason": "Impossible mean for sample size"}
    return {"status": "PASSED"}

# SPRITE Test (Sample Parameter Reconstruction via Iterative Techniques)
def sprite_test(mean, sd, n, min_val, max_val):
    """
    Reconstruct possible data distributions and check feasibility.
    Detects fabricated statistics that don't match real data patterns.
    """
    # Attempt to reconstruct data matching reported stats
    # Check if reconstruction possible within constraints
    # Flag if no valid distribution exists

# Image Analysis
def image_duplication_check(paper_images, author_prior_papers):
    """
    Check for:
    - Duplicated images within paper
    - Images reused from prior papers without attribution
    - Evidence of manipulation (inconsistent lighting, splicing)
    """
    # Perceptual hashing, SIFT features, forensic analysis

# Cross-paper Pattern Detection
def author_pattern_analysis(author_pubkey):
    """
    Analyze all papers from this author:
    - P-value distribution (should be uniform, not clustered at p<0.05)
    - Effect size consistency (wild variation suggests selective reporting)
    - Statistical test choices (excessive flexibility = researcher degrees of freedom)
    """
```

**Results published transparently:**

```
Paper: "Quantum Key Distribution via Entangled Photons"
Author: alice@nostr.example (Reputation: 450)
Status: Published (Provisional)
Published: 2025-01-15 12:00 UTC (Bitcoin block 820,450)

Statistical Checks:
✅ GRIM Test: Passed (all means feasible for reported N)
✅ SPRITE Test: Passed (distributions reconstructible)
✅ Image Analysis: Passed (no duplication detected)
✅ Author Patterns: Normal (p-values uniform, effect sizes consistent)

Available for Review: Yes
Target Reviews: 7
Current Reviews: 2
Review Deadline: 2025-01-29
```

### Layer 2: Parallel Community Review (Technical Details)

**NIP-90 matching algorithm:**

```python
def match_reviewers_to_paper(paper_event, reviewer_pool):
    """
    Match qualified reviewers to papers using multi-factor optimization.
    """
    # Extract paper metadata
    topics = paper_event.get_tags("t")
    subject = paper_event.get_tag("subject")
    author_pubkey = paper_event.pubkey
    bounty = paper_event.get_tag("review-bounty")
    
    # Filter qualified reviewers
    qualified = [r for r in reviewer_pool if
        r.reputation >= REVIEW_THRESHOLD and
        topic_match(r.expertise, topics) >= 0.6 and
        not has_conflict(r, author_pubkey) and
        r.current_load < MAX_CONCURRENT_REVIEWS
    ]
    
    # Score reviewers
    scored = []
    for reviewer in qualified:
        score = (
            topic_match(reviewer.expertise, topics) * 0.4 +
            quality_score(reviewer.review_history) * 0.3 +
            diversity_bonus(reviewer, paper_event) * 0.2 +
            availability_score(reviewer) * 0.1
        )
        scored.append((reviewer, score))
    
    # Return top matches, ensuring diversity
    return diverse_selection(scored, target_count=10)

def topic_match(reviewer_expertise, paper_topics):
    """Cosine similarity between reviewer expertise and paper topics."""
    # ML embedding model trained on paper abstracts + reviewer history
    
def quality_score(review_history):
    """Aggregate quality ratings from prior reviews."""
    # Average of accuracy, constructiveness, thoroughness, timeliness
    
def diversity_bonus(reviewer, paper):
    """Promote geographic/institutional diversity."""
    # Bonus if reviewer from underrepresented region/institution
    # Prevents clustering of reviews from single institution
    
def has_conflict(reviewer, author_pubkey):
    """Check for conflicts of interest."""
    # Same institution, recent coauthorship, personal connection
```

**Review event structure (new NIP):**

```
Nostr Event Structure (Kind 4597):
{
  "id": "<review-event-id>",
  "pubkey": "<reviewer-pubkey>",
  "created_at": 1705420800,
  "kind": 4597,
  "tags": [
    ["a", "32623:<author-pubkey>:<paper-id>"],  // Paper being reviewed
    ["p", "<author-pubkey>"],  // Notify author
    ["ots", "<base64-ots-proof>"],
    
    // Structured ratings
    ["rating", "methodology", "8"],
    ["rating", "results", "7"],
    ["rating", "statistical-rigor", "9"],
    ["rating", "overall", "8"],
    
    // Reproducibility
    ["reproducibility", "data-available", "yes"],
    ["reproducibility", "code-available", "yes"],
    ["reproducibility", "feasibility", "8"],
    
    // Verdict
    ["verdict", "accept-with-revisions"],
    ["confidence", "4"],  // Confidence in own expertise (1-5)
    
    // Attribution
    ["attribution", "pseudonymous"],  // or "zk-proof" or "full-disclosure"
    ["orcid", "0000-0002-xxxx-xxxx"],  // Optional, for full disclosure
    
    // Metadata
    ["time-spent", "4.5"],  // Hours (for payment)
    ["conflicts", "none"],
    ["version-reviewed", "1"]
  ],
  "content": "# Review of 'Quantum Key Distribution via Entangled Photons'\n\n## Summary\n\n..."
}
```

**Quality rating system:**

```python
def rate_review_quality(review_event, paper_event, raters):
    """
    Editors and high-reputation community members rate review quality.
    """
    ratings = {
        "accuracy": [],
        "constructiveness": [],
        "thoroughness": [],
        "timeliness": []
    }
    
    for rater in raters:
        if not can_rate(rater, review_event):
            continue  # Must have expertise + reputation
        
        # Accuracy: Did reviewer catch real issues?
        # Compare review concerns to objective checks
        accuracy = assess_accuracy(review_event, paper_event, rater)
        
        # Constructiveness: Helpful vs destructive?
        constructiveness = assess_constructiveness(review_event.content, rater)
        
        # Thoroughness: Addressed all dimensions?
        thoroughness = assess_thoroughness(review_event, rater)
        
        # Timeliness: Submitted on time?
        deadline = paper_event.get_tag("review-deadline")
        timeliness = 5 if review_event.created_at < deadline else 1
        
        ratings["accuracy"].append(accuracy)
        ratings["constructiveness"].append(constructiveness)
        ratings["thoroughness"].append(thoroughness)
        ratings["timeliness"].append(timeliness)
    
    # Aggregate ratings (median to prevent outlier manipulation)
    final_ratings = {k: median(v) for k, v in ratings.items()}
    overall_quality = mean(final_ratings.values())
    
    # Calculate payment multiplier (1-5x)
    multiplier = 1 + (overall_quality - 3) * 0.5  # Scale 1x at score 3, 5x at score 5
    
    return {
        "quality_ratings": final_ratings,
        "overall": overall_quality,
        "payment_multiplier": max(1.0, min(5.0, multiplier))
    }
```

**Review payment calculation:**

```python
def calculate_review_payment(review_event, paper_event, quality_ratings):
    """
    Calculate reviewer payment based on multiple factors.
    """
    # Base payment (length and complexity)
    paper_pages = estimate_pages(paper_event.get_tag("h"))
    base = 100 + (paper_pages - 10) * 5  # $100 for 10 pages, +$5 per page
    
    # Quality multiplier (1-5x based on ratings)
    multiplier = quality_ratings["payment_multiplier"]
    
    # Attribution bonus (+20% for full disclosure)
    attribution = review_event.get_tag("attribution")
    attr_bonus = 1.2 if attribution == "full-disclosure" else 1.0
    
    # Author bounty (if attached)
    author_bounty = int(paper_event.get_tag("review-bounty", "0"))
    
    # Quadratic funding match from treasury
    community_interest = count_interested_users(paper_event)
    qf_match = sqrt(community_interest) * 10  # Quadratic scaling
    
    # Total payment
    total = (base * multiplier * attr_bonus) + author_bounty + qf_match
    
    return {
        "base": base,
        "multiplier": multiplier,
        "attribution_bonus": attr_bonus,
        "author_bounty": author_bounty,
        "quadratic_match": qf_match,
        "total": round(total, 2)
    }
```

### Layer 3: Provisional Acceptance (Technical Details)

**Acceptance algorithm:**

```python
def evaluate_provisional_acceptance(paper_event, reviews):
    """
    Determine if paper meets provisional acceptance criteria.
    """
    # Requirement 1: Minimum reviews
    if len(reviews) < 3:
        return {"accepted": False, "reason": "Insufficient reviews (need 3+)"}
    
    # Requirement 2: Positive verdicts
    verdicts = [r.get_tag("verdict") for r in reviews]
    positive = sum(1 for v in verdicts if v in ["accept", "accept-with-revisions"])
    if positive < 3:
        return {"accepted": False, "reason": "Insufficient positive reviews"}
    
    # Requirement 3: Rating threshold
    ratings = [float(r.get_tag("rating", "overall", "0")) for r in reviews]
    avg_rating = mean(ratings)
    if avg_rating < 6.5:
        return {"accepted": False, "reason": f"Average rating {avg_rating:.1f} below threshold"}
    
    # Requirement 4: No unaddressed statistical flags
    flags = paper_event.get_tags("statistical-flags")
    for flag in flags:
        if not is_addressed(flag, paper_event, reviews):
            return {"accepted": False, "reason": f"Unaddressed flag: {flag}"}
    
    # Requirement 5: Author responses
    for review in reviews:
        if has_major_concerns(review):
            if not has_author_response(paper_event, review):
                return {"accepted": False, "reason": "Major concerns not addressed"}
    
    # All criteria met
    confidence = calculate_confidence_score(paper_event, reviews)
    
    return {
        "accepted": True,
        "confidence": confidence,
        "review_summary": {
            "total": len(reviews),
            "positive": positive,
            "average_rating": avg_rating,
            "statistical_checks": "passed"
        }
    }

def calculate_confidence_score(paper_event, reviews):
    """
    Calculate explicit confidence level (0-100).
    """
    score = 50  # Base provisional confidence
    
    # More reviews = higher confidence
    score += min(20, len(reviews) * 2)
    
    # Higher ratings = higher confidence
    avg_rating = mean([float(r.get_tag("rating", "overall", "0")) for r in reviews])
    score += (avg_rating - 5) * 5  # +/- 0-25 points
    
    # Reviewer credibility
    avg_reviewer_rep = mean([get_reputation(r.pubkey) for r in reviews])
    score += min(10, avg_reviewer_rep / 100)
    
    # Statistical checks passed
    if all_checks_passed(paper_event):
        score += 10
    
    # Reproducibility signals
    if has_data_code(paper_event):
        score += 5
    
    return min(100, max(0, score))
```

**Confidence display:**

```
Paper: "Quantum Key Distribution via Entangled Photons"
Status: ✅ Provisionally Accepted
Confidence: 78/100

Breakdown:
- Review Quality: 85/100 (7 reviews, avg 8.2/10, high rep reviewers)
- Statistical Checks: 100/100 (all passed)
- Reproducibility: 80/100 (data + code available)
- Community Trust: 70/100 (450 author reputation, no fraud history)

What "Provisionally Accepted" means:
- Reviewed by expert community (not just 2-3 anonymous reviewers)
- Passed automated statistical checks
- No major methodological concerns
- Not yet replicated (typical for provisional status)
- Safe to cite as "provisional" in your work
- Will be upgraded to "Verified" after successful replication

Next steps:
- 2 replication teams registered
- Expected completion: Aug-Sep 2025
- Community funding: $15,000 supporting replication
```

### Layer 4: Targeted Replication (Technical Details)

**Replication prioritization:**

```python
def prioritize_replication_queue(papers):
    """
    Determine which papers should receive replication funding.
    """
    scored_papers = []
    
    for paper in papers:
        score = 0
        
        # Citation impact (0-40 points)
        citations = count_citations(paper)
        score += min(40, citations * 0.5)
        
        # Community backing (0-30 points)
        community_funding = sum_community_pledges(paper)
        score += min(30, community_funding / 100)
        
        # Strategic importance (0-20 points)
        if is_controversial(paper) or has_policy_implications(paper):
            score += 20
        
        # Time since publication (0-10 points)
        months = months_since_publication(paper)
        score += min(10, months * 0.5)
        
        # Replication feasibility (-10 to +10 points)
        feasibility = assess_feasibility(paper)
        score += feasibility * 10 - 5
        
        scored_papers.append((paper, score))
    
    # Sort by score, allocate budget top-down
    sorted_papers = sorted(scored_papers, key=lambda x: x[1], reverse=True)
    
    return allocate_replication_budget(sorted_papers, ANNUAL_BUDGET)

def allocate_replication_budget(sorted_papers, budget):
    """
    Allocate replication funding based on priority and cost.
    """
    allocated = []
    remaining = budget
    
    for paper, score in sorted_papers:
        estimated_cost = estimate_replication_cost(paper)
        
        if estimated_cost <= remaining:
            allocated.append({
                "paper": paper,
                "priority_score": score,
                "funding": estimated_cost,
                "teams": 2  # Fund 2 independent teams
            })
            remaining -= estimated_cost
        
        if remaining < 5000:  # Min viable replication
            break
    
    return allocated
```

**Registered reports process:**

```
1. Replication Team Application:
   - Team submits proposal (methods, timeline, budget)
   - Expert Council reviews applications
   - Select 2 independent teams per paper

2. Preregistration (before data collection):
   - Teams publish detailed methods as Nostr events
   - Specifies: hypotheses, sample size, analysis plan
   - Locked via OpenTimestamps (prevents post-hoc changes)
   - Community reviews methods (catch issues early)

3. Data Collection:
   - Teams conduct studies independently
   - Progress updates published (optional, for transparency)
   - Materials/data/code shared openly

4. Results Publication:
   - Results published regardless of outcome
   - Success, failure, or ambiguous → all valuable
   - Linked to original paper via Nostr tags

5. Outcome Integration:
   - Successful replication: Original upgraded to "Verified"
   - Failed replication: Original confidence downgraded, investigation
   - Mixed results: Both papers remain, linked with full context
```

**Replication event structure:**

```
Nostr Event (Kind 4598 - Replication Result):
{
  "id": "<replication-event-id>",
  "pubkey": "<team-lead-pubkey>",
  "created_at": 1735689600,
  "kind": 4598,
  "tags": [
    ["a", "32623:<original-author>:<paper-id>"],  // Original paper
    ["preregistration", "<preregistration-event-id>"],
    
    // Replication outcome
    ["outcome", "successful"],  // or "failed", "partial", "inconclusive"
    ["effect-size-original", "0.45"],
    ["effect-size-replication", "0.42"],
    ["confidence-interval", "0.35-0.49"],
    ["p-value", "0.003"],
    
    // Materials
    ["data-url", "https://osf.io/xyz789"],
    ["code-url", "https://github.com/team/replication"],
    ["materials-url", "https://osf.io/xyz789/materials"],
    
    // Metadata
    ["team-institution", "University of Tokyo"],
    ["funding-source", "ScholarChains Replication Fund"],
    ["cost", "12500"],
    ["sample-size", "150"],
    ["team-size", "4"]
  ],
  "content": "# Replication of 'Quantum Key Distribution via Entangled Photons'\n\n## Summary\n\nWe successfully replicated..."
}
```

### Layer 5: Continuous Monitoring (Technical Details)

**Cross-paper pattern detection:**

```python
def analyze_author_patterns(author_pubkey, papers):
    """
    Detect suspicious patterns across all papers from an author.
    """
    findings = {
        "p_value_distribution": analyze_p_values(papers),
        "effect_size_consistency": analyze_effect_sizes(papers),
        "statistical_impossibilities": count_impossibilities(papers),
        "data_reuse": detect_data_reuse(papers),
        "self_plagiarism": detect_self_plagiarism(papers)
    }
    
    # Flag if multiple anomalies detected
    anomaly_count = sum(1 for f in findings.values() if f["flagged"])
    
    if anomaly_count >= 2:
        return {
            "status": "SUSPICIOUS",
            "confidence": calculate_suspicion_confidence(findings),
            "recommendation": "Manual investigation recommended",
            "findings": findings
        }
    
    return {"status": "NORMAL", "findings": findings}

def analyze_p_values(papers):
    """
    Check if p-values are suspiciously clustered just below significance threshold.
    """
    p_values = extract_p_values(papers)
    
    # Theoretical: uniform distribution 0-1
    # Reality: often clustered 0.04-0.05 (p-hacking)
    
    just_significant = sum(1 for p in p_values if 0.04 <= p <= 0.05)
    proportion = just_significant / len(p_values)
    
    # Flag if >30% of p-values in 0.04-0.05 range (expected: 5%)
    if proportion > 0.30:
        return {
            "flagged": True,
            "reason": f"{proportion*100:.1f}% of p-values clustered 0.04-0.05 (expected: 5%)",
            "severity": "moderate"
        }
    
    return {"flagged": False}

def analyze_effect_sizes(papers):
    """
    Check if effect sizes are suspiciously consistent or variable.
    """
    effect_sizes = extract_effect_sizes(papers)
    
    # Too consistent = possible fabrication
    # Too variable = possible selective reporting
    
    std_dev = np.std(effect_sizes)
    
    if std_dev < 0.1:  # Implausibly consistent
        return {
            "flagged": True,
            "reason": f"Effect sizes too consistent (SD={std_dev:.3f})",
            "severity": "moderate"
        }
    
    if std_dev > 0.5:  # Implausibly variable
        return {
            "flagged": True,
            "reason": f"Effect sizes highly variable (SD={std_dev:.3f})",
            "severity": "low"
        }
    
    return {"flagged": False}
```

**Community fraud reporting:**

```python
def process_fraud_report(report_event, reported_paper):
    """
    Handle community fraud report with weighted thresholds.
    """
    reporter_pubkey = report_event.pubkey
    reporter_rep = get_reputation(reporter_pubkey)
    
    # Get all reports on this paper
    all_reports = get_fraud_reports(reported_paper)
    
    # Calculate weighted threshold
    total_rep = sum(get_reputation(r.pubkey) for r in all_reports)
    unique_reporters = len(set(r.pubkey for r in all_reports))
    
    # Threshold 1: 5+ reporters with aggregate 1000+ reputation
    threshold_1 = unique_reporters >= 5 and total_rep >= 1000
    
    # Threshold 2: Single high-reputation reporter (5000+)
    threshold_2 = reporter_rep >= 5000
    
    # Threshold 3: Multiple moderate-reputation reporters (3+ with 500+ each)
    moderate_rep_reporters = sum(1 for r in all_reports if get_reputation(r.pubkey) >= 500)
    threshold_3 = moderate_rep_reporters >= 3
    
    if threshold_1 or threshold_2 or threshold_3:
        return {
            "action": "TRIGGER_INVESTIGATION",
            "reason": f"Threshold met: {unique_reporters} reporters, {total_rep} total rep",
            "reports": all_reports
        }
    
    return {
        "action": "LOG_REPORT",
        "status": f"Logged ({unique_reporters}/{5} reporters, {total_rep}/{1000} rep)"
    }

def conduct_investigation(paper_event, reports):
    """
    Formal investigation by Expert Council.
    """
    # 1. Notify author (30 days to respond)
    notify_author(paper_event.pubkey, reports)
    
    # 2. Assemble investigation team
    council = get_expert_council_members()
    expertise_match = [c for c in council if matches_paper_topics(c, paper_event)]
    team = random.sample(expertise_match, 3)  # 3 council members
    
    # 3. Review evidence
    evidence = {
        "fraud_reports": reports,
        "statistical_analysis": analyze_author_patterns(paper_event.pubkey, get_author_papers(paper_event.pubkey)),
        "community_discussion": get_public_comments(paper_event),
        "author_response": wait_for_author_response(30_days)
    }
    
    # 4. Public hearing (for major cases)
    if is_major_case(evidence):
        conduct_public_hearing(paper_event, team, evidence)
    
    # 5. Council decision (majority vote)
    votes = [member.vote(evidence) for member in team]
    decision = majority_vote(votes)
    
    # 6. Implement outcome
    implement_decision(paper_event, decision)
    
    return decision

def implement_decision(paper_event, decision):
    """
    Execute investigation outcome.
    """
    if decision["outcome"] == "CLEARED":
        # Remove fraud flags, restore confidence
        update_paper_status(paper_event, "cleared", decision["explanation"])
        compensate_author_for_disruption(paper_event.pubkey, decision["compensation"])
    
    elif decision["outcome"] == "CORRECTION_REQUIRED":
        # Author must publish correction within 30 days
        require_correction(paper_event, decision["required_changes"])
        downgrade_confidence(paper_event, decision["confidence_penalty"])
    
    elif decision["outcome"] == "RETRACTION":
        # Paper retracted, author reputation penalty
        retract_paper(paper_event, decision["reason"])
        penalize_reputation(paper_event.pubkey, decision["penalty"])
    
    elif decision["outcome"] == "BAN":
        # Severe fraud: author banned from protocol
        ban_author(paper_event.pubkey, decision["duration"])
        retract_all_papers(paper_event.pubkey)
        alert_community(decision["announcement"])
    
    # Publish decision publicly
    publish_investigation_result(paper_event, decision)
```

---

## Reputation System Design

### Core Principles

**Non-transferable:** Reputation cannot be bought, sold, or transferred. Each identity builds its own history.

**Multi-factor:** Combines technical (statistical checks), social (community trust), and economic (staked value) signals to resist gaming.

**Decay with half-life:** 5-year half-life requires sustained contribution. Inactive accounts lose influence gradually.

**Progressive thresholds:** Low barrier to entry (anyone can start), rising standards for influence (editorial, governance).

**Transparent history:** All actions (publications, reviews, comments) are public and searchable.

### Reputation Calculation

```python
def calculate_reputation(user_pubkey):
    """
    Calculate user reputation from multiple signals.
    """
    rep = 0
    
    # 1. Publication Quality (0-40% of total)
    papers = get_user_papers(user_pubkey)
    for paper in papers:
        reviews = get_paper_reviews(paper)
        avg_rating = mean([r.get_tag("rating", "overall") for r in reviews])
        citations = count_citations(paper)
        age_months = months_since_publication(paper)
        
        # Quality points (0-100 per paper)
        paper_rep = (avg_rating * 5) + (citations * 2)
        
        # Apply 5-year half-life decay
        decay_factor = 2 ** (-age_months / 60)
        paper_rep *= decay_factor
        
        rep += paper_rep
    
    # 2. Review Quality (0-40% of total)
    reviews = get_user_reviews(user_pubkey)
    for review in reviews:
        quality_ratings = get_review_quality_ratings(review)
        avg_quality = mean(quality_ratings.values())
        age_months = months_since_review(review)
        
        # Review points (0-50 per review)
        review_rep = avg_quality * 10
        
        # Decay
        decay_factor = 2 ** (-age_months / 60)
        review_rep *= decay_factor
        
        rep += review_rep
    
    # 3. Community Trust (0-15% of total)
    endorsements = get_web_of_trust_endorsements(user_pubkey)
    weighted_endorsements = sum(get_reputation(e.pubkey) * e.strength for e in endorsements)
    rep += min(150, weighted_endorsements * 0.1)
    
    # 4. Governance Participation (0-10% of total)
    votes = get_governance_votes(user_pubkey)
    proposals = get_governance_proposals(user_pubkey)
    rep += min(100, len(votes) * 0.5 + len(proposals) * 5)
    
    # 5. Economic Stake (0-5% of total)
    staked_btc = get_staked_amount(user_pubkey)
    rep += min(50, staked_btc * 5000)  # 0.01 BTC = 50 rep
    
    # 6. Statistical Consistency Bonus (0-10% of total)
    consistency = analyze_author_patterns(user_pubkey, papers)
    if consistency["status"] == "NORMAL":
        rep += 100
    elif consistency["status"] == "SUSPICIOUS":
        rep -= 50
    
    # 7. Time Investment (anti-sybil)
    account_age_months = months_since_first_activity(user_pubkey)
    time_bonus = min(100, account_age_months * 2)
    rep += time_bonus
    
    # 8. Penalties (fraud, misconduct)
    penalties = get_reputation_penalties(user_pubkey)
    rep -= sum(p.amount for p in penalties)
    
    return max(0, rep)  # Never negative
```

### Reputation Tiers

```
Tier 0: Newcomer (0-10 rep)
- Can: Publish papers, comment on papers
- Cannot: Review papers, vote in governance
- Time to reach: Immediate

Tier 1: Contributor (10-100 rep)
- Can: Review papers (low threshold), vote in minor governance
- Cannot: Editorial roles, major governance
- Time to reach: 1-2 months (5-10 quality reviews)

Tier 2: Established (100-500 rep)
- Can: Vote in major governance, propose changes
- Cannot: Expert Council, investigation team
- Time to reach: 6-12 months (consistent quality work)

Tier 3: Expert (500-1000 rep)
- Can: Editorial roles, curator, mentor newcomers
- Cannot: Expert Council (needs 1000+)
- Time to reach: 1-2 years (sustained excellence)

Tier 4: Council (1000+ rep)
- Can: Expert Council (top 10%), investigation team, technical standards
- Cannot: Nothing (full protocol access)
- Time to reach: 2-5 years (exceptional contribution)
```

### Gaming Prevention

**Sock puppets:** Creating fake identities to manipulate reputation

- **Detection:** GitCoin Passport multi-factor stamps, ION DIDs, behavioral analysis
- **Prevention:** Time investment (building rep takes months), cross-verification required

**Voting rings:** Coordinated upvoting/positive reviewing

- **Detection:** Graph analysis (Louvain community detection), statistical anomalies, timing patterns
- **Prevention:** Review quality ratings by independent evaluators, reputation decay

**Reputation farming:** Gaming metrics without real contribution

- **Detection:** Automated consistency checks, peer evaluation of reviews
- **Prevention:** Multi-factor reputation (can't optimize single metric), penalties for low-quality work

**Sybil attacks:** Creating many identities to control governance

- **Detection:** Quadratic voting, reputation requirements, stake requirements
- **Prevention:** Sublinear voting power (√reputation), identity proofing (ION, ORCID)

**Evidence from research:**
- Wikipedia: 84% fraud detection via hybrid signals
- Stack Overflow: Voting rings detected via graph analysis
- GitCoin: Multi-factor stamps prevent single-identity attacks

---

## Fraud Detection & Prevention

### Automated Detection Systems

**Layer 1: Pre-publication checks (immediate)**

```
Statistical impossibility detection:
- GRIM test: 36% of papers had impossible means in studies
- SPRITE test: Reconstructs data distributions, flags fabrication
- Image analysis: Detects duplication, manipulation
- Cross-paper patterns: P-hacking, effect size anomalies

Flags visible but non-blocking:
- Papers publish immediately with transparency warnings
- Authors can correct before reviews
- Readers see flags in metadata
```

**Layer 2: Reviewer scrutiny (days 1-30)**

```
Human expert evaluation:
- 5-10 reviewers check methodology, statistics, reproducibility
- Structured review format ensures comprehensive evaluation
- Reviewers flag concerns publicly
- Authors must address issues or face confidence downgrade
```

**Layer 3: Post-publication monitoring (ongoing)**

```
Community oversight:
- Anyone can comment/flag issues (PubPeer-style)
- Automated cross-paper pattern analysis
- Cumulative evidence tracking
- Weighted reporting thresholds trigger investigations
```

### Fraud Investigation Process

**Trigger conditions:**
1. 5+ reporters with 1000+ aggregate reputation
2. Single reporter with 5000+ reputation
3. Automated detection confidence >90%

**Investigation steps:**

```
1. Initial Review (Week 1):
   - Expert Council reviews reports
   - Preliminary evidence assessment
   - Decision: dismiss, monitor, or investigate

2. Author Notification (Week 2):
   - Author receives formal notice
   - 30 days to provide response/corrections
   - Public announcement of investigation

3. Evidence Gathering (Weeks 3-6):
   - Automated statistical analysis
   - Review community reports
   - Examine author's other papers
   - Consult domain experts
   - Author response considered

4. Public Hearing (Week 7, if major case):
   - Live-streamed discussion
   - Author presents defense
   - Community asks questions
   - Council deliberates publicly

5. Council Decision (Week 8):
   - 3-member investigation team votes
   - Majority decision
   - Options: cleared, correction, retraction, ban
   - Detailed explanation published

6. Implementation (Week 9+):
   - Execute decision
   - Update paper status
   - Reputation adjustments
   - Community notification
```

**Outcomes:**

```
CLEARED:
- Fraud reports dismissed
- Confidence restored
- Author receives compensation for disruption
- Reporters receive reputation penalty if malicious

CORRECTION REQUIRED:
- Specific errors identified
- Author must publish correction within 30 days
- Confidence downgraded until corrected
- Original paper flagged with correction notice

RETRACTION:
- Paper withdrawn from provisional/verified status
- Reason published transparently
- Author reputation penalty (-500 rep)
- Citations updated with retraction notice

BAN (severe fraud):
- Author banned from protocol (1 year to permanent)
- All papers retracted
- Reputation reset to zero
- Community alert issued
```

### Legal Protections for Reporters

**Problem:** Francesca Gino's $25M lawsuit, PubPeer defamation suits create chilling effects.

**Solutions:**

```
1. Legal Defense Fund:
   - 5% of protocol revenue allocated
   - Covers legal costs for good-faith reporters
   - Managed by independent trustees

2. Safe Harbor Provisions:
   - Factual observations protected
   - No accusations required, just evidence
   - Good-faith mistakes not penalized
   - Malicious false reports penalized

3. Guidelines for Reporters:
   - "State facts, not conclusions"
   - "Figure 2B appears duplicated from prior paper" ✅
   - "Author is a fraud" ❌
   - Provide evidence (links, screenshots, analysis)

4. Legal Entity Structure:
   - Protocol operated by nonprofit
   - Reporters indemnified by organization
   - Partnership with EFF, similar groups

5. Insurance Pool:
   - Community-funded legal insurance
   - Covers legitimate fraud detection costs
   - Reduces personal liability risk
```

### Retraction vs. Correction

**Retraction:** Paper fundamentally flawed, unreliable

```
Triggers:
- Major fabrication or falsification
- Fatal methodological flaws
- Irreproducible key findings
- Ethical violations (plagiarism, authorship issues)

Process:
- Retracted papers remain accessible with prominent warning
- Retraction notice permanently displayed
- Citations updated automatically
- DOI redirects to retraction notice
```

**Correction:** Minor errors, paper still valid

```
Triggers:
- Statistical errors not affecting conclusions
- Unclear wording requiring clarification
- Missing acknowledgments
- Data transcription errors

Process:
- Correction published as linked event
- Original paper flagged with correction link
- Confidence maintained or slightly downgraded
- Author reputation unaffected (honest mistakes)
```

---

## Economic Sustainability

### Revenue Streams

**1. Institutional Subscriptions**

```
Model:
- Universities pay $10,000-20,000/year
- Get priority support, enhanced features
- Redirect savings from journal subscriptions ($millions/year)

Benefits:
- Branded portal for institution
- Bulk DOI minting
- Enhanced analytics dashboard
- Priority replication queue for faculty papers
- Institutional repository integration

Example:
- MIT currently pays $3M/year for journal access
- Redirecting $20K to ScholarChains = 0.67% of budget
- Entire institution gets unlimited access
- Faculty publish freely, readers access freely
```

**2. Lightning Micropayments (V4V)**

```
Model:
- Readers tip papers after reading ($0.10-1.00)
- Frictionless Lightning Network payments
- 100% goes to authors (protocol takes 0%)
- Voluntary, no paywall

Example:
- Paper gets 1,000 reads
- 10% of readers tip $0.50 average
- Author receives: 100 × $0.50 = $50
- High-quality papers with 10,000+ reads = $500-1000
```

**3. Review Bounties**

```
Model:
- Authors optionally attach bounty ($50-200/review)
- Protocol treasury matches via quadratic funding
- Total payment: bounty + match + base ($100-900)

Example:
- Author attaches $100/review
- Community shows interest (50 people back replication)
- Quadratic match: √50 × $10 = $70
- Reviewer quality multiplier: 3x
- Total payment: ($100 + $70 + $100) × 3 = $810
```

**4. Quadratic Funding Rounds**

```
Model:
- Community treasury allocates funds quarterly
- Projects propose replication efforts, tools, infrastructure
- Community backs proposals (small amounts: $1-20)
- Quadratic matching favors broad support over whale backing

Example:
- Replication project receives:
  - 100 backers × $5 average = $500 raised
  - Quadratic match: √100 × $50 = $500
  - Total: $1,000 replication funding

- Whale project receives:
  - 5 backers × $100 average = $500 raised
  - Quadratic match: √5 × $50 = $112
  - Total: $612 (less despite same raised amount)

Favors broad community support over concentrated wealth.
```

**5. Replication Bounties**

```
Model:
- High-impact papers receive replication funding
- Funded by: treasury, institutions, crowdfunding, grants
- Typical range: $5,000-50,000 per replication

Example:
- Controversial vaccine study gets:
  - $10K from treasury allocation
  - $15K from institutional subscriptions (earmarked)
  - $8K from community crowdfunding
  - $20K from NIH grant (public interest)
  - Total: $53K → funds 2 independent replications
```

**6. Paper NFTs (Optional, Non-speculative)**

```
Model:
- High-value papers tokenized as collectibles
- Historical significance, not speculation
- Proceeds fund protocol development

Example:
- "First quantum computing breakthrough on ScholarChains"
- NFT represents historical moment
- Collector pays $1,000 for piece of history
- Author receives $800, protocol receives $200
- No ongoing royalties, not tradeable (anti-speculation)
```

### Budget Allocation

**Annual Budget Example: $500,000**

```
Revenue Sources:
- Institutional subscriptions: 50 × $10,000 = $500,000/year

Allocation:
- Reviewer payments (60%): $300,000
  → 2,000 reviews × $150 average
- Replication bounties (25%): $125,000
  → 10-15 high-impact replications
- Infrastructure (10%): $50,000
  → Nostr relays, Blossom servers, development
- Legal defense fund (5%): $25,000
  → Protect fraud reporters, cover legal costs
```

**Sustainability without speculation:**
- No token speculation required
- Revenue from actual value provided (access, review, replication)
- Aligned with mission (advance science, not enrich investors)
- Scales with adoption (more institutions = more funding)

### Token Economics (Governance, Not Speculation)

```
Token Purpose: Governance only, not investment

Distribution:
- 40% to protocol treasury (time-locked, multi-year)
- 30% to early contributors (researchers, reviewers, vested)
- 20% to institutional partners (vested, non-transferable)
- 10% to public sale (capped, anti-speculation)

Voting Power:
- NOT proportional to tokens (prevents plutocracy)
- Sublinear scaling: √tokens
- Combined with reputation requirement
- Example: 100 tokens = 10 voting power
           10,000 tokens = 100 voting power (not 100×)

Properties:
- Tradeable (enables liquidity)
- But voting power doesn't scale linearly (prevents whales)
- Reputation required for major decisions (prevents non-expert control)
- Governance participation weighted by expertise (domain-specific voting)

Evidence:
- VitaDAO failure: Token-weighted allowed non-experts to override
- Solution: Hybrid governance (tokens + reputation + expertise)
```

---

## Governance Structure

### Dual-Chamber System

**Expert Council (Domain Expertise)**

```
Composition:
- Top 10% reputation in protocol
- Elected by community (quadratic voting)
- Term: 2 years, staggered (half elected each year)
- Size: 21 members (odd number for tie-breaking)

Responsibilities:
- Technical standards (statistical methods, review criteria)
- Fraud investigations (evidence review, decisions)
- Protocol development (NIPs, technical specifications)
- Dispute resolution (major conflicts between users)

Powers:
- Block malicious proposals (2/3 majority required)
- Emergency actions (pause accounts, emergency upgrades)
- Technical vetoes (prevent harmful protocol changes)

Elections:
- Annual voting (all users with 100+ reputation eligible)
- Quadratic voting (prevents whale control)
- Expertise-weighted by domain (elect experts in your field)
```

**Community Assembly (Broad Participation)**

```
Composition:
- All participants (anyone with 10+ reputation)
- Voting power: √(reputation × tokens)
- No term limits (continuous participation)

Responsibilities:
- Treasury allocation (budget, funding priorities)
- Economic parameters (fees, bounties, payments)
- Community standards (codes of conduct, guidelines)
- Strategic direction (long-term goals, partnerships)

Powers:
- Propose changes (10+ reputation required)
- Vote on proposals (participatory democracy)
- Allocate quadratic funding (quarterly rounds)
- Override Council (supermajority: 66%)

Voting:
- Continuous (proposals submitted anytime)
- Quadratic voting (√voting power)
- Minimum participation thresholds (20% of active users)
- Escalating quorums (if threshold not met, lower requirement)
```

### Decision-Making Process

**Minor decisions (routine operations):**

```
Examples:
- Adjust review bounty amounts
- Add new subject classifications
- Update UI/UX features

Process:
1. Proposal submitted (10+ reputation)
2. Community discussion (7 days)
3. Vote (simple majority, 5% quorum)
4. Implementation (if approved)

Speed: 1-2 weeks
```

**Major decisions (protocol changes):**

```
Examples:
- Change reputation calculation algorithm
- Modify governance structure
- Add new NIPs (protocol standards)

Process:
1. Proposal submitted (100+ reputation)
2. Expert Council technical review (14 days)
3. Community discussion (30 days)
4. Dual approval required:
   - Expert Council: 2/3 majority
   - Community Assembly: 60% approval, 20% quorum
5. Implementation (if both approve)

Speed: 6-8 weeks
```

**Emergency actions (security, fraud):**

```
Examples:
- Pause malicious accounts
- Emergency security patches
- Freeze suspicious funds

Process:
1. Expert Council emergency session (24 hours)
2. 75% supermajority required
3. Immediate implementation
4. Community ratification (within 7 days)
5. Reversed if community rejects (66% supermajority)

Speed: 24-48 hours
```

### Fork-Friendly Architecture

**Problem:** Single governance creates capture risk; disagreements become zero-sum.

**Solution:** Nostr relay model enables coexistence.

```
How forks work:
1. Disagreement on protocol direction
2. Community splits into Faction A and Faction B
3. Both operate separate Nostr relays with different policies
4. Researchers cross-post to both (interoperability maintained)
5. Best practices emerge through experimentation
6. Rough consensus, not forced unanimity

Example:
- Faction A: Strict statistical thresholds
- Faction B: Lenient thresholds, more post-publication review
- Papers published to both relays
- Researchers choose which standards to follow
- Over time, one approach may prove superior → adoption increases
- No contentious hard fork, no community destruction

Evidence:
- Nostr: Relay diversity enables censorship resistance
- Bitcoin: Fork resilience preserves communities
- Linux: Distributions coexist, share improvements
```

---

## Example Scenarios

### Scenario 1: Early-Career Researcher Publishing First Paper

**Context:** Alice is a grad student (MIT) with a breakthrough in quantum cryptography. Traditional journals take 6-18 months; she needs publication for her thesis defense in 6 months.

**Using ScholarChains:**

**Week 1: Publication**
```
Monday:
- Alice uploads PDF to ScholarChains
- Automated checks run:
  ✅ GRIM test: Passed
  ✅ SPRITE test: Passed
  ✅ Image analysis: Passed
  ✅ Cross-paper: First paper, no history
- Paper published in 45 seconds
- DOI minted: 10.xxxxx/scholarchains.12345
- Bitcoin timestamp submitted

Tuesday:
- OpenTimestamps proof confirmed (block 820,450)
- Alice shares link on Twitter, Nostr, university mailing list
- Paper appears in global feed with "quantum-computing" tag

Wednesday:
- 50 views, 10 downloads
- 3 comments (mostly positive, 1 methodological question)
- Alice responds to question publicly
```

**Week 2: Review Claims**
```
NIP-90 matching system notifies 15 qualified reviewers:
- 5 claim review slots immediately
- Geographic diversity: USA (2), Japan (1), Germany (1), India (1)
- Reputation range: 150-1200 (mix of established and growing reviewers)
- Alice's bounty: $100/review
- Quadratic match: $60 (30 people backed replication)
- Total reviewer payment: $100 + $60 + $100 base = $260 × quality multiplier
```

**Week 3-4: Reviews Arrive**
```
Review 1 (Dr. Tanaka, Japan, 1200 rep):
- Verdict: Accept
- Rating: 9/10
- Confidence: 5/5 (expert in quantum cryptography)
- Feedback: "Excellent methodology, novel approach, minor clarity issues"
- Quality rating: 4.5/5 → payment: $260 × 4.5 = $1,170

Review 2 (ProfSmith423, USA, 450 rep):
- Verdict: Accept with revisions
- Rating: 7/10
- Confidence: 4/5
- Feedback: "Good work, but Section 3 needs clarification"
- Quality rating: 4/5 → payment: $260 × 4 = $1,040

Review 3 (QuantumExpert, Germany, 800 rep):
- Verdict: Accept
- Rating: 8/10
- Confidence: 5/5
- Feedback: "Strong theoretical foundation, reproducible"
- Quality rating: 4.8/5 → payment: $260 × 4.8 = $1,248

Review 4 (Dr_Patel, India, 150 rep):
- Verdict: Accept with revisions
- Rating: 7/10
- Confidence: 3/5 (early-career reviewer)
- Feedback: "Interesting results, suggest additional controls"
- Quality rating: 3.5/5 → payment: $260 × 3.5 = $910

Review 5 (QuantumPhD, USA, 600 rep):
- Verdict: Accept
- Rating: 8/10
- Confidence: 4/5
- Feedback: "Significant contribution, well-written"
- Quality rating: 4.2/5 → payment: $260 × 4.2 = $1,092
```

**Week 5: Author Response**
```
Alice responds to all reviews publicly:
- Thanks reviewers for feedback
- Addresses Section 3 clarity concerns (publishes v2)
- Explains control design to Dr_Patel
- Accepts all suggestions constructively
```

**Week 6: Provisional Acceptance**
```
System evaluates:
✅ 5 reviews received (target: 5)
✅ 5 positive verdicts (3 accept, 2 accept-with-revisions, 0 reject)
✅ Average rating: 7.8/10 (threshold: 6.5)
✅ All major concerns addressed (v2 published)
✅ No unaddressed statistical flags

Result: Provisionally Accepted
Confidence: 78/100

Status Display:
"Provisionally Accepted - Community Reviewed
- Review Status: 5 positive reviews, avg 7.8/10
- Statistical Checks: Passed
- Reproducibility: Data + code available
- Citations: 2 provisional (growing)
- Replication: 1 team registered"
```

**Outcome:**
- **Timeline:** 6 weeks vs traditional 6-18 months
- **Alice's thesis defense:** Cites paper with provisional status, shows reviews
- **Committee accepts:** Transparent review process, cryptographic timestamp
- **No prestige bias:** Evaluated on merit, not journal name
- **Financial:** Received $150 in Lightning tips from grateful readers
- **Reputation:** Earned 200 reputation points, can now review papers
- **Career:** Hired by quantum computing startup (saw paper on ScholarChains)

---

### Scenario 2: Established Professor Reviewing Papers

**Context:** Dr. Carol (tenured professor, 20 years experience) spends ~10 hours/month on peer review for traditional journals. Never paid, never credited publicly.

**Using ScholarChains:**

**Month 1: Getting Started**
```
Week 1:
- Carol creates Nostr identity
- Links ORCID: 0000-0002-xxxx-xxxx
- Adds expertise tags: "quantum-field-theory", "particle-physics"
- Imports publication history: 85 papers, 3,200 citations
- Initial reputation: 250 (imported from prior work)

Week 2:
- Receives 3 review notifications (NIP-90 matching)
- Claims 2 reviews (quantum field theory papers)
- Reputation sufficient (250 > 10 threshold)
- Review deadline: 14 days
```

**Month 1: First Reviews**
```
Review 1: "Quantum Corrections in Unified Field Theory"
- Time spent: 6 hours (thorough analysis)
- Verdict: Accept with revisions
- Rating: 7/10
- Written review: 1,800 words (comprehensive critique)
- Identified: 2 major issues, 5 minor suggestions
- Attribution: Pseudonymous ("PhysicsProf789")

Quality ratings (by editors):
- Accuracy: 5/5 (caught real issues author confirmed)
- Constructiveness: 5/5 (specific, actionable feedback)
- Thoroughness: 5/5 (all dimensions addressed)
- Timeliness: 5/5 (submitted on day 12)

Payment:
- Base: $150 (complex paper)
- Quality multiplier: 5x (perfect scores)
- Total: $750

Reputation: +50 points → 300 total

Review 2: "Particle Collisions at Extreme Energies"
- Time spent: 4 hours
- Verdict: Accept
- Rating: 8/10
- Written review: 1,200 words
- Attribution: Pseudonymous

Quality ratings:
- Accuracy: 4.5/5
- Constructiveness: 5/5
- Thoroughness: 4.5/5
- Timeliness: 5/5

Payment:
- Base: $120
- Quality multiplier: 4.7x
- Total: $564

Reputation: +45 points → 345 total
```

**Month 2-6: Building Reputation**
```
Reviews completed: 15 total
Average quality rating: 4.6/5 (consistently excellent)
Average payment: $650/review
Total earned: $9,750 (6 months)
Reputation: 850 (from 250)

Benefits noticed:
- Public recognition: 5 researchers contacted for consulting
- Financial: $1,600/month supplemental income
- Priority matching: Gets first pick of interesting papers
- Reputation: Building verifiable expertise signal
```

**Month 7: Editorial Opportunity**
```
Invited to Expert Council (top 10% reputation):
- Can rate other reviews
- Participate in fraud investigations
- Help set technical standards
- Editorial responsibilities: ~5 hours/month
- Additional compensation: $200/month

Carol accepts: "Finally getting credit for work I was doing anyway!"
```

**Year 1 Summary:**
```
Traditional System (previous year):
- Reviews: 20-25 papers
- Time: 120 hours
- Payment: $0
- Credit: None (anonymous)
- Recognition: Zero public signal

ScholarChains (first year):
- Reviews: 25 papers
- Time: 130 hours
- Payment: $16,250
- Credit: Full attribution (eventually revealed identity)
- Recognition: Expert Council member, consulting opportunities

Net benefit:
- +10 hours work (acceptable for compensation)
- +$16,250 income
- +Career advancement (reputation visible to institutions)
- +Job satisfaction (finally valued for expertise)
```

---

### Scenario 3: Fraud Detection & Investigation

**Context:** Dave is a postdoc who notices suspicious patterns in papers from "Dr. X", a prolific author. Traditional system: 2-10+ years to investigate, often ignored.

**Using ScholarChains:**

**Week 1: Initial Suspicion**
```
Dave reads Dr. X's latest paper:
- Claims: Novel drug reduces cancer risk by 85%
- Statistics: P-value exactly 0.049 in multiple studies
- Methodology: Unusual sample sizes, no data sharing

Dave thinks: "This seems too good to be true..."
```

**Week 2: Pattern Analysis**
```
Dave uses ScholarChains search:
- Finds 15 papers from Dr. X
- Automated analysis shows:
  ⚠️ P-value distribution: 73% between 0.04-0.05 (expected: 5%)
  ⚠️ Effect sizes: Implausibly consistent (SD = 0.08)
  ⚠️ GRIM test: 4 papers flagged for impossible means
  ⚠️ Image analysis: Figure reuse across 3 papers

Dave: "This warrants investigation."
```

**Week 3: Filing Fraud Report**
```
Dave submits report (Nostr event):
- Evidence: Links to 15 papers, statistical analysis, image comparisons
- Factual observations only (no accusations)
- "Dr. X's papers show systematic statistical impossibilities"
- Suggests Expert Council investigation

Dave's reputation: 150 (postdoc, building reputation)
Threshold not met: Need 5 reporters with 1000+ aggregate rep
```

**Week 4-6: Community Validation**
```
Other researchers see Dave's report:
- 4 more researchers file similar reports (aggregate rep: 850)
- Automated analysis confirms patterns
- Community discussion grows
- Media picks up story: "Suspicious patterns in cancer research"

Week 6: Threshold reached!
- 5 reporters, 1000+ aggregate reputation
- Expert Council notified automatically
```

**Week 7: Investigation Initiated**
```
Expert Council assigns 3-member team:
- Prof. Johnson (oncology expert, 2000 rep)
- Dr. Lee (statistics expert, 1500 rep)
- Prof. Martinez (research integrity, 1800 rep)

Dr. X notified:
- 30 days to provide response
- Opportunity to explain patterns
- Access to legal defense fund if needed

Public announcement:
"Investigation #042: Dr. X's papers under review for statistical anomalies"
```

**Week 8-10: Evidence Gathering**
```
Investigation team analyzes:
1. Statistical analysis: Confirms impossible p-value clustering
2. GRIM tests: 4 papers have means impossible for reported N
3. Image forensics: Figures duplicated, manipulated
4. Raw data request: Dr. X cannot provide data (claims "lost")
5. Replication attempts: Independent teams cannot replicate key findings

Dr. X response:
- Blames collaborators for statistical errors
- Claims data loss due to hard drive failure
- Refuses independent audit
- Threatens legal action
```

**Week 11: Public Hearing**
```
Live-streamed discussion:
- Dr. X presents defense: "Honest mistakes, no fraud"
- Investigation team presents evidence: "Systematic impossibilities"
- Community asks questions
- Expert testimony from statisticians
- 5,000 viewers watch live

Investigation team deliberates publicly:
- Prof. Johnson: "Preponderance of evidence suggests fabrication"
- Dr. Lee: "Statistical impossibilities cannot be chance"
- Prof. Martinez: "Pattern consistent with known fraud cases"

Vote: 3-0 for retraction + 5-year ban
```

**Week 12: Implementation**
```
Decision executed:
- All 15 papers retracted with detailed explanations
- Dr. X's reputation reset to zero
- 5-year ban from protocol
- Community alert issued
- Citations updated: "Retracted for fabrication"

Legal protection:
- Dave and other reporters protected by legal defense fund
- Dr. X threatens lawsuit, but nonprofit structure + insurance covers costs
- Reporters never personally liable (factual observations only)

Outcome for Dave:
- +500 reputation (successful fraud detection)
- +$5,000 reward from treasury (fraud bounty)
- Recognition as diligent researcher
- Consulting offers from integrity organizations
```

**Impact:**
```
Traditional System:
- Timeline: 2-10+ years to investigate (if ever)
- Detection rate: Low (most fraud unreported)
- Reporter risk: High (lawsuits, career damage)
- Resolution: Often ignored, minimal consequences

ScholarChains:
- Timeline: 12 weeks from suspicion to resolution
- Detection: Automated + community (high success rate)
- Reporter protection: Legal defense fund, safe harbor
- Resolution: Transparent, fair, enforceable

Science wins: Fraudulent research removed quickly, legitimate researchers protected.
```

---

## Implementation Roadmap for MVP

### Phase 1: Core Infrastructure (Months 1-3)

**Goal:** Minimal viable protocol for paper publication + basic review

**Deliverables:**

```
1. Nostr Integration:
   - Implement NIP-32623 (paper events)
   - Implement NIP-4597 (review events)
   - Deploy 3 Nostr relays (decentralization)
   - Event parsing, validation, storage

2. Blossom Integration:
   - Configure 2 Blossom servers (redundancy)
   - PDF upload, hashing, retrieval
   - Content-addressable storage
   - Backup to IPFS (optional)

3. OpenTimestamps:
   - Integrate OTS library
   - Automatic proof generation
   - Bitcoin calendar submission
   - Proof verification UI

4. Basic Web UI:
   - Paper submission form
   - Browse/search papers
   - View reviews
   - Download PDFs
   - Basic reputation display

5. Authentication:
   - Nostr keypair login (browser extension)
   - ORCID linking (optional)
   - Basic identity management
```

**Success Metrics:**
- 50 papers published
- 100 reviews submitted
- 200 active users
- <1 minute publication time
- Zero downtime

**Launch Partners:**
- 3 universities willing to pilot
- 10 researchers committed to publishing
- 5 reviewers committed to reviewing

---

### Phase 2: Enhanced Review System (Months 4-6)

**Goal:** NIP-90 matching, quality ratings, payments

**Deliverables:**

```
1. NIP-90 Matching:
   - ML model for topic matching
   - Reviewer pool management
   - Diversity optimization
   - Review claiming system

2. Lightning Payments:
   - Integrate Lightning Network
   - Reviewer payment automation
   - Author tip functionality
   - Treasury management (multisig)

3. Quality Rating System:
   - Editor review interface
   - Community rating mechanism
   - Payment multiplier calculation
   - Reputation updates

4. Structured Reviews:
   - Review template implementation
   - Markdown editor
   - Rating scales (1-10)
   - Verdict selection (accept/reject/revise)

5. Enhanced UI:
   - Review submission interface
   - Quality rating dashboard
   - Payment tracking
   - Lightning wallet integration
```

**Success Metrics:**
- 5-10 reviews per paper average
- <14 days review completion
- 4.0+ average review quality rating
- $150+ average reviewer payment
- 90% reviewer satisfaction

---

### Phase 3: Provisional Acceptance + Fraud Detection (Months 7-9)

**Goal:** Confidence levels, statistical checks, fraud reporting

**Deliverables:**

```
1. Automated Statistical Checks:
   - GRIM test implementation
   - SPRITE test integration
   - Image duplication detection (perceptual hashing)
   - Cross-paper pattern analysis

2. Provisional Acceptance:
   - Acceptance algorithm
   - Confidence score calculation
   - DOI activation (Crossref partnership)
   - Status badges (provisional/verified)

3. Fraud Reporting:
   - Community reporting interface
   - Weighted threshold calculation
   - Investigation workflow
   - Expert Council tools

4. Post-Publication Comments:
   - PubPeer-style commenting
   - Nostr reply threading
   - Notification system
   - Author response tracking

5. Enhanced Search:
   - Filter by confidence level
   - Statistical flag filtering
   - Review count/rating sorting
   - Replication status display
```

**Success Metrics:**
- 80% papers achieve provisional acceptance within 90 days
- <5% false positive fraud flags
- 90%+ fraud reports validated by investigation
- <30 days investigation resolution time

---

### Phase 4: Replication + Governance (Months 10-12)

**Goal:** Replication bounties, Expert Council, community governance

**Deliverables:**

```
1. Replication System:
   - Registered reports workflow
   - Bounty allocation algorithm
   - Team application process
   - Result publication + linking

2. Governance:
   - Expert Council elections (quadratic voting)
   - Community Assembly voting interface
   - Proposal submission system
   - Multi-sig treasury management

3. Reputation System:
   - Multi-factor calculation
   - 5-year half-life decay
   - Web of Trust integration
   - Tier progression

4. Advanced Fraud Detection:
   - Public hearing infrastructure (live stream)
   - Investigation team coordination
   - Decision implementation automation
   - Legal defense fund management

5. Institutional Features:
   - Branded portals for universities
   - Enhanced analytics
   - Institutional repository integration
   - Bulk DOI minting
```

**Success Metrics:**
- 3-5 high-impact replications completed
- 21-member Expert Council elected
- 20%+ community participation in governance
- 50+ institutional subscriptions

---

### Phase 5: Scale + Sustainability (Months 13-18)

**Goal:** Grow to 10,000+ papers, financial sustainability, ecosystem development

**Deliverables:**

```
1. Scaling Infrastructure:
   - 10+ Nostr relays
   - 5+ Blossom servers
   - CDN integration
   - Database optimization

2. Economic Sustainability:
   - 100+ institutional subscriptions
   - Quadratic funding rounds (quarterly)
   - Replication fund growth
   - Lightning payment volume

3. Ecosystem Development:
   - API for third-party tools
   - Mobile apps (iOS, Android)
   - Browser extensions (improved UX)
   - Integration with Zotero, Mendeley, etc.

4. Advanced Features:
   - LaTeX support (Habla.news model)
   - Interactive figures
   - Reproducible research environments
   - Citation graph visualization

5. Community Growth:
   - Regional ambassadors
   - University partnerships
   - Conference presence
   - Media outreach
```

**Success Metrics:**
- 10,000+ papers published
- 50,000+ reviews submitted
- 5,000+ active researchers
- $1M+ annual revenue (sustainable)
- 10+ high-impact replications completed annually

---

## Conclusion: Research-Backed Protocol for MVP

This enhanced review cycle synthesizes proven mechanisms from:
- **COVID-19 fast-track:** 35-day review is possible when motivated
- **ArXiv/bioRxiv:** 70% preprints before formal review, works well
- **Linux/Wikipedia:** Progressive trust building bootstraps reputation
- **Stack Overflow:** Fraud detection requires hybrid signals, not pure numerical reputation
- **GitCoin Passport:** Multi-factor identity prevents Sybil attacks
- **ResearchHub:** Tokenomics + reputation can work if anti-speculative
- **Lightning Network:** Production-ready micropayments enable V4V
- **GRIM/SPRITE:** Automated fraud detection scales, catches 36% of impossible statistics

While avoiding documented failures:
- **PubPeer:** Detection alone insufficient, must integrate with protocol
- **DAO governance:** Token-weighted voting enables non-expert capture
- **Stack Overflow:** Numerical reputation enables gaming, needs multi-factor
- **Traditional peer review:** 6-24 months too slow, prestige bias persistent

**For MVP implementation, prioritize:**

1. **Immediate publishing** (Nostr + Blossom + OTS): Months 1-3
2. **Parallel review** (NIP-90 + Lightning payments): Months 4-6
3. **Provisional acceptance** (confidence levels + fraud detection): Months 7-9
4. **Start small:** 50 papers → 500 papers → 5,000 papers (6-month milestones)
5. **Progressive decentralization:** Start with manual curation, automate gradually

**Success looks like:**
- 30-day provisional acceptance (vs 6-18 months traditional)
- 5-10 expert reviews per paper (vs 2-3 anonymous)
- Fraud detected in months (vs 2-10+ years)
- Zero prestige bias (merit-based evaluation)
- Financial sustainability ($100-900 reviewer payments)
- Censorship resistance (Nostr relay diversity)
- Global accessibility (no institutional barriers)

**This protocol advances human science by:**
- Accelerating publication 3-10x
- Distributing review opportunities equitably
- Detecting fraud 10x faster
- Maintaining rigorous standards through multi-stage verification
- Remaining fully decentralized and accessible worldwide

The research is clear: decentralized peer review is not just possible—the components already exist. The challenge is synthesis and execution. This enhanced protocol provides the blueprint for a working MVP.

---

*Built on proven mechanisms. Avoiding known failures. Advancing human science.*

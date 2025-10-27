# ScholarChains Enhanced Implementation Plan

**Based on: REVIEW_CYCLE_ENHANCED.md Analysis**
**Branch: feature/enhanced-review-cycle-implementation**
**Date: 2025-10-27**

---

## Executive Summary

The REVIEW_CYCLE_ENHANCED.md document provides a comprehensive research-backed specification for transforming ScholarChains from a basic MVP into a production-grade decentralized academic publishing platform. This plan outlines the gap analysis and phased implementation strategy.

### Current State (Basic MVP)
- ✅ Paper publishing (Kind 32623)
- ✅ Basic reviews (Kind 4597)
- ✅ OpenTimestamps integration
- ✅ Lightning zaps (NIP-57)
- ✅ Blossom file storage
- ✅ Simple UI for browsing/publishing

### Target State (Enhanced Protocol)
- 🎯 Multi-layer review architecture (5 stages)
- 🎯 Automated statistical fraud detection (GRIM, SPRITE, image analysis)
- 🎯 Hybrid reputation system (multi-factor, non-transferable)
- 🎯 NIP-90 reviewer matching with bounties
- 🎯 Provisional acceptance with confidence scores
- 🎯 Targeted replication system with funding
- 🎯 Continuous monitoring and fraud investigation
- 🎯 Dual-chamber governance (Expert Council + Community Assembly)
- 🎯 Economic sustainability (institutional subscriptions, quadratic funding)

---

## Gap Analysis

### 1. Review System Enhancements

#### Current State
```typescript
// Basic review event (Kind 4597)
{
  verdict: "accept" | "reject" | "revise" | "comment",
  rating: 1-10,
  aspects: ["methodology", "results", etc.],
  content: "markdown review text"
}
```

#### Required Enhancements
```typescript
// Enhanced review with structured ratings
{
  // Technical Assessment
  methodology_rating: 1-10,
  methodology_critique: "detailed text",
  results_validity: 1-10,
  results_critique: "detailed text",
  statistical_rigor: 1-10,
  statistical_critique: "detailed text",

  // Reproducibility
  data_available: boolean,
  code_available: boolean,
  replication_feasibility: 1-10,

  // Overall
  verdict: "accept" | "accept-with-revisions" | "major-revisions" | "reject",
  rating: 1-10,
  confidence: 1-5,  // NEW: Confidence in own expertise
  conflicts: string,  // NEW: Declared conflicts of interest
  time_spent: number,  // NEW: Hours (for payment calculation)

  // Attribution options
  attribution: "pseudonymous" | "zk-proof" | "full-disclosure",
  orcid: string | null
}
```

**Implementation Requirements:**
- Update NIP-4597 specification
- Create structured review form components
- Add validation for all fields
- Implement review quality rating system
- Add editor/community rating interface

---

### 2. Automated Statistical Fraud Detection

#### Current State
- ❌ No automated statistical checks
- ❌ No GRIM/SPRITE testing
- ❌ No image duplication detection
- ❌ No cross-paper pattern analysis

#### Required Implementation

**Backend Services:**
```python
# New backend services needed
/api/fraud-detection/grim-test
/api/fraud-detection/sprite-test
/api/fraud-detection/image-analysis
/api/fraud-detection/author-patterns
```

**GRIM Test (Granularity-Related Inconsistency of Means):**
```python
def grim_test(mean: float, n: int, items: int) -> dict:
    """
    Check if reported mean is possible given sample size.
    Returns: {"status": "PASSED" | "FLAGGED", "reason": str}
    """
    # Implementation needed
```

**SPRITE Test (Sample Parameter Reconstruction):**
```python
def sprite_test(mean: float, sd: float, n: int,
                min_val: float, max_val: float) -> dict:
    """
    Attempt to reconstruct data distribution.
    Returns: {"status": "PASSED" | "FLAGGED", "reason": str}
    """
    # Implementation needed
```

**Image Analysis:**
```python
def image_duplication_check(paper_images: List[bytes],
                            author_prior_papers: List[str]) -> dict:
    """
    Check for duplicated/manipulated images.
    Uses: Perceptual hashing, SIFT features, forensic analysis
    Returns: {"flagged": bool, "matches": List[dict]}
    """
    # Implementation needed
```

**Cross-Paper Pattern Detection:**
```python
def analyze_author_patterns(author_pubkey: str) -> dict:
    """
    Analyze all papers from author for suspicious patterns.
    Returns: {
        "p_value_distribution": dict,
        "effect_size_consistency": dict,
        "statistical_impossibilities": int,
        "status": "NORMAL" | "SUSPICIOUS"
    }
    """
    # Implementation needed
```

**Integration Points:**
- Run automatically on paper upload (pre-publication)
- Display results in paper metadata
- Non-blocking (papers publish with warnings)
- Update continuously as author publishes more papers

---

### 3. Reputation System

#### Current State
- Basic reputation (# of reviews, zaps received)
- Simple numeric score
- No decay mechanism
- No anti-gaming measures

#### Required Multi-Factor Reputation

**Calculation Algorithm:**
```python
def calculate_reputation(user_pubkey: str) -> float:
    """
    Multi-factor reputation combining:
    - Publication quality (40%)
    - Review quality (40%)
    - Community trust (15%)
    - Governance participation (10%)
    - Economic stake (5%)
    - Statistical consistency bonus/penalty
    - Time investment (anti-sybil)
    - Penalties (fraud, misconduct)

    With 5-year half-life decay on all components.
    """
    # Detailed implementation needed
```

**Reputation Tiers:**
```
Tier 0: Newcomer (0-10) - Can publish, comment
Tier 1: Contributor (10-100) - Can review, vote minor
Tier 2: Established (100-500) - Vote major governance
Tier 3: Expert (500-1000) - Editorial roles
Tier 4: Council (1000+) - Expert Council eligibility
```

**Implementation Requirements:**
- Create reputation calculation service
- Implement 5-year half-life decay (cron job)
- Add tier-based permissions system
- Create reputation history display
- Implement Web of Trust endorsements
- Add economic stake tracking (BTC/Lightning)

---

### 4. NIP-90 Reviewer Matching

#### Current State
- ❌ No automated reviewer matching
- ❌ Manual reviewer discovery only
- ❌ No bounty system
- ❌ No diversity optimization

#### Required Implementation

**Data Vending Machine Service:**
```python
def match_reviewers_to_paper(paper_event: NostrEvent) -> List[Reviewer]:
    """
    Match qualified reviewers using multi-factor optimization:
    - Topic match (ML embedding similarity)
    - Reputation threshold
    - No conflicts of interest
    - Geographic/institutional diversity
    - Availability (not overcommitted)
    - Quality history

    Returns: Top 10 matched reviewers (notifications sent)
    """
    # Implementation needed
```

**Review Bounty System:**
```python
def calculate_review_payment(review_event: NostrEvent,
                             paper_event: NostrEvent,
                             quality_ratings: dict) -> dict:
    """
    Calculate payment:
    - Base payment (length/complexity)
    - Quality multiplier (1-5x)
    - Attribution bonus (+20% for identity reveal)
    - Author bounty (if attached)
    - Quadratic funding match

    Returns: {"total": float, "breakdown": dict}
    """
    # Implementation needed
```

**Implementation Requirements:**
- Build ML model for topic matching (paper abstracts ↔ reviewer history)
- Create reviewer pool management
- Implement review claiming system
- Add slashable stake mechanism (prevent no-shows)
- Integrate Lightning payments for bounties
- Create quadratic funding treasury

---

### 5. Provisional Acceptance System

#### Current State
- ❌ No acceptance criteria
- ❌ No confidence scores
- ❌ No provisional status
- ❌ No DOI minting

#### Required Implementation

**Acceptance Algorithm:**
```python
def evaluate_provisional_acceptance(paper_event: NostrEvent,
                                   reviews: List[NostrEvent]) -> dict:
    """
    Determine if paper meets provisional acceptance criteria:
    - 3+ positive reviews
    - Average rating ≥ 6.5/10
    - No unaddressed major statistical flags
    - Author responses to concerns

    Returns: {
        "accepted": bool,
        "confidence": 0-100,
        "review_summary": dict,
        "next_steps": str
    }
    """
    # Implementation needed
```

**Confidence Score:**
```python
def calculate_confidence_score(paper_event: NostrEvent,
                               reviews: List[NostrEvent]) -> int:
    """
    Calculate explicit confidence level (0-100):
    - Base: 50 (provisional)
    - +20 for more reviews (up to 10)
    - +/-25 for rating quality
    - +10 for reviewer credibility
    - +10 for passing statistical checks
    - +5 for data/code availability

    Returns: 0-100 score
    """
    # Implementation needed
```

**DOI Integration:**
- Partner with Crossref for DOI minting
- Provisional DOI on acceptance
- Permanent DOI on verification
- Update citations automatically

**Implementation Requirements:**
- Create acceptance evaluation service
- Build confidence calculation algorithm
- Integrate Crossref API for DOI minting
- Add status badges to UI (provisional/verified)
- Implement notification system for authors

---

### 6. Replication System

#### Current State
- ❌ No replication workflow
- ❌ No bounty allocation
- ❌ No registered reports
- ❌ No replication result linking

#### Required Implementation

**Prioritization Algorithm:**
```python
def prioritize_replication_queue(papers: List[NostrEvent]) -> List[dict]:
    """
    Determine which papers should receive replication funding:
    - Citation impact (0-40 points)
    - Community backing (0-30 points)
    - Strategic importance (0-20 points)
    - Time since publication (0-10 points)
    - Replication feasibility (-10 to +10 points)

    Allocate budget top-down until depleted.
    Returns: List of papers with funding allocated
    """
    # Implementation needed
```

**Registered Reports:**
- Create NIP for replication events (Kind 4598)
- Preregistration workflow (methods locked before data collection)
- Team application and review process
- Progress tracking and updates
- Result publication and linking

**Implementation Requirements:**
- Create replication event specification (Kind 4598)
- Build registered reports workflow
- Implement bounty allocation system
- Create team application interface
- Add replication status to paper display
- Build result linking and status updates

---

### 7. Fraud Investigation Process

#### Current State
- ❌ No formal investigation process
- ❌ No Expert Council
- ❌ No weighted reporting thresholds
- ❌ No legal protections

#### Required Implementation

**Fraud Reporting:**
```python
def process_fraud_report(report_event: NostrEvent,
                        reported_paper: NostrEvent) -> dict:
    """
    Handle community fraud report with weighted thresholds:
    - Threshold 1: 5+ reporters, 1000+ aggregate reputation
    - Threshold 2: Single reporter with 5000+ reputation
    - Threshold 3: 3+ reporters with 500+ reputation each

    Returns: {
        "action": "TRIGGER_INVESTIGATION" | "LOG_REPORT",
        "status": str
    }
    """
    # Implementation needed
```

**Investigation Workflow:**
```python
def conduct_investigation(paper_event: NostrEvent,
                         reports: List[NostrEvent]) -> dict:
    """
    Formal investigation by Expert Council:
    1. Notify author (30 days to respond)
    2. Assemble investigation team (3 council members)
    3. Review evidence
    4. Public hearing (if major case)
    5. Council decision (majority vote)
    6. Implement outcome

    Returns: {
        "outcome": "CLEARED" | "CORRECTION_REQUIRED" | "RETRACTION" | "BAN",
        "explanation": str,
        "penalties": dict
    }
    """
    # Implementation needed
```

**Legal Protections:**
- Establish legal defense fund (5% of revenue)
- Create safe harbor guidelines for reporters
- Implement indemnification for good-faith reporting
- Partner with EFF or similar organizations
- Set up insurance pool

**Implementation Requirements:**
- Create fraud reporting NIP
- Build investigation workflow system
- Implement weighted threshold calculations
- Create Expert Council tools
- Add public hearing infrastructure
- Establish legal entity and defense fund

---

### 8. Governance Structure

#### Current State
- ❌ No governance system
- ❌ No voting mechanism
- ❌ No Expert Council
- ❌ No proposal system

#### Required Dual-Chamber System

**Expert Council:**
```
- Composition: Top 10% reputation
- Size: 21 members
- Term: 2 years, staggered
- Elected by: Quadratic voting
- Responsibilities: Technical standards, fraud investigations, protocol development
- Powers: Block malicious proposals, emergency actions
```

**Community Assembly:**
```
- Composition: All users with 10+ reputation
- Voting power: √(reputation × tokens)
- Responsibilities: Treasury, economics, community standards, strategy
- Powers: Propose changes, vote, allocate funding, override Council (66%)
```

**Implementation Requirements:**
- Create governance NIPs (proposals, votes)
- Build quadratic voting system
- Implement Expert Council elections
- Create proposal submission interface
- Add voting dashboards
- Implement multi-sig treasury

---

### 9. Economic Sustainability

#### Current State
- Basic Lightning zaps to papers
- No institutional subscriptions
- No review payments
- No quadratic funding
- No replication bounties

#### Required Revenue Streams

**1. Institutional Subscriptions:**
```
Model: $10,000-20,000/year per university
Benefits:
- Branded portal
- Bulk DOI minting
- Enhanced analytics
- Priority replication queue
- Repository integration
```

**2. Review Bounties:**
```
Model: Author attaches $50-200/review
Protocol matches via quadratic funding
Total payment: $100-900 per review
```

**3. Quadratic Funding:**
```
Model: Quarterly rounds
Community backs proposals with small amounts
Treasury matches quadratically (favors broad support)
```

**4. Replication Bounties:**
```
Model: $5,000-50,000 per replication
Sources: Treasury, institutions, crowdfunding, grants
```

**Implementation Requirements:**
- Create subscription management system
- Build institutional portal features
- Implement review payment automation
- Create quadratic funding mechanism
- Build replication bounty allocation
- Set up multi-sig treasury management

---

### 10. Token Economics (Non-Speculative)

#### Current State
- ❌ No governance token
- ❌ No voting power mechanism

#### Required Token System

**Properties:**
```
- Purpose: Governance only, not investment
- Voting power: √tokens (sublinear scaling)
- Combined with reputation requirement
- Tradeable but not speculative
- Anti-whale protection
```

**Distribution:**
```
- 40% Protocol treasury (time-locked)
- 30% Early contributors (vested)
- 20% Institutional partners (non-transferable)
- 10% Public sale (capped)
```

**Implementation Requirements:**
- Deploy governance token contract
- Implement sublinear voting power
- Create vesting schedules
- Add reputation gating
- Build voting interface

---

## Implementation Phases

### Phase 1: Enhanced Review System (Months 1-3)
**Priority: HIGH - Immediate value**

**Deliverables:**
- [ ] Update NIP-4597 specification (structured reviews)
- [ ] Create enhanced review form component
- [ ] Add review quality rating system
- [ ] Implement editor rating interface
- [ ] Build review payment calculations
- [ ] Integrate Lightning payments for reviewers

**Success Metrics:**
- 5-10 reviews per paper
- <14 days review completion
- 4.0+ average quality rating
- $150+ average reviewer payment

**Estimated Effort:** 120-160 hours

---

### Phase 2: Automated Fraud Detection (Months 2-4)
**Priority: HIGH - Core differentiator**

**Deliverables:**
- [ ] Implement GRIM test backend service
- [ ] Implement SPRITE test backend service
- [ ] Add image duplication detection
- [ ] Create cross-paper pattern analysis
- [ ] Build fraud detection UI (flags display)
- [ ] Add pre-publication check workflow

**Success Metrics:**
- <5% false positive rate
- Detect 36%+ of statistical impossibilities
- Run checks in <10 seconds
- Display results transparently

**Estimated Effort:** 160-200 hours

---

### Phase 3: Reputation System (Months 3-5)
**Priority: HIGH - Enables all other features**

**Deliverables:**
- [ ] Implement multi-factor reputation calculation
- [ ] Add 5-year half-life decay (cron job)
- [ ] Create tier-based permissions system
- [ ] Build reputation history display
- [ ] Add Web of Trust endorsements
- [ ] Implement economic stake tracking

**Success Metrics:**
- Reputation updates hourly
- Accurate decay calculations
- Tier permissions working
- Gaming attempts detected

**Estimated Effort:** 100-140 hours

---

### Phase 4: NIP-90 Reviewer Matching (Months 4-6)
**Priority: MEDIUM - Improves UX**

**Deliverables:**
- [ ] Train ML model for topic matching
- [ ] Create reviewer pool management
- [ ] Implement review claiming system
- [ ] Add slashable stake mechanism
- [ ] Build notification system
- [ ] Create diversity optimization

**Success Metrics:**
- 80%+ topic match accuracy
- Geographic diversity maintained
- <1% no-show rate (slashing effective)
- Reviews claimed within 48 hours

**Estimated Effort:** 120-160 hours

---

### Phase 5: Provisional Acceptance (Months 5-7)
**Priority: HIGH - Essential for credibility**

**Deliverables:**
- [ ] Create acceptance evaluation algorithm
- [ ] Implement confidence score calculation
- [ ] Integrate Crossref for DOI minting
- [ ] Add status badges to UI
- [ ] Build notification system
- [ ] Create author response tracking

**Success Metrics:**
- 80%+ papers achieve provisional within 90 days
- Confidence scores correlate with quality
- DOIs minted automatically
- Clear status display

**Estimated Effort:** 80-120 hours

---

### Phase 6: Replication System (Months 6-9)
**Priority: MEDIUM - Long-term value**

**Deliverables:**
- [ ] Create replication event NIP (Kind 4598)
- [ ] Build registered reports workflow
- [ ] Implement prioritization algorithm
- [ ] Create team application system
- [ ] Add replication status display
- [ ] Build result linking

**Success Metrics:**
- 3-5 replications completed (year 1)
- Registered reports preregistered
- Results published transparently
- Status updates automatic

**Estimated Effort:** 100-140 hours

---

### Phase 7: Fraud Investigation (Months 7-10)
**Priority: MEDIUM - Risk mitigation**

**Deliverables:**
- [ ] Create fraud reporting NIP
- [ ] Build investigation workflow
- [ ] Implement weighted thresholds
- [ ] Create Expert Council tools
- [ ] Add public hearing infrastructure
- [ ] Establish legal defense fund

**Success Metrics:**
- <30 days investigation time
- 90%+ reports validated
- Transparent resolutions
- Legal protections working

**Estimated Effort:** 120-160 hours

---

### Phase 8: Governance System (Months 8-12)
**Priority: LOW - Longer-term stability**

**Deliverables:**
- [ ] Create governance NIPs
- [ ] Build quadratic voting system
- [ ] Implement Expert Council elections
- [ ] Create proposal system
- [ ] Add voting dashboards
- [ ] Set up multi-sig treasury

**Success Metrics:**
- 20%+ community participation
- 21 council members elected
- Proposals passing/failing correctly
- Treasury managed securely

**Estimated Effort:** 140-180 hours

---

### Phase 9: Economic Sustainability (Months 10-15)
**Priority: MEDIUM - Business model**

**Deliverables:**
- [ ] Create subscription management
- [ ] Build institutional portals
- [ ] Implement review payments
- [ ] Create quadratic funding
- [ ] Build replication bounties
- [ ] Set up treasury management

**Success Metrics:**
- 50+ institutional subscriptions
- $500K+ annual revenue
- Reviewer payments automated
- Quadratic funding rounds quarterly

**Estimated Effort:** 160-200 hours

---

### Phase 10: Token Economics (Months 12-18)
**Priority: LOW - Governance maturity**

**Deliverables:**
- [ ] Deploy governance token
- [ ] Implement sublinear voting
- [ ] Create vesting schedules
- [ ] Add reputation gating
- [ ] Build voting interface
- [ ] Launch token distribution

**Success Metrics:**
- Token launched successfully
- Voting power working correctly
- No whale domination
- Community participation

**Estimated Effort:** 100-140 hours

---

## Technology Stack Requirements

### New Dependencies

**Backend:**
```json
{
  "python": "3.11+",
  "dependencies": [
    "numpy",  // Statistical calculations
    "scipy",  // SPRITE test
    "scikit-learn",  // ML for matching
    "pillow",  // Image analysis
    "imagehash",  // Perceptual hashing
    "opencv-python",  // Image forensics
    "transformers",  // ML embeddings for topic matching
    "torch",  // ML models
    "celery",  // Background jobs (decay calculations)
    "redis",  // Caching, job queue
    "crossref-commons",  // DOI minting
    "web3",  // Token contracts (if needed)
  ]
}
```

**Frontend:**
```json
{
  "dependencies": [
    "@tanstack/react-query@latest",  // Already have
    "recharts",  // Charts for reputation, analytics
    "d3",  // Citation graph visualization
    "@radix-ui/react-dialog",  // Already have
    "zod",  // Already have for validation
    "react-markdown",  // Already have
  ]
}
```

### Infrastructure

**New Services:**
```
- Fraud Detection API (Python/FastAPI)
- ML Matching Service (Python/FastAPI)
- Reputation Calculator (Python/Celery)
- Quadratic Funding Service (Node.js/Express)
- DOI Minting Service (Node.js/Express)
- Token Contract (Solidity if blockchain)
```

**Databases:**
```
- PostgreSQL (main relational data)
- Redis (caching, job queue)
- Vector DB (ML embeddings for matching)
```

---

## Risk Assessment

### Technical Risks

**1. ML Model Accuracy (NIP-90 Matching)**
- Risk: Poor topic matching leads to wrong reviewers
- Mitigation: Start with simple keyword matching, iterate to ML
- Fallback: Manual review claiming always available

**2. GRIM/SPRITE False Positives**
- Risk: Flagging legitimate papers
- Mitigation: Non-blocking warnings, human review required
- Fallback: Authors can contest flags publicly

**3. Reputation Gaming**
- Risk: Sock puppets, voting rings, reputation farming
- Mitigation: Multi-factor reputation, time investment, GitCoin Passport
- Fallback: Expert Council can manually adjust

**4. Economic Sustainability**
- Risk: Insufficient institutional adoption
- Mitigation: Start small (50 institutions), prove value first
- Fallback: Lean operations, community support

### Organizational Risks

**1. Legal Liability (Fraud Reporting)**
- Risk: Defamation lawsuits against reporters
- Mitigation: Legal defense fund, safe harbor guidelines
- Fallback: Insurance, nonprofit structure

**2. Governance Capture**
- Risk: Wealthy actors dominate governance
- Mitigation: Sublinear voting power, reputation gating
- Fallback: Fork-friendly architecture (Nostr relay model)

**3. Community Fragmentation**
- Risk: Disagreements lead to splits
- Mitigation: Fork-friendly design, multiple relays coexist
- Fallback: Rough consensus, not forced unanimity

---

## Success Criteria

### Year 1 (MVP + Core Features)
- 500+ papers published
- 2,500+ reviews submitted
- 1,000+ active users
- 30-day average provisional acceptance time
- 3-5 high-impact replications completed
- 10+ institutional subscriptions
- $100K+ annual revenue

### Year 2 (Growth + Sustainability)
- 5,000+ papers published
- 25,000+ reviews submitted
- 5,000+ active users
- 50+ institutional subscriptions
- $500K+ annual revenue
- Expert Council elected and functioning
- Quadratic funding rounds successful

### Year 3 (Maturity + Scale)
- 20,000+ papers published
- 100,000+ reviews submitted
- 20,000+ active users
- 200+ institutional subscriptions
- $2M+ annual revenue
- Governance token launched
- 50+ replications completed

---

## Next Steps

### Immediate Actions (This Sprint)

1. **Review with Stakeholders**
   - Present this plan to team
   - Get feedback on priorities
   - Adjust timeline based on resources

2. **Create Technical Specifications**
   - Write detailed NIPs for new event kinds
   - Design database schemas
   - Create API specifications

3. **Prototype Core Features**
   - Build GRIM test as proof-of-concept
   - Create enhanced review form mockup
   - Prototype reputation calculation

4. **Secure Resources**
   - Estimate budget for Year 1
   - Identify institutional partners
   - Recruit developers

5. **Set Milestones**
   - Define quarterly OKRs
   - Create sprint backlogs
   - Assign ownership

### Decision Points

**Before Phase 1:**
- [ ] Confirm technical stack
- [ ] Secure initial funding
- [ ] Recruit 2-3 developers
- [ ] Partner with 3-5 pilot universities

**Before Phase 4 (NIP-90):**
- [ ] Evaluate ML approach vs simple matching
- [ ] Decide on ML model (GPT, BERT, etc.)
- [ ] Assess compute costs

**Before Phase 10 (Token):**
- [ ] Decide blockchain (if any)
- [ ] Legal review of token structure
- [ ] Regulatory compliance assessment

---

## Conclusion

The REVIEW_CYCLE_ENHANCED.md document provides a comprehensive blueprint for a research-backed, decentralized academic publishing platform. This implementation plan breaks down the vision into concrete, achievable phases over 18 months.

**Key Insights:**
1. **Phased approach is essential** - Can't build everything at once
2. **Start with high-value, low-risk features** - Enhanced reviews, fraud detection
3. **Reputation system is foundational** - Must be built early
4. **Economic sustainability is uncertain** - Need institutional buy-in
5. **Governance comes later** - Focus on product-market fit first

**Recommended Priority:**
1. Enhanced review system (immediate value)
2. Automated fraud detection (core differentiator)
3. Reputation system (enables everything else)
4. Provisional acceptance (credibility)
5. NIP-90 matching (UX improvement)
6. Everything else (longer-term)

**Total Estimated Effort:** 1,260-1,760 hours (7-10 engineer-months)

This is an ambitious but achievable roadmap to transform academic publishing through decentralization, transparency, and incentive alignment.

---

**Next:** Review this plan with the team, adjust priorities, and begin Phase 1 implementation.

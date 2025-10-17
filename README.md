# ScholarChains

**Decentralized Scholarly Publishing on Nostr with OpenTimestamps**

ScholarChains is a censorship-resistant research publishing platform that combines three proven protocols:
- **Nostr** for metadata distribution
- **Blossom** for content-addressable file storage
- **OpenTimestamps** for Bitcoin-based cryptographic timestamping

## 🌟 Features

### Core Functionality
- **Publish Research Papers**: Upload PDFs to Blossom, publish metadata to Nostr
- **Peer Review System**: Write signed, public reviews with ratings and verdicts
- **OpenTimestamps**: Every paper and review gets a cryptographic timestamp proof anchored to Bitcoin
- **Timestamp Verification**: Verify and download .ots proof files for offline validation
- **Lightning Tips**: Reward authors and reviewers with instant micro-payments
- **Reputation System**: Build credibility through quality contributions
- **Search & Discovery**: Find papers by topic, author, subject classification

### Technical Highlights
- Custom Nostr event kinds (32623 for papers, 4597 for reviews)
- NIP-B7 Blossom integration for decentralized file storage
- NIP-57 Lightning zaps for direct payments
- OpenTimestamps integration for tamper-proof timestamps (zero on-chain costs)
- Calendar server aggregation for efficient Bitcoin anchoring
- Full TypeScript type safety
- React 18 with TailwindCSS and shadcn/ui

## 📚 Documentation

See `/NIP.md` for the complete protocol specification including:
- Event kind definitions
- Tag schemas
- OpenTimestamps implementation details
- File storage with Blossom
- Security considerations and verification processes

## 🚀 Quick Start

### Option 1: Docker (Recommended)

**Production**:
```bash
# Build and run with Docker Compose
docker-compose up -d app

# Access at http://localhost
```

**Development with HMR**:
```bash
# Start development server with hot reload
docker-compose up app-dev

# Access at http://localhost:8080
```

See [Docker Guide](docs/DOCKER.md) for detailed instructions.

### Option 2: Local Development

**Development**:
```bash
npm install
npm run dev
```

**Build for Production**:
```bash
npm run build
```

**Run Tests**:
```bash
npm test
```

## 📖 Page Structure

- **Home** (`/`) - Hero, featured section, and paper feed
- **Publish** (`/publish`) - Form to publish new research papers
- **Paper Detail** (`/paper/:author/:id`) - View paper, metadata, and reviews
- **About** (`/about`) - Platform architecture and motivation
- **Review Process** (`/review-process`) - Detailed peer review documentation
- **Explore** (`/explore`) - Browse and search all papers

## 🏗️ Architecture

### Custom Nostr Events

**Kind 32623: Research Paper (Addressable)**
```json
{
  "kind": 32623,
  "tags": [
    ["d", "unique-paper-id"],
    ["title", "Paper Title"],
    ["summary", "Abstract"],
    ["published_at", "1708774162"],
    ["ots", "AE9wcGVuc...base64-encoded-opentimestamps-proof..."],
    ["h", "blob-sha256-hash"],
    ["url", "https://blossom.server/hash.pdf"],
    ["subject", "cs.CR"],
    ["license", "CC-BY-4.0"],
    ["t", "topic1"],
    ["t", "topic2"]
  ]
}
```

**Kind 4597: Peer Review (Regular)**
```json
{
  "kind": 4597,
  "content": "## Review\n\nDetailed feedback...",
  "tags": [
    ["a", "32623:author-pubkey:paper-id"],
    ["p", "author-pubkey"],
    ["ots", "BE9wcGVuc...base64-encoded-opentimestamps-proof..."],
    ["verdict", "accept"],
    ["rating", "8"],
    ["aspect", "methodology"],
    ["aspect", "novelty"]
  ]
}
```

## 🔧 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS 3, shadcn/ui components
- **Nostr**: @nostrify/nostrify, @nostrify/react
- **State**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Lightning**: NIP-57 Zaps via Nostr Wallet Connect
- **File Storage**: Blossom (NIP-B7)
- **Timestamps**: Bitcoin block hashes (via public APIs)

## 🎨 Design Features

- Immersive hero sections with animated gradients
- Responsive mobile-first design
- Dark mode support with theme toggle
- Skeleton loading states
- Empty states with relay switching
- Toast notifications for user feedback
- Progress bars for multi-step processes

## 🔐 Security

- All events cryptographically signed
- Bitcoin block-hash anchoring prevents backdating
- Blossom files are content-addressable (SHA-256)
- No private data stored on relays
- Public, transparent peer review by design

## 🌐 Decentralization

- No central servers or databases
- Works with any Nostr relay
- Files retrievable from any Blossom server
- Client-side reputation calculations
- No gatekeeping or permissions

## 📝 Protocol Benefits

### For Authors
- Permanent, censorship-resistant publication
- Provable timestamps without fees
- Direct Lightning tips from readers
- Build public reputation

### For Reviewers  
- Earn Lightning tips for quality reviews
- Public recognition and reputation
- Immutable credit for contributions
- No gatekeepers deciding who can review

### For Readers
- Free, open access to all research
- Transparent peer review process
- Verify authenticity via signatures
- Support authors with micro-payments

## 🐳 Docker Deployment

ScholarChains includes production-ready Docker support with multi-stage builds.

### Quick Start

```bash
# Production (optimized, ~25MB image)
docker-compose up -d app

# Development (with hot reload)
docker-compose up app-dev
```

### Features

- ✅ **Multi-stage builds** - Small production images (~25MB)
- ✅ **Nginx optimized** - Fast static file serving
- ✅ **Development mode** - Hot Module Replacement (HMR)
- ✅ **Health checks** - Automatic container restart
- ✅ **Security hardened** - Non-root user, minimal base image

### Documentation

See [Docker Guide](docs/DOCKER.md) for:
- Detailed setup instructions
- Environment variables
- Cloud deployment guides
- Troubleshooting tips
- Performance optimization

### Cloud Platforms

Compatible with:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean
- Fly.io
- Railway

## 🚧 Future Enhancements

Possible additions documented in `NIP.md`:
- Data availability proofs for large datasets
- Daily Merkle root anchoring on Bitcoin
- Citation graph analytics
- Integration with ORCID and scholarly identifiers
- Conference and journal organization events
- Preprint vs. final version workflows

## 📜 License

Open source (see repository for specific license)

## 🙏 Credits

Built with [MKStack](https://soapbox.pub/mkstack)

Powered by:
- [Nostr Protocol](https://github.com/nostr-protocol/nips)
- [Blossom](https://github.com/hzrd149/blossom)
- [Bitcoin](https://bitcoin.org)

---

**Join the revolution in scholarly publishing. No permissions. No gatekeepers. No censorship.**

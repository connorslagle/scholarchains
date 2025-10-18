# ScholarChains

**Decentralized Scholarly Publishing on Nostr with OpenTimestamps**

ScholarChains is a censorship-resistant research publishing platform that combines three proven protocols:
- **Nostr** for metadata distribution
- **Blossom** for content-addressable file storage
- **OpenTimestamps** for Bitcoin-based cryptographic timestamping

## 📁 Repository Structure

This repository is organized as a monorepo containing both frontend and backend:

```
scholarchains/
├── src/                           # Frontend React application
├── scholarchains-backend/         # Backend API service
│   ├── src/
│   │   ├── routes/               # API endpoints
│   │   ├── lib/                  # OpenTimestamps wrapper
│   │   └── middleware/           # CORS, rate limiting
│   ├── Dockerfile
│   └── README.md
├── docker-compose.yml            # Both services orchestration
├── Dockerfile                    # Frontend container
├── Dockerfile.dev                # Frontend dev container
└── README.md                     # This file
```

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

## ✅ OpenTimestamps Implementation

ScholarChains includes a **production-ready backend service** that provides real OpenTimestamps cryptographic timestamping.

### Architecture

The `opentimestamps` npm package is a CommonJS library incompatible with Vite's ESM bundler, so we've separated concerns:

- **Frontend** (`src/lib/opentimestamps.ts`): Client that calls backend API
- **Backend** (`scholarchains-backend/`): Node.js Express server with real OTS integration

### Backend API Endpoints

```typescript
// Create timestamp
POST /api/timestamp/create
Body: { "data": "string to timestamp", "calendars": [...] }
Response: { "proof": "base64-ots-proof", "info": { "isPending": true } }

// Verify timestamp
POST /api/timestamp/verify
Body: { "proof": "base64-ots-proof", "data": "original-string" }
Response: { "timestamp": 1234567890, "isPending": false }

// Upgrade timestamp
POST /api/timestamp/upgrade
Body: { "proof": "base64-ots-proof" }
Response: { "proof": "upgraded-proof", "upgraded": true }

// Health check
GET /api/timestamp/health
Response: { "status": "ok", "timestamp": "2025-10-18..." }
```

See [`scholarchains-backend/README.md`](scholarchains-backend/README.md) for detailed API documentation.

## 🚀 Quick Start

### Option 1: Docker (Recommended)

**Full Stack (Frontend + Backend)**:
```bash
# Start both services with hot reload
docker-compose up app-dev backend

# Frontend: http://localhost:8080
# Backend:  http://localhost:3001
```

**Production Deployment**:
```bash
# Build and run production containers
docker-compose up -d app backend

# Frontend: http://localhost (port 80)
# Backend:  http://localhost:3001
```

**Individual Services**:
```bash
# Frontend only (development)
docker-compose up app-dev

# Backend only (development)
docker-compose up backend-dev

# Frontend only (production)
docker-compose up app

# Backend only (production)
docker-compose up backend
```

See [Docker Guide](docs/DOCKER.md) for detailed instructions.

### Option 2: Local Development

**Frontend**:
```bash
# Install and run
npm install
npm run dev

# Access at http://localhost:8080
```

**Backend**:
```bash
cd scholarchains-backend

# Install and run
npm install
npm run dev

# API available at http://localhost:3001
```

**Run Tests**:
```bash
# Frontend tests
npm test

# Backend tests
cd scholarchains-backend
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

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS 3, shadcn/ui components
- **Nostr**: @nostrify/nostrify, @nostrify/react
- **State**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Lightning**: NIP-57 Zaps via Nostr Wallet Connect
- **File Storage**: Blossom (NIP-B7)
- **Timestamps**: OpenTimestamps (via backend API)

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **OpenTimestamps**: opentimestamps npm package
- **Security**: CORS, Rate Limiting (express-rate-limit)
- **Deployment**: Docker multi-stage builds

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx (production frontend)
- **Networking**: Shared Docker network for service communication

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

ScholarChains is a containerized monorepo with production-ready Docker support.

### Services

The `docker-compose.yml` orchestrates multiple services:

| Service | Purpose | Port | Image Size |
|---------|---------|------|------------|
| `app` | Production frontend (Nginx) | 80 | ~25MB |
| `app-dev` | Development frontend (Vite HMR) | 8080 | ~500MB |
| `backend` | Production backend API | 3001 | ~100MB |
| `backend-dev` | Development backend (tsx watch) | 3001 | ~200MB |

### Quick Start

```bash
# Full development stack
docker-compose up app-dev backend

# Full production stack
docker-compose up -d app backend

# Individual services
docker-compose up app-dev          # Frontend only
docker-compose up backend          # Backend only
```

### Features

- ✅ **Multi-stage builds** - Optimized production images
- ✅ **Nginx optimized** - Fast static file serving (frontend)
- ✅ **Development mode** - Hot Module Replacement for both services
- ✅ **Health checks** - Automatic container restart
- ✅ **Security hardened** - Non-root users, minimal base images
- ✅ **Network isolation** - Services communicate via Docker network
- ✅ **Volume mounts** - Live code reload in development

### Environment Variables

**Frontend** (`app-dev`):
- `VITE_API_URL`: Backend API URL (default: `http://backend:3001`)
- `VITE_HMR_HOST`: Hot reload host (default: `localhost`)

**Backend** (`backend`):
- `PORT`: API port (default: `3001`)
- `NODE_ENV`: Environment (default: `development`)
- `ALLOWED_ORIGINS`: CORS origins (comma-separated)

### Documentation

See [Docker Guide](docs/DOCKER.md) for:
- Detailed setup instructions
- Environment configuration
- Cloud deployment guides
- Troubleshooting tips
- Performance optimization

### Cloud Platforms

Both services are cloud-ready and compatible with:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Fly.io
- Railway
- Render

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

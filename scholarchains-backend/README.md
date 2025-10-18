# ScholarChains Backend

Minimal backend service providing OpenTimestamps cryptographic timestamping functionality for ScholarChains.

## Overview

This backend service provides real OpenTimestamps integration using the `opentimestamps` npm package, which requires Node.js and is incompatible with browser-based ESM bundlers like Vite.

## Features

- **Create Timestamps**: Generate OpenTimestamps proofs for arbitrary data
- **Verify Timestamps**: Verify existing OTS proofs against original data
- **Upgrade Timestamps**: Check if pending timestamps have been confirmed on Bitcoin blockchain
- **Rate Limiting**: Prevent abuse with configurable rate limits
- **CORS Support**: Configured for ScholarChains frontend integration

## API Endpoints

### POST `/api/timestamp/create`

Create a new OpenTimestamps proof.

**Request:**
```json
{
  "data": "string to timestamp",
  "calendars": ["https://alice.btc.calendar.opentimestamps.org", ...]  // optional
}
```

**Response:**
```json
{
  "proof": "base64-encoded OTS proof",
  "info": {
    "isPending": true
  }
}
```

### POST `/api/timestamp/verify`

Verify an OpenTimestamps proof.

**Request:**
```json
{
  "proof": "base64-encoded OTS proof",
  "data": "original string that was timestamped"
}
```

**Response:**
```json
{
  "timestamp": 1234567890,
  "blockHeight": 850000,
  "blockHash": "000000000000...",
  "isPending": false
}
```

Or if still pending:
```json
{
  "isPending": true
}
```

### POST `/api/timestamp/upgrade`

Upgrade a pending timestamp to check for blockchain confirmation.

**Request:**
```json
{
  "proof": "base64-encoded OTS proof"
}
```

**Response:**
```json
{
  "proof": "upgraded base64-encoded OTS proof",
  "upgraded": true
}
```

### GET `/api/timestamp/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T12:00:00.000Z"
}
```

## Installation

```bash
cd scholarchains-backend
npm install
```

## Development

```bash
# Start development server with live reload
npm run dev

# Server runs on http://localhost:3001
```

## Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## Docker

### Build and run with Docker Compose

```bash
# Production backend
docker-compose up backend

# Development backend (with live reload)
docker-compose up backend-dev
```

### Build standalone

```bash
docker build -t scholarchains-backend .
docker run -p 3001:3001 scholarchains-backend
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Server configuration
PORT=3001
NODE_ENV=development

# CORS configuration
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
```

## Rate Limits

- **Create**: 100 requests per 15 minutes per IP
- **Verify**: 200 requests per 15 minutes per IP
- **Upgrade**: 50 requests per hour per IP

## OpenTimestamps Calendar Servers

Default calendar servers (configurable per request):

- https://alice.btc.calendar.opentimestamps.org
- https://bob.btc.calendar.opentimestamps.org
- https://finney.calendar.eternitywall.com

## Architecture

```
scholarchains-backend/
├── src/
│   ├── routes/
│   │   └── timestamps.ts      # API endpoints
│   ├── lib/
│   │   └── opentimestamps.ts  # OTS library wrapper
│   ├── middleware/
│   │   ├── cors.ts            # CORS configuration
│   │   └── ratelimit.ts       # Rate limiting
│   └── server.ts              # Express server
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Integration with Frontend

The frontend (`scholarchains`) calls this backend via the `VITE_API_URL` environment variable:

```typescript
// Frontend src/lib/opentimestamps.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const response = await fetch(`${API_URL}/api/timestamp/create`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: 'my data' }),
});
```

## Testing

```bash
# Test create endpoint
curl -X POST http://localhost:3001/api/timestamp/create \
  -H "Content-Type: application/json" \
  -d '{"data":"test message"}'

# Test verify endpoint
curl -X POST http://localhost:3001/api/timestamp/verify \
  -H "Content-Type: application/json" \
  -d '{"proof":"base64_proof_here","data":"test message"}'

# Test health endpoint
curl http://localhost:3001/api/timestamp/health
```

## License

MIT

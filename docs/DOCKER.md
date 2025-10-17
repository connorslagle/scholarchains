# 🐳 Docker Guide for ScholarChains

This guide covers everything you need to know about running ScholarChains with Docker.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Production Deployment](#production-deployment)
- [Development Setup](#development-setup)
- [Environment Variables](#environment-variables)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)
- [Performance](#performance)
- [Security](#security)

---

## Quick Start

### Production (Recommended for deployment)

```bash
# Build and start production container
docker-compose up -d app

# View logs
docker-compose logs -f app

# Access application
open http://localhost
```

### Development (Recommended for local development)

```bash
# Build and start development container with HMR
docker-compose up app-dev

# Access application
open http://localhost:8080
```

---

## Prerequisites

### Required
- **Docker**: Version 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 2.0+ (included with Docker Desktop)

### Recommended
- **Docker Desktop**: For easier management (macOS/Windows)
- **8GB RAM**: Minimum for comfortable development
- **10GB disk space**: For images and build cache

### Verify Installation

```bash
docker --version
# Docker version 24.0.0 or higher

docker-compose --version
# Docker Compose version 2.20.0 or higher
```

---

## Production Deployment

### Build and Run

```bash
# Build the production image
docker-compose build app

# Start the container
docker-compose up -d app

# Check if it's running
docker-compose ps

# View logs
docker-compose logs -f app

# Stop the container
docker-compose down
```

### Using Docker CLI (without compose)

```bash
# Build the image
docker build -t scholarchains:latest .

# Run the container
docker run -d \
  --name scholarchains-prod \
  -p 80:80 \
  --restart unless-stopped \
  scholarchains:latest

# Check status
docker ps

# View logs
docker logs -f scholarchains-prod

# Stop and remove
docker stop scholarchains-prod
docker rm scholarchains-prod
```

### Custom Port

If port 80 is already in use:

```bash
# Using docker-compose (edit docker-compose.yml)
ports:
  - "3000:80"  # Access at http://localhost:3000

# Using Docker CLI
docker run -d -p 3000:80 scholarchains:latest
```

---

## Development Setup

### With Hot Module Replacement (HMR)

```bash
# Start development server
docker-compose up app-dev

# The application will be available at:
# http://localhost:8080

# Code changes in ./src will automatically reload
# No need to rebuild the container!
```

### Development Features

- ✅ **Hot Module Replacement (HMR)**: Instant updates on code changes
- ✅ **Volume Mounts**: Source code mounted for live editing
- ✅ **Source Maps**: Full debugging support
- ✅ **Fast Refresh**: React Fast Refresh enabled

### Development Workflow

1. **Start the dev container**:
   ```bash
   docker-compose up app-dev
   ```

2. **Edit code** in your favorite editor (VS Code, etc.)

3. **See changes instantly** at http://localhost:8080

4. **View logs** in the terminal where compose is running

5. **Stop with** `Ctrl+C` or `docker-compose down`

---

## Environment Variables

### Using .env File

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your settings:
   ```env
   VITE_DEFAULT_RELAY=wss://relay.ditto.pub
   VITE_BLOSSOM_SERVER=https://blossom.primal.net
   VITE_BITCOIN_API=https://blockstream.info/api
   ```

3. Docker Compose will automatically load the `.env` file

### Available Variables

See `.env.example` for all available configuration options.

**Important Variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_DEFAULT_RELAY` | Default Nostr relay | `wss://relay.ditto.pub` |
| `VITE_BLOSSOM_SERVER` | Blossom file server | `https://blossom.primal.net` |
| `VITE_BITCOIN_API` | Bitcoin block explorer | `https://blockstream.info/api` |
| `NODE_ENV` | Environment mode | `production` |

---

## Docker Commands

### Build Commands

```bash
# Build production image
docker-compose build app

# Build development image
docker-compose build app-dev

# Build without cache (clean build)
docker-compose build --no-cache app

# Build with progress output
docker-compose build --progress=plain app
```

### Run Commands

```bash
# Start production (detached)
docker-compose up -d app

# Start development (foreground with logs)
docker-compose up app-dev

# Start both services
docker-compose up -d

# Restart a service
docker-compose restart app

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Inspection Commands

```bash
# View running containers
docker-compose ps

# View logs (all services)
docker-compose logs

# View logs (specific service)
docker-compose logs -f app

# View last 100 lines
docker-compose logs --tail=100 app

# Execute command in container
docker-compose exec app sh

# Check container health
docker inspect --format='{{.State.Health.Status}}' scholarchains-prod
```

### Cleanup Commands

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove everything (containers, images, volumes)
docker-compose down -v --rmi all

# Prune unused Docker resources
docker system prune -a --volumes
```

---

## Troubleshooting

### Port Already in Use

**Error**: `Bind for 0.0.0.0:80 failed: port is already allocated`

**Solution**: Change the port in `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # Use port 3000 instead
```

### Build Fails with "Cannot find module"

**Solution**: Clean build without cache:
```bash
docker-compose build --no-cache app
```

### Container Exits Immediately

**Check logs**:
```bash
docker-compose logs app
```

**Common causes**:
- Syntax error in nginx.conf
- Missing files in dist/
- Port conflict

### Hot Reload Not Working (Development)

**Verify volume mounts**:
```bash
docker-compose config
```

**Restart with clean state**:
```bash
docker-compose down
docker-compose up app-dev
```

### "Health check failed" Error

**Check health endpoint**:
```bash
curl http://localhost/health
```

**View health status**:
```bash
docker inspect --format='{{json .State.Health}}' scholarchains-prod | jq
```

### Permission Denied Errors

**Linux users**: Add your user to docker group:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Out of Disk Space

**Check Docker disk usage**:
```bash
docker system df
```

**Clean up**:
```bash
docker system prune -a --volumes
```

---

## Architecture

### Production Architecture

```
┌─────────────────────────────────────────────┐
│ Stage 1: Builder (node:24-alpine)          │
│  - Install dependencies                     │
│  - Build React application (Vite)          │
│  - Generate static files → /app/dist       │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│ Stage 2: Production (nginx:1.27-alpine)    │
│  - Copy built files from builder            │
│  - Custom nginx.conf for SPA routing        │
│  - Serve static files                       │
│  - Health check endpoint (/health)          │
└─────────────────────────────────────────────┘
                     │
                     ▼
              Port 80 (HTTP)
```

### Development Architecture

```
┌─────────────────────────────────────────────┐
│ Development Container (node:24-alpine)      │
│  - Install dependencies                     │
│  - Volume mounts for live code              │
│  - Vite dev server with HMR                 │
│  - Hot reload on file changes               │
└─────────────────────────────────────────────┘
                     │
                     ▼
             Port 8080 (HTTP)
```

### Multi-Stage Benefits

- **Smaller images**: 25MB vs 1GB
- **Faster startup**: nginx vs node
- **Better security**: No Node.js runtime in production
- **Production-ready**: Optimized for performance

---

## Performance

### Image Sizes

| Image | Size | Notes |
|-------|------|-------|
| Production | ~25-30MB | Multi-stage with nginx |
| Development | ~1.2GB | Includes Node.js + dependencies |
| Builder (discarded) | ~1GB | Not included in final image |

### Build Times

| Scenario | Time | Cache |
|----------|------|-------|
| First build | 2-3 min | ❌ Cold |
| Cached build | 20-30 sec | ✅ Warm |
| Code-only change | 10-15 sec | ✅ Layers |

### Runtime Performance

| Metric | Production | Development |
|--------|-----------|-------------|
| Startup time | <2 seconds | ~5 seconds |
| Memory usage | ~10MB | ~150MB |
| Request latency | <10ms | ~50ms |
| CPU usage | <1% | ~5-10% |

### Optimization Tips

1. **Use BuildKit** (enabled by default in Docker 20.10+)
   ```bash
   export DOCKER_BUILDKIT=1
   ```

2. **Layer caching**: Order Dockerfile commands by change frequency

3. **Multi-stage builds**: Already implemented

4. **Gzip compression**: Enabled in nginx.conf

5. **Static asset caching**: Configured in nginx.conf

---

## Security

### Security Features

✅ **Multi-stage build** - No build tools in production
✅ **Non-root user** - nginx runs as `nginx-app` user
✅ **Minimal base image** - Alpine Linux (~5MB)
✅ **Security headers** - CSP, X-Frame-Options, etc.
✅ **Health checks** - Container auto-restart on failure
✅ **Read-only filesystem** - Immutable container

### Security Headers (nginx.conf)

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: Configured for Nostr/Blossom

### Best Practices

1. **Don't run as root**:
   ```dockerfile
   USER nginx-app  # Already configured
   ```

2. **Scan for vulnerabilities**:
   ```bash
   docker scan scholarchains:latest
   ```

3. **Keep images updated**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

4. **Use specific versions**:
   ```dockerfile
   FROM node:24-alpine  # Not 'latest'
   ```

5. **Don't expose .env**:
   ```bash
   # .env is in .dockerignore ✅
   ```

---

## Cloud Deployment

### Docker Hub

```bash
# Tag image
docker tag scholarchains:latest yourusername/scholarchains:latest

# Push to Docker Hub
docker push yourusername/scholarchains:latest

# Pull and run on server
docker pull yourusername/scholarchains:latest
docker run -d -p 80:80 yourusername/scholarchains:latest
```

### AWS ECS/Fargate

Use the `scholarchains:latest` image with ECS task definitions.

### Google Cloud Run

```bash
# Tag for GCR
docker tag scholarchains:latest gcr.io/PROJECT_ID/scholarchains:latest

# Push to GCR
docker push gcr.io/PROJECT_ID/scholarchains:latest

# Deploy to Cloud Run
gcloud run deploy scholarchains \
  --image gcr.io/PROJECT_ID/scholarchains:latest \
  --platform managed
```

### Fly.io

Create `fly.toml`:
```toml
app = "scholarchains"

[build]
  dockerfile = "Dockerfile"

[[services]]
  internal_port = 80
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

Deploy:
```bash
fly deploy
```

---

## Support

### Getting Help

- 📖 [Docker Documentation](https://docs.docker.com/)
- 💬 [GitHub Issues](https://github.com/your-repo/scholarchains/issues)
- 📧 Email: support@scholarchains.example

### Common Resources

- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Happy Dockerizing! 🐳**

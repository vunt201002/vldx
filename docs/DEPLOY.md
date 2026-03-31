# Deployment Guide

## Overview

The deployment is a two-step process:

1. **Local machine**: Build Docker images and push to Docker Hub
2. **VPS**: Pull new images and restart containers

```
Local: deploy.sh → Docker Hub
VPS:   docker compose pull → up -d
```

## Prerequisites

- Docker Desktop installed and running on local machine
- Docker installed on VPS
- Docker Hub account (for pushing/pulling images)
- `.env.prod` file in the project root (never committed to git)

## Environment Variables

Create `.env.prod` in the project root with:

```env
# Docker Hub
DOCKER_USER=your_dockerhub_username
TAG=latest

# Domain/IP (no protocol prefix)
DOMAIN=your-domain.com
PROTOCOL=http

# MongoDB (VPS container)
MONGO_USER=vlxd
MONGO_PASSWORD=your_secure_password

# Backend secrets
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 1: Build & Push (Local Machine)

Make sure Docker Desktop is running, then:

```bash
bash deploy.sh <TAG>
```

Examples:

```bash
bash deploy.sh v4.0.0     # tagged release
bash deploy.sh             # uses TAG from .env.prod (or "latest")
```

This builds 3 images and pushes them to Docker Hub:
- `<DOCKER_USER>/vlxd-backend:<TAG>`
- `<DOCKER_USER>/vlxd-frontend:<TAG>`
- `<DOCKER_USER>/vlxd-admin:<TAG>`

## Step 2: Pull & Deploy (VPS)

SSH into the VPS, then:

```bash
cd ~/vlxd

# Load environment variables
export $(grep -v '^#' .env.prod | xargs)

# Set the tag you just pushed
export TAG=v4.0.0

# Pull new images and restart
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Quick Deploy Cheatsheet

```bash
# === LOCAL ===
bash deploy.sh v4.0.0

# === VPS ===
ssh root@your-vps-ip
cd ~/vlxd
export $(grep -v '^#' .env.prod | xargs) && export TAG=v4.0.0
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Useful VPS Commands

```bash
# Check running containers
docker compose -f docker-compose.prod.yml ps

# View logs (all services)
docker compose -f docker-compose.prod.yml logs -f

# View logs for a specific service
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f backend

# Restart a single service
docker compose -f docker-compose.prod.yml restart frontend

# Stop everything
docker compose -f docker-compose.prod.yml down

# Stop and remove volumes (WARNING: deletes database)
docker compose -f docker-compose.prod.yml down -v
```

## Architecture

```
Internet
  │
  ├── :80/:443 → Nginx (reverse proxy + SSL)
  │                ├── /           → Frontend (Next.js :3000)
  │                ├── /api/*      → Backend (Express :5000)
  │                └── admin.*     → Admin (Vite :80)
  │
  └── Internal only
                   └── MongoDB (:27017)
```

## First-Time VPS Setup

1. Install Docker and Docker Compose on the VPS
2. Clone the repo: `git clone <repo-url> ~/vlxd`
3. Copy `.env.prod` to the VPS: `scp .env.prod root@<vps-ip>:~/vlxd/`
4. Start with HTTP-only nginx first (for SSL cert setup):
   ```bash
   # Use HTTP-only config initially
   cp nginx/conf.d/default-http-only.conf nginx/conf.d/default.conf
   export $(grep -v '^#' .env.prod | xargs)
   docker compose -f docker-compose.prod.yml up -d
   ```
5. Obtain SSL certificates:
   ```bash
   bash vps-init-ssl.sh
   ```
6. Switch to HTTPS nginx config and restart:
   ```bash
   # Replace with SSL config
   cp nginx/conf.d/default.conf.ssl nginx/conf.d/default.conf
   docker compose -f docker-compose.prod.yml restart nginx
   ```

## Troubleshooting

### "variable is not set" warnings on VPS
You forgot to load `.env.prod`. Run:
```bash
export $(grep -v '^#' .env.prod | xargs)
```

### Docker daemon not running (local)
Start Docker Desktop and wait for it to fully load before running `deploy.sh`.

### Frontend shows stale content
The backend syncs page JSON files on startup. Restart the backend:
```bash
docker compose -f docker-compose.prod.yml restart backend
```

### Need to rebuild only one service
You can build and push a single image:
```bash
# Local
docker build -t <DOCKER_USER>/vlxd-frontend:v4.0.0 ./frontend
docker push <DOCKER_USER>/vlxd-frontend:v4.0.0

# VPS
docker compose -f docker-compose.prod.yml pull frontend
docker compose -f docker-compose.prod.yml up -d frontend
```

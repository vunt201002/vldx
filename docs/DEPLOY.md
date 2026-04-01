# Deployment Guide

## Overview

```
Local: deploy.sh → build 3 images → push to Docker Hub
VPS:   pull images → docker compose up -d
```

## Prerequisites

- Docker Desktop running locally
- Docker + Docker Compose on VPS
- Docker Hub account (`docker login` locally)
- `.env.prod` in project root (gitignored, never committed)
- SSH access: `ssh root@160.250.187.138`
- VPS project directory: `~/vlxd`

## Environment Variables

### `.env.prod` (both local and VPS)

```env
# Docker Hub
DOCKER_USER=yourdockerhubuser
TAG=5.0.0

# Domain/IP (no protocol prefix)
DOMAIN=160.250.187.138
PROTOCOL=http

# MongoDB Atlas (used by both local and prod)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=vlxd

# Backend secrets
JWT_SECRET=your_random_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> **Important**: No Docker MongoDB container is used. Both local dev and production connect to MongoDB Atlas. The `MONGODB_URI` is passed through directly to the backend container.

### Local vs Production differences

| Setting | Local (`.env.local`) | Production (`.env.prod`) |
|---------|---------------------|--------------------------|
| `DOMAIN` | `localhost` | `160.250.187.138` (or real domain) |
| `PROTOCOL` | `http` | `http` (or `https` after SSL) |
| `MONGODB_URI` | Atlas connection string | Atlas connection string |
| `JWT_SECRET` | `local_dev_secret` | Strong random string |
| Frontend URL | `http://localhost:3000` | `http://160.250.187.138` |
| Admin URL | `http://localhost:5173` | `http://160.250.187.138/admin/` |
| API (frontend build arg) | `http://backend:5000/api` | `http://160.250.187.138/api` |

### Build-time vs Runtime env vars

| Variable | When applied | Effect of change |
|----------|-------------|------------------|
| `NEXT_PUBLIC_API_URL` | Build time (Dockerfile) | **Requires image rebuild** |
| `VITE_API_URL`, `VITE_STOREFRONT_URL`, `VITE_BASE_PATH` | Build time (Dockerfile) | **Requires image rebuild** |
| `MONGODB_URI`, `JWT_SECRET`, Cloudinary vars | Runtime (docker-compose) | Restart container only |
| `DOMAIN`, `PROTOCOL` | Runtime (docker-compose) | Restart container only |

## Deploy Steps

### Step 1: Build & Push (Local Machine)

```bash
# Update TAG in .env.prod first, then:
bash deploy.sh 5.0.0
```

This builds and pushes 3 images:
- `<DOCKER_USER>/vlxd-backend:<TAG>`
- `<DOCKER_USER>/vlxd-frontend:<TAG>` (with `NEXT_PUBLIC_API_URL` baked in)
- `<DOCKER_USER>/vlxd-admin:<TAG>` (with `VITE_*` vars baked in)

### Step 2: Copy updated files to VPS (Local Machine)

Only needed when `docker-compose.prod.yml`, `.env.prod`, or nginx configs changed:

```bash
scp docker-compose.prod.yml root@160.250.187.138:/root/vlxd/
scp .env.prod root@160.250.187.138:/root/vlxd/
scp -r nginx/ root@160.250.187.138:/root/vlxd/nginx/
```

### Step 3: Pull & Restart (VPS)

```bash
ssh root@160.250.187.138
cd ~/vlxd

# Pull new images
docker pull nguyenduy12/vlxd-backend:5.0.0
docker pull nguyenduy12/vlxd-frontend:5.0.0
docker pull nguyenduy12/vlxd-admin:5.0.0

# Restart (--env-file is required, docker compose does NOT auto-load .env.prod)
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Quick Cheatsheet

```bash
# === LOCAL ===
bash deploy.sh 5.0.0
scp docker-compose.prod.yml root@160.250.187.138:/root/vlxd/
scp .env.prod root@160.250.187.138:/root/vlxd/

# === VPS ===
ssh root@160.250.187.138
cd ~/vlxd
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Architecture

```
Internet
  │
  :80 → Nginx (reverse proxy)
         ├── /           → Frontend (Next.js :3000)
         ├── /api/*      → Backend (Express :5000)
         └── /admin/*    → Admin (Vite SPA :80)
  │
  └── MongoDB Atlas (external, cloud-hosted)
```

> **Note**: When using an IP address (no domain), admin is served at `/admin/` path, not a subdomain. The HTTP-only nginx config (`default-http-only.conf`) handles this routing. When you switch to a real domain with SSL, admin moves to `admin.yourdomain.com` subdomain.

### Nginx Config

Two nginx configs exist in `nginx/conf.d/`:

| File | When to use |
|------|-------------|
| `default-http-only.conf` | IP-based hosting, no SSL. Admin at `/admin/` path. |
| `default.conf` (SSL template) | After SSL setup. Admin at `admin.DOMAIN` subdomain. |

The active config is whichever is copied to `default.conf` on VPS. For IP-based hosting:
```bash
cp nginx/conf.d/default-http-only.conf nginx/conf.d/default.conf
```

## First-Time VPS Setup

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
```

### 2. Create project directory and copy files

From **local machine**:
```bash
ssh root@160.250.187.138 "mkdir -p ~/vlxd/nginx/conf.d"
scp docker-compose.prod.yml root@160.250.187.138:/root/vlxd/
scp .env.prod root@160.250.187.138:/root/vlxd/
scp nginx/nginx.conf root@160.250.187.138:/root/vlxd/nginx/nginx.conf
scp nginx/conf.d/default-http-only.conf root@160.250.187.138:/root/vlxd/nginx/conf.d/default-http-only.conf
```

> **Critical**: `nginx/nginx.conf` must be a **file**, not a directory. If Docker created it as a directory from a previous failed mount, remove it first: `rm -rf ~/vlxd/nginx/nginx.conf`

### 3. Set nginx config for HTTP

On **VPS**:
```bash
cd ~/vlxd
cp nginx/conf.d/default-http-only.conf nginx/conf.d/default.conf
```

### 4. Start services

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### 5. Verify

- Frontend: `http://<IP>`
- Admin: `http://<IP>/admin/`
- Backend health: `http://<IP>/api/health`

### 6. SSL Setup (optional, requires real domain)

Only after DNS is pointed to VPS:
```bash
bash vps-init-ssl.sh
```

## Useful VPS Commands

```bash
cd ~/vlxd

# Status
docker compose -f docker-compose.prod.yml --env-file .env.prod ps

# Logs (all)
docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f

# Logs (single service)
docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f backend
docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f frontend

# Restart single service
docker compose -f docker-compose.prod.yml --env-file .env.prod restart backend

# Full stop
docker compose -f docker-compose.prod.yml --env-file .env.prod down

# Full stop + remove volumes (WARNING: deletes shared-config)
docker compose -f docker-compose.prod.yml --env-file .env.prod down -v

# Rebuild and deploy only one service locally
docker build -t nguyenduy12/vlxd-frontend:5.0.0 ./frontend
docker push nguyenduy12/vlxd-frontend:5.0.0
# Then on VPS:
docker compose -f docker-compose.prod.yml --env-file .env.prod pull frontend
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d frontend
```

## Troubleshooting

### "variable is not set" warnings on VPS

Docker Compose does NOT auto-load `.env.prod`. Always use `--env-file .env.prod`:
```bash
# WRONG
docker compose -f docker-compose.prod.yml up -d

# CORRECT
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### nginx fails to start: "mount ... not a directory"

Docker created `nginx/nginx.conf` as a directory instead of a file (from a failed previous mount). Fix:
```bash
rm -rf ~/vlxd/nginx/nginx.conf
# Then re-copy from local:
scp nginx/nginx.conf root@160.250.187.138:/root/vlxd/nginx/nginx.conf
```

### Backend can't connect to MongoDB: "getaddrinfo EAI_AGAIN"

Check `MONGODB_URI` in `.env.prod`. Common issues:
- **`@` in password**: MongoDB URI uses `@` as delimiter. Passwords with `@` break parsing. Use URL-encoding (`%40`) or change the password.
- **Constructed URI override**: `docker-compose.prod.yml` must use `${MONGODB_URI}` directly, not construct it from `MONGO_USER`/`MONGO_PASSWORD`. We use Atlas, not a Docker MongoDB container.

### Frontend shows 404 on pages

The backend syncs page JSON configs to a shared volume on startup. If pages are missing:
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod restart backend
# Wait a few seconds, then check:
docker compose -f docker-compose.prod.yml --env-file .env.prod exec backend ls /data/config/pages/
```

### Windows Git Bash mangles paths in deploy.sh

`deploy.sh` includes `export MSYS_NO_PATHCONV=1` at the top. This prevents Git Bash from converting `/api` in `--build-arg` values to `C:\api`. If you see wrong API URLs in the built images, verify this line exists.

### Admin shows blank page or wrong assets

Admin build args are **compile-time**. If `VITE_BASE_PATH` or `VITE_API_URL` are wrong, you must rebuild the image — cannot fix at runtime:
```bash
# Local: rebuild and push
bash deploy.sh 5.0.1
# VPS: pull and restart
docker compose -f docker-compose.prod.yml --env-file .env.prod pull admin
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d admin
```

### 502 Bad Gateway on /api/*

Backend container may not be running or crashed:
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
docker compose -f docker-compose.prod.yml --env-file .env.prod logs backend --tail 30
```

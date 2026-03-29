# Deployment Guide

Complete guide to deploy the VLXD project from local machine to VPS using Docker Hub.

## Architecture

```
Local Machine                    Docker Hub                     VPS (EZTech)
┌─────────────┐    push         ┌──────────┐     pull          ┌─────────────┐
│ docker build├────────────────►│ Registry ├───────────────────►│ docker run  │
│ deploy.sh   │                 │          │                    │ compose up  │
└─────────────┘                 └──────────┘                    └─────────────┘
```

## Prerequisites

- Docker Desktop installed locally
- Docker Hub account (https://hub.docker.com)
- VPS with SSH access
- MongoDB Atlas account (or VPS MongoDB)

## Env Files

| File | Location | Purpose |
|------|----------|---------|
| `.env` | Root (local) | Docker Compose reads this for local Docker testing |
| `.env.prod` | Root (local) | `deploy.sh` reads this for production builds |
| `.env.prod` | VPS `~/vlxd/` | Docker Compose reads this on VPS |
| `backend/.env.local` | Backend dir | `npm run dev` (local dev without Docker) |
| `frontend/.env.local` | Frontend dir | `npm run dev` (local dev without Docker) |
| `admin/.env.local` | Admin dir | `npm run dev` (local dev without Docker) |

**Important**: Docker Compose reads `.env` by default (not `.env.local`). When testing locally with Docker, copy `.env.local` to `.env`:
```bash
cp .env.local .env
```

## Part 1: Local Docker Testing

### 1.1 Create root `.env` file

```bash
cp .env.local.example .env
```

Fill in your values. Key fields:
```env
FRONTEND_PORT=80
ADMIN_PORT=8888        # change if 8080 is in use
MONGODB_URI=mongodb://mongodb:27017/vlxd  # Docker MongoDB (empty)
# OR use Atlas to have data:
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/?appName=vlxd
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### 1.2 Build and run

```bash
docker compose up --build -d
```

### 1.3 Common build errors

#### `npm ci` fails with "Missing: typescript@5.9.3 from lock file"
The `package-lock.json` is out of sync. Fix:
```bash
cd frontend
rm -f package-lock.json
npm install
```
Then rebuild: `docker compose build --no-cache frontend`

#### `COPY --from=builder /app/public ./public` not found
The `frontend/public/` directory doesn't exist. Remove that line from `frontend/Dockerfile`.

#### ESLint errors block `next build`
Fix the specific lint errors (unescaped quotes, unused vars), or they will block the Docker build since `next build` runs ESLint.

#### Port already in use
Change `ADMIN_PORT` in `.env` to another port (e.g., 8888).
Then `docker compose down && docker compose up -d` (must down first to release old port config).

### 1.4 Test URLs

- Frontend: http://localhost
- Admin: http://localhost:8888

### 1.5 Empty database (404 on pages)

Docker MongoDB starts empty. Either:
- Point `MONGODB_URI` to MongoDB Atlas in `.env` (has your data)
- Or run seed scripts inside the container

## Part 2: Push to Docker Hub

### 2.1 Login to Docker Hub

```bash
docker login -u YOUR_USERNAME
# Enter your access token (not password if using Google login)
# Get token at: https://hub.docker.com/settings/security
```

### 2.2 Create `.env.prod` (local)

```env
DOCKER_USER=nguyenduy12
TAG=test-v1
DOMAIN=160.250.187.138
PROTOCOL=http

MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/?appName=vlxd
MONGO_USER=vlxd
MONGO_PASSWORD=strong_password_here
JWT_SECRET=random_string_here

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### 2.3 Build and push

Build all 3 images with production config and push to Docker Hub:
```bash
bash deploy.sh test-v1
```

Or with a different tag:
```bash
bash deploy.sh v1.0.0
```

This bakes the domain into the images:
- `NEXT_PUBLIC_API_URL=http://DOMAIN/api` (browser-side, baked at build time)
- `BACKEND_URL=http://backend:5000/api` (server-side proxy, baked at build time)
- `VITE_STOREFRONT_URL=http://DOMAIN` (admin preview iframe, baked at build time)

### 2.4 Manual tag and push (individual images)

If you only need to push one image:
```bash
# Tag
docker tag vlxd-backend nguyenduy12/vlxd-backend:test-v1

# Push
docker push nguyenduy12/vlxd-backend:test-v1
```

## Part 3: VPS Setup (First Time)

### 3.1 SSH into VPS

```bash
ssh root@160.250.187.138
```

### 3.2 Install Docker

```bash
curl -fsSL https://get.docker.com | sh
```

Verify: `docker --version`

### 3.3 Create project directory

```bash
mkdir -p ~/vlxd
cd ~/vlxd
```

### 3.4 Create `.env.prod` on VPS

```bash
echo -e "DOCKER_USER=nguyenduy12\nTAG=test-v1\nMONGO_USER=vlxd\nMONGO_PASSWORD=strong_password\nJWT_SECRET=random_string\nFRONTEND_URL=http://160.250.187.138\nADMIN_URL=http://160.250.187.138:8080\nMONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/?appName=vlxd\nCLOUDINARY_CLOUD_NAME=xxx\nCLOUDINARY_API_KEY=xxx\nCLOUDINARY_API_SECRET=xxx" > .env.prod
```

### 3.5 Create `docker-compose.prod.yml` on VPS

```bash
cat > docker-compose.prod.yml << 'ENDOFFILE'
services:
  mongodb:
    image: mongo:7
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: vlxd
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    command: ["mongod", "--wiredTigerCacheSizeGB", "0.25"]
    healthcheck:
      test: ["CMD", "mongosh", "-u", "${MONGO_USER}", "-p", "${MONGO_PASSWORD}", "--authenticationDatabase", "admin", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: ${DOCKER_USER}/vlxd-backend:${TAG}
    restart: unless-stopped
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
      ADMIN_URL: ${ADMIN_URL}
      FRONTEND_CONFIG_DIR: /data/config/pages
      CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME}
      CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY}
      CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET}
    volumes:
      - shared-config:/data/config/pages
    expose:
      - "5000"

  frontend:
    image: ${DOCKER_USER}/vlxd-frontend:${TAG}
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      INTERNAL_API_URL: http://backend:5000/api
    volumes:
      - shared-config:/app/config/pages
    ports:
      - "80:3000"

  admin:
    image: ${DOCKER_USER}/vlxd-admin:${TAG}
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "8080:80"

volumes:
  mongo-data:
  shared-config:
ENDOFFILE
```

### 3.6 Pull and start

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

Wait 30 seconds for backend to sync JSON files, then test:
- Frontend: http://VPS_IP
- Admin: http://VPS_IP:8080

### 3.7 Useful shortcut

Add to `~/.bashrc` on VPS:
```bash
echo 'alias dc="docker compose --env-file .env.prod -f docker-compose.prod.yml"' >> ~/.bashrc
source ~/.bashrc
```

Then use: `dc logs -f backend`, `dc ps`, `dc restart backend`

## Part 4: Deploying Updates

### 4.1 After code changes (on local machine)

```bash
# 1. Build and push with new tag
bash deploy.sh v1.0.1

# 2. SSH into VPS
ssh root@160.250.187.138

# 3. Update tag in .env.prod
cd ~/vlxd
sed -i 's/TAG=.*/TAG=v1.0.1/' .env.prod

# 4. Pull and restart
dc pull
dc up -d
```

### 4.2 Update only one service

```bash
# On local: rebuild + push only backend
docker build -t nguyenduy12/vlxd-backend:v1.0.1 ./backend
docker push nguyenduy12/vlxd-backend:v1.0.1

# On VPS: pull + restart only backend
dc pull backend
dc up -d backend
```

### 4.3 Rollback

```bash
# On VPS: change tag back to previous version
sed -i 's/TAG=.*/TAG=v1.0.0/' .env.prod
dc pull
dc up -d
```

## Part 5: Monitoring

```bash
# Container status
dc ps

# View logs (all services)
dc logs

# Follow logs in real-time
dc logs -f backend

# Last 50 lines of a service
dc logs backend --tail 50

# CPU/memory usage
docker stats

# Enter a container shell
dc exec backend sh
dc exec frontend sh
```

## Common Issues

### Frontend shows 404

**Cause**: No data in MongoDB. Backend logs show "Regenerated 0 page JSON files".

**Fix**: Point `MONGODB_URI` in VPS `.env.prod` to MongoDB Atlas (where your data lives), then restart backend:
```bash
dc restart backend
# Wait 30s for JSON sync
dc logs backend --tail 5
```

### Admin preview shows "localhost refused to connect"

**Cause**: Admin image was built with `VITE_STOREFRONT_URL=http://localhost` instead of `http://VPS_IP`.

**Fix**: Rebuild admin with correct URL on local machine:
```bash
docker build -t nguyenduy12/vlxd-admin:TAG \
  --build-arg VITE_API_URL=/api \
  --build-arg VITE_STOREFRONT_URL=http://VPS_IP \
  ./admin
docker push nguyenduy12/vlxd-admin:TAG
```
Then on VPS: `dc pull admin && dc up -d admin`

### Frontend API proxy loop (ECONNRESET)

**Cause**: `NEXT_PUBLIC_API_URL` was baked as `http://VPS_IP/api` — the Next.js rewrite proxies to itself in a loop.

**Fix**: The `frontend/Dockerfile` must set `BACKEND_URL=http://backend:5000/api` at build time (separate from `NEXT_PUBLIC_API_URL`). The `next.config.js` rewrite uses `BACKEND_URL` for server-side proxy.

### express-rate-limit "ERR_ERL_UNEXPECTED_X_FORWARDED_FOR"

**Cause**: Express doesn't trust proxy headers by default. Behind Docker/nginx, it receives `X-Forwarded-For` headers.

**Fix**: Add `app.set('trust proxy', 1)` in `backend/src/index.ts` before any middleware.

### Docker Compose ignores `.env.local`

**Cause**: Docker Compose only reads `.env` by default. The `--env-file` flag or copying to `.env` is required.

**Fix**: Either `cp .env.local .env` or use `docker compose --env-file .env.local up -d`.

### Build-time vs Runtime env vars

| Variable | Type | When baked | Can change without rebuild? |
|----------|------|------------|---------------------------|
| `VITE_*` | Build-time | `docker compose build` | No |
| `NEXT_PUBLIC_*` | Build-time | `docker compose build` | No |
| `BACKEND_URL` | Build-time | `docker compose build` | No |
| `MONGODB_URI` | Runtime | `docker compose up` | Yes (just restart) |
| `JWT_SECRET` | Runtime | `docker compose up` | Yes (just restart) |
| `CLOUDINARY_*` | Runtime | `docker compose up` | Yes (just restart) |

If you change a build-time variable, you must rebuild the image. If you change a runtime variable, just restart the container.

## Port Mapping Reference

### Local Docker
| Windows Port | Container | Service |
|-------------|-----------|---------|
| 80 | frontend:3000 | Next.js storefront |
| 8888 | admin:80 | Admin panel (nginx) |
| (internal) | backend:5000 | Express API |
| (internal) | mongodb:27017 | MongoDB |

### VPS
| VPS Port | Container | Service |
|----------|-----------|---------|
| 80 | frontend:3000 | Next.js storefront |
| 8080 | admin:80 | Admin panel (nginx) |
| (internal) | backend:5000 | Express API |
| (internal) | mongodb:27017 | MongoDB |

---
*Last updated: 2026-03-29*

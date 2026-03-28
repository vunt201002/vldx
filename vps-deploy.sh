#!/bin/bash
set -e

# Load env
if [ -f .env.prod ]; then
  export $(grep -v '^#' .env.prod | xargs)
fi

DOCKER_USER="${DOCKER_USER:?Set DOCKER_USER in .env.prod}"
TAG="${1:-latest}"

echo "==> Pulling latest images"
docker pull $DOCKER_USER/vlxd-backend:$TAG
docker pull $DOCKER_USER/vlxd-frontend:$TAG
docker pull $DOCKER_USER/vlxd-admin:$TAG

echo "==> Restarting services"
docker compose -f docker-compose.prod.yml up -d

echo "==> Deployment complete"
docker compose -f docker-compose.prod.yml ps

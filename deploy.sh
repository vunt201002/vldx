#!/bin/bash
set -e

# Load env
if [ -f .env.prod ]; then
  export $(grep -v '^#' .env.prod | xargs)
fi

DOCKER_USER="${DOCKER_USER:?Set DOCKER_USER in .env.prod}"
DOMAIN="${DOMAIN:?Set DOMAIN in .env.prod}"
TAG="${1:-latest}"

echo "==> Building images with tag: $TAG"

# Build all three images
docker build -t $DOCKER_USER/vlxd-backend:$TAG ./backend

docker build -t $DOCKER_USER/vlxd-frontend:$TAG \
  --build-arg NEXT_PUBLIC_API_URL=https://$DOMAIN/api \
  ./frontend

docker build -t $DOCKER_USER/vlxd-admin:$TAG \
  --build-arg VITE_API_URL=/api \
  --build-arg VITE_STOREFRONT_URL=https://$DOMAIN \
  ./admin

echo "==> Pushing images to Docker Hub"

docker push $DOCKER_USER/vlxd-backend:$TAG
docker push $DOCKER_USER/vlxd-frontend:$TAG
docker push $DOCKER_USER/vlxd-admin:$TAG

echo "==> Done! Images pushed:"
echo "    $DOCKER_USER/vlxd-backend:$TAG"
echo "    $DOCKER_USER/vlxd-frontend:$TAG"
echo "    $DOCKER_USER/vlxd-admin:$TAG"

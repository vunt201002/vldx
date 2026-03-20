FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Shared volume mount point for landing.json
RUN mkdir -p /data/config/pages

ENV NODE_ENV=production
ENV PORT=5000
ENV FRONTEND_CONFIG_PATH=/data/config/pages/landing.json

EXPOSE 5000
CMD ["node", "dist/index.js"]

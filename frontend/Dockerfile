FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Build-time env (overridden at runtime for API proxy)
ENV NEXT_PUBLIC_API_URL=http://backend:5000/api
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Config directory — shared volume will mount here
RUN mkdir -p /app/config/pages
COPY --from=builder /app/config ./config

EXPOSE 3000
CMD ["npm", "start"]

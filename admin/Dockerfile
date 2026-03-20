FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Build-time env — these get baked into the static bundle
ARG VITE_API_URL
ARG VITE_STOREFRONT_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_STOREFRONT_URL=${VITE_STOREFRONT_URL}

RUN npm run build

# Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

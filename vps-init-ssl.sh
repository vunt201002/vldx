#!/bin/bash
set -e

# First-time SSL setup script
# Run this ONCE on the VPS after the first deploy

if [ -f .env.prod ]; then
  export $(grep -v '^#' .env.prod | xargs)
fi

DOMAIN="${DOMAIN:?Set DOMAIN in .env.prod}"
EMAIL="${SSL_EMAIL:-admin@$DOMAIN}"

echo "==> Step 1: Start with HTTP-only config"
cp nginx/conf.d/default-http-only.conf nginx/conf.d/default.conf
docker compose -f docker-compose.prod.yml up -d

echo "==> Step 2: Obtain SSL certificate"
docker compose -f docker-compose.prod.yml run --rm certbot \
  certonly --webroot \
  -w /var/www/certbot \
  -d $DOMAIN \
  -d admin.$DOMAIN \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email

echo "==> Step 3: Switch to SSL config"
cp nginx/conf.d/default.conf nginx/conf.d/default.conf.http-backup
# Restore the SSL version
cat > nginx/conf.d/default.conf << NGINX_EOF
server {
    listen 80;
    server_name $DOMAIN admin.$DOMAIN;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://\$host\$request_uri; }
}

server {
    listen 443 ssl;
    server_name $DOMAIN;
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        client_max_body_size 10M;
    }
}

server {
    listen 443 ssl;
    server_name admin.$DOMAIN;
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    location / {
        proxy_pass http://admin:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX_EOF

echo "==> Step 4: Reload nginx with SSL"
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "==> SSL setup complete!"
echo "    https://$DOMAIN"
echo "    https://admin.$DOMAIN"

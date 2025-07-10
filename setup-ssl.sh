#!/bin/bash

# SSL Setup Script for click2leads.co.uk
# This script sets up Let's Encrypt SSL certificates

echo "=== SSL Setup for click2leads.co.uk ==="
echo

# Update system
echo "1. Updating system packages..."
sudo apt update

# Install certbot and nginx plugin
echo "2. Installing certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Create a temporary nginx config for domain verification
echo "3. Creating temporary nginx configuration..."
sudo tee /etc/nginx/sites-available/click2leads-temp > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name click2leads.co.uk www.click2leads.co.uk;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the temporary configuration
echo "4. Enabling temporary configuration..."
sudo ln -sf /etc/nginx/sites-available/click2leads-temp /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Obtain SSL certificate
echo "5. Obtaining SSL certificate..."
sudo certbot --nginx -d click2leads.co.uk -d www.click2leads.co.uk --non-interactive --agree-tos --email admin@click2leads.co.uk

# Create the final nginx configuration with SSL
echo "6. Creating final nginx configuration..."
sudo tee /etc/nginx/sites-available/click2leads > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name click2leads.co.uk www.click2leads.co.uk;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name click2leads.co.uk www.click2leads.co.uk;

    # SSL configuration - managed by Certbot
    ssl_certificate /etc/letsencrypt/live/click2leads.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/click2leads.co.uk/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "origin-when-cross-origin";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static file caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    client_max_body_size 100M;
}
EOF

# Enable the final configuration
echo "7. Enabling final configuration..."
sudo rm -f /etc/nginx/sites-enabled/click2leads-temp
sudo ln -sf /etc/nginx/sites-available/click2leads /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Set up auto-renewal
echo "8. Setting up auto-renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo
echo "=== SSL Setup Complete ==="
echo "Your site should now be accessible at https://click2leads.co.uk"
echo
echo "To verify SSL is working:"
echo "  curl -I https://click2leads.co.uk"
echo
echo "Certificate will auto-renew. To test renewal:"
echo "  sudo certbot renew --dry-run"
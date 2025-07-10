#!/bin/bash

# Quick setup script for click2leads on server 31.97.57.193
# Run this script after SSH-ing into the server

echo "🚀 Starting quick setup for click2leads..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Update system
echo -e "${GREEN}Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install dependencies
echo -e "${GREEN}Installing required packages...${NC}"
sudo apt install -y nginx git nodejs npm python3-certbot-nginx ufw

# Install global Node packages
echo -e "${GREEN}Installing PM2 and n...${NC}"
sudo npm install -g pm2 n
sudo n stable

# Setup firewall
echo -e "${GREEN}Configuring firewall...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create application directory
echo -e "${GREEN}Creating application directory...${NC}"
sudo mkdir -p /var/www/click2leads
sudo chown -R $USER:$USER /var/www/click2leads

# Clone repository
echo -e "${GREEN}Cloning repository...${NC}"
cd /var/www/click2leads
git clone https://github.com/adityapachauri0/click2leads.git .

# Create environment file placeholder
echo -e "${GREEN}Creating environment file template...${NC}"
cat > .env.production << 'EOF'
# Frontend environment variables
NEXT_PUBLIC_API_URL=https://click2leads.co.uk/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Backend environment variables
NODE_ENV=production
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://click2leads.co.uk/api/auth/google/callback
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
OPENAI_API_KEY=your_openai_api_key
EOF

echo -e "${RED}⚠️  Don't forget to update .env.production with your actual values!${NC}"

# Run deployment
echo -e "${GREEN}Running deployment script...${NC}"
sudo bash deploy.sh

# Setup SSL
echo -e "${GREEN}Setting up SSL certificate...${NC}"
sudo certbot --nginx -d click2leads.co.uk -d www.click2leads.co.uk --non-interactive --agree-tos --email admin@click2leads.co.uk

# Update nginx config with correct SSL paths
echo -e "${GREEN}Updating nginx configuration...${NC}"
sudo sed -i 's|/etc/ssl/certs/click2leads.co.uk.crt|/etc/letsencrypt/live/click2leads.co.uk/fullchain.pem|g' /etc/nginx/sites-available/click2leads
sudo sed -i 's|/etc/ssl/private/click2leads.co.uk.key|/etc/letsencrypt/live/click2leads.co.uk/privkey.pem|g' /etc/nginx/sites-available/click2leads
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}✅ Setup completed!${NC}"
echo -e "${GREEN}Next steps:${NC}"
echo "1. Update /var/www/click2leads/.env.production with your actual environment variables"
echo "2. Run 'sudo bash deploy.sh' again to apply the environment variables"
echo "3. Check status with 'pm2 status'"
echo "4. View logs with 'pm2 logs'"
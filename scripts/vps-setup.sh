#!/bin/bash

# VPS Initial Setup Script for Click2Leads
# Run this ONCE on your VPS to prepare everything

set -e

# Configuration
PROJECT_NAME="click2leads"
PROJECT_DIR="/var/www/${PROJECT_NAME}"
GITHUB_REPO="https://github.com/yourusername/click2leads.git"  # Update this
DOMAIN="click2leads.co.uk"  # Update this

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root"
   exit 1
fi

print_status "Starting Click2Leads VPS Setup..."

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install essential tools
print_status "Installing essential tools..."
apt install -y curl wget git build-essential software-properties-common ufw fail2ban

# Install Node.js 18
print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
print_status "Installing PM2..."
npm install -g pm2

# Install MongoDB 6.0
print_status "Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install Redis
print_status "Installing Redis..."
apt install -y redis-server
systemctl start redis-server
systemctl enable redis-server

# Install NGINX
print_status "Installing NGINX..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Install Certbot for SSL
print_status "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Create deploy user
print_status "Creating deploy user..."
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG sudo deploy
    print_status "Deploy user created"
else
    print_warning "Deploy user already exists"
fi

# Create project structure
print_status "Creating project directories..."
mkdir -p ${PROJECT_DIR}/{backend,frontend,logs,uploads,scripts,nginx,backups}
mkdir -p /var/log/${PROJECT_NAME}
mkdir -p /var/backups/${PROJECT_NAME}

# Set permissions
chown -R deploy:deploy ${PROJECT_DIR}
chown -R deploy:deploy /var/log/${PROJECT_NAME}
chown -R deploy:deploy /var/backups/${PROJECT_NAME}

# Clone repository (or setup for GitHub deployment)
print_status "Setting up repository..."
cd ${PROJECT_DIR}

if [ -d ".git" ]; then
    print_warning "Repository already exists, pulling latest..."
    sudo -u deploy git pull
else
    print_status "Cloning repository..."
    sudo -u deploy git clone ${GITHUB_REPO} .
fi

# Setup MongoDB database
print_status "Setting up MongoDB database..."
cat > /tmp/mongo-setup.js << 'EOF'
use admin
db.createUser({
  user: "click2leads_user",
  pwd: "CHANGE_THIS_PASSWORD",
  roles: [
    { role: "readWrite", db: "click2leads_production" },
    { role: "dbAdmin", db: "click2leads_production" }
  ]
})

use click2leads_production
db.createCollection("users")
db.createCollection("leads")
db.createCollection("sessions")
db.createCollection("field_captures")
EOF

mongosh < /tmp/mongo-setup.js
rm /tmp/mongo-setup.js

# Configure Redis
print_status "Configuring Redis..."
sed -i 's/^# requirepass.*/requirepass CHANGE_THIS_PASSWORD/' /etc/redis/redis.conf
systemctl restart redis-server

# Setup firewall
print_status "Configuring firewall..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 5003/tcp  # Backend API (remove after testing)
ufw --force enable

# Setup fail2ban for security
print_status "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/click2leads_error.log
EOF

systemctl restart fail2ban

# Create environment file template
print_status "Creating environment template..."
cat > ${PROJECT_DIR}/backend/.env.production << 'EOF'
# Click2Leads Production Environment
NODE_ENV=production
PORT=5003

# Database
MONGODB_URI=mongodb://click2leads_user:CHANGE_THIS_PASSWORD@localhost:27017/click2leads_production?authSource=admin

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_THIS_PASSWORD
REDIS_DB=2

# JWT Secrets (MUST CHANGE!)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_64_CHARS
JWT_REFRESH_SECRET=CHANGE_THIS_TO_DIFFERENT_RANDOM_64_CHARS

# Add other configuration as needed
EOF

# Setup NGINX configuration
print_status "Setting up NGINX..."
if [ -f "${PROJECT_DIR}/nginx/click2leads.conf" ]; then
    cp ${PROJECT_DIR}/nginx/click2leads.conf /etc/nginx/sites-available/
    ln -sf /etc/nginx/sites-available/click2leads.conf /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
fi

# Setup log rotation
print_status "Configuring log rotation..."
cat > /etc/logrotate.d/click2leads << 'EOF'
/var/www/click2leads/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 640 deploy deploy
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Create systemd service for PM2
print_status "Setting up PM2 startup..."
pm2 startup systemd -u deploy --hp /home/deploy
systemctl enable pm2-deploy

# Setup cron jobs
print_status "Setting up cron jobs..."
cat > /tmp/cronjobs << 'EOF'
# Backup daily at 2 AM
0 2 * * * /var/www/click2leads/scripts/backup-production.sh

# Monitor health every 5 minutes
*/5 * * * * /var/www/click2leads/scripts/monitor-health.sh

# SSL renewal check
0 0 * * * /usr/bin/certbot renew --quiet
EOF

crontab -u deploy /tmp/cronjobs
rm /tmp/cronjobs

# Create deployment script for GitHub Actions
print_status "Creating GitHub deployment script..."
mkdir -p /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

print_status "Setup completed!"
print_warning "================================"
print_warning "IMPORTANT NEXT STEPS:"
print_warning "1. Update passwords in /var/www/click2leads/backend/.env.production"
print_warning "2. Add your SSH key to /home/deploy/.ssh/authorized_keys"
print_warning "3. Get SSL certificate: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
print_warning "4. Update GitHub secrets for CI/CD"
print_warning "5. Run initial deployment"
print_warning "================================"

# Generate secure passwords
print_status "Generated secure passwords (SAVE THESE!):"
echo "MongoDB Password: $(openssl rand -base64 32)"
echo "Redis Password: $(openssl rand -base64 32)"
echo "JWT Secret: $(openssl rand -base64 64 | tr -d '\n')"
echo "JWT Refresh Secret: $(openssl rand -base64 64 | tr -d '\n')"
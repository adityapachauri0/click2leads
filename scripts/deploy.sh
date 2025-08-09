#!/bin/bash

# Click2Leads Production Deployment Script
# This script handles the complete deployment process for Click2Leads
# while maintaining isolation from other projects on the VPS

set -e  # Exit on error

# Configuration
DEPLOY_USER="deploy"
DEPLOY_HOST="your-vps-ip"
PROJECT_NAME="click2leads"
PROJECT_DIR="/var/www/${PROJECT_NAME}"
BACKUP_DIR="/var/backups/${PROJECT_NAME}"
LOG_DIR="/var/log/${PROJECT_NAME}"
NGINX_CONFIG="/etc/nginx/sites-available/${PROJECT_NAME}.conf"
PM2_CONFIG="${PROJECT_DIR}/ecosystem.config.js"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if running as root (for initial setup)
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root for initial setup"
        exit 1
    fi
}

# Create deploy user if doesn't exist
setup_deploy_user() {
    print_status "Setting up deploy user..."
    
    if ! id "$DEPLOY_USER" &>/dev/null; then
        useradd -m -s /bin/bash $DEPLOY_USER
        usermod -aG sudo $DEPLOY_USER
        print_status "Deploy user created"
    else
        print_warning "Deploy user already exists"
    fi
}

# Setup directory structure
setup_directories() {
    print_status "Creating project directories..."
    
    # Create main project directory
    mkdir -p ${PROJECT_DIR}
    mkdir -p ${PROJECT_DIR}/backend
    mkdir -p ${PROJECT_DIR}/frontend
    mkdir -p ${PROJECT_DIR}/logs
    mkdir -p ${PROJECT_DIR}/uploads
    mkdir -p ${PROJECT_DIR}/scripts
    mkdir -p ${PROJECT_DIR}/nginx
    
    # Create backup directory
    mkdir -p ${BACKUP_DIR}
    
    # Create log directory
    mkdir -p ${LOG_DIR}
    
    # Set permissions
    chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${PROJECT_DIR}
    chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${BACKUP_DIR}
    chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${LOG_DIR}
    
    print_status "Directories created successfully"
}

# Install Node.js if not present
install_nodejs() {
    print_status "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        print_status "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        apt-get install -y nodejs
        print_status "Node.js installed"
    else
        print_warning "Node.js already installed: $(node -v)"
    fi
}

# Install PM2 globally if not present
install_pm2() {
    print_status "Checking PM2 installation..."
    
    if ! command -v pm2 &> /dev/null; then
        print_status "Installing PM2..."
        npm install -g pm2
        pm2 startup systemd -u ${DEPLOY_USER} --hp /home/${DEPLOY_USER}
        print_status "PM2 installed"
    else
        print_warning "PM2 already installed"
    fi
}

# Install MongoDB if not present
install_mongodb() {
    print_status "Checking MongoDB installation..."
    
    if ! command -v mongod &> /dev/null; then
        print_status "Installing MongoDB..."
        
        # Import MongoDB public key
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
        
        # Add MongoDB repository
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        
        # Update and install
        apt-get update
        apt-get install -y mongodb-org
        
        # Start and enable MongoDB
        systemctl start mongod
        systemctl enable mongod
        
        print_status "MongoDB installed"
    else
        print_warning "MongoDB already installed"
    fi
}

# Setup MongoDB database and user
setup_mongodb() {
    print_status "Setting up MongoDB database..."
    
    # Generate random password
    DB_PASSWORD=$(openssl rand -base64 32)
    
    # Create MongoDB setup script
    cat > /tmp/mongodb_setup.js << EOF
use admin
db.createUser({
  user: "${PROJECT_NAME}_user",
  pwd: "${DB_PASSWORD}",
  roles: [
    { role: "readWrite", db: "${PROJECT_NAME}_production" },
    { role: "dbAdmin", db: "${PROJECT_NAME}_production" }
  ]
})

use ${PROJECT_NAME}_production
db.createCollection("leads")
db.createCollection("users")
db.createCollection("sessions")
EOF

    # Execute MongoDB setup
    mongosh < /tmp/mongodb_setup.js
    
    # Save credentials securely
    echo "MONGODB_URI=mongodb://${PROJECT_NAME}_user:${DB_PASSWORD}@localhost:27017/${PROJECT_NAME}_production?authSource=admin" > ${PROJECT_DIR}/.env.production
    
    # Clean up
    rm /tmp/mongodb_setup.js
    
    print_status "MongoDB database configured"
}

# Install Redis if not present
install_redis() {
    print_status "Checking Redis installation..."
    
    if ! command -v redis-server &> /dev/null; then
        print_status "Installing Redis..."
        apt-get update
        apt-get install -y redis-server
        
        # Configure Redis for Click2Leads
        sed -i 's/^# requirepass.*/requirepass click2leads_redis_password/' /etc/redis/redis.conf
        
        # Restart Redis
        systemctl restart redis-server
        systemctl enable redis-server
        
        print_status "Redis installed"
    else
        print_warning "Redis already installed"
    fi
}

# Install NGINX if not present
install_nginx() {
    print_status "Checking NGINX installation..."
    
    if ! command -v nginx &> /dev/null; then
        print_status "Installing NGINX..."
        apt-get update
        apt-get install -y nginx
        systemctl start nginx
        systemctl enable nginx
        print_status "NGINX installed"
    else
        print_warning "NGINX already installed"
    fi
}

# Setup NGINX configuration
setup_nginx() {
    print_status "Configuring NGINX for Click2Leads..."
    
    # Copy NGINX config
    cp ${PROJECT_DIR}/nginx/click2leads.conf ${NGINX_CONFIG}
    
    # Create symlink
    ln -sf ${NGINX_CONFIG} /etc/nginx/sites-enabled/
    
    # Test NGINX configuration
    nginx -t
    
    # Reload NGINX
    systemctl reload nginx
    
    print_status "NGINX configured successfully"
}

# Install Certbot and setup SSL
setup_ssl() {
    print_status "Setting up SSL certificates..."
    
    # Install Certbot if not present
    if ! command -v certbot &> /dev/null; then
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Get SSL certificate
    print_warning "Please ensure your domain is pointing to this server before continuing"
    read -p "Enter your domain (e.g., click2leads.co.uk): " DOMAIN
    read -p "Enter your email for SSL notifications: " EMAIL
    
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL
    
    # Setup auto-renewal
    (crontab -l 2>/dev/null; echo "0 0 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    print_status "SSL certificates configured"
}

# Deploy application code
deploy_application() {
    print_status "Deploying application code..."
    
    # Switch to deploy user
    su - ${DEPLOY_USER} << 'EOF'
        cd /var/www/click2leads
        
        # Pull latest code (assuming git is setup)
        # git pull origin main
        
        # Install backend dependencies
        cd backend
        npm ci --production
        
        # Install frontend dependencies and build
        cd ../frontend
        npm ci
        npm run build
        
        # Return to project root
        cd ..
EOF
    
    print_status "Application deployed"
}

# Setup PM2 processes
setup_pm2() {
    print_status "Setting up PM2 processes..."
    
    # Switch to deploy user
    su - ${DEPLOY_USER} << EOF
        cd ${PROJECT_DIR}
        
        # Stop any existing Click2Leads PM2 processes
        pm2 delete click2leads-backend 2>/dev/null || true
        pm2 delete click2leads-frontend 2>/dev/null || true
        
        # Start new processes
        pm2 start ecosystem.config.js --env production
        
        # Save PM2 configuration
        pm2 save
EOF
    
    print_status "PM2 processes started"
}

# Setup log rotation
setup_logrotate() {
    print_status "Configuring log rotation..."
    
    cat > /etc/logrotate.d/click2leads << EOF
${PROJECT_DIR}/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 640 ${DEPLOY_USER} ${DEPLOY_USER}
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}

${LOG_DIR}/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    missingok
    create 640 ${DEPLOY_USER} ${DEPLOY_USER}
}

/var/log/nginx/click2leads_*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    missingok
    create 640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 \$(cat /var/run/nginx.pid)
    endscript
}
EOF
    
    print_status "Log rotation configured"
}

# Setup firewall rules
setup_firewall() {
    print_status "Configuring firewall..."
    
    # Install ufw if not present
    if ! command -v ufw &> /dev/null; then
        apt-get install -y ufw
    fi
    
    # Configure firewall rules
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    ufw allow 5003/tcp  # Backend API (if needed externally)
    
    # Enable firewall
    ufw --force enable
    
    print_status "Firewall configured"
}

# Create backup script
create_backup_script() {
    print_status "Creating backup script..."
    
    cat > ${PROJECT_DIR}/scripts/backup.sh << 'EOF'
#!/bin/bash

# Click2Leads Backup Script
PROJECT_NAME="click2leads"
BACKUP_DIR="/var/backups/${PROJECT_NAME}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${DATE}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Backup MongoDB
mongodump --db ${PROJECT_NAME}_production --out ${BACKUP_DIR}/mongodb_${DATE}

# Backup application files
tar -czf ${BACKUP_FILE} \
    /var/www/${PROJECT_NAME}/backend \
    /var/www/${PROJECT_NAME}/frontend/build \
    /var/www/${PROJECT_NAME}/uploads \
    ${BACKUP_DIR}/mongodb_${DATE}

# Remove temporary MongoDB dump
rm -rf ${BACKUP_DIR}/mongodb_${DATE}

# Keep only last 30 backups
find ${BACKUP_DIR} -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: ${BACKUP_FILE}"
EOF

    chmod +x ${PROJECT_DIR}/scripts/backup.sh
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 2 * * * ${PROJECT_DIR}/scripts/backup.sh") | crontab -
    
    print_status "Backup script created and scheduled"
}

# Create monitoring script
create_monitoring_script() {
    print_status "Creating monitoring script..."
    
    cat > ${PROJECT_DIR}/scripts/monitor.sh << 'EOF'
#!/bin/bash

# Click2Leads Monitoring Script
PROJECT_NAME="click2leads"
ALERT_EMAIL="admin@click2leads.co.uk"

# Check if backend is running
if ! pm2 list | grep -q "click2leads-backend.*online"; then
    echo "Backend is down! Attempting restart..." | mail -s "Click2Leads Alert: Backend Down" ${ALERT_EMAIL}
    pm2 restart click2leads-backend
fi

# Check if MongoDB is running
if ! systemctl is-active --quiet mongod; then
    echo "MongoDB is down! Attempting restart..." | mail -s "Click2Leads Alert: MongoDB Down" ${ALERT_EMAIL}
    systemctl restart mongod
fi

# Check if Redis is running
if ! systemctl is-active --quiet redis-server; then
    echo "Redis is down! Attempting restart..." | mail -s "Click2Leads Alert: Redis Down" ${ALERT_EMAIL}
    systemctl restart redis-server
fi

# Check disk usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ ${DISK_USAGE} -gt 80 ]; then
    echo "Disk usage is at ${DISK_USAGE}%!" | mail -s "Click2Leads Alert: High Disk Usage" ${ALERT_EMAIL}
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
if [ ${MEM_USAGE} -gt 80 ]; then
    echo "Memory usage is at ${MEM_USAGE}%!" | mail -s "Click2Leads Alert: High Memory Usage" ${ALERT_EMAIL}
fi
EOF

    chmod +x ${PROJECT_DIR}/scripts/monitor.sh
    
    # Add to crontab (run every 5 minutes)
    (crontab -l 2>/dev/null; echo "*/5 * * * * ${PROJECT_DIR}/scripts/monitor.sh") | crontab -
    
    print_status "Monitoring script created and scheduled"
}

# Main deployment function
main() {
    print_status "Starting Click2Leads production deployment..."
    
    # Check if initial setup or update
    if [ "$1" == "setup" ]; then
        check_root
        setup_deploy_user
        setup_directories
        install_nodejs
        install_pm2
        install_mongodb
        setup_mongodb
        install_redis
        install_nginx
        setup_ssl
        setup_firewall
        setup_logrotate
        create_backup_script
        create_monitoring_script
    fi
    
    # Deploy application
    deploy_application
    setup_nginx
    setup_pm2
    
    print_status "Deployment completed successfully!"
    print_warning "Remember to:"
    echo "  1. Update environment variables in ${PROJECT_DIR}/.env.production"
    echo "  2. Test all endpoints"
    echo "  3. Monitor logs in ${LOG_DIR}"
    echo "  4. Verify backups are working"
}

# Run main function
main "$@"
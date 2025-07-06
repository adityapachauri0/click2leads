#!/bin/bash

# Deployment script for click2leads
# This script should be run on the Hostinger VPS

echo "🚀 Starting deployment for click2leads..."

# Configuration
REPO_URL="https://github.com/adityapachauri0/click2leads.git"
APP_DIR="/var/www/click2leads"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root or with sudo"
   exit 1
fi

# Create app directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
    print_status "Creating application directory..."
    mkdir -p $APP_DIR
fi

cd $APP_DIR

# Clone or pull latest code
if [ ! -d ".git" ]; then
    print_status "Cloning repository..."
    git clone $REPO_URL .
else
    print_status "Pulling latest changes..."
    git pull origin $BRANCH
fi

# Install dependencies for root package
print_status "Installing root dependencies..."
npm install

# Build and prepare frontend
print_status "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Copy environment files if they exist
if [ -f ".env.production" ]; then
    print_status "Copying production environment variables..."
    cp .env.production frontend/.env.production
    cp .env.production backend/.env
fi

# Stop existing PM2 processes
print_status "Stopping existing processes..."
pm2 stop all || print_warning "No existing PM2 processes to stop"

# Start applications with PM2
print_status "Starting applications with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u root --hp /root

# Copy nginx configuration
if [ -f "nginx.conf" ]; then
    print_status "Updating Nginx configuration..."
    cp nginx.conf /etc/nginx/sites-available/click2leads
    ln -sf /etc/nginx/sites-available/click2leads /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    nginx -t
    
    if [ $? -eq 0 ]; then
        print_status "Reloading Nginx..."
        systemctl reload nginx
    else
        print_error "Nginx configuration test failed!"
        exit 1
    fi
fi

# Set proper permissions
print_status "Setting file permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR

print_status "Deployment completed successfully! 🎉"
print_status "Your site should be available at https://click2leads.co.uk"

# Show PM2 status
echo ""
print_status "Current PM2 processes:"
pm2 status
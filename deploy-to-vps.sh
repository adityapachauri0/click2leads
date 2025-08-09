#!/bin/bash

# Local Deployment Script for Click2Leads
# Run this from your local machine to deploy to VPS

set -e

# Configuration - UPDATE THESE!
VPS_HOST="your-vps-ip"  # Replace with your VPS IP
VPS_USER="deploy"        # Or root for initial setup
VPS_PORT="22"
PROJECT_DIR="/var/www/click2leads"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }

# Check if configuration is updated
if [ "$VPS_HOST" = "your-vps-ip" ]; then
    print_error "Please update VPS_HOST in this script with your actual VPS IP"
    exit 1
fi

# Function to check SSH connection
check_ssh() {
    print_status "Checking SSH connection..."
    if ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "echo 'SSH connection successful'" > /dev/null 2>&1; then
        print_status "SSH connection established"
        return 0
    else
        print_error "Cannot connect to VPS. Please check your SSH configuration"
        exit 1
    fi
}

# Function for initial setup
initial_setup() {
    print_status "Running initial VPS setup..."
    
    # Copy setup script to VPS
    scp -P ${VPS_PORT} scripts/vps-setup.sh ${VPS_USER}@${VPS_HOST}:/tmp/
    
    # Run setup script
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "chmod +x /tmp/vps-setup.sh && sudo /tmp/vps-setup.sh"
    
    print_status "Initial setup completed!"
    print_warning "Please complete the manual steps shown above before deploying"
}

# Function to deploy application
deploy_app() {
    print_status "Starting deployment to VPS..."
    
    # Build frontend locally
    print_status "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
    
    # Create deployment package
    print_status "Creating deployment package..."
    rm -rf deploy-temp
    mkdir -p deploy-temp
    
    # Copy necessary files
    cp -r backend deploy-temp/
    cp -r frontend/build deploy-temp/frontend-build
    cp ecosystem.config.js deploy-temp/
    cp -r nginx deploy-temp/
    cp -r scripts deploy-temp/
    
    # Remove unnecessary files
    rm -rf deploy-temp/backend/node_modules
    rm -f deploy-temp/backend/.env
    rm -f deploy-temp/backend/.env.local
    
    # Create tarball
    tar -czf deploy-package.tar.gz deploy-temp/
    
    # Upload to VPS
    print_status "Uploading to VPS..."
    scp -P ${VPS_PORT} deploy-package.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/
    
    # Deploy on VPS
    print_status "Deploying on VPS..."
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
        set -e
        
        # Extract deployment package
        cd /tmp
        tar -xzf deploy-package.tar.gz
        
        # Navigate to project directory
        cd /var/www/click2leads
        
        # Backup current deployment
        if [ -d "backend" ]; then
            mkdir -p backups
            tar -czf backups/backup-$(date +%Y%m%d_%H%M%S).tar.gz backend frontend || true
        fi
        
        # Stop services
        pm2 stop click2leads-backend || true
        
        # Update backend
        rm -rf backend.old
        [ -d "backend" ] && mv backend backend.old
        mv /tmp/deploy-temp/backend ./
        cd backend
        npm ci --production
        
        # Copy production environment
        if [ -f "../.env.production" ]; then
            cp ../.env.production .env
        elif [ -f ".env.production" ]; then
            cp .env.production .env
        fi
        
        # Update frontend
        cd ..
        rm -rf frontend/build
        mv /tmp/deploy-temp/frontend-build frontend/build
        
        # Update configurations
        cp /tmp/deploy-temp/ecosystem.config.js ./
        cp /tmp/deploy-temp/nginx/click2leads.conf /etc/nginx/sites-available/ || true
        
        # Update scripts
        cp -r /tmp/deploy-temp/scripts ./
        chmod +x scripts/*.sh
        
        # Start/reload services
        pm2 start ecosystem.config.js --env production
        pm2 save
        
        # Test NGINX config and reload
        sudo nginx -t && sudo systemctl reload nginx
        
        # Clean up
        rm -rf /tmp/deploy-temp
        rm -f /tmp/deploy-package.tar.gz
        
        # Health check
        sleep 5
        curl -f http://localhost:5003/api/health || echo "Health check failed"
        
        echo "Deployment completed!"
ENDSSH
    
    # Clean up local files
    rm -rf deploy-temp
    rm -f deploy-package.tar.gz
    
    print_status "Deployment successful!"
    print_status "Your application is now running at http://${VPS_HOST}:5003"
}

# Function to setup GitHub secrets
setup_github() {
    print_status "Setting up GitHub deployment..."
    
    print_warning "Add these secrets to your GitHub repository:"
    echo "  Settings > Secrets and variables > Actions"
    echo ""
    echo "  VPS_HOST: ${VPS_HOST}"
    echo "  VPS_USER: ${VPS_USER}"
    echo "  VPS_PORT: ${VPS_PORT}"
    echo "  VPS_SSH_KEY: (your private SSH key)"
    echo ""
    print_warning "To get your SSH key for GitHub:"
    echo "  1. Generate a new key pair: ssh-keygen -t ed25519 -f ~/.ssh/click2leads_deploy"
    echo "  2. Add public key to VPS: ssh-copy-id -i ~/.ssh/click2leads_deploy.pub ${VPS_USER}@${VPS_HOST}"
    echo "  3. Copy private key: cat ~/.ssh/click2leads_deploy"
    echo "  4. Add private key to GitHub secrets as VPS_SSH_KEY"
}

# Function to check status
check_status() {
    print_status "Checking deployment status..."
    
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
        echo "=== PM2 Status ==="
        pm2 list
        
        echo -e "\n=== Service Status ==="
        systemctl is-active mongod && echo "MongoDB: Active" || echo "MongoDB: Inactive"
        systemctl is-active redis-server && echo "Redis: Active" || echo "Redis: Inactive"
        systemctl is-active nginx && echo "NGINX: Active" || echo "NGINX: Inactive"
        
        echo -e "\n=== API Health ==="
        curl -s http://localhost:5003/api/health | jq . || echo "API not responding"
        
        echo -e "\n=== Recent Logs ==="
        pm2 logs click2leads-backend --lines 5 --nostream || true
ENDSSH
}

# Function to view logs
view_logs() {
    print_status "Viewing application logs..."
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "pm2 logs click2leads-backend --lines 50"
}

# Function to restart services
restart_services() {
    print_status "Restarting services..."
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "pm2 restart click2leads-backend && pm2 save"
    print_status "Services restarted"
}

# Main menu
show_menu() {
    echo ""
    echo "================================"
    echo "Click2Leads Deployment Manager"
    echo "================================"
    echo "1. Initial VPS Setup (run once)"
    echo "2. Deploy Application"
    echo "3. Check Status"
    echo "4. View Logs"
    echo "5. Restart Services"
    echo "6. Setup GitHub CI/CD"
    echo "7. Exit"
    echo "================================"
    echo -n "Select option: "
}

# Main script
main() {
    check_ssh
    
    if [ "$1" = "deploy" ]; then
        deploy_app
        exit 0
    fi
    
    if [ "$1" = "setup" ]; then
        initial_setup
        exit 0
    fi
    
    if [ "$1" = "status" ]; then
        check_status
        exit 0
    fi
    
    # Interactive menu
    while true; do
        show_menu
        read -r option
        
        case $option in
            1)
                initial_setup
                ;;
            2)
                deploy_app
                ;;
            3)
                check_status
                ;;
            4)
                view_logs
                ;;
            5)
                restart_services
                ;;
            6)
                setup_github
                ;;
            7)
                print_status "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main "$@"
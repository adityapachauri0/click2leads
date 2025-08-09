#!/bin/bash

# Complete GitHub Setup Script for Click2Leads
# This script sets up everything for GitHub deployment

set -e

# Configuration
GITHUB_USERNAME="yourusername"  # UPDATE THIS
REPO_NAME="click2leads"
VPS_HOST="your-vps-ip"  # UPDATE THIS
VPS_USER="deploy"
VPS_PORT="22"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }

# Step 1: Initialize Git repository
init_git() {
    print_status "Initializing Git repository..."
    
    # Check if already initialized
    if [ -d ".git" ]; then
        print_warning "Git repository already initialized"
    else
        git init
        print_status "Git repository initialized"
    fi
    
    # Configure git
    git config user.name "Click2Leads Deploy"
    git config user.email "deploy@click2leads.co.uk"
}

# Step 2: Create .env.example
create_env_example() {
    print_status "Creating .env.example..."
    
    cat > backend/.env.example << 'EOF'
# Example environment configuration for Click2Leads
# Copy this to .env and update with your actual values

# Server Configuration
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5001

# Database
MONGODB_URI=mongodb://localhost:27017/click2leads_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Secrets (generate with: openssl rand -base64 64)
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRE=30d

# Session
SESSION_SECRET=your-session-secret-here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@click2leads.co.uk

# External APIs (optional)
IPINFO_TOKEN=
GOOGLE_MAPS_API_KEY=
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
EOF

    print_status ".env.example created"
}

# Step 3: Prepare files for GitHub
prepare_github_files() {
    print_status "Preparing files for GitHub..."
    
    # Create README if not exists
    if [ ! -f "README.md" ]; then
        cat > README.md << 'EOF'
# Click2Leads

Modern lead generation and management system with real-time form capture.

## Features
- Real-time form field capture
- Lead management dashboard
- Bulk operations (delete/export)
- Excel export functionality
- IP tracking and geolocation
- GDPR compliant consent management
- JWT authentication
- Rate limiting and security

## Tech Stack
- Frontend: React, TypeScript, Redux Toolkit
- Backend: Node.js, Express, MongoDB
- Cache: Redis
- Process Manager: PM2
- Web Server: NGINX

## Deployment
See DEPLOYMENT.md for production deployment instructions.

## License
Private
EOF
    fi
    
    # Create uploads directory with .gitkeep
    mkdir -p uploads
    touch uploads/.gitkeep
    
    # Add all files to git
    git add .
    git status
}

# Step 4: Create GitHub repository
create_github_repo() {
    print_status "Creating GitHub repository..."
    
    print_warning "Please create a PRIVATE repository on GitHub:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: ${REPO_NAME}"
    echo "3. Set to PRIVATE"
    echo "4. Don't initialize with README"
    echo "5. Click 'Create repository'"
    echo ""
    read -p "Press Enter when repository is created..."
    
    # Add remote
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    print_status "Remote origin added"
}

# Step 5: Initial commit and push
initial_push() {
    print_status "Creating initial commit..."
    
    git add .
    git commit -m "Initial commit - Click2Leads production ready" || true
    
    print_status "Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    
    print_status "Code pushed to GitHub successfully!"
}

# Step 6: Generate SSH keys for deployment
setup_ssh_keys() {
    print_status "Setting up SSH keys for deployment..."
    
    SSH_KEY_PATH="$HOME/.ssh/click2leads_deploy"
    
    if [ -f "$SSH_KEY_PATH" ]; then
        print_warning "SSH key already exists at $SSH_KEY_PATH"
    else
        ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N "" -C "click2leads-deploy"
        print_status "SSH key generated"
    fi
    
    print_warning "Copy this public key to your VPS:"
    cat "${SSH_KEY_PATH}.pub"
    echo ""
    print_warning "Run on VPS: echo 'PASTE_PUBLIC_KEY_HERE' >> /home/deploy/.ssh/authorized_keys"
    echo ""
    read -p "Press Enter when public key is added to VPS..."
    
    print_warning "Add this private key to GitHub Secrets (VPS_SSH_KEY):"
    echo "---"
    cat "$SSH_KEY_PATH"
    echo "---"
}

# Step 7: Setup GitHub secrets
setup_github_secrets() {
    print_status "Setting up GitHub secrets..."
    
    print_warning "Add these secrets to your GitHub repository:"
    echo ""
    echo "Go to: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/secrets/actions"
    echo ""
    echo "Add these repository secrets:"
    echo "  VPS_HOST: ${VPS_HOST}"
    echo "  VPS_USER: ${VPS_USER}"
    echo "  VPS_PORT: ${VPS_PORT}"
    echo "  VPS_SSH_KEY: (paste the private key shown above)"
    echo ""
    read -p "Press Enter when all secrets are added..."
}

# Step 8: Transfer sensitive files to VPS
transfer_sensitive_files() {
    print_status "Transferring sensitive files to VPS..."
    
    print_warning "We'll now transfer .env files to VPS (one-time setup)"
    
    # Check if .env.production exists
    if [ ! -f "backend/.env.production" ]; then
        print_error "backend/.env.production not found!"
        print_warning "Creating from template..."
        cp backend/.env.example backend/.env.production
        print_warning "Please edit backend/.env.production with production values"
        read -p "Press Enter when .env.production is ready..."
    fi
    
    # Transfer files
    print_status "Transferring .env.production to VPS..."
    scp -P ${VPS_PORT} backend/.env.production ${VPS_USER}@${VPS_HOST}:/var/www/click2leads/backend/
    
    if [ -f "backend/.env" ]; then
        print_status "Transferring .env to VPS..."
        scp -P ${VPS_PORT} backend/.env ${VPS_USER}@${VPS_HOST}:/var/www/click2leads/backend/
    fi
    
    print_status "Sensitive files transferred successfully!"
}

# Step 9: Initial VPS setup
setup_vps() {
    print_status "Running initial VPS setup..."
    
    # Transfer setup script
    scp -P ${VPS_PORT} scripts/vps-setup.sh ${VPS_USER}@${VPS_HOST}:/tmp/
    
    # Run setup
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
        sudo chmod +x /tmp/vps-setup.sh
        sudo /tmp/vps-setup.sh
        
        # Create project directory
        sudo mkdir -p /var/www/click2leads
        sudo chown -R deploy:deploy /var/www/click2leads
        
        # Clone repository
        cd /var/www/click2leads
        git clone https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git . || true
ENDSSH
    
    print_status "VPS setup completed!"
}

# Step 10: Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Make a small change
    echo "# Deployment test $(date)" >> README.md
    git add README.md
    git commit -m "Test deployment"
    git push
    
    print_status "Deployment triggered! Check GitHub Actions for progress:"
    echo "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/actions"
}

# Main execution
main() {
    print_status "Starting GitHub deployment setup for Click2Leads"
    echo "================================================"
    
    # Check configuration
    if [ "$GITHUB_USERNAME" = "yourusername" ] || [ "$VPS_HOST" = "your-vps-ip" ]; then
        print_error "Please update GITHUB_USERNAME and VPS_HOST in this script!"
        exit 1
    fi
    
    # Run all steps
    init_git
    create_env_example
    prepare_github_files
    create_github_repo
    initial_push
    setup_ssh_keys
    setup_github_secrets
    transfer_sensitive_files
    setup_vps
    test_deployment
    
    print_status "Setup completed successfully!"
    echo ""
    print_warning "Next steps:"
    echo "1. Verify deployment at: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/actions"
    echo "2. Check your site at: http://${VPS_HOST}"
    echo "3. Setup SSL: ssh ${VPS_USER}@${VPS_HOST} 'sudo certbot --nginx'"
    echo ""
    print_status "Your Click2Leads is now auto-deploying via GitHub!"
}

# Run main function
main
# Quick Deployment Guide for click2leads.co.uk

## What I've Done

I've created all the necessary deployment configuration files for your click2leads project:

1. **PM2 Configuration** (`ecosystem.config.js`) - Process manager config
2. **Nginx Configuration** (`nginx.conf`) - Web server config for click2leads.co.uk
3. **Deployment Script** (`deploy.sh`) - Automated deployment script
4. **GitHub Actions** (`.github/workflows/deploy.yml`) - Auto-deployment on push
5. **Environment Config** (`.env.production`) - Production environment variables
6. **Documentation** (`DEPLOYMENT_STEPS.md`) - Detailed deployment guide

## Quick Steps to Deploy

### 1. Push Files to GitHub
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### 2. SSH into Your Hostinger VPS
```bash
ssh root@YOUR_VPS_IP
```

### 3. Run Initial Setup (One-time)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install Git
apt install git -y
```

### 4. Deploy the Application
```bash
cd /var/www
git clone https://github.com/adityapachauri0/click2leads.git
cd click2leads
chmod +x deploy.sh
./deploy.sh
```

### 5. Setup SSL Certificate
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d click2leads.co.uk -d www.click2leads.co.uk
```

### 6. Configure GitHub Secrets
In your GitHub repository settings (https://github.com/adityapachauri0/click2leads/settings/secrets/actions), add:
- `VPS_HOST`: Your VPS IP
- `VPS_USERNAME`: root
- `VPS_PASSWORD`: Your VPS password
- `VPS_PORT`: 22

## Important Notes

### Build Errors to Fix
The project has some TypeScript errors that need fixing before it can build:
1. `CustomCursor.tsx` - Fixed ✓
2. `NavigationOrb.tsx` - Fixed ✓
3. `Pricing3D.tsx` - Needs fixing (opacity prop issue)

### Domain Configuration
1. Make sure click2leads.co.uk is pointed to your VPS IP in Hostinger DNS settings
2. The nginx.conf file is already configured for this domain

### After Deployment
- Your site will be available at https://click2leads.co.uk
- Frontend runs on port 3000 (proxied through Nginx)
- Backend API runs on port 5001 (accessible at /api)
- PM2 manages both processes

## Quick Commands

- **Check status**: `pm2 status`
- **View logs**: `pm2 logs`
- **Restart**: `pm2 restart all`
- **Update code**: `cd /var/www/click2leads && git pull && pm2 restart all`

## Next Steps

1. Fix the remaining TypeScript build error in Pricing3D.tsx
2. Push all changes to GitHub
3. Follow the deployment steps above
4. Your site will be live at https://click2leads.co.uk!

Every future push to the main branch will automatically deploy to your VPS.
# Click2Leads Production Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying Click2Leads to a production VPS server while maintaining complete isolation from other projects on the same server.

## Prerequisites
- Ubuntu 20.04+ or Debian 11+ VPS
- Root or sudo access
- Domain name pointing to your VPS (e.g., click2leads.co.uk)
- At least 2GB RAM and 20GB storage
- Basic knowledge of Linux command line

## Quick Deployment

### 1. Initial Server Setup
```bash
# Login to your VPS as root
ssh root@your-vps-ip

# Download and run the deployment script
wget https://raw.githubusercontent.com/yourusername/click2leads/main/scripts/deploy.sh
chmod +x deploy.sh
./deploy.sh setup
```

### 2. Configure Environment
```bash
# Edit production environment variables
nano /var/www/click2leads/backend/.env.production

# Update the following:
# - JWT_SECRET (generate with: openssl rand -base64 64)
# - MONGODB_URI (from setup-mongodb.sh output)
# - SMTP credentials
# - API keys
```

### 3. Deploy Application
```bash
# Clone your repository
cd /var/www/click2leads
git clone https://github.com/yourusername/click2leads.git .

# Run deployment
./scripts/deploy.sh
```

## Manual Deployment Steps

### Step 1: Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org

# Install Redis
apt-get install -y redis-server

# Install NGINX
apt-get install -y nginx
```

### Step 2: Setup MongoDB
```bash
# Run MongoDB setup script
cd /var/www/click2leads
chmod +x scripts/setup-mongodb.sh
./scripts/setup-mongodb.sh

# Note the credentials output
```

### Step 3: Configure NGINX
```bash
# Copy NGINX configuration
cp nginx/click2leads.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/click2leads.conf /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Reload NGINX
systemctl reload nginx
```

### Step 4: Setup SSL Certificate
```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d click2leads.co.uk -d www.click2leads.co.uk

# Setup auto-renewal
crontab -e
# Add: 0 0 * * * /usr/bin/certbot renew --quiet
```

### Step 5: Deploy Application
```bash
# Backend setup
cd /var/www/click2leads/backend
npm ci --production
cp .env.production .env

# Frontend build
cd ../frontend
npm ci
npm run build

# Start with PM2
cd /var/www/click2leads
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Step 6: Setup Monitoring & Backups
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Setup cron jobs
crontab -e

# Add the following:
# Monitoring (every 5 minutes)
*/5 * * * * /var/www/click2leads/scripts/monitor-health.sh

# Backup (daily at 2 AM)
0 2 * * * /var/www/click2leads/scripts/backup-production.sh

# Log rotation is handled by logrotate (already configured)
```

## Project Structure
```
/var/www/click2leads/
├── backend/               # Backend API
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── .env.production
├── frontend/              # React frontend
│   ├── build/            # Production build
│   └── src/
├── logs/                 # Application logs
├── uploads/              # User uploads
├── scripts/              # Deployment scripts
├── nginx/                # NGINX configs
└── ecosystem.config.js   # PM2 configuration

/var/log/click2leads/     # System logs
/var/backups/click2leads/ # Backups
```

## Port Allocation
- **5003**: Backend API (Click2Leads)
- **5004**: Backend API (second instance if clustered)
- **3003**: Frontend dev server (if needed)
- **27017**: MongoDB (default)
- **6379**: Redis (default)

## Isolation Features
- **Unique PM2 app names**: `click2leads-backend`, `click2leads-frontend`
- **Separate NGINX upstream**: `click2leads_backend`
- **Dedicated rate limiting zones**: `click2leads_api`, `click2leads_submit`
- **Isolated MongoDB database**: `click2leads_production`
- **Redis database #2**: Separate from default (0)
- **Unique log files**: `/var/log/click2leads/`
- **Separate backup directory**: `/var/backups/click2leads/`

## Management Commands

### PM2 Commands
```bash
# View processes
pm2 list

# View logs
pm2 logs click2leads-backend

# Restart backend
pm2 restart click2leads-backend

# Stop all Click2Leads processes
pm2 stop click2leads-backend click2leads-frontend

# Monitor resources
pm2 monit
```

### Backup Commands
```bash
# Manual backup
/var/www/click2leads/scripts/backup-production.sh

# List backups
ls -la /var/backups/click2leads/

# Restore from backup (create restore script if needed)
```

### Monitoring Commands
```bash
# Check health
/var/www/click2leads/scripts/monitor-health.sh

# View metrics
tail -f /var/log/click2leads/metrics.log

# Check service status
systemctl status mongod redis-server nginx
```

## Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs click2leads-backend --lines 100

# Verify MongoDB connection
mongosh mongodb://click2leads_user:PASSWORD@localhost:27017/click2leads_production?authSource=admin

# Check port availability
lsof -i :5003
```

### High Memory Usage
```bash
# Restart PM2 processes
pm2 restart all

# Clear Redis cache
redis-cli -n 2 FLUSHDB

# Check MongoDB connections
mongosh click2leads_production --eval "db.serverStatus().connections"
```

### SSL Issues
```bash
# Test SSL
openssl s_client -connect click2leads.co.uk:443

# Renew certificate
certbot renew --dry-run
certbot renew
```

## Security Checklist
- [ ] Changed all default passwords
- [ ] Updated JWT secrets in .env.production
- [ ] Configured firewall (ufw)
- [ ] SSL certificate installed
- [ ] MongoDB authentication enabled
- [ ] Redis password set
- [ ] Rate limiting configured
- [ ] Backup encryption enabled
- [ ] Log rotation configured
- [ ] Monitoring alerts configured

## Performance Optimization
1. **Enable gzip compression** (already in NGINX config)
2. **Use PM2 cluster mode** (2 instances configured)
3. **Redis caching enabled** (configured in .env.production)
4. **MongoDB indexes created** (done by setup-mongodb.sh)
5. **Static file caching** (30 days in NGINX)

## Maintenance

### Weekly Tasks
- Review monitoring alerts
- Check disk space
- Review error logs
- Test backup restoration

### Monthly Tasks
- Update dependencies (security patches)
- Review and rotate logs
- Performance analysis
- SSL certificate check

### Quarterly Tasks
- Full system backup
- Security audit
- Performance optimization review
- Disaster recovery test

## Support Contacts
- **System Admin**: admin@click2leads.co.uk
- **Technical Support**: support@click2leads.co.uk
- **Emergency**: +44 20 1234 5678

## Version Information
- **Node.js**: 18.x
- **MongoDB**: 6.0
- **Redis**: Latest stable
- **NGINX**: Latest stable
- **PM2**: Latest

## Additional Resources
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [NGINX Documentation](https://nginx.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintained By**: Click2Leads DevOps Team
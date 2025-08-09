# Click2Leads Production Deployment Guide

## Overview
This guide covers the complete production deployment process for the Click2Leads application.

## Prerequisites

### Required Services
- MongoDB (v5.0+)
- Redis (v6.0+)
- Node.js (v18 LTS)
- Nginx or Apache for reverse proxy
- SSL certificates (Let's Encrypt recommended)
- Domain name configured with DNS

### Optional Services
- Sentry account for error tracking
- SMTP service (SendGrid, AWS SES, or similar)
- CDN service (CloudFlare, AWS CloudFront)
- Monitoring service (New Relic, DataDog)

## Environment Setup

### 1. Server Requirements
- **Minimum**: 2 CPU cores, 4GB RAM, 20GB SSD
- **Recommended**: 4 CPU cores, 8GB RAM, 50GB SSD
- **OS**: Ubuntu 20.04 LTS or later

### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Redis
sudo apt install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Install Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2 globally
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

## Application Deployment

### 1. Clone and Setup

```bash
# Clone repository
git clone https://github.com/your-org/click2leads.git /var/www/click2leads
cd /var/www/click2leads

# Install dependencies
cd backend && npm ci --production
cd ../frontend && npm ci && npm run build
```

### 2. Configure Environment Variables

Copy `.env.production` to `.env` and update with real values:

```bash
cp backend/.env.production backend/.env
nano backend/.env
```

**Critical Variables to Update:**
- `MONGODB_URI` - Production MongoDB connection string
- `REDIS_PASSWORD` - Secure Redis password
- `JWT_SECRET` - Generate with: `openssl rand -base64 64`
- `JWT_REFRESH_SECRET` - Generate with: `openssl rand -base64 64`
- `SESSION_SECRET` - Generate with: `openssl rand -base64 32`
- `SMTP_*` - Real SMTP credentials
- `SENTRY_DSN` - Your Sentry project DSN
- `RECAPTCHA_*` - Google reCAPTCHA keys

### 3. Database Setup

```bash
# Create MongoDB user
mongo
> use click2leads
> db.createUser({
    user: "click2leads_user",
    pwd: "STRONG_PASSWORD_HERE",
    roles: [{role: "readWrite", db: "click2leads"}]
  })
> exit

# Configure Redis password
sudo nano /etc/redis/redis.conf
# Uncomment and set: requirepass YOUR_REDIS_PASSWORD
sudo systemctl restart redis-server
```

### 4. Nginx Configuration

Create Nginx site configuration:

```nginx
# /etc/nginx/sites-available/click2leads
server {
    listen 80;
    server_name click2leads.co.uk www.click2leads.co.uk;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name click2leads.co.uk www.click2leads.co.uk;

    ssl_certificate /etc/letsencrypt/live/click2leads.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/click2leads.co.uk/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Frontend
    location / {
        root /var/www/click2leads/frontend/build;
        try_files $uri $uri/ /index.html;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
    
    # API Backend
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5001/health;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/click2leads /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL Certificate Setup

```bash
sudo certbot --nginx -d click2leads.co.uk -d www.click2leads.co.uk
```

### 6. Start Application with PM2

```bash
# Start backend
cd /var/www/click2leads/backend
pm2 start server.js --name click2leads-backend --env production

# Save PM2 configuration
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER
```

## Post-Deployment

### 1. Security Hardening

```bash
# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Fail2ban for brute force protection
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### 2. Monitoring Setup

#### PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

#### Health Check Monitoring
Add to crontab:
```bash
*/5 * * * * curl -f http://localhost:5001/health || pm2 restart click2leads-backend
```

### 3. Backup Strategy

Create backup script `/usr/local/bin/backup-click2leads.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/click2leads"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --db click2leads --out $BACKUP_DIR/mongo_$DATE

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/click2leads

# Keep only last 30 days of backups
find $BACKUP_DIR -type f -mtime +30 -delete

# Upload to S3 (optional)
# aws s3 sync $BACKUP_DIR s3://your-backup-bucket/click2leads/
```

Add to crontab:
```bash
0 2 * * * /usr/local/bin/backup-click2leads.sh
```

## Maintenance

### Updating Application

```bash
cd /var/www/click2leads
git pull origin main

# Backend update
cd backend
npm ci --production
pm2 restart click2leads-backend

# Frontend update
cd ../frontend
npm ci
npm run build
```

### Log Management

View logs:
```bash
# PM2 logs
pm2 logs click2leads-backend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Performance Tuning

#### MongoDB Optimization
```javascript
// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.leads.createIndex({ createdAt: -1 })
db.leads.createIndex({ status: 1, createdAt: -1 })
```

#### Redis Optimization
```bash
# /etc/redis/redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -i :5001
   kill -9 <PID>
   ```

2. **MongoDB connection issues**
   ```bash
   sudo systemctl status mongod
   sudo systemctl restart mongod
   ```

3. **Redis connection issues**
   ```bash
   redis-cli ping
   sudo systemctl restart redis-server
   ```

4. **PM2 not starting on boot**
   ```bash
   pm2 startup
   pm2 save
   ```

## Security Checklist

- [ ] All environment variables updated with production values
- [ ] Strong passwords for MongoDB and Redis
- [ ] SSL certificates installed and auto-renewal configured
- [ ] Firewall configured with minimal open ports
- [ ] Fail2ban installed for brute force protection
- [ ] Regular backups configured and tested
- [ ] Monitoring and alerting setup
- [ ] Error tracking (Sentry) configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Regular security updates scheduled

## Support

For issues or questions:
- Check application logs: `pm2 logs`
- Review MongoDB logs: `/var/log/mongodb/mongod.log`
- Check Nginx error logs: `/var/log/nginx/error.log`
- Monitor server resources: `htop`, `df -h`, `free -m`

## Production URLs

- Main Site: https://click2leads.co.uk
- API: https://click2leads.co.uk/api
- Health Check: https://click2leads.co.uk/health
- Admin Dashboard: https://click2leads.co.uk/dashboard
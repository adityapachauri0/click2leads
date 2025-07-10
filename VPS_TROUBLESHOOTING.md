# VPS Deployment Troubleshooting Guide

## SSH Commands to Run on Your VPS

Connect to your VPS first:
```bash
ssh root@your-server-ip
```

### 1. Check if PM2 processes are running
```bash
pm2 list
pm2 logs
pm2 logs click2leads-frontend
pm2 logs click2leads-backend
```

### 2. Check if Node.js is installed and version
```bash
node --version
npm --version
```

### 3. Navigate to your project directory
```bash
cd /var/www/click2leads
# or wherever you cloned your repository
ls -la
```

### 4. Check if dependencies are installed
```bash
# For frontend
cd frontend
ls -la node_modules
npm list

# For backend
cd ../backend
ls -la node_modules
```

### 5. Check if Next.js build exists
```bash
cd /var/www/click2leads/frontend
ls -la .next
```

### 6. Build the Next.js app if needed
```bash
cd /var/www/click2leads/frontend
npm run build
```

### 7. Start/Restart PM2 processes
```bash
cd /var/www/click2leads
pm2 delete all  # Clear any existing processes
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Set up auto-start on server reboot
```

### 8. Check Nginx status
```bash
nginx -t  # Test configuration
systemctl status nginx
systemctl restart nginx
```

### 9. Check if ports are listening
```bash
netstat -tlnp | grep 3000  # Frontend port
netstat -tlnp | grep 5001  # Backend port
```

### 10. Check firewall settings
```bash
ufw status
# If needed:
ufw allow 80
ufw allow 443
ufw allow 22
```

### 11. Check system logs
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
journalctl -u nginx -f
```

### 12. Test if apps are accessible locally
```bash
curl http://localhost:3000
curl http://localhost:5001
```

## Common Issues and Solutions

### Issue 1: 502 Bad Gateway
- PM2 processes not running
- Wrong ports in configuration
- Node.js app crashed

**Solution:**
```bash
pm2 restart all
pm2 logs --lines 100
```

### Issue 2: Site not loading at all
- DNS not propagated
- Nginx not configured properly
- SSL certificate issues

**Solution:**
```bash
# Check DNS
dig click2leads.co.uk
nslookup click2leads.co.uk

# Check Nginx
nginx -t
systemctl restart nginx
```

### Issue 3: Build errors
- Missing dependencies
- Wrong Node.js version
- Memory issues during build

**Solution:**
```bash
# Increase memory for build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or use swap if low on RAM
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Issue 4: SSL Certificate errors
**Solution:**
```bash
# Check if SSL files exist
ls -la /etc/ssl/certs/click2leads.co.uk.crt
ls -la /etc/ssl/private/click2leads.co.uk.key

# If using Let's Encrypt
apt-get install certbot python3-certbot-nginx
certbot --nginx -d click2leads.co.uk -d www.click2leads.co.uk
```

## Step-by-Step Deployment from Scratch

1. **Clone repository**
```bash
cd /var/www
git clone https://github.com/yourusername/click2leads.git
cd click2leads
```

2. **Install dependencies**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

3. **Build frontend**
```bash
cd frontend
npm run build
cd ..
```

4. **Copy Nginx config**
```bash
cp nginx.conf /etc/nginx/sites-available/click2leads
ln -s /etc/nginx/sites-available/click2leads /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

5. **Start with PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Quick Health Check Script

Create this script on your server:
```bash
#!/bin/bash
echo "=== PM2 Status ==="
pm2 list
echo -e "\n=== Port Check ==="
netstat -tlnp | grep -E "3000|5001"
echo -e "\n=== Nginx Status ==="
systemctl status nginx --no-pager
echo -e "\n=== Recent Errors ==="
tail -5 /var/log/nginx/error.log
echo -e "\n=== PM2 Logs (last 10 lines) ==="
pm2 logs --lines 10 --nostream
```

Save as `health-check.sh` and run with `bash health-check.sh`
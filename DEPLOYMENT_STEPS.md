# Click2leads Deployment Steps

## Prerequisites on Hostinger VPS
- Ubuntu 20.04 or 22.04
- Root or sudo access
- Domain pointed to VPS IP address

## Step-by-Step Deployment

### 1. Initial VPS Setup (One-time)

SSH into your VPS:
```bash
ssh root@YOUR_VPS_IP
```

Install required software:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install Git
apt install git -y

# Install build essentials (for native modules)
apt install build-essential -y
```

### 2. Clone and Deploy

```bash
# Create web directory
mkdir -p /var/www
cd /var/www

# Clone repository
git clone https://github.com/adityapachauri0/click2leads.git
cd click2leads

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

### 3. Configure Domain in Hostinger

1. Log into Hostinger control panel
2. Go to Domains section
3. Add click2leads.co.uk
4. Point it to your VPS IP address
5. Wait for DNS propagation (5-30 minutes)

### 4. Setup SSL Certificate

Option A - Using Certbot (Free SSL):
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d click2leads.co.uk -d www.click2leads.co.uk
```

Option B - Using Hostinger SSL:
- Generate SSL in Hostinger panel
- Download certificate files
- Place them in `/etc/ssl/certs/` and `/etc/ssl/private/`

### 5. Configure GitHub Secrets (for auto-deployment)

In your GitHub repository settings, add these secrets:
- `VPS_HOST`: Your VPS IP address
- `VPS_USERNAME`: root (or your username)
- `VPS_PASSWORD`: Your VPS password
- `VPS_PORT`: 22 (default SSH port)

### 6. Environment Variables

Create production environment file on VPS:
```bash
cd /var/www/click2leads
nano .env.production
```

Add:
```
NEXT_PUBLIC_API_URL=https://click2leads.co.uk/api
NEXT_PUBLIC_SITE_URL=https://click2leads.co.uk
NODE_ENV=production

# Add any other secrets like:
# DATABASE_URL=your_database_url
# JWT_SECRET=your_jwt_secret
# EMAIL_USER=your_email
# EMAIL_PASS=your_email_password
```

### 7. Test Deployment

1. Check PM2 processes:
   ```bash
   pm2 status
   ```

2. Check Nginx:
   ```bash
   systemctl status nginx
   ```

3. View logs:
   ```bash
   pm2 logs
   ```

4. Test website:
   - Visit https://click2leads.co.uk
   - Test all pages and features

## Maintenance Commands

- **Update code**: `cd /var/www/click2leads && git pull && pm2 restart all`
- **View logs**: `pm2 logs`
- **Restart services**: `pm2 restart all`
- **Monitor resources**: `pm2 monit`
- **Check Nginx**: `nginx -t`
- **Reload Nginx**: `systemctl reload nginx`

## Troubleshooting

1. **Site not loading**:
   - Check PM2: `pm2 status`
   - Check Nginx: `systemctl status nginx`
   - Check logs: `pm2 logs`

2. **502 Bad Gateway**:
   - Frontend not running: `pm2 restart click2leads-frontend`
   - Wrong port in Nginx config

3. **SSL issues**:
   - Renew certificate: `certbot renew`
   - Check certificate: `certbot certificates`

4. **Performance issues**:
   - Check server resources: `htop`
   - Scale PM2 instances: Edit `ecosystem.config.js`
   - Enable caching in Nginx

## Auto-deployment

Once GitHub Actions is set up, every push to main branch will:
1. Trigger the deployment workflow
2. SSH into your VPS
3. Pull latest code
4. Rebuild frontend
5. Restart PM2 processes

This ensures your live site always reflects the latest code in GitHub.
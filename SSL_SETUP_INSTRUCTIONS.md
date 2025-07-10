# SSL Setup Instructions for click2leads.co.uk

## Quick Method (Using the Script)

1. Connect to your VPS server:
   ```bash
   ssh root@31.97.57.193
   ```

2. Upload and run the setup script:
   ```bash
   # Copy the setup-ssl.sh script to your server
   scp setup-ssl.sh root@31.97.57.193:/root/

   # On the server, run:
   cd /root
   chmod +x setup-ssl.sh
   ./setup-ssl.sh
   ```

## Manual Method (Step by Step)

If you prefer to do it manually or if the script encounters issues:

### 1. Connect to your server
```bash
ssh root@31.97.57.193
```

### 2. Install Certbot
```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### 3. Create a temporary nginx config for HTTP
```bash
# First, create a simple HTTP config
sudo nano /etc/nginx/sites-available/click2leads-http
```

Add this content:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name click2leads.co.uk www.click2leads.co.uk;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Enable the temporary config
```bash
sudo ln -sf /etc/nginx/sites-available/click2leads-http /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Get SSL Certificate
```bash
sudo certbot --nginx -d click2leads.co.uk -d www.click2leads.co.uk
```

When prompted:
- Enter your email address
- Agree to terms of service (A)
- Choose whether to share email (Y/N)
- Select option 2 to redirect HTTP to HTTPS

### 6. Verify SSL is working
```bash
curl -I https://click2leads.co.uk
```

### 7. Update your nginx config (optional)
If certbot didn't update your config properly, use the nginx.conf from this repository.

## Troubleshooting

### If you get "connection refused" errors:
1. Check if nginx is running:
   ```bash
   sudo systemctl status nginx
   ```

2. Check if your apps are running:
   ```bash
   pm2 status
   ```

3. Check nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

### If SSL certificate fails:
1. Make sure port 80 is open:
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   ```

2. Verify DNS is pointing to your server:
   ```bash
   dig +short click2leads.co.uk
   ```

3. Try standalone mode:
   ```bash
   sudo certbot certonly --standalone -d click2leads.co.uk -d www.click2leads.co.uk
   ```

## After SSL Setup

1. Test auto-renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

2. Certificate location:
   - Certificate: `/etc/letsencrypt/live/click2leads.co.uk/fullchain.pem`
   - Private Key: `/etc/letsencrypt/live/click2leads.co.uk/privkey.pem`

3. Renewal happens automatically via systemd timer.

## Important Notes

- The current issue is that HTTPS traffic is being intercepted by GoDaddy's servers
- Make sure your domain's nameservers are pointing directly to your VPS
- You may need to disable any CDN/proxy services in your domain settings
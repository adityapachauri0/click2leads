# Server Deployment Commands for 31.97.57.193

## 1. Test SSH Connection
```bash
# Test connection to your server
ssh root@31.97.57.193

# If you have a different username:
# ssh username@31.97.57.193
```

## 2. Initial Server Setup (Run these on the server)
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required software
sudo apt install -y nginx git nodejs npm python3-certbot-nginx

# Install PM2 globally
sudo npm install -g pm2

# Install n for Node.js version management
sudo npm install -g n
sudo n stable
```

## 3. Setup Application Directory
```bash
# Create application directory
sudo mkdir -p /var/www/click2leads
sudo chown -R $USER:$USER /var/www/click2leads
cd /var/www/click2leads
```

## 4. Clone and Deploy Application
```bash
# Clone your repository
git clone https://github.com/adityapachauri0/click2leads.git .

# Run the deployment script
sudo bash deploy.sh
```

## 5. Configure Firewall
```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 6. Setup SSL Certificate (for click2leads.co.uk)
```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d click2leads.co.uk -d www.click2leads.co.uk
```

## 7. Update Nginx Configuration
```bash
# Update the nginx.conf with correct SSL paths
sudo nano /etc/nginx/sites-available/click2leads

# Update these lines with actual certificate paths:
# ssl_certificate /etc/letsencrypt/live/click2leads.co.uk/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/click2leads.co.uk/privkey.pem;
```

## 8. Quick Deployment from Local Machine
```bash
# From your local machine, deploy directly to server:
rsync -avz --exclude 'node_modules' --exclude '.git' /Users/adityapachauri/Desktop/click2leads/ root@31.97.57.193:/var/www/click2leads/

# Then SSH and run deployment
ssh root@31.97.57.193 "cd /var/www/click2leads && sudo bash deploy.sh"
```

## 9. Monitor Application
```bash
# Check PM2 processes
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

## 10. Restart Services
```bash
# Restart individual services
pm2 restart click2leads-frontend
pm2 restart click2leads-backend

# Restart all
pm2 restart all

# Restart Nginx
sudo systemctl restart nginx
```

## Important Notes:
- Server IP: 31.97.57.193
- Domain: click2leads.co.uk
- Frontend runs on: localhost:3000
- Backend runs on: localhost:5001
- Make sure to update DNS A records to point to 31.97.57.193
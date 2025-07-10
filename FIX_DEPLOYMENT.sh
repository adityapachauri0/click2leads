#!/bin/bash
# Quick fix script for Click2Leads deployment

echo "=== Click2Leads Deployment Fix ==="
echo "Run this on your VPS server at 31.97.57.193"
echo ""

# Step 1: Find where your project is
echo "Step 1: Locating your project..."
if [ -d "/var/www/click2leads" ]; then
    PROJECT_DIR="/var/www/click2leads"
elif [ -d "/root/click2leads" ]; then
    PROJECT_DIR="/root/click2leads"
elif [ -d "/home/click2leads" ]; then
    PROJECT_DIR="/home/click2leads"
else
    echo "Project not found in common locations. Searching..."
    find / -name "click2leads" -type d 2>/dev/null | grep -v node_modules | head -5
    echo "Please set PROJECT_DIR to your project location"
    exit 1
fi

echo "Found project at: $PROJECT_DIR"
cd $PROJECT_DIR

# Step 2: Install dependencies if needed
echo ""
echo "Step 2: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Step 3: Build frontend
echo ""
echo "Step 3: Building frontend..."
cd $PROJECT_DIR/frontend
if [ ! -d ".next" ]; then
    echo "Building Next.js app..."
    npm run build
else
    echo "Build exists, rebuilding..."
    rm -rf .next
    npm run build
fi

# Step 4: Start with PM2
echo ""
echo "Step 4: Starting apps with PM2..."
cd $PROJECT_DIR
pm2 delete all 2>/dev/null
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

# Step 5: Configure Nginx
echo ""
echo "Step 5: Configuring Nginx..."
# Create a simple nginx config first
cat > /etc/nginx/sites-available/click2leads-simple << 'EOF'
server {
    listen 80;
    server_name 31.97.57.193;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Enable the site
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/click2leads
ln -sf /etc/nginx/sites-available/click2leads-simple /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Step 6: Check status
echo ""
echo "Step 6: Checking status..."
echo "=== PM2 Status ==="
pm2 list
echo ""
echo "=== Testing local connections ==="
sleep 5  # Give apps time to start
curl -I http://localhost:3000 | head -3
echo ""
echo "=== External test ==="
echo "Your site should now be accessible at: http://31.97.57.193"
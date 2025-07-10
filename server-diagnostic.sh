#!/bin/bash
# Click2Leads Server Diagnostic Script

echo "=== System Information ==="
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo "IP: $(hostname -I)"
echo ""

echo "=== Node.js & NPM Version ==="
node --version 2>/dev/null || echo "Node.js not installed"
npm --version 2>/dev/null || echo "NPM not installed"
echo ""

echo "=== PM2 Status ==="
pm2 list 2>/dev/null || echo "PM2 not installed or not running"
echo ""

echo "=== Project Location Check ==="
echo "Checking /var/www/click2leads:"
ls -la /var/www/click2leads 2>/dev/null || echo "Directory not found"
echo ""

echo "=== Frontend Build Check ==="
if [ -d "/var/www/click2leads/frontend/.next" ]; then
    echo "Build folder exists"
    ls -la /var/www/click2leads/frontend/.next | head -5
else
    echo "Build folder NOT found"
fi
echo ""

echo "=== Port Status ==="
netstat -tlnp | grep -E "3000|5001" || echo "Ports not listening"
echo ""

echo "=== Nginx Status ==="
systemctl status nginx --no-pager 2>/dev/null || echo "Nginx not running"
echo ""

echo "=== Recent PM2 Logs ==="
pm2 logs --lines 10 --nostream 2>/dev/null || echo "No PM2 logs available"
echo ""

echo "=== Testing Local Connections ==="
echo "Testing frontend (port 3000):"
curl -I http://localhost:3000 2>/dev/null | head -3 || echo "Frontend not responding"
echo ""
echo "Testing backend (port 5001):"
curl -I http://localhost:5001 2>/dev/null | head -3 || echo "Backend not responding"
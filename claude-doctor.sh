#!/bin/bash
# Claude Doctor - Click2Leads Deployment Health Check

echo "🔍 CLAUDE DOCTOR - Click2Leads Deployment Diagnostics"
echo "====================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

echo "1. SYSTEM CHECKS"
echo "----------------"
# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not installed"
fi

# Check PM2
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    echo -e "${GREEN}✓${NC} PM2 installed: $PM2_VERSION"
else
    echo -e "${RED}✗${NC} PM2 not installed"
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓${NC} Nginx is running"
else
    echo -e "${RED}✗${NC} Nginx is not running"
fi

echo ""
echo "2. APPLICATION STATUS"
echo "---------------------"
# Check PM2 processes
echo "PM2 Process Status:"
pm2 list

echo ""
echo "3. PORT AVAILABILITY"
echo "--------------------"
# Check if ports are listening
if netstat -tlnp 2>/dev/null | grep -q ":3000"; then
    echo -e "${GREEN}✓${NC} Frontend port 3000 is listening"
else
    echo -e "${RED}✗${NC} Frontend port 3000 is NOT listening"
fi

if netstat -tlnp 2>/dev/null | grep -q ":5001"; then
    echo -e "${GREEN}✓${NC} Backend port 5001 is listening"
else
    echo -e "${RED}✗${NC} Backend port 5001 is NOT listening"
fi

echo ""
echo "4. CONNECTIVITY TESTS"
echo "---------------------"
# Test frontend
echo "Testing Frontend (localhost:3000):"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} Frontend responding with status: $FRONTEND_STATUS"
else
    echo -e "${RED}✗${NC} Frontend error - status: $FRONTEND_STATUS"
fi

# Test backend
echo "Testing Backend (localhost:5001):"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} Backend responding with status: $BACKEND_STATUS"
else
    echo -e "${RED}✗${NC} Backend error - status: $BACKEND_STATUS"
fi

# Test external access
echo "Testing External Access (http://31.97.57.193):"
EXTERNAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 http://31.97.57.193 || echo "timeout")
if [ "$EXTERNAL_STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} External access working - status: $EXTERNAL_STATUS"
else
    echo -e "${YELLOW}!${NC} External access issue - status: $EXTERNAL_STATUS"
fi

echo ""
echo "5. RECENT LOGS"
echo "--------------"
echo "Last 10 PM2 logs:"
pm2 logs --lines 10 --nostream

echo ""
echo "6. NGINX CONFIGURATION"
echo "----------------------"
echo "Active Nginx sites:"
ls -la /etc/nginx/sites-enabled/

echo ""
echo "7. PROJECT STRUCTURE"
echo "--------------------"
if [ -d "/var/www/click2leads" ]; then
    echo -e "${GREEN}✓${NC} Project directory exists: /var/www/click2leads"
    echo "Key directories:"
    [ -d "/var/www/click2leads/frontend/.next" ] && echo -e "  ${GREEN}✓${NC} Frontend build exists" || echo -e "  ${RED}✗${NC} Frontend build missing"
    [ -d "/var/www/click2leads/frontend/node_modules" ] && echo -e "  ${GREEN}✓${NC} Frontend dependencies installed" || echo -e "  ${RED}✗${NC} Frontend dependencies missing"
    [ -d "/var/www/click2leads/backend/node_modules" ] && echo -e "  ${GREEN}✓${NC} Backend dependencies installed" || echo -e "  ${RED}✗${NC} Backend dependencies missing"
else
    echo -e "${RED}✗${NC} Project directory not found at /var/www/click2leads"
fi

echo ""
echo "8. RECOMMENDATIONS"
echo "------------------"
# Provide recommendations based on checks
if [ "$FRONTEND_STATUS" != "200" ]; then
    echo "• Frontend not responding - check PM2 logs: pm2 logs click2leads-frontend"
fi
if [ "$BACKEND_STATUS" != "200" ]; then
    echo "• Backend not responding - check PM2 logs: pm2 logs click2leads-backend"
fi
if [ "$EXTERNAL_STATUS" != "200" ]; then
    echo "• External access issue - check Nginx configuration and firewall"
fi

echo ""
echo "====================================================="
echo "Diagnostic complete. Run 'pm2 logs' for detailed logs."
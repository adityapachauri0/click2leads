#!/bin/bash

# Click2Leads Health Monitoring Script
# Comprehensive monitoring with alerts, auto-recovery, and metrics collection

set -e

# Configuration
PROJECT_NAME="click2leads"
BACKEND_URL="http://localhost:5003"
FRONTEND_URL="http://localhost:3003"
PUBLIC_URL="https://click2leads.co.uk"
ALERT_EMAIL="admin@click2leads.co.uk"
SLACK_WEBHOOK="" # Optional: Add Slack webhook URL for notifications
LOG_DIR="/var/log/${PROJECT_NAME}"
METRICS_FILE="${LOG_DIR}/metrics.log"

# Thresholds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
DISK_THRESHOLD=80
RESPONSE_TIME_THRESHOLD=3000 # milliseconds
ERROR_RATE_THRESHOLD=5 # percentage

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Status tracking
HEALTH_STATUS="healthy"
ISSUES_FOUND=()

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
    HEALTH_STATUS="unhealthy"
    ISSUES_FOUND+=("$1")
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Log metrics
log_metric() {
    local metric_name="$1"
    local metric_value="$2"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "${timestamp} | ${metric_name} | ${metric_value}" >> ${METRICS_FILE}
}

# Send alert
send_alert() {
    local subject="$1"
    local message="$2"
    local severity="$3" # info, warning, critical
    
    # Email alert
    if [ -n "${ALERT_EMAIL}" ] && command -v mail &> /dev/null; then
        echo -e "${message}" | mail -s "[${severity^^}] Click2Leads: ${subject}" ${ALERT_EMAIL}
    fi
    
    # Slack alert (if configured)
    if [ -n "${SLACK_WEBHOOK}" ]; then
        local color="good"
        [ "$severity" = "warning" ] && color="warning"
        [ "$severity" = "critical" ] && color="danger"
        
        curl -X POST ${SLACK_WEBHOOK} \
            -H 'Content-Type: application/json' \
            -d "{
                \"attachments\": [{
                    \"color\": \"${color}\",
                    \"title\": \"${subject}\",
                    \"text\": \"${message}\",
                    \"footer\": \"Click2Leads Monitor\",
                    \"ts\": $(date +%s)
                }]
            }" 2>/dev/null
    fi
}

# Check system resources
check_system_resources() {
    print_status "Checking system resources..."
    
    # CPU Usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 | cut -d'.' -f1)
    log_metric "cpu_usage" "${CPU_USAGE}%"
    
    if [ ${CPU_USAGE} -gt ${CPU_THRESHOLD} ]; then
        print_error "High CPU usage: ${CPU_USAGE}%"
        send_alert "High CPU Usage" "CPU usage is at ${CPU_USAGE}% (threshold: ${CPU_THRESHOLD}%)" "warning"
    else
        print_status "CPU usage: ${CPU_USAGE}%"
    fi
    
    # Memory Usage
    MEMORY_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    log_metric "memory_usage" "${MEMORY_USAGE}%"
    
    if [ ${MEMORY_USAGE} -gt ${MEMORY_THRESHOLD} ]; then
        print_error "High memory usage: ${MEMORY_USAGE}%"
        send_alert "High Memory Usage" "Memory usage is at ${MEMORY_USAGE}% (threshold: ${MEMORY_THRESHOLD}%)" "warning"
    else
        print_status "Memory usage: ${MEMORY_USAGE}%"
    fi
    
    # Disk Usage
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    log_metric "disk_usage" "${DISK_USAGE}%"
    
    if [ ${DISK_USAGE} -gt ${DISK_THRESHOLD} ]; then
        print_error "High disk usage: ${DISK_USAGE}%"
        send_alert "High Disk Usage" "Disk usage is at ${DISK_USAGE}% (threshold: ${DISK_THRESHOLD}%)" "critical"
    else
        print_status "Disk usage: ${DISK_USAGE}%"
    fi
}

# Check PM2 processes
check_pm2_processes() {
    print_status "Checking PM2 processes..."
    
    # Check backend
    if pm2 list | grep -q "click2leads-backend.*online"; then
        print_status "Backend process is running"
        
        # Get process metrics
        BACKEND_CPU=$(pm2 info click2leads-backend | grep "CPU usage" | awk '{print $4}')
        BACKEND_MEM=$(pm2 info click2leads-backend | grep "memory usage" | awk '{print $4}')
        
        log_metric "backend_cpu" "${BACKEND_CPU}"
        log_metric "backend_memory" "${BACKEND_MEM}"
    else
        print_error "Backend process is DOWN!"
        
        # Attempt restart
        print_warning "Attempting to restart backend..."
        pm2 restart click2leads-backend
        
        if pm2 list | grep -q "click2leads-backend.*online"; then
            print_status "Backend restarted successfully"
            send_alert "Backend Restarted" "Backend was down and has been automatically restarted" "warning"
        else
            print_error "Failed to restart backend"
            send_alert "Backend Down" "Backend is down and automatic restart failed" "critical"
        fi
    fi
    
    # Check frontend (if running via PM2)
    if pm2 list | grep -q "click2leads-frontend"; then
        if pm2 list | grep -q "click2leads-frontend.*online"; then
            print_status "Frontend process is running"
        else
            print_warning "Frontend process is not running (may be served by NGINX)"
        fi
    fi
}

# Check service health
check_service_health() {
    print_status "Checking service health..."
    
    # MongoDB
    if systemctl is-active --quiet mongod; then
        print_status "MongoDB is running"
        
        # Check MongoDB connections
        MONGO_CONNECTIONS=$(mongosh --eval "db.serverStatus().connections.current" --quiet 2>/dev/null || echo "0")
        log_metric "mongodb_connections" "${MONGO_CONNECTIONS}"
    else
        print_error "MongoDB is DOWN!"
        
        # Attempt restart
        print_warning "Attempting to restart MongoDB..."
        sudo systemctl restart mongod
        
        if systemctl is-active --quiet mongod; then
            print_status "MongoDB restarted successfully"
            send_alert "MongoDB Restarted" "MongoDB was down and has been automatically restarted" "warning"
        else
            print_error "Failed to restart MongoDB"
            send_alert "MongoDB Down" "MongoDB is down and automatic restart failed" "critical"
        fi
    fi
    
    # Redis
    if systemctl is-active --quiet redis-server; then
        print_status "Redis is running"
        
        # Check Redis memory
        REDIS_MEM=$(redis-cli info memory | grep used_memory_human | cut -d: -f2 | tr -d '\r')
        log_metric "redis_memory" "${REDIS_MEM}"
    else
        print_error "Redis is DOWN!"
        
        # Attempt restart
        print_warning "Attempting to restart Redis..."
        sudo systemctl restart redis-server
        
        if systemctl is-active --quiet redis-server; then
            print_status "Redis restarted successfully"
            send_alert "Redis Restarted" "Redis was down and has been automatically restarted" "warning"
        else
            print_error "Failed to restart Redis"
            send_alert "Redis Down" "Redis is down and automatic restart failed" "critical"
        fi
    fi
    
    # NGINX
    if systemctl is-active --quiet nginx; then
        print_status "NGINX is running"
    else
        print_error "NGINX is DOWN!"
        
        # Attempt restart
        print_warning "Attempting to restart NGINX..."
        sudo systemctl restart nginx
        
        if systemctl is-active --quiet nginx; then
            print_status "NGINX restarted successfully"
            send_alert "NGINX Restarted" "NGINX was down and has been automatically restarted" "warning"
        else
            print_error "Failed to restart NGINX"
            send_alert "NGINX Down" "NGINX is down and automatic restart failed" "critical"
        fi
    fi
}

# Check API endpoints
check_api_endpoints() {
    print_status "Checking API endpoints..."
    
    # Health check endpoint
    START_TIME=$(date +%s%N)
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BACKEND_URL}/api/health || echo "000")
    END_TIME=$(date +%s%N)
    RESPONSE_TIME=$((($END_TIME - $START_TIME) / 1000000))
    
    log_metric "health_response_time_ms" "${RESPONSE_TIME}"
    log_metric "health_status_code" "${RESPONSE}"
    
    if [ "$RESPONSE" = "200" ]; then
        print_status "Health endpoint responding (${RESPONSE_TIME}ms)"
        
        if [ ${RESPONSE_TIME} -gt ${RESPONSE_TIME_THRESHOLD} ]; then
            print_warning "Slow response time: ${RESPONSE_TIME}ms"
            send_alert "Slow API Response" "Health endpoint response time is ${RESPONSE_TIME}ms (threshold: ${RESPONSE_TIME_THRESHOLD}ms)" "warning"
        fi
    else
        print_error "Health endpoint not responding (HTTP ${RESPONSE})"
        send_alert "API Health Check Failed" "Health endpoint returned HTTP ${RESPONSE}" "critical"
    fi
    
    # Check other critical endpoints
    ENDPOINTS=(
        "/api/leads"
        "/api/auth/status"
    )
    
    for endpoint in "${ENDPOINTS[@]}"; do
        RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${BACKEND_URL}${endpoint} || echo "000")
        if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "401" ] || [ "$RESPONSE" = "403" ]; then
            print_status "Endpoint ${endpoint} is accessible"
        else
            print_warning "Endpoint ${endpoint} returned HTTP ${RESPONSE}"
        fi
    done
}

# Check logs for errors
check_error_logs() {
    print_status "Checking error logs..."
    
    # Check PM2 logs for errors (last 100 lines)
    ERROR_COUNT=$(pm2 logs click2leads-backend --nostream --lines 100 2>/dev/null | grep -c "ERROR" || echo "0")
    
    if [ ${ERROR_COUNT} -gt 0 ]; then
        print_warning "Found ${ERROR_COUNT} errors in recent logs"
        log_metric "recent_errors" "${ERROR_COUNT}"
        
        # Get last few errors
        LAST_ERRORS=$(pm2 logs click2leads-backend --nostream --lines 100 2>/dev/null | grep "ERROR" | tail -3)
        
        if [ ${ERROR_COUNT} -gt 10 ]; then
            send_alert "High Error Rate" "Found ${ERROR_COUNT} errors in recent logs:\n\n${LAST_ERRORS}" "warning"
        fi
    else
        print_status "No recent errors in logs"
        log_metric "recent_errors" "0"
    fi
}

# Check SSL certificate expiry
check_ssl_certificate() {
    print_status "Checking SSL certificate..."
    
    if command -v openssl &> /dev/null; then
        # Get certificate expiry date
        CERT_EXPIRY=$(echo | openssl s_client -servername click2leads.co.uk -connect click2leads.co.uk:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | grep notAfter | cut -d= -f2)
        
        if [ -n "$CERT_EXPIRY" ]; then
            # Convert to timestamp
            EXPIRY_TIMESTAMP=$(date -d "${CERT_EXPIRY}" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "${CERT_EXPIRY}" +%s 2>/dev/null)
            CURRENT_TIMESTAMP=$(date +%s)
            DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_TIMESTAMP - $CURRENT_TIMESTAMP) / 86400 ))
            
            log_metric "ssl_days_until_expiry" "${DAYS_UNTIL_EXPIRY}"
            
            if [ ${DAYS_UNTIL_EXPIRY} -lt 7 ]; then
                print_error "SSL certificate expires in ${DAYS_UNTIL_EXPIRY} days!"
                send_alert "SSL Certificate Expiring Soon" "SSL certificate for click2leads.co.uk expires in ${DAYS_UNTIL_EXPIRY} days" "critical"
            elif [ ${DAYS_UNTIL_EXPIRY} -lt 30 ]; then
                print_warning "SSL certificate expires in ${DAYS_UNTIL_EXPIRY} days"
                send_alert "SSL Certificate Expiry Warning" "SSL certificate for click2leads.co.uk expires in ${DAYS_UNTIL_EXPIRY} days" "warning"
            else
                print_status "SSL certificate valid for ${DAYS_UNTIL_EXPIRY} days"
            fi
        else
            print_warning "Could not check SSL certificate expiry"
        fi
    fi
}

# Check database performance
check_database_performance() {
    print_status "Checking database performance..."
    
    # Check slow queries
    if command -v mongosh &> /dev/null; then
        SLOW_QUERIES=$(mongosh click2leads_production --eval "db.system.profile.find({millis:{$gt:100}}).count()" --quiet 2>/dev/null || echo "0")
        
        if [ "$SLOW_QUERIES" != "0" ] && [ ${SLOW_QUERIES} -gt 10 ]; then
            print_warning "Found ${SLOW_QUERIES} slow queries"
            send_alert "Database Slow Queries" "Found ${SLOW_QUERIES} queries taking more than 100ms" "warning"
        fi
        
        log_metric "slow_queries" "${SLOW_QUERIES}"
    fi
}

# Generate health report
generate_health_report() {
    local timestamp=$(date)
    
    REPORT="Click2Leads Health Report
=====================================
Timestamp: ${timestamp}
Overall Status: ${HEALTH_STATUS^^}

Issues Found: ${#ISSUES_FOUND[@]}
"
    
    if [ ${#ISSUES_FOUND[@]} -gt 0 ]; then
        REPORT+="\nIssues:\n"
        for issue in "${ISSUES_FOUND[@]}"; do
            REPORT+="  - ${issue}\n"
        done
    fi
    
    # Log report
    echo -e "${REPORT}" >> "${LOG_DIR}/health-reports.log"
    
    # Send summary if unhealthy
    if [ "$HEALTH_STATUS" != "healthy" ]; then
        send_alert "Health Check Failed" "${REPORT}" "critical"
    fi
}

# Main monitoring function
main() {
    echo "========================================="
    echo "Click2Leads Health Monitor"
    echo "Time: $(date)"
    echo "========================================="
    
    # Run all checks
    check_system_resources
    check_pm2_processes
    check_service_health
    check_api_endpoints
    check_error_logs
    check_ssl_certificate
    check_database_performance
    
    # Generate report
    generate_health_report
    
    echo "========================================="
    if [ "$HEALTH_STATUS" = "healthy" ]; then
        print_status "System is HEALTHY"
        exit 0
    else
        print_error "System is UNHEALTHY"
        exit 1
    fi
}

# Run main function
main "$@"
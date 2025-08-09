#!/bin/bash

# Click2Leads Production Backup Script
# Features: MongoDB backup, file backup, encryption, rotation, S3 upload (optional)

set -e

# Configuration
PROJECT_NAME="click2leads"
BACKUP_DIR="/var/backups/${PROJECT_NAME}"
PROJECT_DIR="/var/www/${PROJECT_NAME}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PREFIX="click2leads_backup"
RETENTION_DAYS=30
MAX_BACKUPS=30

# Encryption settings (update with your key)
ENCRYPTION_KEY="YOUR_ENCRYPTION_KEY_HERE"
ENCRYPT_BACKUPS=true

# Optional S3 settings (uncomment and configure if using S3)
# S3_BUCKET="s3://your-bucket/click2leads-backups"
# AWS_PROFILE="default"

# Email settings for notifications
ALERT_EMAIL="admin@click2leads.co.uk"
SEND_NOTIFICATIONS=true

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging
LOG_FILE="${BACKUP_DIR}/backup.log"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a ${LOG_FILE}
}

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
    log_message "SUCCESS: $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
    log_message "ERROR: $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
    log_message "WARNING: $1"
}

# Send email notification
send_notification() {
    local subject="$1"
    local message="$2"
    
    if [ "$SEND_NOTIFICATIONS" = true ] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "$subject" ${ALERT_EMAIL}
    fi
}

# Create backup directory if it doesn't exist
setup_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_message "Created backup directory: $BACKUP_DIR"
    fi
    
    # Create subdirectories
    mkdir -p "${BACKUP_DIR}/mongodb"
    mkdir -p "${BACKUP_DIR}/files"
    mkdir -p "${BACKUP_DIR}/configs"
    mkdir -p "${BACKUP_DIR}/logs"
}

# Backup MongoDB database
backup_mongodb() {
    print_status "Starting MongoDB backup..."
    
    MONGO_BACKUP_DIR="${BACKUP_DIR}/mongodb/mongo_${DATE}"
    
    # Read MongoDB credentials
    if [ -f "${PROJECT_DIR}/backend/.mongodb_credentials" ]; then
        source "${PROJECT_DIR}/backend/.mongodb_credentials"
        
        # Use mongodump with authentication
        mongodump \
            --uri="${MONGODB_URI}" \
            --out="${MONGO_BACKUP_DIR}" \
            --gzip \
            --quiet
        
        print_status "MongoDB backup completed"
    else
        # Fallback to no-auth dump (not recommended for production)
        mongodump \
            --db="${PROJECT_NAME}_production" \
            --out="${MONGO_BACKUP_DIR}" \
            --gzip \
            --quiet
        
        print_warning "MongoDB backed up without authentication"
    fi
    
    # Create compressed archive
    tar -czf "${BACKUP_DIR}/mongodb/mongodb_${DATE}.tar.gz" \
        -C "${BACKUP_DIR}/mongodb" \
        "mongo_${DATE}"
    
    # Clean up uncompressed dump
    rm -rf "${MONGO_BACKUP_DIR}"
    
    return 0
}

# Backup application files
backup_files() {
    print_status "Starting file backup..."
    
    # Create file backup
    tar -czf "${BACKUP_DIR}/files/files_${DATE}.tar.gz" \
        --exclude="node_modules" \
        --exclude=".git" \
        --exclude="*.log" \
        --exclude="*.tmp" \
        --exclude=".env.local" \
        -C "${PROJECT_DIR}" \
        backend \
        frontend/build \
        uploads \
        nginx \
        scripts
    
    print_status "File backup completed"
    return 0
}

# Backup configuration files
backup_configs() {
    print_status "Backing up configuration files..."
    
    CONFIG_BACKUP="${BACKUP_DIR}/configs/configs_${DATE}"
    mkdir -p "${CONFIG_BACKUP}"
    
    # Copy important config files
    [ -f "${PROJECT_DIR}/ecosystem.config.js" ] && cp "${PROJECT_DIR}/ecosystem.config.js" "${CONFIG_BACKUP}/"
    [ -f "${PROJECT_DIR}/backend/.env.production" ] && cp "${PROJECT_DIR}/backend/.env.production" "${CONFIG_BACKUP}/"
    [ -f "/etc/nginx/sites-available/${PROJECT_NAME}.conf" ] && cp "/etc/nginx/sites-available/${PROJECT_NAME}.conf" "${CONFIG_BACKUP}/"
    [ -f "/etc/logrotate.d/${PROJECT_NAME}" ] && cp "/etc/logrotate.d/${PROJECT_NAME}" "${CONFIG_BACKUP}/"
    
    # Compress configs
    tar -czf "${BACKUP_DIR}/configs/configs_${DATE}.tar.gz" \
        -C "${BACKUP_DIR}/configs" \
        "configs_${DATE}"
    
    # Clean up
    rm -rf "${CONFIG_BACKUP}"
    
    print_status "Configuration backup completed"
    return 0
}

# Create master backup archive
create_master_backup() {
    print_status "Creating master backup archive..."
    
    MASTER_BACKUP="${BACKUP_DIR}/${BACKUP_PREFIX}_${DATE}.tar.gz"
    
    # Create master archive containing all backups
    tar -czf "${MASTER_BACKUP}" \
        -C "${BACKUP_DIR}" \
        "mongodb/mongodb_${DATE}.tar.gz" \
        "files/files_${DATE}.tar.gz" \
        "configs/configs_${DATE}.tar.gz"
    
    # Calculate backup size
    BACKUP_SIZE=$(du -h "${MASTER_BACKUP}" | cut -f1)
    
    print_status "Master backup created: ${MASTER_BACKUP} (${BACKUP_SIZE})"
    
    # Clean up individual backup files
    rm -f "${BACKUP_DIR}/mongodb/mongodb_${DATE}.tar.gz"
    rm -f "${BACKUP_DIR}/files/files_${DATE}.tar.gz"
    rm -f "${BACKUP_DIR}/configs/configs_${DATE}.tar.gz"
    
    echo "${MASTER_BACKUP}"
}

# Encrypt backup file
encrypt_backup() {
    local backup_file="$1"
    
    if [ "$ENCRYPT_BACKUPS" = true ]; then
        print_status "Encrypting backup..."
        
        # Encrypt using OpenSSL
        openssl enc -aes-256-cbc \
            -salt \
            -in "${backup_file}" \
            -out "${backup_file}.enc" \
            -pass pass:"${ENCRYPTION_KEY}"
        
        # Remove unencrypted backup
        rm -f "${backup_file}"
        
        # Rename encrypted file to original name
        mv "${backup_file}.enc" "${backup_file}"
        
        print_status "Backup encrypted successfully"
    fi
}

# Upload to S3 (optional)
upload_to_s3() {
    local backup_file="$1"
    
    if [ -n "${S3_BUCKET}" ] && command -v aws &> /dev/null; then
        print_status "Uploading backup to S3..."
        
        aws s3 cp "${backup_file}" "${S3_BUCKET}/" \
            --profile "${AWS_PROFILE}" \
            --storage-class STANDARD_IA
        
        if [ $? -eq 0 ]; then
            print_status "Backup uploaded to S3 successfully"
        else
            print_error "Failed to upload backup to S3"
        fi
    fi
}

# Rotate old backups
rotate_backups() {
    print_status "Rotating old backups..."
    
    # Count current backups
    BACKUP_COUNT=$(find "${BACKUP_DIR}" -name "${BACKUP_PREFIX}_*.tar.gz" -type f | wc -l)
    
    # Remove old backups by date
    find "${BACKUP_DIR}" -name "${BACKUP_PREFIX}_*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete
    
    # Keep only MAX_BACKUPS most recent
    if [ ${BACKUP_COUNT} -gt ${MAX_BACKUPS} ]; then
        ls -t "${BACKUP_DIR}"/${BACKUP_PREFIX}_*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f
    fi
    
    print_status "Old backups rotated"
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    print_status "Verifying backup integrity..."
    
    # Test if archive is valid
    if tar -tzf "${backup_file}" > /dev/null 2>&1; then
        print_status "Backup integrity verified"
        return 0
    else
        print_error "Backup integrity check failed!"
        return 1
    fi
}

# Generate backup report
generate_report() {
    local backup_file="$1"
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Get backup details
    local backup_size=$(du -h "${backup_file}" | cut -f1)
    local backup_count=$(find "${BACKUP_DIR}" -name "${BACKUP_PREFIX}_*.tar.gz" -type f | wc -l)
    
    # Create report
    local report="Click2Leads Backup Report
=====================================
Date: $(date)
Backup File: $(basename ${backup_file})
Size: ${backup_size}
Duration: ${duration} seconds
Total Backups: ${backup_count}
Retention: ${RETENTION_DAYS} days
Encrypted: ${ENCRYPT_BACKUPS}
"
    
    # Add to log
    echo "${report}" >> "${LOG_FILE}"
    
    # Send notification
    if [ "$SEND_NOTIFICATIONS" = true ]; then
        send_notification "Click2Leads Backup Completed" "${report}"
    fi
    
    print_status "Backup report generated"
}

# Cleanup function
cleanup() {
    print_warning "Cleaning up temporary files..."
    
    # Remove any temporary files
    rm -rf "${BACKUP_DIR}/mongodb/mongo_${DATE}" 2>/dev/null || true
    rm -rf "${BACKUP_DIR}/configs/configs_${DATE}" 2>/dev/null || true
    
    log_message "Cleanup completed"
}

# Error handler
handle_error() {
    local exit_code=$?
    print_error "Backup failed with exit code: ${exit_code}"
    
    # Send error notification
    send_notification "Click2Leads Backup Failed" \
        "Backup failed at $(date) with exit code ${exit_code}. Check ${LOG_FILE} for details."
    
    # Cleanup
    cleanup
    
    exit ${exit_code}
}

# Main backup function
main() {
    # Start timer
    start_time=$(date +%s)
    
    # Set error handler
    trap handle_error ERR
    
    log_message "========================================="
    log_message "Starting Click2Leads backup process"
    
    # Setup
    setup_backup_dir
    
    # Perform backups
    backup_mongodb
    backup_files
    backup_configs
    
    # Create master backup
    MASTER_BACKUP=$(create_master_backup)
    
    # Encrypt if enabled
    encrypt_backup "${MASTER_BACKUP}"
    
    # Verify backup
    verify_backup "${MASTER_BACKUP}"
    
    # Upload to S3 if configured
    upload_to_s3 "${MASTER_BACKUP}"
    
    # Rotate old backups
    rotate_backups
    
    # Generate report
    generate_report "${MASTER_BACKUP}"
    
    # Cleanup
    cleanup
    
    log_message "Backup process completed successfully"
    log_message "========================================="
    
    print_status "Backup completed successfully!"
}

# Run main function
main "$@"
#!/bin/bash

# MongoDB Setup Script for Click2Leads
# This script creates an isolated MongoDB database and user for Click2Leads

set -e

# Configuration
DB_NAME="click2leads_production"
DB_USER="click2leads_user"
DB_ADMIN="admin"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Generate secure password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# Check if MongoDB is running
check_mongodb() {
    if ! systemctl is-active --quiet mongod; then
        print_error "MongoDB is not running. Starting MongoDB..."
        sudo systemctl start mongod
        sleep 2
    fi
    print_status "MongoDB is running"
}

# Create database and user
setup_database() {
    print_status "Setting up Click2Leads database..."
    
    # Generate password
    DB_PASSWORD=$(generate_password)
    
    # Create MongoDB script
    cat > /tmp/click2leads_mongo_setup.js << EOF
// Switch to admin database
use admin

// Check if user already exists
var userExists = db.getUser("${DB_USER}");
if (userExists) {
    print("User ${DB_USER} already exists. Updating password...");
    db.changeUserPassword("${DB_USER}", "${DB_PASSWORD}");
} else {
    print("Creating user ${DB_USER}...");
    db.createUser({
        user: "${DB_USER}",
        pwd: "${DB_PASSWORD}",
        roles: [
            { role: "readWrite", db: "${DB_NAME}" },
            { role: "dbAdmin", db: "${DB_NAME}" }
        ]
    });
}

// Switch to Click2Leads database
use ${DB_NAME}

// Create collections with indexes
db.createCollection("users");
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

db.createCollection("leads");
db.leads.createIndex({ email: 1 });
db.leads.createIndex({ createdAt: -1 });
db.leads.createIndex({ status: 1 });
db.leads.createIndex({ ipAddress: 1 });

db.createCollection("field_captures");
db.field_captures.createIndex({ visitorId: 1 });
db.field_captures.createIndex({ formType: 1 });
db.field_captures.createIndex({ timestamp: -1 });

db.createCollection("sessions");
db.sessions.createIndex({ "expires": 1 }, { expireAfterSeconds: 0 });

db.createCollection("analytics");
db.analytics.createIndex({ eventType: 1 });
db.analytics.createIndex({ timestamp: -1 });
db.analytics.createIndex({ visitorId: 1 });

print("Database ${DB_NAME} setup completed");
print("Collections created with indexes");
EOF

    # Execute MongoDB script
    mongosh < /tmp/click2leads_mongo_setup.js
    
    # Clean up
    rm /tmp/click2leads_mongo_setup.js
    
    # Save credentials
    CREDENTIALS_FILE="/var/www/click2leads/backend/.mongodb_credentials"
    cat > ${CREDENTIALS_FILE} << EOF
# MongoDB Credentials for Click2Leads
# Generated on $(date)
# KEEP THIS FILE SECURE!

DATABASE_NAME=${DB_NAME}
DATABASE_USER=${DB_USER}
DATABASE_PASSWORD=${DB_PASSWORD}

# Connection String for .env.production:
MONGODB_URI=mongodb://${DB_USER}:${DB_PASSWORD}@localhost:27017/${DB_NAME}?authSource=admin

# Connection String with options:
MONGODB_URI_FULL=mongodb://${DB_USER}:${DB_PASSWORD}@localhost:27017/${DB_NAME}?authSource=admin&retryWrites=true&w=majority
EOF

    # Secure the credentials file
    chmod 600 ${CREDENTIALS_FILE}
    
    print_status "Database setup completed"
    print_warning "Credentials saved to: ${CREDENTIALS_FILE}"
    print_warning "Add the MONGODB_URI to your .env.production file"
}

# Create backup user (optional)
create_backup_user() {
    print_status "Creating backup user..."
    
    BACKUP_USER="click2leads_backup"
    BACKUP_PASSWORD=$(generate_password)
    
    cat > /tmp/backup_user.js << EOF
use admin
db.createUser({
    user: "${BACKUP_USER}",
    pwd: "${BACKUP_PASSWORD}",
    roles: [
        { role: "backup", db: "admin" },
        { role: "restore", db: "admin" },
        { role: "read", db: "${DB_NAME}" }
    ]
});
EOF

    mongosh < /tmp/backup_user.js
    rm /tmp/backup_user.js
    
    # Append backup credentials
    cat >> ${CREDENTIALS_FILE} << EOF

# Backup User Credentials:
BACKUP_USER=${BACKUP_USER}
BACKUP_PASSWORD=${BACKUP_PASSWORD}
BACKUP_CONNECTION=mongodb://${BACKUP_USER}:${BACKUP_PASSWORD}@localhost:27017/admin
EOF

    print_status "Backup user created"
}

# Setup MongoDB security
setup_security() {
    print_status "Configuring MongoDB security..."
    
    # Enable authentication if not already enabled
    MONGOD_CONF="/etc/mongod.conf"
    
    if ! grep -q "authorization: enabled" ${MONGOD_CONF}; then
        print_warning "Enabling MongoDB authentication..."
        
        # Backup original config
        sudo cp ${MONGOD_CONF} ${MONGOD_CONF}.backup
        
        # Enable auth
        sudo sed -i '/^#security:/a security:\n  authorization: enabled' ${MONGOD_CONF}
        
        # Restart MongoDB
        sudo systemctl restart mongod
        
        print_status "MongoDB authentication enabled"
    else
        print_warning "MongoDB authentication already enabled"
    fi
}

# Test connection
test_connection() {
    print_status "Testing database connection..."
    
    # Read credentials
    source ${CREDENTIALS_FILE}
    
    # Test connection
    if mongosh "${MONGODB_URI}" --eval "db.runCommand({ ping: 1 })" > /dev/null 2>&1; then
        print_status "Connection successful!"
    else
        print_error "Connection failed. Please check credentials."
        exit 1
    fi
}

# Create initial admin user for the application
create_app_admin() {
    print_status "Creating application admin user..."
    
    # Generate admin password
    ADMIN_PASSWORD=$(generate_password)
    
    # Hash password using Node.js bcrypt
    HASHED_PASSWORD=$(node -e "
        const bcrypt = require('bcryptjs');
        const password = '${ADMIN_PASSWORD}';
        const hash = bcrypt.hashSync(password, 12);
        console.log(hash);
    " 2>/dev/null)
    
    if [ -z "$HASHED_PASSWORD" ]; then
        print_warning "bcryptjs not installed. Skipping admin user creation."
        print_warning "Install with: npm install -g bcryptjs"
        return
    fi
    
    # Create admin user in MongoDB
    cat > /tmp/create_admin.js << EOF
use ${DB_NAME}
db.users.insertOne({
    name: "Admin",
    email: "admin@click2leads.co.uk",
    password: "${HASHED_PASSWORD}",
    role: "admin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
});
print("Admin user created");
EOF

    source ${CREDENTIALS_FILE}
    mongosh "${MONGODB_URI}" < /tmp/create_admin.js
    rm /tmp/create_admin.js
    
    # Save admin credentials
    cat >> ${CREDENTIALS_FILE} << EOF

# Application Admin User:
ADMIN_EMAIL=admin@click2leads.co.uk
ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOF

    print_status "Admin user created"
    print_warning "Admin email: admin@click2leads.co.uk"
    print_warning "Admin password: ${ADMIN_PASSWORD}"
}

# Main function
main() {
    print_status "Starting MongoDB setup for Click2Leads..."
    
    check_mongodb
    setup_database
    create_backup_user
    setup_security
    test_connection
    
    # Optional: Create admin user
    read -p "Create application admin user? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        create_app_admin
    fi
    
    print_status "MongoDB setup completed successfully!"
    print_warning "Remember to:"
    echo "  1. Copy MONGODB_URI to your .env.production file"
    echo "  2. Keep credentials file secure"
    echo "  3. Setup regular backups"
    echo "  4. Monitor database performance"
}

# Run main function
main "$@"
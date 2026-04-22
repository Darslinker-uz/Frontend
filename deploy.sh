#!/bin/bash
# =============================================================
# Darslinker.uz Deployment Script
# Run this on your Linux server after initial setup
# Usage: ./deploy.sh
# =============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Darslinker.uz Deploy Script${NC}"
echo "================================"

# Configuration
APP_DIR="/var/www/darslinker"
UPLOADS_DIR="/var/darslinker/uploads"
LOG_DIR="/var/log/darslinker"
REPO_URL="https://github.com/YOUR_USERNAME/darslinker.git"  # O'zgartiring!
BRANCH="main"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root (sudo ./deploy.sh)${NC}"
    exit 1
fi

# Function: First time setup
first_time_setup() {
    echo -e "${YELLOW}📦 First time setup...${NC}"
    
    # Create directories
    mkdir -p $APP_DIR
    mkdir -p $UPLOADS_DIR
    mkdir -p $LOG_DIR
    mkdir -p /var/www/certbot
    
    # Set permissions
    chown -R www-data:www-data $UPLOADS_DIR
    chmod 755 $UPLOADS_DIR
    
    # Clone repository
    if [ ! -d "$APP_DIR/.git" ]; then
        echo "Cloning repository..."
        git clone $REPO_URL $APP_DIR
    fi
    
    # Install Node.js 20 if not present
    if ! command -v node &> /dev/null; then
        echo "Installing Node.js 20..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    
    # Install PM2 globally
    if ! command -v pm2 &> /dev/null; then
        echo "Installing PM2..."
        npm install -g pm2
    fi
    
    # Install Nginx
    if ! command -v nginx &> /dev/null; then
        echo "Installing Nginx..."
        apt-get update
        apt-get install -y nginx
    fi
    
    # Copy nginx config
    cp $APP_DIR/nginx.conf /etc/nginx/sites-available/darslinker
    ln -sf /etc/nginx/sites-available/darslinker /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx config
    nginx -t
    
    echo -e "${GREEN}✅ First time setup complete${NC}"
    echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
    echo "1. Copy .env.example to .env and fill in values"
    echo "2. Run: certbot --nginx -d darslinker.uz -d www.darslinker.uz"
    echo "3. Set up PostgreSQL database"
}

# Function: Deploy/Update
deploy() {
    echo -e "${YELLOW}📥 Pulling latest code...${NC}"
    cd $APP_DIR
    
    # Pull latest changes
    git fetch origin
    git reset --hard origin/$BRANCH
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm ci --production=false
    
    # Generate Prisma client
    echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
    npx prisma generate
    
    # Run migrations
    echo -e "${YELLOW}🗃️  Running database migrations...${NC}"
    npx prisma migrate deploy
    
    # Build application
    echo -e "${YELLOW}🔨 Building application...${NC}"
    npm run build
    
    # Restart application with PM2
    echo -e "${YELLOW}🔄 Restarting application...${NC}"
    pm2 restart ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
    
    # Save PM2 process list
    pm2 save
    
    # Setup PM2 startup script (run once)
    pm2 startup systemd -u root --hp /root 2>/dev/null || true
    
    # Reload nginx
    echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
    nginx -t && systemctl reload nginx
    
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    echo ""
    echo "Useful commands:"
    echo "  pm2 logs darslinker     - View logs"
    echo "  pm2 status              - Check status"
    echo "  pm2 restart darslinker  - Restart app"
}

# Function: Setup SSL
setup_ssl() {
    echo -e "${YELLOW}🔐 Setting up SSL with Let's Encrypt...${NC}"
    
    # Install certbot
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    
    # Get certificate
    certbot --nginx -d darslinker.uz -d www.darslinker.uz
    
    # Setup auto-renewal
    systemctl enable certbot.timer
    systemctl start certbot.timer
    
    echo -e "${GREEN}✅ SSL setup complete!${NC}"
}

# Function: Setup PostgreSQL
setup_postgres() {
    echo -e "${YELLOW}🐘 Setting up PostgreSQL...${NC}"
    
    # Install PostgreSQL
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    
    # Start and enable
    systemctl start postgresql
    systemctl enable postgresql
    
    echo -e "${GREEN}✅ PostgreSQL installed!${NC}"
    echo ""
    echo "Now run these commands to create database:"
    echo "  sudo -u postgres psql"
    echo "  CREATE USER darslinker WITH PASSWORD 'your_secure_password';"
    echo "  CREATE DATABASE darslinker OWNER darslinker;"
    echo "  \\q"
}

# Function: Set Telegram Webhook
setup_webhook() {
    echo -e "${YELLOW}🤖 Setting up Telegram webhook...${NC}"
    cd $APP_DIR
    npm run webhook:set
    echo -e "${GREEN}✅ Webhook setup complete!${NC}"
}

# Main menu
case "${1:-deploy}" in
    setup)
        first_time_setup
        ;;
    deploy)
        deploy
        ;;
    ssl)
        setup_ssl
        ;;
    postgres)
        setup_postgres
        ;;
    webhook)
        setup_webhook
        ;;
    full)
        first_time_setup
        setup_postgres
        echo -e "${YELLOW}⚠️  Please configure .env and database, then run: ./deploy.sh ssl && ./deploy.sh deploy${NC}"
        ;;
    *)
        echo "Usage: $0 {setup|deploy|ssl|postgres|webhook|full}"
        echo ""
        echo "Commands:"
        echo "  setup    - First time server setup"
        echo "  deploy   - Pull and deploy latest code"
        echo "  ssl      - Setup Let's Encrypt SSL"
        echo "  postgres - Install PostgreSQL"
        echo "  webhook  - Set Telegram webhook"
        echo "  full     - Complete first-time setup"
        exit 1
        ;;
esac

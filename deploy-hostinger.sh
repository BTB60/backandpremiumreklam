#!/bin/bash
# Hostinger VPS Deployment Script for Premium Reklam
# Usage: bash deploy-hostinger.sh [domain_name] [email_for_ssl]

set -e

# Rəng kodu istifadə edin
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Hostinger VPS Deployment Script ===${NC}\n"

# Parama istifadəçilərin girişindən alın
DOMAIN="${1:-premiumreklam.shop}"
EMAIL="${2:-admin@premiumreklam.shop}"
APP_DIR="/home/premiumreklam/apps/backandpremiumreklam"
REPO_URL="https://github.com/BTB60/backandpremiumreklam.git"

echo -e "${YELLOW}Domain: $DOMAIN${NC}"
echo -e "${YELLOW}Email (SSL): $EMAIL${NC}\n"

# Addım 1: Sistemi yenilə
echo -e "${YELLOW}[1/10] Sistem yenilənir...${NC}"
sudo apt update
sudo apt upgrade -y

# Addım 2: Əsas paketlər
echo -e "${YELLOW}[2/10] Əsas paketlər qurulur...${NC}"
sudo apt install -y git curl build-essential nginx certbot python3-certbot-nginx

# Addım 3: Node.js 20 LTS
echo -e "${YELLOW}[3/10] Node.js 20 LTS qurulur...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Addım 4: PM2
echo -e "${YELLOW}[4/10] PM2 qurulur...${NC}"
sudo npm install -g pm2

# Addım 5: Repo klonla
echo -e "${YELLOW}[5/10] Repo klonlanır...${NC}"
mkdir -p /home/premiumreklam/apps
cd /home/premiumreklam/apps
if [ -d "backandpremiumreklam" ]; then
  cd backandpremiumreklam
  git pull origin main || true
else
  git clone $REPO_URL
  cd backandpremiumreklam
fi

# Addım 6: .env faylı
echo -e "${YELLOW}[6/10] .env faylı hazırlanır...${NC}"
if [ ! -f ".env.production" ]; then
  if [ -f "deploy/frontend.env.example" ]; then
    cp deploy/frontend.env.example .env.production
  else
    cat > .env.production << EOF
NEXT_PUBLIC_BASE_URL=https://$DOMAIN
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
NODE_ENV=production
EOF
  fi
fi

# Addım 7: Asılılıqlar
echo -e "${YELLOW}[7/10] npm paketləri qurulur...${NC}"
npm ci --production 2>/dev/null || npm install --production

# Addım 8: Build
echo -e "${YELLOW}[8/10] Layihə build edilir...${NC}"
npm run build || echo -e "${RED}Build uyarısı (ignorance mövcud olabilər)${NC}"

# Addım 9: PM2 start
echo -e "${YELLOW}[9/10] PM2 ilə app start edilir...${NC}"
pm2 stop premium-frontend 2>/dev/null || true
pm2 start npm --name "premium-frontend" -- start
pm2 save
sudo pm2 startup systemd -u premiumreklam --hp /home/premiumreklam

# Addım 10: Nginx + SSL
echo -e "${YELLOW}[10/10] Nginx + SSL qurulur...${NC}"

# Nginx konfig
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# SSL Sertifikat
echo -e "${YELLOW}Let's Encrypt SSL qurulur (bu biraz vaxt tuta biləcək)...${NC}"
sudo certbot --nginx --non-interactive --agree-tos --email $EMAIL -d $DOMAIN -d www.$DOMAIN 2>/dev/null || \
  echo -e "${YELLOW}SSL quruluşu tamamlanmadı - manuali qurmaq lazım ola biləcək.${NC}"

# Yoxlama
echo -e "\n${GREEN}=== Deployment Tamamlandı ===${NC}\n"
echo "Domain: https://$DOMAIN"
echo "App Status:"
pm2 status
echo -e "\nNginx status:"
sudo systemctl status nginx --no-pager | head -5

echo -e "\n${GREEN}Sınama: https://$DOMAIN${NC}"
echo -e "${YELLOW}Əgər 502 hata varsa, logları yoxlayın:${NC}"
echo "pm2 logs premium-frontend --lines 100"

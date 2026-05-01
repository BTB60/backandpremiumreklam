# Hostinger VPS Deployment Script (Windows PowerShell)
# Açıqlama: Bu skript Hostinger Panelində terminal üçün əmrləri hazırlayıb panoya kopyalayır

Write-Host "=== Hostinger VPS Deployment Helper ===" -ForegroundColor Green
Write-Host ""

# İstifadəçi girişi
$domain = Read-Host "Domain adı daxil edin (default: premiumreklam.shop)"
if ([string]::IsNullOrWhiteSpace($domain)) { $domain = "premiumreklam.shop" }

$email = Read-Host "SSL üçün e-poçt daxil edin (default: admin@premiumreklam.shop)"
if ([string]::IsNullOrWhiteSpace($email)) { $email = "admin@premiumreklam.shop" }

Write-Host ""
Write-Host "Seçim edin:" -ForegroundColor Yellow
Write-Host "1. Adım-adım təlimatı göstər (hər əmri manual kopyalamaq üçün)"
Write-Host "2. Avtomatik skripti panoya kopyala (bir dəfə yapışdır)"
$choice = Read-Host "Seçim (1 və ya 2)"

if ($choice -eq "2") {
  $script = @"
#!/bin/bash
set -e
echo '=== Hostinger VPS Deployment ==='
echo 'Domain: $domain'
echo 'Email: $email'
echo ''

# 1. Sistem yenilə
echo '[1/10] System updating...'
sudo apt update && sudo apt upgrade -y

# 2. Əsas paketlər
echo '[2/10] Installing essential packages...'
sudo apt install -y git curl build-essential nginx certbot python3-certbot-nginx

# 3. Node.js 20
echo '[3/10] Installing Node.js 20 LTS...'
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. PM2
echo '[4/10] Installing PM2...'
sudo npm install -g pm2

# 5. Repo klonla
echo '[5/10] Cloning repository...'
mkdir -p /home/premiumreklam/apps
cd /home/premiumreklam/apps
if [ -d 'backandpremiumreklam' ]; then
  cd backandpremiumreklam && git pull origin main || true
else
  git clone https://github.com/BTB60/backandpremiumreklam.git
  cd backandpremiumreklam
fi

# 6. .env prepare
echo '[6/10] Setting up environment...'
if [ ! -f '.env.production' ]; then
  [ -f 'deploy/frontend.env.example' ] && cp deploy/frontend.env.example .env.production || \
  cat > .env.production << 'EOL'
NEXT_PUBLIC_BASE_URL=https://$domain
NEXT_PUBLIC_API_URL=https://$domain/api
NODE_ENV=production
EOL
fi

# 7. npm install
echo '[7/10] Installing dependencies...'
npm ci --production || npm install --production

# 8. Build
echo '[8/10] Building project...'
npm run build || true

# 9. PM2 start
echo '[9/10] Starting with PM2...'
pm2 stop premium-frontend 2>/dev/null || true
pm2 start npm --name 'premium-frontend' -- start
pm2 save
sudo pm2 startup systemd -u premiumreklam --hp /home/premiumreklam

# 10. Nginx + SSL
echo '[10/10] Configuring Nginx + SSL...'
sudo tee /etc/nginx/sites-available/$domain > /dev/null << 'NGINX'
server {
    listen 80;
    server_name $domain www.$domain;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/$domain /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo 'Installing SSL certificate...'
sudo certbot --nginx --non-interactive --agree-tos --email $email -d $domain -d www.$domain 2>/dev/null || \
  echo 'SSL setup completed. Check status if needed.'

echo ''
echo '=== Deployment Complete ==='
echo "Website: https://$domain"
pm2 status
echo ''
echo 'Check logs: pm2 logs premium-frontend --lines 100'
"@
  
  $script | Set-Clipboard
  Write-Host "✅ Avtomatik skript panoya kopyalandı!" -ForegroundColor Green
  Write-Host ""
  Write-Host "İndi:" -ForegroundColor Yellow
  Write-Host "1. Hostinger panelini açın"
  Write-Host "2. VPS → Terminal"
  Write-Host "3. Aşağıdakı əmri yapışdırın:"
  Write-Host ""
  Write-Host "bash <(curl -s https://raw.githubusercontent.com/BTB60/backandpremiumreklam/main/deploy-hostinger.sh) $domain $email" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Və ya panoya kopyalanmış skripti birbaşa yapışdırın."
  
} else {
  # Adım-adım göstəriş
  Write-Host ""
  Write-Host "Hostinger Terminali Əmrləri (Adım-Adım)" -ForegroundColor Green
  Write-Host "Hər əmri kopyalayıb terminal-da yapışdırın:" -ForegroundColor Yellow
  Write-Host ""
  
  $commands = @(
    @("1. Sistemi Yenilə", "sudo apt update && sudo apt upgrade -y"),
    @("2. Əsas Paketlər", "sudo apt install -y git curl build-essential nginx certbot python3-certbot-nginx"),
    @("3. Node.js 20", "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"),
    @("4. PM2", "sudo npm install -g pm2"),
    @("5. Repo Klonla", "mkdir -p /home/premiumreklam/apps && cd /home/premiumreklam/apps && git clone https://github.com/BTB60/backandpremiumreklam.git && cd backandpremiumreklam"),
    @("6. .env Hazırla", "cp deploy/frontend.env.example .env.production && nano .env.production"),
    @("7. npm Install", "npm ci --production || npm install --production"),
    @("8. Build", "npm run build"),
    @("9. PM2 Start", "pm2 start npm --name 'premium-frontend' -- start && pm2 save && sudo pm2 startup systemd -u premiumreklam --hp /home/premiumreklam"),
    @("10a. Nginx Konfig", "sudo tee /etc/nginx/sites-available/$domain > /dev/null << 'EOF'`nserver {`n    listen 80;`n    server_name $domain www.$domain;`n    location / {`n        proxy_pass http://localhost:3000;`n        proxy_http_version 1.1;`n        proxy_set_header Upgrade `$http_upgrade;`n        proxy_set_header Connection 'upgrade';`n        proxy_set_header Host `$host;`n        proxy_set_header X-Real-IP `$remote_addr;`n        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;`n        proxy_set_header X-Forwarded-Proto `$scheme;`n    }`n}`nEOF"),
    @("10b. Nginx Aktiv Et", "sudo ln -sf /etc/nginx/sites-available/$domain /etc/nginx/sites-enabled/ && sudo rm -f /etc/nginx/sites-enabled/default && sudo nginx -t && sudo systemctl restart nginx"),
    @("10c. SSL Qur", "sudo certbot --nginx --non-interactive --agree-tos --email $email -d $domain -d www.$domain")
  )
  
  foreach ($cmd in $commands) {
    Write-Host ""
    Write-Host $cmd[0] -ForegroundColor Cyan
    Write-Host $cmd[1] -ForegroundColor White
    Write-Host ""
    $cmd[1] | Set-Clipboard
    Write-Host "✓ Panoya kopyalandı. Terminal-da yapışdırın (Shift+Insert və ya sağ klik)." -ForegroundColor Green
    $pause = Read-Host "Tamamlandıqdan sonra Enter basın"
  }
  
  Write-Host ""
  Write-Host "=== Sınama ===" -ForegroundColor Green
  Write-Host "https://$domain"
}

Write-Host ""
Write-Host "Xəta varsa, qeydiyyat yoxlayın:" -ForegroundColor Yellow
Write-Host "pm2 logs premium-frontend --lines 200"

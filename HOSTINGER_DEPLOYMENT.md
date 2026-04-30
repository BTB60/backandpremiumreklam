# Hostinger VPS Deployment Guide

Bu sənəd **premiumreklam@srv1630215** üçün Hostinger VPS-ə layihəni yerləşdirmə qaydası təsvir edir.

---

## **Seçim 1: Hostinger Paneli (Web Terminal) — EN ASA**

### Addım 1: Hostinger Panelində Terminal Açın
1. https://hpanel.hostinger.com/-ə daxil olun
2. VPS-inizi seçin
3. **Terminal** tabına keçin (və ya **Advanced** → **Terminal** axtarın)

### Addım 2: Deployment Skriptini Kopyalayıb Yapışdırın

Aşağıdakı əmri **browser terminalında** birbaşa kopyalayıb yapışdırın:

```bash
bash <(curl -s https://raw.githubusercontent.com/BTB60/backandpremiumreklam/main/deploy.sh)
```

**Əgər bu işləməzsə**, lokal skripti istifadə edin:

### Addım 3: Adım-Adım Terminal Əmrləri

Terminal-da aşağıdakı əmrləri **bir-bir** kopyalayıb yapışdırın (hər birinin bitməsini gözləyin):

```bash
# 1. Sistemi yenilə
sudo apt update && sudo apt upgrade -y
```

Tamamlandıqdan sonra (⏳ 2-5 dəqiqə):

```bash
# 2. Əsas paketləri qur
sudo apt install -y git curl build-essential nginx certbot python3-certbot-nginx
```

Tamamlandıqdan sonra:

```bash
# 3. Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

```bash
# 4. PM2
sudo npm install -g pm2
pm2 -v
```

```bash
# 5. Qovluq yaradıb Repo klonla
mkdir -p /home/premiumreklam/apps
cd /home/premiumreklam/apps
git clone https://github.com/BTB60/backandpremiumreklam.git
cd backandpremiumreklam
```

```bash
# 6. Ətraf mühit faylı kopyala
cp deploy/frontend.env.example .env.production
cat .env.production
```

**Çıxış edən dəyərləri Notepad-ə kopyalayıb öz dəyərlərinizlə əvəz edin**, sonra:

```bash
# Redaktə etmək üçün
nano .env.production
```

- Mühüm dəyərləri düzənləyin (domain, API URLs, və s.)
- Saxlamaq: **Ctrl+O** → **Enter** → **Ctrl+X**

```bash
# 7. Asılılıqlar və build
npm ci --production
npm run build
```

```bash
# 8. PM2 ilə start et
pm2 start npm --name "premium-frontend" -- start
pm2 status
```

Çıxışda `online` görünsə, uğurludur! ✅

```bash
# 9. PM2 sürəkli qur (reboota davamlı)
pm2 save
sudo pm2 startup systemd -u premiumreklam --hp /home/premiumreklam
```

---

## **Addım 4: Nginx + SSL Qurulması**

Terminala davam edin:

```bash
# Nginx konfig faylı yaradın (domain adınızla əvəz edin)
sudo nano /etc/nginx/sites-available/premiumreklam.shop
```

Aşağıdakını yapışdırın:

```nginx
server {
    listen 80;
    server_name premiumreklam.shop www.premiumreklam.shop;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Saxlayın: **Ctrl+O** → **Enter** → **Ctrl+X**

```bash
# Enablelə
sudo ln -s /etc/nginx/sites-available/premiumreklam.shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**SSL Sertifikatı (Let's Encrypt):**

```bash
sudo certbot --nginx -d premiumreklam.shop -d www.premiumreklam.shop
```

- E-poçt daxil edin
- Şərtləri qəbul edin (`y`)
- HTTPS redirect-i aktiv edin (`y`)

---

## **Addım 5: Hazır, Sına!**

Tarayıcı açıb gidin: **https://premiumreklam.shop**

Əgər "502 Bad Gateway" görünsə:
```bash
pm2 logs premium-frontend --lines 100
```

Xətaları yazıb mənə göndərin — kömək edəcəyəm.

---

## **Vacib: Firewall**

Hostinger panelində firewall ayarlarını yoxlayıb 80, 443 portlarının açıq olduğunu təsdiqləyin.

---

## **Problemləşmə**

| Problem | Həll |
|---------|------|
| Port 3000 already in use | `lsof -i :3000` və `kill -9 <PID>` |
| Permission denied | `sudo chown -R premiumreklam:premiumreklam /home/premiumreklam/apps` |
| npm build fails | `npm ci --legacy-peer-deps` icra edin |
| SSL certificate error | `sudo systemctl restart nginx && sudo certbot renew --dry-run` |

---

## **Avtomatik Backup**

Hostinger panelində **VPS** → **Backups** qurub həftəlik backupları aktivlə.

---

## **Suallar?**

Xəta çıxarsa, terminaldakı mesajı kopyalayıb mənə yazın!

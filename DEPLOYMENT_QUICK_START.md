# Premium Reklam Hostinger VPS Deployment

Hostinger-ə tez və asan deployment üçün 3 fərqli seçim mövcuddur.

---

## **⚡ EN SURATLI YOLU (1 dəqiqə)**

Hostinger Panel Terminali açın və bu bir əmri yapışdırın:

```bash
bash <(curl -s https://raw.githubusercontent.com/BTB60/backandpremiumreklam/main/deploy-hostinger.sh) premiumreklam.shop admin@premiumreklam.shop
```

Hətta - **deployment tamamlanır** ✅

---

## **📋 Seçim 1: Adım-Adım Təlimat (Başlayanlar üçün)**

Faylı açın: **HOSTINGER_DEPLOYMENT.md**

- Her addım izah edilir
- Hər əmri manual kopyalamaq üçün
- Ən anlaşılı metoddur

---

## **🔧 Seçim 2: Windows PowerShell Köməkçi**

Yerli maşında (`C:\Users\Lenovo`) PowerShell açıb işə salın:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\deploy-hostinger.ps1
```

Skript:
1. Sizi domainə və e-poçta soruşacaq
2. Avtomatik əmrləri panoya kopyalayacaq
3. Hostinger Terminali-nda yapışdırmanız üçün hazır olacaq

---

## **🚀 Seçim 3: Avtomatik Bash Skripti**

Hostinger Terminali-nda:

```bash
# 1. Yükləyin
curl -s -o deploy-hostinger.sh https://raw.githubusercontent.com/BTB60/backandpremiumreklam/main/deploy-hostinger.sh

# 2. İcra edin
bash deploy-hostinger.sh premiumreklam.shop admin@premiumreklam.shop
```

---

## **Qaydaca Yoxlama**

Deployment bitdikdən sonra:

```bash
# App status
pm2 status

# Real-time logs
pm2 logs premium-frontend --lines 200

# Nginx status
sudo systemctl status nginx

# SSL sertifikat
sudo certbot certificates
```

---

## **Orta Problemləri Həll Etmə**

| Problem | Əmr |
|---------|-----|
| **502 Bad Gateway** | `pm2 logs premium-frontend` |
| **Permisiya xətası** | `sudo chown -R premiumreklam:premiumreklam /home/premiumreklam/apps` |
| **Port 3000 busy** | `lsof -i :3000 && kill -9 <PID>` |
| **npm build fails** | `cd /home/premiumreklam/apps/backandpremiumreklam && npm ci --legacy-peer-deps && npm run build` |
| **Reboota sonra app offline** | `pm2 startup && pm2 save` |

---

## **Hostinger Firewall Ayarları**

Hostinger Panel → **Security** → **Firewall**
- Port **80** (HTTP) ✅ Açıq
- Port **443** (HTTPS) ✅ Açıq  
- Port **22** (SSH) ✅ Açıq (Opsional)

---

## **Dəstəkli Fayllar**

- `HOSTINGER_DEPLOYMENT.md` — Tam təlimat
- `deploy-hostinger.sh` — Avtomatik bash skripti
- `deploy-hostinger.ps1` — Windows PowerShell köməkçi

---

## **Sonraki Addımlar**

1. ✅ Deployment tamamlandıqdan sonra, `https://premiumreklam.shop` sınayın
2. 📧 Hostinger panel-də **Backups** qurub avtomatik backupları aktivlə
3. 🔒 Hostinger panel-də 2FA qurub şəxsi hesabı qoruyun
4. 📊 PM2 monitorinqini qurub (**pm2 web** və ya **pm2 plus**)

---

## **Suallar və Dəstək**

Xəta varsa:
1. Hostinger Terminali-ndən logları kopyala: `pm2 logs premium-frontend --lines 500`
2. Nginx xətalarını yoxla: `sudo tail -f /var/log/nginx/error.log`
3. Mənə xətanı göndər — kömək edəcəyəm!

---

**Hazır? Başlayın! 🚀**

```bash
bash <(curl -s https://raw.githubusercontent.com/BTB60/backandpremiumreklam/main/deploy-hostinger.sh) premiumreklam.shop admin@premiumreklam.shop
```

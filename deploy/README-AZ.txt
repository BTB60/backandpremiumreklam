backandpremiumreklam — VPS (Ubuntu) qısa təlimat
=================================================

Repo: https://github.com/BTB60/backandpremiumreklam
Tam bələdçi: DEPLOY_GUIDE.md bölmə 7

DEPLOY_SRC (və ya PREMIUM_REKLAM_SRC) — layihənin GIT kök qovluğu olmalıdır
(məs. /opt/premiumreklam/app-backand).

1) DNS — premiumreklam.shop (və www) A qeydi → VPS public IP.

2) Kod
   mkdir -p /opt/premiumreklam && cd /opt/premiumreklam
   git clone https://github.com/BTB60/backandpremiumreklam.git app-backand

3) İlk quraşdırma
   cd /opt/premiumreklam/app-backand
   chmod +x deploy/install-vps.sh deploy/rebuild-app.sh
   sudo env DEPLOY_SRC=/opt/premiumreklam/app-backand bash deploy/install-vps.sh

4) HTTPS
   sudo certbot --nginx -d premiumreklam.shop -d www.premiumreklam.shop

5) Yeniləmə
   cd /opt/premiumreklam/app-backand && git pull
   sudo env DEPLOY_SRC=/opt/premiumreklam/app-backand bash deploy/rebuild-app.sh

Hostinger firewall: inbound TCP 22, 80, 443.

# Production Deployment Guide

## 1. FRONTEND (Vercel)

### Settings > Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_URL=https://www.premiumreklam.shop
NEXT_PUBLIC_SITE_URL=https://www.premiumreklam.shop
NEXTAUTH_URL=https://www.premiumreklam.shop
```

### Deploy:
```bash
npm run build
vercel --prod
```

---

## 2. BACKEND (Render)

### Settings > Environment:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
APP_JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
SERVER_PORT=8080
DDL_AUTO=validate
LOG_LEVEL=INFO
SECURITY_LOG_LEVEL=WARN
CORS_ORIGINS=*
```

### Build (əlavə): bu mono-repoda əsas Java build **Gradle**-dir (`backend/gradlew`)

Render/Docker üçün JAR yaratmaq:
```bash
cd backend
chmod +x ./gradlew
./gradlew bootJar --no-daemon -x test
# JAR: backend/build/libs/premium-reklam-backend-*.jar
java -jar build/libs/premium-reklam-backend-*.jar
```

Köhnə Maven sətirləri (bəzi köçürmələrdə `pom.xml` saxlanıla bilər):
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/*.jar
```

---

## 3. DATABASE (Neon PostgreSQL)

### Create new credentials:
1. Go to neon.tech > Dashboard
2. Create new role/database (don't use neondb_owner for production)
3. Update Render DATABASE_URL with new credentials

---

## 4. Local Development

### Frontend:
```bash
# Create .env.local from .env.example
cp .env.example .env.local

# Edit .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:8081

# Run
npm install
npm run dev
```

### Backend:
```bash
cd backend

# Create .env or set environment variables
export DATABASE_URL=postgresql://USER:PASS@HOST/DB?sslmode=require
export APP_JWT_SECRET=your-secret-key

# Run (Gradle — tövsiyə)
./gradlew bootRun
# və ya
./mvnw spring-boot:run
```

---

## 5. API Endpoints (for reference)

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/users` - Get all users
- `GET /api/products` - Get all products
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}/status?status=pending` - Update order status

---

## 6. Order Status Values (lowercase)

- pending
- approved
- confirmed
- design
- production
- printing
- ready
- delivering
- completed
- cancelled

---

## 7. Hostinger KVM VPS (Ubuntu 24.04)

Bu repo kökdə **Next.js**, `backend/` altında **Spring Boot (Gradle)**. Kök `Dockerfile` legacy qeyd üçün saxlanıla bilər; VPS üçün hazır skriptlər: **`deploy/`**.

### 7.1 Firewall

Hostinger panelində bu VPS üçün **inbound** aç: **TCP 22**, **80**, **443**. Sonra öz kompüterindən `ssh root@VPS_IP` yoxlanıla bilər.

### 7.2 Kodu yüklə

```bash
sudo mkdir -p /opt/premiumreklam
cd /opt/premiumreklam
git clone https://github.com/BTB60/backandpremiumreklam.git app-backand
cd app-backand
```

(Qeyd: non-root istifadəçi üçün əvvəlcə `sudo chown -R "$USER":"$USER" /opt/premiumreklam` edə bilərsən.)

### 7.3 İlk quraşdırma (Nginx, PostgreSQL, systemd, build)

Repo kökündən (layihə root-u `DEPLOY_SRC` ilə göstərilir):

```bash
cd /opt/premiumreklam/app-backand
chmod +x deploy/install-vps.sh deploy/rebuild-app.sh
sudo env DEPLOY_SRC=/opt/premiumreklam/app-backand bash deploy/install-vps.sh
```

İlk işləmədə `/etc/premiumreklam/backend.env` yaradılır; nümunə: `deploy/backend.env.example`.  
`PREMIUM_REKLAM_SRC` dəyişəni də eyni məqsədlə işləyir (köhnə uyğunluq).

### 7.4 SSL (DNS domain VPS IP-də olandan sonra)

```bash
sudo certbot --nginx -d premiumreklam.shop -d www.premiumreklam.shop
```

### 7.5 Kod yeniləməsi

```bash
cd /opt/premiumreklam/app-backand
git pull origin main
sudo env DEPLOY_SRC=/opt/premiumreklam/app-backand bash deploy/rebuild-app.sh
```

Ətraflı: `deploy/README-AZ.txt`.

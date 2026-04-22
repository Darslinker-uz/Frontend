# Darslinker.uz — Linux Serverga Deploy

## Tezkor Ma'lumot

| Parametr | Qiymat |
|----------|--------|
| Domain | `darslinker.uz` |
| Server | DigitalOcean Droplet (Ubuntu 22.04+) |
| Stack | Next.js + Prisma + PostgreSQL |
| Port | 3000 (ichki), 80/443 (tashqi) |
| Process Manager | PM2 |
| Web Server | Nginx (reverse proxy) |

---

## Arxitektura

```
Internet
    │
    ▼
┌─────────────────────────────────────┐
│  Nginx (80/443)                     │
│  - SSL termination                  │
│  - Static files (/uploads)          │
│  - Rate limiting                    │
│  - Gzip compression                 │
└─────────────────────────────────────┘
    │
    ▼ (proxy_pass :3000)
┌─────────────────────────────────────┐
│  Next.js App (PM2)                  │
│  - Frontend (React/SSR)             │
│  - Backend (API Routes)             │
│  - Telegram Bot (Webhook)           │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  PostgreSQL                         │
│  - Users, Listings, Leads, etc.     │
└─────────────────────────────────────┘
```

**Muhim:** Frontend va Backend **bitta** Next.js ilovasi sifatida ishlaydi. Alohida run qilish kerak emas!

---

## Server Talablari

- **OS**: Ubuntu 22.04 LTS
- **RAM**: Minimal 1GB, Tavsiya 2GB
- **CPU**: 1 vCPU
- **Disk**: 25GB SSD
- **Narx**: DigitalOcean $6-12/oy

---

## Bosqichma-bosqich O'rnatish

### 1. Serverga SSH orqali ulaning

```bash
ssh root@YOUR_SERVER_IP
```

### 2. Asosiy paketlarni o'rnating

```bash
apt update && apt upgrade -y
apt install -y git curl ufw
```

### 3. Firewall sozlang

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### 4. Loyihani serverdagi o'rnatish

```bash
# Loyihani klonlang (yoki SCP orqali ko'chiring)
git clone https://github.com/YOUR_USERNAME/darslinker.git /var/www/darslinker
cd /var/www/darslinker

# Deploy skriptga ruxsat bering
chmod +x deploy.sh

# To'liq o'rnatish
./deploy.sh full
```

### 5. PostgreSQL sozlang

```bash
# PostgreSQL shell
sudo -u postgres psql

# Buyruqlarni bajaring:
CREATE USER darslinker WITH PASSWORD 'xavfsiz_parol_123';
CREATE DATABASE darslinker OWNER darslinker;
GRANT ALL PRIVILEGES ON DATABASE darslinker TO darslinker;
\q
```

### 6. `.env` faylini yarating

```bash
cd /var/www/darslinker
cp .env.example .env
nano .env
```

**Muhim .env qiymatlari:**

```env
# Database
DATABASE_URL="postgresql://darslinker:xavfsiz_parol_123@localhost:5432/darslinker"

# NextAuth
AUTH_SECRET="$(openssl rand -base64 32)"  # Generatsiya qiling
AUTH_URL="https://darslinker.uz"
AUTH_TRUST_HOST="true"

# Telegram
TELEGRAM_BOT_TOKEN="123456:ABC..."
TELEGRAM_BOT_USERNAME="DarslinkerBot"
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="DarslinkerBot"
TELEGRAM_WEBHOOK_SECRET="$(openssl rand -base64 32)"

# Uploads
UPLOADS_DIR="/var/darslinker/uploads"

# Admin (seed uchun)
ADMIN_PHONE="+998901234567"
ADMIN_PASSWORD="kuchli_parol"
ADMIN_NAME="Admin"

# Production
NODE_ENV="production"
```

### 7. SSL sertifikatini oling

```bash
./deploy.sh ssl
# yoki qo'lda:
certbot --nginx -d darslinker.uz -d www.darslinker.uz
```

### 8. Deploy qiling

```bash
./deploy.sh deploy
```

### 9. Database seed qiling

```bash
cd /var/www/darslinker
npx prisma migrate deploy
npm run db:seed-prod
```

### 10. Telegram webhook o'rnating

```bash
./deploy.sh webhook
# yoki:
npm run webhook:set
```

---

## Buyruqlar

### Ilovani boshqarish (PM2)

```bash
pm2 status              # Holat
pm2 logs darslinker     # Loglar
pm2 restart darslinker  # Qayta ishga tushirish
pm2 stop darslinker     # To'xtatish
pm2 monit               # Real-time monitoring
```

### Deploy yangilanish

```bash
cd /var/www/darslinker
./deploy.sh deploy
```

### Database

```bash
# Prisma Studio (UI)
npm run db:studio

# Migration
npx prisma migrate deploy

# Reset (DIQQAT: barcha ma'lumotlar o'chadi!)
npx prisma migrate reset
```

### Nginx

```bash
nginx -t                    # Konfiguratsiya tekshirish
systemctl reload nginx      # Qayta yuklash
systemctl status nginx      # Holat
```

### Loglar

```bash
# Ilova loglari
tail -f /var/log/darslinker/out.log
tail -f /var/log/darslinker/error.log

# Nginx loglari
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PM2 loglari
pm2 logs --lines 100
```

---

## Papkalar Tuzilmasi

```
/var/www/darslinker/          # Ilova kodi
├── .next/                    # Build output
├── node_modules/
├── prisma/
├── src/
├── .env                      # Environment variables
├── ecosystem.config.js       # PM2 config
├── nginx.conf                # Nginx config namunasi
└── deploy.sh                 # Deploy skript

/var/darslinker/uploads/      # Yuklangan rasmlar
/var/log/darslinker/          # PM2 loglar
/etc/nginx/sites-available/   # Nginx config
/etc/letsencrypt/            # SSL sertifikatlar
```

---

## Xavfsizlik

### 1. Firewall

```bash
ufw status
# Faqat SSH, HTTP, HTTPS ochiq bo'lishi kerak
```

### 2. SSH kalitlarini o'rnating

```bash
# Mahalliy kompyuterda
ssh-keygen -t ed25519
ssh-copy-id root@YOUR_SERVER_IP

# Serverda parol orqali kirishni o'chiring
nano /etc/ssh/sshd_config
# PasswordAuthentication no
systemctl restart sshd
```

### 3. Fail2ban o'rnating

```bash
apt install fail2ban
systemctl enable fail2ban
```

### 4. Avtomatik yangilanishlar

```bash
apt install unattended-upgrades
dpkg-reconfigure unattended-upgrades
```

---

## Muammolarni Hal Qilish

### Ilova ishlamayapti

```bash
# PM2 holati
pm2 status

# Loglarni tekshiring
pm2 logs darslinker --lines 50

# Qayta ishga tushiring
pm2 restart darslinker
```

### 502 Bad Gateway

```bash
# Next.js ishlayaptimi?
pm2 status

# Port band emasmi?
lsof -i :3000

# Nginx config to'g'rimi?
nginx -t
```

### Database ulanmayapti

```bash
# PostgreSQL ishlayaptimi?
systemctl status postgresql

# Ulanishni tekshiring
psql -U darslinker -d darslinker -h localhost
```

### SSL muammo

```bash
# Sertifikatni yangilang
certbot renew

# Nginx reload
systemctl reload nginx
```

---

## Backup

### Database backup

```bash
# Backup
pg_dump -U darslinker darslinker > backup_$(date +%Y%m%d).sql

# Restore
psql -U darslinker darslinker < backup.sql
```

### Avtomatik backup (cron)

```bash
crontab -e
# Har kuni soat 3:00 da
0 3 * * * pg_dump -U darslinker darslinker > /var/backups/darslinker_$(date +\%Y\%m\%d).sql
```

### Uploads backup

```bash
# Rsync orqali
rsync -avz /var/darslinker/uploads/ /var/backups/uploads/
```

---

## Monitoring

### Asosiy tekshiruvlar

```bash
# Server resurslari
htop

# Disk
df -h

# Memory
free -m

# PM2
pm2 monit
```

### Health check endpoint

```bash
curl https://darslinker.uz/api/health
```

---

## Ko'p So'raladigan Savollar

### Q: Frontend va Backend alohida run boladimi?

**A:** Yo'q! Next.js ilovasi frontend va backend ni bitta serverda, bitta port (3000) orqali xizmat ko'rsatadi. Nginx reverse proxy sifatida ishlaydi va HTTPS terminatsiya qiladi.

### Q: Telegram bot qanday ishlaydi?

**A:** Production da webhook rejimida ishlaydi. Telegram serverlar `/api/telegram/webhook` endpointiga POST so'rovlar yuboradi. Local development da `npm run bot` (polling) ishlatiladi.

### Q: Rasmlar qayerda saqlanadi?

**A:** `/var/darslinker/uploads/` papkasida. Nginx ularni to'g'ridan-to'g'ri `/uploads/*` URL orqali beradi.

### Q: Database qayerda?

**A:** PostgreSQL serverda localhost da ishlaydi. Remote access kerak bo'lsa, pgAdmin yoki ssh tunnel ishlatiladi.

---

## Aloqa

Muammo bo'lsa GitHub Issues orqali yoki Telegram guruhga yozing.

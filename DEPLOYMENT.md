# Deployment Guide

คู่มือการ Deploy MSL School สำหรับ Production

## 📋 สารบัญ

- [Overview](#overview)
- [Pre-deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Database Deployment](#database-deployment)
- [Application Deployment](#application-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)

---

## 🎯 Overview

MSL School สามารถ deploy ได้หลายวิธี:

- **Traditional VPS/Server** (Ubuntu, CentOS)
- **Docker Container** (แนะนำ)
- **Cloud Platforms** (Railway, Render, DigitalOcean)
- **Serverless** (Vercel, Netlify Functions)

### Technology Stack Requirements

- **Runtime**: Bun ≥ 1.0.0
- **Database**: PostgreSQL ≥ 13
- **Memory**: ≥ 512MB RAM
- **Storage**: ≥ 1GB SSD
- **Network**: HTTPS support

---

## ✅ Pre-deployment Checklist

### Code Preparation

```bash
# 1. อัปเดตเวอร์ชัน
npm version patch # หรือ minor/major

# 2. รัน tests ทั้งหมด
bun test

# 3. ตรวจสอบ TypeScript
bunx tsc --noEmit

# 4. ตรวจสอบ code quality
bun run lint
bun run format

# 5. Build production
bun run build

# 6. ทดสอบ production build
NODE_ENV=production bun run start
```

### Environment Variables

```bash
# สร้าง production environment file
cp .env.example .env.production

# ตรวจสอบ required variables
grep -v '^#' .env.production | grep -v '^$'
```

**Required Production Variables:**
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# Server
NODE_ENV=production
PORT=3000
CORS_ORIGIN="https://yourdomain.com"

# Security
JWT_SECRET="your-strong-jwt-secret"
API_KEY="your-api-key"

# Optional: Prisma Accelerate
PULSE_API_KEY="your-pulse-key"
```

---

## 🌍 Environment Setup

### Production Server Requirements

**Minimum Specifications:**
- CPU: 1 vCPU
- RAM: 512MB
- Storage: 1GB SSD
- OS: Ubuntu 20.04+ / CentOS 8+

**Recommended Specifications:**
- CPU: 2 vCPU
- RAM: 2GB
- Storage: 10GB SSD
- Load Balancer support

### Server Setup (Ubuntu)

```bash
# อัปเดต system
sudo apt update && sudo apt upgrade -y

# ติดตั้ง essential tools
sudo apt install -y curl wget git unzip

# ติดตั้ง Bun
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"

# ติดตั้ง PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# สร้าง database user
sudo -u postgres psql
CREATE USER msl_user WITH PASSWORD 'secure_password';
CREATE DATABASE msl_school OWNER msl_user;
GRANT ALL PRIVILEGES ON DATABASE msl_school TO msl_user;
\q

# ติดตั้ง Nginx (optional)
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🗄️ Database Deployment

### PostgreSQL Setup

**Local PostgreSQL:**
```bash
# สร้าง production database
createdb -U postgres msl_school_prod

# Setup user และ permissions
psql -U postgres -c "
CREATE USER msl_prod WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE msl_school_prod TO msl_prod;
"
```

**Cloud Database (แนะนำ):**

1. **Supabase** (Free tier available)
```bash
# สมัครที่ https://supabase.com
# สร้าง new project
# คัดลอก Connection String
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[dbname]?pgbouncer=true"
DIRECT_URL="postgresql://[user]:[password]@[host]:[port]/[dbname]"
```

2. **Railway PostgreSQL**
```bash
# ติดตั้ง Railway CLI
npm install -g @railway/cli

# Login และ create service
railway login
railway add postgresql
railway variables # ดู DATABASE_URL
```

3. **DigitalOcean Managed Database**
```bash
# สร้างใน DigitalOcean Control Panel
# เลือก PostgreSQL version 13+
# เลือก datacenter region ใกล้ users
```

### Database Migration

```bash
# Set production environment
export NODE_ENV=production
export DATABASE_URL="your-production-database-url"

# Generate Prisma Client
bunx prisma generate

# Deploy migrations
bunx prisma migrate deploy

# Verify deployment
bunx prisma db pull
```

---

## 🚀 Application Deployment

### Method 1: Direct Server Deployment

```bash
# 1. Clone repository
git clone https://github.com/yourusername/msl-school-api.git
cd msl-school-api

# 2. Install dependencies
bun install --production

# 3. Setup environment
cp .env.example .env
# แก้ไข .env ให้ถูกต้อง

# 4. Generate Prisma Client
bunx prisma generate

# 5. Run migrations
bunx prisma migrate deploy

# 6. Build application
bun run build

# 7. Test production build
NODE_ENV=production bun run start

# 8. Setup process manager (PM2)
npm install -g pm2

# สร้าง ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'msl-school-api',
    script: 'bun',
    args: 'run start',
    cwd: '/path/to/msl-school-api',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M'
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Method 2: Compiled Binary

```bash
# Build standalone binary
bun build src/index.ts --compile --outfile msl-school-api

# Run binary
chmod +x msl-school-api
./msl-school-api

# Create systemd service
sudo tee /etc/systemd/system/msl-school-api.service > /dev/null << EOF
[Unit]
Description=MSL School
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/msl-school-api
ExecStart=/opt/msl-school-api/msl-school-api
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable msl-school-api
sudo systemctl start msl-school-api
```

---

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --production --frozen-lockfile

# Build application
FROM base AS builder
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production image
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 bunjs

# Copy built application
COPY --from=builder --chown=bunjs:bunjs /app/dist ./dist
COPY --from=builder --chown=bunjs:bunjs /app/prisma ./prisma
COPY --from=deps --chown=bunjs:bunjs /app/node_modules ./node_modules
COPY --chown=bunjs:bunjs package.json .

USER bunjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/msl_school
      - CORS_ORIGIN=https://yourdomain.com
    depends_on:
      - db
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=msl_school
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
```

### การใช้งาน Docker

```bash
# Build และ run
docker compose up -d

# ดู logs
docker compose logs -f api

# Execute commands
docker compose exec api bunx prisma migrate deploy

# Backup database
docker compose exec db pg_dump -U postgres msl_school > backup.sql

# Update application
git pull
docker compose build
docker compose up -d
```

---

## ☁️ Cloud Platforms

### Railway Deployment

```bash
# 1. ติดตั้ง Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create project
railway add

# 4. Add PostgreSQL
railway add postgresql

# 5. Deploy
railway up

# 6. Setup environment variables
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://your-railway-app.railway.app
```

**railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "bun run start",
    "healthcheckPath": "/health"
  }
}
```

### Render Deployment

**render.yaml:**
```yaml
services:
  - type: web
    name: msl-school-api
    env: node
    buildCommand: bun install && bun run build
    startCommand: bun run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: msl-school-db
          property: connectionString

databases:
  - name: msl-school-db
    databaseName: msl_school
    user: msl_user
```

### DigitalOcean App Platform

**app.yaml:**
```yaml
name: msl-school-api
services:
- name: api
  source_dir: /
  github:
    repo: your-username/msl-school-api
    branch: main
  run_command: bun run start
  build_command: bun install && bun run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: "production"
  - key: DATABASE_URL
    value: "${db.DATABASE_URL}"

databases:
- name: db
  engine: PG
  num_nodes: 1
  size: basic-xs
  version: "15"
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
          
      - name: Install dependencies
        run: bun install
        
      - name: Run tests
        run: bun test
        
      - name: TypeScript check
        run: bunx tsc --noEmit
        
      - name: Build
        run: bun run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.2.2
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
```

### GitLab CI/CD

**.gitlab-ci.yml:**
```yaml
stages:
  - test
  - build
  - deploy

variables:
  BUN_VERSION: "1.0.0"

before_script:
  - curl -fsSL https://bun.sh/install | bash
  - export PATH="$HOME/.bun/bin:$PATH"

test:
  stage: test
  script:
    - bun install
    - bun test
    - bunx tsc --noEmit

build:
  stage: build
  script:
    - bun install
    - bun run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  script:
    - echo "Deploy to production"
    # Add your deployment script here
  only:
    - main
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```typescript
// src/routes/health.ts
export const healthRouter = {
  check: publicProcedure
    .output(z.object({
      status: z.string(),
      timestamp: z.string(),
      version: z.string(),
      database: z.string(),
      memory: z.object({
        used: z.number(),
        total: z.number()
      })
    }))
    .handler(async ({ ctx }) => {
      const memory = process.memoryUsage();
      
      // Test database connection
      let dbStatus = "healthy";
      try {
        await ctx.db.$queryRaw`SELECT 1`;
      } catch (error) {
        dbStatus = "unhealthy";
      }

      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "unknown",
        database: dbStatus,
        memory: {
          used: Math.round(memory.heapUsed / 1024 / 1024),
          total: Math.round(memory.heapTotal / 1024 / 1024)
        }
      };
    })
};
```

### Logging Setup

```typescript
// src/lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Performance Monitoring

```bash
# ติดตั้ง monitoring tools
npm install --save-dev clinic

# Profile performance
clinic doctor -- bun run start
clinic flame -- bun run start
clinic bubbleprof -- bun run start
```

### Database Maintenance

```bash
# สำรองข้อมูลประจำวัน
pg_dump $DATABASE_URL > "backup_$(date +%Y%m%d).sql"

# อัดบีบและส่งไปยัง cloud storage
gzip "backup_$(date +%Y%m%d).sql"
aws s3 cp "backup_$(date +%Y%m%d).sql.gz" s3://your-backup-bucket/

# ลบ backup เก่า (เก็บ 30 วัน)
find ./backups -name "backup_*.sql.gz" -mtime +30 -delete
```

---

## 🔐 Security Considerations

### Environment Security

```bash
# ใช้ secrets management
# 1. HashiCorp Vault
# 2. AWS Secrets Manager
# 3. Azure Key Vault
# 4. Railway/Render environment variables

# ตัวอย่าง: ใช้ dotenv-vault
npm install dotenv-vault
npx dotenv-vault build
npx dotenv-vault keys production
```

### SSL/HTTPS Setup

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Security Headers

```typescript
// src/middleware/security.ts
import { securityHeaders } from 'hono/security-headers';

app.use(securityHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
  },
  referrerPolicy: 'strict-origin-when-cross-origin',
}));
```

---

## ⚡ Performance Optimization

### Production Optimizations

```typescript
// src/lib/prisma.ts - Production configuration
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}).$extends(
  withAccelerate()
);

// Connection pooling
export const prismaPool = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  engineType: 'binary',
});
```

### Caching Strategy

```typescript
// src/lib/cache.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = await fetcher();
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
  return data;
}
```

### Load Balancing

**Docker Compose with Load Balancer:**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - api1
      - api2

  api1:
    build: .
    environment:
      - NODE_ENV=production
      - PORT=3000
    
  api2:
    build: .
    environment:
      - NODE_ENV=production
      - PORT=3000
```

---

## 🚨 Rollback Procedures

### Quick Rollback

```bash
# 1. Rollback to previous git commit
git reset --hard HEAD~1
git push --force-with-lease

# 2. Rollback database migration (if needed)
bunx prisma migrate resolve --rolled-back <migration-name>

# 3. Restart services
pm2 restart all
# หรือ
docker compose restart api

# 4. Verify rollback
curl -f http://localhost:3000/health
```

### Blue-Green Deployment

```bash
# Setup two identical environments
# Deploy to "green" environment first
# Test thoroughly
# Switch traffic from "blue" to "green"
# Keep "blue" as backup for quick rollback
```

---

## 📞 Post-Deployment Checklist

- [ ] Health check endpoint responding
- [ ] Database connection working
- [ ] All API endpoints accessible
- [ ] CORS configured correctly
- [ ] SSL certificate valid
- [ ] Monitoring and logging active
- [ ] Backup procedures tested
- [ ] Performance benchmarks met
- [ ] Security headers configured
- [ ] Environment variables secured

---

## 🆘 Emergency Contacts & Procedures

### Critical Issues

1. **Database Down**: 
   - Check database service status
   - Verify connection string
   - Check disk space
   - Contact database provider

2. **Application Down**:
   - Check server resources
   - Review application logs
   - Restart application service
   - Check dependency services

3. **Performance Issues**:
   - Monitor CPU/Memory usage
   - Check database query performance
   - Review application logs for bottlenecks
   - Scale resources if needed

### Escalation Path

1. **Level 1**: Application restart, basic troubleshooting
2. **Level 2**: Database issues, infrastructure problems
3. **Level 3**: Critical security issues, data corruption

---

*อัปเดตล่าสุด: 2025-01-29*

# Troubleshooting Guide

คู่มือแก้ไขปัญหาสำหรับ MSL School

## 📋 สารบัญ

- [การติดตั้งและ Setup](#การติดตั้งและ-setup)
- [Database และ Prisma](#database-และ-prisma)
- [Development Server](#development-server)
- [Build และ Production](#build-และ-production)
- [API และ ORPC](#api-และ-orpc)
- [Environment Variables](#environment-variables)
- [Performance Issues](#performance-issues)
- [Common Errors](#common-errors)
- [Debug Tools](#debug-tools)

---

## 🛠️ การติดตั้งและ Setup

### Bun Installation Issues

**ปัญหา**: Bun ติดตั้งไม่ได้หรือเกิดข้อผิดพลาด
```bash
# ตรวจสอบเวอร์ชัน Bun
bun --version

# ติดตั้ง Bun ใหม่ (macOS/Linux)
curl -fsSL https://bun.sh/install | bash

# ติดตั้ง Bun ใหม่ (Windows)
powershell -c "irm bun.sh/install.ps1 | iex"

# อัปเดต Bun
bun upgrade
```

**ปัญหา**: Package installation ล้มเหลว
```bash
# ลบ node_modules และ lock files
rm -rf node_modules bun.lockb package-lock.json yarn.lock

# ติดตั้งใหม่
bun install

# หากยังมีปัญหา ใช้ --force
bun install --force
```

### TypeScript Configuration Issues

**ปัญหา**: TypeScript compilation errors
```bash
# ตรวจสอบ TypeScript config
bunx tsc --noEmit

# รีเซ็ต TypeScript cache
rm -rf node_modules/.cache

# ตรวจสอบเวอร์ชัน TypeScript
bunx tsc --version
```

---

## 🗄️ Database และ Prisma

### Database Connection Issues

**ปัญหา**: ไม่สามารถเชื่อมต่อ Database ได้
```bash
# ตรวจสอบ DATABASE_URL
echo $DATABASE_URL

# ทดสอบการเชื่อมต่อ
bunx prisma db pull

# ตรวจสอบ PostgreSQL service
# macOS (Homebrew)
brew services list | grep postgresql
brew services start postgresql

# Linux (systemd)
sudo systemctl status postgresql
sudo systemctl start postgresql

# Docker
docker ps | grep postgres
docker start <postgres-container-name>
```

**ปัญหา**: Prisma Client ไม่ทำงาน
```bash
# Generate Prisma Client ใหม่
bunx prisma generate

# Reset database (ระวัง! จะลบข้อมูลทั้งหมด)
bunx prisma db push --force-reset

# ตรวจสอบ Prisma schema
bunx prisma validate
```

### Migration Issues

**ปัญหา**: Migration ล้มเหลว
```bash
# ตรวจสอบ migration status
bunx prisma migrate status

# แก้ไข migration conflicts
bunx prisma migrate resolve --applied <migration-name>

# รีเซ็ต migrations (ระวัง!)
bunx prisma migrate reset

# สร้าง migration ใหม่
bunx prisma migrate dev --name <migration-name>
```

**ปัญหา**: Schema และ Database ไม่ตรงกัน
```bash
# Sync schema กับ database
bunx prisma db push

# ดึง schema จาก database
bunx prisma db pull

# แสดงความแตกต่าง
bunx prisma migrate diff \
  --from-schema-datamodel prisma/schema/schema.prisma \
  --to-schema-datasource prisma/schema/schema.prisma
```

---

## 🚀 Development Server

### Server Startup Issues

**ปัญหา**: Server ไม่สามารถ start ได้
```bash
# ตรวจสอบ port ว่าถูกใช้งานอยู่หรือไม่
lsof -i :3000
# หรือ
netstat -tulpn | grep :3000

# Kill process ที่ใช้ port
kill -9 <PID>

# เริ่ม server ด้วย debug mode
NODE_ENV=development bun run dev --verbose
```

**ปัญหา**: Hot reload ไม่ทำงาน
```bash
# ใช้ --hot flag
bun run --hot src/index.ts

# ตรวจสอบว่าไฟล์ถูก watch หรือไม่
# เพิ่ม console.log เพื่อทดสอบ
```

### Port และ Network Issues

**ปัญหา**: CORS errors
```typescript
// ตรวจสอบ CORS configuration ใน src/index.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

**ปัญหา**: API ไม่ response
```bash
# ทดสอบ API ด้วย curl
curl -X GET http://localhost:3000/health

# ตรวจสอบ server logs
bun run dev 2>&1 | tee server.log
```

---

## 🏗️ Build และ Production

### Build Issues

**ปัญหา**: Build ล้มเหลว
```bash
# Clean build
rm -rf dist/

# Build ด้วย verbose
bun run build --verbose

# ตรวจสอบ TypeScript errors
bunx tsc --noEmit
```

**ปัญหา**: Path alias ไม่ทำงานใน build
```bash
# ตรวจสอบ tsconfig.json
cat tsconfig.json | grep -A 10 "paths"

# รัน tsc-alias หลัง build
bunx tsc && bunx tsc-alias
```

### Production Deployment Issues

**ปัญหา**: Production server ไม่ start
```bash
# ตรวจสอบ environment variables
env | grep -E "(DATABASE_URL|NODE_ENV|PORT)"

# ตรวจสอบ dependencies
bun install --production

# รัน production build
NODE_ENV=production bun run build
NODE_ENV=production bun run start
```

**ปัญหา**: Database ใน production
```bash
# Apply migrations
NODE_ENV=production bunx prisma migrate deploy

# Generate Prisma client
NODE_ENV=production bunx prisma generate
```

---

## 🔌 API และ ORPC

### ORPC Issues

**ปัญหา**: ORPC procedures ไม่ทำงาน
```typescript
// ตรวจสอบ procedure definition
import { publicProcedure } from "@/lib/orpc";

export const testProcedure = publicProcedure
  .input(z.object({ message: z.string() }))
  .output(z.object({ result: z.string() }))
  .handler(async ({ input }) => {
    console.log("Input:", input); // Debug log
    return { result: `Hello ${input.message}` };
  });
```

**ปัญหา**: Type inference ไม่ทำงาน
```typescript
// ตรวจสอบ AppRouter type export
export type AppRouter = typeof appRouter;

// ตรวจสอบ client setup
import type { AppRouter } from "./server";
```

### Authentication Issues

**ปัญหา**: Authentication context ไม่ทำงาน
```typescript
// ตรวจสอบ context creation
export async function createContext(c: Context): Promise<ContextType> {
  console.log("Creating context..."); // Debug log
  
  // TODO: Implement actual authentication
  const session = null; // Replace with real auth logic
  
  return {
    db: prisma,
    session,
  };
}
```

---

## 🔧 Environment Variables

### Missing Environment Variables

**ปัญหา**: Environment variables ไม่โหลด
```bash
# ตรวจสอบไฟล์ .env
ls -la .env*

# ตรวจสอบว่า variables โหลดหรือไม่
node -e "console.log(process.env.DATABASE_URL)"

# สร้าง .env จาก template
cp .env.example .env
```

**Required Environment Variables:**
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/msl_school"
DIRECT_URL="postgresql://username:password@localhost:5432/msl_school"

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3001"

# Prisma Accelerate (optional)
PULSE_API_KEY="your-pulse-key"
```

---

## ⚡ Performance Issues

### Slow API Response

```bash
# เปิด Prisma query logging
# ใน prisma/index.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

# ตรวจสอบ slow queries
# ดู console logs สำหรับ query performance
```

### Memory Issues

```bash
# ตรวจสอบ memory usage
node --expose-gc -e "
console.log('Memory usage:', process.memoryUsage());
global.gc();
console.log('After GC:', process.memoryUsage());
"

# เพิ่ม memory limit สำหรับ Node.js
NODE_OPTIONS="--max-old-space-size=4096" bun run dev
```

---

## ❌ Common Errors

### Error: "Module not found"

```bash
# ตรวจสอบ path mapping
bunx tsc --showConfig | grep -A 10 "paths"

# ติดตั้ง missing dependencies
bun install

# รีสร้าง node_modules
rm -rf node_modules bun.lockb
bun install
```

### Error: "Cannot find module '@/*'"

```bash
# ตรวจสอบ tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# หลัง build ใช้ tsc-alias
bunx tsc && bunx tsc-alias
```

### Error: "Prisma Client not generated"

```bash
# Generate Prisma Client
bunx prisma generate

# ตรวจสอบ generated files
ls -la prisma/generated/

# เพิ่ม postinstall script
npm pkg set scripts.postinstall="prisma generate"
```

### Error: "Database connection failed"

```bash
# ตรวจสอบ DATABASE_URL format
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=SCHEMA

# ทดสอบการเชื่อมต่อ
bunx prisma db pull
bunx prisma studio
```

---

## 🔍 Debug Tools

### Logging และ Debugging

```typescript
// เพิ่ม debug logging
import debug from 'debug';
const log = debug('app:server');

log('Server starting...');

// ใช้ console.log สำหรับ development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', { variable });
}
```

### Database Debugging

```bash
# เปิด Prisma Studio
bunx prisma studio

# ตรวจสอบ database schema
bunx prisma db pull
bunx prisma validate

# Export database data
pg_dump $DATABASE_URL > backup.sql
```

### API Testing

```bash
# ใช้ curl ทดสอบ API
curl -X POST http://localhost:3000/api/health \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# ใช้ httpie (ถ้าติดตั้งแล้ว)
http POST localhost:3000/api/health message=test
```

### Performance Profiling

```bash
# รัน server พร้อม profiling
node --prof src/index.ts

# วิเคราะห์ profile
node --prof-process isolate-*.log > profile.txt
```

---

## 🚨 Emergency Procedures

### Database Recovery

```bash
# สำรองข้อมูลก่อนแก้ไข
pg_dump $DATABASE_URL > emergency_backup.sql

# รีสร้าง database
bunx prisma migrate reset
bunx prisma db push

# คืนค่าข้อมูล
psql $DATABASE_URL < emergency_backup.sql
```

### Complete Reset

```bash
# รีเซ็ตโปรเจคทั้งหมด (ระวัง!)
rm -rf node_modules bun.lockb dist/
bun install
bunx prisma generate
bunx prisma migrate deploy
bun run build
```

---

## 📞 Getting Help

หากยังแก้ไขปัญหาไม่ได้:

1. **ตรวจสอบ Logs**: อ่าน error messages อย่างละเอียด
2. **Search Issues**: ค้นหาปัญหาใน GitHub Issues ของ dependencies
3. **Community**: สอบถามใน Discord/Forums ของ Bun, Prisma, ORPC
4. **Documentation**: อ่านเอกสารอย่างเป็นทางการ

### Useful Links

- [Bun Documentation](https://bun.sh/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [ORPC Documentation](https://orpc.io)
- [Hono Documentation](https://hono.dev)

---

*อัปเดตล่าสุด: 2025-01-29*

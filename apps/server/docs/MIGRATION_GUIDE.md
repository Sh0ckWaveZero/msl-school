# Database Migration Guide

คู่มือการใช้งาน Database Migration สำหรับระบบโรงเรียน MSL (Bun + Prisma + PostgreSQL)

## 🚀 การเริ่มต้นใช้งาน

### 1. เตรียมฐานข้อมูล Local (Development)

```bash
# สร้าง PostgreSQL database
createdb msl_school_dev

# หรือใช้ Docker
docker run --name postgres-msl \
  -e POSTGRES_DB=msl_school_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 -d postgres:15
```

### 2. ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ตัวอย่าง
cp .env.example .env

# แก้ไข DATABASE_URL ใน .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/msl_school_dev"

# สำหรับ Development
NODE_ENV=development
PORT=3000
CORS_ORIGIN="http://localhost:3000"
SESSION_SECRET="your-session-secret-key"
```

### 3. รัน Migration

```bash
# Generate Prisma Client
bun db:generate

# วิธีที่ 1: Push schema changes (Development)
bun db:push

# วิธีที่ 2: Create และ Apply migration (Production-ready)
bun db:migrate

# หรือใช้ Prisma CLI โดยตรง
bunx prisma migrate dev --name init_complete_school_system --schema ./prisma/schema
```

### 4. เพิ่มข้อมูลตัวอย่าง (Optional)

```bash
# เพิ่มข้อมูลตัวอย่าง
bun db:seed

# หรือรันไฟล์ seed โดยตรง
bun run prisma/seed.ts
```

## 📋 คำสั่ง Scripts ที่มีให้ใช้

### Database Migration

```bash
# Generate Prisma Client (จำเป็นก่อน migration)
bun db:generate

# Push schema changes to database (Development)
bun db:push

# Create และ Apply migration (Production-ready)
bun db:migrate

# ดู migration status
bunx prisma migrate status --schema ./prisma/schema

# Apply migration สำหรับ Production
bunx prisma migrate deploy --schema ./prisma/schema
```

### Database Management

```bash
# Reset database (⚠️ ลบข้อมูลทั้งหมด)
bun db:reset

# เพิ่มข้อมูลตัวอย่าง
bun db:seed

# เปิด Prisma Studio (Database GUI)
bun db:studio

# Generate Prisma Client
bun db:generate
```

### Development Workflow

```bash
# 1. Start development server
bun dev

# 2. Check TypeScript types
bun check-types

# 3. Build for production
bun build

# 4. Start production build
bun start
```

## 🔧 Troubleshooting

### ปัญหาที่อาจเจอ

**1. Database connection failed**
```bash
# ตรวจสอบว่า PostgreSQL เริ่มต้นแล้ว
pg_isready -h localhost -p 5432

# ตรวจสอบ DATABASE_URL
echo $DATABASE_URL

# Test connection
bunx prisma db pull --schema ./prisma/schema
```

**2. Migration failed**
```bash
# ตรวจสอบ migration status
bunx prisma migrate status --schema ./prisma/schema

# Reset migrations (⚠️ ใช้เฉพาะ development)
bunx prisma migrate reset --schema ./prisma/schema

# Force push schema (skip migration)
bunx prisma db push --force-reset --schema ./prisma/schema
```

**3. Prisma Client generation error**
```bash
# ลบและ generate ใหม่
rm -rf prisma/generated
bun db:generate

# หรือ generate ด้วย Prisma CLI
bunx prisma generate --schema ./prisma/schema
```

**4. Schema validation error**
```bash
# ตรวจสอบ syntax error ใน schema
bunx prisma validate --schema ./prisma/schema

# Format schema file
bunx prisma format --schema ./prisma/schema
```
## 🚀 Production Deployment

### สำหรับ Production Environment

```bash
# 1. ตั้งค่า Environment Variables
export DATABASE_URL="your_production_database_url"
export NODE_ENV="production"
export PORT="3000"

# 2. Apply migrations (ไม่สร้าง migration ใหม่)
bunx prisma migrate deploy --schema ./prisma/schema

# 3. Generate client for production
bunx prisma generate --schema ./prisma/schema

# 4. Build application
bun build

# 5. Start production server
bun start
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM oven/bun:1.2-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client
RUN cd apps/server && bunx prisma generate --schema ./prisma/schema

# Build application
RUN bun build

# Expose port
EXPOSE 3000

# Run migrations and start
CMD ["sh", "-c", "cd apps/server && bunx prisma migrate deploy --schema ./prisma/schema && bun start"]
```

## 📊 Database Schema Information

### Prisma Configuration
- **Generator**: `prisma-client` with ESM format
- **Output**: `../generated` (relative to schema)
- **Extensions**: `uuid-ossp` for PostgreSQL
- **Preview Features**: `postgresqlExtensions`

### Key Models Summary
- **User Management**: User, Account, RolePermission, UserRole
- **Education**: Level, Department, Program, Classroom, LevelClassroom
- **Academic**: Course, SubjectGroup, Term, Schedule, Grade
- **People**: Student, Teacher, Parent, StudentParent
- **Activities**: Attendance, ReportCheckIn, ActivityCheckInReport
- **Behavior**: GoodnessIndividual, BadnessIndividual, VisitStudent
- **Content**: News, Holiday
- **System**: Session, VerificationToken, AuditLog

### Useful Commands Summary

```bash
# Development workflow
bun install              # Install dependencies
bun db:generate         # Generate Prisma client
bun db:push            # Push schema changes
bun db:seed            # Add sample data
bun dev                # Start development server

# Production workflow
bun build              # Build for production
bun db:migrate         # Create migration
bunx prisma migrate deploy  # Apply migrations
bun start              # Start production server

# Maintenance
bun db:studio          # Open database GUI
bun db:reset           # Reset database (dev only)
bun check-types        # TypeScript type checking
```

## 🔍 Additional Resources

- **Prisma Documentation**: https://www.prisma.io/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Bun Documentation**: https://bun.sh/docs

### Best Practices สำหรับ Production

1. **สำรองข้อมูลก่อนเสมอ** ก่อนรัน migration
2. **ทดสอบ migration ใน staging** ก่อน production
3. **ใช้ `migrate deploy`** แทน `migrate dev`
4. **ตรวจสอบ migration status** หลังจาก deploy

## 📊 Schema Overview

ระบบฐานข้อมูลปัจจุบันประกอบด้วย:

### Core Models (21 tables)
- **User Management**: User, Account, Session, UserRole, RolePermission
- **Academic Structure**: Department, Level, Program, Classroom, LevelClassroom
- **Education**: Term, SubjectGroup, Course, Schedule, Teacher, Student
- **Assessment**: Attendance, Grade, GoodnessIndividual, BadnessIndividual
- **Reports**: ReportCheckIn, ActivityCheckInReport, VisitStudent
- **Family**: Parent, StudentParent
- **Content**: News, Holiday
- **System**: AuditLog, VerificationToken

### Key Features
- ✅ Type-safe database operations with Prisma
- ✅ Academic year and semester management
- ✅ Multi-role user system (Admin, Teacher, Student, Parent)
- ✅ Behavioral assessment and tracking
- ✅ Parent-student relationships
- ✅ News and announcement system
- ✅ Audit logging for security
- ✅ Session management

## 📚 เอกสารเพิ่มเติม

- [Database Schema Documentation](../docs/DATABASE.md)
- [API Documentation](../docs/API.md)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

💡 **หมายเหตุ**: ไฟล์นี้จะถูกอัปเดตเมื่อมีการเปลี่ยนแปลง schema หรือ migration process

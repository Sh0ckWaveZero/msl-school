# Database Migration Guide

คู่มือการใช้งาน Migration Scripts สำหรับระบบโรงเรียน MSL

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

### 2. ตั้งค่า Environment

```bash
# สำหรับ Development (ใช้ database local)
export DATABASE_URL="postgresql://postgres:password@localhost:5432/msl_school_dev"

# หรือสร้างไฟล์ .env.local
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/msl_school_dev"' > .env.local
```

### 3. รัน Migration

```bash
# วิธีที่ 1: ใช้ script ที่เตรียมไว้
bun run db:migrate

# วิธีที่ 2: รันโดยตรง
./scripts/migrate.sh

# วิธีที่ 3: ใช้ Prisma CLI
npx prisma migrate dev --name init_complete_school_system
```

### 4. เพิ่มข้อมูลตัวอย่าง (Optional)

```bash
# เพิ่มข้อมูลตัวอย่าง
bun run db:seed

# หรือ
./scripts/seed.sh
```

## 📋 คำสั่ง Scripts ที่มีให้ใช้

### Database Migration

```bash
# สร้าง migration ใหม่และ apply
bun run db:migrate

# ดู migration status
npx prisma migrate status

# Apply migration (production)
npx prisma migrate deploy
```

### Database Management

```bash
# Reset database (⚠️ ลบข้อมูลทั้งหมด)
bun run db:reset

# เพิ่มข้อมูลตัวอย่าง
bun run db:seed

# เปิด Prisma Studio
bun run db:studio

# Generate Prisma Client
bun run db:generate

# Push schema changes (dev only)
bun run db:push
```

## 🔧 Troubleshooting

### ปัญหาที่อาจเจอ

**1. Database connection failed**
```bash
# ตรวจสอบว่า PostgreSQL เริ่มต้นแล้ว
pg_isready -h localhost -p 5432

# ตรวจสอบ DATABASE_URL
echo $DATABASE_URL
```

**2. Migration failed**
```bash
# ดู migration status
npx prisma migrate status

# ถ้าต้องการ reset และเริ่มใหม่
bun run db:reset
bun run db:migrate
```

**3. Permission denied on scripts**
```bash
# ให้สิทธิ์ execute กับ scripts
chmod +x scripts/*.sh
```

### การแก้ไขปัญหา Schema

**ถ้ามีการเปลี่ยนแปลง schema ใน development:**

```bash
# สร้าง migration ใหม่
npx prisma migrate dev --name describe_your_changes

# หรือ push แบบไม่สร้าง migration (dev only)
npx prisma db push
```

## 🔐 Production Deployment

### สำหรับ Production Environment

```bash
# 1. ตั้งค่า DATABASE_URL สำหรับ production
export DATABASE_URL="your_production_database_url"

# 2. Apply migrations (ไม่สร้าง migration ใหม่)
npx prisma migrate deploy

# 3. Generate client
npx prisma generate
```

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

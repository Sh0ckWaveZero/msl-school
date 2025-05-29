# API Documentation - MSL School API

## 🚀 ภาพรวม

MSL School API เป็น RESTful API สำหรับระบบจัดการโรงเรียนในประเทศไทย พัฒนาด้วย **Bun + Hono + ORPC** รองรับการทำงานของสถาบันการศึกษาระดับอาชีวศึกษา

### 🛠️ Technology Stack
- **Runtime**: Bun (v1.0+)
- **Framework**: Hono (Web Framework)
- **RPC**: ORPC (Type-safe RPC)
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod
- **Authentication**: Session-based

### 🏗️ Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│   ORPC Server   │◄──►│   PostgreSQL    │
│  (Web/Mobile)   │    │  (Bun + Hono)   │    │   + Prisma      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Type Safety   │    │   Middleware    │    │   Audit Log     │
│   (TypeScript)  │    │   (CORS, Auth)  │    │   (AuditLog)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 การติดตั้งและใช้งาน

### Prerequisites
- Bun v1.0+
- PostgreSQL 14+
- Node.js 18+ (สำหรับ tools)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd msl-school-api

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# แก้ไข DATABASE_URL และ configuration อื่นๆ

# Setup database
bunx prisma migrate dev
bunx prisma generate

# Start development server
bun run dev
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/msl_school_db"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"

# Authentication
JWT_SECRET="your-secret-key"
SESSION_SECRET="your-session-secret"
```

## 📡 API Endpoints

### Base URL
```
Development: http://localhost:3000
Production: https://api.your-domain.com
```

### 🔐 Authentication

#### Login
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "username": "student001",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "student001",
      "role": "Student",
      "profile": {...}
    },
    "session": {
      "token": "session-token",
      "expires": "2024-02-01T00:00:00Z"
    }
  }
}
```

#### Logout
```typescript
POST /api/auth/logout
Authorization: Bearer session-token

// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get Current User
```typescript
GET /api/auth/me
Authorization: Bearer session-token

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "student001",
    "role": "Student",
    "account": {...},
    "student": {...}
  }
}
```

### 👥 User Management

#### Get Users
```typescript
GET /api/users
Authorization: Bearer session-token
Query: ?page=1&limit=20&role=Student&search=นาย

// Response
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### Create User
```typescript
POST /api/users
Authorization: Bearer session-token
Content-Type: application/json

{
  "username": "student002",
  "password": "password123",
  "email": "student002@school.ac.th",
  "role": "Student",
  "account": {
    "firstName": "สมชาย",
    "lastName": "ใจดี",
    "idCard": "1234567890123"
  }
}
```

### 🎓 Academic Management

#### Get Classrooms
```typescript
GET /api/classrooms
Authorization: Bearer session-token
Query: ?departmentId=uuid&level=CERT&program=CONST

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "classroomId": "CERT1-CONST-1",
      "name": "ปวช.1/1-ช่างก่อสร้าง",
      "level": {
        "levelName": "ปวช.",
        "levelFullName": "ประกาศนียบัตรวิชาชีพ"
      },
      "program": {
        "name": "ช่างก่อสร้าง"
      },
      "students": [...],
      "teachers": [...]
    }
  ]
}
```

#### Get Students
```typescript
GET /api/students
Authorization: Bearer session-token
Query: ?classroomId=uuid&status=normal&graduationYear=2567

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "67001",
      "user": {
        "username": "67001",
        "account": {
          "firstName": "สมชาย",
          "lastName": "ใจดี"
        }
      },
      "classroom": {...},
      "program": {...},
      "status": "normal",
      "studentStatus": "กำลังศึกษา"
    }
  ]
}
```

### ✅ Check-in System

#### Flag Ceremony Check-in
```typescript
POST /api/checkin/flag-ceremony
Authorization: Bearer session-token
Content-Type: application/json

{
  "classroomId": "uuid",
  "teacherId": "uuid",
  "checkInDate": "2024-01-15",
  "checkInTime": "08:00",
  "attendance": {
    "present": ["student1", "student2"],
    "absent": ["student3"],
    "late": ["student4"],
    "leave": ["student5"],
    "internship": ["student6"]
  }
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "summary": {
      "total": 30,
      "present": 25,
      "absent": 2,
      "late": 1,
      "leave": 1,
      "internship": 1
    }
  }
}
```

#### Activity Check-in
```typescript
POST /api/checkin/activity
Authorization: Bearer session-token
Content-Type: application/json

{
  "classroomId": "uuid",
  "teacherId": "uuid",
  "activityName": "กิจกรรมวันไหว้ครู",
  "checkInDate": "2024-01-16",
  "attendance": {
    "present": ["student1", "student2"],
    "absent": ["student3", "student4"]
  }
}
```

#### Get Check-in Reports
```typescript
GET /api/checkin/reports
Authorization: Bearer session-token
Query: ?classroomId=uuid&startDate=2024-01-01&endDate=2024-01-31&type=flag-ceremony

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "flag-ceremony",
      "classroom": {...},
      "teacher": {...},
      "checkInDate": "2024-01-15",
      "checkInTime": "08:00",
      "summary": {
        "present": 25,
        "absent": 2,
        "late": 1,
        "leave": 1,
        "internship": 1
      },
      "status": "completed"
    }
  ]
}
```

### 📊 Grades & Assessment

#### Get Student Grades
```typescript
GET /api/grades/student/:studentId
Authorization: Bearer session-token
Query: ?termId=uuid&subjectGroupId=uuid

// Response
{
  "success": true,
  "data": {
    "student": {...},
    "term": {...},
    "grades": [
      {
        "course": {
          "courseId": "TH101",
          "courseName": "ภาษาไทย",
          "numberOfCredit": 3
        },
        "scores": {
          "midterm": { "score": 85, "maxScore": 100, "letterGrade": "A" },
          "final": { "score": 88, "maxScore": 100, "letterGrade": "A" },
          "assignment": { "score": 90, "maxScore": 100, "letterGrade": "A" }
        },
        "gpa": 4.0
      }
    ],
    "summary": {
      "totalCredits": 18,
      "gpa": 3.75
    }
  }
}
```

#### Record Grade
```typescript
POST /api/grades
Authorization: Bearer session-token
Content-Type: application/json

{
  "studentId": "uuid",
  "courseId": "uuid",
  "termId": "uuid",
  "gradeType": "midterm",
  "score": 85,
  "maxScore": 100,
  "note": "สอบดี มีการเตรียมตัวมาก"
}
```

### 🎯 Behavior Assessment

#### Record Good Behavior
```typescript
POST /api/behavior/goodness
Authorization: Bearer session-token
Content-Type: application/json

{
  "studentId": "uuid",
  "classroomId": "uuid",
  "goodnessScore": 5,
  "goodnessDetail": "ช่วยเหลือเพื่อนในห้องเรียน",
  "goodDate": "2024-01-15",
  "image": "base64-image-data"
}
```

#### Record Bad Behavior
```typescript
POST /api/behavior/badness
Authorization: Bearer session-token
Content-Type: application/json

{
  "studentId": "uuid",
  "classroomId": "uuid",
  "badnessScore": -3,
  "badnessDetail": "มาเรียนสาย ไม่ใส่เครื่องแบบถูกต้อง",
  "badDate": "2024-01-15",
  "image": "base64-image-data"
}
```

#### Get Behavior Summary
```typescript
GET /api/behavior/summary/:studentId
Authorization: Bearer session-token
Query: ?startDate=2024-01-01&endDate=2024-01-31

// Response
{
  "success": true,
  "data": {
    "student": {...},
    "summary": {
      "totalGoodnessScore": 25,
      "totalBadnessScore": -8,
      "netScore": 17,
      "goodnessCount": 5,
      "badnessCount": 2
    },
    "records": [...]
  }
}
```

### 🏠 Home Visit

#### Create Home Visit
```typescript
POST /api/home-visits
Authorization: Bearer session-token
Content-Type: application/json

{
  "studentId": "uuid",
  "classroomId": "uuid",
  "visitDate": "2024-01-20",
  "visitNo": 1,
  "academicYear": "2567",
  "visitDetail": {
    "purpose": "ติดตามการเรียน",
    "parents": ["พ่อ: นายสมชาย", "แม่: นางสมใส"],
    "homeCondition": "บ้านอยู่ในซอย สภาพแวดล้อมดี",
    "problems": ["ขาดแคลนอุปกรณ์การเรียน"],
    "solutions": ["ประสานงานกับแผนกวิชาฯ เพื่อสนับสนุนอุปกรณ์"],
    "nextVisit": "2024-06-01"
  },
  "visitMap": "google-maps-link",
  "images": ["base64-image1", "base64-image2"]
}
```

#### Get Home Visits
```typescript
GET /api/home-visits
Authorization: Bearer session-token
Query: ?studentId=uuid&academicYear=2567&classroomId=uuid

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student": {...},
      "classroom": {...},
      "visitDate": "2024-01-20",
      "visitNo": 1,
      "academicYear": "2567",
      "visitDetail": {...},
      "visitMap": "google-maps-link",
      "images": ["image1.jpg", "image2.jpg"],
      "createdBy": "teacher-uuid"
    }
  ]
}
```

### 📅 Schedule Management

#### Get Class Schedule
```typescript
GET /api/schedules/classroom/:classroomId
Authorization: Bearer session-token
Query: ?termId=uuid&dayOfWeek=1

// Response
{
  "success": true,
  "data": {
    "classroom": {...},
    "term": {...},
    "schedule": [
      {
        "dayOfWeek": 1,
        "periods": [
          {
            "startTime": "08:30",
            "endTime": "10:30",
            "course": {
              "courseId": "TH101",
              "courseName": "ภาษาไทย"
            },
            "teacher": {
              "teacherId": "T001",
              "name": "อาจารย์สมชาย"
            },
            "roomNumber": "A101"
          }
        ]
      }
    ]
  }
}
```

#### Create Schedule
```typescript
POST /api/schedules
Authorization: Bearer session-token
Content-Type: application/json

{
  "classroomId": "uuid",
  "courseId": "uuid",
  "teacherId": "uuid",
  "termId": "uuid",
  "dayOfWeek": 1,
  "startTime": "08:30",
  "endTime": "10:30",
  "roomNumber": "A101"
}
```

### 📰 News & Announcements

#### Get News
```typescript
GET /api/news
Authorization: Bearer session-token
Query: ?targetRole=Student&priority=high&page=1&limit=10

// Response
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "uuid",
        "title": "ประกาศเปิดลงทะเบียนเรียน ภาคเรียนที่ 2/2567",
        "excerpt": "นักเรียนนักศึกษาสามารถลงทะเบียนเรียนได้ตั้งแต่วันที่ 1-15 กุมภาพันธ์ 2567",
        "content": "...",
        "images": ["announcement1.jpg"],
        "publishDate": "2024-01-15T08:00:00Z",
        "expireDate": "2024-02-15T23:59:59Z",
        "priority": "high",
        "targetRole": ["Student", "Teacher"],
        "views": 250
      }
    ],
    "pagination": {...}
  }
}
```

#### Create News
```typescript
POST /api/news
Authorization: Bearer session-token
Content-Type: application/json

{
  "title": "ประกาศสำคัญ",
  "content": "เนื้อหาข่าวสาร...",
  "excerpt": "สรุปข่าว...",
  "images": ["base64-image"],
  "publishDate": "2024-01-15T08:00:00Z",
  "expireDate": "2024-02-15T23:59:59Z",
  "priority": "high",
  "targetRole": ["Student", "Teacher"],
  "isPublished": true
}
```

## 🔒 Authentication & Authorization

### Session Management
```typescript
// Session-based authentication
// Session token ส่งผ่าน Authorization header
Authorization: Bearer <session-token>

// Session expires หลัง 24 ชั่วโมง (configurable)
// Auto-refresh ก่อนหมดอายุ 1 ชั่วโมง
```

### Role-based Access Control
```typescript
// Role hierarchy
enum Role {
  Admin    // เข้าถึงได้ทุกอย่าง
  Teacher  // จัดการห้องเรียนที่รับผิดชอบ
  Student  // ดูข้อมูลตัวเอง
  Parent   // ดูข้อมูลลูก
  User     // ดูข้อมูลพื้นฐาน
}

// Permission-based access
{
  "canViewStudents": ["Admin", "Teacher"],
  "canEditGrades": ["Admin", "Teacher"],
  "canViewOwnData": ["Student", "Parent"],
  "canManageUsers": ["Admin"]
}
```

### Permission Examples
```typescript
// Teacher permissions
{
  "classroom": {
    "view": "assigned_only",    // เฉพาะห้องที่รับผิดชอบ
    "edit": "assigned_only"
  },
  "students": {
    "view": "classroom_only",   // นักเรียนในห้องที่สอน
    "edit": "classroom_only"
  },
  "grades": {
    "view": "courses_teaching", // เฉพาะวิชาที่สอน
    "edit": "courses_teaching"
  }
}

// Student permissions
{
  "profile": {
    "view": "own_only",         // ข้อมูลตัวเองเท่านั้น
    "edit": "limited"           // แก้ไขได้บางส่วน
  },
  "grades": {
    "view": "own_only"          // คะแนนตัวเองเท่านั้น
  }
}
```

## 📊 Error Handling

### Error Response Format
```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
    "details": [
      {
        "field": "username",
        "message": "ชื่อผู้ใช้ต้องมีความยาว 3-20 ตัวอักษร"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req-uuid"
}
```

### Common Error Codes
```typescript
// Authentication Errors
UNAUTHORIZED           // 401 - ไม่ได้ login
FORBIDDEN             // 403 - ไม่มีสิทธิ์
TOKEN_EXPIRED         // 401 - token หมดอายุ

// Validation Errors  
VALIDATION_ERROR      // 400 - ข้อมูลไม่ถูกต้อง
REQUIRED_FIELD        // 400 - ขาดข้อมูลจำเป็น
INVALID_FORMAT        // 400 - รูปแบบข้อมูลผิด

// Business Logic Errors
DUPLICATE_ENTRY       // 409 - ข้อมูลซ้ำ
RESOURCE_NOT_FOUND    // 404 - ไม่พบข้อมูล
OPERATION_NOT_ALLOWED // 422 - ไม่สามารถทำรายการได้

// Server Errors
INTERNAL_ERROR        // 500 - ข้อผิดพลาดระบบ
DATABASE_ERROR        // 500 - ข้อผิดพลาดฐานข้อมูล
```

## 🚀 Rate Limiting

### Rate Limits
```typescript
// Global rate limit
GET/POST: 100 requests/minute per IP

// Authentication endpoints
POST /api/auth/login: 5 requests/minute per IP
POST /api/auth/register: 3 requests/minute per IP

// File upload endpoints
POST /api/upload/*: 10 requests/minute per user

// Heavy operations
GET /api/reports/*: 20 requests/minute per user
```

### Rate Limit Headers
```typescript
// Response headers
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642234567
```

## 📁 File Upload

### Image Upload
```typescript
POST /api/upload/image
Authorization: Bearer session-token
Content-Type: multipart/form-data

// Form data
file: <image-file>
folder: "behavior" | "home-visit" | "profile" | "news"

// Response
{
  "success": true,
  "data": {
    "filename": "image-uuid.jpg",
    "url": "/uploads/behavior/image-uuid.jpg",
    "size": 102400,
    "mimeType": "image/jpeg"
  }
}
```

### File Restrictions
```typescript
// Image files
maxSize: 5MB
allowedTypes: ["image/jpeg", "image/png", "image/webp"]
dimensions: max 2048x2048

// Document files  
maxSize: 10MB
allowedTypes: ["application/pdf", "application/msword"]
```

## 🔧 Development Tools

### Database Seeding
```bash
# Seed development data
bun run db:seed

# Seed specific data
bun run db:seed:users
bun run db:seed:academic
bun run db:seed:sample-data
```

### API Testing
```bash
# Run test suite
bun test

# Run specific test
bun test auth
bun test students
bun test checkin

# Load testing
bun run load-test
```

### Database Management
```bash
# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Reset database
bunx prisma migrate reset

# Open Prisma Studio
bunx prisma studio
```

## 🌐 CORS Configuration

### Allowed Origins
```typescript
// Development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

// Production  
CORS_ORIGIN=https://school.your-domain.com,https://admin.your-domain.com

// Allowed Methods
methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]

// Allowed Headers
headers: ["Content-Type", "Authorization", "X-Requested-With"]
```

## 📈 Monitoring & Logging

### Health Check
```typescript
GET /api/health

// Response
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "database": "connected",
  "memory": {
    "used": "45MB",
    "total": "512MB"
  }
}
```

### Performance Metrics
```typescript
GET /api/metrics (Admin only)

// Response
{
  "requests": {
    "total": 15420,
    "success": 14980,
    "error": 440,
    "avgResponseTime": "125ms"
  },
  "database": {
    "activeConnections": 8,
    "avgQueryTime": "45ms"
  }
}
```

---

*เอกสารนี้อัปเดตล่าสุด: 29 พฤษภาคม 2025*

สำหรับข้อมูลเพิ่มเติม กรุณาดู:
- [Database Documentation](./DATABASE.md)
- [Development Guide](./DEVELOPMENT.md)
- [Deployment Guide](./DEPLOYMENT.md)

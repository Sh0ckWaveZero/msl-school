# API Documentation - MSL School

## 🚀 ภาพรวม

MSL School เป็น RESTful API สำหรับระบบจัดการโรงเรียนในประเทศไทย พัฒนาด้วย **Bun + Hono + ORPC** รองรับการทำงานของสถาบันการศึกษาระดับอาชีวศึกษา

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
cd msl-school

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

### 🧪 Health Check (Current Implementation)

#### Health Check
```typescript
POST /rpc/healthCheck
Content-Type: application/json

// Request Body
{}

// Response
{
  "result": "OK"
}
```

### 🔧 Current API Architecture

โปรเจคใช้ **ORPC (Type-safe RPC)** แทน REST API แบบดั้งเดิม:

1. **Endpoint Pattern**: `/rpc/{procedureName}`
2. **Method**: ใช้ POST สำหรับทุก RPC calls
3. **Type Safety**: Zod validation + TypeScript end-to-end
4. **Context**: Session-based authentication (ยังไม่ได้ implement)

### 📋 Available API Endpoints

#### 🔐 Authentication
- `auth.login` - User authentication
- `auth.logout` - End user session
- `auth.me` - Get current user profile
- `auth.refresh` - Refresh session token
- `auth.forgotPassword` - Request password reset
- `auth.resetPassword` - Reset password with token

#### 👥 User Management
- `users.list` - Get paginated users list
- `users.getById` - Get user by ID
- `users.create` - Create new user account
- `users.update` - Update user information
- `users.delete` - Soft delete user
- `users.restore` - Restore deleted user
- `users.changePassword` - Change user password
- `users.updateProfile` - Update user profile

#### 🏫 Academic Management
- `departments.list` - Get all departments
- `departments.create` - Create new department
- `departments.update` - Update department
- `departments.delete` - Delete department
- `programs.list` - Get academic programs
- `programs.create` - Create new program
- `programs.update` - Update program details
- `classrooms.list` - Get classrooms
- `classrooms.create` - Create new classroom
- `classrooms.update` - Update classroom info
- `courses.list` - Get courses
- `courses.create` - Create new course
- `courses.update` - Update course details
- `schedules.list` - Get class schedules
- `schedules.create` - Create schedule
- `schedules.update` - Update schedule

#### 📚 Student Management  
- `students.list` - Get students with filters
- `students.getById` - Get student by ID
- `students.create` - Register new student
- `students.update` - Update student info
- `students.delete` - Remove student
- `students.enroll` - Enroll in course
- `students.unenroll` - Remove from course
- `students.getGrades` - Get student grades
- `students.updateGrade` - Update student grade
- `students.getAttendance` - Get attendance records
- `students.markAttendance` - Mark attendance

#### 👨‍🏫 Teacher Management
- `teachers.list` - Get teachers list
- `teachers.getById` - Get teacher details
- `teachers.create` - Create teacher account
- `teachers.update` - Update teacher info
- `teachers.delete` - Remove teacher
- `teachers.getCourses` - Get assigned courses
- `teachers.assignCourse` - Assign course to teacher
- `teachers.unassignCourse` - Remove course assignment

#### ✅ Attendance System
- `attendance.checkIn` - Student check-in
- `attendance.checkOut` - Student check-out
- `attendance.getHistory` - Get attendance history
- `attendance.getDailySummary` - Daily attendance summary
- `attendance.getWeeklySummary` - Weekly summary
- `attendance.getMonthlySummary` - Monthly summary
- `attendance.markAbsent` - Mark student absent
- `attendance.markLate` - Mark student late

#### 📊 Grades & Assessment
- `grades.list` - Get grades for student/course
- `grades.create` - Create new grade entry
- `grades.update` - Update existing grade
- `grades.delete` - Remove grade entry
- `grades.getGPA` - Calculate student GPA
- `grades.getTranscript` - Get official transcript
- `grades.bulkUpdate` - Update multiple grades
- `assessments.list` - Get assessments
- `assessments.create` - Create assessment
- `assessments.update` - Update assessment

#### 🎯 Behavior Assessment
- `behavior.list` - Get behavior records
- `behavior.create` - Create behavior entry
- `behavior.update` - Update behavior record
- `behavior.delete` - Remove behavior record
- `behavior.getScore` - Get behavior score
- `behavior.getSummary` - Get behavior summary
- `behavior.addNote` - Add behavior note

#### 🏠 Home Visit Management
- `homeVisits.list` - Get home visit records
- `homeVisits.create` - Schedule home visit
- `homeVisits.update` - Update visit details
- `homeVisits.complete` - Mark visit as completed
- `homeVisits.addReport` - Add visit report
- `homeVisits.getReports` - Get visit reports
- `homeVisits.uploadImages` - Upload visit images

#### 📅 Schedule Management
- `schedules.getDaily` - Get daily schedule
- `schedules.getWeekly` - Get weekly schedule
- `schedules.getMonthly` - Get monthly schedule
- `schedules.createEvent` - Create scheduled event
- `schedules.updateEvent` - Update event
- `schedules.deleteEvent` - Cancel event
- `schedules.getConflicts` - Check schedule conflicts

#### 📰 News & Announcements
- `news.list` - Get news/announcements
- `news.getById` - Get news by ID
- `news.create` - Create news article
- `news.update` - Update news content
- `news.delete` - Remove news
- `news.publish` - Publish news
- `news.unpublish` - Unpublish news
- `announcements.list` - Get announcements
- `announcements.create` - Create announcement
- `announcements.markRead` - Mark as read

#### 🗓️ Holiday & Calendar
- `holidays.list` - Get holidays list
- `holidays.create` - Create holiday
- `holidays.update` - Update holiday
- `holidays.delete` - Remove holiday
- `calendar.getEvents` - Get calendar events
- `calendar.createEvent` - Create calendar event
- `calendar.updateEvent` - Update event
- `calendar.deleteEvent` - Delete event

#### 📈 Reports & Analytics
- `reports.attendance` - Attendance reports
- `reports.grades` - Academic performance reports
- `reports.behavior` - Behavior analytics
- `reports.enrollment` - Enrollment statistics
- `reports.homeVisits` - Home visit reports
- `reports.export` - Export reports to Excel/PDF

### 💡 ORPC Implementation Examples
### 💡 ORPC Implementation Examples

#### Authentication Router

```typescript
// File: src/routers/auth.ts
import { z } from "zod";
import { publicProcedure } from "@/lib/orpc";
import { ORPCError } from "@orpc/server";

const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.enum(["admin", "teacher", "student"]),
  profile: z.object({
    firstName: z.string(),
    lastName: z.string(),
    idCard: z.string().optional(),
  }),
});

export const authRouter = {
  login: publicProcedure
    .input(LoginSchema)
    .output(z.object({
      user: UserSchema,
      session: z.object({
        token: z.string(),
        expiresAt: z.date(),
      }),
    }))
    .handler(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
        include: { account: true },
      });

      if (!user || !await verifyPassword(input.password, user.password)) {
        throw new ORPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const session = await createSession(user.id);
      
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: {
            firstName: user.account?.firstName || "",
            lastName: user.account?.lastName || "",
            idCard: user.account?.idCard,
          },
        },
        session: {
          token: session.token,
          expiresAt: session.expiresAt,
        },
      };
    }),

  me: publicProcedure
    .output(UserSchema)
    .handler(async ({ ctx }) => {
      // TODO: Add authentication check here
      // Check if user is authenticated: if (!ctx.session) throw error
      
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session?.userId }, // Add proper session handling
        include: { account: true },
      });

      if (!user) {
        throw new ORPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: {
          firstName: user.account?.firstName || "",
          lastName: user.account?.lastName || "",
          idCard: user.account?.idCard,
        },
      };
    }),

  logout: publicProcedure
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ ctx }) => {
      // TODO: Add authentication check here
      // Check if user is authenticated: if (!ctx.session) throw error
      
      await ctx.prisma.session.delete({
        where: { token: ctx.session?.token },
      });
      
      return { success: true };
    }),
};
```

#### Student Management Router

```typescript
// File: src/routers/students.ts
import { z } from "zod";
import { publicProcedure } from "@/lib/orpc";
import { ORPCError } from "@orpc/server";

const CreateStudentSchema = z.object({
  studentId: z.string().min(1).max(20),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  address: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
});

const StudentSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string().nullable(),
  dateOfBirth: z.date().nullable(),
  address: z.string().nullable(),
  enrollments: z.array(z.object({
    id: z.string(),
    course: z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
    }),
    enrolledAt: z.date(),
  })).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  departmentId: z.string().optional(),
  programId: z.string().optional(),
  level: z.enum(["CERT", "HVD", "TECH", "OTHER"]).optional(),
});

export const studentsRouter = {
  list: publicProcedure
    .input(PaginationSchema)
    .output(z.object({
      students: z.array(StudentSchema),
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      }),
    }))
    .handler(async ({ input, ctx }) => {
      // TODO: Add authentication check here
      // Check if user is authenticated and has proper permissions
      
      const { page, limit, search, departmentId, programId, level } = input;
      const skip = (page - 1) * limit;

      const where: any = {
        deletedAt: null,
      };

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { studentId: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      if (departmentId || programId || level) {
        where.enrollments = {
          some: {
            course: {
              ...(departmentId && { departmentId }),
              program: {
                ...(programId && { id: programId }),
                ...(level && { level }),
              },
            },
          },
        };
      }

      const [students, total] = await Promise.all([
        ctx.prisma.student.findMany({
          where,
          skip,
          take: limit,
          include: {
            enrollments: {
              include: {
                course: {
                  select: { id: true, name: true, code: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        ctx.prisma.student.count({ where }),
      ]);

      return {
        students,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(StudentSchema.optional())
    .handler(async ({ input, ctx }) => {
      // TODO: Add authentication check here
      
      const student = await ctx.prisma.student.findUnique({
        where: { id: input.id, deletedAt: null },
        include: {
          enrollments: {
            include: {
              course: {
                select: { id: true, name: true, code: true },
              },
            },
          },
        },
      });

      return student;
    }),

  create: publicProcedure
    .input(CreateStudentSchema)
    .output(z.object({
      id: z.string(),
      message: z.string(),
    }))
    .handler(async ({ input, ctx }) => {
      // TODO: Add teacher/admin role check here
      
      // Check if student ID already exists
      const existingStudent = await ctx.prisma.student.findUnique({
        where: { studentId: input.studentId },
      });

      if (existingStudent) {
        throw new ORPCError({
          code: "CONFLICT",
          message: `Student ID ${input.studentId} already exists`,
        });
      }

      // Check if email already exists
      const existingEmail = await ctx.prisma.student.findUnique({
        where: { email: input.email },
      });

      if (existingEmail) {
        throw new ORPCError({
          code: "CONFLICT",
          message: `Email ${input.email} already exists`,
        });
      }

      const student = await ctx.prisma.student.create({
        data: {
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        id: student.id,
        message: "Student created successfully",
      };
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: CreateStudentSchema.partial(),
    }))
    .output(z.object({
      success: z.boolean(),
      message: z.string(),
    }))
    .handler(async ({ input, ctx }) => {
      // TODO: Add teacher/admin role check here
      
      const { id, data } = input;

      const existingStudent = await ctx.prisma.student.findUnique({
        where: { id, deletedAt: null },
      });

      if (!existingStudent) {
        throw new ORPCError({
          code: "NOT_FOUND",
          message: "Student not found",
        });
      }

      // Check for conflicts if updating unique fields
      if (data.studentId && data.studentId !== existingStudent.studentId) {
        const conflictingStudent = await ctx.prisma.student.findUnique({
          where: { studentId: data.studentId },
        });

        if (conflictingStudent) {
          throw new ORPCError({
            code: "CONFLICT",
            message: `Student ID ${data.studentId} already exists`,
          });
        }
      }

      if (data.email && data.email !== existingStudent.email) {
        const conflictingEmail = await ctx.prisma.student.findUnique({
          where: { email: data.email },
        });

        if (conflictingEmail) {
          throw new ORPCError({
            code: "CONFLICT",
            message: `Email ${data.email} already exists`,
          });
        }
      }

      await ctx.prisma.student.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: "Student updated successfully",
      };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({
      success: z.boolean(),
      message: z.string(),
    }))
    .handler(async ({ input, ctx }) => {
      // TODO: Add teacher/admin role check here
      
      const student = await ctx.prisma.student.findUnique({
        where: { id: input.id, deletedAt: null },
        include: {
          enrollments: true,
          checkIns: true,
          grades: true,
        },
      });

      if (!student) {
        throw new ORPCError({
          code: "NOT_FOUND",
          message: "Student not found",
        });
      }

      // Soft delete - just mark as deleted
      await ctx.prisma.student.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: "Student deleted successfully",
      };
    }),
};
```

#### Attendance Router

```typescript
// File: src/routers/attendance.ts
import { z } from "zod";
import { publicProcedure } from "@/lib/orpc";
import { ORPCError } from "@orpc/server";

const CheckInSchema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid().optional(),
  location: z.string().optional(),
  note: z.string().optional(),
});

const AttendanceSchema = z.object({
  id: z.string(),
  student: z.object({
    id: z.string(),
    studentId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  checkInTime: z.date(),
  checkOutTime: z.date().nullable(),
  status: z.enum(["PRESENT", "LATE", "ABSENT", "EXCUSED"]),
  location: z.string().nullable(),
  note: z.string().nullable(),
  createdAt: z.date(),
});

export const attendanceRouter = {
  checkIn: publicProcedure
    .input(CheckInSchema)
    .output(z.object({
      id: z.string(),
      checkInTime: z.date(),
      message: z.string(),
    }))
    .handler(async ({ input, ctx }) => {
      // TODO: Add authentication check here
      
      const { studentId, courseId, location, note } = input;

      // Check if student exists
      const student = await ctx.prisma.student.findUnique({
        where: { id: studentId, deletedAt: null },
      });

      if (!student) {
        throw new ORPCError({
          code: "NOT_FOUND",
          message: "Student not found",
        });
      }

      // Check if already checked in today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingCheckIn = await ctx.prisma.checkIn.findFirst({
        where: {
          studentId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (existingCheckIn) {
        throw new ORPCError({
          code: "CONFLICT",
          message: "Student already checked in today",
        });
      }

      const now = new Date();
      const morningCutoff = new Date();
      morningCutoff.setHours(8, 30, 0, 0); // 8:30 AM

      const status = now > morningCutoff ? "LATE" : "PRESENT";

      const checkIn = await ctx.prisma.checkIn.create({
        data: {
          studentId,
          courseId,
          checkInTime: now,
          status,
          location,
          note,
          createdAt: now,
          updatedAt: now,
        },
      });

      return {
        id: checkIn.id,
        checkInTime: checkIn.checkInTime,
        message: `Check-in successful (${status})`,
      };
    }),

  checkOut: publicProcedure
    .input(z.object({
      checkInId: z.string().uuid(),
      note: z.string().optional(),
    }))
    .output(z.object({
      success: z.boolean(),
      checkOutTime: z.date(),
      message: z.string(),
    }))
    .handler(async ({ input, ctx }) => {
      // TODO: Add authentication check here
      
      const { checkInId, note } = input;

      const checkIn = await ctx.prisma.checkIn.findUnique({
        where: { id: checkInId },
      });

      if (!checkIn) {
        throw new ORPCError({
          code: "NOT_FOUND",
          message: "Check-in record not found",
        });
      }

      if (checkIn.checkOutTime) {
        throw new ORPCError({
          code: "CONFLICT",
          message: "Already checked out",
        });
      }

      const now = new Date();

      const updatedCheckIn = await ctx.prisma.checkIn.update({
        where: { id: checkInId },
        data: {
          checkOutTime: now,
          note: note ? `${checkIn.note || ""}\nCheckout: ${note}`.trim() : checkIn.note,
          updatedAt: now,
        },
      });

      return {
        success: true,
        checkOutTime: now,
        message: "Check-out successful",
      };
    }),

  getHistory: publicProcedure
    .input(z.object({
      studentId: z.string().uuid().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .output(z.object({
      attendance: z.array(AttendanceSchema),
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      }),
    }))
    .handler(async ({ input, ctx }) => {
      // TODO: Add authentication check here
      
      const { studentId, startDate, endDate, page, limit } = input;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (studentId) {
        where.studentId = studentId;
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const [attendance, total] = await Promise.all([
        ctx.prisma.checkIn.findMany({
          where,
          skip,
          take: limit,
          include: {
            student: {
              select: {
                id: true,
                studentId: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        ctx.prisma.checkIn.count({ where }),
      ]);

      return {
        attendance,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  getDailySummary: publicProcedure
    .input(z.object({
      date: z.coerce.date().default(() => new Date()),
      departmentId: z.string().uuid().optional(),
    }))
    .output(z.object({
      date: z.date(),
      summary: z.object({
        totalStudents: z.number(),
        present: z.number(),
        late: z.number(),
        absent: z.number(),
        attendanceRate: z.number(),
      }),
      details: z.array(z.object({
        department: z.string(),
        totalStudents: z.number(),
        present: z.number(),
        late: z.number(),
        absent: z.number(),
        attendanceRate: z.number(),
      })),
    }))
    .handler(async ({ input, ctx }) => {
      // TODO: Add teacher/admin role check here
      
      const { date, departmentId } = input;

      // Set date range for the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Build where clause for students
      const studentWhere: any = { deletedAt: null };
      if (departmentId) {
        studentWhere.enrollments = {
          some: {
            course: {
              departmentId,
            },
          },
        };
      }

      // Get total students
      const totalStudents = await ctx.prisma.student.count({
        where: studentWhere,
      });

      // Get attendance for the day
      const attendanceRecords = await ctx.prisma.checkIn.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          student: studentWhere,
        },
        include: {
          student: {
            include: {
              enrollments: {
                include: {
                  course: {
                    include: {
                      department: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Calculate summary
      const present = attendanceRecords.filter(r => r.status === "PRESENT").length;
      const late = attendanceRecords.filter(r => r.status === "LATE").length;
      const absent = totalStudents - attendanceRecords.length;
      const attendanceRate = totalStudents > 0 ? ((present + late) / totalStudents) * 100 : 0;

      // Calculate department-wise details
      const departmentMap = new Map();
      
      // Initialize with all departments
      const departments = await ctx.prisma.department.findMany();
      departments.forEach(dept => {
        departmentMap.set(dept.id, {
          department: dept.name,
          totalStudents: 0,
          present: 0,
          late: 0,
          absent: 0,
          attendanceRate: 0,
        });
      });

      // Count students per department
      const studentsByDept = await ctx.prisma.student.findMany({
        where: studentWhere,
        include: {
          enrollments: {
            include: {
              course: {
                include: {
                  department: true,
                },
              },
            },
          },
        },
      });

      studentsByDept.forEach(student => {
        student.enrollments.forEach(enrollment => {
          const deptId = enrollment.course.departmentId;
          if (departmentMap.has(deptId)) {
            departmentMap.get(deptId).totalStudents++;
          }
        });
      });

      // Count attendance per department
      attendanceRecords.forEach(record => {
        record.student.enrollments.forEach(enrollment => {
          const deptId = enrollment.course.departmentId;
          if (departmentMap.has(deptId)) {
            const deptData = departmentMap.get(deptId);
            if (record.status === "PRESENT") {
              deptData.present++;
            } else if (record.status === "LATE") {
              deptData.late++;
            }
          }
        });
      });

      // Calculate absent and attendance rate for each department
      departmentMap.forEach((deptData) => {
        deptData.absent = deptData.totalStudents - deptData.present - deptData.late;
        deptData.attendanceRate = deptData.totalStudents > 0 
          ? ((deptData.present + deptData.late) / deptData.totalStudents) * 100 
          : 0;
      });

      return {
        date,
        summary: {
          totalStudents,
          present,
          late,
          absent,
          attendanceRate,
        },
        details: Array.from(departmentMap.values()),
      };
    }),
};
```

### 📱 Client Usage Examples

### 📱 Client Usage Examples

#### TypeScript Client Setup

```typescript
// File: client/api.ts
import { createORPCClient } from "@orpc/client";
import type { AppRouter } from "../server/src/routers";

const client = createORPCClient<AppRouter>({
  baseURL: "http://localhost:3000/rpc",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authentication context (TODO: implement session handling)
export const getAuthenticatedClient = (sessionToken: string) => {
  return client.withHeaders({
    Authorization: `Bearer ${sessionToken}`,
  });
};

export default client;
```

#### Authentication Flow

```typescript
// Login example
try {
  const loginResult = await client.auth.login({
    username: "teacher001",
    password: "password123",
  });

  // Store session token
  localStorage.setItem("session_token", loginResult.session.token);
  localStorage.setItem("user", JSON.stringify(loginResult.user));
  
  console.log("Logged in as:", loginResult.user.username);
} catch (error) {
  console.error("Login failed:", error.message);
}

// Get current user (requires authentication in context)
try {
  const currentUser = await client.auth.me();
  console.log("Current user:", currentUser);
} catch (error) {
  console.error("Not authenticated:", error.message);
}

// Logout
try {
  await client.auth.logout();
  localStorage.removeItem("session_token");
  localStorage.removeItem("user");
} catch (error) {
  console.error("Logout failed:", error.message);
}
```

#### Student Management

```typescript
// Get students list with pagination
try {
  const studentsResult = await client.students.list({
    page: 1,
    limit: 20,
    search: "john",
    departmentId: "dept-123",
    level: "CERT",
  });

  console.log("Students:", studentsResult.students);
  console.log("Total pages:", studentsResult.pagination.totalPages);
} catch (error) {
  console.error("Failed to fetch students:", error.message);
}

// Create new student (requires teacher/admin role)
try {
  const newStudent = await client.students.create({
    studentId: "ST2024001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@school.ac.th",
    phoneNumber: "081-234-5678",
    dateOfBirth: new Date("2000-01-15"),
    address: "123 Main St, Bangkok",
    guardianName: "Jane Doe",
    guardianPhone: "081-234-5679",
  });

  console.log("New student ID:", newStudent.id);
} catch (error) {
  console.error("Failed to create student:", error.message);
}

// Get student by ID
try {
  const student = await client.students.getById({
    id: "student-uuid-here",
  });

  if (student) {
    console.log("Student:", student.firstName, student.lastName);
    console.log("Enrollments:", student.enrollments);
  }
} catch (error) {
  console.error("Student not found:", error.message);
}

// Update student (requires teacher/admin role)
try {
  await client.students.update({
    id: "student-uuid-here",
    data: {
      phoneNumber: "081-999-8888",
      address: "456 New Address, Bangkok",
    },
  });
  
  console.log("Student updated successfully");
} catch (error) {
  console.error("Failed to update student:", error.message);
}

// Delete student (soft delete, requires teacher/admin role)
try {
  await client.students.delete({
    id: "student-uuid-here",
  });
  
  console.log("Student deleted successfully");
} catch (error) {
  console.error("Failed to delete student:", error.message);
}
```

#### Attendance Management

```typescript
// Student check-in
try {
  const checkInResult = await client.attendance.checkIn({
    studentId: "student-uuid-here",
    courseId: "course-uuid-here", // optional
    location: "Main Building",
    note: "Regular attendance",
  });

  console.log("Check-in time:", checkInResult.checkInTime);
  console.log("Status:", checkInResult.message);
} catch (error) {
  console.error("Check-in failed:", error.message);
}

// Student check-out
try {
  await client.attendance.checkOut({
    checkInId: "checkin-uuid-here",
    note: "End of day",
  });
  
  console.log("Check-out successful");
} catch (error) {
  console.error("Check-out failed:", error.message);
}

// Get attendance history
try {
  const attendanceHistory = await client.attendance.getHistory({
    studentId: "student-uuid-here",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    page: 1,
    limit: 50,
  });

  console.log("Attendance records:", attendanceHistory.attendance);
} catch (error) {
  console.error("Failed to fetch attendance:", error.message);
}

// Get daily attendance summary (requires teacher/admin role)
try {
  const dailySummary = await client.attendance.getDailySummary({
    date: new Date(),
    departmentId: "dept-123", // optional
  });

  console.log("Today's attendance rate:", dailySummary.summary.attendanceRate);
  console.log("Department details:", dailySummary.details);
} catch (error) {
  console.error("Failed to fetch summary:", error.message);
}
```

#### Error Handling

```typescript
import { ORPCError } from "@orpc/client";

try {
  const result = await client.students.create({
    studentId: "ST2024001",
    firstName: "John",
    lastName: "Doe",
    email: "john@school.ac.th",
  });
  console.log("Success:", result);
} catch (error) {
  if (error instanceof ORPCError) {
    switch (error.code) {
      case "UNAUTHORIZED":
        console.error("Please log in first");
        // Redirect to login page
        break;
      case "FORBIDDEN":
        console.error("Access denied");
        break;
      case "CONFLICT":
        console.error("Student ID or email already exists");
        break;
      case "NOT_FOUND":
        console.error("Resource not found");
        break;
      default:
        console.error("API Error:", error.message);
    }
  } else {
    console.error("Network Error:", error);
  }
}
```

### 🔒 Authentication & Authorization

#### Session Management

```typescript
// Check if user is authenticated
function isAuthenticated(): boolean {
  const token = localStorage.getItem("session_token");
  const user = localStorage.getItem("user");
  return !!(token && user);
}

// Get user role
function getUserRole(): string | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  const user = JSON.parse(userStr);
  return user.role;
}

// Check if user has specific role
function hasRole(requiredRole: string): boolean {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  // Admin has access to everything
  if (userRole === "admin") return true;
  
  return userRole === requiredRole;
}

// Route protection example
function requireAuth(requiredRole?: string) {
  if (!isAuthenticated()) {
    throw new Error("Authentication required");
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    throw new Error("Insufficient permissions");
  }
}

// Usage
try {
  requireAuth("teacher"); // Only teachers and admins
  const students = await authenticatedClient.students.list({});
} catch (error) {
  console.error(error.message);
}
```

#### Token Refresh

```typescript
// Auto-refresh token before expiration
class AuthManager {
  private refreshTimer?: NodeJS.Timeout;
  
  setSession(session: { token: string; expiresAt: Date }) {
    localStorage.setItem("session_token", session.token);
    
    // Schedule refresh 5 minutes before expiration
    const refreshTime = session.expiresAt.getTime() - Date.now() - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshSession();
      }, refreshTime);
    }
  }
  
  async refreshSession() {
    try {
      const result = await authenticatedClient.auth.refresh();
      this.setSession(result.session);
    } catch (error) {
      console.error("Session refresh failed:", error);
      this.logout();
    }
  }
  
  logout() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    localStorage.removeItem("session_token");
    localStorage.removeItem("user");
  }
}

const authManager = new AuthManager();
```

### 📊 Response Formats

#### Success Response

```json
{
  "result": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "message": "Operation completed successfully"
  }
}
```

#### Error Response

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Student ID ST2024001 already exists",
    "data": {
      "path": "students.create",
      "input": {
        "studentId": "ST2024001"
      }
    }
  }
}
```

#### Paginated Response

```json
{
  "result": {
    "students": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "studentId": "ST2024001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@school.ac.th",
        "enrollments": [
          {
            "id": "enrollment-id",
            "course": {
              "id": "course-id",
              "name": "Computer Science",
              "code": "CS101"
            },
            "enrolledAt": "2024-01-15T08:00:00.000Z"
          }
        ],
        "createdAt": "2024-01-15T08:00:00.000Z",
        "updatedAt": "2024-01-15T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### 🔧 Development Tools

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

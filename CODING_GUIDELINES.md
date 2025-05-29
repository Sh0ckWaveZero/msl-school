# 📝 Coding Guidelines & Best Practices

คู่มือการเขียนโค้ดและแนวปฏิบัติที่ดีสำหรับ MSL School

## 🌟 หลักการทั่วไป (General Principles)

### Code Quality Philosophy

1. **ความเรียบง่าย (Simplicity)** มากกว่า Abstraction
2. **อ่านง่าย (Readability)** มากกว่า Performance
3. **Type Safety** ทุกจุดที่เป็นไปได้
4. **Fail Fast** - ตรวจสอบข้อผิดพลาดเร็วที่สุด
5. **Self-Documenting Code** - โค้ดที่อธิบายตัวเอง

### Architectural Principles

```typescript
// ✅ Good: Simple and explicit
function createStudent(data: CreateStudentInput): Promise<Student> {
  return prisma.student.create({ data });
}

// ❌ Avoid: Over-engineered
class StudentFactory {
  constructor(private repository: IStudentRepository) {}
  async createEntity(builder: StudentBuilder): Promise<StudentEntity> {
    return this.repository.persist(builder.build());
  }
}
```

## 📁 File & Folder Organization

### Directory Structure Rules

```
apps/server/src/
├── index.ts              # 🎯 Server entry point only
├── lib/                  # 🔧 Shared utilities
│   ├── context.ts        # ORPC context creation
│   ├── orpc.ts          # ORPC setup & configuration
│   ├── validation.ts    # Zod schemas
│   └── utils.ts         # Helper functions
└── routers/             # 📡 API route handlers
    ├── index.ts         # Router exports & combination
    ├── auth.ts          # Authentication routes
    ├── students.ts      # Student management
    ├── teachers.ts      # Teacher management
    └── attendance.ts    # Attendance tracking
```

### File Naming Conventions

```bash
# Files: kebab-case
user-management.ts
check-in-history.ts
academic-year.ts

# Folders: kebab-case
user-management/
api-routes/
shared-types/

# Components/Classes: PascalCase (in code)
UserService
StudentValidator
AttendanceChecker
```

## 🏗️ TypeScript Best Practices

### Type Definitions

```typescript
// ✅ Explicit interface definitions
interface CreateStudentInput {
  readonly studentId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber?: string;
}

// ✅ Use Zod for runtime validation
import { z } from 'zod';

const CreateStudentSchema = z.object({
  studentId: z.string().min(1).max(20),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
});

type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
```

### Import/Export Conventions

```typescript
// ✅ Organized imports
// 1. External packages
import { z } from 'zod';
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

// 2. Internal modules (using path aliases)
import { createContext } from '@/lib/context';
import { publicProcedure } from '@/lib/orpc';

// 3. Types (separate group)
import type { Context } from '@/lib/context';
import type { Student } from '@prisma/client';

// ✅ Named exports preferred
export const studentRouter = {
  create: publicProcedure
    .input(CreateStudentSchema)
    .output(z.object({ id: z.string() }))
    .handler(async ({ input, ctx }) => {
      // Implementation
    }),
};

// ✅ Default export only when necessary
export default studentRouter;
```

### Type Safety Guidelines

```typescript
// ✅ Use const assertions for literal types
const USER_ROLES = ['admin', 'teacher', 'student'] as const;
type UserRole = typeof USER_ROLES[number];

// ✅ Strict function parameters
function getStudentById(id: string): Promise<Student | null> {
  if (!id.trim()) {
    throw new Error('Student ID cannot be empty');
  }
  return prisma.student.findUnique({ where: { id } });
}

// ✅ Discriminated unions for state management
type LoadingState = 
  | { status: 'loading' }
  | { status: 'success'; data: Student[] }
  | { status: 'error'; error: string };

// ❌ Avoid: any type
function processData(data: any) {
  return data.someProperty; // Type safety lost
}

// ✅ Use generics or proper typing
function processData<T extends { id: string }>(data: T): T {
  return { ...data, id: data.id.toUpperCase() };
}
```

## 🚀 ORPC Pattern Guidelines

### Procedure Definition

```typescript
// ✅ Consistent procedure structure
export const studentProcedures = {
  // GET operations
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(StudentSchema.optional())
    .handler(async ({ input, ctx }) => {
      const student = await ctx.prisma.student.findUnique({
        where: { id: input.id },
        include: { 
          enrollments: true,
          checkIns: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      return student;
    }),

  // POST operations  
  create: publicProcedure
    .input(CreateStudentSchema)
    .output(z.object({ 
      id: z.string(),
      message: z.string()
    }))
    .handler(async ({ input, ctx }) => {
      const student = await ctx.prisma.student.create({
        data: {
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
      
      return {
        id: student.id,
        message: 'Student created successfully'
      };
    }),
};
```

### Input Validation

```typescript
// ✅ Comprehensive Zod schemas
const StudentIdSchema = z.object({
  id: z.string()
    .uuid('Invalid student ID format')
    .describe('Unique identifier for the student')
});

const CreateStudentSchema = z.object({
  studentId: z.string()
    .min(1, 'Student ID is required')
    .max(20, 'Student ID too long')
    .regex(/^[A-Z0-9-]+$/, 'Student ID must contain only uppercase letters, numbers, and hyphens'),
  
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name too long')
    .transform(name => name.trim()),
    
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name too long')
    .transform(name => name.trim()),
    
  email: z.string()
    .email('Invalid email format')
    .transform(email => email.toLowerCase()),
    
  phoneNumber: z.string()
    .regex(/^[0-9-+\s()]+$/, 'Invalid phone number format')
    .optional(),
    
  dateOfBirth: z.coerce.date()
    .max(new Date(), 'Birth date cannot be in the future')
    .optional(),
});
```

### Error Handling

```typescript
// ✅ Consistent error handling
import { ORPCError } from '@orpc/server';

export const studentProcedures = {
  delete: publicProcedure
    .input(StudentIdSchema)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, ctx }) => {
      try {
        // Check if student exists
        const student = await ctx.prisma.student.findUnique({
          where: { id: input.id }
        });
        
        if (!student) {
          throw new ORPCError({
            code: 'NOT_FOUND',
            message: `Student with ID ${input.id} not found`
          });
        }
        
        // Check for dependencies
        const hasEnrollments = await ctx.prisma.enrollment.count({
          where: { studentId: input.id }
        });
        
        if (hasEnrollments > 0) {
          throw new ORPCError({
            code: 'CONFLICT',
            message: 'Cannot delete student with active enrollments'
          });
        }
        
        await ctx.prisma.student.delete({
          where: { id: input.id }
        });
        
        return { success: true };
        
      } catch (error) {
        if (error instanceof ORPCError) {
          throw error;
        }
        
        // Log unexpected errors
        console.error('Unexpected error deleting student:', error);
        
        throw new ORPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete student'
        });
      }
    }),
};
```

## 🗄️ Database & Prisma Guidelines

### Query Optimization

```typescript
// ✅ Efficient queries with proper includes
async function getStudentWithDetails(id: string) {
  return await prisma.student.findUnique({
    where: { id },
    include: {
      // Only include what you need
      enrollments: {
        include: {
          course: {
            select: { id: true, name: true, code: true }
          }
        }
      },
      // Limit large relations
      checkIns: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          checkInTime: true,
          status: true
        }
      }
    }
  });
}

// ✅ Use transactions for related operations
async function createStudentWithEnrollment(studentData: CreateStudentInput, courseId: string) {
  return await prisma.$transaction(async (tx) => {
    const student = await tx.student.create({
      data: studentData
    });
    
    const enrollment = await tx.enrollment.create({
      data: {
        studentId: student.id,
        courseId,
        enrolledAt: new Date()
      }
    });
    
    return { student, enrollment };
  });
}

// ❌ Avoid: N+1 queries
async function getAllStudentsWithCourses() {
  const students = await prisma.student.findMany();
  
  // This creates N+1 queries!
  for (const student of students) {
    student.courses = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: { course: true }
    });
  }
  
  return students;
}

// ✅ Use proper includes instead
async function getAllStudentsWithCourses() {
  return await prisma.student.findMany({
    include: {
      enrollments: {
        include: {
          course: true
        }
      }
    }
  });
}
```

### Model Conventions

```typescript
// ✅ Consistent field naming in Prisma schema
model Student {
  id            String   @id @default(uuid()) @db.Uuid
  studentId     String   @unique @map("student_id") @db.VarChar(20)
  firstName     String   @map("first_name") @db.VarChar(100)
  lastName      String   @map("last_name") @db.VarChar(100)
  email         String   @unique @db.VarChar(255)
  phoneNumber   String?  @map("phone_number") @db.VarChar(20)
  
  // Audit fields
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt     DateTime? @map("deleted_at") @db.Timestamptz
  
  // Relations
  enrollments   Enrollment[]
  checkIns      CheckIn[]
  
  @@map("students")
}
```

## 🔒 Security Best Practices

### Input Sanitization

```typescript
// ✅ Always validate and sanitize inputs
import { z } from 'zod';

const sanitizeString = (str: string) => str.trim().replace(/[<>]/g, '');

const CreateStudentSchema = z.object({
  firstName: z.string()
    .min(1)
    .max(100)
    .transform(sanitizeString),
  lastName: z.string()
    .min(1)
    .max(100)
    .transform(sanitizeString),
  email: z.string()
    .email()
    .transform(email => email.toLowerCase().trim()),
});
```

### Authentication & Authorization

```typescript
// ✅ Context-based authentication (TODO: Implement middleware)
// Note: Current implementation uses publicProcedure with manual auth checks
export const authenticatedProcedure = publicProcedure
  .use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new ORPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }
    
    return next({
      ctx: {
        ...ctx,
        user: ctx.session.user
      }
    });
  });

// ✅ Role-based authorization (TODO: Implement middleware)
export const teacherProcedure = authenticatedProcedure
  .use(async ({ ctx, next }) => {
    if (ctx.user.role !== 'teacher' && ctx.user.role !== 'admin') {
      throw new ORPCError({
        code: 'FORBIDDEN',
        message: 'Teacher access required'
      });
    }
    
    return next({ ctx });
  });
```

### Environment Variables

```typescript
// ✅ Validate environment variables
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

export const env = envSchema.parse(process.env);

// ❌ Never hardcode secrets
const JWT_SECRET = 'hardcoded-secret'; // Don't do this!

// ✅ Use environment variables
const JWT_SECRET = env.JWT_SECRET;
```

## 🧪 Testing Guidelines

### Unit Testing

```typescript
// ✅ Test business logic
import { describe, test, expect } from 'bun:test';
import { calculateStudentGPA } from '@/lib/academic';

describe('Academic Calculations', () => {
  test('should calculate correct GPA', () => {
    const grades = [
      { credits: 3, gradePoint: 4.0 },
      { credits: 3, gradePoint: 3.5 },
      { credits: 2, gradePoint: 3.0 },
    ];
    
    const gpa = calculateStudentGPA(grades);
    expect(gpa).toBeCloseTo(3.625, 2);
  });
  
  test('should handle empty grades array', () => {
    const gpa = calculateStudentGPA([]);
    expect(gpa).toBe(0);
  });
});
```

### Integration Testing

```typescript
// ✅ Test API endpoints
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { app } from '@/index';

describe('Student API', () => {
  beforeEach(async () => {
    // Setup test database
    await setupTestDatabase();
  });
  
  afterEach(async () => {
    // Clean up
    await cleanupTestDatabase();
  });
  
  test('should create student successfully', async () => {
    const response = await app.request('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'TEST001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      })
    });
    
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
  });
});
```

## 📊 Performance Guidelines

### Database Performance

```typescript
// ✅ Use database-level operations
// Instead of fetching all and filtering in JavaScript
const activeStudents = await prisma.student.findMany({
  where: {
    deletedAt: null,
    enrollments: {
      some: {
        course: {
          status: 'active'
        }
      }
    }
  }
});

// ✅ Use pagination
const getStudentsPage = async (page: number, limit: number = 20) => {
  const offset = (page - 1) * limit;
  
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.student.count()
  ]);
  
  return {
    students,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};
```

### Memory Management

```typescript
// ✅ Stream large datasets
async function* getStudentsStream() {
  let lastId = '';
  const batchSize = 100;
  
  while (true) {
    const students = await prisma.student.findMany({
      take: batchSize,
      cursor: lastId ? { id: lastId } : undefined,
      skip: lastId ? 1 : 0,
      orderBy: { id: 'asc' }
    });
    
    if (students.length === 0) break;
    
    for (const student of students) {
      yield student;
    }
    
    lastId = students[students.length - 1].id;
  }
}

// Usage
for await (const student of getStudentsStream()) {
  // Process each student without loading all into memory
  await processStudent(student);
}
```

## 📝 Documentation Standards

### JSDoc Comments

```typescript
/**
 * Creates a new student in the system
 * 
 * @param input - Student creation data
 * @param input.studentId - Unique student identifier (e.g., "ST2024001")
 * @param input.firstName - Student's first name
 * @param input.lastName - Student's last name
 * @param input.email - Student's email address (must be unique)
 * @param input.phoneNumber - Optional phone number
 * 
 * @returns Promise resolving to the created student's ID and success message
 * 
 * @throws {ORPCError} When student ID already exists (CONFLICT)
 * @throws {ORPCError} When email already exists (CONFLICT)
 * @throws {ORPCError} When validation fails (BAD_REQUEST)
 * 
 * @example
 * ```typescript
 * const result = await createStudent({
 *   studentId: 'ST2024001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@school.ac.th'
 * });
 * console.log(result.id); // "uuid-string"
 * ```
 */
async function createStudent(input: CreateStudentInput): Promise<CreateStudentOutput> {
  // Implementation
}
```

### README Documentation

```markdown
# ✅ Each module should have clear README
## Student Management Module

### Purpose
Handles all student-related operations including creation, updates, enrollment tracking, and academic records.

### Key Features
- Student registration and profile management
- Academic enrollment tracking
- Attendance monitoring
- Grade and GPA calculations

### Usage Examples
\`\`\`typescript
import { studentRouter } from '@/routers/students';

// Create new student
const student = await studentRouter.create({
  studentId: 'ST2024001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@school.ac.th'
});
\`\`\`
```

## 🔧 Development Workflow

### Commit Message Convention

```bash
# Format: <type>(<scope>): <description>
# Types: feat, fix, docs, style, refactor, test, chore

# ✅ Good examples
feat(students): add student creation endpoint
fix(auth): resolve JWT token validation issue
docs(api): update student endpoint documentation
refactor(database): optimize student queries
test(students): add unit tests for student validation
chore(deps): update Prisma to v6.8.2

# ❌ Avoid
fix: bug fix
update: changed some code
student stuff
```

### Pull Request Guidelines

```markdown
## PR Template

### Description
Brief description of changes made.

### Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

### Checklist
- [ ] Code follows project coding standards
- [ ] Self-review completed
- [ ] Documentation updated (if needed)
- [ ] Database migrations created (if needed)
```

### Code Review Checklist

```markdown
## Review Checklist

### Functionality
- [ ] Code solves the intended problem
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

### Code Quality
- [ ] Code is readable and well-structured
- [ ] Functions are single-purpose
- [ ] Naming is clear and consistent
- [ ] No hardcoded values or magic numbers

### Security
- [ ] Input validation is implemented
- [ ] No sensitive data in logs
- [ ] Authentication/authorization is correct

### Performance
- [ ] Database queries are efficient
- [ ] No unnecessary API calls
- [ ] Memory usage is reasonable

### Testing
- [ ] Tests cover main functionality
- [ ] Tests cover error cases
- [ ] Tests are maintainable
```

## 🚨 Common Anti-Patterns to Avoid

### Database Anti-Patterns

```typescript
// ❌ N+1 Query Problem
const students = await prisma.student.findMany();
for (const student of students) {
  student.courses = await prisma.enrollment.findMany({
    where: { studentId: student.id }
  });
}

// ✅ Use includes/select
const students = await prisma.student.findMany({
  include: { enrollments: { include: { course: true } } }
});

// ❌ Loading too much data
const student = await prisma.student.findUnique({
  where: { id },
  include: {
    enrollments: {
      include: {
        course: {
          include: {
            assignments: {
              include: {
                submissions: true
              }
            }
          }
        }
      }
    }
  }
});

// ✅ Only load what you need
const student = await prisma.student.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
    enrollments: {
      select: {
        course: {
          select: { id: true, name: true, code: true }
        }
      }
    }
  }
});
```

### TypeScript Anti-Patterns

```typescript
// ❌ Using any
function processData(data: any) {
  return data.someProperty;
}

// ✅ Proper typing
interface ProcessableData {
  someProperty: string;
}

function processData(data: ProcessableData): string {
  return data.someProperty;
}

// ❌ Ignoring null/undefined
function getStudentName(student: Student) {
  return student.firstName + ' ' + student.lastName;
}

// ✅ Handle null/undefined
function getStudentName(student: Student | null): string {
  if (!student) return 'Unknown';
  return `${student.firstName} ${student.lastName}`;
}
```

---

*Last Updated: January 2025 | Version: 1.0.0*

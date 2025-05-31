# Frontend PRD - MSL School Management System

## 🎯 Executive Summary

### Product Overview
ระบบจัดการโรงเรียนอาชีวศึกษา MSL School Frontend Application ที่ใช้เทคโนโลยีล่าสุด เพื่อรองรับการทำงานของผู้ใช้ 4 กลุ่ม: Admin, Teacher, Student และ Parent

### Technology Stack (Latest Versions)
- **Framework**: Next.js 15 (App Router)
- **UI Library**: Material-UI (MUI) latest
- **State Management**: Zustand latest
- **Data Fetching**: TanStack Query latest
- **Language**: TypeScript 5.4+
- **Styling**: Emotion & MUI System

### Product Goals
1. สร้าง Modern Web Application ที่ responsive และ accessible
2. รองรับ Multi-role interface ที่ user-friendly
3. Performance optimization ด้วย latest technologies
4. Type-safe development พร้อม scalable architecture
5. Server Components และ React Server Actions สำหรับ performance
6. Optimistic Updates ด้วย TanStack Query

## 👥 Target Users & Personas

### Admin Users
- **Goals**: จัดการระบบโดยรวม, ควบคุมผู้ใช้, ดูรายงานสรุป
- **Features**: Dashboard analytics, User management, System settings

### Teachers
- **Goals**: จัดการคอร์ส, ติดตามนักเรียน, ประเมินผล
- **Features**: Course management, Student tracking, Grade management

### Students
- **Goals**: เข้าถึงการเรียน, ติดตามผลการเรียน, สื่อสารกับครู
- **Features**: Course enrollment, Progress tracking, Communication

### Parents
- **Goals**: ติดตามผลลูก, สื่อสารกับโรงเรียน
- **Features**: Student progress view, School communication

## 🏗️ Technical Architecture

### Frontend Architecture Pattern
```
├── 📱 Presentation Layer (React Server Components)
├── 🔄 State Management (Zustand + TanStack Query)
├── 🌐 API Integration (ORPC Client)
├── 🎨 Design System (Material-UI + Custom Theme)
└── ⚡ Performance (Next.js App Router + Server Actions)
```

### Core Dependencies
```json
{
  "next": "15.0.0",
  "@mui/material": "latest",
  "@mui/icons-material": "latest",
  "@mui/x-data-grid": "latest",
  "zustand": "latest",
  "@tanstack/react-query": "latest",
  "typescript": "5.4",
  "@emotion/react": "latest",
  "@emotion/styled": "latest"
}
```

### App Router Structure (Next.js 15)
```
app/
├── layout.tsx                # Root layout with providers
├── page.tsx                 # Landing page
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── admin/               # Admin-only pages
│   ├── teacher/             # Teacher pages
│   ├── student/             # Student pages
│   └── parent/              # Parent pages
├── api/                     # API routes (if needed)
└── _components/             # Shared components
```

## 🎨 UI/UX Design System

### Material-UI Theme Configuration
```typescript
const theme = createTheme({
  // New color system with CSS variables
  cssVarPrefix: 'msl',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
        secondary: {
          main: '#dc004e',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#90caf9',
          light: '#e3f2fd',
          dark: '#42a5f5',
        },
        secondary: {
          main: '#f48fb1',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans Thai", sans-serif',
    h1: { 
      fontSize: 'clamp(2rem, 8vw, 2.5rem)',
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h2: { 
      fontSize: 'clamp(1.5rem, 6vw, 2rem)',
      fontWeight: 600 
    },
    body1: { 
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em'
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          '&:focus-visible': {
            outline: '2px solid var(--msl-palette-primary-main)',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'var(--msl-shadow-2)',
        },
      },
    },
  },
});
```

### Responsive Design Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Accessibility Features
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast mode support
- Focus visible indicators
- Reduced motion support

## 🔄 State Management Strategy

### Zustand Store Architecture
```typescript
// Auth Store
interface AuthStore {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// UI Store
interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Data Stores (per feature)
interface CourseStore {
  courses: Course[];
  selectedCourse: Course | null;
  loading: boolean;
  // ... actions
}
```

### TanStack Query Integration
```typescript
// Query Keys Factory
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  courses: ['courses'] as const,
  course: (id: string) => ['courses', id] as const,
};

// Custom Hooks with Suspense
export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userApi.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    suspense: true,
  });
};

// Optimistic Updates
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUserData) => userApi.update(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.user(newData.id) });
      const previousData = queryClient.getQueryData(queryKeys.user(newData.id));
      
      queryClient.setQueryData(queryKeys.user(newData.id), newData);
      
      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(
        queryKeys.user(newData.id),
        context?.previousData
      );
    },
    onSettled: (newData) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user(newData.id) });
    },
  });
};
```

## 🧩 Component Architecture

### Component Hierarchy
```
📦 components/
├── 🌐 layout/
│   ├── AppLayout.tsx
│   ├── Sidebar.tsx
│   └── Navbar.tsx
├── 🔧 common/
│   ├── DataTable.tsx
│   ├── FormFields.tsx
│   └── LoadingSpinner.tsx
├── 🏫 features/
│   ├── auth/
│   ├── dashboard/
│   ├── courses/
│   ├── users/
│   └── reports/
└── 🎨 ui/
    ├── Button.tsx
    ├── Card.tsx
    └── Modal.tsx
```

### Component Patterns
1. **Server Components**: ใช้ React Server Components สำหรับ static content
2. **Client Components**: ใช้ "use client" เฉพาะ components ที่ต้องการ interactivity
3. **Suspense Boundaries**: จัดการ loading states ด้วย Suspense
4. **Error Boundaries**: จัดการ error states อย่างเหมาะสม

## 📊 Feature Specifications

### 1. Authentication & Authorization
- **Login/Logout**: JWT-based authentication
- **Role-based routing**: Dynamic menu based on user role
- **Session management**: Auto-refresh tokens
- **Password reset**: Email-based password recovery

### 2. Dashboard (Role-specific)
- **Admin Dashboard**: System analytics, user stats, revenue reports
- **Teacher Dashboard**: Class overview, student progress, assignments
- **Student Dashboard**: Course progress, upcoming assignments, grades
- **Parent Dashboard**: Child's progress, school communications

### 3. User Management (Admin only)
- **CRUD Operations**: Create, read, update, delete users
- **Bulk Operations**: Import users via CSV, bulk status updates
- **Role Assignment**: Assign/change user roles
- **Activity Logs**: Track user activities

### 4. Course Management
- **Course Creation**: Rich text editor, media uploads
- **Enrollment**: Student-teacher assignment
- **Progress Tracking**: Real-time progress updates
- **Grade Management**: Automated calculations

### 5. Communication System
- **Messaging**: Real-time chat between users
- **Notifications**: Push notifications for important events

## 🚀 Performance Optimization

### Server-side Optimization
- **Server Components**: ใช้ RSC เพื่อลด JavaScript bundle
- **Server Actions**: ใช้ form actions แทน client-side handlers
- **Edge Runtime**: Deploy critical functions to edge
- **Streaming**: ใช้ Suspense สำหรับ progressive loading

### Client-side Optimization
- **Code Splitting**: ใช้ dynamic imports สำหรับ heavy components
- **Image Optimization**: ใช้ next/image พร้อม priority loading
- **Font Optimization**: ใช้ next/font สำหรับ web fonts
- **Bundle Analysis**: ติดตาม bundle size ด้วย @next/bundle-analyzer

### Data Fetching Strategy
- **Parallel Routes**: โหลด data พร้อมกันหลาย routes
- **Infinite Loading**: ใช้ TanStack Query สำหรับ infinite scroll
- **Optimistic Updates**: อัปเดต UI ทันทีก่อน server response
- **Background Revalidation**: อัปเดต stale data ใน background

## 🔒 Security & Authentication

### Security Measures
```typescript
// 1. Route Protection
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: UserRole[]
) {
  return function AuthComponent(props: P) {
    const { user } = useAuthStore();
    
    if (!user || !allowedRoles.includes(user.role)) {
      redirect('/unauthorized');
    }
    
    return <WrappedComponent {...props} />;
  };
}

// 2. API Security
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Input Validation
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Data Protection
- **CSP Headers**: Content Security Policy implementation
- **HTTPS Only**: Force secure connections
- **Input Sanitization**: XSS protection
- **CSRF Protection**: Cross-site request forgery prevention

## 🧪 Testing Strategy

### Testing Pyramid
```typescript
// 1. Unit Tests (Jest + Testing Library)
describe('LoginForm', () => {
  it('should validate email format', () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});

// 2. Integration Tests
describe('Course Management', () => {
  it('should create and list courses', async () => {
    // Test API integration
  });
});

// 3. E2E Tests (Playwright)
test('admin can manage users', async ({ page }) => {
  await page.goto('/admin/users');
  await page.click('[data-testid="add-user-button"]');
  // ... test flow
});
```

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright**: End-to-end testing

## 🚀 Development Guidelines

### Code Standards
```typescript
// 1. File Naming Convention
// Components: PascalCase (UserProfile.tsx)
// Hooks: camelCase with 'use' prefix (useAuth.ts)
// Utilities: camelCase (formatDate.ts)
// Constants: SCREAMING_SNAKE_CASE (API_ENDPOINTS.ts)

// 2. Component Structure
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const UserForm: React.FC<Props> = ({ title, onSubmit }) => {
  // Hooks
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery(...);
  
  // Event handlers
  const handleSubmit = useCallback(() => {
    // Implementation
  }, []);
  
  // Early returns
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <UnauthorizedMessage />;
  
  // Main render
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
};
```

### TypeScript Guidelines
```typescript
// 1. Strict Type Definitions
interface User {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

// 2. API Response Types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// 3. Component Props Types
interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
}
```

## 🌐 Deployment & Build

### Build Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['api.msl-school.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_ENV=development
```

### Deployment Pipeline
1. **Development**: Local development with hot reload
2. **Staging**: Preview deployments on Vercel
3. **Production**: Optimized build with CDN
4. **Monitoring**: Error tracking with Sentry

## 📅 Development Timeline

### Phase 1: Foundation (4 weeks)
- Week 1-2: Project setup, authentication system
- Week 3-4: Basic layout, routing, state management

### Phase 2: Core Features (8 weeks)
- Week 5-6: User management (Admin)
- Week 7-8: Dashboard implementations
- Week 9-10: Course management
- Week 11-12: Communication system

### Phase 3: Advanced Features (6 weeks)
- Week 13-14: Reporting and analytics
- Week 15-16: File management system
- Week 17-18: Advanced UI/UX improvements

### Phase 4: Testing & Deployment (6 weeks)
- Week 19-20: Comprehensive testing
- Week 21-22: Performance optimization
- Week 23-24: Production deployment, monitoring

## 🔧 Implementation Strategy

### Development Workflow
1. **Component-First Development**: Build reusable components first
2. **Feature Branches**: Each feature in separate branch
3. **Code Reviews**: Mandatory peer reviews
4. **Continuous Integration**: Automated testing and deployment

### API Integration Pattern
```typescript
// API Client Setup
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../../../server/src/routers';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
      headers() {
        return {
          authorization: `Bearer ${getAuthToken()}`,
        };
      },
    };
  },
});

// Usage in Components
export const UserList = () => {
  const { data: users, isLoading } = trpc.users.getAll.useQuery();
  const deleteUser = trpc.users.delete.useMutation();
  
  if (isLoading) return <CircularProgress />;
  
  return (
    <DataGrid
      rows={users || []}
      columns={columns}
      onRowClick={(params) => router.push(`/users/${params.id}`)}
    />
  );
};
```

## 📋 Backend PRD - MSL School Management System

## 🎯 Executive Summary

### Product Overview
ระบบจัดการโรงเรียนอาชีวศึกษา MSL School Backend API ที่ใช้เทคโนโลยีล่าสุด เพื่อรองรับการทำงานของ Frontend และ Mobile Applications พร้อมประสิทธิภาพสูงและความปลอดภัย

### Technology Stack (Latest Versions)
- **Runtime**: Bun 1.2.15 (Fast JavaScript/TypeScript runtime)
- **Framework**: Hono 4.7.10 (Lightweight web framework)
- **RPC**: ORPC 1.3.0 (Type-safe RPC layer)
- **Database**: PostgreSQL + Prisma 6.8.2
- **Validation**: Zod (Runtime type validation)
- **Authentication**: Session-based + JWT tokens

### Product Goals
1. สร้าง High-performance API ด้วย Bun runtime
2. รองรับ Type-safe communication ผ่าน ORPC
3. Scalable architecture สำหรับ educational institution
4. Comprehensive security และ audit logging

## 🏗️ System Architecture

### Backend Architecture Pattern
```
┌─────────────────────────────────────┐
│           Client Layer              │
│  ┌─────────────┐ ┌─────────────┐    │
│  │  Frontend   │ │ Mobile App  │    │
│  │(Next.js)    │ │(React Nat.)│    │
│  └─────────────┘ └─────────────┘    │
└─────────────────┬───────────────────┘
                  │ HTTP/ORPC
┌─────────────────▼───────────────────┐
│         API Gateway Layer           │
│  ┌─────────────────────────────────┐ │
│  │         Hono Server             │ │
│  │   ┌─────────────────────────┐   │ │
│  │   │    CORS Middleware      │   │ │
│  │   │    Logger Middleware    │   │ │
│  │   │    Auth Middleware      │   │ │
│  │   └─────────────────────────┘   │ │
│  └─────────────────────────────────┘ │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│        Business Logic Layer         │
│  ┌─────────────────────────────────┐ │
│  │         ORPC Router             │ │
│  │   ┌─────────────────────────┐   │ │
│  │   │    Auth Procedures      │   │ │
│  │   │    User Procedures      │   │ │
│  │   │    School Procedures    │   │ │
│  │   │    Academic Procedures  │   │ │
│  │   └─────────────────────────┘   │ │
│  └─────────────────────────────────┘ │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Data Access Layer           │
│  ┌─────────────────────────────────┐ │
│  │         Prisma ORM              │ │
│  │   ┌─────────────────────────┐   │ │
│  │   │    Query Builder        │   │ │
│  │   │    Type Generation      │   │ │
│  │   │    Connection Pool      │   │ │
│  │   └─────────────────────────┘   │ │
│  └─────────────────────────────────┘ │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│          Database Layer             │
│  ┌─────────────────────────────────┐ │
│  │        PostgreSQL               │ │
│  │   ┌─────────────────────────┐   │ │
│  │   │    UUID Extension       │   │ │
│  │   │    Audit Logging        │   │ │
│  │   │    Connection Pool      │   │ │
│  │   └─────────────────────────┘   │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Core Dependencies
```json
{
  "runtime": "bun@1.2.15",
  "framework": "hono@4.7.10", 
  "rpc": "@orpc/server@1.3.0",
  "database": "prisma@6.8.2",
  "validation": "zod@latest",
  "cors": "@hono/cors",
  "compression": "@hono/compression"
}
```

## 🔧 API Architecture & Design

### ORPC Procedure Structure
```typescript
// Type-safe RPC Pattern
export const authRouter = router({
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string()
    }))
    .output(z.object({
      user: UserSchema,
      session: SessionSchema
    }))
    .handler(async ({ input, ctx }) => {
      // Implementation
    }),
    
  me: protectedProcedure
    .output(UserSchema)
    .handler(async ({ ctx }) => {
      return ctx.user;
    })
});
```

### API Endpoint Categories

#### 🔐 Authentication & Authorization
```typescript
// auth.* procedures
- auth.login          // User authentication
- auth.logout         // End user session  
- auth.me            // Get current user
- auth.refresh       // Refresh tokens
- auth.forgotPassword // Password reset request
- auth.resetPassword  // Reset with token
```

#### 👥 User Management
```typescript
// users.* procedures
- users.list          // Paginated users
- users.getById       // User by ID
- users.create        // Create user
- users.update        // Update user
- users.delete        // Soft delete
- users.restore       // Restore deleted
- users.changePassword // Change password
- users.updateProfile  // Update profile
```

#### 🏫 Academic Management
```typescript
// departments.*, programs.*, courses.* procedures
- departments.list/create/update/delete
- programs.list/create/update/delete  
- courses.list/create/update/delete
- classrooms.list/create/update/delete
- schedules.list/create/update/delete
```

#### 📚 Student Management
```typescript
// students.* procedures
- students.list       // Students with filters
- students.getById    // Student details
- students.create     // Register student
- students.update     // Update info
- students.delete     // Remove student
- students.enroll     // Course enrollment
- students.attendance // Attendance tracking
```

## 📊 Database Schema Design

### Core Entities Overview
```prisma
// User Management (4 tables)
model User {
  id       String @id @default(uuid())
  username String @unique
  password String
  role     Role   @default(User)
  // ... 25+ fields
}

model Account {
  // Extended user profile
}

model Session {
  // Authentication sessions
}

model UserRole {
  // Role-based permissions
}

// Academic Structure (8 tables)
model Department {
  // Academic departments
}

model Program {
  // Educational programs (ปวช./ปวส.)
}

model Level {
  // Academic levels
}

model Classroom {
  // Physical/Virtual classrooms
}

model Course {
  // Individual courses
}

model Schedule {
  // Class scheduling
}

model Term {
  // Academic terms/semesters
}

model Grade {
  // Student grades
}

// Student Management (6 tables)
model Student {
  // Student profiles
}

model Teacher {
  // Teacher profiles  
}

model Parent {
  // Parent/Guardian info
}

model StudentParent {
  // Student-Parent relationships
}

model Attendance {
  // Attendance tracking
}

model VisitStudent {
  // Home visits tracking
}

// System & Audit (7 tables)
model AuditLog {
  // System audit trail
}

model News {
  // School announcements
}

model Holiday {
  // School calendar
}

model Verification {
  // Email/SMS verification
}

model ReportCheckIn {
  // Check-in reports
}

model ActivityCheckInReport {
  // Activity reports
}

model BadnessIndividual/GoodnessIndividual {
  // Behavior tracking
}
```

### Database Features
- **UUID Primary Keys**: ใช้ UUID แทน auto-increment
- **Soft Deletes**: เก็บข้อมูลที่ลบไว้สำหรับ audit
- **Audit Logging**: บันทึกการเปลี่ยนแปลงทั้งหมด
- **Optimistic Locking**: `updatedAt` สำหรับ concurrency control
- **Indexing Strategy**: Optimized สำหรับ query patterns

## 🔒 Security & Authentication

### Authentication Strategy
```typescript
// Session-based Authentication
interface AuthContext {
  user?: User;
  session?: Session;
  permissions: Permission[];
}

// JWT Token Management
interface TokenPair {
  accessToken: string;   // 15 minutes
  refreshToken: string;  // 7 days
}
```

### Authorization Levels
```typescript
enum Role {
  ADMIN    = "Admin"     // Full system access
  TEACHER  = "Teacher"   // Course & student management
  STUDENT  = "Student"   // Limited read access
  PARENT   = "Parent"    // Child progress only
  USER     = "User"      // Basic access
}

// Role-based Permissions
interface RolePermission {
  role: Role;
  resource: string;      // "users", "courses", etc.
  actions: Action[];     // ["read", "write", "delete"]
}
```

### Security Features
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Per-IP และ per-user limits
- **CORS Configuration**: Restricted origins
- **Input Validation**: Zod schemas สำหรับทุก input
- **SQL Injection Protection**: Prisma ORM parameter binding
- **XSS Protection**: Content sanitization
- **Audit Logging**: ทุก sensitive operations

## ⚡ Performance Requirements

### Core Performance Targets
```typescript
// Response Time Targets
const PERFORMANCE_TARGETS = {
  healthCheck: "< 10ms",
  authentication: "< 100ms", 
  simpleQueries: "< 200ms",
  complexQueries: "< 500ms",
  bulkOperations: "< 2000ms"
};

// Throughput Targets
const THROUGHPUT_TARGETS = {
  concurrentUsers: 1000,
  requestsPerSecond: 500,
  databaseConnections: 50,
  memoryUsage: "< 512MB"
};
```

### Optimization Strategies
```typescript
// Database Optimization
- Connection pooling (Prisma)
- Query optimization with indexes
- Eager/lazy loading strategies
- Database query caching

// Runtime Optimization  
- Bun's native performance benefits
- V8 JavaScript engine optimizations
- Memory-efficient data structures
- Streaming responses สำหรับ large datasets

// Caching Strategy
- Redis for session storage
- Database query result caching
- Static asset caching
- CDN integration ready
```

### Monitoring & Metrics
```typescript
// Key Metrics to Track
interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  databaseConnections: number;
}

// Health Check Endpoint
app.get("/health", (c) => ({
  status: "OK",
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  memory: process.memoryUsage(),
  version: process.env.npm_package_version
}));
```

## 🚀 Scalability Plan

### Horizontal Scaling
```yaml
# Docker Deployment Strategy
services:
  api:
    replicas: 3              # Load balanced instances
    resources:
      memory: 512MB
      cpu: 0.5 cores
  
  database:
    replicas: 1              # Primary + Read replicas
    resources:
      memory: 2GB
      cpu: 1 core
  
  redis:
    replicas: 1              # Session storage
    resources:
      memory: 256MB
      cpu: 0.25 cores
```

### Vertical Scaling Options
- **Memory**: 512MB → 2GB สำหรับ high-load periods
- **CPU**: 0.5 → 2 cores สำหรับ computational tasks
- **Database**: Connection pool scaling (10 → 100 connections)
- **Storage**: SSD optimization สำหรับ database performance

### Load Balancing Strategy
```typescript
// API Gateway Configuration
const loadBalancer = {
  algorithm: "round-robin",
  healthCheck: "/health",
  failover: "automatic",
  maxRetries: 3,
  timeout: 30000
};
```

## 🔧 Development Guidelines

### Code Organization
```typescript
// Project Structure
apps/server/
├── src/
│   ├── index.ts           // Main server entry
│   ├── lib/               // Shared utilities
│   │   ├── context.ts     // Request context
│   │   ├── orpc.ts        // ORPC setup
│   │   └── auth.ts        // Authentication
│   └── routers/           // API endpoints
│       ├── auth.ts        // Auth procedures
│       ├── users.ts       // User management
│       ├── academic.ts    // Academic procedures
│       └── index.ts       // Router exports
├── prisma/
│   ├── schema/            // Database schema
│   ├── generated/         // Prisma client
│   └── seed.ts           // Database seeding
└── docs/                  // API documentation
```

### Development Workflow
```typescript
// Development Scripts
{
  "dev": "bun --hot src/index.ts",          // Hot reload
  "build": "tsc && tsc-alias",              // TypeScript compilation
  "start": "bun src/index.ts",              // Production start
  "db:migrate": "bunx prisma migrate dev",  // Database migration
  "db:generate": "bunx prisma generate",    // Client generation
  "db:seed": "bun prisma/seed.ts",         // Database seeding
  "check-types": "tsc --noEmit",           // Type checking
  "lint": "biome check src",               // Code linting
  "format": "biome format --write src"     // Code formatting
}
```

### Code Quality Standards
```typescript
// TypeScript Configuration
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext", 
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  }
}

// Biome Configuration (Linting & Formatting)
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

## 🧪 Testing Strategy

### Testing Architecture
```typescript
// Test Structure
tests/
├── unit/                  // Unit tests
│   ├── auth.test.ts      // Authentication logic
│   ├── users.test.ts     // User procedures
│   └── utils.test.ts     // Utility functions
├── integration/           // Integration tests
│   ├── api.test.ts       // API endpoint tests
│   └── database.test.ts  // Database operations
└── e2e/                  // End-to-end tests
    └── workflows.test.ts // Complete user workflows
```

### Testing Tools & Framework
```typescript
// Testing Dependencies
{
  "testFramework": "bun:test",        // Built-in Bun test runner
  "mocking": "bun:test/mock",         // Bun mocking utilities
  "database": "prisma-test-utils",   // Database testing
  "coverage": "bun:test --coverage"  // Code coverage
}

// Test Configuration
{
  "test": {
    "timeout": 10000,
    "concurrent": true,
    "coverage": {
      "threshold": 80,
      "include": ["src/**/*.ts"],
      "exclude": ["src/**/*.test.ts"]
    }
  }
}
```

### Test Implementation Examples
```typescript
// Unit Test Example
import { test, expect } from "bun:test";
import { authRouter } from "../src/routers/auth";

test("auth.login - valid credentials", async () => {
  const result = await authRouter.login({
    input: { username: "test", password: "password" },
    ctx: mockContext
  });
  
  expect(result.user.username).toBe("test");
  expect(result.session).toBeDefined();
});

// Integration Test Example
test("API /rpc/auth.login", async () => {
  const response = await fetch("http://localhost:3000/rpc/auth.login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "test", password: "password" })
  });
  
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.result.user).toBeDefined();
});
```

## 📦 Deployment Strategy

### Production Deployment
```dockerfile
# Multi-stage Docker Build
FROM oven/bun:1.2.15-alpine AS dependencies
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:1.2.15-alpine AS build  
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN bun run build

FROM oven/bun:1.2.15-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["bun", "start"]
```

### Environment Configuration
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=msl_school
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
```

### CI/CD Pipeline
```yaml
# GitHub Actions Workflow
name: Deploy Backend API
on:
  push:
    branches: [main]
    paths: ['apps/server/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run check-types
      - run: bun test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          docker build -t msl-school-api .
          docker push ${{ secrets.REGISTRY_URL }}/msl-school-api
          # Deploy to cloud provider
```

## 📈 Project Timeline

### Phase 1: Foundation (Weeks 1-4) ✅
- [x] Project setup และ monorepo structure
- [x] Database schema design และ Prisma setup
- [x] Basic ORPC server setup
- [x] Authentication foundation

### Phase 2: Core API Development (Weeks 5-12)
- [ ] User management procedures
- [ ] Academic management APIs
- [ ] Student management system
- [ ] Teacher management features
- [ ] Parent portal APIs
- [ ] Basic security implementation

### Phase 3: Advanced Features (Weeks 13-20)
- [ ] Attendance tracking system
- [ ] Grade management
- [ ] Behavior tracking (Goodness/Badness)
- [ ] Home visit management
- [ ] Reporting system
- [ ] Advanced security features

### Phase 4: Integration & Testing (Weeks 21-24)
- [ ] Frontend-Backend integration
- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment
- [ ] Documentation finalization

### Milestone Dependencies
```typescript
// Critical Path Dependencies
const dependencies = {
  "Database Schema": "Foundation for all APIs",
  "Authentication": "Required for protected endpoints", 
  "User Management": "Foundation for role-based features",
  "Academic Structure": "Required for student/teacher features",
  "API Testing": "Required before frontend integration",
  "Security Audit": "Required before production"
};
```

## 🔗 Integration Points

### Frontend Integration
```typescript
// ORPC Client Integration
import { createORPCClient } from "@orpc/client";
import type { AppRouter } from "../server/src/routers";

const client = createORPCClient<AppRouter>({
  baseURL: "http://localhost:3000/rpc",
  headers: {
    "Content-Type": "application/json"
  }
});

// Type-safe API calls
const user = await client.auth.me();
const students = await client.students.list({ page: 1, limit: 10 });
```

### Mobile App Integration
```typescript
// React Native / Expo Integration
import { client } from "./api-client";

// Same type-safe client works across platforms
const authenticateUser = async (credentials: LoginInput) => {
  try {
    const result = await client.auth.login(credentials);
    await SecureStore.setItemAsync("session", result.session.token);
    return result.user;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};
```

### External Services Integration
```typescript
// Third-party Services Ready
interface ExternalIntegrations {
  emailService: "SendGrid | AWS SES";
  smsService: "Twilio | AWS SNS"; 
  fileStorage: "AWS S3 | Google Cloud Storage";
  monitoring: "DataDog | New Relic";
  analytics: "Google Analytics | Mixpanel";
}
```

---

## 📋 Development Checklist

### Backend Development Priority
- [ ] Complete user authentication system
- [ ] Implement role-based authorization
- [ ] Build academic management APIs
- [ ] Create student management system
- [ ] Add comprehensive error handling
- [ ] Implement audit logging
- [ ] Add API rate limiting
- [ ] Create comprehensive test suite
- [ ] Optimize database queries
- [ ] Add monitoring and health checks

### Integration Readiness
- [ ] ORPC client types exported
- [ ] API documentation updated
- [ ] Frontend integration guides
- [ ] Mobile app integration examples
- [ ] Error handling standards
- [ ] Security best practices documented

## 🚨 Error Handling Strategy

### Global Error Handling
```typescript
// Global Error Handler
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number = 500,
    public data?: any
  ) {
    super(message);
  }
}

// Error Handler HOC
export const withErrorHandler = (Component: React.ComponentType) => {
  return function ErrorBoundary(props: any) {
    const [error, setError] = useState<Error | null>(null);
    
    if (error) {
      return (
        <ErrorDisplay
          error={error}
          onRetry={() => setError(null)}
        />
      );
    }
    
    return <Component {...props} />;
  };
};

// API Error Handling
export const apiErrorHandler = (error: unknown) => {
  if (error instanceof AppError) {
    toast.error(error.message);
    if (error.status === 401) {
      router.push('/login');
    }
  } else {
    console.error(error);
    toast.error('An unexpected error occurred');
  }
};
```

### Error Types & Responses
```typescript
// Error Types
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// Error Response Format
interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: Record<string, string[]>;
  timestamp: string;
  requestId: string;
}

// Error Handling in Components
const UserProfile = () => {
  const { data, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser(),
    onError: (error) => {
      if (error instanceof NotFoundError) {
        router.push('/404');
      } else {
        apiErrorHandler(error);
      }
    }
  });
};
```

## 📊 Monitoring & Analytics

### Application Performance Monitoring
```typescript
// APM Configuration
export const apm = {
  // Datadog RUM configuration
  datadogRum: {
    applicationId: process.env.NEXT_PUBLIC_DD_APP_ID,
    clientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN,
    site: 'datadoghq.com',
    service: 'msl-school-frontend',
    env: process.env.NEXT_PUBLIC_ENV,
    version: process.env.NEXT_PUBLIC_VERSION,
    trackInteractions: true,
    defaultPrivacyLevel: 'mask-user-input'
  },
  
  // Error tracking with Sentry
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENV,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  }
};

// Performance Monitoring
export const withPerformanceMonitoring = (Component: React.ComponentType) => {
  return function PerformanceWrapper(props: any) {
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const duration = performance.now() - startTime;
        apm.trackMetric('component_render_time', {
          component: Component.name,
          duration
        });
      };
    }, []);
    
    return <Component {...props} />;
  };
};
```

### User Analytics
```typescript
// Analytics Events
export const analyticsEvents = {
  pageView: (page: string) => ({
    event: 'page_view',
    page_title: page
  }),
  
  userAction: (action: string, data?: any) => ({
    event: 'user_action',
    action_type: action,
    ...data
  }),
  
  error: (error: Error) => ({
    event: 'error',
    error_type: error.name,
    error_message: error.message
  })
};

// Analytics Provider
export const AnalyticsProvider: React.FC = ({ children }) => {
  useEffect(() => {
    // Initialize analytics
    initializeAnalytics();
    
    // Track route changes
    router.events.on('routeChangeComplete', (url) => {
      trackPageView(url);
    });
  }, []);
  
  return children;
};
```

## 🌐 Internationalization (i18n)

### Multi-language Support
```typescript
// i18n Configuration
export const i18nConfig = {
  defaultLocale: 'th',
  locales: ['th', 'en'],
  localeDetection: true
};

// Translation Keys
export const translations = {
  th: {
    common: {
      welcome: 'ยินดีต้อนรับ',
      login: 'เข้าสู่ระบบ',
      logout: 'ออกจากระบบ'
    },
    validation: {
      required: 'กรุณากรอกข้อมูล',
      email: 'กรุณากรอกอีเมลให้ถูกต้อง'
    }
  },
  en: {
    common: {
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout'
    },
    validation: {
      required: 'This field is required',
      email: 'Please enter a valid email'
    }
  }
};

// Date/Time Formatting
export const dateTimeFormatters = {
  shortDate: new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }),
  
  longDate: new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  }),
  
  time: new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  })
};
```

## ♿ Accessibility (a11y)

### ARIA Integration
```typescript
// Accessible Components
export const AccessibleButton = styled(Button)`
  &:focus-visible {
    outline: 2px solid var(--msl-palette-primary-main);
    outline-offset: 2px;
  }
  
  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Focus Management
export const useFocusTrap = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  }, [ref]);
};
```

## 📱 Progressive Web App (PWA)

### Service Worker
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('SW registered: ', registration);
      },
      (error) => {
        console.log('SW registration failed: ', error);
      }
    );
  });
}

// Offline Support
const offlineData = {
  fallbackPage: '/offline',
  staticAssets: [
    '/images/logo.png',
    '/fonts/Roboto.woff2',
    '/styles/main.css'
  ]
};

// Push Notifications
export const initializePushNotifications = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  });
  
  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription)
  });
};
```

## 🔍 SEO & Social Media

### Meta Tags Configuration
```typescript
// Default Meta Tags
export const defaultMeta = {
  title: 'MSL School Management System',
  description: 'ระบบจัดการโรงเรียนอาชีวศึกษาที่ทันสมัย',
  keywords: 'โรงเรียน, อาชีวศึกษา, การศึกษา, ระบบจัดการ',
  ogImage: 'https://msl-school.com/og-image.jpg',
  twitterCard: 'summary_large_image'
};

// Dynamic Meta Tags
export const generateMetaTags = (page: string, data?: any) => {
  return {
    title: `${page} | MSL School`,
    description: data?.description || defaultMeta.description,
    openGraph: {
      title: `${page} | MSL School`,
      description: data?.description || defaultMeta.description,
      images: [
        {
          url: data?.image || defaultMeta.ogImage,
          width: 1200,
          height: 630,
          alt: page
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page} | MSL School`,
      description: data?.description || defaultMeta.description,
      image: data?.image || defaultMeta.ogImage
    }
  };
};

// Structured Data
export const generateStructuredData = (type: string, data: any) => {
  switch (type) {
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'MSL School',
        description: defaultMeta.description,
        url: 'https://msl-school.com',
        logo: 'https://msl-school.com/logo.png'
      };
    case 'Course':
      return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: data.title,
        description: data.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'MSL School'
        }
      };
    default:
      return null;
  }
};
```

## 💾 Data Migration & Backup

### Data Migration Strategy
```typescript
// Migration Types
interface MigrationContext {
  sourceDb: Database;
  targetDb: Database;
  logger: Logger;
  batch: {
    size: number;
    current: number;
  };
}

// Migration Utilities
export const migrationUtils = {
  // Batch Processing
  async processBatch<T>(
    items: T[],
    processor: (item: T) => Promise<void>,
    batchSize = 100
  ) {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await Promise.all(batch.map(processor));
    }
  },
  
  // Data Validation
  validateData: (data: any, schema: ZodSchema) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new ValidationError(result.error);
    }
    return result.data;
  },
  
  // Error Recovery
  async withRecovery<T>(
    operation: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error('Operation failed, attempting recovery:', error);
      return await fallback();
    }
  }
};

// Backup Procedures
export const backupProcedures = {
  // Database Backup
  async createDatabaseBackup() {
    const timestamp = new Date().toISOString();
    const filename = `backup-${timestamp}.sql`;
    
    await executeCommand(`pg_dump ${process.env.DATABASE_URL} > ${filename}`);
    await uploadToStorage('backups', filename);
    
    return {
      filename,
      timestamp,
      size: await getFileSize(filename)
    };
  },
  
  // File Storage Backup
  async backupFileStorage() {
    const files = await listFiles();
    const backupPromises = files.map(async (file) => {
      const backup = await createFileBackup(file);
      return {
        original: file,
        backup,
        timestamp: new Date()
      };
    });
    
    return Promise.all(backupPromises);
  }
};
```

## 🔌 Third-party Integrations

### Payment Integration
```typescript
// Payment Provider Setup
export const paymentProviders = {
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_KEY,
    async createPaymentIntent(amount: number, currency: string) {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        body: JSON.stringify({ amount, currency })
      });
      return response.json();
    }
  },
  
  promptpay: {
    async generateQR(amount: number) {
      const response = await fetch('/api/payments/promptpay-qr', {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
      return response.json();
    }
  }
};

// Email Service
export const emailService = {
  provider: 'SendGrid',
  async sendEmail(options: EmailOptions) {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      body: JSON.stringify(options)
    });
    return response.json();
  },
  
  templates: {
    welcome: 'template_welcome',
    resetPassword: 'template_reset_password',
    courseEnrollment: 'template_course_enrollment'
  }
};

// File Storage
export const storageService = {
  provider: 'AWS S3',
  async uploadFile(file: File, path: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    const response = await fetch('/api/storage/upload', {
      method: 'POST',
      body: formData
    });
    return response.json();
  },
  
  getSignedUrl(path: string) {
    return fetch(`/api/storage/signed-url?path=${path}`).then(r => r.json());
  }
};

// Analytics Integration
export const analyticsService = {
  provider: 'Google Analytics',
  trackEvent(category: string, action: string, label?: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  }
};
```
# Frontend PRD - MSL School Management System

## 🎯 Executive Summary

### Product Overview
ระบบจัดการโรงเรียนอาชีวศึกษา MSL School Frontend Application ที่ใช้เทคโนโลยีล่าสุด เพื่อรองรับการทำงานของผู้ใช้ 4 กลุ่ม: Admin, Teacher, Student และ Parent

### Technology Stack (Latest Versions)
- **Framework**: Next.js 15.3.3
- **UI Library**: Material-UI 7.1.0
- **State Management**: Zustand 5.0.5
- **Data Fetching**: TanStack Query 5.79.0
- **Language**: TypeScript 5.3+
- **Styling**: Emotion 11.14.0

### Product Goals
1. สร้าง Modern Web Application ที่ responsive และ accessible
2. รองรับ Multi-role interface ที่ user-friendly
3. Performance optimization ด้วย latest technologies
4. Type-safe development พร้อม scalable architecture

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
├── 📱 Presentation Layer (React Components)
├── 🔄 State Management (Zustand + TanStack Query)
├── 🌐 API Integration (ORPC Client)
├── 🎨 Design System (Material-UI + Custom Theme)
└── ⚡ Performance (Next.js App Router + Optimizations)
```

### Core Dependencies
```json
{
  "next": "15.3.3",
  "@mui/material": "7.1.0",
  "@mui/icons-material": "7.1.0",
  "@mui/x-data-grid": "7.x",
  "zustand": "5.0.5",
  "@tanstack/react-query": "5.79.0",
  "typescript": "5.3+",
  "@emotion/react": "11.14.0",
  "@emotion/styled": "11.14.0"
}
```

### App Router Structure (Next.js 15)
```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx               # Landing page
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── admin/             # Admin-only pages
│   ├── teacher/           # Teacher pages
│   ├── student/           # Student pages
│   └── parent/            # Parent pages
└── api/                   # API routes (if needed)
```

## 🎨 UI/UX Design System

### Material-UI 7.1.0 Theme Configuration
```typescript
const theme = createTheme({
  palette: {
    mode: 'light', // Dynamic theme switching
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
  typography: {
    fontFamily: '"Roboto", "Noto Sans Thai", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
  theme: 'light' | 'dark';
  notifications: Notification[];
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
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

// Custom Hooks
export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userApi.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
1. **Compound Components**: สำหรับ complex UI components
2. **Render Props**: สำหรับ data sharing logic
3. **Custom Hooks**: สำหรับ business logic reuse
4. **Higher-Order Components**: สำหรับ authentication guards

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
- **Announcements**: School-wide announcements
- **Parent Communications**: Direct teacher-parent messaging

## ⚡ Performance Requirements

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Performance Optimization
```typescript
// Next.js 15 Optimizations
// 1. App Router with Streaming
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}

// 2. Dynamic Imports
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <LoadingSkeleton />,
});

// 3. Image Optimization
import Image from 'next/image';

// 4. TanStack Query Caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

### Bundle Optimization
- **Code Splitting**: Route-based and component-based
- **Tree Shaking**: Remove unused Material-UI components
- **Asset Optimization**: WebP images, font optimization
- **Lazy Loading**: Components and routes

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
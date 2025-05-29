# MSL School 🎓

ระบบ API สำหรับจัดการโรงเรียนอาชีวศึกษาในประเทศไทย พัฒนาด้วย Modern TypeScript Stack

## 🚀 Technology Stack

### Core Technologies
- **Runtime**: [Bun](https://bun.sh/) v1.2+ - Fast JavaScript runtime & package manager
- **Framework**: [Hono](https://hono.dev/) - Ultra-fast web framework for edge
- **RPC**: [oRPC](https://orpc.io/) - End-to-end type-safe RPC with Zod validation
- **Database**: PostgreSQL 14+ with uuid-ossp extension
- **ORM**: [Prisma](https://www.prisma.io/) with Accelerate extension
- **Language**: TypeScript 5.8+ with strict mode & ESM

### Development Tools
- **Package Manager**: Bun (faster than npm/yarn)
- **Monorepo**: [Turborepo](https://turbo.build/) - High-performance build system
- **Code Quality**: [Biome](https://biomejs.dev/) - Fast linter & formatter (Rust-based)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) + lint-staged for pre-commit quality
- **Type Safety**: Zod for runtime validation + TypeScript for compile-time safety
- **Schema**: Prisma with ESM generation and PostgreSQL extensions

### Performance Features
- **Hot Reload**: Instant development feedback with Bun's `--hot` flag
- **Type Generation**: Compile-time type checking across frontend-backend
- **Connection Pooling**: Prisma Accelerate for database performance
- **Fast Builds**: Turborepo caching + Bun's native bundler

## 🎯 Features

### Academic Management
- ✅ **Multi-role System** - Admin, Teacher, Student, Parent
- ✅ **Academic Structure** - Department, Program, Classroom management
- ✅ **Schedule Management** - Class timetables and room assignments
- ✅ **Grade Management** - Student assessments and GPA calculation

### Student Tracking
- ✅ **Attendance System** - Flag ceremony and activity check-ins
- ✅ **Behavior Assessment** - Good and bad behavior tracking
- ✅ **Home Visits** - Parent engagement with photo documentation
- ✅ **Progress Reports** - Comprehensive student progress tracking

### Communication
- ✅ **News & Announcements** - Role-based content distribution
- ✅ **Holiday Management** - Academic calendar with recurring events
- ✅ **Audit Logging** - Complete activity tracking for security

### Technical Features
- ✅ **Type-safe APIs** - End-to-end TypeScript safety with oRPC
- ✅ **Session Management** - Secure authentication system
- ✅ **Database Migrations** - Automated schema management
- ✅ **Real-time Updates** - Modern API architecture

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
- Bun v1.2+ (JavaScript runtime)
- PostgreSQL 14+ (Database)
- Git (Version control)
```

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-org/msl-school-api.git
cd msl-school-api

# 2. Install dependencies
bun install

# 3. Setup environment variables
cp apps/server/.env.example apps/server/.env
# Edit apps/server/.env with your database credentials

# 4. Setup database
bun db:migrate
bun db:seed  # Optional: Add sample data

# 5. Start development server
bun dev
```

### Environment Setup
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/msl_school_db"

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"

# Authentication
SESSION_SECRET="your-session-secret-key"
```



## 📁 Project Structure

```
msl-school-api/
├── .github/
│   ├── copilot-instructions.md   # AI Coding Guidelines
│   └── task-list/                # Task management
├── .husky/                       # Git hooks (pre-commit, etc.)
├── apps/
│   └── server/                   # Backend API Application
│       ├── docs/                 # API Documentation
│       │   ├── API.md           # API Reference
│       │   ├── DATABASE.md      # Database Schema
│       │   └── MIGRATION_GUIDE.md # Migration Instructions
│       ├── prisma/              # Database Management
│       │   ├── generated/       # Generated Prisma Client
│       │   ├── schema/          # Database Schema Definition
│       │   ├── index.ts         # Database Connection
│       │   └── seed.ts          # Database Seeding
│       ├── src/                 # Source Code
│       │   ├── lib/             # Shared Utilities
│       │   │   ├── context.ts   # ORPC Context
│       │   │   └── orpc.ts      # ORPC Setup
│       │   ├── routers/         # API Routes
│       │   │   └── index.ts     # Route Definitions
│       │   └── index.ts         # Server Entry Point
│       ├── package.json         # Server Dependencies
│       └── tsconfig.json        # TypeScript Configuration
├── packages/                    # Shared Libraries (Future)
├── biome.json                   # Code Quality Configuration
├── turbo.json                   # Monorepo Build Configuration
├── package.json                 # Root Dependencies & Scripts
└── README.md                    # Project Documentation
```

## 🚀 Available Scripts

### Root Level Commands
- `bun dev`: Start development server with hot reload
- `bun build`: Build all applications for production
- `bun check-types`: TypeScript type checking across all apps

### Server Specific Commands
- `bun dev:server`: Start only the backend server
- `bun db:push`: Push schema changes to database
- `bun db:migrate`: Run database migrations
- `bun db:seed`: Seed database with sample data
- `bun db:studio`: Open Prisma Studio (Database GUI)
- `bun db:generate`: Generate Prisma client

### Development Tools
- `bun prepare`: Setup git hooks via Husky
- `turbo dev`: Alternative development mode via Turborepo
- `biome check`: Lint and format code

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

## Docker Development Setup

This project includes a Docker setup for development to ensure a consistent environment.

### Prerequisites

- Docker Desktop installed on your machine.

### Running the Application with Docker Compose

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd msl-school-api
    ```

2.  **Environment Variables:**
    Create a `.env` file in the `apps/server/` directory by copying the example:
    ```bash
    cp apps/server/.env.example apps/server/.env
    ```
    Update the `.env` file with your specific configurations, especially `DATABASE_URL` and `CORS_ORIGIN`.

3.  **Build and Run:**
    From the root of the project, run:
    ```bash
    docker-compose up --build
    ```
    This command will:
    - Build the Docker image for the `server` application if it doesn't exist or if `Dockerfile` has changed.
    - Start the `server` container.
    - The server will be accessible at `http://localhost:3000` by default.

4.  **Accessing Prisma Studio (if applicable and configured):**
    If you need to access Prisma Studio, ensure your `DATABASE_URL` is correctly set up and accessible from the Docker container. You might need to run Prisma commands directly inside the container or expose the database port if it's also running in Docker.

    To run commands inside the running `server` container:
    ```bash
    docker-compose exec server bun <your-command>
    # Example:
    docker-compose exec server bun prisma studio
    ```

5.  **Stopping the Application:**
    To stop the containers, press `Ctrl+C` in the terminal where `docker-compose up` is running, or run:
    ```bash
    docker-compose down
    ```

### Directory Structure for Docker

-   `apps/server/Dockerfile`: Defines the image for the Bun server application.
-   `docker-compose.yml`: Orchestrates the services, including the server and potentially a database.

### Notes

-   The `apps/server` directory is mounted as a volume, so changes to your code will be reflected live in the container (thanks to `bun run --hot`).
-   The `packages` directory is also mounted to ensure shared libraries are available and updated.
-   Ensure your `DATABASE_URL` in `apps/server/.env` points to a database accessible from within the Docker network. If you're running a database service via `docker-compose` (like the commented-out `db` service in `docker-compose.yml`), you'd typically use the service name (e.g., `db`) as the host in your `DATABASE_URL`.

# 🛠️ Setup Guide - MSL School

คู่มือการติดตั้งและเซ็ตอัพ MSL School สำหรับระบบจัดการสถาบันการศึกษาไทย

## 📋 System Requirements

### Prerequisites (ข้อกำหนดเบื้องต้น)

```bash
# Required Software
✅ Bun v1.2+ (JavaScript Runtime & Package Manager)
✅ PostgreSQL 14+ (Database with uuid-ossp extension)
✅ Git (Version Control)
✅ Node.js 18+ (Optional: for compatibility tools)

# Operating System
✅ macOS, Linux, or Windows (WSL2 recommended for Windows)
✅ 4GB+ RAM (recommended 8GB+)
✅ 5GB+ free disk space
```

## 🚀 Quick Installation

### Step 1: Install Bun Runtime

```bash
# macOS/Linux - Install via curl
curl -fsSL https://bun.sh/install | bash

# Windows - Install via PowerShell
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version  # Should show v1.2+
```

### Step 2: Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14

# Create database
psql postgres -c "CREATE DATABASE msl_school_dev;"
psql postgres -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql-14 postgresql-contrib-14

# Enable uuid-ossp extension
sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
sudo -u postgres createdb msl_school_dev
```

**Windows (using WSL2):**
```bash
# Follow Ubuntu instructions in WSL2
```

### Step 3: Clone & Setup Project

```bash
# 1. Clone repository
git clone https://github.com/your-org/msl-school-api.git
cd msl-school-api

# 2. Install all dependencies
bun install

# 3. Setup environment variables
cp apps/server/.env.example apps/server/.env

# 4. Edit environment file
# ใช้ editor ที่ชอบ (nano, vim, code, etc.)
nano apps/server/.env
```

### Step 4: Configure Environment Variables

**Required Configuration (`apps/server/.env`):**

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/msl_school_dev"
DIRECT_URL="postgresql://username:password@localhost:5432/msl_school_dev"

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"

# Security (generate using: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-here"
SESSION_SECRET="your-session-secret-here"

# Optional: Prisma Accelerate (for production)
# ACCELERATE_URL="prisma://accelerate.prisma-data.net/?api_key=your-key"
```

### Step 5: Initialize Database

```bash
# Generate Prisma client
bun db:generate

# Push schema to database
bun db:push

# Seed with sample data (optional)
bun db:seed
```

### Step 6: Start Development Server

```bash
# Start in development mode
bun dev

# Or start only the server
bun dev:server

# Server should be running on:
# 🚀 Server: http://localhost:3000
# 📊 Health: http://localhost:3000/health
```

## 🔧 Detailed Setup Instructions

### Database Setup Options

#### Option 1: Local PostgreSQL

```bash
# Create user and database
sudo -u postgres psql << EOF
CREATE USER msl_user WITH PASSWORD 'secure_password';
CREATE DATABASE msl_school_dev OWNER msl_user;
GRANT ALL PRIVILEGES ON DATABASE msl_school_dev TO msl_user;
\q
EOF

# Enable required extensions
psql -U msl_user -d msl_school_dev << EOF
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EOF
```

#### Option 2: Docker PostgreSQL

```bash
# Using Docker Compose
cat > docker-compose.dev.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:14
    container_name: msl-postgres
    environment:
      POSTGRES_DB: msl_school_dev
      POSTGRES_USER: msl_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-extensions.sql:/docker-entrypoint-initdb.d/init-extensions.sql

volumes:
  postgres_data:
EOF

# Start PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# Check connection
psql "postgresql://msl_user:secure_password@localhost:5432/msl_school_dev" -c "\l"
```

#### Option 3: Cloud Database (Supabase/Railway/Neon)

```bash
# Get connection string from your cloud provider
# Example for Supabase:
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Example for Railway:
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/railway"

# Example for Neon:
DATABASE_URL="postgresql://[user]:[password]@[endpoint]/[database]"
```

### Development Environment Setup

#### VS Code Setup (Recommended)

```bash
# Install recommended extensions
code --install-extension biomejs.biome
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension Prisma.prisma

# Setup workspace settings
mkdir -p .vscode
cat > .vscode/settings.json << EOF
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "typescript.preferences.useAliasesForRenames": false,
  "typescript.suggest.autoImports": true
}
EOF
```

#### Git Hooks Setup

```bash
# Install Husky hooks (auto-setup during bun install)
bun prepare

# Verify hooks are working
ls -la .husky/_/
cat .husky/pre-commit

# Test pre-commit hook
git add .
git commit -m "test: verify pre-commit hook"
```

## 🏗️ Project Structure & Scripts

### Available Scripts Overview

```bash
# Root Level (Monorepo Management)
bun dev              # Start all development servers
bun build            # Build all applications
bun check-types      # TypeScript checking across all apps

# Database Management
bun db:push          # Push schema changes (development)
bun db:migrate       # Create & run migrations (production)
bun db:seed          # Add sample data
bun db:studio        # Open Prisma Studio (GUI)
bun db:generate      # Generate Prisma client
bun db:reset         # Reset database (⚠️ DELETE ALL DATA)

# Server Specific
bun dev:server       # Start only backend server
cd apps/server && bun dev  # Alternative method

# Code Quality
biome check          # Lint & format code
biome check --write  # Auto-fix issues
bun check-types      # TypeScript type checking
```

### Folder Structure Explanation

```
msl-school-api/
├── apps/
│   └── server/              # 🎯 Main API Server
│       ├── src/             # Source code
│       │   ├── index.ts     # Server entry point
│       │   ├── lib/         # Shared utilities
│       │   └── routers/     # API route definitions
│       ├── prisma/          # Database schema & migrations
│       │   ├── schema/      # Prisma schema files
│       │   ├── migrations/  # Database migrations
│       │   └── seed.ts      # Sample data generator
│       ├── docs/            # API documentation
│       └── scripts/         # Database utility scripts
├── packages/                # 📦 Shared libraries (future)
├── .github/                 # GitHub workflows & docs
├── biome.json              # Code quality configuration
├── turbo.json              # Monorepo build configuration
└── package.json            # Root dependencies & scripts
```

## 🧪 Testing Your Setup

### Basic Health Check

```bash
# 1. Check server is running
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2024-XX-XXTXX:XX:XX.XXXZ"}

# 2. Check database connection
bun db:studio  # Should open Prisma Studio

# 3. Test API endpoint (placeholder)
curl http://localhost:3000/api/health
```

### Verify Database Setup

```bash
# Connect to database directly
psql "${DATABASE_URL}" -c "\dt"

# Should show tables like:
# - User
# - Student
# - Teacher
# - CheckIn
# - etc.

# Check sample data (if seeded)
psql "${DATABASE_URL}" -c "SELECT COUNT(*) FROM \"User\";"
```

### Run Development Tests

```bash
# Type checking
bun check-types

# Database operations
bun db:generate
bun db:push

# Code quality
biome check

# All checks should pass ✅
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Issue 1: Bun installation fails

```bash
# Solution 1: Manual install
wget https://github.com/oven-sh/bun/releases/latest/download/bun-linux-x64.zip
unzip bun-linux-x64.zip
sudo mv bun-linux-x64/bun /usr/local/bin/

# Solution 2: Use npm (temporary)
npm install -g bun

# Solution 3: Check system requirements
uname -a  # Verify OS compatibility
```

#### Issue 2: PostgreSQL connection failed

```bash
# Check PostgreSQL service
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Verify connection
psql "postgresql://username:password@localhost:5432/database_name" -c "\l"

# Common fixes:
# 1. Wrong DATABASE_URL format
# 2. PostgreSQL not running
# 3. Wrong credentials
# 4. Database doesn't exist
```

#### Issue 3: Dependencies installation fails

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install

# Use npm as fallback
npm install

# Check disk space
df -h
```

#### Issue 4: Prisma errors

```bash
# Common Prisma fixes:
bun db:generate  # Regenerate client
rm -rf apps/server/prisma/generated  # Clear generated files
bun db:push  # Re-sync schema

# Database connection issues:
# 1. Check DATABASE_URL format
# 2. Verify database exists
# 3. Check PostgreSQL extensions
```

#### Issue 5: Port already in use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 bun dev
```

### Performance Issues

```bash
# Check system resources
htop  # or top
free -m  # Memory usage
df -h   # Disk usage

# Bun-specific optimizations
export BUN_RUNTIME_TRANSPOSE_STDERR=1
export BUN_JSC_forceRAMSize=1073741824  # 1GB

# Database optimizations
# Increase PostgreSQL connections in postgresql.conf:
# max_connections = 100
# shared_buffers = 256MB
```

## 🌐 Environment-Specific Setup

### Development Environment

```bash
# .env.development
NODE_ENV=development
DATABASE_URL="postgresql://user:pass@localhost:5432/msl_school_dev"
LOG_LEVEL=debug
ENABLE_CORS=true
```

### Staging Environment

```bash
# .env.staging
NODE_ENV=staging
DATABASE_URL="postgresql://user:pass@staging-db:5432/msl_school_staging"
LOG_LEVEL=info
ENABLE_CORS=false
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
DATABASE_URL="${DATABASE_URL}"  # From hosting provider
LOG_LEVEL=warn
ENABLE_CORS=false
JWT_SECRET="${JWT_SECRET}"  # Strong random secret
SESSION_SECRET="${SESSION_SECRET}"
```

## 📚 Next Steps

After successful setup, you can:

1. **Read API Documentation**: `apps/server/docs/API.md`
2. **Understand Database Schema**: `apps/server/docs/DATABASE.md`
3. **Learn Migration Process**: `apps/server/docs/MIGRATION_GUIDE.md`
4. **Study Architecture**: `apps/server/docs/ARCHITECTURE.md`
5. **Start Development**: Create your first API endpoint

## 🆘 Need Help?

- 📖 **Documentation**: Check `docs/` folder for detailed guides
- 🐛 **Issues**: Create issue on GitHub repository
- 💬 **Questions**: Contact development team
- 🔍 **Debugging**: Enable debug logs with `LOG_LEVEL=debug`

---

*Updated: January 2025 | Version: 1.0.0*

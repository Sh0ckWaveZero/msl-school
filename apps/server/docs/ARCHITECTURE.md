# System Architecture - MSL School

## 🏗️ ภาพรวมสถาปัตยกรรม

MSL School ใช้ Modern TypeScript Stack สำหรับประสิทธิภาพสูงและความปลอดภัย รองรับการทำงานของสถาบันการศึกษาอาชีวศึกษาในประเทศไทย

## 🔧 Technology Stack

### Core Runtime & Framework
```
┌─────────────────┐
│   Bun Runtime   │  ← Fast JavaScript/TypeScript runtime
└─────────────────┘
         │
┌─────────────────┐
│  Hono Framework │  ← Lightweight web framework
└─────────────────┘
         │
┌─────────────────┐
│  ORPC Server    │  ← Type-safe RPC layer
└─────────────────┘
```

### Database Layer
```
┌─────────────────┐
│   PostgreSQL    │  ← Primary database with UUID extension
└─────────────────┘
         │
┌─────────────────┐
│   Prisma ORM    │  ← Type-safe database access
└─────────────────┘
         │
┌─────────────────┐
│ Accelerate Ext  │  ← Performance optimization
└─────────────────┘
```

### Development Tools
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   TypeScript    │    │     Biome       │    │    Husky        │
│  (Type Safety)  │    │ (Lint/Format)   │    │  (Git Hooks)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Zod        │    │   Turborepo     │    │  lint-staged    │
│  (Validation)   │    │   (Monorepo)    │    │ (Pre-commit)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌐 System Architecture Diagram

```
                    ┌─────────────────────────────────────┐
                    │           Client Layer              │
                    │  ┌─────────────┐ ┌─────────────┐    │
                    │  │  Web App    │ │ Mobile App  │    │
                    │  │(React/Next) │ │(React Nat.)│    │
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
                    │  │   │    Content Procedures   │   │ │
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
                    │  │         PostgreSQL              │ │
                    │  │   ┌─────────────────────────┐   │ │
                    │  │   │    User Management      │   │ │
                    │  │   │    Academic Structure   │   │ │
                    │  │   │    Student Tracking     │   │ │
                    │  │   │    Content Management   │   │ │
                    │  │   │    Audit Logging        │   │ │
                    │  │   └─────────────────────────┘   │ │
                    │  └─────────────────────────────────┘ │
                    └─────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

### Request Flow
```
1. Client Request
   ↓
2. Hono Middleware (CORS, Logger, Auth)
   ↓
3. ORPC Handler (Type Validation)
   ↓
4. Context Creation (Session, User)
   ↓
5. Business Logic (Procedures)
   ↓
6. Prisma ORM (Query Builder)
   ↓
7. PostgreSQL Database
   ↓
8. Response (Type-safe JSON)
```

### Authentication Flow
```
1. Login Request (username/password)
   ↓
2. User Validation (Database)
   ↓
3. Session Creation (JWT/Session Token)
   ↓
4. Context Injection (User + Permissions)
   ↓
5. Protected Procedure Access
```

## 📁 Code Organization

### Monorepo Structure
```
msl-school-api/
├── apps/
│   └── server/              # Backend API Application
│       ├── src/
│       │   ├── index.ts     # Server entry point
│       │   ├── lib/         # Shared utilities
│       │   │   ├── context.ts   # ORPC context
│       │   │   └── orpc.ts      # ORPC setup
│       │   └── routers/     # Business logic
│       │       └── index.ts     # Route definitions
│       ├── prisma/          # Database layer
│       │   ├── schema/      # Schema definition
│       │   ├── generated/   # Generated types
│       │   ├── index.ts     # DB connection
│       │   └── seed.ts      # Sample data
│       └── docs/            # API documentation
└── packages/               # Shared libraries (future)
```

### Layer Separation
```
┌─────────────────────────────────────────┐
│             Presentation Layer          │
│  • ORPC Procedures                      │
│  • Input/Output Validation              │
│  • Error Handling                       │
└─────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────┐
│              Business Layer             │
│  • User Management                      │
│  • Academic Operations                  │
│  • Content Management                   │
│  • Permission Control                   │
└─────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────┐
│              Data Layer                 │
│  • Prisma Models                        │
│  • Database Queries                     │
│  • Audit Logging                        │
│  • Transaction Management               │
└─────────────────────────────────────────┘
```

## 🛡️ Security Architecture

### Authentication & Authorization
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Login    │───▶│  Session Mgmt   │───▶│  Permission     │
│                 │    │                 │    │   Control       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Password Hash   │    │  JWT/Session    │    │  Role-based     │
│  (bcrypt)       │    │    Tokens       │    │   Access        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Protection
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection**: Prisma ORM with parameterized queries
- **XSS Protection**: Content sanitization
- **CORS**: Configurable origin restrictions
- **Rate Limiting**: To be implemented
- **Audit Logging**: Complete activity tracking

## 🚀 Performance Optimizations

### Runtime Performance
- **Bun Runtime**: 3x faster than Node.js
- **Prisma Accelerate**: Connection pooling + query caching
- **Type Generation**: Compile-time type checking
- **ESM Modules**: Native ES module support

### Database Performance
- **Indexed Queries**: Strategic database indexing
- **Connection Pooling**: Prisma connection management
- **Query Optimization**: Efficient relation loading
- **UUID Primary Keys**: Distributed-friendly identifiers

### Development Performance
- **Hot Reload**: Instant development feedback
- **Type Safety**: Compile-time error detection
- **Code Quality**: Automated linting and formatting
- **Monorepo**: Efficient build caching

## 🌍 Scalability Considerations

### Horizontal Scaling
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │───▶│   API Server 1  │    │   API Server N  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                   │                    │
                              ┌─────────────────────────────┐
                              │      Shared Database        │
                              │       (PostgreSQL)          │
                              └─────────────────────────────┘
```

### Microservices Ready
- **ORPC Procedures**: Easy to extract to separate services
- **Database Models**: Well-defined bounded contexts
- **Type Safety**: Contract-first API design
- **Monitoring**: Built-in logging and metrics

## 🔧 Development Workflow

### Local Development
```bash
1. bun install          # Dependencies
2. bun db:generate      # Prisma client
3. bun db:push          # Schema sync
4. bun db:seed          # Sample data
5. bun dev              # Start server
```

### Production Deployment
```bash
1. bun build            # Build application
2. bun db:migrate       # Apply migrations
3. bun start            # Start production server
```

### Quality Assurance
- **Pre-commit Hooks**: Automated code quality checks
- **Type Checking**: Compile-time validation
- **Linting**: Code style enforcement
- **Testing**: Unit and integration tests (to be implemented)

## 📊 Monitoring & Observability

### Logging Strategy
- **Request/Response Logging**: Hono logger middleware
- **Audit Trail**: Complete user activity tracking
- **Error Logging**: Structured error reporting
- **Performance Metrics**: Response time tracking

### Health Monitoring
- **Health Check Endpoint**: `/rpc/healthCheck`
- **Database Connection**: Prisma health checks
- **Service Metrics**: Performance monitoring
- **Alerting**: Critical error notifications

## 🔮 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket support
- **File Upload**: Media management system
- **Notification System**: Push notifications
- **Reporting System**: Advanced analytics
- **Mobile API**: React Native optimization

### Technical Improvements
- **Caching Layer**: Redis integration
- **Rate Limiting**: Request throttling
- **API Versioning**: Backward compatibility
- **Automated Testing**: Test suite implementation
- **CI/CD Pipeline**: Automated deployment
